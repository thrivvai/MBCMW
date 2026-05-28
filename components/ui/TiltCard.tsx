"use client";

import { useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

// Mouse-tracked 3D tilt + cursor-specular highlight.
// All transforms run on the compositor thread — zero layout/paint cost.
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
      {/* Specular highlight overlay — follows cursor */}
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
