# MathWorld Classroom — UI Component Handoff

> **Purpose:** This document contains every frontend file a developer needs to redesign the UI.
> The application logic (API routes, database, auth, scoring engine, mission content) lives elsewhere
> and must not be touched. All files below are safe to restyle.

---

## Architecture Overview

```
Stack:  Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion
Fonts:  Syne (display headlines, 800w) + Space Grotesk (body, 300–700w) — loaded via next/font/google
Icons:  Emoji only — no icon library
Anim:   Framer Motion for enter/exit; CSS keyframes for continuous effects
```

### What NOT to touch

| Path | Reason |
|---|---|
| `app/api/**` | Server-side API routes — auth, DB writes, scoring |
| `lib/scoring/engine.ts` | Scoring logic — `checkAnswer()`, `scoreAnswer()`, `buildScoreBreakdown()` |
| `lib/types/index.ts` | TypeScript contracts shared across the whole app |
| `lib/supabase/**` | Database client setup |
| `stores/student-store.ts` | Zustand session state — `setSession()` shape must stay |
| `stores/mission-store.ts` | Mission step machine — step ordering logic |
| `content/missions/*.json` | Mission content (questions, decisions, scoring) |
| `middleware.ts` | Auth routing — do not change public/private route list |
| `app/teacher/**` | Teacher dashboard — not in scope of this redesign |
| `app/sign-in/**` · `app/sign-up/**` | Clerk-managed auth pages |

### Props/callbacks that must stay intact

Every component in this document receives typed props. The **shape of those props is a hard contract** — the developer can change how they're rendered but not what they accept or call.

---

## Design System

### Color Palette

```
Background void:   #030507   (body bg, outermost wrapper)
Deep surface:      #0D1020   (card backgrounds)
Elevated surface:  #121628   (hover states, nested cards)
Border:            #1A1F35   (or rgba(255,255,255,0.05–0.08) for glass)

Warm gold:         #E8A820  /  #F5C040  /  #C8860A
Electric teal:     #00CCD8  /  #00A8B8
Aurora violet:     #8B5CF6  /  #6D28D9
Emerald:           #34D399  /  #10B981   (correct answers, completion)
Danger red:        #F87171  /  #EF4444   (wrong answers, errors)

Text primary:      #E8E4D8  (warm off-white)
Text secondary:    #9A9AB0
Text muted:        #5A5A6E
Text ghost:        #2A2A3A
```

