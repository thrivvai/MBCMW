import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

// PATCH /api/rooms/[roomId]/question — teacher opens or closes a question
// body: { action: "open" | "close", index?: number }
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
    .select("id, teacher_id, status, current_question_index, question_set_id")
    .eq("id", roomId)
    .single();

  if (!room || room.teacher_id !== teacher.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { action, index } = await req.json() as { action: "open" | "close"; index?: number };

  if (action === "open") {
    const nextIndex = index !== undefined ? index : room.current_question_index + 1;

    const { data: qs } = await db
      .from("question_sets")
      .select("questions")
      .eq("id", room.question_set_id)
      .single();

    const questions = (qs?.questions as unknown[]) ?? [];
    if (nextIndex >= questions.length) {
      return NextResponse.json({ error: "No more questions" }, { status: 400 });
    }

    const { data: updated } = await db
      .from("battle_rooms")
      .update({
        status: "question_open",
        current_question_index: nextIndex,
        question_started_at: new Date().toISOString(),
      })
      .eq("id", roomId)
      .select()
      .single();

    return NextResponse.json({ room: updated, questionIndex: nextIndex });
  }

  if (action === "close") {
    const { data: updated } = await db
      .from("battle_rooms")
      .update({ status: "question_closed" })
      .eq("id", roomId)
      .select()
      .single();

    return NextResponse.json({ room: updated });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
