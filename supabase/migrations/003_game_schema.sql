-- MathWorld Game Schema — Battle Rooms, Players, Question Sets, Scoring

-- ─── Question Sets ───────────────────────────────────────────────────────────
-- Stored before battle_rooms so the FK can reference it.
CREATE TABLE question_sets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  grade_band  TEXT,
  questions   JSONB NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Battle Rooms ────────────────────────────────────────────────────────────
CREATE TABLE battle_rooms (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id              UUID REFERENCES teachers(id) NOT NULL,
  room_code               TEXT UNIQUE NOT NULL,
  question_set_id         UUID REFERENCES question_sets(id) NOT NULL,
  mode                    TEXT DEFAULT 'individual'
                            CHECK (mode IN ('individual', 'team')),
  status                  TEXT DEFAULT 'lobby'
                            CHECK (status IN ('lobby', 'active', 'question_open', 'question_closed', 'ended')),
  current_question_index  INTEGER DEFAULT -1,
  question_started_at     TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  ended_at                TIMESTAMPTZ
);

-- ─── Players ─────────────────────────────────────────────────────────────────
CREATE TABLE players (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id          UUID REFERENCES battle_rooms(id) ON DELETE CASCADE NOT NULL,
  nickname         TEXT NOT NULL,
  character_name   TEXT NOT NULL,
  character_class  TEXT NOT NULL
                     CHECK (character_class IN ('speedster', 'tactician', 'berserker', 'scholar')),
  team_id          UUID,
  ability_used     BOOLEAN DEFAULT FALSE,
  joined_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Question Answers ────────────────────────────────────────────────────────
CREATE TABLE question_answers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id           UUID REFERENCES battle_rooms(id) ON DELETE CASCADE NOT NULL,
  player_id         UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  question_index    INTEGER NOT NULL,
  answer            TEXT NOT NULL,
  is_correct        BOOLEAN NOT NULL,
  answered_at       TIMESTAMPTZ DEFAULT NOW(),
  time_remaining_ms INTEGER,
  raw_score         INTEGER DEFAULT 0,
  ability_bonus     INTEGER DEFAULT 0,
  final_score       INTEGER DEFAULT 0,
  ability_triggered TEXT,
  UNIQUE (player_id, question_index)
);

-- ─── Player Scores (running totals for leaderboard) ──────────────────────────
CREATE TABLE player_scores (
  player_id              UUID PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  room_id                UUID REFERENCES battle_rooms(id) ON DELETE CASCADE NOT NULL,
  total_score            INTEGER DEFAULT 0,
  questions_answered     INTEGER DEFAULT 0,
  questions_correct      INTEGER DEFAULT 0,
  current_streak         INTEGER DEFAULT 0,
  max_streak             INTEGER DEFAULT 0,
  ability_uses_remaining INTEGER DEFAULT 1,
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX idx_battle_rooms_room_code   ON battle_rooms(room_code);
CREATE INDEX idx_battle_rooms_teacher     ON battle_rooms(teacher_id);
CREATE INDEX idx_players_room             ON players(room_id);
CREATE INDEX idx_question_answers_room    ON question_answers(room_id);
CREATE INDEX idx_question_answers_player  ON question_answers(player_id);
CREATE INDEX idx_player_scores_room       ON player_scores(room_id);
