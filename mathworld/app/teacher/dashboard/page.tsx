import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getBattleRooms(userId: string) {
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const db = createServiceClient();
    const { data: teacher } = await db
      .from("teachers")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();
    if (!teacher) return [];
    const { data: rooms } = await db
      .from("battle_rooms")
      .select("id, room_code, mode, status, created_at, question_sets(title)")
      .eq("teacher_id", teacher.id)
      .order("created_at", { ascending: false })
      .limit(20);
    return rooms ?? [];
  } catch {
    return [];
  }
}

type RoomRow = {
  id: string;
  room_code: string;
  mode: string;
  status: string;
  created_at: string;
  question_sets: { title: string } | { title: string }[] | null;
};

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SwordIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 12L7 7M7 7L11 3M7 7L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="3.5" cy="10.5" r="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function statusLabel(status: string): string {
  switch (status) {
    case "lobby": return "Lobby";
    case "active": return "Battle Active";
    case "question_open": return "Live";
    case "question_closed": return "Live";
    case "ended": return "Ended";
    default: return status;
  }
}

function statusIsLive(status: string): boolean {
  return ["lobby", "active", "question_open", "question_closed"].includes(status);
}

export default async function TeacherDashboard() {
  const { userId } = await auth();
  const rooms = (await getBattleRooms(userId!)) as RoomRow[];

  const getTitle = (r: RoomRow) => {
    if (!r.question_sets) return "Battle";
    if (Array.isArray(r.question_sets)) return r.question_sets[0]?.title ?? "Battle";
    return r.question_sets.title;
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[#EDE8DC] font-[600] tracking-tight">
            Battle Rooms
          </h1>
          <p className="text-[#666360] text-sm mt-1 font-light">
            Create a room and launch your class into a live math battle.
          </p>
        </div>
        <Link href="/teacher/rooms/new" className="cursor-pointer">
          <Button size="md">
            <PlusIcon />
            New Room
          </Button>
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div
            className="w-20 h-20 rounded-sm flex items-center justify-center mb-8 border border-white/8"
            style={{ background: "rgba(17,19,24,0.8)" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M4 28L14 18M14 18L22 10M14 18L18 22" stroke="#666360" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="7" cy="25" r="2.5" stroke="#C9A84C" strokeWidth="1.5" />
              <path d="M22 4L28 10M20 10L28 10L28 2" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-display text-xl text-[#EDE8DC] font-[600] mb-2 tracking-tight">
            No battles yet
          </h2>
          <p className="text-[#666360] mb-8 max-w-sm font-light leading-relaxed text-sm">
            Create a battle room, share the code with your students, and watch
            them compete in real time. No student accounts required.
          </p>
          <Link href="/teacher/rooms/new" className="cursor-pointer">
            <Button size="lg">Create Your First Battle</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {rooms.map((r: RoomRow) => (
            <Link key={r.id} href={`/teacher/rooms/${r.id}`} className="cursor-pointer group">
              <div
                className="rounded-sm px-6 py-5 flex items-center justify-between transition-colors duration-200 border border-space-border group-hover:border-white/18"
                style={{ background: "rgba(17,19,24,0.80)" }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-sans text-2xl font-bold text-[#EDE8DC] tracking-widest tabular-nums">
                      {r.room_code}
                    </span>
                    <span
                      className="text-[10px] px-2.5 py-0.5 rounded-sm font-semibold tracking-wide uppercase"
                      style={{
                        background: statusIsLive(r.status) ? "rgba(74,154,106,0.12)" : "rgba(255,255,255,0.04)",
                        color: statusIsLive(r.status) ? "#6AC98A" : "#666360",
                        border: `1px solid ${statusIsLive(r.status) ? "rgba(74,154,106,0.25)" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      {statusLabel(r.status)}
                    </span>
                    {r.mode === "team" && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wide"
                        style={{ background: "rgba(201,168,76,0.08)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.20)" }}
                      >
                        Teams
                      </span>
                    )}
                  </div>
                  <p className="text-[#666360] text-sm font-light">
                    {getTitle(r)} · {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {statusIsLive(r.status) && (
                    <span className="text-xs text-[#4A9A6A] font-semibold flex items-center gap-1.5">
                      <SwordIcon />
                      Active
                    </span>
                  )}
                  <span className="text-[#3A3836] group-hover:text-[#9A9694] transition-colors duration-200">
                    <ChevronRightIcon />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
