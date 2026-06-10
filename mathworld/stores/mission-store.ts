"use client";

import { create } from "zustand";
import type { Mission } from "@/lib/types";

export type MissionStep =
  | { type: "intro" }
  | { type: "question"; index: number }
  | { type: "decision" }
  | { type: "reflection" }
  | { type: "complete" };

interface AnswerRecord {
  answer: string;
  isCorrect: boolean;
  hintUsed: boolean;
  retryCount: number;
  pointsEarned: number;
}

interface MissionStore {
  mission: Mission | null;
  attemptId: string | null;
  step: MissionStep;
  answers: Record<string, AnswerRecord>;
  questionScore: number;
  decisionMade: string | null;
  reflectionSubmitted: boolean;
  finalScore: number;

  initMission: (mission: Mission, attemptId: string, previousAnswers?: Record<string, AnswerRecord>) => void;
  advanceStep: () => void;
  recordAnswer: (questionId: string, record: AnswerRecord) => void;
  setDecision: (decisionId: string) => void;
  completeMission: (finalScore: number) => void;
  reset: () => void;
}

export const useMissionStore = create<MissionStore>((set, get) => ({
  mission: null,
  attemptId: null,
  step: { type: "intro" },
  answers: {},
  questionScore: 0,
  decisionMade: null,
  reflectionSubmitted: false,
  finalScore: 0,

  initMission: (mission, attemptId, previousAnswers = {}) => {
    const answeredCount = Object.keys(previousAnswers).length;
    let step: MissionStep;
    if (answeredCount === 0) {
      step = { type: "intro" };
    } else if (answeredCount < mission.questions.length) {
      step = { type: "question", index: answeredCount };
    } else {
      step = { type: "decision" };
    }
    const questionScore = Object.values(previousAnswers).reduce(
      (sum, r) => sum + r.pointsEarned,
      0
    );
    set({ mission, attemptId, step, answers: previousAnswers, questionScore });
  },

  advanceStep: () => {
    const { step, mission } = get();
    if (!mission) return;
    if (step.type === "intro") {
      set({ step: { type: "question", index: 0 } });
    } else if (step.type === "question") {
      const next = step.index + 1;
      if (next < mission.questions.length) {
        set({ step: { type: "question", index: next } });
      } else {
        set({ step: { type: "decision" } });
      }
    } else if (step.type === "decision") {
      set({ step: { type: "reflection" } });
    } else if (step.type === "reflection") {
      set({ reflectionSubmitted: true, step: { type: "complete" } });
    }
  },

  recordAnswer: (questionId, record) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: record },
      questionScore: state.questionScore + record.pointsEarned,
    })),

  setDecision: (decisionId) => set({ decisionMade: decisionId }),

  completeMission: (finalScore) => set({ finalScore }),

  reset: () =>
    set({
      mission: null,
      attemptId: null,
      step: { type: "intro" },
      answers: {},
      questionScore: 0,
      decisionMade: null,
      reflectionSubmitted: false,
      finalScore: 0,
    }),
}));
