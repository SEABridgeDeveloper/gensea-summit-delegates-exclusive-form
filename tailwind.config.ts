import type { Config } from "tailwindcss";

/**
 * Landing-tree tokens — final form. The redesign in
 * `docs/landing-redesign-plan.md` collapsed the previous palette down
 * to four working ramps:
 *
 *   - cream / navy   — kept for /apply/* form pages legacy that no
 *                      longer touches the landing tree (see also bone
 *                      role-named ramp below for the dark continuum).
 *   - ink            — surface ramp (DEFAULT / elevated / subtle).
 *   - sunset         — single brand orange ramp (50..900).
 *   - bone           — text-on-dark ramp, role-named
 *                      (DEFAULT / muted / subtle / hairline).
 *
 * Removed in cleanup: coral.*, gold.*, brand.{red, redDark, flame,
 * amber, ink, glow}, ink.{600, 700, 800, 850, 900, 950} legacy
 * numeric stops, brand-gradient-{soft, vertical}, ink-radial,
 * shadow.{glow, elevated}, fontFamily.thai. None of these were
 * referenced by any landing or /apply/* component.
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
        // ── Forms surface (kept for /apply/* legacy support) ──────
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

        // ── Surfaces (dark continuum) ─────────────────────────────
        ink: {
          DEFAULT: "#0A0A0A",  // canonical poster-black
          elevated: "#16171A", // card / panel
          subtle: "#1F2024",   // hover / pressed surface
        },

        // ── Brand sunset (only orange ramp) ───────────────────────
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

        // ── Text on dark (canonical ramp, role-named) ─────────────
        bone: {
          DEFAULT: "#FFFAF1",
          muted: "rgb(255 250 241 / 0.78)",
          subtle: "rgb(255 250 241 / 0.55)",
          hairline: "rgb(255 250 241 / 0.10)",
        },
      },

      backgroundImage: {
        "brand-gradient":
          "linear-gradient(90deg, #C8341E 0%, #E54A0F 28%, #FF6B1A 58%, #FF8A3D 82%, #FFB347 100%)",
        "ink-spotlight":
          "radial-gradient(ellipse 65% 70% at 85% 25%, rgb(255 138 61 / 0.35) 0%, rgb(255 87 34 / 0.18) 25%, rgb(10 10 10 / 0) 65%)",
      },

      fontFamily: {
        sans: ["var(--font-geist-sans)", "var(--font-thai)", "system-ui", "sans-serif"],
        display: ["var(--font-geist-sans)", "var(--font-thai)", "system-ui", "sans-serif"],
      },

      fontSize: {
        // Compact metadata + display scale. Letter-spacing baked in.
        // Display sizes are kept as opt-in tokens; landing components
        // currently use explicit text-* sizes per breakpoint instead
        // (clamps were too aggressive on Mac displays — see commit
        // history).
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.22em", fontWeight: "600" }],
        metadata: ["0.625rem", { lineHeight: "1", letterSpacing: "0.32em", fontWeight: "600" }],
      },

      boxShadow: {
        ember: "0 18px 50px -18px rgb(255 87 34 / 0.55)",
        ink: "0 24px 60px -20px rgb(0 0 0 / 0.65)",
        // Kept for /apply/* form pages legacy.
        soft: "0 12px 40px -16px rgb(15 27 61 / 0.18)",
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
