import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { StartAttemptResponse } from "@/lib/types";

// POST /api/missions/[missionId]/start
// Student starts or resumes a mission attempt.
// Body: { studentId, sessionId }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ missionId: string }> }
) {
  const { missionId } = await params;
  const body = await req.json();
  const { studentId, sessionId } = body as { studentId: string; sessionId: string };

  if (!studentId || !sessionId) {
    return NextResponse.json({ error: "studentId and sessionId required" }, { status: 400 });
  }

  const db = createServiceClient();

  // Check for an existing attempt (session resume).
  const { data: existing } = await db
    .from("mission_attempts")
    .select("id, status")
    .eq("student_id", studentId)
    .eq("mission_id", missionId)
    .single();

  if (existing) {
    // Resume: return existing attempt id + previously saved answers.
    const { data: answers } = await db
      .from("student_answers")
      .select("*")
      .eq("attempt_id", existing.id)
      .order("answered_at");

    const response: StartAttemptResponse = {
      attemptId: existing.id,
      previousAnswers: answers ?? [],
    };
    return NextResponse.json(response);
  }

  // Create new attempt.
  const { data: attempt, error } = await db
    .from("mission_attempts")
    .insert({ student_id: studentId, session_id: sessionId, mission_id: missionId })
    .select("id")
    .single();

  if (error || !attempt) {
    return NextResponse.json({ error: "Failed to start mission" }, { status: 500 });
  }

  const response: StartAttemptResponse = { attemptId: attempt.id, previousAnswers: [] };
  return NextResponse.json(response);
}
