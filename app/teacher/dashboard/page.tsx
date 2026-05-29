import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getSessions(userId: string) {
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const db = createServiceClient();
    const { data: teacher } = await db
      .from("teachers")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();
    if (!teacher) return [];
    const { data: sessions } = await db
      .from("sessions")
      .select("id, join_code, grade_band, status, created_at")
      .eq("teacher_id", teacher.id)
      .order("created_at", { ascending: false });
    return sessions ?? [];
  } catch {
    return [];
  }
}

type SessionRow = {
  id: string;
  join_code: string;
  grade_band: string;
  status: string;
  created_at: string;
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

export default async function TeacherDashboard() {
  const { userId } = await auth();
  const sessions = (await getSessions(userId!)) as SessionRow[];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[#EDE8DC] font-[600] tracking-tight">
            Your Sessions
          </h1>
          <p className="text-[#666360] text-sm mt-1 font-light">
            Create a session and share the code with your class.
          </p>
        </div>
        <Link href="/teacher/sessions/new" className="cursor-pointer">
          <Button size="md">
            <PlusIcon />
            New Session
          </Button>
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          {/* Empty state — no emoji */}
          <div
            className="w-20 h-20 rounded-sm flex items-center justify-center mb-8 border border-white/8"
            style={{ background: "rgba(17,19,24,0.8)" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect x="4" y="8" width="24" height="18" rx="1.5" stroke="#666360" strokeWidth="1.5" />
              <path d="M4 13H28" stroke="#666360" strokeWidth="1.5" />
              <path d="M10 5V11M22 5V11" stroke="#666360" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M11 19H21M16 17V21" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="font-display text-xl text-[#EDE8DC] font-[600] mb-2 tracking-tight">
            No sessions yet
          </h2>
          <p className="text-[#666360] mb-8 max-w-sm font-light leading-relaxed text-sm">
            Create your first classroom session. Students join instantly with a
            short code — no student accounts needed.
          </p>
          <Link href="/teacher/sessions/new" className="cursor-pointer">
            <Button size="lg">Create Your First Session</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {sessions.map((s: SessionRow) => (
            <Link key={s.id} href={`/teacher/sessions/${s.id}`} className="cursor-pointer group">
              <div
                className="rounded-sm px-6 py-5 flex items-center justify-between transition-colors duration-200 border border-space-border group-hover:border-white/18"
                style={{ background: "rgba(17,19,24,0.80)" }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-sans text-2xl font-bold text-[#EDE8DC] tracking-widest tabular-nums">
                      {s.join_code}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-sm font-semibold tracking-wide uppercase ${
                        s.status === "active"
                          ? "bg-[#4A9A6A]/15 text-[#6AC98A] border border-[#4A9A6A]/25"
                          : "bg-white/5 text-[#666360] border border-white/8"
                      }`}
                    >
                      {s.status === "active" ? "Active" : "Ended"}
                    </span>
                  </div>
                  <p className="text-[#666360] text-sm font-light">
                    Grade {s.grade_band} · {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <span className="text-[#3A3836] group-hover:text-[#9A9694] transition-colors duration-200">
                  <ChevronRightIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
