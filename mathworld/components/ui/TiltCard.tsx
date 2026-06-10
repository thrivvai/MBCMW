"use client";

import { useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

// Mouse-tracked 3D tilt + specular highlight. All transforms are compositor-thread only.
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
    el.style.transform = `perspective(1200px) rotateX(${-rx}deg) rotateY(${ry}deg) translateZ(16px) scale(1.015)`;
    if (spec) {
      spec.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)`;
      spec.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    const spec = specularRef.current;
    if (el) el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)";
    if (spec) spec.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        // expo ease-out for return — Emil Kowalski principle
        transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Specular highlight — subtle, no neon */}
      <div
        ref={specularRef}
        className="absolute inset-0 pointer-events-none z-20 opacity-0 mix-blend-screen rounded-sm"
        style={{ transition: "opacity 0.25s ease-out, background 0.1s ease-out" }}
        aria-hidden="true"
      />
      {/* Bottom edge light — warm white, no color */}
      <div
        className="absolute inset-x-0 -bottom-px mx-auto h-px w-3/5 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
