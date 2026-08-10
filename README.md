# Terra — Phase 1

A geography-learning app you explore instead of memorize. This is the
foundation: architecture, design system, real data, and an interactive
globe — not the whole app in the original brief (that's a multi-phase build;
see **Roadmap** below).

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android), or press `i` / `a` for a
simulator. No API keys, no accounts, no backend — everything here runs
fully offline.

If Expo Go complains about a native module, the fallback is a custom dev
client: `npx expo prebuild` then `npx expo run:ios` / `run:android`. Every
library used here (Reanimated, Gesture Handler, SVG, SQLite, Blur, Linear
Gradient, Haptics) ships as a standard Expo module, so this shouldn't be
necessary, but SDK/device combinations can be unpredictable on a first run.

## What's here

- **Expo Router** navigation (`app/`) over a clean `src/` architecture —
  components, screens, theme, data, store, services, utils, all separated.
- **Design system** (`src/theme`) — a brass-and-vellum instrument palette
  instead of a generic travel-app look. Fraunces for headings (used with
  restraint), Manrope for body/UI, JetBrains Mono for coordinates and
  stats. Full dark/light support.
- **Real data for 194 countries** (`src/data/countries.ts`) — capital,
  population, area, languages, currencies, calling codes, neighbors, and
  more, generated from the open [`world-countries`](https://github.com/mledoze/countries)
  dataset (ODbL license — see `scripts/prepare-data.mjs`, which you can
  re-run any time to refresh or extend it).
- **Real border geometry** (`src/data/worldBorders.json`) for 174 of those
  countries, from `world-atlas` / Natural Earth (public domain), simplified
  to keep the bundle small.
- **Religion composition** for all 194 countries — top religious groups by
  share of population (~2020 estimates), from Pew Research Center's
  *Global Religious Landscape* data via
  [`datasets/world-religion-projections`](https://github.com/datasets/world-religion-projections)
  on GitHub (**CC BY 4.0** — attribution required if this data ships
  publicly; the in-app source line and this README both carry it). Shown
  as a proportional bar with an honest "unspecified" remainder when the
  listed groups don't add up to the full population, rather than letting a
  partial breakdown visually read as the whole picture.
- **The globe** (`src/components/globe/Globe.tsx`) — a gesture-driven
  orthographic projection (the same illusion antique globes and atlases
  use to render a sphere in 2D). Drag to rotate, pinch to zoom, tap a
  country to fly to it. Hand-rolled projection math, no runtime geo
  library, so it's easy to move onto a worklet or swap for a full WebGL
  3D sphere later without touching anything else.
- **A complete country page** — hero, quick facts, a "did you know" for
  122 featured countries, tap-to-hop neighbors, favorites (persisted via
  SQLite), and honest "coming soon" cards for the sections that aren't
  built yet.
- **Search** — jump to any of the 194 countries by name or capital.

## Roadmap

This app is being built in phases. Phase 1 and 2 are done; Phase 2 got a
second pass to fix real issues found on review (see below) rather than
carrying them into Phase 3.

1. ~~**Foundation** — architecture, design system, data, globe, one country page~~
2. ~~**Content** — History/Culture/Nature/Food/Landmarks sections, religion
   data, a second map layer, a full review pass~~ (121 countries have full
   narrative content so far; all 194 have core facts + religion)
3. **Learning engine** — quiz modes, spaced repetition, mastery tracking
4. **Gamification** — achievements, stats, daily challenges, expeditions
5. **Polish** — AI tutor, social features, offline sync, accessibility pass,
   a true WebGL 3D globe upgrade (clouds, night lights, satellite texture)

## Fixed on review (Phase 2, pass 2)

Worth recording since none of these were visible from the outside:

- **The globe's "tap a country to fly to it" wasn't actually centering the
  tap** — the rotation math was off by a derivable amount (`-lon` instead
  of `90° - lon`), and verification showed it was rotating the tapped
  country to negative depth (off-screen) rather than to the center. Fixed
  and confirmed against 6 coordinates including a pole.
- The population-density legend's lowest bucket reused a globe-gradient
  color nearly identical to the background — added a dedicated 5-step
  scale instead of repurposing single-purpose theme colors.
- The religion bar could visually read as "100%" when the listed groups
  only covered a partial share (rare, but happens for a couple of
  religiously fragmented countries) — added an honest remainder segment.
- Splash screen could hide before favorites/recents finished loading from
  disk, causing a brief flash of un-hydrated UI; also hardened the
  hydration path so a storage read failure can never soft-lock the app on
  a blank screen (a risk introduced by the first fix, caught before shipping).
- `Dimensions.get()` (a static snapshot) swapped for `useWindowDimensions`
  (reactive to rotation/resize); globe sizing now also respects screen
  height, not just width, so it can't overflow on short devices.
- Smaller fixes: a hardcoded "15 countries" string that would drift out of
  date, a golf-flag emoji standing in for "capital city," two redundant
  back-to-back "coming soon" headers merged into one, a missing empty
  state in search.

## Known gaps (by design, not oversight)

- 72 countries still don't have a curated "fun fact" and accent color so far —
  the rest show core facts only, which is honest given no narrative
  content has been authored yet.
- 20 very small territories (e.g. Vatican City) don't have border polygon
  data at this simplification level — they still appear as markers. 165 of
  194 countries have real border geometry.
- No live/volatile facts (current heads of state, GDP, government type)
  are included — those need a live data source, not a bundled static file.
