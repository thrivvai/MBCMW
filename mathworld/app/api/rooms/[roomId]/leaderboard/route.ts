import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { LeaderboardPlayer } from "@/lib/types";

// GET /api/rooms/[roomId]/leaderboard — real-time leaderboard, no auth required.
// Room IDs are UUIDs; safe to expose publicly.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const db = createServiceClient();

  const { data: players } = await db
    .from("players")
    .select("id, nickname, character_name, character_class")
    .eq("room_id", roomId)
    .order("joined_at");

  if (!players || players.length === 0) {
    return NextResponse.json({ leaderboard: [] });
  }

  const playerIds = players.map((p) => p.id);

  const { data: scores } = await db
    .from("player_scores")
    .select("player_id, total_score, questions_correct, current_streak")
    .in("player_id", playerIds);

  const scoreMap = new Map(
    (scores ?? []).map((s) => [s.player_id, s])
  );

  const leaderboard: LeaderboardPlayer[] = players
    .map((p) => {
      const s = scoreMap.get(p.id);
      return {
        playerId: p.id,
        nickname: p.nickname,
        characterName: p.character_name,
        characterClass: p.character_class,
        totalScore: s?.total_score ?? 0,
        questionsCorrect: s?.questions_correct ?? 0,
        currentStreak: s?.current_streak ?? 0,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore || a.nickname.localeCompare(b.nickname));

  return NextResponse.json({ leaderboard });
}
