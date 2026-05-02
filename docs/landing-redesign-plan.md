# Landing Page Redesign Plan — Phase 2

This is the plan you approve before I touch any code. It contains:

1. **Open questions** — before you pick a direction, three things I need from you.
2. **Proposed token system** — code-ready Tailwind theme + CSS layer.
3. **Three theme directions** — pick one (or mix two).
4. **Section-by-section redesign** — with proposed copy.
5. **File-level change list** — what I'll touch, in what order.
6. **Out of scope.**

---

## 1. Open questions (please answer before I implement)

These are points I won't guess on. Ideally answer all three before Phase 3.

**Q1. Brand naming — "1967" vs. "Gen SEA Summit".**
The site internally still ships "1967" as the program codename (see `messages/en.json:15`, `meta.title`, `apply.header.title`, `apply.success.body`, `theme.body`). The poster, footer tagline, and hero all use "Gen SEA Summit 2026". My read: **"Gen SEA Summit 2026" is the public brand, "1967" was an internal/legacy codename**. Should I:
- (a) Replace all user-facing "1967" references with "Gen SEA Summit 2026"?
- (b) Keep "1967" as a sub-mark / signature line ("Gen SEA Summit 2026 — a 1967 program")?
- (c) Keep both as-is — they're intentional?

**Q2. Thai locale.**
`messages/th.json` exists but `lib/i18n/provider.tsx:42` only ever loads English. Two paths:
- (a) **Wire Thai up.** I'll add a locale switcher (small `EN / TH` toggle in the footer), update the provider to switch dictionaries, and audit `messages/th.json` for parity. Adds ~1 component + provider work.
- (b) **Drop `th.json`.** If Thai is on the roadmap but not now, the file is dead weight.

**Q3. Hero artwork mobile crop.**
The current `/public/hero-poster.png` (1.9 MB) puts the temple sunset on the right third of the source. On phones the temple is mostly clipped off-screen. Options:
- (a) **Re-export two crops** (`hero-poster.webp` for desktop, `hero-poster-mobile.webp` cropped tighter on the temple) — best quality, ~250 KB total.
- (b) **One re-cropped centered crop** — simpler but loses some of the diagonal-triangle composition on desktop.
- (c) **Keep current asset, just convert to WebP** — biggest file-size win, doesn't fix the mobile composition issue.

I lean **(a)** but it's an asset decision, not a code decision.

---

## 2. Proposed token system

This collapses the bloat from Phase 1 §2: 9 cream opacity stops → 4, 8 sunset opacity stops → 3, three names for `#0A0A0A` → one, dead `coral`/`gold`/`brand.flame`/etc. → removed from the landing surface.

The forms (`/apply/*`) currently lean on `navy`, `coral`, `cream`, and the `btn-secondary`/`field-*` utilities. I'll **leave those alone** and only consolidate what the landing actually consumes. Tokens stay in one file; I just stop adding new variants on top of duplicates.

### 2.1 Tailwind theme (proposed `tailwind.config.ts` `theme.extend`)

