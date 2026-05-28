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
          "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#010101] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group",
          {
            "bg-gradient-to-br from-[#00CCD8] via-[#8B5CF6] to-[#D4AF37] text-black shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(0,204,216,0.5)] focus-visible:ring-[#8B5CF6] active:scale-[0.98]":
              variant === "primary",
            "bg-[#0A0E1C] border border-[#1C1C20] hover:border-[#8B5CF6]/50 text-[#F0F0F0] hover:text-white hover:bg-[#141418] shadow-[0_0_10px_rgba(0,0,0,0.5)]":
              variant === "secondary",
            "text-[#888888] hover:text-[#F0F0F0] hover:bg-white/5":
              variant === "ghost",
            "bg-red-600/90 border border-red-500/50 hover:bg-red-500 text-white shadow-lg shadow-red-500/20":
              variant === "danger",
            "glass-light text-white hover:bg-white/10 border-white/10 hover:border-white/20":
              variant === "glass",
          },
          {
            "text-sm px-4 py-2 gap-1.5": size === "sm",
            "text-base px-6 py-3 gap-2": size === "md",
            "text-lg px-8 py-4 gap-3 rounded-2xl": size === "lg",
          },
          className
        )}
        {...props}
      >
        {variant === "primary" && (
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        {loading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        )}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