### Tailwind Config (`tailwind.config.ts`)

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        city: {
          bg: "#030507",
          card: "#0D1020",
          border: "#1A1F35",
          elevated: "#121628",
        },
        cosmic: {
          gold: "#E8A820",
          "gold-bright": "#F5C040",
          "gold-dim": "#C8860A",
          teal: "#00CCD8",
          "teal-dark": "#007080",
          violet: "#8B5CF6",
          "violet-deep": "#6D28D9",
          text: "#E8E4D8",
          muted: "#5A5A6E",
        },
        district: {
          budget: "#6366F1",
          savings: "#10B981",
          market: "#E8A820",
          credit: "#EF4444",
          startup: "#8B5CF6",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        sans: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "cosmic-drift": "cosmicDrift 28s ease-in-out infinite",
        "aurora": "auroraShift 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        cosmicDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(2%, 1.5%) scale(1.03)" },
          "66%": { transform: "translate(-1.5%, 2%) scale(0.98)" },
        },
        auroraShift: {
          "0%, 100%": { opacity: "0.08" },
          "50%": { opacity: "0.22" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Global CSS (`app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-space: "Space Grotesk", system-ui, sans-serif;
  --font-syne: "Syne", system-ui, sans-serif;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  background-color: #030507;
  color: #E8E4D8;
  font-family: var(--font-space);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ─── Glassmorphism utilities ─────────────────────────────────────────────── */
.glass {
  background: rgba(13, 16, 32, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.glass-light {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* ─── Keyframes ───────────────────────────────────────────────────────────── */
@keyframes starPulse {
  0%, 100% { opacity: 0.08; transform: scale(1); }
  50%       { opacity: 1;    transform: scale(1.6); }
}

@keyframes starGlow {
  0%, 100% { opacity: 0.2; box-shadow: 0 0 0 0 transparent; }
  50%       { opacity: 0.9; box-shadow: 0 0 6px 2px currentColor; }
}

@keyframes cosmicDrift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(2%, 1.5%) scale(1.03); }
  66%       { transform: translate(-1.5%, 2%) scale(0.98); }
}

@keyframes auroraShift {
  0%, 100% { opacity: 0.08; }
  50%       { opacity: 0.22; }
}

@keyframes floatA {
  0%, 100% { transform: translateY(0px)   rotate(0deg); }
  50%       { transform: translateY(-20px) rotate(8deg); }
}

@keyframes floatB {
  0%, 100% { transform: translateY(0px)  rotate(0deg); }
  50%       { transform: translateY(16px) rotate(-5deg); }
}

@keyframes floatC {
  0%, 100% { transform: translateY(-10px) rotate(0deg); }
  50%       { transform: translateY(10px)  rotate(10deg); }
}

@keyframes gradientShift {
  0%, 100% { background-position: 0%   50%; }
  50%       { background-position: 100% 50%; }
}

@keyframes neonPulse {
  0%, 100% { box-shadow: 0 0 8px currentColor, 0 0 24px currentColor; }
  50%       { box-shadow: 0 0 18px currentColor, 0 0 50px currentColor, 0 0 80px currentColor; }
}

@keyframes scoreCount {
  from { transform: translateY(14px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

@keyframes particleBurst {
  0%   { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}

@keyframes auroraBar {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes orbitSlow {
  0%   { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── Aurora progress bar ─────────────────────────────────────────────────── */
.aurora-bar {
  background: linear-gradient(
    90deg, #6D28D9, #8B5CF6, #00CCD8, #E8A820, #8B5CF6, #6D28D9
  );
  background-size: 300% 100%;
  animation: auroraBar 4s ease infinite;
}

/* ─── Reduced motion ──────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ─── Scrollbar ───────────────────────────────────────────────────────────── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #030507; }
::-webkit-scrollbar-thumb { background: #1A1F35; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #8B5CF6; }
```

---

## Root Layout (`app/layout.tsx`)

```tsx
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MathWorld Classroom",
  description: "Gamified financial math missions for K–12 students",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

> `ClerkProvider` and the font variables **must** stay. Everything else (html attributes, body className) can be changed.

---

## UI Primitives

### `components/ui/StarField.tsx`

A fixed, full-viewport CSS-only star field. No canvas. Used on every screen.

```tsx
"use client";

import { useRef } from "react";

interface Star {
  x: number; y: number; size: number; delay: number;
  duration: number; opacity: number; color: string;
  hasGlow: boolean; glowColor: string;
}

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const STAR_COLORS = [
  "#E8E4D8", "#E8E4D8", "#E8E4D8",
  "#C8D4F8", // cool blue-white
  "#F5C040", // warm gold (rare)
  "#00CCD8", // teal (rare)
];
const GLOW_COLORS = ["#8B5CF6", "#E8A820", "#00CCD8", "#ffffff"];

export function StarField({ count = 100 }: { count?: number }) {
  const starsRef = useRef<Star[]>([]);

  if (starsRef.current.length === 0) {
    const rand = seededRand(42);
    starsRef.current = Array.from({ length: count }, () => {
      const size = rand() < 0.15 ? rand() * 2 + 2 : rand() < 0.6 ? rand() * 1 + 0.8 : rand() * 0.6 + 0.3;
      const hasGlow = size > 1.8 && rand() < 0.4;
      return {
        x: rand() * 100, y: rand() * 100, size,
        delay: rand() * 8, duration: rand() * 5 + 4,
        opacity: rand() * 0.6 + 0.15,
        color: STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)],
        hasGlow,
        glowColor: GLOW_COLORS[Math.floor(rand() * GLOW_COLORS.length)],
      };
    });
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {starsRef.current.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            background: s.color, opacity: s.opacity,
            animation: s.hasGlow
              ? `starGlow ${s.duration}s ease-in-out ${s.delay}s infinite`
              : `starPulse ${s.duration}s ease-in-out ${s.delay}s infinite`,
            color: s.glowColor,
          }}
        />
      ))}
    </div>
  );
}
```

> **Do not remove the seeded RNG** — it prevents hydration mismatches between server and client renders.

---

### `components/ui/CosmicBackground.tsx`

Slow-drifting nebula atmosphere. Used on every screen, renders behind StarField.

```tsx
"use client";

