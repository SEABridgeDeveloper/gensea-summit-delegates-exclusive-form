# Landing Page Audit — Phase 1 (read-only)

**Scope:** the public landing page (`/`) and every component/style it transitively touches. Apply forms, advisor route, API handlers, and email templates were **not** audited — they share tokens but live behind their own routes.

**Date snapshot:** 2026-05-02

---

## 1. File tree (entry → all transitive imports)

```
app/page.tsx                                  # entry — RSC, renders the landing
├── components/shared/skip-to-content.tsx     # client (i18n hook)
├── components/landing/hero.tsx               # client (uses Image + i18n hook)
│   └── components/shared/kicker.tsx          # client
├── components/landing/theme-section.tsx      # client (i18n + Image + Reveal)
│   └── components/shared/reveal.tsx          # client (IntersectionObserver)
├── components/landing/tracks-area.tsx        # client (URL search-params switch)
│   ├── components/landing/audience-toggle.tsx        # client (router + tabs + Reveal)
│   ├── components/landing/track-individual.tsx       # client (Reveal + SectionCard)
│   │   └── components/landing/section-card.tsx       # client
│   └── components/landing/track-startup.tsx          # client (Reveal + SectionCard)
│       └── components/landing/section-card.tsx       # (shared)
├── components/landing/final-cta.tsx          # client (i18n + Reveal)
└── components/shared/footer.tsx              # client (i18n)
    └── components/shared/brand-mark.tsx      # client (next/image)

# Style + token sources
app/layout.tsx                                # fonts, metadata, LocaleProvider
app/globals.css                               # base layer, components layer
tailwind.config.ts                            # theme tokens

# Indirect (referenced via hooks/utils, not landing-specific)
lib/i18n/provider.tsx                         # LocaleProvider, useLocale
lib/cn.ts                                     # twMerge + clsx
messages/en.json                              # all copy
messages/th.json                              # exists, NOT loaded — see §6

# Public assets used by landing
public/hero-poster.png                        # 1.9 MB ⚠ — see §6
public/genseasummit-logo.png                  # 512 KB ⚠
public/logo.png                               # 64 KB
public/ICON.webp                              # 18 KB (favicon, layout.tsx)
public/IMAGE.webp                             # 100 KB (OG image, layout.tsx)
```

Every landing component is `"use client"`. This is not strictly required — `Hero`, `ThemeSection`, `FinalCta`, `Footer` only need client because `useLocale` is a client hook. Migration to RSC is possible by lifting `t()` resolution to the page. (Out of scope for this audit; flagged in §6.)

---

## 2. Design tokens currently in use

### 2.1 Colors

Sourced from `tailwind.config.ts:11–69` and class usage across the landing tree.

