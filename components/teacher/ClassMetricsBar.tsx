"use client";

import type { ClassMetrics } from "@/lib/types";

interface Props {
  metrics: ClassMetrics;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center bg-space-surface border border-space-border rounded-xl px-6 py-4">
      <span className="text-2xl font-black text-white">{value}</span>
      <span className="text-xs text-gray-400 mt-1 text-center">{label}</span>
    </div>
  );
}

export function ClassMetricsBar({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Metric label="Students Joined" value={metrics.studentsJoined} />
      <Metric label="Missions Completed" value={metrics.missionsCompleted} />
      <Metric label="Average Score" value={metrics.averageScore > 0 ? Math.round(metrics.averageScore) : "—"} />
      <Metric
        label="Avg. Time (min)"
        value={metrics.averageTimeMinutes > 0 ? Math.round(metrics.averageTimeMinutes) : "—"}
      />
    </div>
  );
}
