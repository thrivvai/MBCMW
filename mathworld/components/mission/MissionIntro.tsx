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

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* SVG icons replacing emojis */
function SetupIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="1.5" y="9" width="3" height="7" stroke="currentColor" strokeWidth="1.2" />
      <rect x="5.5" y="5" width="3" height="11" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9.5" y="7" width="3" height="9" stroke="currentColor" strokeWidth="1.2" />
      <rect x="13.5" y="3" width="3" height="13" stroke="currentColor" strokeWidth="1.2" />
      <line x1="0.5" y1="16.5" x2="17.5" y2="16.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ChallengeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2L10.6 6.8H16L11.7 9.8L13.3 14.5L9 11.5L4.7 14.5L6.3 9.8L2 6.8H7.4L9 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function ObjectiveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <line x1="9" y1="1" x2="9" y2="3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function AwardIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-label="Mission reward badge">
      <circle cx="24" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
      <path d="M24 8 L26.5 15.5 H34.5 L28 20 L30.5 27.5 L24 23 L17.5 27.5 L20 20 L13.5 15.5 H21.5 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M17 33L12 46M31 33L36 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 46L24 40L36 46" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

const STORY_CARDS = [
  {
    key: "setup",
    label: "The Setup",
    Icon: SetupIcon,
    accentColor: "#C9A84C",
    borderColor: "rgba(201,168,76,0.22)",
    bgColor: "rgba(201,168,76,0.05)",
  },
  {
    key: "conflict",
    label: "The Challenge",
    Icon: ChallengeIcon,
    accentColor: "#9A9694",
    borderColor: "rgba(154,150,148,0.18)",
    bgColor: "rgba(154,150,148,0.04)",
  },
  {
    key: "objective",
    label: "Your Objective",
    Icon: ObjectiveIcon,
    accentColor: "#6A8A7A",
    borderColor: "rgba(106,138,122,0.20)",
    bgColor: "rgba(106,138,122,0.05)",
  },
] as const;

export function MissionIntro({ mission, onStart }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const district = DISTRICT_CONFIG[mission.district as keyof typeof DISTRICT_CONFIG];

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -70]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const maxPoints =
    mission.questions.reduce((s, q) => s + q.points, 0) +
    mission.decision.points +
    mission.reflection.points +
    mission.completionBonus;

  return (
    <div ref={containerRef} className="relative" style={{ background: "#0B0C0F" }}>
      <StarField count={70} />
      <CosmicBackground />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col items-start justify-end px-8 sm:px-16 pb-24">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-2xl w-full">

          {/* District tag */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-6 bg-[#C9A84C]" />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#9A9694]">
              {district?.name ?? mission.district}
            </span>
          </motion.div>

          {/* Mission title */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.65, ease: EASE_OUT_EXPO }}
            className="font-display text-[#EDE8DC] tracking-tight leading-[0.92] mb-6"
            style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)", fontWeight: 700 }}
          >
            {mission.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: EASE_OUT_EXPO }}
            className="flex items-center gap-4 flex-wrap"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
              {mission.mathFocus}
            </span>
            <span className="text-[#3A3836] text-xs">·</span>
            <span className="text-[#666360] text-sm font-light">
              ~{mission.estimatedMinutes} min · up to {maxPoints} pts
            </span>
          </motion.div>

          {/* Thin line only — no "scroll to read" text (taste-design: no filler prompts) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-12"
            aria-hidden="true"
          >
            <div className="w-px h-12 bg-white/10 relative overflow-hidden">
              <div className="absolute inset-x-0 h-[45%] bg-[#C9A84C]"
                   style={{ animation: "scrollLine 2s ease-in-out infinite" }} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Story cards ────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-8 max-w-2xl mx-auto space-y-6">
        {STORY_CARDS.map(({ key, label, Icon, accentColor, borderColor, bgColor }, i) => {
          const text = mission.scenario[key as keyof typeof mission.scenario];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: EASE_OUT_EXPO }}
              className="relative"
            >
              {/* Connector */}
              {i < STORY_CARDS.length - 1 && (
                <div
                  className="absolute left-7 bottom-0 translate-y-full w-px h-6 opacity-40"
                  style={{ background: `linear-gradient(to bottom, ${accentColor}, transparent)` }}
                  aria-hidden="true"
                />
              )}

              <div
                className="rounded-sm p-6 transition-colors duration-300"
                style={{
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span style={{ color: accentColor }}>
                    <Icon />
                  </span>
                  <p
                    className="text-xs font-bold uppercase tracking-[0.18em]"
                    style={{ color: accentColor }}
                  >
                    {label}
                  </p>
                </div>
                <p className="text-base leading-relaxed font-light" style={{ color: "#C8C4BC" }}>
                  {text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ── Reward preview + CTA ──────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-36 pt-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="space-y-4"
        >
          {/* Badge reward */}
          <div
            className="flex items-center gap-4 rounded-sm px-6 py-5"
            style={{
              background: "rgba(201,168,76,0.05)",
              border: "1px solid rgba(201,168,76,0.18)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="w-14 h-14 rounded-sm flex items-center justify-center shrink-0 border border-[#C9A84C]/25"
              style={{ color: "#C9A84C" }}
            >
              <AwardIcon size={34} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5 text-[#C9A84C]">
                Mission Reward
              </p>
              <p className="font-semibold text-[#EDE8DC]">{mission.badge.name}</p>
              <p className="text-xs text-[#666360]">{mission.badge.description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display font-[700] text-xl text-[#C9A84C]">{maxPoints}</p>
              <p className="text-xs text-[#666360]">max pts</p>
            </div>
          </div>

          {/* Learning objective */}
          <div
            className="rounded-sm px-6 py-4"
            style={{
              background: "rgba(22,25,32,0.80)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="text-[10px] uppercase tracking-[0.15em] mb-1 font-semibold text-[#3A3836]">
              You will learn
            </p>
            <p className="text-sm text-[#9A9694] font-light leading-relaxed">
              {mission.learningObjective}
            </p>
          </div>

          {/* CTA — no gradient, clean parchment */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-sm font-semibold text-base transition-all duration-150 active:scale-[0.97] hover:bg-white cursor-pointer"
            style={{
              background: "#EDE8DC",
              color: "#0B0C0F",
              minHeight: "52px",
            }}
          >
            Enter the Mission
          </button>
        </motion.div>
      </section>
    </div>
  );
}
