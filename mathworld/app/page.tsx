/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const HOW_IT_WORKS = [
  { step: "01", title: "Create a Session",  desc: "Pick a grade level and get a 6-letter code your class can use to join instantly." },
  { step: "02", title: "Students Jump In",   desc: "No accounts needed. Students enter the code and a nickname — they're in." },
  { step: "03", title: "Play Real Missions", desc: "Students tackle real money problems through an immersive, game-like experience." },
  { step: "04", title: "Watch Live",          desc: "See every student's progress and score update in real time as they work." },
];

const GRADE_BANDS = [
  {
    band: "Grades 4–5",
    label: "Money Foundations",
    desc: "Budgets, spending choices, and saving basics in everyday situations students already know.",
    missions: ["Class Resource Audit", "Lunch Budget", "Savings Goal"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Star-filled night sky over mountain meadow",
  },
  {
    band: "Grades 6–8",
    label: "Real-World Math",
    desc: "Percentages, taxes, profit and loss — applied to situations that actually happen in life.",
    missions: ["Market Day", "Mobile Business", "Monthly Bills"],
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop",
    imageAlt: "Spiral galaxy photographed from deep space",
  },
  {
    band: "Grades 9–12",
    label: "Financial Strategy",
    desc: "Credit, investing, income decisions, and the big choices that shape financial futures.",
    missions: ["Paycheck Reality", "Credit Risk", "Startup Pitch"],
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Nebula and star formation photographed by space telescope",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 900], [0, -280]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0B0C0F]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt="Earth from orbit in deep space"
            className="w-full h-full object-cover object-center opacity-55 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0F] via-[#0B0C0F]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C0F]/40 via-transparent to-[#0B0C0F]" />
        </div>

        {/* Nav */}
        <div className="relative z-20 flex justify-between items-center px-8 sm:px-16 pt-10">
          <span className="font-display font-[600] text-[#EDE8DC] text-lg tracking-tight">
            MathWorld
          </span>
          <Link href="/sign-in">
            <button
              className="text-sm text-[#9A9694] border border-white/10 px-5 py-2.5 rounded-sm hover:text-[#EDE8DC] hover:border-white/20 transition-colors duration-200 cursor-pointer"
              style={{ minHeight: "44px" }}
            >
              Teacher Sign In
            </button>
          </Link>
        </div>

        {/* Hero copy */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col justify-end flex-1 px-8 sm:px-16 pb-20 sm:pb-28"
        >
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="h-px w-8 bg-[#C9A84C]" />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#9A9694]">
                K–12 Financial Math
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: EASE_OUT_EXPO }}
              className="font-display leading-[0.92] tracking-tight text-[#EDE8DC] mb-8"
              style={{ fontSize: "clamp(3.5rem, 11vw, 7.5rem)", fontWeight: 700 }}
            >
              Math class<br />
              just got<br />
              <em className="not-italic" style={{ color: "#666360" }}>
                interesting.
              </em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: EASE_OUT_EXPO }}
              className="text-lg leading-relaxed text-[#9A9694] font-light max-w-sm mb-12"
            >
              Real money problems. Real math skills.
              No boring worksheets.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: EASE_OUT_EXPO }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/join" className="cursor-pointer">
                <button
                  className="px-8 py-4 bg-[#EDE8DC] text-[#0B0C0F] text-base font-semibold rounded-sm hover:bg-white active:scale-[0.97] transition-all duration-150 cursor-pointer"
                  style={{ minWidth: "180px", minHeight: "52px" }}
                >
                  I&apos;m a Student
                </button>
              </Link>
              <Link href="/sign-in" className="cursor-pointer">
                <button
                  className="px-8 py-4 border border-white/12 text-[#EDE8DC] text-base font-medium rounded-sm hover:bg-white/5 hover:border-white/20 active:scale-[0.97] transition-all duration-150 cursor-pointer"
                  style={{ minWidth: "180px", minHeight: "52px" }}
                >
                  I&apos;m a Teacher
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-8 sm:left-16 z-10"
          aria-hidden="true"
        >
          <div className="w-px h-14 bg-white/8 overflow-hidden rounded-full relative">
            <div
              className="absolute inset-x-0 h-[45%] bg-[#C9A84C] rounded-full"
              style={{ animation: "scrollLine 2s ease-in-out infinite" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="relative z-10 px-8 sm:px-16 pt-36 pb-32 bg-[#0B0C0F]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
            className="mb-20 flex items-end justify-between border-b border-white/8 pb-10"
          >
            <h2
              className="font-display text-[#EDE8DC] tracking-tight leading-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 600 }}
            >
              How It Works
            </h2>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#666360] hidden sm:block pb-1">
              Four steps
            </span>
          </motion.div>

          <div>
            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE_OUT_EXPO }}
                className="group flex items-start gap-8 sm:gap-16 py-10 border-b border-white/7 cursor-default"
              >
                <span
                  className="font-display shrink-0 select-none transition-colors duration-300 group-hover:text-[#C9A84C]"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "#1C1D24", lineHeight: 1 }}
                >
                  {step}
                </span>
                <div className="pt-1">
                  <h3 className="font-sans font-semibold text-xl text-[#EDE8DC] mb-2 transition-colors duration-200 group-hover:text-white">
                    {title}
                  </h3>
                  <p className="text-[#666360] font-light leading-relaxed text-base max-w-lg">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grade Bands ───────────────────────────────────────────────────── */}
      <section className="relative bg-[#0B0C0F]">
        {GRADE_BANDS.map(({ band, label, desc, missions, image, imageAlt }, i) => (
          <div
            key={band}
            className="grid grid-cols-1 md:grid-cols-2 min-h-[65vh] border-t border-white/8 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.0, ease: EASE_OUT_EXPO }}
              className={`relative overflow-hidden ${i % 2 === 0 ? "md:order-2" : "md:order-1"}`}
            >
              <img
                src={image}
                alt={imageAlt}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-55 mix-blend-luminosity transition-all duration-[2s] ease-out hover:opacity-75 hover:mix-blend-normal hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B0C0F]/40" />
            </motion.div>

            <div className={`flex flex-col justify-center px-10 py-20 sm:px-16 ${i % 2 === 0 ? "md:order-1" : "md:order-2"}`}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.08 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-6 bg-[#C9A84C]" />
                  <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#9A9694]">
                    {band}
                  </span>
                </div>
                <h3
                  className="font-display text-[#EDE8DC] tracking-tight mb-7 leading-tight"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600 }}
                >
                  {label}
                </h3>
                <p className="text-base text-[#666360] font-light leading-relaxed mb-10 max-w-sm">
                  {desc}
                </p>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#3A3836] block mb-3">
                    Sample missions
                  </span>
                  <ul className="space-y-2.5">
                    {missions.map((m) => (
                      <li key={m} className="flex items-center gap-3.5 text-[#9A9694] text-sm font-light">
                        <div className="w-1 h-1 rounded-full bg-[#C9A84C] shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-8 sm:px-16 py-40 border-t border-white/8 bg-[#0B0C0F]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-6 bg-[#C9A84C]" />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#9A9694]">
                Ready
              </span>
            </div>
            <h2
              className="font-display text-[#EDE8DC] tracking-tight leading-tight mb-8 max-w-2xl"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 700 }}
            >
              Start a class in under a minute.
            </h2>
            <p className="text-lg text-[#666360] font-light max-w-md leading-relaxed mb-12">
              No downloads. No student accounts.
              Just share a code and go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/join" className="cursor-pointer">
                <button
                  className="px-8 py-4 bg-[#EDE8DC] text-[#0B0C0F] text-base font-semibold rounded-sm hover:bg-white active:scale-[0.97] transition-all duration-150 cursor-pointer"
                  style={{ minWidth: "200px", minHeight: "52px" }}
                >
                  I&apos;m a Student
                </button>
              </Link>
              <Link href="/sign-in" className="cursor-pointer">
                <button
                  className="px-8 py-4 border border-white/12 text-[#EDE8DC] text-base font-medium rounded-sm hover:bg-white/5 hover:border-white/20 active:scale-[0.97] transition-all duration-150 cursor-pointer"
                  style={{ minWidth: "200px", minHeight: "52px" }}
                >
                  I&apos;m a Teacher
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/7 px-8 sm:px-16 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span className="font-display text-[#3A3836] text-sm font-[400]">MathWorld Classroom</span>
          <span className="text-xs text-[#3A3836] tracking-wide">Financial math learning for K–12</span>
        </div>
      </footer>
    </div>
  );
}
