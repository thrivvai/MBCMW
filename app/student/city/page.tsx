"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStudentStore } from "@/stores/student-store";
import { DISTRICT_CONFIG, getMissionsForGradeBand } from "@/lib/utils";
import { StarField } from "@/components/ui/StarField";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import { TiltCard } from "@/components/ui/TiltCard";

const ALL_DISTRICTS = [
  "budget-borough",
  "savings-station",
  "market-street",
  "credit-crossing",
  "startup-square",
] as const;

// Cosmic district accent palette drawn from reference images
const DISTRICT_ACCENTS: Record<string, {
  glow: string; border: string; bg: string; badge: string; badgeBorder: string; dot: string;
}> = {
  "budget-borough":  {
    glow: "rgba(139,92,246,0.15)",
    border: "rgba(139,92,246,0.30)",
    bg: "rgba(109,40,217,0.08)",
    badge: "rgba(139,92,246,0.10)",
    badgeBorder: "rgba(139,92,246,0.25)",
    dot: "#8B5CF6",
  },
  "savings-station": {
    glow: "rgba(0,204,216,0.12)",
    border: "rgba(0,204,216,0.28)",
    bg: "rgba(0,204,216,0.06)",
    badge: "rgba(0,204,216,0.08)",
    badgeBorder: "rgba(0,204,216,0.22)",
    dot: "#00CCD8",
  },
  "market-street":   {
    glow: "rgba(232,168,32,0.12)",
    border: "rgba(232,168,32,0.30)",
    bg: "rgba(232,168,32,0.06)",
    badge: "rgba(232,168,32,0.10)",
    badgeBorder: "rgba(232,168,32,0.25)",
    dot: "#E8A820",
  },
  "credit-crossing": {
    glow: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.25)",
    bg: "rgba(239,68,68,0.05)",
    badge: "rgba(239,68,68,0.08)",
    badgeBorder: "rgba(239,68,68,0.20)",
    dot: "#F87171",
  },
  "startup-square":  {
    glow: "rgba(0,204,216,0.10)",
    border: "rgba(0,168,184,0.25)",
    bg: "rgba(0,168,184,0.05)",
    badge: "rgba(0,204,216,0.08)",
    badgeBorder: "rgba(0,168,184,0.20)",
    dot: "#00CCD8",
  },
};

// Atmospheric city skyline — warm amber lights on a void backdrop
function CitySkyline() {
  return (
    <svg
      viewBox="0 0 1400 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* Buildings — near-black silhouettes */}
      {[
        [0,160,55,40],[60,130,40,70],[105,148,70,52],[180,110,35,90],[220,138,50,62],
        [275,92,30,108],[310,122,60,78],[375,72,45,128],[425,138,55,62],[485,98,35,102],
        [525,118,70,82],[600,78,40,122],[645,128,55,72],[705,62,35,138],[745,108,60,92],
        [810,88,45,112],[860,142,55,58],[920,98,40,102],[965,72,30,128],[1000,128,65,72],
        [1070,92,40,108],[1115,138,55,62],[1175,78,35,122],[1215,112,70,88],[1290,98,50,102],[1345,132,55,68],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="#050810" />
      ))}

      {/* Warm amber window lights */}
      {[
        [82,118],[82,132],[92,125],[97,115],[197,125],[207,118],[392,90],[402,105],[415,90],
        [622,98],[632,110],[718,82],[728,95],[828,108],[838,120],[982,92],[992,105],
        [1090,112],[1100,98],[1192,98],[1202,110],[1230,128],[1240,118],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x} y={y}
          width={4} height={4}
          fill={i % 3 === 0 ? "#E8A820" : i % 3 === 1 ? "#F5C040" : "#C8860A"}
          opacity={0.6 + (i % 3) * 0.15}
        />
      ))}

      {/* Faint rooftop teal glow on tallest towers */}
      {[378, 707, 745].map((x, i) => (
        <ellipse key={i} cx={x + 22} cy={72 + i * 8} rx={25} ry={4} fill="#00CCD8" opacity={0.08} />
      ))}

      <rect x="0" y="198" width="1400" height="2" fill="#1A1F35" opacity={0.4} />
    </svg>
  );
}

