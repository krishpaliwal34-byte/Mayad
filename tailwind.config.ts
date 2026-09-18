import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mayad: {
          bg: "#050816",
          card: "#0d1226",
          cardHover: "#141c3a",
          gold: "#F5C518",
          goldHover: "#E0B00F",
          royal: "#1E3A8A",
          electric: "#3B82F6",
          crimson: "#B91C1C",
          purple: "#5B21B6",
          muted: "#94A3B8",
          border: "#1E293B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(to right, rgba(5,8,22,0.95) 0%, rgba(5,8,22,0.7) 50%, rgba(5,8,22,0.4) 100%)",
        "gold-gradient": "linear-gradient(135deg, #F5C518 0%, #E5A912 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(13,18,38,0.2) 0%, rgba(5,8,22,0.95) 100%)",
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(245, 197, 24, 0.25)',
        'glow-blue': '0 0 25px rgba(59, 130, 246, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;
