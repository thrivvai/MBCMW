import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { BattleQuestion } from "@/lib/types";

// GET /api/rooms/[roomId]/question-set
// Returns questions WITHOUT correct answers (safe for student clients).
// Students see the question text + options but not which is correct.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const db = createServiceClient();

  const { data: room } = await db
    .from("battle_rooms")
    .select("question_set_id, status")
    .eq("id", roomId)
    .single();

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const { data: qs } = await db
    .from("question_sets")
    .select("title, questions")
    .eq("id", room.question_set_id)
    .single();

  if (!qs) {
    return NextResponse.json({ error: "Question set not found" }, { status: 404 });
  }

  // Strip correct answers before sending to students
  const safeQuestions = ((qs.questions as BattleQuestion[]) ?? []).map((q) => ({
    id: q.id,
    text: q.text,
    type: q.type,
    options: q.options,
    hint: q.hint,
    timeLimitSeconds: q.timeLimitSeconds,
    // correct, correctNumeric, acceptableRange intentionally omitted
  }));

  return NextResponse.json({
    title: qs.title,
    questions: safeQuestions,
    totalQuestions: safeQuestions.length,
  });
}