export default function CityPage() {
  const { nickname, gradeBand, assignedMissions, sessionCode } = useStudentStore();
  const gradeMissions = getMissionsForGradeBand(gradeBand);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#030507" }}>
      <StarField count={90} />
      <CosmicBackground />

      {/* Header */}
      <header
        className="sticky top-0 z-20 px-6 py-4"
        style={{
          background: "rgba(3,5,7,0.75)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em]" style={{ color: "#2A2A3A" }}>
              Session: {sessionCode}
            </p>
            <p className="font-semibold text-lg" style={{ color: "#E8E4D8" }}>
              👋 {nickname}
            </p>
          </div>
          <span
            className="text-xs px-4 py-1.5 rounded-full font-medium"
            style={{
              background: "rgba(139,92,246,0.10)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: "#C4B5FD",
            }}
          >
            Grade {gradeBand}
          </span>
        </div>
      </header>

      {/* Atmospheric skyline */}
      <div className="relative z-10 mt-2 opacity-70">
        <CitySkyline />
        <div
          className="h-20 -mt-1"
          style={{ background: "linear-gradient(to bottom, transparent, #030507)" }}
        />
      </div>

      {/* City title */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h1 className="font-display font-extrabold tracking-tight mb-3" style={{ fontSize: "clamp(2.5rem,8vw,5rem)", color: "#E8E4D8" }}>
            MathWorld{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #E8A820, #F5C040 40%, #00CCD8)",
                backgroundSize: "200% 200%",
                animation: "gradientShift 6s ease infinite",
              }}
            >
              City
            </span>
          </h1>
          <p style={{ color: "#5A5A6E", fontWeight: 300 }}>Choose a district and start your mission.</p>
        </motion.div>

        {/* Districts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_DISTRICTS.map((districtKey, i) => {
            const config = DISTRICT_CONFIG[districtKey];
            const accent = DISTRICT_ACCENTS[districtKey];
            const missionsHere = gradeMissions.filter(
              (m) =>
                m.district === districtKey &&
                (assignedMissions.length === 0 || assignedMissions.includes(m.id))
            );
            const isLocked = missionsHere.length === 0;

            return (
              <motion.div
                key={districtKey}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard intensity={isLocked ? 0 : 10}>
                  <div
                    className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: isLocked ? "rgba(13,16,32,0.4)" : `rgba(13,16,32,0.85)`,
                      border: `1px solid ${isLocked ? "rgba(255,255,255,0.04)" : accent.border}`,
                      boxShadow: isLocked ? "none" : `0 0 40px ${accent.glow}, 0 0 80px ${accent.glow.replace("0.15", "0.05")}`,
                      backdropFilter: "blur(12px)",
                      opacity: isLocked ? 0.45 : 1,
                    }}
                  >
                    {/* District header */}
                    <div
                      className="px-6 pt-7 pb-5 relative"
                      style={{ background: `linear-gradient(135deg, ${accent.bg} 0%, transparent 100%)` }}
                    >
                      {/* Live dot */}
                      {!isLocked && (
                        <div
                          className="absolute top-4 right-4 w-2 h-2 rounded-full"
                          style={{
                            background: accent.dot,
                            boxShadow: `0 0 8px ${accent.dot}`,
                            animation: "neonPulse 2.5s ease-in-out infinite",
                          }}
                        />
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <span className="text-5xl" style={{ filter: isLocked ? "grayscale(1) brightness(0.4)" : undefined }}>
                          {config.emoji}
                        </span>
                        {isLocked && (
                          <span
                            className="text-xs px-2.5 py-1 rounded-full"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "#2A2A3A",
                            }}
                          >
                            🔒 Coming soon
                          </span>
                        )}
                      </div>

                      <h2 className="font-display font-bold text-xl" style={{ color: "#E8E4D8" }}>
                        {config.name}
                      </h2>
                      <p className="text-xs mt-1 font-medium" style={{ color: accent.dot, opacity: 0.8 }}>
                        {missionsHere.length > 0
                          ? `${missionsHere.length} mission${missionsHere.length > 1 ? "s" : ""} available`
                          : "No missions for this grade band yet"}
                      </p>
                    </div>

                    {/* Mission list */}
                    <div
                      className="px-6 py-5 space-y-3"
                      style={{ background: "rgba(3,5,7,0.40)" }}
                    >
                      {isLocked ? (
                        <p className="text-sm" style={{ color: "#2A2A3A" }}>
                          Check back after more content is added.
                        </p>
                      ) : (
                        missionsHere.map((m) => (
                          <Link key={m.id} href={`/student/mission/${m.id}`}>
                            <div
                              className="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                              style={{
                                background: accent.badge,
                                border: `1px solid ${accent.badgeBorder}`,
                                color: accent.dot,
                              }}
                            >
                              <span className="text-sm font-semibold">{m.title}</span>
                              <span className="text-base opacity-60">→</span>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
