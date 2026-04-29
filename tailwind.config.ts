import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFAF1",
          100: "#FBF1E1",
          200: "#F5E4C8",
        },
        navy: {
          DEFAULT: "#0F1B3D",
          50: "#E6E8EE",
          200: "#C4C8D5",
          400: "#7A8099",
          600: "#3F4A6E",
          700: "#1F2C52",
          900: "#0A1330",
        },
        coral: {
          400: "#F39A7E",
          500: "#EC7A57",
          600: "#D9603C",
          700: "#B8512F",
          800: "#923E25",
        },
        gold: {
          400: "#E0BC72",
          500: "#C99B4A",
          600: "#A87D31",
        },
        brand: {
          red: "#C8341E",
          redDark: "#9A2616",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "var(--font-thai)", "system-ui", "sans-serif"],
        thai: ["var(--font-thai)", "var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-geist-sans)", "var(--font-thai)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 40px -16px rgba(15, 27, 61, 0.18)",
        glow: "0 0 0 6px rgba(236, 122, 87, 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
