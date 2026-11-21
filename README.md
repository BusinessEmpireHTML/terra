# Terra

A geography-learning app you explore instead of memorize: a gesture-driven
globe, a rich page for every one of the world's 194 countries, and
spaced-repetition quizzes that make it stick. Fully offline, no accounts, no
API keys. In English, Spanish, French, German and Portuguese.

Built with Expo (SDK 58), Expo Router, React Native Skia, Reanimated 4,
Gesture Handler 3 and SQLite. Runs on iOS, Android and the web.

## Run it

```bash
npm install
npx expo start          # then press i / a, or scan the QR code with Expo Go
npx expo start --web    # or run it in a browser
```

Requires Node 22+. The project tracks the current Expo SDK, which is the one
the Expo Go app in the stores runs. If Expo Go ever complains about a native
module, use a development build instead: `npx expo prebuild` then
`npx expo run:ios` / `npx expo run:android`.

`npm install` also copies Skia's CanvasKit (`canvaskit.wasm`) into `public/`
for the web build (the `postinstall` script); it's git-ignored.

### Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Unit tests (Jest via `jest-expo`) |
| `npm run check` | Typecheck + tests, the same gate CI runs |
| `npm run data` | Regenerate `src/data/countries.ts` and `worldBorders.json` (see *Data*) |
| `npm run flags` | Regenerate `src/data/flags.ts` (the bundled SVG flags) |

CI (`.github/workflows/ci.yml`) runs the typecheck, the tests and a web
export on every push to `main` and on every pull request.

## What's inside

### Explore
- **The globe** (`src/components/globe/`): a hand-rolled orthographic
  projection, the same trick antique globes and atlases use, drawn with
  React Native Skia. Gestures update shared values on the UI thread and a
  worklet re-projects the whole map into a single `SkPicture` each frame, so
  dragging never re-renders React. The spot you grab stays under your finger,
  a flick keeps it spinning, and pinching zooms toward your fingers, up to
  12×, deep enough to tap Luxembourg. Tap any country (or its marker, for
  microstates) to fly there. Four layers, each with a plain-language legend:
  **Borders**, **Population** (how many people), **Density** (how crowded,
  explained without assuming anyone knows what a km² looks like) and
  **Mastery**, where countries light up as you learn them.
- **Country pages** for all 194 countries, with a crisp SVG flag and the numbers put in everyday
  terms ("about the size of Belgium", "more crowded than 93% of countries",
  "#77 of 194"): population (World Bank, 2025), area, density, coordinates, languages, currencies, calling code, internet
  domain, land neighbors you can hop between, religious composition (Pew
  Research Center), plus hand-written history, culture, nature, food and
  landmarks, and a "did you know" for each.
- **Search** by country or capital, accent-insensitive ("sao tome" finds
  São Tomé and Príncipe) and ranked by how well the name matches.

### Learn
- **8 quiz categories**, all generated from the data above, so there's no
  separate quiz content to maintain: Flags and Capitals (194 countries),
  Currencies (194), Landmarks (194), Food (190), Shapes and **Find it** (165,
  the countries with a usable outline at this map scale) and Neighbors (155;
  island nations have no land neighbors).
- **Find it on the globe**: no multiple choice. You rotate the globe and
  tap where the country is, with **three tries** per country. Each miss says
  how far away the country is (to its nearest edge) and which way, with a
  compass and an arrow on the globe pointing along the shortest route.
  Points drop with each wrong try: **3 / 2 / 1**, or 0 if you run out.
  Finds that took more than one try are graded "Hard" for FSRS, so they come
  back sooner. The reveal flies to the answer and says what the country
  borders. Tapping a country's marker always
  counts, which keeps small countries fair, and "I don't know — show me" is
  there for anyone who can't (or won't) use the gesture. Play 10 rounds, or
  **Endless**: countries keep coming (due reviews first) while it tracks how
  many you've found, your streak, and your best streak ever.
- **Fair questions.** Exactly one choice is ever right: distractors never
  repeat, never include a currency the country *also* uses, a dish or
  landmark it shares with a neighbor, or a flag that looks identical at emoji
  size (Chad and Romania, Indonesia and Monaco, and so on). Generic entries
  like "Rice" or "Fresh seafood" are never used as prompts. Two of the three
  wrong answers come from the same region, so you can't solve questions by
  elimination.