| Token | Value | Used at | Notes |
|---|---|---|---|
| `cream.50` | `#FFFAF1` | hero text, footer text, btn fills | Primary on-dark text |
| `cream.50/10` → `/95` | opacity variants | many places | **Too many opacity steps** — see Duplicates |
| `cream.100` | `#FBF1E1` | layout.tsx themeColor (`#FBF1E1`) | Stale from light era |
| `cream.200` | `#F5E4C8` | unused on landing | Dead in landing scope |
| `ink.DEFAULT` | `#0A0A0A` | `surface-poster` base | Duplicate of `ink.900` |
| `ink.900` | `#0A0A0A` | `surface-poster`, ring base | Duplicate of `ink.DEFAULT` |
| `ink.800` | `#16171A` | `SectionCard` fill, toggle pill | Used |
| `ink.850` | `#101010` | unused | Dead |
| `ink.700` | `#1F2024` | unused | Dead |
| `ink.600` | `#2A2C31` | unused | Dead |
| `ink.950` | `#050505` | unused | Dead |
| `sunset.300` | `#FFA968` | `hover:text-sunset-300` (theme-section.tsx:55) | Used |
| `sunset.400` | `#FF8A3D` | every accent text/icon | Heavy use |
| `sunset.500` | `#FF6B1A` | borders, rings, glow | Heavy use |
| `sunset.500/10–/50` | opacity variants | borders, fills | **8 opacity stops** — see Duplicates |
| `sunset.600` | `#E54A0F` | primary CTA fill (hero, individual track) | Primary CTA color |
| `sunset.700` | `#C8341E` | CTA hover, btn-inverse text | Used |
| `sunset.100` | `#FFE3CE` | `Kicker` text-sunset-100 | Light-on-dark accent |
| `sunset.50, 200, 800, 900` | various | unused on landing | Dead in landing |
| `coral.*` (8 stops) | — | unused on landing | All dead in landing |
| `gold.*` (4 stops) | — | unused on landing | All dead in landing |
| `navy.*` (8 stops) | — | unused on landing visually (only `text-navy` reached via global selection rule in globals.css:21) | Dead in landing |
| `brand.red` | `#D62828` | unused on landing | Near-duplicate of `sunset.700` |
| `brand.redDark` | `#A8201E` | only inside `globals.css:59` (`btn-danger`, not on landing) | Dead in landing |
| `brand.flame` | `#FF5722` | unused at runtime (referenced in `boxShadow.ember` rgba) | Near-duplicate of `sunset.500` |
| `brand.amber` | `#FFB347` | end-stop of `bg-brand-gradient` | Used inside the gradient string only |
| `brand.ink` | `#0A0A0A` | unused | Duplicate of `ink.900` |
| `brand.glow` | `#FFD08A` | unused | Dead |
| Inline `rgba(10,10,10,…)` | hero fade overlays | hero.tsx:33, 41 | Magic numbers — should be tokens |
| Inline `rgba(255,107,26,0.8)` | kicker dot glow | kicker.tsx:46 | Magic — same as `sunset.500` at 80% |
| Inline `rgba(255,107,26,0.22)` | shadow `glow` | tailwind.config.ts:92 | Magic |
| Inline `rgba(255,87,34,0.55)` | shadow `ember` | tailwind.config.ts:93 | Magic — `brand.flame` at 55% |
| Inline `rgba(0,0,0,0.65)` | shadow `ink` | tailwind.config.ts:94 | Magic |
| Gradient stops (5) | `#C8341E → #E54A0F → #FF6B1A → #FF8A3D → #FFB347` | `bg-brand-gradient` | Single source ✓ |

**Duplicates / near-duplicates flagged:**

- `ink.DEFAULT` ≡ `ink.900` ≡ `brand.ink` — three names for `#0A0A0A`. Pick one.
- `sunset.700` (`#C8341E`) ≈ `brand.red` (`#D62828`) — within ~6% RGB; same role.
- `sunset.500` (`#FF6B1A`) ≈ `brand.flame` (`#FF5722`) — visually the same orange.
- `sunset.300` (`#FFA968`) ≈ `brand.amber` (`#FFB347`) ≈ `brand.glow` (`#FFD08A`) — three light oranges, all unused or near-duplicates.
- `sunset-500/10`, `/15`, `/20`, `/25`, `/30`, `/40`, `/45`, `/50` — **8 opacity stops** in active use. Should collapse to ~3 (border, soft fill, strong fill).
- `cream-50/10`, `/15`, `/55`, `/60`, `/70`, `/75`, `/85`, `/90`, `/95` — **9 opacity stops** for one color. Reduce to a typography scale (primary / secondary / tertiary / divider).
- `border-cream-50/10` (theme-section.tsx:43, footer.tsx:58, section-card.tsx:48, 82, 91, etc.) vs `border-cream-50/15` (theme-section.tsx:43) — used inconsistently for the same role (low-contrast divider).

### 2.2 Typography

| Token | Value | Used at |
|---|---|---|
| `font-sans` | Geist Sans + IBM Plex Sans Thai | body default (layout.tsx:61) |
| `font-display` | (alias to Geist) | all headlines |
| `font-thai` | (alias to IBM Plex Thai) | declared, never used directly |
| Weights | `400` (default), `500`, `600`, `700` (font-bold), `800` (extrabold) | hero h1 = 800 |
| Sizes (used on landing) | `text-[10px]`, `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`, `text-6xl`, `text-7xl`, `text-[5.5rem]` | hero scales 5xl → 5.5rem |
| Tracking | `tracking-[0.16em]`, `tracking-[0.18em]`, `tracking-[0.22em]`, `tracking-[0.32em]`, `tracking-tight` | **Ad-hoc 4-stop scale** — should be 2 (eyebrow, hero) |
| Leading | `leading-[0.95]`, `leading-relaxed` | hero only |
| Selection color | `bg-sunset-500/30 text-navy` | globals.css:21 — ⚠ uses `text-navy` on dark sections, will be invisible on dark surface during selection |

