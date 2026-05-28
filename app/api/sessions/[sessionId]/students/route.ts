import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { StudentProgressSummary, ClassMetrics } from "@/lib/types";

type AttemptRow = {
  student_id: string;
  mission_id: string;
  status: string;
  score: number | null;
  started_at: string;
  completed_at: string | null;
};

type StudentRow = { id: string; nickname: string };

// GET /api/sessions/[sessionId]/students — teacher fetches live student progress.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await params;
  const db = createServiceClient();

  const { data: sessionCheck } = await db
    .from("sessions")
    .select("id, join_code, grade_band, status")
    .eq("id", sessionId)
    .single();

  if (!sessionCheck) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { data: students } = await db
    .from("student_profiles")
    .select("id, nickname")
    .eq("session_id", sessionId)
    .order("created_at");

  const { data: attempts } = await db
    .from("mission_attempts")
    .select("student_id, mission_id, status, score, started_at, completed_at")
    .eq("session_id", sessionId);

  const { data: sessionMissions } = await db
    .from("session_missions")
    .select("mission_id")
    .eq("session_id", sessionId);

  const totalMissions = (sessionMissions ?? []).length;
  const allAttempts = (attempts ?? []) as AttemptRow[];
  const allStudents = (students ?? []) as StudentRow[];

  const summaries: StudentProgressSummary[] = allStudents.map((s) => {
    const studentAttempts = allAttempts.filter((a) => a.student_id === s.id);
    const completed = studentAttempts.filter((a) => a.status === "completed");
    const inProgress = studentAttempts.find((a) => a.status === "in_progress");
    const totalScore = completed.reduce((sum: number, a: AttemptRow) => sum + (a.score ?? 0), 0);
    const lastActive =
      studentAttempts.length > 0
        ? [...studentAttempts].sort(
            (a: AttemptRow, b: AttemptRow) =>
              new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
          )[0].started_at
        : null;

    return {
      studentId: s.id,
      nickname: s.nickname,
      currentMission: inProgress?.mission_id ?? null,
      missionsCompleted: completed.length,
      totalMissions,
      totalScore,
      lastActive,
    };
  });

  const completedAttempts = allAttempts.filter((a) => a.status === "completed");
  const scores = completedAttempts.map((a: AttemptRow) => a.score ?? 0);
  const avgScore =
    scores.length > 0
      ? scores.reduce((s: number, v: number) => s + v, 0) / scores.length
      : 0;

  const times = completedAttempts
    .filter((a: AttemptRow) => a.completed_at && a.started_at)
    .map(
      (a: AttemptRow) =>
        (new Date(a.completed_at!).getTime() - new Date(a.started_at).getTime()) / 60000
    );
  const avgTime =
    times.length > 0
      ? times.reduce((s: number, v: number) => s + v, 0) / times.length
      : 0;

  const metrics: ClassMetrics = {
    studentsJoined: allStudents.length,
    missionsCompleted: completedAttempts.length,
    averageScore: avgScore,
    averageTimeMinutes: avgTime,
  };

  return NextResponse.json({
    session: {
      id: sessionCheck.id,
      joinCode: sessionCheck.join_code,
      gradeBand: sessionCheck.grade_band,
      status: sessionCheck.status,
    },
    students: summaries,
    metrics,
  });
}