const ORBS = [
  { color: "139,92,246",  size: "75vw",  left: "15%",  top: "5%",   duration: "32s", delay: "0s"   },
  { color: "232,168,32",  size: "55vw",  left: "72%",  top: "55%",  duration: "40s", delay: "-12s" },
  { color: "0,204,216",   size: "65vw",  left: "5%",   top: "65%",  duration: "26s", delay: "-18s" },
  { color: "109,40,217",  size: "48vw",  left: "78%",  top: "8%",   duration: "50s", delay: "-25s" },
  { color: "0,168,184",   size: "40vw",  left: "45%",  top: "80%",  duration: "36s", delay: "-6s"  },
];

export function CosmicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size, height: orb.size,
            left: orb.left, top: orb.top,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(${orb.color},0.07) 0%, rgba(${orb.color},0.02) 40%, transparent 70%)`,
            animation: `cosmicDrift ${orb.duration} ease-in-out ${orb.delay} infinite`,
            filter: "blur(50px)",
          }}
        />
      ))}
    </div>
  );
}
```

---

### `components/ui/TiltCard.tsx`

Mouse-tracked 3D tilt with specular highlight. Wraps district cards on the city map.

```tsx
"use client";

import { useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number; // degrees of tilt, default 12
}

export function TiltCard({ children, className = "", intensity = 12 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const specularRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    const spec = specularRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (y - 0.5) * intensity;
    const ry = (x - 0.5) * intensity;
    el.style.transform = `perspective(900px) rotateX(${-rx}deg) rotateY(${ry}deg) translateZ(10px) scale(1.02)`;
    if (spec) {
      spec.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.06) 0%, transparent 65%)`;
      spec.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    const spec = specularRef.current;
    if (el) el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)";
    if (spec) spec.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.18s ease-out", willChange: "transform" }}
    >
      {/* Specular highlight — follows cursor */}
      <div
        ref={specularRef}
        className="absolute inset-0 rounded-2xl pointer-events-none z-10 opacity-0"
        style={{ transition: "opacity 0.2s ease, background 0.1s ease" }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
```

---

### `components/ui/button.tsx`

```tsx
"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030507] disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden",
          {
            "bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white shadow-lg shadow-[#6D28D9]/30 hover:shadow-[#8B5CF6]/40 hover:brightness-110 focus-visible:ring-[#8B5CF6] active:scale-[0.98]":
              variant === "primary",
            "bg-[#0D1020] border border-[#1A1F35] hover:border-[#8B5CF6]/40 text-[#E8E4D8] hover:text-white hover:bg-[#121628]":
              variant === "secondary",
            "text-[#5A5A6E] hover:text-[#E8E4D8] hover:bg-white/5":
              variant === "ghost",
            "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20":
              variant === "danger",
          },
          {
            "text-sm px-3 py-1.5 gap-1.5": size === "sm",
            "text-sm px-4 py-2.5 gap-2": size === "md",
            "text-base px-6 py-3.5 gap-2": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
```

---

### `components/ui/progress.tsx`

```tsx
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0–100
  className?: string;
  color?: "aurora" | "indigo" | "emerald" | "amber";
}

export function Progress({ value, className, color = "aurora" }: ProgressProps) {
  const barClass =
    color === "aurora"   ? "aurora-bar" :
    color === "emerald"  ? "bg-emerald-500" :
    color === "amber"    ? "bg-amber-500" :
                           "bg-indigo-500";

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full bg-[#1A1F35] rounded-full overflow-hidden", className)}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", barClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
```

---

### `components/ui/input.tsx`

```tsx
import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium" style={{ color: "#9A9AB0" }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-[#030507] border border-[#1A1F35] rounded-xl px-4 py-3 text-[#E8E4D8] placeholder:text-[#2A2A3A] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent transition-all",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
```

---

### `components/ui/card.tsx`

```tsx
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ className, glow, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-city-card border border-city-border rounded-2xl",
        glow && "shadow-lg shadow-[#8B5CF6]/10",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-4", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-bold", className)} style={{ color: "#E8E4D8" }} {...props} />;
}
```

---

## Pages

### Landing Page (`app/page.tsx`)

**No props.** Purely presentational — the two `Link` targets (`/join`, `/sign-in`) must stay.

```tsx
"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { StarField } from "@/components/ui/StarField";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import { Button } from "@/components/ui/button";

