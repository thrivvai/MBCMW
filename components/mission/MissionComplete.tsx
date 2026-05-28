"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StarField } from "@/components/ui/StarField";
import type { ScoreBreakdown, Mission } from "@/lib/types";
import { maxPossibleScore } from "@/lib/scoring/engine";

interface Props {
  mission: Mission;
  breakdown: ScoreBreakdown;
  badge: Mission["badge"];
}

// CSS confetti particles burst from badge center.
function ConfettiBurst() {
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360;
    const distance = 60 + Math.random() * 80;
    const tx = Math.cos((angle * Math.PI) / 180) * distance;
    const ty = Math.sin((angle * Math.PI) / 180) * distance;
    const colors = ["#6366f1", "#f59e0b", "#10b981", "#8b5cf6", "#f472b6", "#38bdf8"];
    const color = colors[i % colors.length];
    const size = 4 + Math.random() * 5;
    const delay = Math.random() * 0.3;
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
            animation: `particleBurst 0.8s cubic-bezier(0,.9,.57,1) ${p.delay}s both`,
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
    pct >= 90 ? { label: "Outstanding! 🌟", color: "text-amber-400",   glow: "shadow-amber-500/30" } :
    pct >= 70 ? { label: "Great Work! 🎉",  color: "text-emerald-400", glow: "shadow-emerald-500/30" } :
    pct >= 50 ? { label: "Good Effort! 💪", color: "text-indigo-400",  glow: "shadow-indigo-500/30" } :
                { label: "Keep Going! 🚀",  color: "text-gray-400",    glow: "shadow-gray-500/10" };

  const rows = [
    { label: "Question accuracy", value: breakdown.questionPoints, max: mission.questions.reduce((s, q) => s + q.points, 0) },
    { label: "Financial decision",  value: breakdown.decisionPoints,    max: mission.decision.points },
    { label: "Reflection",          value: breakdown.reflectionPoints,  max: mission.reflection.points },
    { label: "Completion bonus",     value: breakdown.completionBonus,  max: mission.completionBonus },
  ];

  return (
    <div className="min-h-screen bg-city-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <StarField count={80} />

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg w-full">

        {/* Badge reveal */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <ConfettiBurst />
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
              className={`w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl ${grade.glow}`}
              style={{ boxShadow: "0 0 60px rgba(245,158,11,0.3), 0 0 120px rgba(245,158,11,0.1)" }}
            >
              <span className="text-6xl">🏅</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="mt-5 text-center"
          >
            <p className="text-xs text-amber-400 font-black uppercase tracking-widest mb-1">Badge Earned</p>
            <p className="text-white text-2xl font-black">{badge.name}</p>
          </motion.div>
        </div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.55 }}
          className="space-y-5"
        >
          <div className="text-center">
            <p className={`text-2xl font-black mb-1 ${grade.color}`}>{grade.label}</p>
            <motion.p
              className="text-6xl font-black text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              style={{ animation: "scoreCount 0.4s ease-out 0.65s both" }}
            >
              {breakdown.total}
              <span className="text-2xl text-gray-500 font-normal"> / {max}</span>
            </motion.p>
          </div>

          {/* Breakdown card */}
          <div className="bg-city-card border border-city-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-city-border">
              <p className="text-sm font-bold text-gray-300">Score Breakdown</p>
            </div>
            <div className="divide-y divide-city-border">
              {rows.map(({ label, value, max: rowMax }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.07 }}
                  className="flex items-center justify-between px-6 py-3.5"
                >
                  <span className="text-sm text-gray-400">{label}</span>
                  <div className="flex items-center gap-2">
                    {/* Mini progress bar */}
                    <div className="w-16 h-1.5 bg-city-border rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${value === rowMax ? "bg-emerald-500" : "bg-indigo-500"}`}
                        initial={{ width: 0 }}
                        animate={{ width: rowMax > 0 ? `${(value / rowMax) * 100}%` : "0%" }}
                        transition={{ delay: 0.75 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <span className={`text-sm font-bold min-w-[48px] text-right ${value === rowMax ? "text-emerald-400" : "text-white"}`}>
                      {value} / {rowMax}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center justify-between px-6 py-4 bg-indigo-900/20 border-t border-city-border">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="text-xl font-black text-indigo-400">{breakdown.total} pts</span>
            </div>
          </div>

          {/* Return CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Link href="/student/city">
              <Button size="lg" className="w-full shadow-2xl shadow-indigo-500/20">
                Return to MathWorld City
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
