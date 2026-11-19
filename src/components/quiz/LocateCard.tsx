import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { COUNTRIES } from "../../data/countries";
import { useTheme } from "../../theme/ThemeProvider";
import { fontFamily } from "../../theme/tokens";
import { Globe, type GlobeHighlight, type GlobeHit } from "../globe/Globe";
import { angularDistanceDeg } from "../../utils/geo";
import { tapFeedback } from "../../utils/haptics";
import type { AnswerResult, Question } from "../../quiz/types";

const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));
const KM_PER_DEGREE = 111.195; // mean Earth radius × π / 180
/** The label recorded when the player gives up — never a country name, so it always scores as a miss. */
export const SKIPPED_LABEL = "(skipped)";
const OCEAN_LABEL = "(open ocean)";

interface Props {
  question: Question;
  answered: AnswerResult | null;
  onSelect: (label: string) => void;
}

interface TapResult {
  tappedId: string | null; // the country actually tapped (null = ocean or skipped)
  distanceKm: number | null;
}

/**
 * "Find it on the globe": the player rotates the globe and taps where they
 * think the country is. Tapping inside its outline — or on its marker, which
 * keeps small countries fair — counts as correct.
 */
export function LocateCard({ question, answered, onSelect }: Props) {
  const { colors, type, space, radius } = useTheme();
  const { width, height } = useWindowDimensions();
  const size = Math.min(width - space.lg * 2, height * 0.46, 460);
  const target = COUNTRY_BY_ID.get(question.countryId)!;
  const [tap, setTap] = useState<TapResult | null>(null);

  useEffect(() => setTap(null), [question.id]);

  const handleTap = useCallback(
    (hit: GlobeHit) => {
      if (answered || !hit.lonLat) return; // ignore taps outside the globe
      const correct = hit.countryId === target.id || hit.nearbyIds.includes(target.id);
      const [lat, lon] = target.latlng;
      setTap({
        tappedId: correct ? target.id : hit.countryId,
        distanceKm: correct ? null : Math.round(angularDistanceDeg(hit.lonLat, [lon, lat]) * KM_PER_DEGREE),
      });
      tapFeedback();
      const tapped = hit.countryId ? COUNTRY_BY_ID.get(hit.countryId)?.name.common : undefined;
      onSelect(correct ? target.name.common : tapped ?? OCEAN_LABEL);
    },
    [answered, target, onSelect]
  );

  const skip = useCallback(() => {
    if (answered) return;
    setTap({ tappedId: null, distanceKm: null });
    onSelect(SKIPPED_LABEL);
  }, [answered, onSelect]);

  const highlights = useMemo<Record<string, GlobeHighlight> | undefined>(() => {
    if (!answered) return undefined;
    const marks: Record<string, GlobeHighlight> = { [target.id]: "correct" };
    if (tap?.tappedId && tap.tappedId !== target.id) marks[tap.tappedId] = "wrong";
    return marks;
  }, [answered, tap, target.id]);

  const feedback = (() => {
    if (!answered) return null;
    if (answered.correct) return null;
    if (answered.chosenLabel === SKIPPED_LABEL) return `Here it is.`;
    const where = answered.chosenLabel === OCEAN_LABEL ? "open ocean" : answered.chosenLabel;
    return tap?.distanceKm != null ? `You tapped ${where}, about ${tap.distanceKm.toLocaleString("en-US")} km away.` : `You tapped ${where}.`;
  })();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", marginBottom: space.sm }}>
        <Text style={[type.label, { color: colors.textMuted }]}>FIND IT ON THE GLOBE</Text>
        <Text accessibilityRole="header" style={[type.title, { color: colors.textPrimary, textAlign: "center", marginTop: 4 }]}>
          {target.name.common}
        </Text>
        {!answered && (
          <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 2, textAlign: "center" }]}>
            Drag to rotate, pinch to zoom, then tap where it is.
          </Text>
        )}
      </View>

      <View style={{ alignItems: "center" }}>
        <Globe size={size} highlights={highlights} flyToCountryId={answered ? target.id : null} onTap={handleTap} />
      </View>

      {!answered && (
        <Pressable
          onPress={skip}
          accessibilityRole="button"
          accessibilityLabel={`Show me where ${target.name.common} is`}
          hitSlop={8}
          style={{ alignSelf: "center", marginTop: space.md, paddingVertical: space.xs, paddingHorizontal: space.md }}
        >
          <Text style={[type.bodySmall, { color: colors.textMuted, textDecorationLine: "underline" }]}>I don't know — show me</Text>
        </Pressable>
      )}

      {answered && (
        <View
          accessibilityLiveRegion="polite"
          style={{
            marginTop: space.md,
            padding: space.md,
            borderRadius: radius.md,
            backgroundColor: colors.surfaceRaised,
            borderLeftWidth: 3,
            borderLeftColor: answered.correct ? colors.accentSecondary : colors.ember,
          }}
        >
          <Text style={[type.label, { color: answered.correct ? colors.accentSecondary : colors.ember, marginBottom: 4, fontFamily: fontFamily.mono }]}>
            {answered.correct ? "FOUND IT" : "NOT QUITE"}
          </Text>
          {feedback && <Text style={[type.body, { color: colors.textPrimary, marginBottom: 4 }]}>{feedback}</Text>}
          <Text style={[type.body, { color: colors.textSecondary }]}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
}
