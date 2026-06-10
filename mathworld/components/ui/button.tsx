"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass";
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
          "relative inline-flex items-center justify-center font-semibold rounded-sm transition-all duration-150 focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden cursor-pointer",
          {
            // Primary: clean parchment — no gradient, no neon glow
            "bg-[#EDE8DC] text-[#0B0C0F] hover:bg-white active:scale-[0.97]":
              variant === "primary",
            // Secondary: subtle surface with border
            "bg-[#111318] border border-white/10 text-[#EDE8DC] hover:bg-[#161920] hover:border-white/18 active:scale-[0.97]":
              variant === "secondary",
            // Ghost: no bg, minimal text
            "text-[#9A9694] hover:text-[#EDE8DC] hover:bg-white/5 active:scale-[0.97]":
              variant === "ghost",
            // Danger: muted red
            "bg-[#BE4646]/90 border border-[#BE4646]/40 hover:bg-[#BE4646] text-[#EDE8DC] active:scale-[0.97]":
              variant === "danger",
            // Glass: translucent surface
            "glass-light text-[#EDE8DC] hover:bg-white/8 border-white/10 hover:border-white/18 active:scale-[0.97]":
              variant === "glass",
          },
          {
            "text-sm px-4 py-2 gap-1.5": size === "sm",
            "text-base px-6 py-3 gap-2":  size === "md",
            "text-lg px-8 py-4 gap-3":    size === "lg",
          },
          className
        )}
        style={{ minHeight: size === "sm" ? "36px" : size === "lg" ? "52px" : "44px" }}
        {...props}
      >
        {loading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        )}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
