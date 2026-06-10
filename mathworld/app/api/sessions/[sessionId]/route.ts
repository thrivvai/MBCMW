import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

// PATCH /api/sessions/[sessionId] — end a session.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId } = await params;
  const body = await req.json();
  const { status } = body;

  if (status !== "ended") {
    return NextResponse.json({ error: "Only 'ended' status is supported" }, { status: 400 });
  }

  const db = createServiceClient();

  // Verify session belongs to requesting teacher.
  const { data: teacher } = await db
    .from("teachers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

  const { error } = await db
    .from("sessions")
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("teacher_id", teacher.id);

  if (error) return NextResponse.json({ error: "Failed to end session" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
