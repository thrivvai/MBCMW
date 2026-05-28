"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStudentStore } from "@/stores/student-store";
import { DISTRICT_CONFIG, getMissionsForGradeBand } from "@/lib/utils";
import { StarField } from "@/components/ui/StarField";
import { TiltCard } from "@/components/ui/TiltCard";

const ALL_DISTRICTS = [
  "budget-borough",
  "savings-station",
  "market-street",
  "credit-crossing",
  "startup-square",
] as const;

// SVG city skyline — lightweight vector, renders at any resolution.
function CitySkyline() {
  return (
    <svg
      viewBox="0 0 1400 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* Far background buildings */}
      <rect x="0"    y="160" width="55"  height="60"  fill="#12172a" />
      <rect x="60"   y="130" width="40"  height="90"  fill="#12172a" />
      <rect x="105"  y="150" width="70"  height="70"  fill="#12172a" />
      <rect x="180"  y="110" width="35"  height="110" fill="#12172a" />
      <rect x="220"  y="140" width="50"  height="80"  fill="#12172a" />
      <rect x="275"  y="95"  width="30"  height="125" fill="#12172a" />
      <rect x="310"  y="125" width="60"  height="95"  fill="#12172a" />
      <rect x="375"  y="75"  width="45"  height="145" fill="#12172a" />
      <rect x="425"  y="140" width="55"  height="80"  fill="#12172a" />
      <rect x="485"  y="100" width="35"  height="120" fill="#12172a" />
      <rect x="525"  y="120" width="70"  height="100" fill="#12172a" />
      <rect x="600"  y="80"  width="40"  height="140" fill="#12172a" />
      <rect x="645"  y="130" width="55"  height="90"  fill="#12172a" />
      <rect x="705"  y="65"  width="35"  height="155" fill="#12172a" />
      <rect x="745"  y="110" width="60"  height="110" fill="#12172a" />
      <rect x="810"  y="90"  width="45"  height="130" fill="#12172a" />
      <rect x="860"  y="145" width="55"  height="75"  fill="#12172a" />
      <rect x="920"  y="100" width="40"  height="120" fill="#12172a" />
      <rect x="965"  y="75"  width="30"  height="145" fill="#12172a" />
      <rect x="1000" y="130" width="65"  height="90"  fill="#12172a" />
      <rect x="1070" y="95"  width="40"  height="125" fill="#12172a" />
      <rect x="1115" y="140" width="55"  height="80"  fill="#12172a" />
      <rect x="1175" y="80"  width="35"  height="140" fill="#12172a" />
      <rect x="1215" y="115" width="70"  height="105" fill="#12172a" />
      <rect x="1290" y="100" width="50"  height="120" fill="#12172a" />
      <rect x="1345" y="135" width="55"  height="85"  fill="#12172a" />

      {/* Window lights — scattered dots on buildings */}
      {[80, 90, 100, 195, 205, 215, 390, 400, 410, 620, 630, 715, 725, 830, 840, 980, 990, 1090, 1100, 1190, 1200].map((x, i) => (
        <rect key={i} x={x} y={i % 3 === 0 ? 115 : i % 3 === 1 ? 130 : 145} width="4" height="4"
          fill={i % 4 === 0 ? "#6366f1" : i % 4 === 1 ? "#f59e0b" : i % 4 === 2 ? "#10b981" : "#8b5cf6"}
          opacity="0.7"
        />
      ))}

      {/* Ground */}
      <rect x="0" y="218" width="1400" height="2" fill="#1E2333" />
    </svg>
  );
}

export default function CityPage() {
  const { nickname, gradeBand, assignedMissions, sessionCode } = useStudentStore();
  const gradeMissions = getMissionsForGradeBand(gradeBand);

  return (
    <div className="min-h-screen bg-city-bg relative overflow-hidden">
      <StarField count={70} />

      {/* Ambient glow layers */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-city-bg/70 backdrop-blur-md border-b border-city-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Session: {sessionCode}</p>
            <p className="text-white font-bold text-lg">👋 {nickname}</p>
          </div>
          <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full font-medium">
            Grade {gradeBand}
          </span>
        </div>
      </header>

      {/* Skyline */}
      <div className="relative z-10 mt-2 px-0 opacity-60">
        <CitySkyline />
        {/* Gradient fade below skyline */}
        <div className="h-16 bg-gradient-to-b from-transparent to-city-bg -mt-1" />
      </div>

      {/* City title */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-3 tracking-tight">
            MathWorld{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #818CF8, #C084FC)",
                backgroundSize: "200% 200%",
                animation: "gradientShift 5s ease infinite",
              }}
            >
              City
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Choose a district and start your mission.</p>
        </motion.div>

        {/* Districts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_DISTRICTS.map((districtKey, i) => {
            const config = DISTRICT_CONFIG[districtKey];
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
                transition={{ delay: i * 0.09, duration: 0.45 }}
              >
                <TiltCard intensity={isLocked ? 0 : 10}>
                  <div
                    className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                      isLocked
                        ? "border-city-border opacity-50"
                        : `${config.borderClass} hover:shadow-2xl ${config.glowClass}`
                    }`}
                  >
                    {/* District header with gradient */}
                    <div className={`bg-gradient-to-br ${config.bgClass} px-6 pt-7 pb-5 relative`}>
                      {/* Neon glow dot */}
                      {!isLocked && (
                        <div
                          className="absolute top-4 right-4 w-2 h-2 rounded-full"
                          style={{
                            background: "currentColor",
                            color: isLocked ? "#4b5563" : undefined,
                            animation: "neonPulse 2.5s ease-in-out infinite",
                            boxShadow: "0 0 8px currentColor",
                          }}
                        />
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <span className="text-5xl" style={{ filter: isLocked ? "grayscale(1)" : undefined }}>
                          {config.emoji}
                        </span>
                        {isLocked && (
                          <span className="text-xs bg-gray-800/80 text-gray-500 px-2.5 py-1 rounded-full border border-gray-700">
                            🔒 Coming soon
                          </span>
                        )}
                      </div>
                      <h2 className="text-white font-black text-xl tracking-tight">{config.name}</h2>
                      <p className={`text-xs mt-1 font-medium ${config.badgeClass.split(" ")[1]}`}>
                        {missionsHere.length > 0
                          ? `${missionsHere.length} mission${missionsHere.length > 1 ? "s" : ""} available`
                          : "No missions for this grade band yet"}
                      </p>
                    </div>

                    {/* Missions */}
                    <div className="bg-city-card px-6 py-5 space-y-3">
                      {isLocked ? (
                        <p className="text-gray-600 text-sm">Check back after more content is added.</p>
                      ) : (
                        missionsHere.map((m) => (
                          <Link key={m.id} href={`/student/mission/${m.id}`}>
                            <div
                              className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${config.badgeClass} ${config.borderClass} hover:scale-[1.02] active:scale-[0.98]`}
                            >
                              <span className="text-sm font-bold">{m.title}</span>
                              <span className="text-base">→</span>
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
