import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getMission } from "@/lib/utils";
import { checkAnswer, scoreAnswer } from "@/lib/scoring/engine";
import type { SubmitAnswerRequest, SubmitAnswerResponse } from "@/lib/types";

// POST /api/missions/[missionId]/answer
// Checkpoints a student's answer to the database.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ missionId: string }> }
) {
  const { missionId } = await params;
  const body = (await req.json()) as SubmitAnswerRequest;
  const { attemptId, questionId, answer, hintUsed, retryCount, timeSpentSeconds } = body;

  if (!attemptId || !questionId || answer === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const mission = await getMission(missionId);
  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  const question = mission.questions.find((q) => q.id === questionId);
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const isCorrect = checkAnswer(question, answer);
  const pointsEarned = scoreAnswer(question, isCorrect, hintUsed, retryCount);

  const db = createServiceClient();

  // Upsert so retries don't create duplicate rows.
  await db.from("student_answers").upsert(
    {
      attempt_id: attemptId,
      question_id: questionId,
      answer,
      is_correct: isCorrect,
      hint_used: hintUsed,
      retry_count: retryCount,
      points_earned: pointsEarned,
      time_spent_seconds: timeSpentSeconds,
    },
    { onConflict: "attempt_id,question_id" }
  );

  // Update running score on the attempt.
  const { data: allAnswers } = await db
    .from("student_answers")
    .select("points_earned")
    .eq("attempt_id", attemptId);

  const totalScore = (allAnswers ?? []).reduce((s: number, r: { points_earned: number | null }) => s + (r.points_earned ?? 0), 0);

  await db
    .from("mission_attempts")
    .update({ score: totalScore })
    .eq("id", attemptId);

  const response: SubmitAnswerResponse = {
    isCorrect,
    pointsEarned,
    explanation: question.explanation,
    totalScore,
  };

  return NextResponse.json(response);
}
