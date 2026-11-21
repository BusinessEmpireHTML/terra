import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COUNTRIES } from "../../data/countries";
import { useTheme } from "../../theme/ThemeProvider";
import { fontFamily } from "../../theme/tokens";
import { Globe, type GlobeGuess, type GlobeHighlight, type GlobeHit } from "../globe/Globe";
import { tapFeedback } from "../../utils/haptics";
import { compassName, distanceKm, initialBearing, LOCATE_MAX_TRIES, locatePoints, nearestPointOfCountry, pointToward } from "../../quiz/locateHints";
import type { AnswerMeta, AnswerResult, Question } from "../../quiz/types";

const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));
/** The label recorded when the player gives up — never a country name, so it always scores as a miss. */
export const SKIPPED_LABEL = "(skipped)";
const OCEAN_LABEL = "(open ocean)";
/** How far along the route the arrow aims (degrees of arc) — short, so it follows the true shortest path. */
const ARROW_LOOKAHEAD_DEG = 3;
/** Ocean taps this close to an earlier miss count as the same guess. */
const REPEAT_OCEAN_KM = 150;

interface Props {
  question: Question;
  answered: AnswerResult | null;
  onSelect: (label: string, meta: AnswerMeta) => void;
}

interface Guess {
  tappedId: string | null; // the country tapped (null = open ocean)
  at: [number, number];
  km: number; // to the nearest edge of the target country
  bearing: number; // compass bearing from the tap toward the target
  toward: [number, number] | null;
}

const formatKm = (km: number) => `${km < 10 ? "under 10" : Math.round(km).toLocaleString("en-US")} km`;

/**
 * "Find it on the globe": rotate the globe and tap where the country is.
 * Three tries per country; every miss says how far away it is and which way
 * (with an arrow on the globe), and points drop with each wrong try:
 * 3 / 2 / 1, or 0 once the tries run out. Tapping inside the outline — or on
 * the country's marker, which keeps small countries fair — counts.
 */
