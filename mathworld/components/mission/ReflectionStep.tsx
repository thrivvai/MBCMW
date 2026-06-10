"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Mission } from "@/lib/types";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface Props {
  reflection: Mission["reflection"];
  onSubmit: (text: string) => Promise<void>;
}

function PenIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M20 4L24 8L10 22H6V18L20 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M17 7L21 11" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ReflectionStep({ reflection, onSubmit }: Props) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit(text.trim());
    setSubmitting(false);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const isReady = wordCount >= 5;

  return (
    <div className="min-h-[100dvh] bg-[#0B0C0F] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        className="max-w-2xl w-full space-y-5"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-4">
          <div className="text-[#C9A84C]"><PenIcon /></div>
          <div>
            <h2 className="font-display text-2xl text-[#EDE8DC] font-[600] tracking-tight">
              Mission Reflection
            </h2>
            <p className="text-[#666360] text-sm font-light mt-1">
              Take a moment to think about what you learned.
            </p>
          </div>
        </div>

        {/* Prompt */}
        <div
          className="rounded-sm p-6"
          style={{
            background: "rgba(17,19,24,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <p className="text-[#EDE8DC] text-base leading-relaxed font-light">{reflection.prompt}</p>
          <p className="mt-3 text-xs font-medium text-[#C9A84C] tracking-wide">
            +{reflection.points} points for completing your reflection
          </p>
        </div>

        {/* Textarea */}
        <div>
          <textarea
            className="w-full rounded-sm px-5 py-4 text-[#EDE8DC] placeholder:text-[#3A3836] focus:outline-none focus:border-white/20 resize-none text-base leading-relaxed transition-colors duration-200"
            style={{
              background: "rgba(17,19,24,0.75)",
              border: "1px solid rgba(255,255,255,0.08)",
              minHeight: "160px",
              caretColor: "#C9A84C",
            }}
            placeholder="Write your thoughts here… (at least 5 words)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Reflection response"
          />
          <p className="mt-1.5 text-xs text-[#3A3836] text-right font-light tabular-nums">
            {wordCount} {wordCount === 1 ? "word" : "words"}
            {!isReady && wordCount > 0 && (
              <span className="text-[#C9A84C]/60"> · {5 - wordCount} more to go</span>
            )}
          </p>
        </div>

        <Button size="lg" onClick={handleSubmit} disabled={!isReady} loading={submitting} className="w-full">
          Submit Reflection &amp; Finish Mission
        </Button>
      </motion.div>
    </div>
  );
}
