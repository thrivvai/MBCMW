"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ScoreBreakdown, Mission } from "@/lib/types";
import { maxPossibleScore } from "@/lib/scoring/engine";

interface Props {
  mission: Mission;
  breakdown: ScoreBreakdown;
  badge: Mission["badge"];
}

export function MissionComplete({ mission, breakdown, badge }: Props) {
  const max = maxPossibleScore(mission);
  const pct = Math.round((breakdown.total / max) * 100);

  const grade =
    pct >= 90 ? { label: "Outstanding!", color: "text-amber-400" } :
    pct >= 70 ? { label: "Great Work!", color: "text-emerald-400" } :
    pct >= 50 ? { label: "Good Effort!", color: "text-indigo-400" } :
                { label: "Keep Going!", color: "text-gray-400" };

  const rows = [
    { label: "Question accuracy", value: breakdown.questionPoints, max: mission.questions.reduce((s, q) => s + q.points, 0) },
    { label: "Financial decision", value: breakdown.decisionPoints, max: mission.decision.points },
    { label: "Reflection", value: breakdown.reflectionPoints, max: mission.reflection.points },
    { label: "Completion bonus", value: breakdown.completionBonus, max: mission.completionBonus },
  ];

  return (
    <div className="min-h-screen bg-city-bg flex flex-col items-center justify-center p-6">
      {/* Badge reveal */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="mb-8 flex flex-col items-center"
      >
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30 mb-4">
          <span className="text-5xl">🏅</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-1">Badge Earned</p>
          <p className="text-white text-xl font-bold">{badge.name}</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-lg w-full space-y-5"
      >
        {/* Score headline */}
        <div className="text-center">
          <p className={`text-3xl font-black mb-1 ${grade.color}`}>{grade.label}</p>
          <p className="text-5xl font-black text-white">
            {breakdown.total}
            <span className="text-2xl text-gray-400 font-normal"> / {max}</span>
          </p>
        </div>

        {/* Score breakdown */}
        <div className="bg-city-card border border-city-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-city-border">
            <p className="text-sm font-semibold text-gray-300">Score Breakdown</p>
          </div>
          <div className="divide-y divide-city-border">
            {rows.map(({ label, value, max: rowMax }) => (
              <div key={label} className="flex items-center justify-between px-6 py-3">
                <span className="text-sm text-gray-400">{label}</span>
                <span className={`text-sm font-bold ${value === rowMax ? "text-emerald-400" : "text-white"}`}>
                  {value} / {rowMax}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-6 py-4 bg-indigo-900/20">
            <span className="text-sm font-bold text-white">Total</span>
            <span className="text-lg font-black text-indigo-400">{breakdown.total} pts</span>
          </div>
        </div>

        <Link href="/student/city">
          <Button size="lg" className="w-full mt-2">
            Return to MathWorld City
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
