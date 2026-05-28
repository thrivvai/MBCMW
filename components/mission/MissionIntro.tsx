"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { StarField } from "@/components/ui/StarField";
import type { Mission } from "@/lib/types";
import { DISTRICT_CONFIG } from "@/lib/utils";

interface Props {
  mission: Mission;
  onStart: () => void;
}

const STORY_CARDS = [
  { key: "setup",    label: "The Setup",     labelColor: "text-indigo-400", icon: "🌆" },
  { key: "conflict", label: "The Challenge", labelColor: "text-amber-400",  icon: "⚡" },
  { key: "objective",label: "Your Objective",labelColor: "text-emerald-400",icon: "🎯" },
] as const;

export function MissionIntro({ mission, onStart }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const district = DISTRICT_CONFIG[mission.district as keyof typeof DISTRICT_CONFIG];

  // Parallax hero text
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const maxPoints =
    mission.questions.reduce((s, q) => s + q.points, 0) +
    mission.decision.points +
    mission.reflection.points +
    mission.completionBonus;

  return (
    <div ref={containerRef} className="relative bg-city-bg">
      <StarField count={60} />

      {/* Ambient district glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl opacity-15 bg-gradient-to-br ${district?.bgClass ?? "from-indigo-900/40 to-indigo-800/20"}`} />
      </div>

      {/* ── Hero section ──────────────────────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-2xl w-full">

          {/* District badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <span className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-bold border ${district?.borderClass ?? "border-indigo-500/50"} ${district?.badgeClass ?? "bg-indigo-500/20 text-indigo-300"}`}>
              <span className="text-lg">{district?.emoji}</span>
              {district?.name ?? mission.district}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-4 leading-none"
          >
            {mission.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`text-sm font-semibold uppercase tracking-widest mb-2 ${district?.badgeClass.split(" ")[1] ?? "text-indigo-300"}`}
          >
            {mission.mathFocus}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-gray-500 text-sm"
          >
            ~{mission.estimatedMinutes} min · Up to {maxPoints} pts
          </motion.p>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-14 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-600 uppercase tracking-widest">Scroll to read the story</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-px h-10 bg-gradient-to-b from-gray-600 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Story cards — scroll-driven narrative ─────────────────────────── */}
      <section className="relative z-10 px-6 py-8 max-w-2xl mx-auto space-y-8">
        {STORY_CARDS.map(({ key, label, labelColor, icon }, i) => {
          const text = mission.scenario[key as keyof typeof mission.scenario];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
              className="relative"
            >
              {/* Connector line */}
              {i < STORY_CARDS.length - 1 && (
                <div className="absolute left-8 bottom-0 translate-y-full w-px h-8 bg-gradient-to-b from-city-border to-transparent" />
              )}

              <div className="bg-city-card border border-city-border rounded-2xl p-7 hover:border-indigo-500/20 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{icon}</span>
                  <p className={`text-xs font-black uppercase tracking-widest ${labelColor}`}>{label}</p>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed">{text}</p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ── Reward preview + CTA ──────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-32 pt-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          {/* Badge reward */}
          <div className="flex items-center gap-4 bg-amber-500/8 border border-amber-500/20 rounded-2xl px-6 py-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <span className="text-2xl">🏅</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-0.5">Mission Reward</p>
              <p className="text-white font-bold">{mission.badge.name}</p>
              <p className="text-gray-500 text-xs">{mission.badge.description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-amber-400 font-black text-xl">{maxPoints}</p>
              <p className="text-gray-500 text-xs">max pts</p>
            </div>
          </div>

          {/* Learning objective */}
          <div className="bg-city-card border border-city-border rounded-2xl px-6 py-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">You will learn</p>
            <p className="text-gray-300 text-sm">{mission.learningObjective}</p>
          </div>

          {/* CTA */}
          <Button size="lg" onClick={onStart} className="w-full text-base py-4 shadow-2xl shadow-indigo-500/20">
            Enter the Mission →
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