```ts
// tailwind.config.ts (proposed) — diffs from current
theme: {
  extend: {
    colors: {
      // ── Surfaces ────────────────────────────────────────────
      ink: {
        DEFAULT: "#0A0A0A",   // canonical poster-black
        elevated: "#16171A",  // card/panel surface (was ink.800)
        subtle:   "#1F2024",  // hover/pressed surface (was ink.700)
      },

      // ── Brand sunset (the only orange ramp on the landing) ──
      sunset: {
        50:  "#FFF3EA",
        100: "#FFE3CE",
        200: "#FFC79C",
        300: "#FFA968",   // hover lift on dark
        400: "#FF8A3D",   // accent text on dark    (AA on ink ✓)
        500: "#FF6B1A",   // brand core / focus ring
        600: "#E54A0F",   // primary CTA fill
        700: "#C8341E",   // CTA pressed / gradient ember stop
        800: "#9A2616",
        900: "#6B1B10",
      },

      // ── Text on dark (single canonical ramp) ────────────────
      // Replaces every cream-50/{10..95} ad-hoc opacity in the landing.
      // Names describe role, not opacity.
      bone: {
        DEFAULT: "#FFFAF1",            // primary text on ink
        muted:   "rgb(255 250 241 / 0.78)",  // secondary body
        subtle:  "rgb(255 250 241 / 0.55)",  // tertiary / metadata
        hairline:"rgb(255 250 241 / 0.10)",  // dividers, faint borders
      },

      // ── Forms (kept for /apply/*; do not use on landing) ────
      cream: { 50: "#FFFAF1", 100: "#FBF1E1", 200: "#F5E4C8" },
      navy:  { /* unchanged — used by /apply/* only */ },

      // REMOVED FROM TOKENS (dead on landing, also unused on /apply):
      //   coral.*    — replaced by sunset on landing, never used elsewhere
      //   gold.*     — never used
      //   brand.red, brand.redDark, brand.flame, brand.amber,
      //   brand.ink, brand.glow — duplicates of sunset/ink
      //   ink.850, ink.950, ink.600 — collapsed into 3 named slots above
    },

    backgroundImage: {
      // Single source for the ribbon. Stops match the poster.
      "brand-gradient":
        "linear-gradient(90deg, #C8341E 0%, #E54A0F 28%, #FF6B1A 58%, #FF8A3D 82%, #FFB347 100%)",
      "ink-spotlight":
        "radial-gradient(ellipse 65% 70% at 85% 25%, rgb(255 138 61 / 0.35) 0%, rgb(255 87 34 / 0.18) 25%, rgb(10 10 10 / 0) 65%)",
      // REMOVED: brand-gradient-soft, brand-gradient-vertical, ink-radial
      //   (none used on landing)
    },

    fontFamily: {
      sans:    ["var(--font-geist-sans)", "var(--font-thai)", "system-ui", "sans-serif"],
      display: ["var(--font-geist-sans)", "var(--font-thai)", "system-ui", "sans-serif"],
      // REMOVED: font-thai (alias of font-sans, never used directly)
    },

    fontSize: {
      // Modular type scale (4:5 ratio, capped). Replaces ad-hoc text-[5.5rem].
      // Body 16 / 18 (mobile/desktop), display tops out at 88px.
      // Letter-spacing baked in for display sizes.
      "eyebrow": ["0.75rem", { lineHeight: "1", letterSpacing: "0.22em", fontWeight: "600" }],
      "metadata": ["0.625rem", { lineHeight: "1", letterSpacing: "0.32em", fontWeight: "600" }],
      "display-sm": ["clamp(2.25rem, 4vw, 3rem)",     { lineHeight: "1.05", letterSpacing: "-0.01em", fontWeight: "700" }],
      "display":    ["clamp(2.75rem, 6vw, 4.5rem)",   { lineHeight: "1.0",  letterSpacing: "-0.015em", fontWeight: "800" }],
      "display-xl": ["clamp(3.5rem, 9vw, 5.5rem)",    { lineHeight: "0.95", letterSpacing: "-0.02em",  fontWeight: "800" }],
    },

    boxShadow: {
      // Two purposeful tokens. No more "soft / elevated / glow" trio.
      ember: "0 18px 50px -18px rgb(255 87 34 / 0.55)",
      ink:   "0 24px 60px -20px rgb(0 0 0 / 0.65)",
      // REMOVED: soft, elevated, glow (unused on landing now)
    },

    keyframes: { /* unchanged: fade-up, ember-pulse, scroll-cue */ },
    animation:  { /* unchanged */ },
  },
},
```

### 2.2 globals.css (utility surface, proposed)

Drop the stale `[id] { scroll-margin-top: 80px }` (header is gone). Fix the dark-surface selection color. Add **2 utilities** that replace the most-repeated class strings.

