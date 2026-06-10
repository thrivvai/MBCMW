-- MathWorld Classroom MVP — Initial Schema
-- COPPA compliance: no student PII; students are anonymous within teacher-controlled sessions.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Schools ────────────────────────────────────────────────────────────────
CREATE TABLE schools (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Teachers (linked to Clerk user IDs) ────────────────────────────────────
CREATE TABLE teachers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id   TEXT UNIQUE NOT NULL,
  email           TEXT NOT NULL,
  name            TEXT NOT NULL,
  school_id       UUID REFERENCES schools(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Sessions (classroom sessions created by a teacher) ─────────────────────
CREATE TABLE sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  UUID REFERENCES teachers(id) NOT NULL,
  join_code   TEXT UNIQUE NOT NULL,
  grade_band  TEXT NOT NULL CHECK (grade_band IN ('4-5', '6-8', '9-12')),
  status      TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  ended_at    TIMESTAMPTZ
);

-- ─── Session → Missions (ordered list of missions assigned to a session) ────
CREATE TABLE session_missions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  mission_id   TEXT NOT NULL,  -- references JSON content file id
  order_index  INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, mission_id)
);

-- ─── Student Profiles (anonymous; no PII beyond teacher-assigned nickname) ──
CREATE TABLE student_profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  nickname    TEXT NOT NULL,
  grade_band  TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Mission Attempts (tracks one student's run through one mission) ─────────
CREATE TABLE mission_attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES student_profiles(id) ON DELETE CASCADE NOT NULL,
  session_id      UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  mission_id      TEXT NOT NULL,
  status          TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  score           INTEGER DEFAULT 0,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  decision_made   TEXT,         -- which decision option was chosen
  reflection_text TEXT,
  UNIQUE (student_id, mission_id)
);

-- ─── Student Answers (per-question checkpoint; enables session recovery) ─────
CREATE TABLE student_answers (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id           UUID REFERENCES mission_attempts(id) ON DELETE CASCADE NOT NULL,
  question_id          TEXT NOT NULL,
  answer               TEXT NOT NULL,
  is_correct           BOOLEAN NOT NULL,
  hint_used            BOOLEAN DEFAULT FALSE,
  retry_count          INTEGER DEFAULT 0,
  points_earned        INTEGER DEFAULT 0,
  time_spent_seconds   INTEGER,
  answered_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (attempt_id, question_id)
);

-- ─── Badges earned by students ───────────────────────────────────────────────
CREATE TABLE student_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID REFERENCES student_profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id    TEXT NOT NULL,
  earned_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, badge_id)
);

-- ─── Indexes for common query patterns ──────────────────────────────────────
CREATE INDEX idx_sessions_join_code       ON sessions(join_code);
CREATE INDEX idx_sessions_teacher         ON sessions(teacher_id);
CREATE INDEX idx_student_profiles_session ON student_profiles(session_id);
CREATE INDEX idx_mission_attempts_student ON mission_attempts(student_id);
CREATE INDEX idx_mission_attempts_session ON mission_attempts(session_id);
CREATE INDEX idx_student_answers_attempt  ON student_answers(attempt_id);
