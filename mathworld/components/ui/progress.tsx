import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0–100
  className?: string;
  color?: "gold" | "emerald" | "muted";
}

export function Progress({ value, className, color = "gold" }: ProgressProps) {
  const barClass =
    color === "gold"    ? "gold-bar" :
    color === "emerald" ? "bg-[#4A9A6A]" :
                          "bg-white/20";

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-px w-full bg-white/8 rounded-full overflow-hidden", className)}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", barClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
