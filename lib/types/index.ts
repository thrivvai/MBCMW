// ─── Mission Content Types (loaded from JSON files) ────────────────────────

export type GradeBand = "4-5" | "6-8" | "9-12";
export type QuestionType = "multiple_choice" | "numeric" | "short_response";
export type MissionStatus = "in_progress" | "completed";
export type SessionStatus = "active" | "ended";

export interface MissionQuestion {
  id: string;
  type: QuestionType;
  text: string;
  hint: string;
  explanation: string;
  points: number;
  // multiple_choice only
  options?: string[];
  correct?: string;
  // numeric only
  correctNumeric?: number;
  acceptableRange?: [number, number];
}

export interface DecisionOption {
  id: string;
  text: string;
  outcome: string;
}

export interface Mission {
  id: string;
  title: string;
  gradeBand: GradeBand;
  district: string;
  theme: string;
  mathFocus: string;
  estimatedMinutes: number;
  scenario: {
    setup: string;
    conflict: string;
    objective: string;
  };
  learningObjective: string;
  questions: MissionQuestion[];
  decision: {
    prompt: string;
    options: DecisionOption[];
    points: number;
  };
  reflection: {
    prompt: string;
    points: number;
  };
  badge: {
    id: string;
    name: string;
    description: string;
  };
  completionBonus: number;
}

// ─── Database Row Types ─────────────────────────────────────────────────────

export interface School {
  id: string;
  name: string;
  created_at: string;
}

export interface Teacher {
  id: string;
  clerk_user_id: string;
  email: string;
  name: string;
  school_id: string | null;
  created_at: string;
}

export interface Session {
  id: string;
  teacher_id: string;
  join_code: string;
  grade_band: GradeBand;
  status: SessionStatus;
  created_at: string;
  ended_at: string | null;
}

export interface SessionMission {
  id: string;
  session_id: string;
  mission_id: string;
  order_index: number;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  session_id: string;
  nickname: string;
  grade_band: GradeBand;
  created_at: string;
}

export interface MissionAttempt {
  id: string;
  student_id: string;
  session_id: string;
  mission_id: string;
  status: MissionStatus;
  score: number;
  started_at: string;
  completed_at: string | null;
  decision_made: string | null;
  reflection_text: string | null;
}

export interface StudentAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  answer: string;
  is_correct: boolean;
  hint_used: boolean;
  retry_count: number;
  points_earned: number;
  time_spent_seconds: number | null;
  answered_at: string;
}

export interface StudentBadge {
  id: string;
  student_id: string;
  badge_id: string;
  earned_at: string;
}

// ─── API Request / Response Types ──────────────────────────────────────────

export interface JoinSessionRequest {
  joinCode: string;
  nickname: string;
}

export interface JoinSessionResponse {
  studentId: string;
  sessionId: string;
  gradeBand: GradeBand;
  assignedMissions: string[];
}

export interface StartAttemptResponse {
  attemptId: string;
  previousAnswers: StudentAnswer[];
}

export interface SubmitAnswerRequest {
  attemptId: string;
  questionId: string;
  answer: string;
  hintUsed: boolean;
  retryCount: number;
  timeSpentSeconds: number;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  pointsEarned: number;
  explanation: string;
  totalScore: number;
}

export interface SubmitDecisionRequest {
  attemptId: string;
  decisionId: string;
}

export interface CompleteMissionRequest {
  attemptId: string;
  reflectionText: string;
}

export interface CompleteMissionResponse {
  finalScore: number;
  badgeEarned: Mission["badge"];
  breakdown: ScoreBreakdown;
}

export interface ScoreBreakdown {
  questionPoints: number;
  decisionPoints: number;
  reflectionPoints: number;
  completionBonus: number;
  total: number;
}

// ─── Teacher Dashboard Types ────────────────────────────────────────────────

export interface StudentProgressSummary {
  studentId: string;
  nickname: string;
  currentMission: string | null;
  missionsCompleted: number;
  totalMissions: number;
  totalScore: number;
  lastActive: string | null;
}

export interface ClassMetrics {
  studentsJoined: number;
  missionsCompleted: number;
  averageScore: number;
  averageTimeMinutes: number;
}

// ─── Client-Side Session Store Types ────────────────────────────────────────

export interface StudentSessionState {
  studentId: string;
  sessionId: string;
  sessionCode: string;
  nickname: string;
  gradeBand: GradeBand;
  assignedMissions: string[];
}

// ─── Game Types ──────────────────────────────────────────────────────────────

export type CharacterClass = "speedster" | "tactician" | "berserker" | "scholar";

export type BattleRoomStatus =
  | "lobby"
  | "active"
  | "question_open"
  | "question_closed"
  | "ended";

export interface BattleQuestion {
  id: string;
  text: string;
  type: "multiple_choice" | "numeric";
  options?: string[];
  correct?: string;
  correctNumeric?: number;
  acceptableRange?: [number, number];
  hint: string;
  explanation: string;
  timeLimitSeconds: number;
}

export interface QuestionSet {
  id: string;
  title: string;
  gradeBand: string | null;
  questions: BattleQuestion[];
}

export interface BattleRoom {
  id: string;
  teacherId: string;
  roomCode: string;
  questionSetId: string;
  mode: "individual" | "team";
  status: BattleRoomStatus;
  currentQuestionIndex: number;
  questionStartedAt: string | null;
  createdAt: string;
  endedAt: string | null;
}

export interface Player {
  id: string;
  roomId: string;
  nickname: string;
  characterName: string;
  characterClass: CharacterClass;
  teamId: string | null;
  abilityUsed: boolean;
  joinedAt: string;
}

export interface PlayerScore {
  playerId: string;
  roomId: string;
  totalScore: number;
  questionsAnswered: number;
  questionsCorrect: number;
  currentStreak: number;
  maxStreak: number;
  abilityUsesRemaining: number;
}

export interface LeaderboardPlayer {
  playerId: string;
  nickname: string;
  characterName: string;
  characterClass: CharacterClass;
  totalScore: number;
  questionsCorrect: number;
  currentStreak: number;
}

export interface BattleState {
  room: BattleRoom;
  currentQuestion: BattleQuestion | null;
  leaderboard: LeaderboardPlayer[];
  questionSet: QuestionSet;
}

// Safe version served to students (correct answers stripped server-side)
export type SafeBattleQuestion = Pick<
  BattleQuestion,
  "id" | "text" | "type" | "options" | "hint" | "timeLimitSeconds"
>;

// ─── Game API Request / Response Types ──────────────────────────────────────

export interface JoinRoomRequest {
  roomCode: string;
  nickname: string;
  characterName: string;
  characterClass: CharacterClass;
}

export interface JoinRoomResponse {
  playerId: string;
  roomId: string;
  roomCode: string;
  questionSetTitle: string;
}

export interface SubmitBattleAnswerRequest {
  playerId: string;
  questionIndex: number;
  answer: string;
  timeRemainingMs: number;
}

export interface SubmitBattleAnswerResponse {
  isCorrect: boolean;
  finalScore: number;
  abilityTriggered: string | null;
  correctAnswer: string;
  explanation: string;
}

// ─── Client-Side Player Store Types ─────────────────────────────────────────

export interface PlayerState {
  playerId: string;
  roomId: string;
  roomCode: string;
  nickname: string;
  characterName: string;
  characterClass: CharacterClass | "";
}
