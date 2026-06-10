"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { LeaderboardPlayer, SafeBattleQuestion, CharacterClass } from "@/lib/types";

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

interface RoomState {
  id: string;
  roomCode: string;
  status: string;
  currentQuestionIndex: number;
  mode: string;
}

interface LobbyPlayer {
  playerId: string;
  nickname: string;
  characterName: string;
  characterClass: CharacterClass;
}

export default function TeacherRoomPage() {
  const { roomId } = useParams() as { roomId: string };
  const [room, setRoom] = useState<RoomState | null>(null);
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [questions, setQuestions] = useState<SafeBattleQuestion[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  const fetchRoom = useCallback(async () => {
    const [playersRes, lbRes] = await Promise.all([
      fetch(`/api/rooms/${roomId}/players`),
      fetch(`/api/rooms/${roomId}/leaderboard`),
    ]);
    if (playersRes.ok) {
      const data = await playersRes.json();
      setRoom(data.room);
      setPlayers(data.players);
    }
    if (lbRes.ok) {
      const data = await lbRes.json();
      setLeaderboard(data.leaderboard ?? []);
    }
    setLoading(false);
  }, [roomId]);

  const fetchQuestions = useCallback(async () => {
    const res = await fetch(`/api/rooms/${roomId}/question-set`);
    if (res.ok) {
      const data = await res.json();
      setQuestions(data.questions ?? []);
    }
  }, [roomId]);

  useEffect(() => {
    fetchRoom();
    fetchQuestions();
  }, [fetchRoom, fetchQuestions]);

  // Realtime updates
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`teacher-room-${roomId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomId}` }, () => fetchRoom())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "battle_rooms", filter: `id=eq.${roomId}` }, () => fetchRoom())
      .on("postgres_changes", { event: "*", schema: "public", table: "player_scores", filter: `room_id=eq.${roomId}` }, () => fetchRoom())
      .subscribe();
    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [roomId, fetchRoom]);

  // Live timer for open question
  useEffect(() => {
    if (room?.status === "question_open") {
      const currentQ = questions[room.currentQuestionIndex];
      const limit = currentQ?.timeLimitSeconds ?? 20;
      setTimer(limit);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [room?.status, room?.currentQuestionIndex, questions]);

  const handleLaunch = async () => {
    setActionLoading(true);
    await fetch(`/api/rooms/${roomId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "active" }),
    });
    await fetchRoom();
    setActionLoading(false);
  };

  const handleOpenQuestion = async (index?: number) => {
    setActionLoading(true);
    await fetch(`/api/rooms/${roomId}/question`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "open", index }),
    });
    await fetchRoom();
    setActionLoading(false);
  };

  const handleCloseQuestion = async () => {
    setActionLoading(true);
    await fetch(`/api/rooms/${roomId}/question`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "close" }),
    });
    await fetchRoom();
    setActionLoading(false);
  };

  const handleEndBattle = async () => {
    if (!confirm("End the battle? Students will be sent to the results screen.")) return;
    setActionLoading(true);
    await fetch(`/api/rooms/${roomId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ended" }),
    });
    await fetchRoom();
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#C9A84C]/40 border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    );
  }

  const currentQ = room && room.currentQuestionIndex >= 0 ? questions[room.currentQuestionIndex] : null;
  const isLastQuestion = room && questions.length > 0 && room.currentQuestionIndex >= questions.length - 1;
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl text-[#EDE8DC] font-[600] tracking-tight">
            Battle Room
          </h1>
          <p className="text-[#666360] text-sm mt-1 font-light">
            {players.length} player{players.length !== 1 ? "s" : ""} ·{" "}
            <span
              style={{
                color:
                  room?.status === "lobby" ? "#C9A84C" :
                  room?.status === "active" || room?.status === "question_open" || room?.status === "question_closed" ? "#4A9A6A" :
                  "#666360",
              }}
            >
              {room?.status === "lobby" ? "Lobby" :
               room?.status === "active" ? "Battle Active" :
               room?.status === "question_open" ? "Question Open" :
               room?.status === "question_closed" ? "Question Closed" :
               "Ended"}
            </span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(room?.status === "active" || room?.status === "question_open" || room?.status === "question_closed") && (
            <button
              onClick={handleEndBattle}
              disabled={actionLoading}
              className="px-4 py-2 rounded-sm text-sm font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-40 cursor-pointer"
              style={{
                background: "rgba(190,70,70,0.10)",
                border: "1px solid rgba(190,70,70,0.25)",
                color: "#E07070",
                minHeight: "36px",
              }}
            >
              End Battle
            </button>
          )}
        </div>
      </div>

      {/* Room code */}
      <div
        className="rounded-sm p-5 flex items-center justify-between gap-4"
        style={{ background: "rgba(17,19,24,0.80)", border: "1px solid rgba(201,168,76,0.15)" }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#3A3836] font-semibold mb-1">
            Room Code
          </p>
          <p
            className="font-display text-[#C9A84C] tracking-[0.25em] font-bold"
            style={{ fontSize: "2rem" }}
          >
            {room?.roomCode}
          </p>
        </div>
        <div className="text-right text-xs text-[#3A3836] font-light">
          <p>Students join at</p>
          <p className="text-[#666360]">{appUrl}/join</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Controls */}
        <div className="space-y-4">

          {/* LOBBY: launch button */}
          {room?.status === "lobby" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="rounded-sm p-6 space-y-4"
              style={{ background: "rgba(17,19,24,0.80)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-sm font-semibold text-[#EDE8DC]">Ready to battle?</p>
              <p className="text-xs text-[#666360] font-light">
                {players.length} player{players.length !== 1 ? "s" : ""} in lobby.
                Launch when everyone has joined.
              </p>
              <button
                onClick={handleLaunch}
                disabled={actionLoading || players.length === 0}
                className="w-full py-4 rounded-sm font-semibold text-base transition-all duration-150 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: "#EDE8DC", color: "#0B0C0F", minHeight: "52px" }}
              >
                {actionLoading ? (
                  <span className="inline-flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-[#0B0C0F]/30 border-t-[#0B0C0F] rounded-full animate-spin" />
                  </span>
                ) : "Launch Battle"}
              </button>
            </motion.div>
          )}

          {/* ACTIVE: question controls */}
          {(room?.status === "active" || room?.status === "question_closed") && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="rounded-sm p-6 space-y-4"
              style={{ background: "rgba(17,19,24,0.80)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-sm font-semibold text-[#EDE8DC]">
                {room.status === "active" ? "Start the first question" : "Question closed — ready for next?"}
              </p>
              {!isLastQuestion ? (
                <button
                  onClick={() => handleOpenQuestion(
                    room.status === "active" ? 0 : room.currentQuestionIndex + 1
                  )}
                  disabled={actionLoading}
                  className="w-full py-4 rounded-sm font-semibold text-base transition-all duration-150 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  style={{ background: "#EDE8DC", color: "#0B0C0F", minHeight: "52px" }}
                >
                  {actionLoading ? (
                    <span className="inline-flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-[#0B0C0F]/30 border-t-[#0B0C0F] rounded-full animate-spin" />
                    </span>
                  ) : room.status === "active" ? "Open Question 1" : `Open Question ${room.currentQuestionIndex + 2}`}
                </button>
              ) : (
                <button
                  onClick={handleEndBattle}
                  disabled={actionLoading}
                  className="w-full py-4 rounded-sm font-semibold text-base transition-all duration-150 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: "rgba(74,154,106,0.10)",
                    border: "1px solid rgba(74,154,106,0.25)",
                    color: "#6AC98A",
                    minHeight: "52px",
                  }}
                >
                  End Battle & Show Results
                </button>
              )}
            </motion.div>
          )}

          {/* QUESTION OPEN: current question + close */}
          {room?.status === "question_open" && currentQ && (
            <motion.div
              key={`open-${room.currentQuestionIndex}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="rounded-sm p-6 space-y-4"
              style={{ background: "rgba(17,19,24,0.80)", border: "1px solid rgba(74,154,106,0.20)" }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#EDE8DC]">
                  Question {room.currentQuestionIndex + 1} of {questions.length}
                </p>
                <span
                  className="text-2xl font-bold font-display tabular-nums"
                  style={{
                    color: timer > currentQ.timeLimitSeconds * 0.5 ? "#4A9A6A" :
                           timer > currentQ.timeLimitSeconds * 0.25 ? "#C9A84C" : "#BE4646",
                  }}
                >
                  {timer}s
                </span>
              </div>

              <p className="text-sm text-[#9A9694] font-light leading-relaxed">
                {currentQ.text}
              </p>

              {currentQ.options && (
                <div className="space-y-1">
                  {currentQ.options.map((opt, i) => (
                    <p key={i} className="text-xs text-[#3A3836] px-3 py-1.5 rounded-sm"
                       style={{ background: "rgba(255,255,255,0.02)" }}>
                      {opt}
                    </p>
                  ))}
                </div>
              )}

              <button
                onClick={handleCloseQuestion}
                disabled={actionLoading}
                className="w-full py-3 rounded-sm font-semibold text-sm transition-all duration-150 active:scale-[0.97] disabled:opacity-40 cursor-pointer"
                style={{
                  background: "rgba(190,70,70,0.10)",
                  border: "1px solid rgba(190,70,70,0.20)",
                  color: "#E07070",
                  minHeight: "44px",
                }}
              >
                Close Question Early
              </button>
            </motion.div>
          )}

          {/* Players list */}
          <div
            className="rounded-sm overflow-hidden"
            style={{ background: "rgba(17,19,24,0.80)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="px-5 py-4 border-b border-[#1C1D24]">
              <p className="text-sm font-semibold text-[#EDE8DC]">
                Players <span className="text-[#666360] font-light">({players.length})</span>
              </p>
            </div>
            {players.length === 0 ? (
              <div className="px-5 py-8 text-center text-[#3A3836] text-sm font-light">
                Waiting for students to join…
              </div>
            ) : (
              <ul className="divide-y divide-[#111318] max-h-64 overflow-y-auto">
                <AnimatePresence initial={false}>
                  {players.map((p) => {
                    const color = CLASS_COLORS[p.characterClass];
                    return (
                      <motion.li
                        key={p.playerId}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-3 px-5 py-3"
                      >
                        <div
                          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold"
                          style={{ background: color + "20", border: `1px solid ${color}35`, color }}
                        >
                          {p.characterName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#EDE8DC] truncate font-medium">{p.characterName}</p>
                          <p className="text-xs text-[#3A3836] font-light">{p.nickname}</p>
                        </div>
                        <span
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm flex-shrink-0 uppercase tracking-wide"
                          style={{ background: color + "15", color }}
                        >
                          {CLASS_LABELS[p.characterClass]}
                        </span>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>

        {/* Right: Live leaderboard */}
        <div
          className="rounded-sm overflow-hidden"
          style={{ background: "rgba(17,19,24,0.80)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="px-5 py-4 border-b border-[#1C1D24]">
            <p className="text-sm font-semibold text-[#EDE8DC]">Live Leaderboard</p>
          </div>
          {leaderboard.length === 0 ? (
            <div className="px-5 py-8 text-center text-[#3A3836] text-sm font-light">
              Scores will appear here once the battle starts.
            </div>
          ) : (
            <ul className="divide-y divide-[#111318]">
              {leaderboard.slice(0, 12).map((p, i) => {
                const color = CLASS_COLORS[p.characterClass];
                const rankColor =
                  i === 0 ? "#C9A84C" : i === 1 ? "#9A9694" : i === 2 ? "#8A6B3A" : "#3A3836";
                return (
                  <li key={p.playerId} className="flex items-center gap-3 px-5 py-3">
                    <span className="w-5 text-center text-sm font-bold font-display shrink-0" style={{ color: rankColor }}>
                      {i + 1}
                    </span>
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold"
                      style={{ background: color + "20", border: `1px solid ${color}35`, color }}
                    >
                      {p.characterName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#EDE8DC] truncate font-medium">{p.characterName}</p>
                      <p className="text-xs text-[#3A3836] font-light">
                        {p.questionsCorrect} correct
                        {p.currentStreak >= 2 && (
                          <span className="ml-1.5 text-[#C9A84C]">{p.currentStreak}x</span>
                        )}
                      </p>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-[#C9A84C] shrink-0">
                      {p.totalScore.toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
