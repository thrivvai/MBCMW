import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { BattleQuestion } from "@/lib/types";

const BASE_POINTS = 1000;
const MAX_TIME_BONUS = 500;

function checkBattleAnswer(question: BattleQuestion, answer: string): boolean {
  if (question.type === "multiple_choice") {
    return answer.trim() === question.correct?.trim();
  }
  if (question.type === "numeric") {
    const num = parseFloat(answer.replace(/[^0-9.-]/g, ""));
    if (isNaN(num)) return false;
    if (question.acceptableRange) {
      return num >= question.acceptableRange[0] && num <= question.acceptableRange[1];
    }
    return Math.abs(num - (question.correctNumeric ?? 0)) < 0.01;
  }
  return false;
}

function computeTimeBonus(timeRemainingMs: number, timeLimitSeconds: number): number {
  const ratio = Math.max(0, Math.min(1, timeRemainingMs / (timeLimitSeconds * 1000)));
  return Math.floor(ratio * MAX_TIME_BONUS);
}

// POST /api/rooms/[roomId]/answers — player submits an answer during a live battle
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const db = createServiceClient();

  const body = await req.json();
  const { playerId, questionIndex, answer, timeRemainingMs } = body as {
    playerId: string;
    questionIndex: number;
    answer: string;
    timeRemainingMs: number;
  };

  if (!playerId || questionIndex === undefined || !answer) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify player belongs to this room
  const { data: player } = await db
    .from("players")
    .select("id, room_id, character_class, ability_used")
    .eq("id", playerId)
    .eq("room_id", roomId)
    .single();

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  // Get room + question set
  const { data: room } = await db
    .from("battle_rooms")
    .select("status, current_question_index, question_started_at, question_set_id")
    .eq("id", roomId)
    .single();

  if (!room || room.status !== "question_open" || room.current_question_index !== questionIndex) {
    return NextResponse.json({ error: "Question is not open" }, { status: 409 });
  }

  // Check for duplicate submission
  const { data: existing } = await db
    .from("question_answers")
    .select("id")
    .eq("player_id", playerId)
    .eq("question_index", questionIndex)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Already answered" }, { status: 409 });
  }

  // Load question
  const { data: qs } = await db
    .from("question_sets")
    .select("questions")
    .eq("id", room.question_set_id)
    .single();

  const questions = (qs?.questions as BattleQuestion[]) ?? [];
  const question = questions[questionIndex];
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  // Get current player score for streak calculation
  const { data: scoreRow } = await db
    .from("player_scores")
    .select("*")
    .eq("player_id", playerId)
    .single();

  const currentStreak = scoreRow?.current_streak ?? 0;
  const abilityUsesRemaining = scoreRow?.ability_uses_remaining ?? 1;

  // Score calculation
  const isCorrect = checkBattleAnswer(question, answer);
  const timeBonus = isCorrect ? computeTimeBonus(timeRemainingMs, question.timeLimitSeconds) : 0;
  const rawScore = isCorrect ? BASE_POINTS + timeBonus : 0;

  // Streak modifier
  const newStreak = isCorrect ? currentStreak + 1 : 0;
  let streakMultiplier = 1.0;
  if (player.character_class === "tactician") {
    if (newStreak >= 2) streakMultiplier = 1.2;
    if (newStreak >= 5) streakMultiplier = 1.5;
  } else {
    if (newStreak >= 3) streakMultiplier = 1.2;
    if (newStreak >= 5) streakMultiplier = 1.5;
  }

  // Class abilities
  let abilityBonus = 0;
  let abilityTriggered: string | null = null;

  if (player.character_class === "scholar") {
    // Scholar: +50 base on every correct answer
    if (isCorrect) {
      abilityBonus = 50;
      abilityTriggered = "scholar_bonus";
    }
  }

  if (player.character_class === "berserker" && isCorrect && newStreak >= 3 && abilityUsesRemaining > 0) {
    // Berserker: Rage Mode — at 3-streak, next question is worth 2x (this is the trigger)
    abilityBonus = rawScore;
    abilityTriggered = "berserker_rage";
    await db.from("player_scores").update({ ability_uses_remaining: 0 }).eq("player_id", playerId);
  }

  const finalScore = Math.round((rawScore + abilityBonus) * streakMultiplier);

  // Record the answer
  await db.from("question_answers").insert({
    room_id: roomId,
    player_id: playerId,
    question_index: questionIndex,
    answer,
    is_correct: isCorrect,
    answered_at: new Date().toISOString(),
    time_remaining_ms: timeRemainingMs,
    raw_score: rawScore,
    ability_bonus: abilityBonus,
    final_score: finalScore,
    ability_triggered: abilityTriggered,
  });

  // Update running score
  const prevTotal = scoreRow?.total_score ?? 0;
  const prevCorrect = scoreRow?.questions_correct ?? 0;
  const prevAnswered = scoreRow?.questions_answered ?? 0;
  const prevMax = scoreRow?.max_streak ?? 0;

  await db.from("player_scores").update({
    total_score: prevTotal + finalScore,
    questions_answered: prevAnswered + 1,
    questions_correct: prevCorrect + (isCorrect ? 1 : 0),
    current_streak: newStreak,
    max_streak: Math.max(prevMax, newStreak),
    updated_at: new Date().toISOString(),
  }).eq("player_id", playerId);

  // Determine what the correct answer is (to show after question closes)
  const correctAnswer =
    question.type === "multiple_choice"
      ? (question.correct ?? "")
      : String(question.correctNumeric ?? "");

  return NextResponse.json({
    isCorrect,
    finalScore,
    abilityTriggered,
    correctAnswer,
    explanation: question.explanation,
  });
}
