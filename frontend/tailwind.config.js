/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B221E",
        paper: "#EDEFE9",
        brass: "#93762E",
        moss: "#33473B",
        signal: "#8C3B2E",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27, 34, 30, 0.04), 0 4px 16px rgba(27, 34, 30, 0.06)",
        raised: "0 2px 4px rgba(27, 34, 30, 0.06), 0 8px 24px rgba(27, 34, 30, 0.10)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(140, 59, 46, 0.35)" },
          "100%": { boxShadow: "0 0 0 10px rgba(140, 59, 46, 0)" },
        },
        "dot-bounce": {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "40%": { transform: "translateY(-3px)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        "pulse-ring": "pulse-ring 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "dot-bounce": "dot-bounce 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
