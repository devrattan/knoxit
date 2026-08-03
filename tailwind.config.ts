import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        knoxit: {
          bg: "#050507",
          panel: "#09090b",
          surface: "#121216",
          surface2: "#18181b",
          border: "rgba(255,255,255,0.10)",
          text: "#f4f4f5",
          muted: "#a1a1aa",
          emerald: "#34d399",
          violet: "#a78bfa",
          amber: "#fbbf24",
          danger: "#f87171",
          info: "#38bdf8"
        }
      },
      borderRadius: {
        card: "0.875rem"
      },
      boxShadow: {
        glow: "0 0 28px rgba(52, 211, 153, 0.14)"
      },
      zIndex: {
        drawer: "50",
        modal: "60",
        toast: "70"
      }
    }
  },
  plugins: []
} satisfies Config;
