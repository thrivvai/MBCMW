import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          bg:       "#0B0C0F",
          surface:  "#111318",
          elevated: "#161920",
          border:   "#1C1D24",
        },
        ink: {
          primary:  "#EDE8DC",
          secondary: "#9A9694",
          muted:    "#666360",
          ghost:    "#3A3836",
        },
        gold: {
          DEFAULT:  "#C9A84C",
          bright:   "#F5DFA0",
          deep:     "#7A6028",
          glow:     "rgba(201,168,76,0.15)",
        },
        state: {
          error:    "#BE4646",
          success:  "#4A9A6A",
          "error-bg": "rgba(190,70,70,0.08)",
          "success-bg": "rgba(74,154,106,0.08)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "float":        "float 9s ease-in-out infinite",
        "pulse-slow":   "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer":      "shimmer 3s linear infinite",
        "cosmic-drift": "cosmicDrift 42s ease-in-out infinite",
        "scroll-line":  "scrollLine 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        cosmicDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "33%":       { transform: "translate(1%, 0.8%) scale(1.015) rotate(0.6deg)" },
          "66%":       { transform: "translate(-0.8%, 0.8%) scale(0.985) rotate(-0.6deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
