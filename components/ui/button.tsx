"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
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
          "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030507] disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden",
          {
            // Primary: warm gold-to-teal gradient edge, deep base
            "bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white shadow-lg shadow-[#6D28D9]/30 hover:shadow-[#8B5CF6]/40 hover:brightness-110 focus-visible:ring-[#8B5CF6] active:scale-[0.98]":
              variant === "primary",
            "bg-[#0D1020] border border-[#1A1F35] hover:border-[#8B5CF6]/40 text-[#E8E4D8] hover:text-white hover:bg-[#121628]":
              variant === "secondary",
            "text-[#5A5A6E] hover:text-[#E8E4D8] hover:bg-white/5":
              variant === "ghost",
            "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20":
              variant === "danger",
          },
          {
            "text-sm px-3 py-1.5 gap-1.5": size === "sm",
            "text-sm px-4 py-2.5 gap-2": size === "md",
            "text-base px-6 py-3.5 gap-2": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