**Notes:**
- `font-display`, `font-sans`, `font-thai` are all aliased to the same Geist+Thai stack (tailwind.config.ts:84–88) — no actual display font. Three names, one face.
- The `font-feature-settings: "ss01", "cv11"` in globals.css:17 are Geist-specific stylistic sets; Thai font ignores them silently.

### 2.3 Spacing, radii, shadows, transitions

| Category | Tokens in use | Notes |
|---|---|---|
| Container | `container-page` = `max-w-6xl px-5 sm:px-8 lg:px-12` (globals.css:71) | ✓ |
| Section vertical padding | `py-20 sm:py-28` (theme, tracks), `py-12 sm:py-16` (toggle), `pb-12 pt-28 sm:pt-32 lg:pt-36` (hero), `py-14` (footer), `py-20 sm:py-24` (final-cta) | **Ad-hoc** — no scale |
| Card padding | `px-6 py-8 sm:px-10 sm:py-10` (section-card.tsx:48, 77) | Repeated literal |
| Gap between Reveal items | `mt-10` between `SectionCard`s (section-card.tsx:43) | Coupled to component, not token |
| Border radius | `rounded-full`, `rounded-2xl`, `rounded-3xl`, `rounded-xl` (forms only), `rounded-[…]` none | ✓ small scale, consistent |
| Shadow tokens | `shadow-soft`, `shadow-elevated`, `shadow-glow`, `shadow-ember`, `shadow-ink` | `shadow-elevated`, `shadow-glow` unused on landing |
| Transition durations | `transition` (default 150ms), `duration-300`, `duration-700` | `duration-700` only on `Reveal` |
| Easings | `ease-out` on Reveal/cards; `cubic-bezier(0.22,1,0.36,1)` on `animate-fade-up` (tailwind.config.ts:113) | ✓ |
| Animations | `fade-up`, `ember-pulse`, `scroll-cue` | All landing-specific |
| Blurs | `blur-[120px]`, `blur-[140px]` | **Two ad-hoc values** for the same role (sunset glow blob); no token |

### 2.4 Tailwind class duplicates worth tokenizing

- `text-xs font-semibold uppercase tracking-[0.22em] text-sunset-400` — used at theme-section.tsx:24, audience-toggle.tsx:33, track-individual.tsx:49, track-startup.tsx:55, footer.tsx:31, kicker (variants). **6 sites** — extract a single `eyebrow` class.
- `bg-sunset-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-sunset-700` — used at hero, track-individual, similar at track-startup. Should be `btn-primary` (the existing one in globals.css:50 has slightly different padding `px-7 py-3.5`, see Duplicates).
- `bg-sunset-500/15 text-sunset-400 ring-1 ring-sunset-500/40` (track-individual.tsx:85) vs `bg-sunset-500/20 text-sunset-400 ring-1 ring-sunset-500/45` (track-startup.tsx:94) — same UI element (check halo), arbitrarily different opacity. Should be one component.
- `border-l-4 border-sunset-500 bg-sunset-500/10` (track-individual.tsx:114, track-startup.tsx:127) — callout strip, repeated inline.

---

## 3. Hierarchy & theme audit

### 3.1 Sections in render order

| # | Section | File:line | Purpose | Heading level |
|---|---|---|---|---|
| 1 | `<SkipToContent>` | page.tsx:15 | Keyboard a11y skip link | — |
| 2 | `<Hero>` | page.tsx:17, hero.tsx:9 | Brand identity + primary CTA | h1 |
| 3 | `<ThemeSection>` | page.tsx:18, theme-section.tsx:11 | 2026 theme story + sponsor link | h2 |
| 4 | `<TracksArea>` (Suspense-wrapped) | page.tsx:19–21 | Container for the tracks subtree | — |
| 4a | `<AudienceToggle>` | tracks-area.tsx:11, audience-toggle.tsx:16 | Switch between Individual / Startup track | — (no h*) |
| 4b | `<TrackIndividual>` OR `<TrackStartup>` | tracks-area.tsx:13 | Track-specific benefits, steps, timeline | h2 + 3× h3 |
| 5 | `<FinalCta>` | page.tsx:22, final-cta.tsx:8 | Repeat the choice + close | h2 |
| 6 | `<Footer>` | page.tsx:24, footer.tsx:16 | Brand mark + socials + email + copyright | h2 ("Connect") |

