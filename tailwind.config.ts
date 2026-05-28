import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        city: {
          bg: "#010101",
          card: "#0A0A0C",
          border: "#1C1C20",
          elevated: "#141418",
        },
        cosmic: {
          gold: "#D4AF37",
          "gold-bright": "#FBF5E5",
          "gold-dim": "#A08020",
          teal: "#00CCD8",
          "teal-dark": "#4A6B7C",
          violet: "#8B5CF6",
          "violet-deep": "#6D28D9",
          text: "#F0F0F0",
          muted: "#888888",
        },
        district: {
          budget: "#6366F1",
          savings: "#10B981",
          market: "#D4AF37",
          credit: "#EF4444",
          startup: "#8B5CF6",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "Georgia", "serif"],
        sans: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      animation: {
        "float": "float 8s ease-in-out infinite",
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 3s linear infinite",
        "cosmic-drift": "cosmicDrift 40s ease-in-out infinite",
        "aurora": "auroraShift 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        cosmicDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "33%": { transform: "translate(1%, 1%) scale(1.02) rotate(1deg)" },
          "66%": { transform: "translate(-1%, 1%) scale(0.98) rotate(-1deg)" },
        },
        auroraShift: {
          "0%, 100%": { opacity: "0.08" },
          "50%": { opacity: "0.22" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
