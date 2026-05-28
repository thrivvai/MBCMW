"use client";

import { useRef } from "react";

interface Star {
  x: number; y: number; size: number; delay: number;
  duration: number; opacity: number; color: string;
  hasGlow: boolean; glowColor: string;
}

// Seeded RNG — must not change seed or algorithm; prevents SSR/CSR hydration mismatch.
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const STAR_COLORS = [
  "#F8F9FA", "#F8F9FA", "#F8F9FA",
  "#C8D4F8", // cool blue-white
  "#F5C040", // warm gold
  "#00CCD8", // teal
];

const GLOW_COLORS = ["#8B5CF6", "#D4AF37", "#00CCD8", "#F8F9FA"];

export function StarField({ count = 150 }: { count?: number }) {
  const starsRef = useRef<Star[]>([]);

  if (starsRef.current.length === 0) {
    const rand = seededRand(42);
    starsRef.current = Array.from({ length: count }, () => {
      const size = rand() < 0.1 ? rand() * 3 + 2 : rand() < 0.5 ? rand() * 1.5 + 1 : rand() * 0.8 + 0.4;
      const hasGlow = size > 2 && rand() < 0.5;
      return {
        x: rand() * 100, y: rand() * 100, size,
        delay: rand() * 10, duration: rand() * 6 + 4,
        opacity: rand() * 0.7 + 0.2,
        color: STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)],
        hasGlow,
        glowColor: GLOW_COLORS[Math.floor(rand() * GLOW_COLORS.length)],
      };
    });
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
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
