"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { StarField } from "@/components/ui/StarField";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import type { ScoreBreakdown, Mission } from "@/lib/types";
import { maxPossibleScore } from "@/lib/scoring/engine";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface Props {
  mission: Mission;
  breakdown: ScoreBreakdown;
  badge: Mission["badge"];
}

function ConfettiBurst() {
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360;
    const distance = 60 + (i % 3) * 35;
    const tx = Math.cos((angle * Math.PI) / 180) * distance;
    const ty = Math.sin((angle * Math.PI) / 180) * distance;
    // Warm palette — gold tones + warm neutral, no neon
    const colors = ["#C9A84C", "#F5DFA0", "#E8D080", "#D4C080", "#A8882C", "#EDE8DC", "#9A9694"];
    const color = colors[i % colors.length];
    const size = 2.5 + (i % 4);
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
            "--tx": `${p.tx}px`,
            "--ty": `${p.ty}px`,
            animation: `particleBurst 0.9s cubic-bezier(0,.9,.57,1) ${p.delay}s both`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* Award medal SVG — replaces 🏅 emoji */
function MedalIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-label="Mission badge">
      <circle cx="24" cy="19" r="13" stroke="currentColor" strokeWidth="2" />
      <path d="M24 8L26.2 14.8H33.6L27.7 18.9L30 25.7L24 21.6L18 25.7L20.3 18.9L14.4 14.8H21.8L24 8Z"
            stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M17 32L13 46M31 32L35 46M13 46L24 40L35 46"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MissionComplete({ mission, breakdown, badge }: Props) {
  const max = maxPossibleScore(mission);
  const pct = Math.round((breakdown.total / max) * 100);

  const grade =
    pct >= 90 ? { label: "Outstanding",  color: "#C9A84C",  border: "rgba(201,168,76,0.25)" } :
    pct >= 70 ? { label: "Great Work",    color: "#6AC98A",  border: "rgba(106,201,138,0.22)" } :
    pct >= 50 ? { label: "Good Effort",   color: "#9A9694",  border: "rgba(154,150,148,0.20)" } :
                { label: "Keep Going",    color: "#666360",  border: "rgba(102,99,96,0.18)" };

  const rows = [
    { label: "Question accuracy",  value: breakdown.questionPoints,  max: mission.questions.reduce((s, q) => s + q.points, 0) },
    { label: "Financial decision",  value: breakdown.decisionPoints,  max: mission.decision.points },
    { label: "Reflection",          value: breakdown.reflectionPoints, max: mission.reflection.points },
    { label: "Completion bonus",    value: breakdown.completionBonus,  max: mission.completionBonus },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#0B0C0F]">
      <StarField count={80} />
      <CosmicBackground />

      {/* Centered ambient orb — warm gold, no neon */}
      <div
        className="fixed inset-0 pointer-events-none flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-lg w-full">

        {/* Badge reveal */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <ConfettiBurst />
            <motion.div
              initial={{ scale: 0.7, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
              className="w-32 h-32 rounded-sm flex items-center justify-center"
              style={{
                background: "rgba(201,168,76,0.10)",
                border: "1px solid rgba(201,168,76,0.35)",
                color: "#C9A84C",
              }}
            >
              <MedalIcon size={52} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.45, ease: EASE_OUT_EXPO }}
            className="mt-5 text-center"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1 text-[#C9A84C]">
              Badge Earned
            </p>
            <p className="font-display font-[700] text-xl text-[#EDE8DC]">
              {badge.name}
            </p>
          </motion.div>
        </div>

        {/* Score + breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55, ease: EASE_OUT_EXPO }}
          className="space-y-4"
        >
          {/* Grade + total score */}
          <div className="text-center mb-2">
            <motion.p
              className="font-display tracking-tight"
              style={{ fontSize: "clamp(3.5rem, 10vw, 5rem)", fontWeight: 700, lineHeight: 1, color: "#EDE8DC" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 18 }}
            >
              {breakdown.total}
              <span
                className="font-sans font-light"
                style={{ fontSize: "1.4rem", color: "#3A3836" }}
              > / {max}</span>
            </motion.p>
            <p className="text-sm font-medium mt-1" style={{ color: grade.color }}>{grade.label}</p>
          </div>

          {/* Breakdown card */}
          <div
            className="rounded-sm overflow-hidden"
            style={{
              background: "rgba(17,19,24,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="px-6 py-4 border-b border-white/6">
              <p className="text-sm font-semibold text-[#EDE8DC]">Score Breakdown</p>
            </div>

            {rows.map(({ label, value, max: rowMax }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.07, duration: 0.4, ease: EASE_OUT_EXPO }}
                className="flex items-center justify-between px-6 py-3.5"
                style={{
                  borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <span className="text-sm text-[#666360] font-light">{label}</span>
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-0.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: value === rowMax ? "#C9A84C" : "rgba(255,255,255,0.25)",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: rowMax > 0 ? `${(value / rowMax) * 100}%` : "0%" }}
                      transition={{ delay: 0.75 + i * 0.07, duration: 0.55, ease: EASE_OUT_EXPO }}
                    />
                  </div>
                  <span
                    className="text-sm font-semibold min-w-[50px] text-right tabular-nums"
                    style={{ color: value === rowMax ? "#C9A84C" : "#9A9694" }}
                  >
                    {value} / {rowMax}
                  </span>
                </div>
              </motion.div>
            ))}

            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ background: "rgba(201,168,76,0.05)", borderTop: "1px solid rgba(201,168,76,0.15)" }}
            >
              <span className="text-sm font-semibold text-[#EDE8DC]">Total</span>
              <span className="text-lg font-display font-[700] text-[#C9A84C]">
                {breakdown.total} pts
              </span>
            </div>
          </div>

          {/* Return CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.4, ease: EASE_OUT_EXPO }}
          >
            <Link href="/student/city" className="cursor-pointer block">
              <button
                className="w-full py-4 rounded-sm font-semibold text-base transition-all duration-150 active:scale-[0.97] hover:bg-white cursor-pointer"
                style={{
                  background: "#EDE8DC",
                  color: "#0B0C0F",
                  minHeight: "52px",
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