const HOW_IT_WORKS = [
  { step: "01", title: "Teacher creates a session", desc: "Pick a grade band and missions. Get a 6-letter join code in seconds.", icon: "👩‍🏫" },
  { step: "02", title: "Students join instantly",   desc: "No accounts needed. Students enter the code and a nickname — that's it.", icon: "🎮" },
  { step: "03", title: "Missions come alive",       desc: "Real-world money scenarios with animated stories, math challenges, and decision points.", icon: "🏙️" },
  { step: "04", title: "Teacher sees everything live", desc: "Watch student progress update in real time. Export results as CSV.", icon: "📊" },
];

const GRADE_BANDS = [
  {
    band: "Grades 4–5", label: "Foundations",
    desc: "Budgeting, price comparison, needs vs. wants, saving goals",
    missions: ["Class Party Budget", "Lunch Combo Showdown", "Save for the Bike"],
    accentColor: "rgba(139,92,246,", borderColor: "rgba(139,92,246,0.25)",
    tagColor: "rgba(139,92,246,0.12)", tagText: "#C4B5FD", emoji: "🏛️",
  },
  {
    band: "Grades 6–8", label: "Applied Math",
    desc: "Percentages, interest, profit & loss, sales tax, markup",
    missions: ["The Sneaker Drop", "Food Truck Friday", "Streaming Subscription Math"],
    accentColor: "rgba(232,168,32,", borderColor: "rgba(232,168,32,0.25)",
    tagColor: "rgba(232,168,32,0.10)", tagText: "#F5C040", emoji: "🛍️",
  },
  {
    band: "Grades 9–12", label: "Financial Strategy",
    desc: "Credit, investing, income, compound growth, entrepreneurship",
    missions: ["Summer Job Budget", "Credit Card Trap", "Startup Square Pitch"],
    accentColor: "rgba(0,204,216,", borderColor: "rgba(0,204,216,0.20)",
    tagColor: "rgba(0,204,216,0.08)", tagText: "#67E8F9", emoji: "🚀",
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
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, #030507 100%)" }} />
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

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <HeroGrid />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto">

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex justify-center mb-10">
            <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.30)", color: "#C4B5FD", letterSpacing: "0.12em" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" style={{ animation: "neonPulse 2s ease-in-out infinite", boxShadow: "0 0 8px #8B5CF6" }} />
              Grades 4–12 · Browser-based · No apps needed
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold tracking-tight leading-[0.9] mb-8"
            style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}>
            <span style={{ color: "#E8E4D8" }}>Math that</span><br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #E8A820 0%, #F5C040 30%, #00CCD8 60%, #8B5CF6 100%)", backgroundSize: "200% 200%", animation: "gradientShift 5s ease infinite" }}>
              feels real.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12" style={{ color: "#5A5A6E", fontWeight: 300 }}>
            Financial math missions that turn classroom laptops into an immersive city adventure.
            Students solve real money problems. Teachers see results live.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/join">
              <button className="w-full sm:w-auto text-base px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #E8A820, #F5C040 50%, #00CCD8)", backgroundSize: "200% 100%", color: "#030507",
                  boxShadow: "0 0 40px rgba(232,168,32,0.25), 0 0 80px rgba(0,204,216,0.10)" }}>
                Join a Classroom →
              </button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">Teacher Login</Button>
            </Link>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-sm" style={{ color: "#2A2A3A" }}>
            No student accounts · No app installs · Works on any Chromebook
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em]" style={{ color: "#2A2A3A" }}>Scroll</span>
          <motion.div animate={{ scaleY: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-12 origin-top" style={{ background: "linear-gradient(to bottom, rgba(139,92,246,0.6), transparent)" }} />
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 py-24" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#8B5CF6" }}>How It Works</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl" style={{ color: "#E8E4D8" }}>Classroom-ready in under 5 minutes</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map(({ step, title, desc, icon }, i) => (
              <motion.div key={step} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.1 }}
                className="relative rounded-2xl p-6" style={{ background: "rgba(13,16,32,0.8)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(8px)" }}>
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

      {/* Grade bands */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#E8A820" }}>Curriculum</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl" style={{ color: "#E8E4D8" }}>Three grade bands. Real scenarios.</h2>
          </motion.div>
          <div className="space-y-4">
            {GRADE_BANDS.map(({ band, label, desc, missions, borderColor, tagColor, tagText, emoji }, i) => (
              <motion.div key={band} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-2xl p-7" style={{ background: "rgba(13,16,32,0.7)", border: `1px solid ${borderColor}`, backdropFilter: "blur(8px)" }}>
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
                      <span key={m} className="text-xs px-3 py-1 rounded-full"
                        style={{ background: tagColor, color: tagText, border: `1px solid ${borderColor}` }}>{m}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 py-28" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center">
          <div className="text-7xl mb-8 inline-block" style={{ filter: "drop-shadow(0 0 30px rgba(232,168,32,0.4))" }}>🏙️</div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{ color: "#E8E4D8" }}>Ready to enter MathWorld?</h2>
          <p className="mb-10 text-lg" style={{ color: "#5A5A6E", fontWeight: 300 }}>
            Teachers: create a session in 60 seconds. Students: enter the code. No downloads. No friction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <button className="w-full sm:w-auto text-base px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #E8A820, #F5C040 50%, #00CCD8)", color: "#030507",
                  boxShadow: "0 0 40px rgba(232,168,32,0.20), 0 0 80px rgba(0,204,216,0.08)" }}>
                Join a Classroom →
              </button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">Teacher Login</Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
```

---

### Join Page (`app/join/page.tsx`)

**Props contract:** must call `/api/sessions/join` POST with `{ joinCode, nickname }` and call `setSession()` on success. The routing logic is untouchable.

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StarField } from "@/components/ui/StarField";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import { useStudentStore } from "@/stores/student-store";
import type { JoinSessionResponse } from "@/lib/types";

export default function JoinPage() {
  const router = useRouter();
  const setSession = useStudentStore((s) => s.setSession);
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const qCode = url.searchParams.get("code");
    if (qCode && !code) setCode(qCode.toUpperCase());
  }

  const handleJoin = async () => {
    setError("");
    if (!code.trim() || !nickname.trim()) { setError("Please enter both your class code and a nickname."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/sessions/join", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joinCode: code.trim(), nickname: nickname.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong. Try again."); return; }
      const session = data as JoinSessionResponse;
      setSession({
        studentId: session.studentId, sessionId: session.sessionId,
        sessionCode: code.trim().toUpperCase(), nickname: nickname.trim(),
        gradeBand: session.gradeBand, assignedMissions: session.assignedMissions,
      });
      router.push("/student/city");
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: "#030507" }}>
      <StarField count={80} />
      <CosmicBackground />

      {/* Orbit rings */}
      {[600, 420].map((size, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: size, height: size, border: `1px solid ${i === 0 ? "rgba(139,92,246,0.08)" : "rgba(0,204,216,0.06)"}`,
            top: "50%", left: "50%",
            animation: `orbitSlow ${i === 0 ? 60 : 40}s linear infinite${i === 1 ? " reverse" : ""}` }}
          aria-hidden="true" />
      ))}

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 max-w-md w-full space-y-8">

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 text-4xl"
            style={{ background: "radial-gradient(circle, rgba(232,168,32,0.15) 0%, rgba(139,92,246,0.08) 100%)",
              border: "1px solid rgba(232,168,32,0.20)", boxShadow: "0 0 40px rgba(232,168,32,0.10), inset 0 0 20px rgba(232,168,32,0.05)" }}>
            🏙️
          </div>
          <h1 className="font-display font-extrabold text-4xl mb-2" style={{ color: "#E8E4D8" }}>MathWorld City</h1>
          <p style={{ color: "#5A5A6E", fontWeight: 300 }}>Enter your class code to join today&apos;s session</p>
        </div>

        <div className="rounded-2xl p-8 space-y-5"
          style={{ background: "rgba(13,16,32,0.80)", border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)", boxShadow: "0 0 60px rgba(139,92,246,0.05), 0 24px 48px rgba(0,0,0,0.4)" }}>
          <Input id="join-code" label="Class Code" placeholder="e.g. MATH42" value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6}
            className="text-center text-2xl tracking-[0.3em] font-bold uppercase" autoCapitalize="characters" autoComplete="off" />
          <Input id="nickname" label="Your Nickname" placeholder="e.g. MathWizard99" value={nickname}
            onChange={(e) => setNickname(e.target.value)} maxLength={30}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()} />
          {error && (
            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-center" style={{ color: "#F87171" }}>
              {error}
            </motion.p>
          )}
          <button onClick={handleJoin} disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #E8A820, #F5C040 50%, #00CCD8)", color: "#030507",
              boxShadow: "0 0 40px rgba(232,168,32,0.20), 0 0 80px rgba(0,204,216,0.08)" }}>
            {loading
              ? <span className="inline-block w-5 h-5 border-2 border-[#030507] border-t-transparent rounded-full animate-spin" />
              : "Enter MathWorld City →"}
          </button>
        </div>

        <p className="text-center text-sm" style={{ color: "#2A2A3A" }}>
          No account needed — your teacher&apos;s class code is all you need.
        </p>
      </motion.div>
    </div>
  );
}
```

---

### Student City Map (`app/student/city/page.tsx`)

**Props contract:** reads from `useStudentStore` — do not change the hook call signatures. `Link href` values must stay exactly as written.

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStudentStore } from "@/stores/student-store";
import { DISTRICT_CONFIG, getMissionsForGradeBand } from "@/lib/utils";
import { StarField } from "@/components/ui/StarField";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import { TiltCard } from "@/components/ui/TiltCard";

