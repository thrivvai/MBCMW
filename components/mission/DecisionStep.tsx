"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Mission } from "@/lib/types";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface Props {
  decision: Mission["decision"];
  onDecide: (decisionId: string) => Promise<void>;
  onNext: () => void;
}

function ScaleIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4V28M16 4L8 10M16 4L24 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 22C4 22 8 16 12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 22C20 22 24 16 28 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function DecisionStep({ decision, onDecide, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (id: string) => {
    if (outcome) return;
    setSelected(id);
  };

  const handleConfirm = async () => {
    if (!selected || submitting) return;
    const option = decision.options.find((o) => o.id === selected);
    if (!option) return;
    setSubmitting(true);
    setOutcome(option.outcome);
    await onDecide(selected);
    setSubmitting(false);
  };

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
          <div className="text-[#C9A84C]"><ScaleIcon /></div>
          <div>
            <h2 className="font-display text-2xl text-[#EDE8DC] font-[600] tracking-tight">
              Financial Decision Point
            </h2>
            <p className="text-[#666360] text-sm font-light mt-1">
              There&apos;s no single right answer — your choice matters.
            </p>
          </div>
        </div>

        {/* Decision prompt */}
        <div
          className="rounded-sm p-6"
          style={{
            background: "rgba(17,19,24,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <p className="text-[#EDE8DC] text-base leading-relaxed font-light">{decision.prompt}</p>
          <p className="mt-3 text-xs font-medium text-[#C9A84C] tracking-wide">
            +{decision.points} points for making a decision
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {decision.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={!!outcome}
              className={`w-full text-left px-5 py-4 rounded-sm font-medium transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                outcome && selected === option.id
                  ? ""
                  : selected === option.id && !outcome
                  ? ""
                  : "disabled:opacity-50"
              }`}
              style={{
                background:
                  outcome && selected === option.id
                    ? "rgba(74,154,106,0.10)"
                    : selected === option.id
                    ? "rgba(201,168,76,0.10)"
                    : "rgba(17,19,24,0.75)",
                border: `1px solid ${
                  outcome && selected === option.id
                    ? "rgba(74,154,106,0.40)"
                    : selected === option.id
                    ? "rgba(201,168,76,0.45)"
                    : "rgba(255,255,255,0.07)"
                }`,
                color:
                  selected === option.id ? "#EDE8DC" : "#9A9694",
                minHeight: "52px",
                backdropFilter: "blur(8px)",
              }}
            >
              {option.text}
            </button>
          ))}
        </div>

        {/* Outcome */}
        <AnimatePresence>
          {outcome && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              className="rounded-sm p-6"
              style={{
                background: "rgba(74,154,106,0.07)",
                border: "1px solid rgba(74,154,106,0.30)",
                backdropFilter: "blur(12px)",
              }}
            >
              <p className="text-[10px] text-[#6AC98A] font-bold uppercase tracking-[0.18em] mb-2">Outcome</p>
              <p className="text-[#C8C4BC] leading-relaxed font-light">{outcome}</p>
              <p className="mt-3 text-[#6AC98A] font-semibold text-sm">+{decision.points} points</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!outcome ? (
          <Button size="lg" onClick={handleConfirm} disabled={!selected} loading={submitting} className="w-full">
            Confirm Decision
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
          >
            <Button size="lg" onClick={onNext} className="w-full">
              Continue
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
