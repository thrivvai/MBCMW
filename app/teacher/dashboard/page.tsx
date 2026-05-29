import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getSessions(userId: string) {
  // Server-side data fetch — call our own API.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
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

export default async function TeacherDashboard() {
  const { userId } = await auth();
  const sessions = (await getSessions(userId!)) as SessionRow[];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Your Sessions</h1>
          <p className="text-gray-400 text-sm mt-1">
            Create a session and share the code with your class.
          </p>
        </div>
        <Link href="/teacher/sessions/new">
          <Button size="md">+ New Session</Button>
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-6">🏫</span>
          <h2 className="text-xl font-bold text-white mb-2">No sessions yet</h2>
          <p className="text-gray-400 mb-6 max-w-sm">
            Create your first classroom session and students can join instantly with a
            6-letter code — no student accounts needed.
          </p>
          <Link href="/teacher/sessions/new">
            <Button size="lg">Create Your First Session</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((s: SessionRow) => (
            <Link key={s.id} href={`/teacher/sessions/${s.id}`}>
              <div className="bg-space-surface border border-space-border rounded-2xl px-6 py-5 flex items-center justify-between hover:border-indigo-500/50 transition-colors">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-white tracking-widest">
                      {s.join_code}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        s.status === "active"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {s.status === "active" ? "● Active" : "Ended"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    Grade {s.grade_band} · Created{" "}
                    {new Date(s.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-gray-400 text-sm">View →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
