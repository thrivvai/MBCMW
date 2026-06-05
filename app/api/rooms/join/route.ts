import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { CharacterClass } from "@/lib/types";

// POST /api/rooms/join — student joins a battle room and creates their character
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { roomCode, nickname, characterName, characterClass } = body as {
    roomCode: string;
    nickname: string;
    characterName: string;
    characterClass: CharacterClass;
  };

  if (!roomCode || !nickname || !characterName || !characterClass) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const validClasses: CharacterClass[] = ["speedster", "tactician", "berserker", "scholar"];
  if (!validClasses.includes(characterClass)) {
    return NextResponse.json({ error: "Invalid character class" }, { status: 400 });
  }

  const db = createServiceClient();

  const { data: room } = await db
    .from("battle_rooms")
    .select("id, room_code, status, question_set_id, question_sets(title)")
    .eq("room_code", roomCode.toUpperCase())
    .maybeSingle();

  if (!room) {
    return NextResponse.json({ error: "Room not found. Check the code and try again." }, { status: 404 });
  }

  if (room.status !== "lobby") {
    return NextResponse.json(
      { error: "This battle has already started. Ask your teacher for the next room code." },
      { status: 409 }
    );
  }

  const { data: player, error } = await db
    .from("players")
    .insert({
      room_id: room.id,
      nickname: nickname.trim(),
      character_name: characterName.trim(),
      character_class: characterClass,
      ability_used: false,
    })
    .select()
    .single();

  if (error || !player) {
    return NextResponse.json({ error: "Failed to join room" }, { status: 500 });
  }

  // Initialize the player's score row
  await db.from("player_scores").insert({
    player_id: player.id,
    room_id: room.id,
    total_score: 0,
    questions_answered: 0,
    questions_correct: 0,
    current_streak: 0,
    max_streak: 0,
    ability_uses_remaining: 1,
  });

  const questionSetTitle =
    Array.isArray(room.question_sets)
      ? (room.question_sets[0] as { title: string })?.title ?? ""
      : (room.question_sets as { title: string } | null)?.title ?? "";

  return NextResponse.json({
    playerId: player.id,
    roomId: room.id,
    roomCode: room.room_code,
    questionSetTitle,
  });
}
