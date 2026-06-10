import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generateJoinCode } from "@/lib/scoring/engine";
import { getMissionsForGradeBand } from "@/lib/utils";
import type { GradeBand } from "@/lib/types";

// POST /api/sessions — teacher creates a new classroom session.
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { gradeBand, missionIds } = body as {
    gradeBand: GradeBand;
    missionIds: string[];
  };

  if (!gradeBand || !["4-5", "6-8", "9-12"].includes(gradeBand)) {
    return NextResponse.json({ error: "Invalid grade band" }, { status: 400 });
  }

  const db = createServiceClient();

  // Ensure a Teacher record exists for this Clerk user.
  let { data: teacher } = await db
    .from("teachers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!teacher) {
    const { data: newTeacher, error } = await db
      .from("teachers")
      .insert({ clerk_user_id: userId, email: "", name: "Teacher" })
      .select("id")
      .single();
    if (error || !newTeacher) {
      return NextResponse.json({ error: "Failed to create teacher record" }, { status: 500 });
    }
    teacher = newTeacher;
  }

  // Generate a unique join code.
  let joinCode = generateJoinCode();
  let attempts = 0;
  while (attempts < 10) {
    const { data: existing } = await db
      .from("sessions")
      .select("id")
      .eq("join_code", joinCode)
      .single();
    if (!existing) break;
    joinCode = generateJoinCode();
    attempts++;
  }

  // Create the session.
  const { data: session, error: sessionError } = await db
    .from("sessions")
    .insert({ teacher_id: teacher.id, join_code: joinCode, grade_band: gradeBand })
    .select("id, join_code")
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }

  // Assign missions. If none provided, use all for the grade band.
  const resolvedMissions =
    missionIds?.length > 0
      ? missionIds
      : getMissionsForGradeBand(gradeBand).map((m) => m.id);

  if (resolvedMissions.length > 0) {
    await db.from("session_missions").insert(
      resolvedMissions.map((mId, i) => ({
        session_id: session.id,
        mission_id: mId,
        order_index: i,
      }))
    );
  }

  return NextResponse.json({ sessionId: session.id, joinCode: session.join_code });
}

// GET /api/sessions — list teacher's sessions.
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServiceClient();
  const { data: teacher } = await db
    .from("teachers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!teacher) return NextResponse.json({ sessions: [] });

  const { data: sessions } = await db
    .from("sessions")
    .select("id, join_code, grade_band, status, created_at")
    .eq("teacher_id", teacher.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ sessions: sessions ?? [] });
}
