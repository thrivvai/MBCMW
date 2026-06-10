"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayerState, CharacterClass } from "@/lib/types";

interface PlayerStore extends PlayerState {
  isJoined: boolean;
  setPlayer: (state: PlayerState) => void;
  clearPlayer: () => void;
}

const empty: PlayerState = {
  playerId: "",
  roomId: "",
  roomCode: "",
  nickname: "",
  characterName: "",
  characterClass: "",
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      ...empty,
      isJoined: false,
      setPlayer: (state) => set({ ...state, isJoined: true }),
      clearPlayer: () => set({ ...empty, isJoined: false }),
    }),
    {
      name: "mw-player",
    }
  )
);
