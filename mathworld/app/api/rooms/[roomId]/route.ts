import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

// GET /api/rooms/[roomId] — get room info (teacher or player joining)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const db = createServiceClient();

  const { data: room } = await db
    .from("battle_rooms")
    .select("id, room_code, mode, status, current_question_index, question_started_at, question_set_id")
    .eq("id", roomId)
    .single();

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({ room });
}

// PATCH /api/rooms/[roomId] — teacher updates room status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = await params;
  const db = createServiceClient();

  const { data: teacher } = await db
    .from("teachers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!teacher) {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }

  const { data: room } = await db
    .from("battle_rooms")
    .select("id, teacher_id, status")
    .eq("id", roomId)
    .single();

  if (!room || room.teacher_id !== teacher.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (body.status) {
    updates.status = body.status;
    if (body.status === "ended") updates.ended_at = new Date().toISOString();
  }

  const { data: updated } = await db
    .from("battle_rooms")
    .update(updates)
    .eq("id", roomId)
    .select()
    .single();

  return NextResponse.json({ room: updated });
}
