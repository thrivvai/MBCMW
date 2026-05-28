"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStudentStore } from "@/stores/student-store";
import { DISTRICT_CONFIG, getMissionsForGradeBand } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ALL_DISTRICTS = [
  "budget-borough",
  "savings-station",
  "market-street",
  "credit-crossing",
  "startup-square",
] as const;

export default function CityPage() {
  const { nickname, gradeBand, assignedMissions, sessionCode } = useStudentStore();
  const gradeMissions = getMissionsForGradeBand(gradeBand);

  return (
    <div className="min-h-screen bg-city-bg relative overflow-hidden">
      {/* Parallax background glow layers */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-city-bg/80 backdrop-blur-sm border-b border-city-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Session: {sessionCode}</p>
            <p className="text-white font-bold">👋 Welcome, {nickname}!</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-city-card border border-city-border px-3 py-1.5 rounded-full text-gray-400">
              Grade {gradeBand}
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* City title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            MathWorld City
          </h1>
          <p className="text-gray-400 text-lg">
            Choose a district and start your mission.
          </p>
        </motion.div>

        {/* Districts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <DistrictCard
                  config={config}
                  districtKey={districtKey}
                  missions={missionsHere}
                  isLocked={isLocked}
                />
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function DistrictCard({
  config,
  districtKey,
  missions,
  isLocked,
}: {
  config: (typeof DISTRICT_CONFIG)[keyof typeof DISTRICT_CONFIG];
  districtKey: string;
  missions: { id: string; title: string }[];
  isLocked: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${
        isLocked
          ? "border-city-border opacity-60"
          : `${config.borderClass} hover:shadow-xl ${config.glowClass}`
      }`}
    >
      {/* District header */}
      <div className={`bg-gradient-to-br ${config.bgClass} px-6 pt-6 pb-4`}>
        <div className="flex items-start justify-between mb-3">
          <span className="text-4xl">{config.emoji}</span>
          {isLocked && (
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
              🔒 Coming Soon
            </span>
          )}
        </div>
        <h2 className="text-white font-bold text-xl">{config.name}</h2>
      </div>

      {/* Missions list */}
      <div className="bg-city-card px-6 py-4 space-y-3">
        {isLocked ? (
          <p className="text-gray-500 text-sm">
            No missions assigned for your grade band yet. Keep exploring!
          </p>
        ) : (
          missions.map((m) => (
            <Link key={m.id} href={`/student/mission/${m.id}`}>
              <div className={`flex items-center justify-between px-4 py-3 rounded-xl ${config.badgeClass} border ${config.borderClass} hover:opacity-90 transition-opacity cursor-pointer`}>
                <span className="text-sm font-semibold">{m.title}</span>
                <span className="text-sm">→</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
