"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { StarField } from "@/components/ui/StarField";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import type { Mission } from "@/lib/types";
import { DISTRICT_CONFIG } from "@/lib/utils";

interface Props {
  mission: Mission;
  onStart: () => void;
}

const STORY_CARDS = [
  { key: "setup",     label: "The Setup",      icon: "🌆", accentColor: "#8B5CF6", borderColor: "rgba(139,92,246,0.25)", bgColor: "rgba(139,92,246,0.06)" },
  { key: "conflict",  label: "The Challenge",  icon: "⚡", accentColor: "#E8A820", borderColor: "rgba(232,168,32,0.25)",  bgColor: "rgba(232,168,32,0.05)"  },
  { key: "objective", label: "Your Objective", icon: "🎯", accentColor: "#00CCD8", borderColor: "rgba(0,204,216,0.22)",   bgColor: "rgba(0,204,216,0.05)"   },
] as const;

export function MissionIntro({ mission, onStart }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const district = DISTRICT_CONFIG[mission.district as keyof typeof DISTRICT_CONFIG];

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  const maxPoints =
    mission.questions.reduce((s, q) => s + q.points, 0) +
    mission.decision.points +
    mission.reflection.points +
    mission.completionBonus;

  return (
    <div ref={containerRef} className="relative" style={{ background: "#030507" }}>
      <StarField count={80} />
      <CosmicBackground />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-2xl w-full">

          {/* District badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-10"
          >
            <span
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.25)",
                color: "#C4B5FD",
                letterSpacing: "0.05em",
              }}
            >
              <span className="text-lg">{district?.emoji}</span>
              {district?.name ?? mission.district}
            </span>
          </motion.div>

          {/* Mission title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold tracking-tight leading-[0.9] mb-6"
            style={{
              fontSize: "clamp(3rem, 10vw, 7rem)",
              color: "#E8E4D8",
            }}
          >
            {mission.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: "#E8A820" }}
          >
            {mission.mathFocus}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-sm"
            style={{ color: "#2A2A3A" }}
          >
            ~{mission.estimatedMinutes} min · Up to {maxPoints} pts
          </motion.p>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-[0.2em]" style={{ color: "#2A2A3A" }}>
              Scroll to read the story
            </span>
            <motion.div
              animate={{ scaleY: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-px h-12 origin-top"
              style={{ background: "linear-gradient(to bottom, rgba(139,92,246,0.6), transparent)" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Story cards — scroll-driven narrative ─────────────────────────── */}
      <section className="relative z-10 px-6 py-8 max-w-2xl mx-auto space-y-8">
        {STORY_CARDS.map(({ key, label, icon, accentColor, borderColor, bgColor }, i) => {
          const text = mission.scenario[key as keyof typeof mission.scenario];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Connector line */}
              {i < STORY_CARDS.length - 1 && (
                <div
                  className="absolute left-8 bottom-0 translate-y-full w-px h-8"
                  style={{ background: `linear-gradient(to bottom, ${accentColor}30, transparent)` }}
                />
              )}

              <div
                className="rounded-2xl p-7 transition-all duration-300"
                style={{
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{icon}</span>
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{ color: accentColor }}
                  >
                    {label}
                  </p>
                </div>
                <p className="text-lg leading-relaxed" style={{ color: "#D4D0C8", fontWeight: 300 }}>
                  {text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ── Reward preview + CTA ──────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-36 pt-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-5"
        >
          {/* Badge reward card */}
          <div
            className="flex items-center gap-4 rounded-2xl px-6 py-5"
            style={{
              background: "rgba(232,168,32,0.06)",
              border: "1px solid rgba(232,168,32,0.20)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #E8A820, #F5C040)",
                boxShadow: "0 0 20px rgba(232,168,32,0.25)",
              }}
            >
              <span className="text-2xl">🏅</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.15em] mb-0.5" style={{ color: "#E8A820" }}>
                Mission Reward
              </p>
              <p className="font-semibold" style={{ color: "#E8E4D8" }}>{mission.badge.name}</p>
              <p className="text-xs" style={{ color: "#5A5A6E" }}>{mission.badge.description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-black text-xl" style={{ color: "#F5C040" }}>{maxPoints}</p>
              <p className="text-xs" style={{ color: "#5A5A6E" }}>max pts</p>
            </div>
          </div>

          {/* Learning objective */}
          <div
            className="rounded-2xl px-6 py-4"
            style={{
              background: "rgba(13,16,32,0.70)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="text-xs uppercase tracking-[0.15em] mb-1 font-semibold" style={{ color: "#5A5A6E" }}>
              You will learn
            </p>
            <p className="text-sm" style={{ color: "#9A9AB0" }}>{mission.learningObjective}</p>
          </div>

          {/* CTA */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #E8A820, #F5C040 50%, #00CCD8)",
              color: "#030507",
              boxShadow: "0 0 40px rgba(232,168,32,0.20), 0 0 80px rgba(0,204,216,0.08)",
            }}
          >
            Enter the Mission →
          </button>
        </motion.div>
      </section>
    </div>
  );
}
