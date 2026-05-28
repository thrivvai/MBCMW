"use client";

import { useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

// Mouse-tracked 3D tilt + specular highlight + bottom glow bar.
// All transforms are compositor-thread only — no layout/paint cost.
export function TiltCard({ children, className = "", intensity = 20 }: Props) {
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
    el.style.transform = `perspective(1200px) rotateX(${-rx}deg) rotateY(${ry}deg) translateZ(20px) scale(1.02)`;
    if (spec) {
      spec.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)`;
      spec.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    const spec = specularRef.current;
    if (el) el.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)";
    if (spec) spec.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Specular highlight — mix-blend-screen for realistic sheen */}
      <div
        ref={specularRef}
        className="absolute inset-0 rounded-2xl pointer-events-none z-20 opacity-0 mix-blend-screen"
        style={{ transition: "opacity 0.3s ease, background 0.1s ease" }}
        aria-hidden="true"
      />
      {/* Bottom edge glow on hover */}
      <div
        className="absolute inset-x-0 -bottom-px mx-auto h-[2px] w-3/4 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