```css
@layer base {
  body { @apply bg-ink text-bone antialiased; }   /* landing default */
  ::selection { @apply bg-sunset-500/30 text-bone; }   /* fix: was text-navy */
  :focus-visible { outline: 2px solid theme("colors.sunset.500"); outline-offset: 2px; }
  /* removed: [id] { scroll-margin-top: 80px } */
}

@layer components {
  /* used 6× across landing — extract */
  .eyebrow { @apply text-eyebrow uppercase text-sunset-400; }

  /* used 4× — extract */
  .check-halo {
    @apply mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center
           rounded-full bg-sunset-500/15 text-sunset-400 ring-1 ring-sunset-500/40;
  }

  /* used 2× — extract (TrackIndividual + TrackStartup callouts) */
  .callout {
    @apply rounded-2xl border-l-4 border-sunset-500 bg-sunset-500/10 p-5
           text-base text-bone-muted;
  }

  /* unchanged: .btn-primary, .btn-inverse, .container-page,
     .gradient-text-brand, .surface-poster, .gradient-strip
     /apply/* utilities (.btn-secondary, .field-*, .card-soft) untouched */
}
```

**Net effect for the landing tree:**
- Color names drop from ~50 → ~12 in active use.
- `cream-50/{10,15,55,60,70,75,85,90,95}` → `bone` (3 named roles + DEFAULT).
- `text-xs font-semibold uppercase tracking-[0.22em] text-sunset-400` (6 sites) → `.eyebrow`.
- Two repeated inline strings → `.check-halo`, `.callout`.
- One canonical `#0A0A0A`, one canonical orange ramp.
- Removes: `coral.*`, `gold.*`, half of `ink.*`, all of `brand.*` from the landing's reachable surface.

---

## 3. Three theme directions

Pick one (or tell me to mix two). All three use the same token system above; what changes is **layout density, voice, and where the brand turns up the volume.**

### A. **Bold Poster** *(poster-true, current direction doubled down)*
The site looks like the GEN SEA poster came to life. Massive slab headlines, all-caps eyebrows everywhere, sunset gradient ribbons as section seams, dense stat strips, "BUILDING AMIDST CHAOS / WHAT ARE YOU MAKING?" energy. The hero scroll cue, ember pulses, and gradient strips stay. Best for: **founders who want to feel chosen for a movement.**

### B. **Editorial Manifesto** *(restrained, magazine-feel)*
Same palette, but the page reads like a long-form Stripe/Linear post. Mostly ink + bone, sunset used sparely as accent (not flood). Generous whitespace, longer line measures, no gradient ribbon seams between sections — just space and a single sunset rule line where the section break needs an anchor. The hero stays bold, but everything below cools down into reading-mode. Best for: **a thoughtful audience that's reading every word.**

### C. **Festival Ink** *(Isan Creative cross-pollination)*
Leans into "Khon Kaen during Isan Creative Festival 2026" (track-individual.tsx:14). Adds **one warm cream-on-ink section** between the dark sections — a culture/place break — with traditional motif accents (subtle line art, festival texture). Sunset gradient stays as the headline brand mark, but the page has a rhythm: dark → cream-warm → dark → cream-warm. The hero is unchanged. Best for: **buying into Khon Kaen as a place, not just a venue.**

| | A. Bold Poster | B. Editorial | C. Festival Ink |
|---|---|---|---|
| Density | Tight | Spacious | Mixed (alternating) |
| Voice | Manifesto, all-caps | Editorial, sentence-case headings | Manifesto with cultural notes |
| Color usage | Sunset everywhere | Sunset sparingly | Sunset + cream-warm mid sections |
| Best section style | Stat strips, gradient seams | Text-led, single-column | 2-column culture spreads |
| Risk | Reads as one-note if scrolling | Less "summit poster" energy | Adds asset/illustration work |
| My recommendation | ⭐ if proof matters most | ⭐ if a thoughtful applicant matters most | Highest ceiling, biggest scope |

**My pick if you want me to choose one:** **A. Bold Poster.** The poster is the strongest brand artifact you have, and the unrendered copy in `messages/en.json` (stats, sectors, "We're not looking for the most polished applicants…") is *already written* in this voice. Direction A is the lowest-effort, highest-fidelity match.

