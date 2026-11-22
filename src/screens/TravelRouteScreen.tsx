import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, PrimaryButton } from "../components/ui/Primitives";
import { Flag } from "../components/ui/Flag";
import { Globe, type GlobeHighlight, type GlobeHit } from "../components/globe/Globe";
import { RewardsCard } from "../components/gamification/RewardsCard";
import { useTheme } from "../theme/ThemeProvider";
import { DENSE_TEXT_MAX_SCALE, fontFamily } from "../theme/tokens";
import { useSafeBack } from "../hooks/useSafeBack";
import { useT } from "../i18n/useT";
import { COUNTRIES } from "../data/countries";
import { compassName } from "../quiz/locateHints";
import {
  buildRouteRound,
  currentCountry,
  giveUp,
  move,
  movesMade,
  neighborsOf,
  routeHint,
  shortestPath,
  startRoute,
  type RouteState,
} from "../quiz/travelRoute";
import { ROUTE_MAX_POINTS } from "../gamification/gameScoring";
import { recordGameResult, whenAnswersSaved } from "../quiz/answerRecorder";
import { checkForRewards } from "../gamification/checkAchievements";
import { tapFeedback } from "../utils/haptics";
import type { Achievement, Expedition } from "../gamification/types";

const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));

/**
 * Travel Route: cross land borders from one country to another in as few
 * moves as you can. Five routes a round, each a little longer; par is the
 * shortest possible route. Move by tapping a neighboring country on the
 * globe or one of the chips below it.
 */