export function LocateCard({ question, answered, onSelect }: Props) {
  const { colors, type, space, radius } = useTheme();
  const { width, height } = useWindowDimensions();
  const size = Math.min(width - space.lg * 2, height * 0.46, 460);
  // The globe's view spans the full screen width (taller than the globe too),
  // so zooming in fills the space instead of stopping at a box.
  const viewHeight = Math.min(size + space.xl, height * 0.48);
  const target = COUNTRY_BY_ID.get(question.countryId)!;
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [note, setNote] = useState<string | null>(null);
  // Mirrors `guesses` so two quick taps can't both count as the same try.
  const guessesRef = useRef<Guess[]>([]);
  const doneRef = useRef(false);

  useEffect(() => {
    guessesRef.current = [];
    doneRef.current = false;
    setGuesses([]);
    setNote(null);
  }, [question.id]);

  const finish = useCallback(
    (label: string, attempts: number) => {
      doneRef.current = true;
      onSelect(label, { attempts });
    },
    [onSelect]
  );

  const handleTap = useCallback(
    (hit: GlobeHit) => {
      if (answered || doneRef.current || !hit.lonLat) return; // ignore taps outside the globe
      const tries = guessesRef.current;
      tapFeedback();

      if (hit.countryId === target.id || hit.nearbyIds.includes(target.id)) {
        finish(target.name.common, tries.length + 1);
        return;
      }
      // Tapping a country (or a patch of ocean) you already tried doesn't cost another try.
      const lonLat = hit.lonLat;
      const repeat = tries.find((g) =>
        hit.countryId ? g.tappedId === hit.countryId : g.tappedId === null && distanceKm(g.at, lonLat) < REPEAT_OCEAN_KM
      );
      if (repeat) {
        const where = hit.countryId ? COUNTRY_BY_ID.get(hit.countryId)?.name.common ?? "there" : "that spot";
        setNote(`You already tried ${where} — try somewhere else.`);
        return;
      }

      const nearest = nearestPointOfCountry(target.id, hit.lonLat);
      const guess: Guess = {
        tappedId: hit.countryId,
        at: hit.lonLat,
        km: nearest.km,
        bearing: initialBearing(hit.lonLat, nearest.point),
        toward: pointToward(hit.lonLat, nearest.point, ARROW_LOOKAHEAD_DEG),
      };
      const next = [...tries, guess];
      guessesRef.current = next;
      setGuesses(next);
      setNote(null);
      if (next.length >= LOCATE_MAX_TRIES) {
        const tapped = hit.countryId ? COUNTRY_BY_ID.get(hit.countryId)?.name.common : undefined;
        finish(tapped ?? OCEAN_LABEL, next.length);
      }
    },
    [answered, target, finish]
  );

  const skip = useCallback(() => {
    if (answered || doneRef.current) return;
    finish(SKIPPED_LABEL, guessesRef.current.length);
  }, [answered, finish]);

  const highlights = useMemo<Record<string, GlobeHighlight>>(() => {
    const marks: Record<string, GlobeHighlight> = {};
    for (const g of guesses) if (g.tappedId) marks[g.tappedId] = "wrong";
    if (answered) marks[target.id] = "correct";
    return marks;
  }, [answered, guesses, target.id]);

  const globeGuesses = useMemo<GlobeGuess[]>(
    // The arrow only helps while still searching; after the reveal the answer is lit up.
    () => guesses.map((g, i) => ({ at: g.at, toward: !answered && i === guesses.length - 1 ? g.toward : null })),
    [guesses, answered]
  );

  const triesLeft = LOCATE_MAX_TRIES - guesses.length;
  const last = guesses[guesses.length - 1];
  const lastName = last ? (last.tappedId ? COUNTRY_BY_ID.get(last.tappedId)?.name.common : "open ocean") : null;
  const points = answered?.points ?? locatePoints(Boolean(answered?.correct), answered?.attempts ?? guesses.length);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", marginBottom: space.xs, paddingHorizontal: space.lg }}>
        <Text style={[type.label, { color: colors.textMuted }]}>FIND IT ON THE GLOBE</Text>
        <Text accessibilityRole="header" style={[type.title, { color: colors.textPrimary, textAlign: "center", marginTop: 4 }]}>
          {target.name.common}
        </Text>
        <View
          accessible
          accessibilityLabel={answered ? `${points} points` : `${triesLeft} of ${LOCATE_MAX_TRIES} tries left, worth ${locatePoints(true, guesses.length + 1)} points`}
          style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}
        >
          {Array.from({ length: LOCATE_MAX_TRIES }, (_, i) => {
            const used = i < guesses.length;
            const wasHit = answered?.correct && i === guesses.length;
            return (
              <View
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: wasHit ? colors.accentSecondary : used ? colors.ember : answered ? "transparent" : colors.accent,
                  borderWidth: 1,
                  borderColor: wasHit ? colors.accentSecondary : used ? colors.ember : colors.accent,
                }}
              />
            );
          })}
          <Text style={[type.label, { color: colors.textMuted, marginLeft: 4 }]}>
            {answered ? `+${points} ${points === 1 ? "POINT" : "POINTS"}` : `WORTH ${locatePoints(true, guesses.length + 1)}`}
          </Text>
        </View>
      </View>

      <Globe
        size={size}
        width={width}
        height={viewHeight}
        highlights={highlights}
        guesses={globeGuesses}
        flyToCountryId={answered ? target.id : null}
        onTap={handleTap}
      />

      {!answered && last && (
        <View
          accessibilityLiveRegion="polite"
          style={{
            marginTop: space.sm,
            marginHorizontal: space.lg,
            padding: space.md,
            borderRadius: radius.md,
            backgroundColor: colors.surfaceRaised,
            borderLeftWidth: 3,
            borderLeftColor: colors.ember,
            flexDirection: "row",
            alignItems: "center",
            gap: space.md,
          }}
        >
          <View
            accessible
            accessibilityLabel={`Direction: ${compassName(last.bearing)}`}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* A compass arrow (north is up); the arrow on the globe shows the same route in place. */}
            <Ionicons name="arrow-up" size={24} color={colors.accentBright} style={{ transform: [{ rotate: `${last.bearing}deg` }] }} />
            <Text style={[type.label, { color: colors.textMuted, fontSize: 7, position: "absolute", top: 1 }]}>N</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.label, { color: colors.ember, marginBottom: 2 }]}>
              NOT QUITE · {triesLeft} {triesLeft === 1 ? "TRY" : "TRIES"} LEFT
            </Text>
            <Text style={[type.body, { color: colors.textPrimary }]}>
              That's {lastName}. {target.name.common} is {formatKm(last.km)} away to the {compassName(last.bearing)}.
            </Text>
          </View>
        </View>
      )}

      {!answered && note && (
        <Text style={[type.bodySmall, { color: colors.textMuted, textAlign: "center", marginTop: space.xs, paddingHorizontal: space.lg }]}>{note}</Text>
      )}

      {!answered && (
        <Pressable
          onPress={skip}
          accessibilityRole="button"
          accessibilityLabel={`Show me where ${target.name.common} is`}
          hitSlop={8}
          style={{ alignSelf: "center", marginTop: space.sm, paddingVertical: space.xs, paddingHorizontal: space.md }}
        >
          <Text style={[type.bodySmall, { color: colors.textMuted, textDecorationLine: "underline" }]}>I don't know — show me</Text>
        </Pressable>
      )}

      {answered && (
        <View
          accessibilityLiveRegion="polite"
          style={{
            marginTop: space.sm,
            marginHorizontal: space.lg,
            padding: space.md,
            borderRadius: radius.md,
            backgroundColor: colors.surfaceRaised,
            borderLeftWidth: 3,
            borderLeftColor: answered.correct ? colors.accentSecondary : colors.ember,
          }}
        >
          <Text style={[type.label, { color: answered.correct ? colors.accentSecondary : colors.ember, marginBottom: 4, fontFamily: fontFamily.mono }]}>
            {answered.correct
              ? `FOUND IT${(answered.attempts ?? 1) === 1 ? " FIRST TRY" : ` ON TRY ${answered.attempts}`} · +${points}`
              : `${answered.chosenLabel === SKIPPED_LABEL ? "SHOWN" : "OUT OF TRIES"} · 0 POINTS`}
          </Text>
          {!answered.correct && <Text style={[type.body, { color: colors.textPrimary, marginBottom: 4 }]}>Here it is.</Text>}
          <Text style={[type.body, { color: colors.textSecondary }]}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
}