Heading order is technically correct (h1 → h2 → h3, no skips) but **two sibling h2s** ("Connect" in footer, "The room is small…" in final CTA, "Gen SEA Delegates 2026" / "Gen SEA Ventures 33" in track) compete for the same level.

### 3.2 CTA inventory and conflicts

| # | Label | Style | Destination | Where |
|---|---|---|---|---|
| 1 | **Choose your track** | Primary (sunset-600 fill, ember shadow) | `#tracks` | hero.tsx:88–98 |
| 2 | Scroll | Soft chevron link | `#tracks` | hero.tsx:104–119 |
| 3 | Become a sponsor | Tertiary text link | external `genseasummit.seabridge.space` | theme-section.tsx:50 |
| 4 | Individual Applicant / Startup Applicant | Toggle pill (one always "active") | `?track=…#tracks` | audience-toggle.tsx:44, 58 |
| 5 | Looking for the other track? Switch to … | Tertiary text link | `?track=…#tracks` | audience-toggle.tsx:91 (`TrackSwitchLink`, used at top of each track) |
| 6 | **Apply as Individual** | Primary (sunset-600) | `/apply/delegate` | track-individual.tsx:56 |
| 7 | **Apply as Startup** | Primary (gradient fill) | `/apply/venture` | track-startup.tsx:62 |
| 8 | Choose your track | Inverted (cream fill, ember shadow) | `/#tracks` | final-cta.tsx:25 |

**Competing CTAs / conflicts:**
- **CTA 1 and CTA 8 are identical labels with the same destination.** "Choose your track" appears twice — at the top and bottom of the page, both leading to `#tracks`. The bottom CTA is meant to close the funnel but reads as a re-entry into the same decision.
- **CTA 1 → CTA 4 is a redundant detour.** The hero CTA sends users to the toggle, which is itself a decision point. Then the toggle changes the track view, where the *real* primary CTA (Apply) lives. That's 3 decisions to start applying. Compare to the poster, where "BE PART OF 50 STUDENT DELEGATES!" already names the path.
- **CTA 5 (TrackSwitchLink) sits above the track header**, before the user has read what's on the current track. Encourages second-guessing before commitment.
- The hero promises "Choose your track" but the *theme* section comes before the toggle — users have to scroll past the story to reach the choice they were promised. (Argument for keeping it: the story sets stakes. Argument against: high bounce risk on a long mood section before the action.)

### 3.3 Mood — one sentence, with contradictions

> The page wants to feel like a **bold ASEAN founder poster** — sunset-on-ink, all-caps eyebrows, gradient ribbons, "Building Amidst Chaos" energy — and on the hero it nails it.

**Contradictions / things that break the mood:**
- `theme-section.tsx:48` — the sponsor blockquote (*"Help us make this happen. We're partnering with organizations who believe in ASEAN's next generation of builders."*) reads as an institutional fundraising line — softer, more corporate than the bold register.
- `audience-toggle.tsx:97` — *"Looking for the other track? Switch to Startup Applicant"* sounds like helpdesk copy in the middle of a manifesto.
- `track-individual.tsx:107` — the callout *"Nomination prioritizes your application — it does not guarantee selection."* is a clarifying disclaimer in a section that should be persuading. Useful info, but the placement and tone (legal-leaning) drops the energy.
- `track-startup.tsx:128` — *"For Thai ventures: TED Fund and NIA portfolio ventures are strongly encouraged to apply through the standard pathway."* — same issue: a procedural note inside a sales section.
- The **track headlines** ("Gen SEA Delegates 2026", "Gen SEA Ventures 33") are descriptive, not aspirational. The poster says "BE PART OF 50 STUDENT DELEGATES!" — outcome-led. The site says the program name.
- The **theme section heading** is just *"Gen SEA Summit"* (theme-section.tsx:28) over a body that talks about climate, conflict, capital flight, AI displacement. The heading underclaims the body.
- `messages/en.json` already has stronger, mood-aligned copy that **isn't rendered**: `theme.body` (the chaos paragraph, 461), `theme.pull` ("We're not looking for the most polished applicants…", 462), `whoCanApply.footnote` ("If you are working on something you would defend in a room full of strangers, you are eligible.", 522), `howToGetIn.steps` (apply / interview / confirm), `sectors.items` (5-sector blurbs). The landing currently shows about **30%** of the prepared copy.