export default function TravelRouteScreen() {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
  const goBack = useSafeBack();
  const { width, height } = useWindowDimensions();
  const globeSize = Math.min(width - space.lg * 2, height * 0.4, 440);
  const globeHeight = Math.min(globeSize + space.lg, height * 0.42);

  const [round, setRound] = useState(() => buildRouteRound());
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<RouteState>(() => startRoute(round[0]));
  const [scores, setScores] = useState<number[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [rewards, setRewards] = useState<{ achievements: Achievement[]; stamps: Expedition[] }>({ achievements: [], stamps: [] });

  const { route } = state;
  const here = currentCountry(state);
  const playing = state.status === "playing";
  const name = (id: string) => {
    const c = COUNTRY_BY_ID.get(id);
    return c ? t.country(c) : id;
  };
  const neighbors = useMemo(
    () => [...neighborsOf(here)].sort((a, b) => name(a).localeCompare(name(b), t.lang)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [here, t.lang]
  );
  const bestPath = useMemo(() => (playing ? null : shortestPath(route.start, route.target)), [playing, route]);

  const highlights = useMemo(() => {
    const h: Record<string, GlobeHighlight> = {};
    if (playing) {
      for (const id of neighbors) h[id] = "option";
      for (const id of state.path) h[id] = "route";
      h[route.target] = "target";
      h[here] = "correct";
    } else {
      for (const id of state.status === "gaveUp" && bestPath ? bestPath : state.path) h[id] = "route";
      h[route.start] = "correct";
      h[route.target] = "target";
    }
    return h;
  }, [playing, neighbors, state.path, state.status, bestPath, route, here]);

  const advance = useCallback(
    (next: string) => {
      if (!playing) return;
      tapFeedback();
      const after = move(state, next);
      if (after === state) return;
      setNote(null);
      setState(after);
      if (after.status === "arrived") {
        setScores((s) => [...s, after.points]);
        recordGameResult("route", route.target, { finished: true, points: after.points }).catch(() => {});
      }
    },
    [playing, state, route.target]
  );

  const onGlobeTap = useCallback(
    (hit: GlobeHit) => {
      if (!playing || !hit.lonLat) return;
      const options = neighborsOf(here);
      const picked = hit.countryId && options.includes(hit.countryId) ? hit.countryId : hit.nearbyIds.find((id) => options.includes(id));
      if (picked) return advance(picked);
      if (hit.countryId === here) return setNote(t("route.alreadyHere", { country: name(here) }));
      if (hit.countryId) setNote(t("route.notNeighbor", { country: name(hit.countryId), current: name(here) }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playing, here, advance, t]
  );

  const surrender = () => {
    setState((s) => giveUp(s));
    setScores((s) => [...s, 0]);
    recordGameResult("route", route.target, { finished: false, points: 0 }).catch(() => {});
  };

  const next = () => {
    if (index + 1 >= round.length) {
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setState(startRoute(round[index + 1]));
    setNote(null);
  };

  const playAgain = () => {
    const fresh = buildRouteRound();
    setRound(fresh);
    setIndex(0);
    setState(startRoute(fresh[0]));
    setScores([]);
    setNote(null);
    setFinished(false);
    setRewards({ achievements: [], stamps: [] });
  };

  useEffect(() => {
    if (!finished) return;
    let cancelled = false;
    whenAnswersSaved()
      .then(() => checkForRewards())
      .then((r) => !cancelled && setRewards(r))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [finished]);

  const total = scores.reduce((a, b) => a + b, 0);

  if (finished) {
    const atPar = scores.filter((s) => s === ROUTE_MAX_POINTS).length;
    return (
      <GradientBackground>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center", padding: space.xl }}>
            <Text style={{ fontSize: 56 }} accessible={false}>
              🧳
            </Text>
            <Text style={[type.hero, { color: colors.textPrimary, marginTop: space.md, fontSize: 32, textAlign: "center" }]}>
              {t("route.resultsTitle", { points: total, max: round.length * ROUTE_MAX_POINTS })}
            </Text>
            <Text style={[type.body, { color: colors.textMuted, marginTop: 4, textAlign: "center" }]}>
              {t("route.resultsLine", { par: atPar, total: round.length })}
            </Text>
            <RewardsCard achievements={rewards.achievements} stamps={rewards.stamps} />
            <PrimaryButton label={t("route.playAgain")} onPress={playAgain} style={{ marginTop: space.xl, width: "100%" }} />
            <Pressable onPress={goBack} accessibilityRole="button" style={{ marginTop: space.md, padding: space.sm }}>
              <Text style={[type.body, { color: colors.textMuted }]}>{t("common.done")}</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const hint = playing && movesMade(state) > 0 ? routeHint(here, route.target) : null;
  const status = note
    ? note
    : !playing
      ? null
      : hint
        ? t("route.hint", {
            target: name(route.target),
            distance: hint.km < 10 ? t("locate.under10km") : t("locate.km", { km: Math.round(hint.km) }),
            direction: t(`compass.${compassName(hint.bearing)}`),
          })
        : t("route.start", { country: name(here), target: name(route.target) });

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm }}>
          <Pressable onPress={goBack} hitSlop={12} accessibilityRole="button" accessibilityLabel={t("route.quit")}>
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
          <Text
            maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE}
            style={[type.label, { color: colors.textMuted, flex: 1, textAlign: "center" }]}
          >
            {`${t("route.title")} · ${index + 1}/${round.length}`.toUpperCase()}
          </Text>
          <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.data, { color: colors.accent, minWidth: 26, textAlign: "right" }]}>
            {total}
          </Text>
        </View>

        {/* From → to, with par and moves so far. */}
        <View
          accessible
          accessibilityLabel={t("route.a11ySummary", { from: name(route.start), to: name(route.target), par: route.par, moves: movesMade(state) })}
          style={{ marginHorizontal: space.lg, marginTop: space.sm, padding: space.md, borderRadius: radius.md, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
            <Flag cca2={COUNTRY_BY_ID.get(route.start)?.cca2 ?? ""} width={24} />
            <Text style={[type.body, { color: colors.textPrimary, fontFamily: fontFamily.bodySemiBold }]}>{name(route.start)}</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
            <Flag cca2={COUNTRY_BY_ID.get(route.target)?.cca2 ?? ""} width={24} />
            <Text style={[type.body, { color: colors.textPrimary, fontFamily: fontFamily.bodySemiBold }]}>{name(route.target)}</Text>
          </View>
          <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, marginTop: 6 }]}>
            {`${t("route.par", { par: route.par })} · ${t("route.moves", { moves: movesMade(state) })}`.toUpperCase()}
          </Text>
          {/* The trail so far, as flags. */}
          {state.path.length > 1 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 4, marginTop: 6 }}>
              {state.path.map((id, i) => (
                <React.Fragment key={`${id}-${i}`}>
                  {i > 0 && <Ionicons name="chevron-forward" size={10} color={colors.textMuted} />}
                  <Flag cca2={COUNTRY_BY_ID.get(id)?.cca2 ?? ""} width={18} />
                </React.Fragment>
              ))}
            </View>
          )}
        </View>

        <View style={{ alignItems: "center", marginTop: space.xs }}>
          <Globe
            size={globeSize}
            width={width}
            height={globeHeight}
            highlights={highlights}
            flyToCountryId={playing ? here : route.target}
            onTap={onGlobeTap}
          />
        </View>

        {status && (
          <Text accessibilityLiveRegion="polite" style={[type.bodySmall, { color: colors.textSecondary, textAlign: "center", marginHorizontal: space.lg }]}>
            {status}
          </Text>
        )}

        {playing ? (
          <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: space.md }}>
            <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, marginHorizontal: space.lg, marginBottom: 6 }]}>
              {t("route.neighborsOf", { country: name(here) }).toUpperCase()}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.lg, alignItems: "center" }}
            >
              {neighbors.map((id) => {
                const visited = state.path.includes(id);
                return (
                  <Pressable
                    key={id}
                    onPress={() => advance(id)}
                    accessibilityRole="button"
                    accessibilityLabel={t("route.a11yMove", { country: name(id) })}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: radius.pill,
                      backgroundColor: id === route.target ? colors.ember : colors.surfaceRaised,
                      borderWidth: 1,
                      borderColor: visited ? colors.accent : colors.border,
                    }}
                  >
                    <Flag cca2={COUNTRY_BY_ID.get(id)?.cca2 ?? ""} width={20} />
                    <Text style={[type.bodySmall, { color: id === route.target ? "#fff" : colors.textPrimary }]}>{name(id)}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable onPress={surrender} accessibilityRole="button" style={{ alignSelf: "center", marginTop: space.md, padding: space.xs }}>
              <Text style={[type.bodySmall, { color: colors.textMuted, textDecorationLine: "underline" }]}>{t("route.giveUp")}</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.lg }}>
            <View accessibilityLiveRegion="polite" style={{ alignItems: "center", marginTop: space.sm }}>
              <Text style={[type.title, { color: colors.textPrimary, fontSize: 22, textAlign: "center" }]}>
                {state.status === "arrived"
                  ? state.points === ROUTE_MAX_POINTS
                    ? t("route.arrivedPar")
                    : t("route.arrived", { moves: movesMade(state) })
                  : t("route.gaveUpTitle")}
              </Text>
              <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.accent, marginTop: 4 }]}>
                {(state.status === "arrived"
                  ? t("route.parLine", { par: route.par, points: state.points })
                  : t("route.gaveUpLine", { par: route.par })
                ).toUpperCase()}
              </Text>
              {bestPath && (state.status === "gaveUp" || state.points < ROUTE_MAX_POINTS) && (
                <Text style={[type.bodySmall, { color: colors.textSecondary, marginTop: space.sm, textAlign: "center" }]}>
                  {t("route.shortest")}: {bestPath.map(name).join(" → ")}
                </Text>
              )}
            </View>
            <PrimaryButton
              label={index + 1 >= round.length ? t("quiz.seeResults") : t("route.next")}
              onPress={next}
              style={{ marginTop: space.md }}
            />
          </ScrollView>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}
