/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStudentStore } from "@/stores/student-store";
import { DISTRICT_CONFIG, getMissionsForGradeBand } from "@/lib/utils";
import { TiltCard } from "@/components/ui/TiltCard";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const ALL_DISTRICTS = [
  "budget-borough",
  "savings-station",
  "market-street",
  "credit-crossing",
  "startup-square",
] as const;

const DISTRICT_IMAGES: Record<string, string> = {
  "budget-borough":  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
  "savings-station": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
  "market-street":   "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop",
  "credit-crossing": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
  "startup-square":  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
};

const DISTRICT_IMAGE_ALTS: Record<string, string> = {
  "budget-borough":  "Earth from orbit in deep space",
  "savings-station": "Star-filled night sky over mountain meadow",
  "market-street":   "Spiral galaxy photographed from deep space",
  "credit-crossing": "Nebula photographed by space telescope",
  "startup-square":  "Earth from orbit in deep space",
};

/* SVG district icons — no emojis */
function DistrictIcon({ district, size = 20 }: { district: string; size?: number }) {
  const s = size;
  switch (district) {
    case "budget-borough":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="2" y="10" width="3" height="8" stroke="currentColor" strokeWidth="1.2" />
          <rect x="6" y="6"  width="3" height="12" stroke="currentColor" strokeWidth="1.2" />
          <rect x="11" y="8" width="3" height="10" stroke="currentColor" strokeWidth="1.2" />
          <rect x="15" y="4" width="3" height="14" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1" y1="18" x2="19" y2="18" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "savings-station":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 18V8l7-5 7 5v10" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <rect x="7" y="12" width="3" height="6" stroke="currentColor" strokeWidth="1.2" />
          <rect x="12" y="10" width="3" height="4" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1" y1="18" x2="19" y2="18" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "market-street":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4 8h12l-1.5 7H5.5L4 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M7 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="8" cy="16" r="1" fill="currentColor" />
          <circle cx="13" cy="16" r="1" fill="currentColor" />
        </svg>
      );
    case "credit-crossing":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="2" y="5" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="2" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth="1.2" />
          <rect x="4" y="11.5" width="4" height="1.5" rx="0.5" fill="currentColor" />
        </svg>
      );
    case "startup-square":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 17V9.5M10 9.5C10 9.5 10 4 14 3C14 7 11.5 9 10 9.5ZM10 9.5C10 9.5 10 4 6 3C6 7 8.5 9 10 9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M7 17h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M8 15l-2 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M12 15l2 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

/* Padlock SVG — no emoji 🔒 */
function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2.5" y="6" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="7" cy="9.5" r="1" fill="currentColor" />
    </svg>
  );
}

