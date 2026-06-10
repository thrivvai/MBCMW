import type { Mission, MissionQuestion, ScoreBreakdown } from "@/lib/types";

// Points awarded per question based on how cleanly it was solved.
export function scoreAnswer(
  question: MissionQuestion,
  isCorrect: boolean,
  hintUsed: boolean,
  retryCount: number
): number {
  if (!isCorrect) return 0;
  if (retryCount >= 2) return Math.floor(question.points * 0.5);
  if (hintUsed || retryCount === 1) return Math.floor(question.points * 0.7);
  return question.points;
}

// Check a multiple-choice or short-response answer.
export function checkAnswer(
  question: MissionQuestion,
  studentAnswer: string
): boolean {
  if (question.type === "multiple_choice" || question.type === "short_response") {
    return question.correct?.trim().toLowerCase() === studentAnswer.trim().toLowerCase();
  }
  if (question.type === "numeric") {
    const parsed = parseFloat(studentAnswer.replace(/[$,]/g, ""));
    if (isNaN(parsed)) return false;
    if (question.acceptableRange) {
      const [min, max] = question.acceptableRange;
      return parsed >= min && parsed <= max;
    }
    return Math.abs(parsed - (question.correctNumeric ?? 0)) < 0.01;
  }
  return false;
}

// Build final score breakdown for mission completion screen.
export function buildScoreBreakdown(
  mission: Mission,
  questionPoints: number,
  decisionMade: boolean,
  reflectionCompleted: boolean
): ScoreBreakdown {
  const decisionPoints = decisionMade ? mission.decision.points : 0;
  const reflectionPoints = reflectionCompleted ? mission.reflection.points : 0;

  // Completion bonus only if all questions were attempted.
  const completionBonus =
    decisionMade && reflectionCompleted ? mission.completionBonus : 0;

  return {
    questionPoints,
    decisionPoints,
    reflectionPoints,
    completionBonus,
    total: questionPoints + decisionPoints + reflectionPoints + completionBonus,
  };
}

export function maxPossibleScore(mission: Mission): number {
  const qMax = mission.questions.reduce((sum, q) => sum + q.points, 0);
  return qMax + mission.decision.points + mission.reflection.points + mission.completionBonus;
}

// Generates a random 6-character uppercase session code (e.g. "MATH42").
export function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/1/I ambiguity
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
