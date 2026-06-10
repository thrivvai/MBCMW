"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { usePlayerStore } from "@/stores/player-store";
import type { CharacterClass } from "@/lib/types";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const CLASSES: {
  id: CharacterClass;
  name: string;
  tagline: string;
  ability: string;
  passive: string;
  symbol: React.ReactNode;
  accent: string;
  accentBg: string;
}[] = [
  {
    id: "speedster",
    name: "Speedster",
    tagline: "First one in wins",
    ability: "First to answer gets +200 bonus points every round.",
    passive: "+10% time bonus on every correct answer.",
    symbol: <SpeedIcon />,
    accent: "#C9A84C",
    accentBg: "rgba(201,168,76,0.08)",
  },
  {
    id: "tactician",
    name: "Tactician",
    tagline: "Patience is power",
    ability: "Your streak bonus activates after just 2 in a row (not 3).",
    passive: "Freeze Time: pause your personal clock once per battle.",
    symbol: <TacticIcon />,
    accent: "#6A8A7A",
    accentBg: "rgba(106,138,122,0.08)",
  },
  {
    id: "berserker",
    name: "Berserker",
    tagline: "Go big or go home",
    ability: "Hit a 3-streak and your next correct answer is worth DOUBLE.",
    passive: "Wrong answers don't kill your streak — they just slow it.",
    symbol: <BerserkerIcon />,
    accent: "#BE6060",
    accentBg: "rgba(190,96,96,0.08)",
  },
  {
    id: "scholar",
    name: "Scholar",
    tagline: "Accuracy over speed",
    ability: "Use a hint once per battle with NO point penalty.",
    passive: "+50 bonus points on every single correct answer.",
    symbol: <ScholarIcon />,
    accent: "#8A7AAA",
    accentBg: "rgba(138,122,170,0.08)",
  },
];

function SpeedIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 14h12M12 8l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TacticIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="15" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5" y="15" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 19h8M19 15v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BerserkerIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 4L17 11H24L18.5 15.5L21 23L14 18.5L7 23L9.5 15.5L4 11H11L14 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function ScholarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M6 10h16M6 14h10M6 18h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="4" y="4" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CharacterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setPlayer = usePlayerStore((s) => s.setPlayer);

  const roomCode = searchParams.get("roomCode") ?? "";
  const nickname = searchParams.get("nickname") ?? "";

  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [characterName, setCharacterName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnterBattle = async () => {
    setError("");
    if (!selectedClass) {
      setError("Choose your class before entering the battle.");
      return;
    }
    if (!characterName.trim()) {
      setError("Give your character a name.");
      return;
    }
    if (!roomCode || !nickname) {
      router.push("/join");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode,
          nickname,
          characterName: characterName.trim(),
          characterClass: selectedClass,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to join. Try again.");
        return;
      }

      setPlayer({
        playerId: data.playerId,
        roomId: data.roomId,
        roomCode: data.roomCode,
        nickname,
        characterName: characterName.trim(),
        characterClass: selectedClass,
      });

      router.push(`/battle/${data.roomId}/lobby`);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0B0C0F] relative overflow-hidden">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute rounded-full"
          style={{
            width: "70vw", height: "70vw",
            left: "15%", top: "-10%",
            background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-12 relative z-10">
        <div className="max-w-2xl w-full space-y-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#3A3836] font-semibold mb-3">
              Battle Code <span className="text-[#C9A84C]">{roomCode}</span>
            </p>
            <h1
              className="font-display text-[#EDE8DC] tracking-tight mb-2"
              style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700 }}
            >
              Choose Your Class
            </h1>
            <p className="text-[#666360] text-sm font-light">
              Each class plays differently. Choose the style that fits you.
            </p>
          </motion.div>

          {/* Class cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CLASSES.map((cls, i) => {
              const isSelected = selectedClass === cls.id;
              return (
                <motion.button
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: EASE_OUT_EXPO }}
                  onClick={() => setSelectedClass(cls.id)}
                  className="text-left p-5 rounded-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  style={{
                    background: isSelected ? cls.accentBg : "rgba(17,19,24,0.80)",
                    border: `1px solid ${isSelected ? cls.accent + "66" : "rgba(255,255,255,0.07)"}`,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Icon + name row */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-sm"
                      style={{
                        background: isSelected ? cls.accentBg : "rgba(255,255,255,0.04)",
                        color: isSelected ? cls.accent : "#666360",
                        border: `1px solid ${isSelected ? cls.accent + "33" : "rgba(255,255,255,0.06)"}`,
                      }}
                    >
                      {cls.symbol}
                    </div>

                    {/* Selected indicator */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="w-5 h-5 flex items-center justify-center rounded-full"
                          style={{ background: cls.accent }}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4.5 7.5L8 3" stroke="#0B0C0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <p
                    className="font-semibold mb-0.5 text-base"
                    style={{ color: isSelected ? "#EDE8DC" : "#9A9694" }}
                  >
                    {cls.name}
                  </p>
                  <p
                    className="text-xs mb-3 font-light"
                    style={{ color: isSelected ? cls.accent : "#3A3836" }}
                  >
                    {cls.tagline}
                  </p>

                  <div className="space-y-1.5">
                    <p className="text-xs leading-relaxed" style={{ color: isSelected ? "#EDE8DC" : "#666360" }}>
                      <span
                        className="font-semibold"
                        style={{ color: isSelected ? cls.accent : "#3A3836" }}
                      >
                        Special:{" "}
                      </span>
                      {cls.ability}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: isSelected ? "#9A9694" : "#3A3836" }}>
                      <span className="font-semibold">Passive: </span>
                      {cls.passive}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Character name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.45, ease: EASE_OUT_EXPO }}
            className="p-6 rounded-sm space-y-4"
            style={{
              background: "rgba(17,19,24,0.80)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div>
              <p className="text-sm font-semibold text-[#EDE8DC] mb-1">Name Your Character</p>
              <p className="text-xs text-[#666360] font-light">
                This is the name that appears on the leaderboard.
              </p>
            </div>
            <Input
              id="char-name"
              label=""
              placeholder={
                selectedClass === "speedster" ? "e.g. Blitz, Flash, Quickdraw" :
                selectedClass === "tactician" ? "e.g. Oracle, Cipher, Nexus" :
                selectedClass === "berserker" ? "e.g. Titan, Rampage, Storm" :
                selectedClass === "scholar" ? "e.g. Sage, Axiom, Theorem" :
                "e.g. MathWarlord, Cipher, Blitz"
              }
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              maxLength={20}
              className="h-12 text-base"
              onKeyDown={(e) => e.key === "Enter" && handleEnterBattle()}
            />
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                key="err"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-center px-4 py-3 rounded-sm text-[#E07070]"
                style={{ background: "rgba(190,70,70,0.08)", border: "1px solid rgba(190,70,70,0.20)" }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Enter battle CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.45, ease: EASE_OUT_EXPO }}
          >
            <button
              onClick={handleEnterBattle}
              disabled={loading || !selectedClass || !characterName.trim()}
              className="w-full py-4 font-semibold text-base rounded-sm transition-all duration-150 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: "#EDE8DC",
                color: "#0B0C0F",
                minHeight: "56px",
              }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-[#0B0C0F]/30 border-t-[#0B0C0F] rounded-full animate-spin" />
                  Entering lobby…
                </span>
              ) : "Enter the Lobby"}
            </button>
          </motion.div>

          {/* Back link */}
          <button
            onClick={() => router.push("/join")}
            className="w-full text-center text-xs text-[#3A3836] hover:text-[#666360] transition-colors duration-200 cursor-pointer"
            style={{ minHeight: "32px" }}
          >
            Wrong code? Go back
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CharacterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0C0F]">
        <div className="w-8 h-8 border-2 border-[#C9A84C]/40 border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    }>
      <CharacterPageInner />
    </Suspense>
  );
}
