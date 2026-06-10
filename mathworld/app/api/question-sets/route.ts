import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

// GET /api/question-sets — teacher fetches available question sets
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServiceClient();
  const { data: sets } = await db
    .from("question_sets")
    .select("id, title, grade_band, questions")
    .order("created_at");

  const questionSets = (sets ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    grade_band: s.grade_band,
    question_count: Array.isArray(s.questions) ? s.questions.length : 0,
  }));

  return NextResponse.json({ questionSets });
}