const ALL_DISTRICTS = [
  "budget-borough", "savings-station", "market-street", "credit-crossing", "startup-square",
] as const;

const DISTRICT_ACCENTS: Record<string, {
  glow: string; border: string; bg: string; badge: string; badgeBorder: string; dot: string;
}> = {
  "budget-borough":  { glow: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.30)", bg: "rgba(109,40,217,0.08)",   badge: "rgba(139,92,246,0.10)", badgeBorder: "rgba(139,92,246,0.25)", dot: "#8B5CF6" },
  "savings-station": { glow: "rgba(0,204,216,0.12)",  border: "rgba(0,204,216,0.28)",  bg: "rgba(0,204,216,0.06)",   badge: "rgba(0,204,216,0.08)",  badgeBorder: "rgba(0,204,216,0.22)",  dot: "#00CCD8" },
  "market-street":   { glow: "rgba(232,168,32,0.12)", border: "rgba(232,168,32,0.30)", bg: "rgba(232,168,32,0.06)",  badge: "rgba(232,168,32,0.10)", badgeBorder: "rgba(232,168,32,0.25)", dot: "#E8A820" },
  "credit-crossing": { glow: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.25)",  bg: "rgba(239,68,68,0.05)",   badge: "rgba(239,68,68,0.08)",  badgeBorder: "rgba(239,68,68,0.20)",  dot: "#F87171" },
  "startup-square":  { glow: "rgba(0,204,216,0.10)",  border: "rgba(0,168,184,0.25)",  bg: "rgba(0,168,184,0.05)",   badge: "rgba(0,204,216,0.08)",  badgeBorder: "rgba(0,168,184,0.20)",  dot: "#00CCD8" },
};