---

## 4. Section-by-section redesign

Proposed new render order:

```
1. Hero                       (full-screen, unchanged structure, copy tightened)
2. Stats strip                NEW — proof, uses messages/en.json:429–457
3. Theme manifesto            (was ThemeSection — rebuilt to use theme.body + theme.pull)
4. Sectors grid               NEW — uses messages/en.json:469–500
5. Audience toggle            (rebuilt as proper tablist)
6. Track Individual / Startup (copy lifted to i18n, callouts moved)
7. Final CTA                  (new copy — no longer duplicates the hero)
8. Footer                     (h2 → h3, locale toggle if Q2 = wire Thai)
```

That's **2 new sections** between hero and toggle. Net effect: the user is **shown proof (stats + sectors) before being asked to pick a track**, which the current page doesn't do at all.

### 4.1 Hero — *keep, tighten*
**Stays:** full-viewport, dark/sunset surface, scroll cue, gradient ribbon at base, fade-up stagger.
**Changes:**
- Wire `t("hero.imageAlt")` to the `<Image>` (a11y fix from §5).
- Lift the `useLocale` call to the page so `Hero` can be RSC.
- Tighten subhead copy (current is fine but can match poster cadence).
- Move the kicker to read **"Gen SEA Summit 2026 · 16–18 July · Khon Kaen"** (already in i18n, just one pill).

