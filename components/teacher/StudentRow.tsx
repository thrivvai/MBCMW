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

  const statusDot =
    student.missionsCompleted === student.totalMissions && student.totalMissions > 0
      ? "bg-emerald-400"
      : student.currentMission
      ? "bg-amber-400 animate-pulse"
      : "bg-gray-600";

  const statusLabel =
    student.missionsCompleted === student.totalMissions && student.totalMissions > 0
      ? "Done"
      : student.currentMission
      ? "Active"
      : "Waiting";

  return (
    <tr className="border-b border-space-border hover:bg-white/5 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot}`} />
          <span className="text-white text-sm font-medium">{student.nickname}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          statusLabel === "Done"
            ? "bg-emerald-500/20 text-emerald-400"
            : statusLabel === "Active"
            ? "bg-amber-500/20 text-amber-400"
            : "bg-gray-500/20 text-gray-400"
        }`}>
          {statusLabel}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Progress value={pct} className="w-24" />
          <span className="text-xs text-gray-400">{student.missionsCompleted}/{student.totalMissions}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm font-bold text-indigo-400">{student.totalScore}</span>
      </td>
    </tr>
  );
}
