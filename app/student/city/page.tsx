/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStudentStore } from "@/stores/student-store";
import { DISTRICT_CONFIG, getMissionsForGradeBand } from "@/lib/utils";
import { TiltCard } from "@/components/ui/TiltCard";

const ALL_DISTRICTS = [
  "budget-borough",
  "savings-station",
  "market-street",
  "credit-crossing",
  "startup-square",
] as const;

// Space photography for each district node
const DISTRICT_IMAGES: Record<string, string> = {
  "budget-borough":  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
  "savings-station": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
  "market-street":   "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop",
  "credit-crossing": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
  "startup-square":  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
};

export default function CityPage() {
  const { nickname, gradeBand, assignedMissions, sessionCode } = useStudentStore();
  const gradeMissions = getMissionsForGradeBand(gradeBand);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#010101]">

      {/* Photorealistic space background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-transparent to-[#010101]/80" />
      </div>

      <div className="absolute inset-0 z-10 p-6 sm:p-12 flex flex-col items-center">

        {/* Terminal header */}
        <header className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 glass px-8 py-6 mt-4 border border-white/10 rounded-sm">
          <div className="flex items-center gap-6 mb-4 sm:mb-0">
            <div className="w-12 h-12 flex items-center justify-center border border-white/20 text-[#F0F0F0] font-sans text-xs tracking-widest bg-white/5">
              USR
            </div>
            <div>
              <div className="text-[#888888] text-xs font-medium uppercase tracking-[0.2em] mb-1">Active Operator</div>
              <div className="text-[#F0F0F0] font-display font-medium text-2xl tracking-tight">
                {nickname || "Guest_001"}
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-1">
            <div className="text-[#888888] text-xs font-medium uppercase tracking-[0.2em]">Session</div>
            <div className="text-[#D4AF37] font-sans text-xs tracking-widest border border-[#D4AF37]/30 px-4 py-1.5 bg-[#D4AF37]/10 uppercase">
              {sessionCode || gradeBand}
            </div>
          </div>
        </header>

        {/* Title */}
        <div className="text-center mb-20 relative z-20 w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <h1 className="font-display font-medium text-5xl md:text-7xl tracking-tight text-[#F0F0F0] mb-6">
              Select Sector Node
            </h1>
            <div className="h-px w-24 bg-white/30 mb-6" />
            <p className="text-[#888888] text-lg font-light tracking-wide max-w-xl text-center">
              Initialize a district simulation node. Choose your mission and begin.
            </p>
          </motion.div>
        </div>

        {/* District nodes */}
        <div className="w-full max-w-7xl flex-1 relative z-20 pb-16" style={{ perspective: 1500 }}>
          <motion.div
            initial={{ rotateX: 20, y: 80, opacity: 0 }}
            animate={{ rotateX: 0, y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
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
                  transition={{ delay: i * 0.09, duration: 0.6 }}
                >
                  <TiltCard intensity={isLocked ? 0 : 10} className="h-full w-full">
                    <div
                      className={`block h-full group relative overflow-hidden rounded-sm border bg-[#050505] ${
                        isLocked ? "border-white/5 opacity-40" : "border-white/10"
                      }`}
                    >
                      {/* Photographic overlay */}
                      <div className="absolute inset-0 z-0">
                        <img
                          src={DISTRICT_IMAGES[districtKey]}
                          alt={config.name}
                          className={`w-full h-full object-cover object-center mix-blend-luminosity transition-all duration-[1.5s] ease-out ${
                            isLocked
                              ? "opacity-10 grayscale"
                              : "opacity-25 group-hover:opacity-45 group-hover:mix-blend-normal group-hover:scale-105"
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#010101] to-transparent" />
                      </div>

                      <div className="relative z-10 h-72 p-10 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <span className="text-[#888888] font-sans text-xs uppercase tracking-[0.2em]">
                            Node {String(i + 1).padStart(2, "0")}
                          </span>
                          <div
                            className={`w-2 h-2 rounded-full border transition-colors duration-500 ${
                              isLocked
                                ? "border-white/10"
                                : "border-white/30 group-hover:bg-[#F0F0F0]"
                            }`}
                          />
                        </div>

                        <div>
                          {/* Animated scan line */}
                          <div className="w-full h-[1px] bg-white/10 mb-6 relative overflow-hidden">
                            {!isLocked && (
                              <div className="absolute top-0 bottom-0 left-0 bg-[#D4AF37] w-0 group-hover:w-full transition-all duration-1000" />
                            )}
                          </div>

                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{config.emoji}</span>
                            <h3 className="font-display font-medium text-2xl text-[#F0F0F0] drop-shadow-md">
                              {config.name}
                            </h3>
                          </div>

                          {/* Mission list or locked state */}
                          {isLocked ? (
                            <p className="text-[#555555] text-xs uppercase tracking-[0.15em]">
                              🔒 Not available for this grade band
                            </p>
                          ) : (
                            <div className="space-y-2 mt-3">
                              {missionsHere.map((m) => (
                                <Link key={m.id} href={`/student/mission/${m.id}`}>
                                  <div className="flex items-center justify-between text-[#C0C0C0] text-sm hover:text-white transition-colors py-1 group/link">
                                    <span className="font-light tracking-wide">{m.title}</span>
                                    <span className="opacity-0 group-hover/link:opacity-100 translate-x-2 group-hover/link:translate-x-0 transition-all duration-300 text-[#D4AF37] text-xs uppercase tracking-[0.15em]">
                                      Enter →
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
