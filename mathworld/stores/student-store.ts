"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudentSessionState, GradeBand } from "@/lib/types";

interface StudentStore extends StudentSessionState {
  isJoined: boolean;
  setSession: (session: StudentSessionState) => void;
  clearSession: () => void;
}

const empty: StudentSessionState = {
  studentId: "",
  sessionId: "",
  sessionCode: "",
  nickname: "",
  gradeBand: "4-5",
  assignedMissions: [],
};

export const useStudentStore = create<StudentStore>()(
  persist(
    (set) => ({
      ...empty,
      isJoined: false,
      setSession: (session) => set({ ...session, isJoined: true }),
      clearSession: () => set({ ...empty, isJoined: false }),
    }),
    {
      name: "mw-student-session",
    }
  )
);
