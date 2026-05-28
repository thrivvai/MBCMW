"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Mission } from "@/lib/types";

interface Props {
  decision: Mission["decision"];
  onDecide: (decisionId: string) => Promise<void>;
  onNext: () => void;
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
    <div className="min-h-screen bg-city-bg flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-6"
      >
        <div className="text-center">
          <span className="text-4xl mb-4 block">🤔</span>
          <h2 className="text-2xl font-bold text-white mb-2">Financial Decision Point</h2>
          <p className="text-gray-400 text-sm">There's no single right answer — your choice matters.</p>
        </div>

        <div className="bg-city-card border border-city-border rounded-2xl p-6">
          <p className="text-white text-lg leading-relaxed">{decision.prompt}</p>
          <p className="mt-2 text-xs text-amber-400 font-medium">
            +{decision.points} points for making a decision
          </p>
        </div>

        <div className="space-y-3">
          {decision.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={!!outcome}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                selected === option.id && !outcome
                  ? "border-indigo-500 bg-indigo-500/15 text-white"
                  : outcome && selected === option.id
                  ? "border-emerald-500 bg-emerald-500/15 text-white"
                  : "border-city-border bg-city-card text-gray-300 hover:border-indigo-500/50 hover:text-white disabled:opacity-50"
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {outcome && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-900/20 border border-emerald-500/40 rounded-2xl p-6"
            >
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">Outcome</p>
              <p className="text-gray-200 leading-relaxed">{outcome}</p>
              <p className="mt-3 text-emerald-400 font-bold text-sm">+{decision.points} points</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!outcome ? (
          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={!selected}
            loading={submitting}
            className="w-full"
          >
            Confirm Decision
          </Button>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <Button size="lg" onClick={onNext} className="w-full">
              Continue →
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
