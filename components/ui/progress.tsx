import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0–100
  className?: string;
  color?: "aurora" | "indigo" | "emerald" | "amber";
}

export function Progress({ value, className, color = "aurora" }: ProgressProps) {
  const barClass =
    color === "aurora"
      ? "aurora-bar"
      : color === "emerald"
      ? "bg-emerald-500"
      : color === "amber"
      ? "bg-amber-500"
      : "bg-indigo-500";

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full bg-[#1A1F35] rounded-full overflow-hidden", className)}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", barClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