---

## 4. Responsive check

### 4.1 Breakpoints in use

Tailwind defaults: `sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280`. No `2xl`. Custom breakpoints not added.

### 4.2 Fixed widths and overflow risks

- `tailwind.config.ts:84` — `font-feature-settings` not a width issue, but the **only literal pixel widths** on the landing are decorative blur sizes (`h-96 w-96`, `h-[28rem] w-[28rem]`, `blur-[120px]`, `blur-[140px]`). The container itself is `max-w-6xl` (~1152px) and content uses `max-w-3xl/2xl/xl/md`. No fixed pixel containers — ✓.
- `hero.tsx:71` — `text-[5.5rem]` headline at xl (~88px). At `xl` (1280px), `max-w-3xl` (~768px) holds it, but a long localized first line could push the right gradient text past the safe zone. Less risky in EN, riskier in TH (longer translations).
- `hero.tsx:104–119` — the scroll cue is bottom-aligned inside `min-h-[100dvh]`. On a **landscape phone** (e.g. 360×640 rotated → 640×360), `pt-28` (112px) + headline + paragraph + CTA already exceed 360px → cue ends up below the fold or overlaps the CTA. **Overflow risk.**
- `track-individual.tsx:132` and `track-startup.tsx:146` — timeline grid is `lg:grid-cols-6`. With long labels like *"Open call and institutional nominations open."* (track-startup.tsx:34), each cell is ~165px wide at `max-w-6xl`. Labels wrap to 4–6 short lines under each dot. **Crowded on `lg`** (1024px); fine on `xl`+.
- `theme-section.tsx:22` — grid `lg:grid-cols-[1fr_1.4fr]` with the logo image at `lg:h-64` (256px) on the left. At exactly `lg` (1024px) the left col is ~427px and the logo PNG (which is 400×400 source, 512 KB) fills the upper portion — fine — but if the body paragraph is short (it isn't), the columns end up unequal heights. Acceptable.
- Hero image `object-right` — on mobile (<lg) the temple sunset is mostly off-screen-right because the artwork's interesting content is on the right third of the source. The `lg:hidden` vertical fade compensates but the temple silhouette is barely visible on narrow phones. **The poster artwork doesn't earn its weight on mobile.**

### 4.3 Sub-768px reflow

Each section was checked at simulated 375px:
- Hero ✓ — content stacks, image fades out via vertical overlay, cue stays bottom-centered. **Risk:** landscape orientation only (above).
- ThemeSection ✓ — `grid-cols-1` until lg, blockquote and link wrap cleanly.
- AudienceToggle ✓ — toggle pill stacks vertical (`max-w-md flex-col sm:flex-row`).
- Track headers ✓ — h2 stacks above CTA (`flex-col sm:flex-row`). H2 at `text-4xl` is 36px → wraps to 3 lines for long names but readable.
- SectionCards ✓ — header stacks step badge over text (`flex-col sm:flex-row`). Padding shrinks (`px-6 py-8`).
- Timeline ✓ — `grid-cols-1` until sm, then `sm:grid-cols-2`, then `lg:grid-cols-6`. The intermediate `sm:grid-cols-2` is a sensible halfway. Good.
- FinalCta ✓ — stacks h2 above CTA (`flex-col lg:flex-row`).
- Footer ✓ — stacks brand block above socials (`flex-col md:flex-row`). The "Khon Kaen · 2026" line moves to its own row under `<md`.

---

## 5. Accessibility quick scan

| Severity | Issue | File:line | Fix sketch |
|---|---|---|---|
| **High** | Hero image `alt=""` + `aria-hidden="true"`, but `messages/en.json:39` already defines `hero.imageAlt` ("Golden hour view of a Thai temple skyline…"). The artwork is meaningful (sets ASEAN context). Screen-reader users miss it. | hero.tsx:22–23 | Use `t("hero.imageAlt")` and drop `aria-hidden` |
| **High** | `selection` color `bg-sunset-500/30 text-navy` — `text-navy` (`#0F1B3D`) is invisible on the dark sections during text selection because the ink-900 surface is already nearly black. | globals.css:21 | Use `text-cream-50` for selection on dark, or rely on browser default |
| **High** | Audience toggle uses `role="group"` with `aria-pressed` buttons. This is a true tablist pattern — it switches between two views (Individual / Startup) and the URL reflects the choice. Screen-reader users will hear "pressed" rather than "selected"/"current view". | audience-toggle.tsx:40–72 | Use `role="tablist"` + `role="tab"` + `aria-selected` + `aria-controls` pointing to the track section |
| **Medium** | `TrackSwitchLink` is a `<button>` with body text and a non-icon arrow. No aria-label, no clear affordance that it changes the entire view below. | audience-toggle.tsx:91–102 | Add `aria-label="Switch to <other track>"` or fold into the tablist above |
| **Medium** | `[id] { scroll-margin-top: 80px }` (globals.css:45) reserves space for a sticky header that **no longer exists** (header was removed). On in-page anchor jumps the target now appears 80px below where it should. | globals.css:44–46 | Remove or set to 0 |
| **Medium** | Sibling h2 levels have wildly different importance: "Gen SEA Delegates 2026" (track main heading) and "Connect" (footer column header) are both h2. Footer should be h3 or `<p>` styled. | footer.tsx:31 | Demote to h3 |
| **Low** | `theme-section.tsx:47–49` — `<blockquote>` has a `<p>` child wrapping the copy; the blockquote itself has font-display styling but is otherwise empty. Slightly redundant DOM. | theme-section.tsx:47 | Move classes to `<p>` and drop the inner wrapper, or keep as-is — not broken |
| **Low** | Hero scroll cue at `text-cream-50/55` on top of the sunset-glow region of the hero image — contrast may dip below 4.5:1 in the gradient hot-spot. | hero.tsx:107 | Bump to `/70` or add a subtle backdrop-blur pill |
| **Low** | Decorative gradient strips, glow blobs, and animated chevron all use `aria-hidden="true"` correctly ✓ |  |  |
| **Low** | All link icons (`ArrowRight`, `ArrowUpRight`, `ChevronDown`) use `aria-hidden="true"` correctly ✓ |  |  |

**Heading order at a glance** (verified — no skips):
```
h1   Gen SEA Summit / Youth Delegation Application       (hero.tsx:70)
h2   Gen SEA Summit                                       (theme-section.tsx:27)
h2   Gen SEA Delegates 2026 OR Gen SEA Ventures 33       (track-*.tsx:53)
h3   The full Summit, fully covered.                      (section-card via track step 01)
h3   Three steps. No tricks. / Three steps to the cohort. (section-card via track step 02)
h3   Mark the dates                                       (section-card via track step 03)
h2   The room is small. The window is open.               (final-cta.tsx:20)
h2   Connect                                              (footer.tsx:31) — should be h3
```

---

## 6. Performance flags

| Severity | Issue | Where | Notes |
|---|---|---|---|
| **High** | `hero-poster.png` = **1.9 MB**, served as PNG, used as full-bleed hero image with `priority`. Largest single asset on the page. | public/hero-poster.png, hero.tsx:21 | Convert to WebP (~150–300 KB) or AVIF (~80–200 KB). Use Next.js Image's responsive `srcSet` (already enabled by `sizes="100vw"`, but the *source* asset is one giant PNG so each variant is downscaled from a 1.9 MB original). |
| **High** | `genseasummit-logo.png` = **512 KB** for a 400×400 logo used decoratively at `h-48 lg:h-64`. | public/genseasummit-logo.png, theme-section.tsx:31 | Convert to PNG-8/SVG/WebP. Should be <50 KB. |
| **Medium** | The entire landing renders client-side (every component is `"use client"`) because `useLocale` is a client hook. The page is largely static content. | all landing components | Lift `t()` resolution to RSC by reading `messages/en.json` directly; keep client only where router/state is actually needed (`audience-toggle.tsx`, `tracks-area.tsx`, `Reveal`). |
| **Medium** | `messages/th.json` exists alongside `en.json` but `lib/i18n/provider.tsx:42` only ever loads `en`. Either ship Thai or remove the file. | lib/i18n/provider.tsx:42, messages/th.json | Either implement locale switching or delete the unused dictionary. |
| **Medium** | `messages/en.json` ships ~600 lines of copy, of which roughly 30% is rendered. The unrendered keys (`stats`, `theme.pull`, `sectors`, `whoCanApply`, `benefits`, `howToGetIn`, `timeline`) are loaded into the client bundle even though nothing uses them. | messages/en.json | Either render those sections (likely — they're written in poster-aligned voice) or split the JSON so the landing imports only what it needs. |
| **Low** | Every `Reveal` mounts its own `IntersectionObserver` (one per element). For the current ~10 reveals, fine. Becomes a problem if the page grows to 50+. | reveal.tsx:38 | Acceptable now; could share one observer if it scales. |
| **Low** | `lucide-react` icons imported per-component (`ArrowRight`, `ChevronDown`, `Lock`, `GraduationCap`, `Rocket`, `Check`, `Mail`, `Facebook`, `Instagram`, `Linkedin`, `ArrowUpRight`). Modern bundlers tree-shake. | several files | No action. |
| **Low** | Inline base64 blobs: **none found** in the landing tree. ✓ |  |  |
| **Low** | Unused tailwind palette stops on landing: `coral.*` (8), `gold.*` (4), `navy.*` (8), and several `ink.*` / `sunset.*` mid-stops. They aren't shipped to the browser (Tailwind purges) but they bloat the design language and make it harder for new contributors to know what's canonical. | tailwind.config.ts:11–69 | Either keep them (they're used by `/apply/*`) and document the boundary, or fork the landing into its own theme file. |
| **Low** | `globals.css` defines `.btn-secondary`, `.btn-danger`, `.btn-ghost`, `.icon-halo`, `.icon-halo-lg`, `.card-soft`, `.field-*`, `.gradient-text-brand` (used), `.surface-poster` (used), `.gradient-strip` (used). The `btn-*` and `field-*` are for `/apply/*` — not landing. Document or split. | globals.css:49–104 | Same as above — the landing audit should not need to read `field-input` styles. |

---

## Summary — top issues to address in Phase 2

1. **Token bloat:** `coral`, `gold`, most of `navy`, half of `ink`, half of `brand` are dead weight in the landing. The opacity scale on `cream-50` and `sunset-500` has 8–9 stops that could collapse to 3–4. The `brand.flame ≡ sunset.500` and `brand.red ≈ sunset.700` near-duplicates need to merge.
2. **CTA funnel is too deep:** 3 decisions to start applying. The hero promises "choose your track" but the tracks are 2 sections away; FinalCta repeats the same label.
3. **30% of prepared copy is on the cutting-room floor.** `theme.pull`, `sectors`, `whoCanApply`, `benefits`, `howToGetIn`, `timeline`, `stats` are written in the poster's voice and unrendered. The landing is missing the proof sections that make the poster feel proof-led.
4. **The hero artwork is the wrong shape for mobile** (sunset-temple sits on the right third of the source) and is **1.9 MB**. Either re-crop a mobile variant or convert + responsive-source.
5. **Mood is undermined by 4 lines of helpdesk/legal copy** dropped into the bold sections (`TrackSwitchLink`, the two callouts, the sponsor blockquote).
6. **A11y wins are easy:** restore the unused `hero.imageAlt`, switch the toggle to `role="tablist"`, demote footer h2, fix the stale `scroll-margin-top`, fix the dark-surface text-selection color.
7. **Architecture polish:** lift `useLocale` to RSC where possible, ship Thai or delete `th.json`, pick one home for `ink.900`/`#0A0A0A`.

---

**Phase 1 complete.** Stopping here. Say **"go"** to proceed to Phase 2 (token system + theme directions + section-by-section redesign plan).
