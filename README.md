# Terra

A geography-learning app you explore instead of memorize. Built in phases;
see **Roadmap** below for what's done.

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
  all 194 countries, tap-to-hop neighbors, favorites (persisted via
  SQLite), and honest "coming soon" cards for the sections that aren't
  built yet.
- **Search** — jump to any of the 194 countries by name or capital.

## The learning engine (Phase 3)

- **7 quiz categories** (`src/quiz/generators.ts`), all generated from data
  already in the app — no separate quiz content to author:
  - Flags, Capitals, Currencies, Neighbors, Landmarks, Food — **all 194
    countries**, now that Phase 2's content is complete
  - Shapes — the 165 countries with real border geometry, rendered as a flat
    silhouette (`CountrySilhouette`), not the globe
- **Spaced repetition** (`src/quiz/srs.ts`) — a Leitner-box system (6 boxes,
  0–35 day intervals). Wrong answers drop back near the start; right answers
  push further out. `LearnScreen` and each quiz session prioritize whatever
  is actually due.
- **Mastery scoring** (`src/quiz/mastery.ts`) — per country, combining *how
  well* you know what you've tried (box level) with *how much* of the
  country you've explored (category coverage), so acing one flag question
  isn't "mastery." Eight levels, Explorer → Legend, matching the original
  brief.
- **Progress storage** (`src/services/progressStore.ts`) — real SQLite
  table (not just a key-value blob), indexed on due date, so "what's due
  right now" is one indexed query even at full scale.
- **Mastery on the globe** — a third map layer alongside Political and
  Population: countries are unlit until you've practiced them at all, then
  warm up through the same brass→ember scale as your score rises.
- **Practice this country** — a button on every country page that launches
  a focused session covering just that country, across every category it
  has data for.

## Gamification (Phase 4)

- **~38 real achievements** (`src/gamification/achievements.ts`) — every
  one has an actual, computable trigger condition evaluated against real
  progress/activity data (`evaluateAchievements`). Not "hundreds" of
  decorative badges — genuine ones, matching the brief's own named examples
  (First Flag, Capital Master, African Explorer, Island Hunter, Geography
  Legend) where the underlying data supports them.
- **Activity log & stats** (`src/services/activityStore.ts`) — a real SQLite
  event log (not aggregates), computing daily/longest streaks, a 12-week
  calendar heatmap, XP, accuracy, and a per-continent mastery breakdown
  (weakest/strongest continent) entirely from stored data.
- **10 expeditions** (`src/gamification/expeditions.ts`) — curated country
  groupings (European Capitals, African Safari, Silk Road, Countries of the
  Equator, and more), each with real, verified country codes and progress
  tracked via existing mastery scores — no separate progress system needed.
- **Daily challenges** — a deterministic Country of the Day (same for the
  whole day, no server needed), a 5-question Daily Quiz, and a 60-second
  Speed Round (auto-advancing, still feeds real SRS/XP data).
- **Profile tab** — XP, streak, heatmap, continent chart, and the full
  achievement grid, all real, all computed from the same stores everything
  else uses.

## Roadmap

This app is being built in phases. Phases 1–4 are done.

1. ~~**Foundation** — architecture, design system, data, globe, one country page~~
2. ~~**Content** — History/Culture/Nature/Food/Landmarks sections, religion
   data, a second map layer, a full review pass~~ **all 194 countries have
   full narrative content and religion data** (completed in a follow-up
   pass — see below; originally shipped at 121/194)
3. ~~**Learning engine** — quiz modes, spaced repetition, mastery tracking~~
   (7 quiz categories, a Leitner-system review queue, and mastery scoring —
   see below)
4. ~~**Gamification** — achievements, stats, daily challenges, expeditions~~
   (~38 real achievements, a real activity log, 10 expeditions, 3 daily
   challenges — see below)
5. **Polish** — AI tutor, social features, offline sync, accessibility pass,
   a true WebGL 3D globe upgrade (clouds, night lights, satellite texture)

## Phase 2 completion pass

Phase 2 originally shipped with 121/194 countries fully written (the rest
had core facts + religion only, shown honestly as "not written yet"). This
pass wrote the remaining 73 — every remaining country in Asia, Europe, the
Americas, Africa, and Oceania — bringing content, accent colors, and fun
facts to all 194. A few notes on how the harder ones were handled:

- **Israel** and other countries with contested or sensitive recent
  history (Bosnia, Rwanda-adjacent Burundi, Western Sahara-adjacent
  Morocco, South Sudan, Somalia) get the same treatment as Ukraine and
  Syria did in the original batch: well-established historical fact,
  handled with care and without editorializing, stopping short of live or
  contested political detail rather than taking a side.
- Every one of the 73 new countries also got a real accent color and fun
  fact — not just narrative text bolted onto bare data — so there's no
  two-tier experience between "old" and "new" countries.
- Restored the whole project from the last delivered zip after the
  sandbox reset between sessions, rather than rebuilding from scratch —
  worth knowing if you're continuing this kind of work: `/mnt/user-data/outputs/`
  keeps every zip that's been delivered, so a reset doesn't mean lost work.
- Caught two now-provably-false claims on the country page during this
  pass: a "coming soon" card claiming quizzes were "coming in Phase 3"
  (Phase 3 had already shipped, and the same page has a working Practice
  button) and a dead conditional for missing-content messaging that could
  never fire anymore now that every country has content. Both fixed.

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

- No Mystery Country clue-guessing game, Travel Route builder, or Map
  Puzzle — genuinely new interaction patterns better suited to their own
  focused pass rather than folded into an already-large Phase 4.
- Expeditions don't have a distinct "reward" beyond completion status
  (no unique badge per expedition yet) — the brief mentions "unlocks
  rewards" without specifying what; completion is tracked and visible,
  the reward layer itself is a natural next addition.
- No cross-device sync or leaderboards — everything is local-only by
  design (see Phase 5 for social features).
- Quiz distractors (the 3 wrong choices) are picked randomly, not by
  difficulty or region — a deliberate simplification for Phase 3; smarter
  distractor selection is a natural Phase 4 refinement.
- 20 very small territories (e.g. Vatican City) don't have border polygon
  data at this simplification level — they still appear as markers. 165 of
  194 countries have real border geometry.
- No live/volatile facts (current heads of state, GDP, government type)
  are included — those need a live data source, not a bundled static file.
