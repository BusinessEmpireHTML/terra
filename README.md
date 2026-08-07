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
- **The globe** (`src/components/globe/Globe.tsx`) — a gesture-driven
  orthographic projection (the same illusion antique globes and atlases
  use to render a sphere in 2D). Drag to rotate, pinch to zoom, tap a
  country to fly to it. Hand-rolled projection math, no runtime geo
  library, so it's easy to move onto a worklet or swap for a full WebGL
  3D sphere later without touching anything else.
- **A complete country page** — hero, quick facts, a "did you know" for
  26 featured countries, tap-to-hop neighbors, favorites (persisted via
  SQLite), and honest "coming soon" cards for the sections that aren't
  built yet.
- **Search** — jump to any of the 194 countries by name or capital.

## Roadmap

This app is being built in phases. Phase 1 (this one) is the foundation.

1. ~~**Foundation** — architecture, design system, data, globe, one country page~~
2. **Content** — History, Culture & Food, Nature, Landmarks sections; more map layers
3. **Learning engine** — quiz modes, spaced repetition, mastery tracking
4. **Gamification** — achievements, stats, daily challenges, expeditions
5. **Polish** — AI tutor, social features, offline sync, accessibility pass,
   a true WebGL 3D globe upgrade (clouds, night lights, satellite texture)

## Known gaps (by design, not oversight)

- Only 26 countries have a curated "fun fact" and accent color so far —
  the rest show core facts only, which is honest given no narrative
  content has been authored yet.
- 20 very small territories (e.g. Vatican City) don't have border polygon
  data at this simplification level — they still appear as markers.
- No live/volatile facts (current heads of state, GDP, government type)
  are included — those need a live data source, not a bundled static file.
