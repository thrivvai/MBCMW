-- Row Level Security — Game Tables
-- All game state is managed via service-role API routes.
-- Client-side (anon key) access is fully locked down.

ALTER TABLE question_sets    ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_rooms     ENABLE ROW LEVEL SECURITY;
ALTER TABLE players          ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_scores    ENABLE ROW LEVEL SECURITY;

-- Question sets: public read (questions are revealed during live battles anyway).
CREATE POLICY "question_sets_public_read" ON question_sets
  FOR SELECT USING (true);

-- Battle rooms: teachers manage only their own rooms.
CREATE POLICY "battle_rooms_teacher_own" ON battle_rooms
  USING (
    teacher_id IN (
      SELECT id FROM teachers
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- Players, answers, scores: no direct client access — service role only.
CREATE POLICY "players_no_direct_client" ON players
  USING (false);

CREATE POLICY "question_answers_no_direct_client" ON question_answers
  USING (false);

CREATE POLICY "player_scores_no_direct_client" ON player_scores
  USING (false);
