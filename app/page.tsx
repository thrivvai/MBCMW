"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { StarField } from "@/components/ui/StarField";
import { Button } from "@/components/ui/button";

const FLOATING_ICONS = [
  { icon: "💰", style: { top: "18%", left: "8%",  animation: "floatA 7s ease-in-out infinite", fontSize: "2.5rem", animationDelay: "0s" } },
  { icon: "🏦", style: { top: "12%", right: "10%", animation: "floatB 8s ease-in-out infinite", fontSize: "2.2rem", animationDelay: "1.2s" } },
  { icon: "📊", style: { top: "55%", left: "5%",  animation: "floatC 6s ease-in-out infinite", fontSize: "1.8rem", animationDelay: "0.5s" } },
  { icon: "💳", style: { top: "65%", right: "7%", animation: "floatA 9s ease-in-out infinite", fontSize: "2rem",   animationDelay: "2s" } },
  { icon: "🪙", style: { top: "35%", left: "3%",  animation: "floatB 7.5s ease-in-out infinite", fontSize: "1.6rem", animationDelay: "3s" } },
  { icon: "📈", style: { top: "30%", right: "4%", animation: "floatC 8.5s ease-in-out infinite", fontSize: "1.9rem", animationDelay: "1.8s" } },
];

const GRADE_BANDS = [
  {
    band: "Grades 4–5",
    label: "Foundations",
    desc: "Budgeting, price comparison, needs vs. wants, saving goals",
    missions: ["Class Party Budget", "Lunch Combo Showdown", "Save for the Bike"],
    color: "indigo",
    emoji: "🏛️",
  },
  {
    band: "Grades 6–8",
    label: "Applied Math",
    desc: "Percentages, interest, profit & loss, sales tax, markup",
    missions: ["The Sneaker Drop", "Food Truck Friday", "Streaming Subscription Math"],
    color: "amber",
    emoji: "🛍️",
  },
  {
    band: "Grades 9–12",
    label: "Financial Strategy",
    desc: "Credit, investing, income, compound growth, entrepreneurship",
    missions: ["Summer Job Budget", "Credit Card Trap", "Startup Square Pitch"],
    color: "purple",
    emoji: "🚀",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Teacher creates a session", desc: "Pick a grade band and missions. Get a 6-letter join code in seconds.", icon: "👩‍🏫" },
  { step: "02", title: "Students join instantly", desc: "No accounts needed. Students enter the code and a nickname — that's it.", icon: "🎮" },
  { step: "03", title: "Missions come alive", desc: "Real-world money scenarios with animated stories, math challenges, and decision points.", icon: "🏙️" },
  { step: "04", title: "Teacher sees everything live", desc: "Watch student progress update in real time. Export results as CSV.", icon: "📊" },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const iconsY = useTransform(scrollY, [0, 400], [0, -140]);

  return (
    <main className="min-h-screen bg-city-bg overflow-x-hidden">
      <StarField count={100} />

      {/* ── Gradient mesh background ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-purple-600/6 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-indigo-800/6 rounded-full blur-3xl" />
      </div>

      {/* ── Floating icons ────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: iconsY }}
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {FLOATING_ICONS.map((f, i) => (
          <div
            key={i}
            className="absolute select-none opacity-20"
            style={f.style as React.CSSProperties}
          >
            {f.icon}
          </div>
        ))}
      </motion.div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-32 text-center"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            Grades 4–12 · Browser-based · No apps needed
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-6xl sm:text-8xl font-black tracking-tight text-white leading-[0.95] mb-6"
          >
            Math that{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #818CF8, #C084FC, #818CF8)",
                backgroundSize: "200% 200%",
                animation: "gradientShift 4s ease infinite",
              }}
            >
              feels real.
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Financial math missions that turn classroom laptops into an immersive city adventure. Students solve real money problems. Teachers see results live.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/join">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 py-4 shadow-2xl shadow-indigo-500/30">
                Join a Classroom →
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base px-8 py-4">
                Teacher Login
              </Button>
            </Link>
          </motion.div>

          {/* Social proof hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-sm text-gray-600"
          >
            No student accounts · No app installs · Works on any Chromebook
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-600 uppercase tracking-widest">Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-600 to-transparent" />
        </motion.div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-24 border-t border-city-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl font-black text-white">Classroom-ready in under 5 minutes</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc, icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-city-card border border-city-border rounded-2xl p-6 hover:border-indigo-500/40 transition-colors"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">{step}</p>
                <h3 className="text-white font-bold mb-2 leading-snug">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xl z-10">→</div>
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
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-3">Curriculum</p>
            <h2 className="text-4xl font-black text-white">Three grade bands. Real scenarios.</h2>
          </motion.div>

          <div className="space-y-5">
            {GRADE_BANDS.map(({ band, label, desc, missions, color, emoji }, i) => (
              <motion.div
                key={band}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className={`bg-city-card border border-city-border rounded-2xl p-7 hover:border-${color}-500/40 transition-all hover:shadow-xl hover:shadow-${color}-500/5`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-4xl">{emoji}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs font-bold text-${color}-400 uppercase tracking-wider`}>{band}</span>
                      <span className="text-gray-600">·</span>
                      <span className="text-white font-bold">{label}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {missions.map((m) => (
                      <span
                        key={m}
                        className={`text-xs px-2.5 py-1 rounded-full bg-${color}-500/10 text-${color}-300 border border-${color}-500/20`}
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
      <section className="relative z-10 px-6 py-24 border-t border-city-border">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="text-6xl mb-6">🏙️</div>
          <h2 className="text-4xl font-black text-white mb-4">Ready to enter MathWorld?</h2>
          <p className="text-gray-400 mb-8">
            Teachers: create a session in 60 seconds. Students: enter the code. No downloads. No friction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <Button size="lg" className="w-full sm:w-auto shadow-2xl shadow-indigo-500/30">
                Join a Classroom →
              </Button>
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
