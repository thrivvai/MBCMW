"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Mission } from "@/lib/types";
import { DISTRICT_CONFIG } from "@/lib/utils";

interface Props {
  mission: Mission;
  onStart: () => void;
}

export function MissionIntro({ mission, onStart }: Props) {
  const district = DISTRICT_CONFIG[mission.district as keyof typeof DISTRICT_CONFIG];

  return (
    <div className="min-h-screen bg-city-bg flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full"
      >
        {/* District badge */}
        <div className="flex justify-center mb-6">
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${district?.badgeClass ?? "bg-indigo-500/20 text-indigo-300"}`}>
            <span>{district?.emoji}</span>
            {district?.name ?? mission.district}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          {mission.title}
        </h1>
        <p className="text-indigo-400 text-center text-sm mb-10">
          {mission.mathFocus}
        </p>

        {/* Story cards */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-city-card border border-city-border rounded-2xl p-6"
          >
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">The Setup</p>
            <p className="text-gray-200 leading-relaxed">{mission.scenario.setup}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="bg-city-card border border-city-border rounded-2xl p-6"
          >
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">The Challenge</p>
            <p className="text-gray-200 leading-relaxed">{mission.scenario.conflict}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-6"
          >
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Your Objective</p>
            <p className="text-white font-medium">{mission.scenario.objective}</p>
          </motion.div>
        </div>

        {/* Reward preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3"
        >
          <span className="text-2xl">🏅</span>
          <div>
            <p className="text-xs text-amber-400 font-medium">Mission Reward</p>
            <p className="text-white text-sm font-semibold">{mission.badge.name}</p>
          </div>
          <span className="ml-auto text-amber-400 text-sm font-bold">
            Up to {mission.questions.reduce((s, q) => s + q.points, 0) + mission.decision.points + mission.reflection.points + mission.completionBonus} pts
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mt-8 flex justify-center"
        >
          <Button size="lg" onClick={onStart} className="px-12">
            Start Mission →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
