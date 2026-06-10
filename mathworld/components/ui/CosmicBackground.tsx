"use client";

import { useRef } from "react";

// Warm, muted nebula palette — no neon purple/teal
const ORBS = [
  { color: "201,168,76",  size: "80vw",  left: "10%",  top: "5%",   duration: "44s", delay: "0s"   }, // gold
  { color: "180,158,90",  size: "62vw",  left: "82%",  top: "52%",  duration: "38s", delay: "-14s" }, // warm gold-grey
  { color: "55,80,100",   size: "68vw",  left: "5%",   top: "68%",  duration: "30s", delay: "-20s" }, // deep space blue-grey
  { color: "110,88,55",   size: "50vw",  left: "85%",  top: "12%",  duration: "52s", delay: "-28s" }, // bronze
  { color: "70,95,75",    size: "38vw",  left: "48%",  top: "86%",  duration: "36s", delay: "-8s"  }, // muted sage
];

const MATH_SYMBOLS = ["∑", "∫", "π", "∞", "√", "θ", "∆", "Ω", "λ", "μ"];

// Seeded RNG — deterministic for SSR/CSR hydration consistency.
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
    symbolsRef.current = Array.from({ length: 12 }, (_, i) => ({
      sym: MATH_SYMBOLS[i % MATH_SYMBOLS.length],
      left: `${rand() * 90 + 5}%`,
      top: `${rand() * 90 + 5}%`,
      size: `${rand() * 1.8 + 0.9}rem`,
      delay: `${(rand() * 10).toFixed(1)}s`,
      duration: `${(rand() * 15 + 12).toFixed(1)}s`,
    }));
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Nebula orbs — warm, muted */}
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
            filter: "blur(70px)",
          }}
        />
      ))}

      {/* Horizon atmosphere arc — warm gold tone, subtle */}
      <div
        className="absolute bottom-0 w-full h-[50vh]"
        style={{
          background: "radial-gradient(ellipse 140% 80% at 50% 100%, rgba(201,168,76,0.07) 0%, rgba(110,88,55,0.03) 50%, transparent 100%)",
          opacity: 0.7,
        }}
      />

      {/* Floating math symbols — warm white, no neon drop-shadow */}
      <div className="absolute inset-0">
        {symbolsRef.current.map((m, i) => (
          <div
            key={i}
            className="absolute font-sans font-bold text-transparent bg-clip-text select-none"
            style={{
              left: m.left, top: m.top, fontSize: m.size,
              backgroundImage: "linear-gradient(to bottom, rgba(237,232,220,0.22), rgba(237,232,220,0.06))",
              animation: `MathDrift ${m.duration} ease-in-out ${m.delay} infinite`,
            }}
          >
            {m.sym}
          </div>
        ))}
      </div>
    </div>
  );
}
