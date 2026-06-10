import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Mission } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Loads a mission by ID from the content/missions directory.
// In production this would come from a headless CMS; for MVP it's static JSON.
export async function getMission(id: string): Promise<Mission | null> {
  try {
    const mission = await import(`@/content/missions/${id}.json`);
    return mission.default as Mission;
  } catch {
    return null;
  }
}

// All available missions indexed by grade band.
export const MISSION_CATALOG: Record<string, { id: string; gradeBand: string; title: string; district: string }[]> = {
  "4-5": [
    { id: "class-party-budget", gradeBand: "4-5", title: "Class Party Budget", district: "budget-borough" },
  ],
  "6-8": [
    { id: "sneaker-drop", gradeBand: "6-8", title: "The Sneaker Drop", district: "market-street" },
  ],
  "9-12": [],
};

export function getMissionsForGradeBand(gradeBand: string) {
  return MISSION_CATALOG[gradeBand] ?? [];
}

export const DISTRICT_CONFIG = {
  "budget-borough": {
    name: "Budget Borough",
    color: "indigo",
    bgClass: "from-indigo-900/40 to-indigo-800/20",
    borderClass: "border-indigo-500/50",
    badgeClass: "bg-indigo-500/20 text-indigo-300",
    glowClass: "shadow-indigo-500/20",
    emoji: "🏛️",
  },
  "savings-station": {
    name: "Savings Station",
    color: "emerald",
    bgClass: "from-emerald-900/40 to-emerald-800/20",
    borderClass: "border-emerald-500/50",
    badgeClass: "bg-emerald-500/20 text-emerald-300",
    glowClass: "shadow-emerald-500/20",
    emoji: "🏦",
  },
  "market-street": {
    name: "Market Street",
    color: "amber",
    bgClass: "from-amber-900/40 to-amber-800/20",
    borderClass: "border-amber-500/50",
    badgeClass: "bg-amber-500/20 text-amber-300",
    glowClass: "shadow-amber-500/20",
    emoji: "🛍️",
  },
  "credit-crossing": {
    name: "Credit Crossing",
    color: "red",
    bgClass: "from-red-900/40 to-red-800/20",
    borderClass: "border-red-500/50",
    badgeClass: "bg-red-500/20 text-red-300",
    glowClass: "shadow-red-500/20",
    emoji: "💳",
  },
  "startup-square": {
    name: "Startup Square",
    color: "purple",
    bgClass: "from-purple-900/40 to-purple-800/20",
    borderClass: "border-purple-500/50",
    badgeClass: "bg-purple-500/20 text-purple-300",
    glowClass: "shadow-purple-500/20",
    emoji: "🚀",
  },
} as const;
