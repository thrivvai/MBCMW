"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

// Pure CSS particle field — zero canvas, zero JS animation loop.
// Each star uses CSS animation-delay for natural stagger. GPU-composited only.
export function StarField({ count = 80 }: { count?: number }) {
  const starsRef = useRef<Star[]>([]);

  if (starsRef.current.length === 0) {
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 3,
      opacity: Math.random() * 0.5 + 0.1,
    }));
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
            background: `rgba(255,255,255,${s.opacity})`,
            animation: `starPulse ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
