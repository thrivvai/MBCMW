"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { ClassMetricsBar } from "@/components/teacher/ClassMetricsBar";
import { StudentRow } from "@/components/teacher/StudentRow";
import { JoinCodeDisplay } from "@/components/teacher/JoinCodeDisplay";
import { Button } from "@/components/ui/button";
import type { StudentProgressSummary, ClassMetrics } from "@/lib/types";

interface SessionInfo {
  id: string;
  joinCode: string;
  gradeBand: string;
  status: string;
}

export default function LiveSessionPage() {
  const { sessionId } = useParams() as { sessionId: string };
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [students, setStudents] = useState<StudentProgressSummary[]>([]);
  const [metrics, setMetrics] = useState<ClassMetrics>({
    studentsJoined: 0,
    missionsCompleted: 0,
    averageScore: 0,
    averageTimeMinutes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  const fetchProgress = useCallback(async () => {
    const res = await fetch(`/api/sessions/${sessionId}/students`);
    if (!res.ok) return;
    const data = await res.json();
    setSession(data.session);
    setStudents(data.students);
    setMetrics(data.metrics);
    setLoading(false);
  }, [sessionId]);

  // Initial load.
  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Supabase Realtime — re-fetch whenever student_profiles or mission_attempts change in this session.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`session-live-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "student_profiles",
          filter: `session_id=eq.${sessionId}`,
        },
        () => fetchProgress()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "mission_attempts",
          filter: `session_id=eq.${sessionId}`,
        },
        () => fetchProgress()
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, fetchProgress]);

  const handleEndSession = async () => {
    if (!confirm("End this session? Students will no longer be able to join.")) return;
    setEnding(true);
    // Service-side endpoint to mark session ended.
    await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ended" }),
    });
    fetchProgress();
    setEnding(false);
  };

  const handleExportCSV = () => {
    const rows = [
      ["Nickname", "Missions Completed", "Total Missions", "Total Score", "Last Active"],
      ...students.map((s) => [
        s.nickname,
        s.missionsCompleted,
        s.totalMissions,
        s.totalScore,
        s.lastActive ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `session-${session?.joinCode ?? sessionId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const appUrl =
    typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL ?? "";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#C9A84C]/40 border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl text-[#EDE8DC] font-[600] tracking-tight">
            Live Session
          </h1>
          <p className="text-[#666360] text-sm mt-1 font-light">
            Grade {session?.gradeBand} ·{" "}
            <span className={session?.status === "active" ? "text-[#6AC98A]" : "text-[#666360]"}>
              {session?.status === "active" ? "Active" : "Ended"}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleExportCSV}>
            Export CSV
          </Button>
          {session?.status === "active" && (
            <Button variant="danger" size="sm" onClick={handleEndSession} loading={ending}>
              End Session
            </Button>
          )}
        </div>
      </div>

      {/* Join code display */}
      {session && session.status === "active" && (
        <JoinCodeDisplay code={session.joinCode} appUrl={appUrl} />
      )}

      {/* Metrics */}
      <ClassMetricsBar metrics={metrics} />

      {/* Student table */}
      <div
        className="rounded-sm overflow-hidden"
        style={{ background: "rgba(17,19,24,0.80)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="px-6 py-4 border-b border-space-border flex items-center justify-between">
          <p className="text-sm font-semibold text-[#EDE8DC]">
            Students <span className="text-[#666360] font-light">({students.length})</span>
          </p>
          <button
            onClick={fetchProgress}
            className="text-xs text-[#3A3836] hover:text-[#9A9694] transition-colors duration-200 cursor-pointer"
            style={{ minHeight: "32px", minWidth: "32px" }}
          >
            ↻ Refresh
          </button>
        </div>

        {students.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-[#666360] font-light text-sm">
              No students yet. Share the join code and they&apos;ll appear here as they join.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-space-border text-[10px] text-[#3A3836] uppercase tracking-[0.15em]">
                  <th className="px-4 py-3 text-left font-semibold">Student</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Progress</th>
                  <th className="px-4 py-3 text-right font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <StudentRow key={s.studentId} student={s} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
