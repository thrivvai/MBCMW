import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { JoinSessionResponse } from "@/lib/types";

// POST /api/sessions/join — student joins a session with a code and nickname.
// No Clerk auth — students are anonymous. Join code is the authorization.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { joinCode, nickname } = body as { joinCode: string; nickname: string };

  if (!joinCode?.trim() || !nickname?.trim()) {
    return NextResponse.json({ error: "Join code and nickname are required" }, { status: 400 });
  }

  const code = joinCode.trim().toUpperCase();
  const nick = nickname.trim().slice(0, 30);

  const db = createServiceClient();

  // Look up the session.
  const { data: session, error } = await db
    .from("sessions")
    .select("id, grade_band, status")
    .eq("join_code", code)
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Session not found. Check your code and try again." }, { status: 404 });
  }
  if (session.status !== "active") {
    return NextResponse.json({ error: "This session has ended." }, { status: 410 });
  }

  // Create student profile.
  const { data: student, error: studentError } = await db
    .from("student_profiles")
    .insert({
      session_id: session.id,
      nickname: nick,
      grade_band: session.grade_band,
    })
    .select("id")
    .single();

  if (studentError || !student) {
    return NextResponse.json({ error: "Failed to join session" }, { status: 500 });
  }

  // Get assigned missions for this session.
  const { data: sessionMissions } = await db
    .from("session_missions")
    .select("mission_id")
    .eq("session_id", session.id)
    .order("order_index");

  const assignedMissions = (sessionMissions ?? []).map((sm: { mission_id: string }) => sm.mission_id);

  const response: JoinSessionResponse = {
    studentId: student.id,
    sessionId: session.id,
    gradeBand: session.grade_band,
    assignedMissions,
  };

  return NextResponse.json(response);
}
