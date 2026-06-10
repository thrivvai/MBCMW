-- Row Level Security Policies
-- Teachers see only their own data; students access only active sessions.

ALTER TABLE schools           ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_missions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_attempts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges    ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (used by API routes on the server).
-- Client-side queries use the anon key and are restricted by the policies below.

-- Teachers: read/write their own teacher record.
CREATE POLICY "teachers_own" ON teachers
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Sessions: a teacher can see/manage their own sessions.
CREATE POLICY "sessions_teacher_own" ON sessions
  USING (
    teacher_id IN (
      SELECT id FROM teachers
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- Public read of active sessions by join code (for student join flow) is handled
-- server-side through the service role; no client-direct access needed.

-- Student data is managed entirely through service-role API routes.
-- No direct client-side read of other students' data.
CREATE POLICY "student_profiles_no_direct_client" ON student_profiles
  USING (false);

CREATE POLICY "mission_attempts_no_direct_client" ON mission_attempts
  USING (false);

CREATE POLICY "student_answers_no_direct_client" ON student_answers
  USING (false);

CREATE POLICY "student_badges_no_direct_client" ON student_badges
  USING (false);

-- Session missions: readable by teachers who own the session.
CREATE POLICY "session_missions_teacher_read" ON session_missions
  USING (
    session_id IN (
      SELECT s.id FROM sessions s
      JOIN teachers t ON t.id = s.teacher_id
      WHERE t.clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );
