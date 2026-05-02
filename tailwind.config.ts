import type { Config } from "tailwindcss";

/**
 * Landing-tree tokens. The redesign in `docs/landing-redesign-plan.md`
 * adds a `bone` text ramp + `display-*` type scale + ink role-names.
 * Legacy tokens (cream, navy, brand.*, ink.{600..950}) are kept in place
 * here because the /apply/* form pages still use them; landing components
 * are migrating onto the new ramp commit by commit. A final cleanup pass
 * will delete anything proven unreachable from the landing tree.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Forms surface (kept for /apply/*; do NOT use on landing) ─
        cream: {
          50: "#FFFAF1",
          100: "#FBF1E1",
          200: "#F5E4C8",
        },
        navy: {
          DEFAULT: "#0F1B3D",
          50: "#EEF0F6",
          200: "#C4C8D5",
          400: "#7A8099",
          600: "#3F4A6E",
          700: "#1F2C52",
          900: "#0A1330",
        },

        // ── Surfaces (dark continuum) ───────────────────────────────
        // `ink` keeps the legacy 600..950 numeric stops for now so the
        // mid-migration commits keep rendering. New code uses the
        // role-named slots (DEFAULT, elevated, subtle).
        ink: {
          DEFAULT: "#0A0A0A",  // canonical poster-black (= ink.900)
          elevated: "#16171A", // card / panel surface (= ink.800)
          subtle: "#1F2024",   // hover / pressed surface (= ink.700)
          950: "#050505",
          900: "#0A0A0A",
          850: "#101010",
          800: "#16171A",
          700: "#1F2024",
          600: "#2A2C31",
        },

        // ── Brand sunset (only orange ramp on the landing) ──────────
        sunset: {
          50: "#FFF3EA",
          100: "#FFE3CE",
          200: "#FFC79C",
          300: "#FFA968",
          400: "#FF8A3D",
          500: "#FF6B1A",
          600: "#E54A0F",
          700: "#C8341E",
          800: "#9A2616",
          900: "#6B1B10",
        },

        // ── Text on dark (canonical ramp, role-named) ───────────────
        // Replaces ad-hoc cream-50/{10..95} on the landing. The legacy
        // cream-50/<n> classes still render (cream stays in the palette
        // above) — landing components migrate onto these names.
        bone: {
          DEFAULT: "#FFFAF1",
          muted: "rgb(255 250 241 / 0.78)",
          subtle: "rgb(255 250 241 / 0.55)",
          hairline: "rgb(255 250 241 / 0.10)",
        },

        // Legacy palettes — kept until the cleanup commit confirms no
        // landing component or /apply/* page references them.
        coral: {
          50: "#FFF1EA",
          100: "#FFE0CF",
          400: "#F39A7E",
          500: "#EC7A57",
          600: "#D9603C",
          700: "#B8512F",
          800: "#923E25",
        },
        gold: {
          300: "#EBD299",
          400: "#E0BC72",
          500: "#C99B4A",
          600: "#A87D31",
        },
        brand: {
          red: "#D62828",
          redDark: "#A8201E",
          flame: "#FF5722",
          amber: "#FFB347",
          ink: "#0A0A0A",
          glow: "#FFD08A",
        },
      },

      backgroundImage: {
        "brand-gradient":
          "linear-gradient(90deg, #C8341E 0%, #E54A0F 28%, #FF6B1A 58%, #FF8A3D 82%, #FFB347 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(200,52,30,0.10) 0%, rgba(255,107,26,0.10) 55%, rgba(255,179,71,0.12) 100%)",
        "brand-gradient-vertical":
          "linear-gradient(180deg, #C8341E 0%, #FF5722 50%, #FF8A3D 100%)",
        "ink-spotlight":
          "radial-gradient(ellipse 65% 70% at 85% 25%, rgb(255 138 61 / 0.35) 0%, rgb(255 87 34 / 0.18) 25%, rgb(10 10 10 / 0) 65%)",
        "ink-radial":
          "radial-gradient(ellipse 80% 60% at 30% 30%, rgba(255,107,26,0.18) 0%, rgba(255,87,34,0.06) 35%, rgba(10,10,10,0) 70%)",
      },

      fontFamily: {
        sans: ["var(--font-geist-sans)", "var(--font-thai)", "system-ui", "sans-serif"],
        thai: ["var(--font-thai)", "var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-geist-sans)", "var(--font-thai)", "system-ui", "sans-serif"],
      },

      fontSize: {
        // Modular display scale. Letter-spacing baked in. Replaces
        // ad-hoc text-[5.5rem] + the tracking-[0.16em..0.32em] grid.
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.22em", fontWeight: "600" }],
        metadata: ["0.625rem", { lineHeight: "1", letterSpacing: "0.32em", fontWeight: "600" }],
        "display-sm": [
          "clamp(2.25rem, 4vw, 3rem)",
          { lineHeight: "1.05", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        display: [
          "clamp(2.75rem, 6vw, 4.5rem)",
          { lineHeight: "1", letterSpacing: "-0.015em", fontWeight: "800" },
        ],
        "display-xl": [
          "clamp(3.5rem, 9vw, 5.5rem)",
          { lineHeight: "0.95", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
      },

      boxShadow: {
        soft: "0 12px 40px -16px rgb(15 27 61 / 0.18)",
        elevated: "0 20px 50px -24px rgb(15 27 61 / 0.28)",
        glow: "0 0 0 6px rgb(255 107 26 / 0.22)",
        ember: "0 18px 50px -18px rgb(255 87 34 / 0.55)",
        ink: "0 24px 60px -20px rgb(0 0 0 / 0.65)",
      },

      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ember-pulse": {
          "0%, 100%": { opacity: "0.65" },
          "50%": { opacity: "1" },
        },
        "scroll-cue": {
          "0%, 100%": { opacity: "0.55", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "ember-pulse": "ember-pulse 4s ease-in-out infinite",
        "scroll-cue": "scroll-cue 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