- **Spaced repetition with FSRS-6** (`src/quiz/fsrs.ts`, `srs.ts`): the
  modern memory model behind Anki's scheduler. Each (country, category) pair
  tracks *stability* (how long the memory lasts) and *difficulty*, and comes
  back when the predicted chance of recalling it drops to 90%: 2 days, then
  11, 46, 157… while answers stay right, and in 10 minutes after a miss.
  Same-day repeats don't inflate stability, so cramming can't fake mastery.
  The implementation is dependency-free and bit-identical to the reference
  (`ts-fsrs`) across 240,000 random reviews. Sessions serve overdue reviews
  first, then material you've never seen.
- **Mastery** (`src/quiz/mastery.ts`): per country, *how well* you know what
  you've tried × *how much* of the country you've explored, across the
  categories that actually apply to it. Eight levels, Explorer → Legend.
- **Daily challenges**: a Country of the Day, a 60-second Speed Round, and
  a numbered **Daily Quiz that's the same for everyone**: five questions
  seeded from the date (no server needed), one attempt per day, and a
  spoiler-free result to share:

  ```
  Terra Daily #323 🌍 4/5
  🟩🟩🟥🟩🟩
  🗿🤝🚩🏛️🔷
  ```
- **Challenge a friend**: play 10 Find it countries, then send a code (and a
  link) so a friend gets the *same* 10 and sees your score to beat. The code
  packs a random seed and your score into 8 characters (Crockford base32, so
  it survives being read aloud), so no server is needed. Enter a code from
  the Learn tab, or open the link.
- **Practice anything**: a single country, a whole expedition, one category,
  or a mixed review.

### Progress
- **40 achievements**, each with a real, computable condition
  (`src/gamification/achievements.ts`). Tap a badge to see how to earn it.
- **10 expeditions**: curated journeys like Silk Road, Island Nations and
  Countries of the Equator, each with a fact-checked country list (enforced
  by tests) and its own practice mode.
- **Stats**: XP, daily and longest streaks, a 12-week activity heatmap,
  accuracy, and mastery per continent.
- **Daily reminder** (iOS and Android): pick a time (or Off) in Profile. Terra
  schedules local notifications a few days ahead, skips days you've already
  played, and on the last day a streak can be saved says so ("Keep your
  5-day streak alive"). Tapping one opens the Learn tab. Nothing leaves the
  device.
- **Languages**: English, Spanish, French, German and Portuguese, following
  the phone's language or picked in Profile. All UI text, quiz questions,
  country, region and continent names, achievements, expeditions and numbers
  (decimal commas, "1,5 Mrd.") are translated; search matches country names
  in the chosen language as well as English. Hand-written country stories,
  fun facts and language/currency names are still English (the app says so).
- **Accessibility**: screen-reader labels throughout, text that follows the
  phone's text-size setting (dense badges and pills cap their scaling so
  nothing overflows), and **reduced motion**: with the system setting on,
  the globe jumps instead of flying and stops instead of gliding, and
  buttons don't bounce.
- **Appearance**: System, Light or Dark, remembered between launches.

## Project structure

```
app/                     Expo Router routes (thin wrappers around screens)
src/
  components/            globe, quiz, country, gamification, search, ui primitives
  screens/               one file per screen
  quiz/                  question generators, SRS, mastery, session builder, answer recorder
  gamification/          achievements, expeditions, streaks
  services/              persistence (SQLite on native, *.web.ts localStorage on web)
  data/                  generated country data, border geometry, hand-written content
  theme/                 design tokens and theme provider
  i18n/                  translations: en.ts is the source of truth, es/fr/de/pt are typed against it
  hooks/, store/, utils/
scripts/prepare-data.mjs data generator
scripts/prepare-flags.mjs bundles the SVG flags
```

Pure logic (quiz generation, SRS, mastery, streaks, projection math,
search) is kept free of storage and UI, and that's where the tests live
(`src/**/__tests__`).

### Storage

On iOS and Android everything is stored in SQLite: one row per
(country, category) for spaced repetition (with an FSRS migration via
`PRAGMA user_version`; older Leitner records are converted on their next
answer, not reset), an append-only activity log for streaks/XP/heatmap, and
unlocked achievements. The web app uses drop-in `*.web.ts` versions of the
same stores backed by `localStorage` (Metro picks them automatically).
`expo-sqlite` does run on the web now, but it needs `SharedArrayBuffer`,
which means cross-origin-isolation headers that many static hosts can't
set, so the lighter fallback stays.

