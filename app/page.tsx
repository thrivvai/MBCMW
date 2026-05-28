"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { StarField } from "@/components/ui/StarField";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import { Button } from "@/components/ui/button";

const HOW_IT_WORKS = [
  { step: "01", title: "Teacher creates a session", desc: "Pick a grade band and missions. Get a 6-letter join code in seconds.", icon: "👩‍🏫" },
  { step: "02", title: "Students join instantly", desc: "No accounts needed. Students enter the code and a nickname — that's it.", icon: "🎮" },
  { step: "03", title: "Missions come alive", desc: "Real-world money scenarios with animated stories, math challenges, and decision points.", icon: "🏙️" },
  { step: "04", title: "Teacher sees everything live", desc: "Watch student progress update in real time. Export results as CSV.", icon: "📊" },
];

const GRADE_BANDS = [
  {
    band: "Grades 4–5",
    label: "Foundations",
    desc: "Budgeting, price comparison, needs vs. wants, saving goals",
    missions: ["Class Party Budget", "Lunch Combo Showdown", "Save for the Bike"],
    accentColor: "rgba(139,92,246,",
    borderColor: "rgba(139,92,246,0.25)",
    tagColor: "rgba(139,92,246,0.12)",
    tagText: "#C4B5FD",
    emoji: "🏛️",
  },
  {
    band: "Grades 6–8",
    label: "Applied Math",
    desc: "Percentages, interest, profit & loss, sales tax, markup",
    missions: ["The Sneaker Drop", "Food Truck Friday", "Streaming Subscription Math"],
    accentColor: "rgba(232,168,32,",
    borderColor: "rgba(232,168,32,0.25)",
    tagColor: "rgba(232,168,32,0.10)",
    tagText: "#F5C040",
    emoji: "🛍️",
  },
  {
    band: "Grades 9–12",
    label: "Financial Strategy",
    desc: "Credit, investing, income, compound growth, entrepreneurship",
    missions: ["Summer Job Budget", "Credit Card Trap", "Startup Square Pitch"],
    accentColor: "rgba(0,204,216,",
    borderColor: "rgba(0,204,216,0.20)",
    tagColor: "rgba(0,204,216,0.08)",
    tagText: "#67E8F9",
    emoji: "🚀",
  },
];

function HeroGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Radial fade so grid fades at edges */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, #030507 100%)",
        }}
      />
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  return (
    <main className="min-h-screen bg-[#030507] overflow-x-hidden">
      <StarField count={120} />
      <CosmicBackground />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      >
        <HeroGrid />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center mb-10"
          >
            <span
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                background: "rgba(139,92,246,0.10)",
                border: "1px solid rgba(139,92,246,0.30)",
                color: "#C4B5FD",
                letterSpacing: "0.12em",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"
                style={{ animation: "neonPulse 2s ease-in-out infinite", boxShadow: "0 0 8px #8B5CF6" }}
              />
              Grades 4–12 · Browser-based · No apps needed
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold tracking-tight leading-[0.9] mb-8"
            style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}
          >
            <span style={{ color: "#E8E4D8" }}>Math that</span>
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #E8A820 0%, #F5C040 30%, #00CCD8 60%, #8B5CF6 100%)",
                backgroundSize: "200% 200%",
                animation: "gradientShift 5s ease infinite",
              }}
            >
              feels real.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
            style={{ color: "#5A5A6E", fontWeight: 300 }}
          >
            Financial math missions that turn classroom laptops into an immersive city adventure.
            Students solve real money problems. Teachers see results live.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/join">
              <button
                className="w-full sm:w-auto text-base px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #E8A820, #F5C040 50%, #00CCD8)",
                  backgroundSize: "200% 100%",
                  color: "#030507",
                  boxShadow: "0 0 40px rgba(232,168,32,0.25), 0 0 80px rgba(0,204,216,0.10)",
                }}
              >
                Join a Classroom →
              </button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Teacher Login
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-sm"
            style={{ color: "#2A2A3A" }}
          >
            No student accounts · No app installs · Works on any Chromebook
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-[0.2em]" style={{ color: "#2A2A3A" }}>Scroll</span>
          <motion.div
            animate={{ scaleY: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-12 origin-top"
            style={{ background: "linear-gradient(to bottom, rgba(139,92,246,0.6), transparent)" }}
          />
        </motion.div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-24" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#8B5CF6" }}>
              How It Works
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl" style={{ color: "#E8E4D8" }}>
              Classroom-ready in under 5 minutes
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map(({ step, title, desc, icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="relative rounded-2xl p-6"
                style={{
                  background: "rgba(13,16,32,0.8)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="text-4xl mb-4">{icon}</div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{ color: "#8B5CF6" }}>{step}</p>
                <h3 className="font-semibold mb-2 leading-snug" style={{ color: "#E8E4D8" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5A5A6E" }}>{desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-lg" style={{ color: "#2A2A3A" }}>→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grade bands ──────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#E8A820" }}>
              Curriculum
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl" style={{ color: "#E8E4D8" }}>
              Three grade bands. Real scenarios.
            </h2>
          </motion.div>

          <div className="space-y-4">
            {GRADE_BANDS.map(({ band, label, desc, missions, accentColor, borderColor, tagColor, tagText, emoji }, i) => (
              <motion.div
                key={band}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-2xl p-7 transition-all duration-300"
                style={{
                  background: "rgba(13,16,32,0.7)",
                  border: `1px solid ${borderColor}`,
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="text-4xl">{emoji}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: tagText }}>{band}</span>
                      <span style={{ color: "#2A2A3A" }}>·</span>
                      <span className="font-semibold" style={{ color: "#E8E4D8" }}>{label}</span>
                    </div>
                    <p className="text-sm" style={{ color: "#5A5A6E" }}>{desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {missions.map((m) => (
                      <span
                        key={m}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          background: tagColor,
                          color: tagText,
                          border: `1px solid ${borderColor}`,
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-28" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div
            className="text-7xl mb-8 inline-block"
            style={{ filter: "drop-shadow(0 0 30px rgba(232,168,32,0.4))" }}
          >
            🏙️
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{ color: "#E8E4D8" }}>
            Ready to enter MathWorld?
          </h2>
          <p className="mb-10 text-lg" style={{ color: "#5A5A6E", fontWeight: 300 }}>
            Teachers: create a session in 60 seconds. Students: enter the code.
            No downloads. No friction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <button
                className="w-full sm:w-auto text-base px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #E8A820, #F5C040 50%, #00CCD8)",
                  color: "#030507",
                  boxShadow: "0 0 40px rgba(232,168,32,0.20), 0 0 80px rgba(0,204,216,0.08)",
                }}
              >
                Join a Classroom →
              </button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Teacher Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
