import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// GET /api/rooms/[roomId]/players — lobby player list + room state.
// No auth required — students need this to see who's in the lobby.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const db = createServiceClient();

  const { data: room } = await db
    .from("battle_rooms")
    .select("id, room_code, status, current_question_index, mode")
    .eq("id", roomId)
    .single();

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const { data: players } = await db
    .from("players")
    .select("id, nickname, character_name, character_class, joined_at")
    .eq("room_id", roomId)
    .order("joined_at");

  return NextResponse.json({
    room: {
      id: room.id,
      roomCode: room.room_code,
      status: room.status,
      currentQuestionIndex: room.current_question_index,
      mode: room.mode,
    },
    players: (players ?? []).map((p) => ({
      playerId: p.id,
      nickname: p.nickname,
      characterName: p.character_name,
      characterClass: p.character_class,
      joinedAt: p.joined_at,
    })),
  });
}
