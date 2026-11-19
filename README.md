# Terra

A geography-learning app you explore instead of memorize: a gesture-driven
globe, a rich page for every one of the world's 194 countries, and
spaced-repetition quizzes that make it stick. Fully offline, no accounts, no
API keys.

Built with Expo (SDK 52), Expo Router, React Native SVG, Reanimated and
SQLite. Runs on iOS, Android and the web.

## Run it

```bash
npm install
npx expo start          # then press i / a, or scan the QR code with Expo Go
npx expo start --web    # or run it in a browser
```

If Expo Go complains about a native module, use a development build instead:
`npx expo prebuild` then `npx expo run:ios` / `npx expo run:android`.

### Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Unit tests (Jest via `jest-expo`) |
| `npm run check` | Typecheck + tests, the same gate CI runs |
| `npm run data` | Regenerate `src/data/countries.ts` and `worldBorders.json` (see *Data*) |

CI (`.github/workflows/ci.yml`) runs the typecheck, the tests and a web
export on every push to `main` and on every pull request.

## What's inside

### Explore
- **The globe** (`src/components/globe/Globe.tsx`): a hand-rolled
  orthographic projection, the same trick antique globes and atlases use.
  Drag to rotate, pinch to zoom, tap any country (or its marker, for
  microstates) to fly there. Three layers: **Political**, **Population
  density** and **Mastery**, where countries light up as you learn them.
- **Country pages** for all 194 countries: population (World Bank, 2025),
  area, density, coordinates, languages, currencies, calling code, internet
  domain, land neighbors you can hop between, religious composition (Pew
  Research Center), plus hand-written history, culture, nature, food and
  landmarks, and a "did you know" for each.
- **Search** by country or capital, accent-insensitive ("sao tome" finds
  São Tomé and Príncipe) and ranked by how well the name matches.

### Learn
- **7 quiz categories**, all generated from the data above, so there's no
  separate quiz content to maintain: Flags and Capitals (194 countries),
  Currencies (194), Landmarks (194), Food (190), Shapes (165, the countries
  with a usable outline at this map scale) and Neighbors (155; island
  nations have no land neighbors).
- **Fair questions.** Exactly one choice is ever right: distractors never
  repeat, never include a currency the country *also* uses, a dish or
  landmark it shares with a neighbor, or a flag that looks identical at emoji
  size (Chad and Romania, Indonesia and Monaco, and so on). Generic entries
  like "Rice" or "Fresh seafood" are never used as prompts. Two of the three
  wrong answers come from the same region, so you can't solve questions by
  elimination.
- **Spaced repetition** (`src/quiz/srs.ts`): a 6-box Leitner system
  (0, 1, 3, 7, 16 and 35-day intervals). Sessions serve overdue reviews
  first, then material you've never seen, and only then items that aren't
  due yet.
- **Mastery** (`src/quiz/mastery.ts`): per country, *how well* you know what
  you've tried × *how much* of the country you've explored, across the
  categories that actually apply to it. Eight levels, Explorer → Legend.
- **Daily challenges**: a Country of the Day (the same for everyone, no
  server needed), a 5-question Daily Quiz, and a 60-second Speed Round.
- **Practice anything**: a single country, a whole expedition, one category,
  or a mixed review.

### Progress
- **39 achievements**, each with a real, computable condition
  (`src/gamification/achievements.ts`). Tap a badge to see how to earn it.
- **10 expeditions**: curated journeys like Silk Road, Island Nations and
  Countries of the Equator, each with a fact-checked country list (enforced
  by tests) and its own practice mode.
- **Stats**: XP, daily and longest streaks, a 12-week activity heatmap,
  accuracy, and mastery per continent.
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
  hooks/, store/, utils/
scripts/prepare-data.mjs data generator
```

Pure logic (quiz generation, SRS, mastery, streaks, projection math,
search) is kept free of storage and UI, and that's where the tests live
(`src/**/__tests__`).

### Storage

On iOS and Android everything is stored in SQLite: one row per
(country, category) for spaced repetition, an append-only activity log for
streaks/XP/heatmap, and unlocked achievements. `expo-sqlite` has no web
build in SDK 52, so the web app uses drop-in `*.web.ts` versions of the same
stores backed by `localStorage` (Metro picks them automatically).

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
- **Religious composition**: Pew Research Center, *The Future of World Religions* (2020 estimates), via [`datasets/world-religion-projections`](https://github.com/datasets/world-religion-projections). **CC BY 4.0: attribution is required** wherever this data ships; the app shows it under every religion chart.

## Roadmap

1. ~~Foundation~~: architecture, design system, data, globe.
2. ~~Content~~: narrative content and religion data for all 194 countries.
3. ~~Learning engine~~: 7 quiz modes, spaced repetition, mastery.
4. ~~Gamification~~: achievements, stats, daily challenges, expeditions.
5. **Polish and reach** (in progress): accessibility (screen-reader labels
   done; dynamic type and reduced motion next), web support (done), then
   sync, social features, an AI tutor and a WebGL globe.

## Known gaps

- **Flags are emoji.** They look great on iOS, Android and macOS, but
  Windows browsers render them as two letters ("FR"), which breaks the flag
  quiz there. Bundled SVG flags would fix it.
- **No Mystery Country, Travel Route or Map Puzzle modes yet.** These are
  genuinely new interaction patterns, better suited to their own pass.
- **Expeditions have no unique rewards** beyond completion status.
- **Local-only.** No accounts, sync or leaderboards by design so far.
- **No live or volatile facts** (heads of state, GDP); those need a live
  data source rather than a bundled file.
- **Web storage is per-browser** (`localStorage`), so clearing site data
  resets progress.

## Changelog

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
