"use client";

import type { ClassMetrics } from "@/lib/types";

interface Props {
  metrics: ClassMetrics;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="flex flex-col items-center rounded-sm px-6 py-5 border border-space-border"
      style={{ background: "rgba(17,19,24,0.80)" }}
    >
      <span className="font-display text-2xl font-[700] text-[#EDE8DC] tabular-nums tracking-tight">
        {value}
      </span>
      <span className="text-[10px] text-[#666360] mt-1.5 text-center uppercase tracking-[0.15em] font-medium">
        {label}
      </span>
    </div>
  );
}

export function ClassMetricsBar({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Metric label="Students" value={metrics.studentsJoined} />
      <Metric label="Completed" value={metrics.missionsCompleted} />
      <Metric label="Avg Score" value={metrics.averageScore > 0 ? Math.round(metrics.averageScore) : "—"} />
      <Metric label="Avg Time (min)" value={metrics.averageTimeMinutes > 0 ? Math.round(metrics.averageTimeMinutes) : "—"} />
    </div>
  );
}
