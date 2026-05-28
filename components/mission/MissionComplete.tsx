"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { StarField } from "@/components/ui/StarField";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import type { ScoreBreakdown, Mission } from "@/lib/types";
import { maxPossibleScore } from "@/lib/scoring/engine";

interface Props {
  mission: Mission;
  breakdown: ScoreBreakdown;
  badge: Mission["badge"];
}

// CSS confetti burst from badge center
function ConfettiBurst() {
  const particles = Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * 360;
    const distance = 70 + (i % 3) * 40;
    const tx = Math.cos((angle * Math.PI) / 180) * distance;
    const ty = Math.sin((angle * Math.PI) / 180) * distance;
    const colors = ["#E8A820", "#F5C040", "#8B5CF6", "#00CCD8", "#C4B5FD", "#67E8F9", "#FDE68A"];
    const color = colors[i % colors.length];
    const size = 3 + (i % 4);
    const delay = (i % 7) * 0.04;
    return { tx, ty, color, size, delay };
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 6px ${p.color}`,
            "--tx": `${p.tx}px`,
            "--ty": `${p.ty}px`,
            animation: `particleBurst 0.9s cubic-bezier(0,.9,.57,1) ${p.delay}s both`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function MissionComplete({ mission, breakdown, badge }: Props) {
  const max = maxPossibleScore(mission);
  const pct = Math.round((breakdown.total / max) * 100);

  const grade =
    pct >= 90 ? { label: "Outstanding!", color: "#F5C040", glow: "rgba(245,192,64,0.25)" } :
    pct >= 70 ? { label: "Great Work!",  color: "#34D399", glow: "rgba(52,211,153,0.20)" } :
    pct >= 50 ? { label: "Good Effort!", color: "#8B5CF6", glow: "rgba(139,92,246,0.20)" } :
                { label: "Keep Going!",  color: "#5A5A6E", glow: "transparent" };

  const rows = [
    { label: "Question accuracy", value: breakdown.questionPoints, max: mission.questions.reduce((s, q) => s + q.points, 0) },
    { label: "Financial decision",  value: breakdown.decisionPoints,    max: mission.decision.points },
    { label: "Reflection",          value: breakdown.reflectionPoints,  max: mission.reflection.points },
    { label: "Completion bonus",    value: breakdown.completionBonus,   max: mission.completionBonus },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "#030507" }}
    >
      <StarField count={100} />
      <CosmicBackground />

      {/* Centered glow */}
      <div
        className="fixed inset-0 pointer-events-none flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="w-[700px] h-[700px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${grade.glow} 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-lg w-full">

        {/* Badge reveal */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative">
            <ConfettiBurst />
            <motion.div
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
              className="w-36 h-36 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #E8A820, #F5C040 50%, #C8860A)",
                boxShadow: `0 0 60px rgba(232,168,32,0.40), 0 0 120px rgba(232,168,32,0.15)`,
              }}
            >
              <span className="text-6xl">🏅</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p
              className="text-xs font-black uppercase tracking-[0.2em] mb-1"
              style={{ color: "#E8A820" }}
            >
              Badge Earned
            </p>
            <p className="font-display font-extrabold text-2xl" style={{ color: "#E8E4D8" }}>
              {badge.name}
            </p>
          </motion.div>
        </div>

        {/* Score + breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-5"
        >
          <div className="text-center">
            <p className="text-2xl font-bold mb-2" style={{ color: grade.color }}>
              {grade.label}
            </p>
            <motion.p
              className="font-display font-extrabold"
              style={{ fontSize: "4.5rem", lineHeight: 1, color: "#E8E4D8" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65, type: "spring", stiffness: 180 }}
            >
              {breakdown.total}
              <span className="text-2xl font-normal" style={{ color: "#2A2A3A" }}> / {max}</span>
            </motion.p>
          </div>

          {/* Breakdown card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(13,16,32,0.80)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
            }}
          >
            <div
              className="px-6 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "#E8E4D8" }}>Score Breakdown</p>
            </div>
            <div style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              {rows.map(({ label, value, max: rowMax }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.07 }}
                  className="flex items-center justify-between px-6 py-3.5"
                  style={{
                    borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <span className="text-sm" style={{ color: "#5A5A6E" }}>{label}</span>
                  <div className="flex items-center gap-3">
                    {/* Mini progress bar */}
                    <div
                      className="w-16 h-1 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: value === rowMax
                            ? "linear-gradient(90deg, #10B981, #34D399)"
                            : "linear-gradient(90deg, #6D28D9, #8B5CF6)",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: rowMax > 0 ? `${(value / rowMax) * 100}%` : "0%" }}
                        transition={{ delay: 0.8 + i * 0.07, duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    <span
                      className="text-sm font-bold min-w-[52px] text-right"
                      style={{ color: value === rowMax ? "#34D399" : "#E8E4D8" }}
                    >
                      {value} / {rowMax}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{
                background: "rgba(139,92,246,0.06)",
                borderTop: "1px solid rgba(139,92,246,0.15)",
              }}
            >
              <span className="text-sm font-bold" style={{ color: "#E8E4D8" }}>Total</span>
              <span className="text-xl font-black" style={{ color: "#8B5CF6" }}>
                {breakdown.total} pts
              </span>
            </div>
          </div>

          {/* Return CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Link href="/student/city">
              <button
                className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #E8A820, #F5C040 50%, #00CCD8)",
                  color: "#030507",
                  boxShadow: "0 0 40px rgba(232,168,32,0.20), 0 0 80px rgba(0,204,216,0.08)",
                }}
              >
                Return to MathWorld City
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