// Restyle freely — keep viewBox and aria-hidden
function CitySkyline() { /* ... see repo for full SVG ... */ return null; }

export default function CityPage() {
  const { nickname, gradeBand, assignedMissions, sessionCode } = useStudentStore();
  const gradeMissions = getMissionsForGradeBand(gradeBand);

  // ... see repo for full JSX
}
```

> For the full SVG skyline and complete JSX, see the repo file. The logic section (useStudentStore, getMissionsForGradeBand, ALL_DISTRICTS, isLocked check) is untouchable.

---

## Mission Components

These three components are rendered inside `app/student/mission/[missionId]/page.tsx` which is **not** in scope for UI changes. The page passes props down — **prop shapes are fixed contracts.**

### `components/mission/MissionIntro.tsx`

**Props:**
```ts
interface Props {
  mission: Mission;   // from lib/types — do not modify shape
  onStart: () => void; // MUST be called when student clicks "begin"
}
```

Key rule: `onStart()` must fire on the CTA button click.

### `components/mission/QuestionStep.tsx`

**Props:**
```ts
interface Props {
  question: MissionQuestion;
  questionNumber: number;
  totalQuestions: number;
  currentScore: number;
  onAnswered: (record: {
    answer: string;
    isCorrect: boolean;
    hintUsed: boolean;
    retryCount: number;
    pointsEarned: number;
    timeSpentSeconds: number;
  }) => Promise<void>;  // MUST be called after scoring is determined
}
```

Key rules:
- `checkAnswer(question, answer)` and `scoreAnswer(question, isCorrect, hintUsed, retryCount)` from `lib/scoring/engine` **must** be called — they determine correctness and points
- One retry is allowed before the answer is final (retryCount < 1 guard)
- `onAnswered()` must receive accurate values — this writes to the database
- Hint must cost 70% points (handled by `scoreAnswer` — just pass `hintShown` accurately)

### `components/mission/MissionComplete.tsx`

**Props:**
```ts
interface Props {
  mission: Mission;
  breakdown: ScoreBreakdown;  // { total, questionPoints, decisionPoints, reflectionPoints, completionBonus }
  badge: Mission["badge"];    // { name: string, description: string }
}
```

Key rule: display `breakdown.total` and the max from `maxPossibleScore(mission)` (imported from `lib/scoring/engine`). The "Return to MathWorld City" link must go to `/student/city`.

---

## Key Dependencies

```json
"framer-motion": "^11.x",
"next": "15.x",
"react": "19.x",
"tailwind-merge": "^2.x",
"clsx": "^2.x"
```

The `cn()` utility (from `lib/utils.ts`) combines clsx + tailwind-merge:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

---

## Performance Rules (do not violate)

1. **All continuous animations** (starPulse, cosmicDrift, neonPulse) must use CSS `animation` — no JavaScript `setInterval` or `requestAnimationFrame` loops
2. **TiltCard mouse tracking** must write to `el.style.transform` directly — do not use `setState` inside `onMouseMove`
3. **StarField** must use a seeded RNG — random values on every render cause React hydration mismatches
4. **willChange: transform** must stay on TiltCard's root element
5. **`@media (prefers-reduced-motion: reduce)`** in globals.css must remain — it disables all animations for accessibility

---

## File Map Summary

```
app/
  layout.tsx                    ← Fonts + ClerkProvider (keep ClerkProvider)
  globals.css                   ← Design tokens, keyframes, aurora-bar utility
  page.tsx                      ← Landing page (purely presentational)
  join/page.tsx                 ← Student join form (logic is fixed; UI is free)
  student/
    city/page.tsx               ← City map (useStudentStore reads + Link hrefs fixed)

components/
  ui/
    StarField.tsx               ← Full-viewport star field (keep seeded RNG)
    CosmicBackground.tsx        ← Nebula atmosphere (CSS only)
    TiltCard.tsx                ← 3D tilt + specular (direct DOM, no setState)
    button.tsx                  ← variant/size API is fixed
    progress.tsx                ← value prop is fixed
    input.tsx                   ← label/error props are fixed
    card.tsx                    ← glow prop is fixed
  mission/
    MissionIntro.tsx            ← onStart() callback is fixed
    QuestionStep.tsx            ← onAnswered() + scoring logic is fixed
    MissionComplete.tsx         ← maxPossibleScore() import is fixed

tailwind.config.ts              ← Colors, fonts, keyframes
```
