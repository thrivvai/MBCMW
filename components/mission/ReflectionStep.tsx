"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Mission } from "@/lib/types";

interface Props {
  reflection: Mission["reflection"];
  onSubmit: (text: string) => Promise<void>;
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
    <div className="min-h-screen bg-city-bg flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-6"
      >
        <div className="text-center">
          <span className="text-4xl mb-4 block">✏️</span>
          <h2 className="text-2xl font-bold text-white mb-2">Mission Reflection</h2>
          <p className="text-gray-400 text-sm">
            Take a moment to think about what you learned.
          </p>
        </div>

        <div className="bg-city-card border border-city-border rounded-2xl p-6">
          <p className="text-white text-lg leading-relaxed">{reflection.prompt}</p>
          <p className="mt-2 text-xs text-amber-400 font-medium">
            +{reflection.points} points for completing your reflection
          </p>
        </div>

        <div>
          <textarea
            className="w-full bg-city-bg border border-city-border rounded-xl px-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[160px] text-base leading-relaxed"
            placeholder="Write your thoughts here… (at least 5 words)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Reflection response"
          />
          <p className="mt-1.5 text-xs text-gray-500 text-right">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!isReady}
          loading={submitting}
          className="w-full"
        >
          Submit Reflection & Finish Mission
        </Button>
      </motion.div>
    </div>
  );
}
