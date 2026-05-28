import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 relative z-10 w-full group">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold tracking-wide uppercase mb-1" style={{ color: "#888888" }}>
            {label}
          </label>
        )}
        <div className="relative">
          {/* Gradient border glow on hover/focus */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00CCD8] to-[#8B5CF6] rounded-xl opacity-0 group-hover:opacity-30 group-focus-within:opacity-100 transition duration-500 blur-sm" />
          <input
            ref={ref}
            id={id}
            className={cn(
              "relative w-full bg-[#0A0E1C] border border-white/10 rounded-xl px-5 py-4 text-[#F0F0F0] placeholder:text-[#3A4055] focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
