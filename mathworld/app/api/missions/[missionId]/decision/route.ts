import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getMission } from "@/lib/utils";
import type { SubmitDecisionRequest } from "@/lib/types";

// POST /api/missions/[missionId]/decision
// Records the student's financial decision and awards points.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ missionId: string }> }
) {
  const { missionId } = await params;
  const body = (await req.json()) as SubmitDecisionRequest;
  const { attemptId, decisionId } = body;

  if (!attemptId || !decisionId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const mission = await getMission(missionId);
  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  const option = mission.decision.options.find((o) => o.id === decisionId);
  if (!option) {
    return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
  }

  const db = createServiceClient();

  // Record decision and add points.
  const { data: attempt } = await db
    .from("mission_attempts")
    .select("score")
    .eq("id", attemptId)
    .single();

  const newScore = (attempt?.score ?? 0) + mission.decision.points;

  await db
    .from("mission_attempts")
    .update({ decision_made: decisionId, score: newScore })
    .eq("id", attemptId);

  return NextResponse.json({ pointsEarned: mission.decision.points, totalScore: newScore });
}
