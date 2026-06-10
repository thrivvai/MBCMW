"use client";

import { Progress } from "@/components/ui/progress";
import type { StudentProgressSummary } from "@/lib/types";

interface Props {
  student: StudentProgressSummary;
}

export function StudentRow({ student }: Props) {
  const pct =
    student.totalMissions > 0
      ? Math.round((student.missionsCompleted / student.totalMissions) * 100)
      : 0;

  const isDone    = student.missionsCompleted === student.totalMissions && student.totalMissions > 0;
  const isActive  = !isDone && !!student.currentMission;

  const statusDot   = isDone ? "bg-[#6AC98A]" : isActive ? "bg-[#C9A84C] animate-pulse" : "bg-[#3A3836]";
  const statusLabel = isDone ? "Done" : isActive ? "Active" : "Waiting";
  const statusStyle = isDone
    ? { background: "rgba(74,154,106,0.12)", color: "#6AC98A", border: "1px solid rgba(74,154,106,0.25)" }
    : isActive
    ? { background: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }
    : { background: "rgba(58,56,54,0.40)",   color: "#666360", border: "1px solid rgba(58,56,54,0.5)" };

  return (
    <tr className="border-b border-space-border hover:bg-white/3 transition-colors duration-150">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot}`} />
          <span className="text-[#EDE8DC] text-sm font-medium">{student.nickname}</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span
          className="text-[10px] font-semibold px-2.5 py-0.5 rounded-sm uppercase tracking-wide"
          style={statusStyle}
        >
          {statusLabel}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <Progress value={pct} className="w-20" />
          <span className="text-xs text-[#666360] font-light tabular-nums">
            {student.missionsCompleted}/{student.totalMissions}
          </span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-right">
        <span className="text-sm font-bold text-[#C9A84C] tabular-nums">{student.totalScore}</span>
      </td>
    </tr>
  );
}
