"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePlayerStore } from "@/stores/player-store";
import type { LeaderboardPlayer, CharacterClass } from "@/lib/types";

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

export default function ResultsPage() {
  const { roomId } = useParams() as { roomId: string };
  const router = useRouter();
  const player = usePlayerStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    const res = await fetch(`/api/rooms/${roomId}/leaderboard`);
    if (!res.ok) return;
    const data = await res.json();
    setLeaderboard(data.leaderboard ?? []);
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const myRank = leaderboard.findIndex((p) => p.playerId === player.playerId) + 1;
  const myStats = leaderboard.find((p) => p.playerId === player.playerId);
  const winner = leaderboard[0];

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0C0F]">
        <div className="w-8 h-8 border-2 border-[#C9A84C]/40 border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0B0C0F] relative overflow-hidden">

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute rounded-full"
          style={{
            width: "80vw", height: "80vw",
            left: "10%", top: "-20%",
            background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-12 relative z-10">
        <div className="max-w-xl w-full space-y-8">

          {/* Winner announcement */}
          {winner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 16 }}
                className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full"
                style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.30)" }}
              >
                <TrophyIcon />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[10px] uppercase tracking-[0.25em] text-[#3A3836] font-semibold mb-2"
              >
                Battle Over
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5, ease: EASE_OUT_EXPO }}
                className="font-display text-[#C9A84C] tracking-tight mb-1"
                style={{ fontSize: "clamp(1.8rem, 6vw, 2.8rem)", fontWeight: 700 }}
              >
                {winner.characterName} Wins
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-[#666360] text-sm font-light"
              >
                {winner.totalScore.toLocaleString()} points ·{" "}
                {CLASS_LABELS[winner.characterClass]}
              </motion.p>
            </motion.div>
          )}

          {/* Your result */}
          {myStats && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.45, ease: EASE_OUT_EXPO }}
              className="rounded-sm p-6"
              style={{
                background: "rgba(201,168,76,0.06)",
                border: "1px solid rgba(201,168,76,0.20)",
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C]/60 font-semibold mb-4">
                Your Result
              </p>
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{
                    background: CLASS_COLORS[myStats.characterClass] + "20",
                    border: `1px solid ${CLASS_COLORS[myStats.characterClass]}40`,
                    color: CLASS_COLORS[myStats.characterClass],
                  }}
                >
                  {myStats.characterName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#EDE8DC]">{myStats.characterName}</p>
                  <p className="text-xs text-[#666360] font-light">
                    Rank #{myRank} of {leaderboard.length}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Score", value: myStats.totalScore.toLocaleString() },
                  { label: "Correct", value: `${myStats.questionsCorrect}` },
                  { label: "Best Streak", value: `${myStats.currentStreak}x` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-sm p-3 text-center"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p className="text-lg font-bold text-[#EDE8DC] font-display">{stat.value}</p>
                    <p className="text-[10px] text-[#3A3836] font-light mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Full leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.45, ease: EASE_OUT_EXPO }}
            className="rounded-sm overflow-hidden"
            style={{ background: "rgba(17,19,24,0.80)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="px-5 py-4 border-b border-[#1C1D24]">
              <p className="text-sm font-semibold text-[#EDE8DC]">Final Standings</p>
            </div>
            <ul className="divide-y divide-[#111318]">
              {leaderboard.map((p, i) => {
                const isMe = p.playerId === player.playerId;
                const color = CLASS_COLORS[p.characterClass];
                const rankColor =
                  i === 0 ? "#C9A84C" : i === 1 ? "#9A9694" : i === 2 ? "#8A6B3A" : "#3A3836";
                return (
                  <motion.li
                    key={p.playerId}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 + i * 0.05, duration: 0.3, ease: EASE_OUT_EXPO }}
                    className="flex items-center gap-3 px-5 py-3.5"
                    style={{ background: isMe ? "rgba(201,168,76,0.04)" : "transparent" }}
                  >
                    <span className="w-6 text-center text-sm font-bold font-display shrink-0" style={{ color: rankColor }}>
                      {i + 1}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                      style={{ background: color + "20", border: `1px solid ${color}35`, color }}
                    >
                      {p.characterName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#EDE8DC] truncate">
                        {p.characterName}
                        {isMe && <span className="ml-2 text-[10px] text-[#C9A84C] font-semibold uppercase tracking-wider">you</span>}
                      </p>
                      <p className="text-xs text-[#3A3836] font-light">
                        {p.questionsCorrect} correct · {CLASS_LABELS[p.characterClass]}
                      </p>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-[#C9A84C] shrink-0">
                      {p.totalScore.toLocaleString()}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <button
              onClick={() => {
                usePlayerStore.getState().clearPlayer();
                router.push("/join");
              }}
              className="px-8 py-3 rounded-sm font-semibold text-sm transition-all duration-150 active:scale-[0.97] cursor-pointer"
              style={{
                background: "rgba(17,19,24,0.80)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#9A9694",
              }}
            >
              Play Again
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" style={{ color: "#C9A84C" }}>
      <path
        d="M9 3h10M7 3C7 3 5 3 5 7c0 3 2 5 4 5.5M21 3c0 0 2 0 2 4 0 3-2 5-4 5.5M9 12.5C9.5 16 11.5 18 14 19c2.5-1 4.5-3 5-6.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M11 19v3M17 19v3M9 22h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
