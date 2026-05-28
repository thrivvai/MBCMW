"use client";

import { useRef } from "react";

const ORBS = [
  { color: "139,92,246",  size: "85vw",  left: "15%",  top: "5%",   duration: "32s", delay: "0s"   },
  { color: "232,168,32",  size: "65vw",  left: "75%",  top: "55%",  duration: "40s", delay: "-12s" },
  { color: "0,204,216",   size: "70vw",  left: "5%",   top: "70%",  duration: "26s", delay: "-18s" },
  { color: "109,40,217",  size: "55vw",  left: "80%",  top: "10%",  duration: "50s", delay: "-25s" },
  { color: "0,168,184",   size: "45vw",  left: "45%",  top: "85%",  duration: "36s", delay: "-6s"  },
];

const MATH_SYMBOLS = ["∑", "∫", "π", "∞", "√", "θ", "∆", "µ", "Ω", "λ"];

// Seeded RNG — must stay deterministic for SSR/CSR consistency (no hydration mismatch).
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface MathSymbol {
  sym: string; left: string; top: string; size: string; delay: string; duration: string;
}

export function CosmicBackground() {
  const symbolsRef = useRef<MathSymbol[]>([]);

  if (symbolsRef.current.length === 0) {
    const rand = seededRand(99);
    symbolsRef.current = Array.from({ length: 15 }, (_, i) => ({
      sym: MATH_SYMBOLS[i % MATH_SYMBOLS.length],
      left: `${rand() * 90 + 5}%`,
      top: `${rand() * 90 + 5}%`,
      size: `${rand() * 2 + 1}rem`,
      delay: `${(rand() * 10).toFixed(1)}s`,
      duration: `${(rand() * 15 + 10).toFixed(1)}s`,
    }));
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Nebula orbs */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size, height: orb.size,
            left: orb.left, top: orb.top,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(${orb.color},0.08) 0%, rgba(${orb.color},0.02) 40%, transparent 70%)`,
            animation: `cosmicDrift ${orb.duration} ease-in-out ${orb.delay} infinite`,
            filter: "blur(60px)",
          }}
        />
      ))}

      {/* Atmosphere arc — bottom horizon glow */}
      <div
        className="absolute bottom-0 w-full h-[60vh]"
        style={{
          background: "radial-gradient(ellipse 150% 100% at 50% 100%, rgba(0,204,216,0.12) 0%, rgba(139,92,246,0.04) 50%, transparent 100%)",
          opacity: 0.8,
        }}
      />

      {/* Floating math symbols */}
      <div className="absolute inset-0">
        {symbolsRef.current.map((m, i) => (
          <div
            key={i}
            className="absolute font-sans font-bold text-transparent bg-clip-text select-none"
            style={{
              left: m.left, top: m.top, fontSize: m.size,
              backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.08))",
              animation: `MathDrift ${m.duration} ease-in-out ${m.delay} infinite`,
              filter: "drop-shadow(0 0 8px rgba(0,204,216,0.25))",
            }}
          >
            {m.sym}
          </div>
        ))}
      </div>
    </div>
  );
}
