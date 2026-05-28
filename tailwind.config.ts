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
          bg: "#030507",
          card: "#0D1020",
          border: "#1A1F35",
          elevated: "#121628",
        },
        cosmic: {
          gold: "#E8A820",
          "gold-bright": "#F5C040",
          "gold-dim": "#C8860A",
          teal: "#00CCD8",
          "teal-dark": "#007080",
          violet: "#8B5CF6",
          "violet-deep": "#6D28D9",
          text: "#E8E4D8",
          muted: "#5A5A6E",
        },
        district: {
          budget: "#6366F1",
          savings: "#10B981",
          market: "#E8A820",
          credit: "#EF4444",
          startup: "#8B5CF6",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        sans: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "cosmic-drift": "cosmicDrift 28s ease-in-out infinite",
        "aurora": "auroraShift 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        cosmicDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(2%, 1.5%) scale(1.03)" },
          "66%": { transform: "translate(-1.5%, 2%) scale(0.98)" },
        },
        auroraShift: {
          "0%, 100%": { opacity: "0.08" },
          "50%": { opacity: "0.20" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
