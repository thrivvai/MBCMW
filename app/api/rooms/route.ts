import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// POST /api/rooms — teacher creates a new battle room
export async function POST(req: NextRequest) {
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

  if (!teacher) {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }

  const body = await req.json();
  const { questionSetId, mode = "individual" } = body;

  if (!questionSetId) {
    return NextResponse.json({ error: "questionSetId required" }, { status: 400 });
  }

  // Generate a unique room code
  let roomCode = generateRoomCode();
  let attempts = 0;
  while (attempts < 10) {
    const { data: existing } = await db
      .from("battle_rooms")
      .select("id")
      .eq("room_code", roomCode)
      .maybeSingle();
    if (!existing) break;
    roomCode = generateRoomCode();
    attempts++;
  }

  const { data: room, error } = await db
    .from("battle_rooms")
    .insert({
      teacher_id: teacher.id,
      room_code: roomCode,
      question_set_id: questionSetId,
      mode,
      status: "lobby",
      current_question_index: -1,
    })
    .select()
    .single();

  if (error || !room) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }

  return NextResponse.json({
    roomId: room.id,
    roomCode: room.room_code,
    status: room.status,
    mode: room.mode,
  });
}

// GET /api/rooms — teacher lists their battle rooms
export async function GET(_req: NextRequest) {
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

  if (!teacher) {
    return NextResponse.json({ rooms: [] });
  }

  const { data: rooms } = await db
    .from("battle_rooms")
    .select("id, room_code, mode, status, created_at, ended_at, question_sets(title)")
    .eq("teacher_id", teacher.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ rooms: rooms ?? [] });
}