export default function CityPage() {
  const { nickname, gradeBand, assignedMissions, sessionCode } = useStudentStore();
  const gradeMissions = getMissionsForGradeBand(gradeBand);

  return (
    <div className="min-h-[100dvh] relative overflow-hidden bg-[#0B0C0F]">

      {/* Space background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop"
          alt="Spiral galaxy in deep space"
          className="w-full h-full object-cover object-center opacity-35 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F] via-transparent to-[#0B0C0F]/70" />
      </div>

      <div className="absolute inset-0 z-10 p-6 sm:p-12 flex flex-col items-center">

        {/* Session header */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-start sm:items-center mb-14 glass px-7 py-5 mt-4 rounded-sm"
        >
          <div className="flex items-center gap-5 mb-3 sm:mb-0">
            <div className="w-10 h-10 flex items-center justify-center border border-white/15 text-[#9A9694] font-sans text-[10px] tracking-widest bg-white/3 shrink-0">
              USR
            </div>
            <div>
              <div className="text-[#666360] text-[10px] font-medium uppercase tracking-[0.22em] mb-0.5">
                Active Operator
              </div>
              <div className="text-[#EDE8DC] font-display font-[600] text-xl tracking-tight">
                {nickname || "Guest_001"}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-0.5">
            <div className="text-[#666360] text-[10px] font-medium uppercase tracking-[0.22em]">
              Session
            </div>
            <div className="text-[#C9A84C] font-sans text-xs tracking-widest border border-[#C9A84C]/25 px-3.5 py-1 bg-[#C9A84C]/8 uppercase rounded-sm">
              {sessionCode || gradeBand}
            </div>
          </div>
        </motion.header>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.55, ease: EASE_OUT_EXPO }}
          className="text-center mb-16 w-full max-w-6xl"
        >
          <h1
            className="font-display text-[#EDE8DC] tracking-tight leading-tight mb-4"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 700 }}
          >
            Select Sector Node
          </h1>
          <p className="text-[#666360] text-base font-light tracking-wide max-w-xs mx-auto">
            Choose a district to begin your mission.
          </p>
        </motion.div>

        {/* District grid */}
        <div className="w-full max-w-6xl flex-1 pb-16" style={{ perspective: 1200 }}>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: EASE_OUT_EXPO }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  initial={{ opacity: 0, y: 28, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.5, ease: EASE_OUT_EXPO }}
                >
                  <TiltCard intensity={isLocked ? 0 : 8} className="h-full w-full">
                    <div
                      className={`block h-full group relative overflow-hidden rounded-sm border bg-[#111318] transition-colors duration-300 ${
                        isLocked
                          ? "border-white/5 opacity-38"
                          : "border-white/8 hover:border-white/15"
                      }`}
                    >
                      {/* Photo overlay */}
                      <div className="absolute inset-0 z-0">
                        <img
                          src={DISTRICT_IMAGES[districtKey]}
                          alt={DISTRICT_IMAGE_ALTS[districtKey]}
                          className={`w-full h-full object-cover object-center mix-blend-luminosity transition-all duration-[1.8s] ease-out ${
                            isLocked
                              ? "opacity-8 grayscale"
                              : "opacity-20 group-hover:opacity-38"
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111318] to-transparent" />
                      </div>

                      <div className="relative z-10 h-68 p-8 flex flex-col justify-between" style={{ minHeight: "17rem" }}>
                        {/* Node number + status */}
                        <div className="flex justify-between items-center">
                          <span className="text-[#3A3836] font-sans text-[10px] uppercase tracking-[0.25em]">
                            Node {String(i + 1).padStart(2, "0")}
                          </span>
                          <div
                            className={`w-1.5 h-1.5 rounded-full border transition-all duration-400 ${
                              isLocked
                                ? "border-white/10"
                                : "border-white/20 group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C]"
                            }`}
                          />
                        </div>

                        <div>
                          {/* Animated scan line on hover */}
                          <div className="w-full h-px bg-white/8 mb-5 relative overflow-hidden">
                            {!isLocked && (
                              <div className="absolute inset-y-0 left-0 bg-[#C9A84C] w-0 group-hover:w-full transition-all duration-700 ease-out" />
                            )}
                          </div>

                          {/* District identity */}
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="text-[#9A9694] group-hover:text-[#C9A84C] transition-colors duration-300">
                              <DistrictIcon district={districtKey} size={16} />
                            </span>
                            <h3 className="font-sans font-semibold text-lg text-[#EDE8DC] tracking-tight">
                              {config.name}
                            </h3>
                          </div>

                          {/* Mission list or locked state */}
                          {isLocked ? (
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-[#3A3836]"><LockIcon size={13} /></span>
                              <p className="text-[#3A3836] text-xs uppercase tracking-[0.15em]">
                                Not available for this grade band
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-1.5 mt-3">
                              {missionsHere.map((m) => (
                                <Link key={m.id} href={`/student/mission/${m.id}`} className="cursor-pointer">
                                  <div className="flex items-center justify-between text-[#9A9694] text-sm hover:text-[#EDE8DC] transition-colors duration-200 py-1 group/link cursor-pointer">
                                    <span className="font-light tracking-wide">{m.title}</span>
                                    <span
                                      className="opacity-0 group-hover/link:opacity-100 transition-all duration-250 text-[#C9A84C] text-[10px] uppercase tracking-[0.18em]"
                                      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                                    >
                                      Enter
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
