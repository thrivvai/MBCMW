import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold tracking-[0.15em] uppercase text-[#666360]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-[#111318] border border-white/8 rounded-sm px-5 py-4 text-[#EDE8DC] placeholder:text-[#3A3836] focus:outline-none focus:border-white/20 transition-colors duration-200",
            "hover:border-white/12",
            error && "border-[#BE4646]/50 focus:border-[#BE4646]/70",
            className
          )}
          style={{ minHeight: "44px" }}
          {...props}
        />
        {error && (
          <p className="text-xs text-[#D47070] mt-0.5 font-light">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
