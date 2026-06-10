"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useStudentStore } from "@/stores/student-store";
import { useMissionStore } from "@/stores/mission-store";
import { getMission } from "@/lib/utils";
import { MissionIntro } from "@/components/mission/MissionIntro";
import { QuestionStep } from "@/components/mission/QuestionStep";
import { DecisionStep } from "@/components/mission/DecisionStep";
import { ReflectionStep } from "@/components/mission/ReflectionStep";
import { MissionComplete } from "@/components/mission/MissionComplete";
import type { Mission, ScoreBreakdown } from "@/lib/types";

export default function MissionPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = params.missionId as string;

  const { studentId, sessionId } = useStudentStore();
  const {
    mission,
    attemptId,
    step,
    questionScore,
    initMission,
    advanceStep,
    recordAnswer,
    setDecision,
    completeMission,
    reset,
  } = useMissionStore();

  const [loading, setLoading] = useState(true);
  const [breakdown, setBreakdown] = useState<ScoreBreakdown | null>(null);
  const [badgeEarned, setBadgeEarned] = useState<Mission["badge"] | null>(null);

  // Load mission content and start/resume attempt.
  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      reset();

      const m = await getMission(missionId);
      if (!m || cancelled) {
        router.replace("/student/city");
        return;
      }

      const res = await fetch(`/api/missions/${missionId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, sessionId }),
      });
      const data = await res.json();
      if (cancelled) return;

      // Reconstruct previous answers map for session resume.
      const prevAnswers: Record<string, { answer: string; isCorrect: boolean; hintUsed: boolean; retryCount: number; pointsEarned: number }> = {};
      for (const a of data.previousAnswers ?? []) {
        prevAnswers[a.question_id] = {
          answer: a.answer,
          isCorrect: a.is_correct,
          hintUsed: a.hint_used,
          retryCount: a.retry_count,
          pointsEarned: a.points_earned,
        };
      }

      initMission(m, data.attemptId, prevAnswers);
      setLoading(false);
    }
    init();
    return () => { cancelled = true; };
  }, [missionId, studentId, sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswered = useCallback(
    async (record: {
      answer: string;
      isCorrect: boolean;
      hintUsed: boolean;
      retryCount: number;
      pointsEarned: number;
      timeSpentSeconds: number;
    }) => {
      if (!mission || !attemptId || step.type !== "question") return;
      const question = mission.questions[step.index];

      // Checkpoint to server.
      await fetch(`/api/missions/${missionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          questionId: question.id,
          answer: record.answer,
          hintUsed: record.hintUsed,
          retryCount: record.retryCount,
          timeSpentSeconds: record.timeSpentSeconds,
        }),
      });

      recordAnswer(question.id, record);
      advanceStep();
    },
    [mission, attemptId, step, missionId, recordAnswer, advanceStep]
  );

  const handleDecision = useCallback(
    async (decisionId: string) => {
      if (!attemptId) return;
      await fetch(`/api/missions/${missionId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, decisionId }),
      });
      setDecision(decisionId);
    },
    [attemptId, missionId, setDecision]
  );

  const handleDecisionNext = useCallback(() => {
    advanceStep();
  }, [advanceStep]);

  const handleReflection = useCallback(
    async (text: string) => {
      if (!attemptId || !mission) return;
      const res = await fetch(`/api/missions/${missionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, reflectionText: text }),
      });
      const data = await res.json();
      setBreakdown(data.breakdown);
      setBadgeEarned(data.badgeEarned);
      completeMission(data.finalScore);
      advanceStep();
    },
    [attemptId, mission, missionId, completeMission, advanceStep]
  );

  if (loading || !mission) {
    return (
      <div className="min-h-screen bg-space-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading mission…</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {step.type === "intro" && (
        <MissionIntro key="intro" mission={mission} onStart={advanceStep} />
      )}

      {step.type === "question" && (
        <QuestionStep
          key={`q-${step.index}`}
          question={mission.questions[step.index]}
          questionNumber={step.index + 1}
          totalQuestions={mission.questions.length}
          currentScore={questionScore}
          onAnswered={handleAnswered}
        />
      )}

      {step.type === "decision" && (
        <DecisionStep
          key="decision"
          decision={mission.decision}
          onDecide={handleDecision}
          onNext={handleDecisionNext}
        />
      )}

      {step.type === "reflection" && (
        <ReflectionStep
          key="reflection"
          reflection={mission.reflection}
          onSubmit={handleReflection}
        />
      )}

      {step.type === "complete" && breakdown && badgeEarned && (
        <MissionComplete
          key="complete"
          mission={mission}
          breakdown={breakdown}
          badge={badgeEarned}
        />
      )}
    </AnimatePresence>
  );
}