**Proposed copy** (final string is yours):
- Eyebrow: `Gen SEA Summit 2026 · 16–18 July · Khon Kaen`
- H1 line 1 (gradient): `Building Amidst Chaos.`
- H1 line 2: `What are you making?`  *(the poster's signature line — currently unused)*
- Subhead: `Three days. 350+ founders, investors, and ministers from 10+ countries. Apply as a delegate or submit a venture — both tracks open below.`
- Primary CTA: `See your track ↓`  *(directional, instead of "Choose your track" which now collides with FinalCta)*

### 4.2 Stats strip — **NEW**
A horizontal poster-style row of 5 numbers. Uses `messages/en.json:429–457` (`stats.items`) + the poster's "350+ / 10+ / 50+ / Closed-door / Endless connections" structure.

```
350+ DELEGATES   |   10+ COUNTRIES   |   50+ SPEAKERS   |   $1,500 BOOTCAMP   |   100% SCHOLARSHIPS
Founders, investors,    From across      Visionaries,         Standalone value,      Up to 100% of
leaders & changemakers  Asia Pacific     experts & leaders    fully covered          USD 1,800
```

Visual: ink-elevated panel, sunset numbers, bone metadata. Same pattern as the poster's stat row.

**File:** `components/landing/stats-strip.tsx` (new). ~50 lines.

### 4.3 Theme manifesto — *rebuild*
**Stays:** dark surface, gradient strips top/bottom.
**Changes:**
- Pull the manifesto body that's already in i18n (`theme.body` — *"Climate, conflict, capital flight, AI displacement…"*) into prominent display.
- Surface `theme.pull` (*"We're not looking for the most polished applicants. We're looking for the ones already moving."*) as a large, gradient-framed pull quote — currently unused.
- **Demote the sponsor block** to a small footer-style mention at the bottom of this section. The sponsor line is breaking the manifesto mood (Phase 1 §3.3); it doesn't need a blockquote.
- Drop the Gen SEA logo image (decorative, 512 KB, redundant with the hero's branding above).

**Proposed copy:**
- Eyebrow: `The 2026 theme`
- H2: `Building Amidst Chaos.`  *(matches hero as recurring motif)*
- Body: existing `theme.body`
- Pull quote: existing `theme.pull`
- Sponsor line (small): `Partners & sponsors → genseasummit.seabridge.space`

### 4.4 Sectors grid — **NEW**
Uses `messages/en.json:469–500` (`sectors.items`) — five sector blurbs (Wellness, Food, AI, Creative, Education). Currently unrendered.

Layout: 5-up grid on `xl`, 2-up on `md`, stacked on mobile. Each card: sector icon (lucide, replacing emoji), sector name (sunset-400 eyebrow), 2-line blurb. Subtle hover-lift, sunset border-glow on hover.

**Proposed copy:** all from existing i18n. No new strings.

**File:** `components/landing/sectors-grid.tsx` (new). ~80 lines.

### 4.5 Audience toggle — *fix semantics, keep visual*
**Stays:** dark pill, gradient on Startup-active state, sunset border on Individual-active state.
**Changes:**
- `role="group"` → `role="tablist"`, buttons → `role="tab"` with `aria-selected` + `aria-controls`.
- Track section gets `role="tabpanel"` + `aria-labelledby`.
- **Move `TrackSwitchLink` from the top of each track to the bottom**, where it makes sense as "didn't find a fit? Switch tracks." instead of pre-emptively offering an exit.
- Add `id="tracks"` anchor on the toggle wrapper (already there) but **also clear the stale `scroll-margin-top: 80px`** in globals.css.

### 4.6 Track Individual / Track Startup — *lift copy to i18n, tighten*
**Stays:** SectionCards, sunset accents, timeline, three-step "What you get / How / Timeline" structure.
**Changes:**
- The 6 `BENEFITS`, 3 `STEPS`, 6 `TIMELINE` items currently hardcoded in each track file move to `messages/en.json` under `tracks.individual.*` and `tracks.startup.*`. Mirrored in `th.json` if you say "wire Thai".
- The "Nomination prioritizes…" callout (currently mid-section) and the "For Thai ventures: TED Fund and NIA…" callout get **moved to the very bottom of each track**, framed as "Fine print" or "Notes" — they're useful, but they don't belong inside the persuasion sections (Phase 1 §3.3).
- Track header H2 changes from descriptive ("Gen SEA Delegates 2026") to outcome-led:
  - Individual: `Be one of 50.`  *(echoes poster's "BE PART OF 50 STUDENT DELEGATES!")*
  - Startup: `Join the 33.`
- The CTA labels become `Start your delegate application` / `Submit your venture` — verb-led, distinct.
- Use the new `.check-halo` and `.callout` utilities so the two tracks share visual language without repeating the same long Tailwind strings.

### 4.7 Final CTA — *change copy*
**Stays:** dark ink panel, gradient strips top + bottom, gradient text headline.
**Changes:**
- Stop duplicating the hero CTA. New label clarifies what the user is committing to.
- Use existing `messages/en.json:599–602` (`finalCta.heading`: *"The room is small. The window is open."*) — already great copy.
- Body becomes a deadline reminder, lifted from existing strings.
- CTA: `Open the application` (instead of "Choose your track" — direct, urgent).

### 4.8 Footer — *demote h2, optional locale toggle*
**Stays:** brand mark, social icons, mailto.
**Changes:**
- `<h2>Connect</h2>` → `<h3>Connect</h3>` (h2 was duplicating with Final CTA's h2 — Phase 1 §5).
- If Q2 answer is "wire Thai": small `EN / TH` toggle next to the email line.

---

## 5. File-level change list

Order is the order I'll commit them. One commit per logical unit, so it's easy to revert any single step.

| # | File | Change | Approx. diff |
|---|---|---|---|
| 1 | `tailwind.config.ts` | Consolidate tokens (§2.1). Drop `coral`, `gold`, `brand.{red,redDark,flame,amber,ink,glow}`, `ink.{850,950,600}`, `brand-gradient-{soft,vertical}`, `ink-radial`, `font-thai`. Add `bone` ramp, `eyebrow`/`metadata`/`display-*` font sizes, ink → ink/elevated/subtle. | -40 / +35 lines |
| 2 | `app/globals.css` | Drop `[id] { scroll-margin-top }`. Fix `::selection` color. Add `.eyebrow`, `.check-halo`, `.callout`. Update body bg to `bg-ink text-bone`. | -8 / +18 |
| 3 | `messages/en.json` | Add `tracks.individual.{benefits,steps,timeline,fineprint}` and `tracks.startup.{...}` keyed copy. Update `hero.headlineLine{1,2}`, `hero.cta.label`, `finalCta.cta`, `theme.heading`. Drop unused `apply.*`/`stats.*` keys? No — keep them, they're used elsewhere. | +60 / -10 |
| 4 | `app/page.tsx` | Re-order: Hero → StatsStrip → ThemeSection → SectorsGrid → TracksArea → FinalCta → Footer. Lift `useLocale` calls to page (RSC where possible). | +10 / -2 |
| 5 | `components/landing/hero.tsx` | Use `t("hero.imageAlt")`. Tighten kicker. Update headline copy. CTA label change. Optional RSC migration. | +6 / -8 |
| 6 | `components/landing/stats-strip.tsx` | NEW. Renders `messages.stats.items` as a horizontal panel. | +60 |
| 7 | `components/landing/theme-section.tsx` | Use `theme.pull` as pull quote. Drop logo image. Sponsor block → small footer-style mention. Update H2. | +20 / -25 |
| 8 | `components/landing/sectors-grid.tsx` | NEW. Renders `messages.sectors.items`. Lucide icons (Heart / Wheat / Cpu / Palette / GraduationCap). | +80 |
| 9 | `components/landing/audience-toggle.tsx` | Switch to `role="tablist"`. Add `aria-selected` + `aria-controls`. `TrackSwitchLink` moves to bottom of each track (file unchanged here, but `track-*.tsx` updated below). | +10 / -10 |
| 10 | `components/landing/track-individual.tsx` | Pull copy from i18n. Use `.check-halo`/`.callout`. Move "fine print" callout to bottom. New H2 + CTA copy. Wrap `<Reveal>` with proper `role="tabpanel"`. | +30 / -50 |
| 11 | `components/landing/track-startup.tsx` | Same as above for the startup track. | +30 / -50 |
| 12 | `components/landing/section-card.tsx` | No change needed (already token-driven after §2 lands). | 0 |
| 13 | `components/landing/final-cta.tsx` | New CTA label. Body copy update. | +4 / -4 |
| 14 | `components/shared/footer.tsx` | h2 → h3. Optional locale toggle (Q2). | +4 / -2 (or +20 if Q2=wire Thai) |
| 15 | `lib/i18n/provider.tsx` | **Only if Q2 = wire Thai.** Add locale state + dictionary switch. Otherwise: delete `messages/th.json`. | +20 / -10 (or -1 file) |
| 16 | `public/hero-poster.{webp,png}` + mobile crop | **Only if Q3 = re-export.** Convert to WebP, add `hero-poster-mobile.webp`. Update `<Image>` to use `srcSet` via two `<source>` tags inside `<picture>` — Next.js Image already handles responsive `srcSet` for one source, but for art-direction (different crop per breakpoint) I'd switch to a custom `<picture>` element. | asset only / minor JSX |

**Total:** ~6 modified files, 2 new files, 2 conditional. No new dependencies. No route or API touches.

---

## 6. Out of scope (will not touch)

- `/apply/*` routes and forms — they have their own design language (cream + navy + coral).
- `/advisor/*` upload flow.
- API handlers, email templates, Apps Script integration.
- `messages/en.json` keys for `apply.*`, `validation.*`, `applyPicker.*` — those drive form pages.
- The `cream`, `navy`, `coral`, `gold` Tailwind palettes — kept intact for forms.

---

## 7. Pre-implementation checklist

When you say "go" on Phase 3, I will:

1. Confirm answers to **Q1 (1967 vs Gen SEA)**, **Q2 (Thai locale)**, **Q3 (hero asset)**.
2. Confirm theme direction: **A / B / C** (or a mix).
3. Confirm I should branch: `redesign/landing-<theme-letter>-<lowercase-name>`.
4. Then commit in the order above, running `npx tsc --noEmit` and `npm run build` after each group.

---

**Phase 2 complete.** Stopping here. Reply with answers to Q1/Q2/Q3 and your theme pick, and I'll create the branch and start Phase 3.
