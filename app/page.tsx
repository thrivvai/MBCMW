/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

const HOW_IT_WORKS = [
  { step: "01", title: "Create a Session",    desc: "Teachers select a grade band and instantly generate a secure 6-letter join code." },
  { step: "02", title: "Students Join",        desc: "No cumbersome logins. Students enter the code and a nickname for instant access." },
  { step: "03", title: "Immersive Missions",   desc: "Interact with real-world financial scenarios through an engaging visual interface." },
  { step: "04", title: "Live Dashboard",       desc: "Teachers monitor class progression and student performance metrics in real-time." },
];

const GRADE_BANDS = [
  {
    band: "Foundations",
    label: "Fundamental Economics",
    desc: "Simulate pricing variables, core supply constraints, and foundational budget modeling.",
    missions: ["Class Resource Audit", "Lunch Protocol", "Savings Trajectory"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    band: "Intermediate",
    label: "Applied Variable Mathematics",
    desc: "Calculate compound vectors, simulate taxation layers, and model localized profit margins.",
    missions: ["Market Distribution", "Mobile Vendor Logistics", "Subscription Deficits"],
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop",
  },
  {
    band: "Advanced",
    label: "Financial Architecture",
    desc: "Evaluate multi-tier credit structures, systemic risk strategies, and macro-market investments.",
    missions: ["Labor Compensation", "Credit Vulnerability", "Enterprise Pitch"],
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, -350]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.85]);

  return (
    <div className="relative min-h-screen w-full bg-[#010101]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ perspective: 1500 }}
      >
        {/* Photorealistic space background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover object-center opacity-60 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#010101]/30 via-transparent to-[#010101]" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex justify-center mb-10"
          >
            <div className="inline-flex items-center px-4 py-2 border border-white/20 glass-light text-xs font-semibold tracking-[0.2em] uppercase text-[#F0F0F0]">
              MathWorld Research Platform
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8, rotateX: 20, y: 50 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 1.8, delay: 0.3, type: "spring", bounce: 0.3 }}
            className="font-display font-medium tracking-tight leading-[1] mb-8 text-[#F0F0F0]"
            style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)" }}
          >
            Infinite variables.<br />
            <span className="text-[#888888]">One terminal.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="text-lg sm:text-2xl max-w-2xl mx-auto leading-relaxed mb-16 text-[#C0C0C0] font-light"
          >
            A high-fidelity spatial financial simulator engineered for precision instruction
            and systemic problem solving.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/join" className="w-full sm:w-auto">
              <Button size="lg" className="w-full min-w-[220px] rounded-sm bg-[#F0F0F0] text-[#010101] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all">
                Student Login
              </Button>
            </Link>
            <Link href="/sign-in" className="w-full sm:w-auto">
              <button className="px-8 py-4 border border-white/20 text-[#F0F0F0] text-lg min-w-[220px] rounded-sm hover:bg-white/10 transition-all font-semibold">
                Teacher Sign In
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-40 border-t border-white/10 bg-[#010101]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-24"
          >
            <h2 className="font-display text-4xl sm:text-6xl text-[#F0F0F0] tracking-tight mb-6">
              How It Works
            </h2>
            <div className="h-[1px] w-full max-w-[200px] bg-white/30" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="h-full border border-white/10 p-10 bg-[#050505] hover:bg-[#0a0a0a] hover:-translate-y-2 hover:scale-[1.02] hover:border-[#D4AF37]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-500 rounded-sm">
                  <div className="flex items-center gap-4 mb-10">
                    <p className="text-sm font-sans tracking-[0.2em] text-[#888888] group-hover:text-[#D4AF37] transition-colors duration-500">{step}</p>
                    <div className="h-px bg-white/10 flex-1 group-hover:bg-[#D4AF37]/30 transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-display font-medium mb-4 text-[#F0F0F0] group-hover:text-white transition-colors duration-500">
                    {title}
                  </h3>
                  <p className="text-sm text-[#888888] font-light leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grade Bands — Alternating image/text ─────────────────────────── */}
      <section className="relative bg-[#010101]">
        {GRADE_BANDS.map(({ band, label, desc, missions, image }, i) => (
          <div key={band} className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh] border-t border-white/10 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotateY: i % 2 === 0 ? 30 : -30 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.8, type: "spring", bounce: 0.3 }}
              className={`relative overflow-hidden ${i % 2 === 0 ? "md:order-2" : "md:order-1"}`}
              style={{ perspective: 1200 }}
            >
              <img
                src={image}
                alt={label}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-60 mix-blend-luminosity hover:mix-blend-normal hover:scale-110 transition-all duration-[3s] ease-out"
              />
            </motion.div>

            <div className={`flex flex-col justify-center px-10 py-20 sm:px-20 ${i % 2 === 0 ? "md:order-1" : "md:order-2"}`}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? 60 : -60, rotateX: 15 }}
                whileInView={{ opacity: 1, x: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
              >
                <div className="text-xs uppercase tracking-[0.3em] font-medium text-[#888888] mb-4">{band}</div>
                <h3 className="text-3xl sm:text-5xl font-display text-[#F0F0F0] mb-8">{label}</h3>
                <p className="text-lg text-[#C0C0C0] font-light leading-relaxed mb-12 max-w-xl">{desc}</p>
                <div className="flex flex-col gap-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#888888]">Curriculum Targets</span>
                  <ul className="space-y-3">
                    {missions.map((m) => (
                      <li key={m} className="flex items-center gap-4 text-[#F0F0F0] text-sm">
                        <div className="w-1 h-1 rounded-full bg-[#D4AF37]" />
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

      {/* ── Terminal CTA ─────────────────────────────────────────────────── */}
      <section className="relative z-30 px-6 py-40 border-t border-white/10 bg-[#000000]">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: -10 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, type: "spring", bounce: 0.3 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl sm:text-6xl mb-8 text-[#F0F0F0] tracking-tight">
            Ready to Start?
          </h2>
          <p className="mb-14 text-xl text-[#888888] font-light max-w-2xl mx-auto leading-relaxed">
            Deploy interactive financial simulations entirely within the browser.
            No installation or complex setup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/join">
              <button className="px-10 py-5 bg-[#F0F0F0] text-[#010101] text-lg font-semibold min-w-[240px] rounded-sm hover:bg-white transition-all">
                Student Login
              </button>
            </Link>
            <Link href="/sign-in" className="hidden sm:block">
              <button className="px-10 py-5 border border-white/20 text-[#F0F0F0] text-lg font-semibold min-w-[240px] rounded-sm hover:bg-white/10 transition-all">
                Teacher Sign In
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
