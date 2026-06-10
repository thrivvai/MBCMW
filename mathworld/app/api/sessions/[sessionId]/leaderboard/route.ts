import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export interface LeaderboardEntry {
  studentId: string;
  nickname: string;
  totalScore: number;
  missionsCompleted: number;
}

// GET /api/sessions/[sessionId]/leaderboard — student-accessible, no teacher auth required.
// Session IDs are UUIDs, so this is safe to expose publicly.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const db = createServiceClient();

  const { data: students } = await db
    .from("student_profiles")
    .select("id, nickname")
    .eq("session_id", sessionId)
    .order("created_at");

  if (!students || students.length === 0) {
    return NextResponse.json({ entries: [] });
  }

  const { data: attempts } = await db
    .from("mission_attempts")
    .select("student_id, status, score")
    .eq("session_id", sessionId)
    .eq("status", "completed");

  const allAttempts = attempts ?? [];

  const entries: LeaderboardEntry[] = students
    .map((s) => {
      const studentAttempts = allAttempts.filter((a) => a.student_id === s.id);
      const totalScore = studentAttempts.reduce((sum, a) => sum + (a.score ?? 0), 0);
      return {
        studentId: s.id,
        nickname: s.nickname,
        totalScore,
        missionsCompleted: studentAttempts.length,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore || a.nickname.localeCompare(b.nickname));

  return NextResponse.json({ entries });
}
