"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { usePlayerStore } from "@/stores/player-store";
import type { CharacterClass } from "@/lib/types";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const CLASS_COLORS: Record<CharacterClass, string> = {
  speedster: "#C9A84C",
  tactician: "#6A8A7A",
  berserker: "#BE6060",
  scholar: "#8A7AAA",
};

const CLASS_LABELS: Record<CharacterClass, string> = {
  speedster: "Speedster",
  tactician: "Tactician",
  berserker: "Berserker",
  scholar: "Scholar",
};

interface LobbyPlayer {
  playerId: string;
  nickname: string;
  characterName: string;
  characterClass: CharacterClass;
  joinedAt: string;
}

interface RoomInfo {
  id: string;
  roomCode: string;
  status: string;
  currentQuestionIndex: number;
  mode: string;
}

export default function LobbyPage() {
  const { roomId } = useParams() as { roomId: string };
  const router = useRouter();
  const player = usePlayerStore();
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [room, setRoom] = useState<RoomInfo | null>(null);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  const fetchPlayers = useCallback(async () => {
    const res = await fetch(`/api/rooms/${roomId}/players`);
    if (!res.ok) return;
    const data = await res.json();
    setRoom(data.room);
    setPlayers(data.players);

    // If battle has started, navigate to battle screen
    if (data.room.status === "question_open" || data.room.status === "active") {
      router.replace(`/battle/${roomId}`);
    }
    if (data.room.status === "ended") {
      router.replace(`/battle/${roomId}/results`);
    }
  }, [roomId, router]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  // Realtime: watch for new players joining and room status changes
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`lobby-${roomId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomId}` },
        () => fetchPlayers()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "battle_rooms", filter: `id=eq.${roomId}` },
        () => fetchPlayers()
      )
      .subscribe();
    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [roomId, fetchPlayers]);

  const myPlayer = players.find((p) => p.playerId === player.playerId);
  const myClass = (myPlayer?.characterClass ?? player.characterClass) as CharacterClass | "";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0B0C0F] relative overflow-hidden">

      {/* Slow ambient pulse */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute rounded-full"
          style={{
            width: "80vw", height: "80vw",
            left: "10%", top: "-20%",
            background: "radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%)",
            filter: "blur(100px)",
            animation: "cosmicDrift 50s ease-in-out infinite",
          }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-12 relative z-10">
        <div className="max-w-xl w-full space-y-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: "#4A9A6A",
                  boxShadow: "0 0 6px rgba(74,154,106,0.6)",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <span className="text-xs text-[#4A9A6A] font-semibold uppercase tracking-[0.15em]">
                Lobby Open
              </span>
            </div>

            <h1
              className="font-display text-[#EDE8DC] tracking-tight mb-2"
              style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700 }}
            >
              Waiting for Battle
            </h1>
            <p className="text-[#666360] text-sm font-light">
              The teacher will launch when everyone is ready.
            </p>
          </motion.div>

          {/* Room code card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45, ease: EASE_OUT_EXPO }}
            className="rounded-sm p-5 text-center"
            style={{
              background: "rgba(17,19,24,0.80)",
              border: "1px solid rgba(201,168,76,0.15)",
            }}
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#3A3836] font-semibold mb-2">
              Room Code
            </p>
            <p
              className="font-display text-[#C9A84C] tracking-[0.3em] font-bold"
              style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}
            >
              {room?.roomCode ?? player.roomCode}
            </p>
          </motion.div>

          {/* Your character */}
          {myClass && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4, ease: EASE_OUT_EXPO }}
              className="rounded-sm px-5 py-4 flex items-center gap-4"
              style={{
                background: "rgba(17,19,24,0.60)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{
                  background: CLASS_COLORS[myClass as CharacterClass] + "22",
                  border: `1px solid ${CLASS_COLORS[myClass as CharacterClass]}44`,
                  color: CLASS_COLORS[myClass as CharacterClass],
                }}
              >
                {(myPlayer?.characterName ?? player.characterName).slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#EDE8DC] truncate">
                  {myPlayer?.characterName ?? player.characterName}
                </p>
                <p className="text-xs text-[#666360] font-light">{CLASS_LABELS[myClass as CharacterClass]}</p>
              </div>
              <span
                className="text-xs font-semibold px-2 py-1 rounded-sm flex-shrink-0"
                style={{
                  background: CLASS_COLORS[myClass as CharacterClass] + "15",
                  color: CLASS_COLORS[myClass as CharacterClass],
                }}
              >
                You
              </span>
            </motion.div>
          )}

          {/* Players list */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45, ease: EASE_OUT_EXPO }}
            className="rounded-sm overflow-hidden"
            style={{
              background: "rgba(17,19,24,0.80)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="px-5 py-4 border-b border-[#1C1D24] flex items-center justify-between">
              <p className="text-sm font-semibold text-[#EDE8DC]">
                Players in lobby{" "}
                <span className="text-[#666360] font-light">({players.length})</span>
              </p>
            </div>

            {players.length === 0 ? (
              <div className="px-5 py-8 text-center text-[#3A3836] text-sm font-light">
                Waiting for players to join…
              </div>
            ) : (
              <ul className="divide-y divide-[#111318]">
                <AnimatePresence initial={false}>
                  {players.map((p, i) => {
                    const color = CLASS_COLORS[p.characterClass];
                    const isMe = p.playerId === player.playerId;
                    return (
                      <motion.li
                        key={p.playerId}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.35, ease: EASE_OUT_EXPO }}
                        className="flex items-center gap-3 px-5 py-3"
                        style={{ background: isMe ? "rgba(201,168,76,0.04)" : "transparent" }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                          style={{
                            background: color + "20",
                            border: `1px solid ${color}35`,
                            color,
                          }}
                        >
                          {p.characterName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#EDE8DC] truncate">
                            {p.characterName}
                            {isMe && (
                              <span className="ml-2 text-[10px] text-[#C9A84C] font-semibold uppercase tracking-wider">
                                you
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-[#3A3836] font-light">{p.nickname}</p>
                        </div>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-sm flex-shrink-0 uppercase tracking-wide"
                          style={{
                            background: color + "15",
                            color,
                          }}
                        >
                          {CLASS_LABELS[p.characterClass]}
                        </span>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}
          </motion.div>

          {/* Waiting indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-4"
          >
            <div className="flex items-center justify-center gap-1.5 mb-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#3A3836]"
                  style={{
                    animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-[#3A3836] font-light tracking-wide">
              Waiting for teacher to launch
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
