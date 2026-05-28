"use client";

import { useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  color: string;
  hasGlow: boolean;
  glowColor: string;
}

// Seeded pseudo-random for consistent SSR/CSR output.
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const STAR_COLORS = [
  "#E8E4D8", // warm white
  "#E8E4D8", // warm white (weighted higher)
  "#E8E4D8",
  "#C8D4F8", // cool blue-white
  "#F5C040", // warm gold (rare)
  "#00CCD8", // teal (rare)
];

const GLOW_COLORS = ["#8B5CF6", "#E8A820", "#00CCD8", "#ffffff"];

// Pure CSS star field — no canvas, no JS animation loop. Compositor-thread only.
export function StarField({ count = 100 }: { count?: number }) {
  const starsRef = useRef<Star[]>([]);

  if (starsRef.current.length === 0) {
    const rand = seededRand(42);
    starsRef.current = Array.from({ length: count }, (_, i) => {
      const size = rand() < 0.15 ? rand() * 2 + 2 : rand() < 0.6 ? rand() * 1 + 0.8 : rand() * 0.6 + 0.3;
      const hasGlow = size > 1.8 && rand() < 0.4;
      return {
        x: rand() * 100,
        y: rand() * 100,
        size,
        delay: rand() * 8,
        duration: rand() * 5 + 4,
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
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.color,
            opacity: s.opacity,
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