## Data

`src/data/countries.ts` and `src/data/worldBorders.json` are **generated**,
so don't hand-edit them. To regenerate:

```bash
npm install world-countries@5.1.0 world-atlas@2.0.2 topojson-client@3 --no-save
npm run data
```

The upstream versions are pinned so the output is reproducible. Places where
the upstream data is stale or wrong for quiz purposes are fixed in one
documented table (`DATA_CORRECTIONS` in `scripts/prepare-data.mjs`), each
with its reason. Examples: Bulgaria's switch to the euro, Zimbabwe's ZiG,
Cuba's abolished convertible peso, and Sri Lanka wrongly listed as sharing a
land border with India. Neighbor lists only reference countries that exist in
the app (no Western Sahara, Gibraltar or placeholder codes).
`src/data/countryContent.ts` (history, culture, nature, food, landmarks) is
hand-written and never touched by the generator.

### Sources and attribution

- **Country attributes**: [`world-countries`](https://github.com/mledoze/countries) (ODbL).
- **Border geometry**: Natural Earth via [`world-atlas`](https://github.com/topojson/world-atlas) (public domain), simplified to 1:110m. 165 of the 194 countries have outlines at this scale; the 29 smallest (Vatican City, Monaco, Tuvalu and others) appear as markers.
- **Population**: World Bank, *Population, total* (SP.POP.TOTL), via [`datasets/population`](https://github.com/datasets/population) (ODC-PDDL), 2025 figures; Vatican City uses the Holy See's 2024 estimate, since the World Bank doesn't cover it.
- **Flags**: [`country-flag-icons`](https://gitlab.com/catamphetamine/country-flag-icons) (MIT), bundled as SVG.
- **Country names in other languages**: the translations shipped with `world-countries` (ODbL).
- **Religious composition**: Pew Research Center, *The Future of World Religions* (2020 estimates), via [`datasets/world-religion-projections`](https://github.com/datasets/world-religion-projections). **CC BY 4.0: attribution is required** wherever this data ships; the app shows it under every religion chart.

## Roadmap

1. ~~Foundation~~: architecture, design system, data, globe.
2. ~~Content~~: narrative content and religion data for all 194 countries.
3. ~~Learning engine~~: 7 quiz modes, spaced repetition, mastery.
4. ~~Gamification~~: achievements, stats, daily challenges, expeditions.
5. **Polish and reach** (in progress): screen-reader labels, web support,
   a GPU-rendered globe, FSRS scheduling, Find it, a shareable Daily, SVG
   flags, five languages, reminders, friend challenges, dynamic type and
   reduced motion are done. Next: a home-screen widget (needs a development
   build), translated country stories, then sync, an AI tutor, and a
   textured 3D globe.

## Known gaps

- **No home-screen widget yet.** `expo-widgets` supports one on iOS and
  Android, but it needs a development build (it can't run in Expo Go) and,
  for iOS, an Apple developer account to sign the widget extension.
- **Country stories are English-only.** History, culture, food, landmarks,
  fun facts and language/currency names haven't been translated yet.
- **Challenges compare two scores**, not a leaderboard: there's no server.
- **Reminders are native-only**: browsers get no notifications.
- **No Mystery Country, Travel Route or Map Puzzle modes yet.** These are
  genuinely new interaction patterns, better suited to their own pass.
- **Expeditions have no unique rewards** beyond completion status.
- **Local-only.** No accounts, sync or leaderboards by design so far.
- **No live or volatile facts** (heads of state, GDP); those need a live
  data source rather than a bundled file.
- **Web storage is per-browser** (`localStorage`), so clearing site data
  resets progress.
- **The web build downloads CanvasKit** (~8 MB of WebAssembly, ~3 MB
  compressed) the first time the globe is shown. Native apps don't.

## Changelog

### Players and reach (November 2026)

- **SVG flags** everywhere instead of emoji, so the flag quiz works on
  Windows browsers too.
- **Five languages** (English, Spanish, French, German, Portuguese) with a
  language setting; a test fails if any language misses a key or uses a
  placeholder the English text doesn't provide.
- **Daily reminders** with a streak warning on the day it matters.
- **Challenge a friend** in Find it, via a short code or link.
- **Reduced motion** and **text-size** support.
- Expedition descriptions on the Expeditions list no longer cut off.

### Feedback round (November 2026)

- Quick facts never truncate: long values wrap and take the full row, and
  area, density and population get an everyday comparison.
- Globe: zoom up to 12× (was 2.6×) toward your fingers; the grabbed point
  stays under your finger; flicks glide; edges fade instead of ending in a
  box; far-side and off-screen countries are skipped each frame (about 40%
  less work at normal zoom, about 70% when zoomed in) and markers are batched.
- The old "Population" layer actually showed density, which is why China and
  India looked different. There are now separate Population and Density
  layers, each explained in plain words.
- Endless mode for Find it.
- Find it gives three tries per country, with distance-and-direction hints
  after each miss and 3/2/1/0 points; re-tapping a country or spot you
  already tried doesn't cost a try.

### Expo SDK 58, Skia globe, FSRS, Find it, shareable Daily (November 2026)

- **Upgraded Expo SDK 52 → 58** (React 19.3, React Native 0.88, Reanimated
  4, Gesture Handler 3, TypeScript 6), so the project runs in today's Expo
  Go. Notable migration fixes: `app/+html.tsx` must now render
  `useServerDocumentContext()`'s nodes (otherwise web pages ship with no
  scripts), and the splash screen moved to the `expo-splash-screen` plugin.
- **Globe rendered with Skia** on the UI thread (see *Explore*).
- **Fixed: the globe was a mirror image**, with east drawn on the left
  (Madagascar west of Africa), since the very first version, and dragging
  down tipped it up. Regression tests now pin the orientation.
- **FSRS-6 scheduling** replaces the Leitner boxes (see *Learn*).
- **Find it on the globe**, a new quiz category and a Navigator achievement.
- **Daily Quiz is the same for everyone**, with a shareable result.
- 115 unit tests.

### Review pass (November 2026)

**Bugs fixed**
- Population was missing for all 194 countries (the source dataset has no
  population field), so the Population globe layer was blank and every
  country page showed "—". Population now comes from the World Bank.
- Neighbor questions could crash a quiz session, leaving it stuck on "Building
  your session…": several countries listed territories (Western Sahara, Hong
  Kong, Kosovo's placeholder code and others) as neighbors.
- Quiz questions could have duplicate choices (e.g. "Euro" twice) or two
  correct answers (a shared currency, a dish or landmark found in two
  countries). Zimbabwe's "currency" was the Botswana pula.
- Island nations and microstates could never reach Legend status, because
  mastery assumed all 7 categories applied to every country.
- The globe drew the hidden half of countries near the horizon mirrored
  across its visible face, and every meridian had a stray chord across it.
  Tapping now works anywhere inside a country, not only on its marker.
- Shape quiz silhouettes of Russia and Fiji were squashed (they straddle
  the 180° meridian), and high-latitude countries were stretched.
- Achievements earned on the last question of a quiz weren't detected until
  the next quiz (the final answer was still being saved).
- The Speed Round timer could be stretched by a throttled JS timer, and
  double taps could score one question twice.
- Facts corrected: the Island Nations expedition included three countries
  that share land borders; Countries of the Equator was missing Gabon,
  Somalia and São Tomé and Príncipe; South America was missing Guyana and
  Suriname; "First Flag" unlocked on any correct answer.
- The web build showed a blank page (no web support in `expo-sqlite`).
- Smaller fixes: Profile labeled the 12-week heatmap "30-day activity"; the
  continent chart overflowed phones narrower than ~400pt; back/close buttons
  did nothing on deep links; the country header ignored the notch and Dynamic
  Island; bold text set via `fontWeight` fell back to the system font on
  Android; search ignored accents; corrupted saved data could crash the Learn
  tab; a hung storage read could keep the splash screen up forever; the theme
  choice wasn't saved (and had no UI).

**Added**: real app icon and splash screen, Appearance setting, expedition
practice, achievement details, XP earned per session, density, coordinates
and landlocked info on country pages, heatmap legend, screen-reader labels
throughout, 84 unit tests and CI.
