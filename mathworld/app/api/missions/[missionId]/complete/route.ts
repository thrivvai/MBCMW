import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getMission } from "@/lib/utils";
import { buildScoreBreakdown } from "@/lib/scoring/engine";
import type { CompleteMissionRequest, CompleteMissionResponse } from "@/lib/types";

// POST /api/missions/[missionId]/complete
// Finalizes the mission: saves reflection, awards completion bonus, returns breakdown.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ missionId: string }> }
) {
  const { missionId } = await params;
  const body = (await req.json()) as CompleteMissionRequest;
  const { attemptId, reflectionText } = body;

  if (!attemptId || !reflectionText?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const mission = await getMission(missionId);
  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  const db = createServiceClient();

  // Load attempt to compute breakdown.
  const { data: attempt } = await db
    .from("mission_attempts")
    .select("score, decision_made, student_id")
    .eq("id", attemptId)
    .single();

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  const { data: answers } = await db
    .from("student_answers")
    .select("points_earned")
    .eq("attempt_id", attemptId);

  const questionPoints = (answers ?? []).reduce((s: number, a: { points_earned: number | null }) => s + (a.points_earned ?? 0), 0);
  const decisionMade = !!attempt.decision_made;

  const breakdown = buildScoreBreakdown(mission, questionPoints, decisionMade, true);

  // Mark complete and award bonus.
  await db
    .from("mission_attempts")
    .update({
      status: "completed",
      reflection_text: reflectionText.trim(),
      score: breakdown.total,
      completed_at: new Date().toISOString(),
    })
    .eq("id", attemptId);

  // Award badge.
  await db.from("student_badges").upsert(
    { student_id: attempt.student_id, badge_id: mission.badge.id },
    { onConflict: "student_id,badge_id" }
  );

  const response: CompleteMissionResponse = {
    finalScore: breakdown.total,
    badgeEarned: mission.badge,
    breakdown,
  };

  return NextResponse.json(response);
}
