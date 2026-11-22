import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, PrimaryButton } from "../components/ui/Primitives";
import { Flag } from "../components/ui/Flag";
import { RewardsCard } from "../components/gamification/RewardsCard";
import { useMidnightCountdown } from "../components/quiz/DailyResultCard";
import { useTheme } from "../theme/ThemeProvider";
import { DENSE_TEXT_MAX_SCALE, fontFamily } from "../theme/tokens";
import { useSafeBack } from "../hooks/useSafeBack";
import { useT } from "../i18n/useT";
import { COUNTRIES } from "../data/countries";
import { searchCountries } from "../utils/search";
import { shareText, type ShareOutcome } from "../utils/share";
import { compassName } from "../quiz/locateHints";
import { dailyNumber } from "../quiz/daily";
import { localDateString } from "../gamification/streaks";
import {
  CLUE_COUNT,
  dailyMysteryId,
  giveUpMystery,
  guessMystery,
  mysteryClues,
  mysteryHint,
  mysteryShareText,
  randomMysteryId,
  revealClue,
  startMystery,
  type MysteryState,
} from "../quiz/mystery";
import { mysteryPoints } from "../gamification/gameScoring";
import { mysteryStore } from "../services/mysteryStore";
import { recordGameResult, whenAnswersSaved } from "../quiz/answerRecorder";
import { checkForRewards } from "../gamification/checkAchievements";
import { tapFeedback } from "../utils/haptics";
import type { Achievement, Expedition } from "../gamification/types";

const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));
const MAX_SUGGESTIONS = 5;

/**
 * Mystery Country. "daily": one mystery a day, the same for everyone, saved
 * as you go and shareable when done. "practice": as many as you like.
 */
export default function MysteryScreen({ mode }: { mode: "daily" | "practice" }) {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
  const router = useRouter();
  const goBack = useSafeBack();
  const countdown = useMidnightCountdown();
  const [date] = useState(() => localDateString());
  const daily = mode === "daily";

  const [state, setState] = useState<MysteryState | null>(() => (daily ? null : startMystery(randomMysteryId())));
  const [query, setQuery] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [shareOutcome, setShareOutcome] = useState<ShareOutcome | null>(null);
  const [rewards, setRewards] = useState<{ achievements: Achievement[]; stamps: Expedition[] }>({ achievements: [], stamps: [] });
  const seen = useRef(new Set<string>());
  const loggedRef = useRef<string | null>(null);

  // Daily: resume today's game (or its result) if there is one.
  useEffect(() => {
    if (!daily) return;
    let cancelled = false;
    const id = dailyMysteryId(date);
    mysteryStore
      .load(date)
      .then((saved) => {
        if (cancelled) return;
        const s = saved?.countryId === id ? saved : startMystery(id);
        // A finished daily was already logged when it ended; don't log it again.
        if (s.status !== "playing") loggedRef.current = `${date}:${s.countryId}`;
        setState(s);
      })
      .catch(() => !cancelled && setState(startMystery(id)));
    return () => {
      cancelled = true;
    };
  }, [daily, date]);

  const update = useCallback(
    (next: MysteryState) => {
      setState(next);
      if (daily) mysteryStore.save(date, next).catch(() => {});
    },
    [daily, date]
  );

  // Log the result once per mystery, then check for rewards.
  useEffect(() => {
    if (!state || state.status === "playing") return;
    const key = `${daily ? date : "practice"}:${state.countryId}`;
    if (loggedRef.current === key) return;
    loggedRef.current = key;
    if (!daily) setSessionPoints((p) => p + state.points);
    let cancelled = false;
    recordGameResult("mystery", state.countryId, { finished: state.status === "solved", points: state.points })
      .then(() => whenAnswersSaved())
      .then(() => checkForRewards())
      .then((r) => !cancelled && setRewards(r))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [state, daily, date]);

  const clues = useMemo(() => (state ? mysteryClues(state.countryId, t.lang) : []), [state?.countryId, t.lang]);
  const suggestions = useMemo(() => {
    if (!state || state.status !== "playing" || query.trim().length < 1) return [];
    return searchCountries(COUNTRIES, query, t.lang).slice(0, MAX_SUGGESTIONS);
  }, [query, state, t.lang]);

  if (!state) {
    return (
      <GradientBackground>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={[type.body, { color: colors.textMuted }]}>{t("common.loading")}</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const answer = COUNTRY_BY_ID.get(state.countryId)!;
  const playing = state.status === "playing";
  const name = (id: string) => {
    const c = COUNTRY_BY_ID.get(id);
    return c ? t.country(c) : id;
  };

  const guess = (id: string) => {
    tapFeedback();
    setQuery("");
    if (state.wrong.includes(id)) {
      setNote(t("mystery.alreadyGuessed", { country: name(id) }));
      return;
    }
    const next = guessMystery(state, id);
    if (next.status === "playing") {
      const hint = mysteryHint(id, state.countryId);
      setNote(
        t("mystery.wrongHint", {
          country: name(id),
          distance: hint.km < 10 ? t("locate.under10km") : t("locate.km", { km: Math.round(hint.km) }),
          direction: t(`compass.${compassName(hint.bearing)}`),
        })
      );
    } else {
      setNote(null);
    }
    update(next);
  };

  const nextMystery = () => {
    seen.current.add(state.countryId);
    setState(startMystery(randomMysteryId(Math.random, new Set([...seen.current, dailyMysteryId(date)]))));
    setNote(null);
    setQuery("");
    setRewards({ achievements: [], stamps: [] });
  };

  const share = async () => setShareOutcome(await shareText(mysteryShareText(date, state, t.lang)));

  const title = daily ? t("mystery.dailyTitle", { number: dailyNumber(date) }) : t("mystery.practiceTitle");
  const worth = mysteryPoints(state.cluesShown);

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm }}>
          <Pressable onPress={goBack} hitSlop={12} accessibilityRole="button" accessibilityLabel={t("mystery.quit")}>
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
          <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, flex: 1, textAlign: "center" }]}>
            {title.toUpperCase()}
          </Text>
          <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.accent, minWidth: 26, textAlign: "right" }]}>
            {playing ? t("locate.worth", { points: worth }).toUpperCase() : daily ? "" : String(sessionPoints)}
          </Text>
        </View>

        {playing && (
          <View style={{ paddingHorizontal: space.lg, marginTop: space.md, zIndex: 2 }}>
            <TextInput
              value={query}
              onChangeText={(v) => {
                setQuery(v);
                setNote(null);
              }}
              placeholder={t("mystery.guessPlaceholder")}
              placeholderTextColor={colors.textMuted}
              accessibilityLabel={t("mystery.guessLabel")}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={() => suggestions[0] && guess(suggestions[0].id)}
              style={[
                type.body,
                {
                  color: colors.textPrimary,
                  paddingVertical: space.sm + 2,
                  paddingHorizontal: space.md,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.accent,
                  backgroundColor: colors.surfaceRaised,
                },
              ]}
            />
            {suggestions.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: "100%",
                  left: space.lg,
                  right: space.lg,
                  marginTop: 4,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surfaceRaised,
                  overflow: "hidden",
                }}
              >
                {suggestions.map((c) => (
                  <Pressable
                    key={c.id}
                    onPress={() => guess(c.id)}
                    accessibilityRole="button"
                    accessibilityLabel={t.country(c)}
                    style={{ flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: 10, paddingHorizontal: space.md, borderTopWidth: 1, borderTopColor: colors.border }}
                  >
                    <Ionicons name={state.wrong.includes(c.id) ? "close-circle" : "help-circle-outline"} size={16} color={state.wrong.includes(c.id) ? colors.ember : colors.textMuted} />
                    <Text style={[type.body, { color: colors.textPrimary }]}>{t.country(c)}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        {note && (
          <Text accessibilityLiveRegion="polite" style={[type.bodySmall, { color: colors.textSecondary, marginHorizontal: space.lg, marginTop: space.sm }]}>
            {note}
          </Text>
        )}

        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxl }} keyboardShouldPersistTaps="handled">
          {!playing && (
            <View accessibilityLiveRegion="polite" style={{ alignItems: "center", marginBottom: space.lg }}>
              <View style={{ padding: 4, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.accent }}>
                <Flag cca2={answer.cca2} width={96} label={t("detail.flagOf", { name: t.country(answer) })} />
              </View>
              <Text style={[type.title, { color: colors.textPrimary, marginTop: space.sm, textAlign: "center" }]}>
                {state.status === "solved"
                  ? state.cluesShown === 1
                    ? t("mystery.solvedTitleOne")
                    : t("mystery.solvedTitle", { clues: state.cluesShown })
                  : t("mystery.failedTitle", { country: t.country(answer) })}
              </Text>
              {state.status === "solved" && (
                <Text style={[type.body, { color: colors.textSecondary, marginTop: 2 }]}>
                  {t.country(answer)} · {t(state.points === 1 ? "locate.plusPoint" : "locate.plusPoints", { points: state.points })}
                </Text>
              )}
              <RewardsCard achievements={rewards.achievements} stamps={rewards.stamps} />
              {daily ? (
                <>
                  <PrimaryButton label={t("daily.share")} onPress={share} style={{ marginTop: space.lg, alignSelf: "stretch" }} />
                  <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm }]}>
                    {shareOutcome === "copied"
                      ? t("challenge.copied")
                      : shareOutcome === "shared"
                        ? t("daily.shared")
                        : shareOutcome === "failed"
                          ? t("challenge.shareFailed")
                          : t("mystery.nextIn", { time: countdown })}
                  </Text>
                  <PrimaryButton label={t("mystery.practiceMore")} onPress={() => router.replace("/mystery/practice")} style={{ marginTop: space.md, alignSelf: "stretch" }} />
                </>
              ) : (
                <PrimaryButton label={t("mystery.next")} onPress={nextMystery} style={{ marginTop: space.lg, alignSelf: "stretch" }} />
              )}
              <Pressable onPress={() => router.push(`/country/${answer.id}`)} accessibilityRole="button" style={{ marginTop: space.md, padding: space.xs }}>
                <Text style={[type.bodySmall, { color: colors.accent, fontFamily: fontFamily.bodySemiBold }]}>{t("mystery.openCountry", { country: t.country(answer) })} →</Text>
              </Pressable>
            </View>
          )}

          <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, marginBottom: space.sm }]}>
            {t("mystery.clueCount", { shown: playing ? state.cluesShown : CLUE_COUNT, total: CLUE_COUNT }).toUpperCase()}
          </Text>
          {clues.slice(0, playing ? state.cluesShown : CLUE_COUNT).map((clue, i) => {
            const fresh = playing && i === state.cluesShown - 1;
            return (
              <Animated.View
                key={clue.kind}
                entering={fresh ? FadeInDown.duration(250) : undefined}
                accessible
                accessibilityLabel={clue.kind === "flag" ? clue.label : `${clue.label}: ${clue.value}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: space.md,
                  padding: space.md,
                  marginBottom: space.sm,
                  borderRadius: radius.md,
                  backgroundColor: colors.surfaceRaised,
                  borderWidth: 1,
                  borderColor: fresh ? colors.accent : colors.border,
                  opacity: !playing && i >= state.cluesShown ? 0.6 : 1,
                }}
              >
                <Text style={[type.data, { color: colors.accent, width: 18, textAlign: "center" }]}>{i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted }]}>{clue.label.toUpperCase()}</Text>
                  {clue.kind === "flag" ? (
                    <Flag cca2={clue.value} width={72} style={{ marginTop: 4 }} />
                  ) : (
                    <Text style={[type.body, { color: colors.textPrimary, marginTop: 2 }]}>{clue.value}</Text>
                  )}
                </View>
              </Animated.View>
            );
          })}

          {state.wrong.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: space.xs }}>
              {state.wrong.map((id) => (
                <View key={id} style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.ember }}>
                  <Ionicons name="close" size={12} color={colors.ember} />
                  <Text style={[type.bodySmall, { color: colors.textSecondary }]}>{name(id)}</Text>
                </View>
              ))}
            </View>
          )}

          {playing && (
            <View style={{ marginTop: space.lg, gap: space.sm }}>
              {state.cluesShown < CLUE_COUNT ? (
                <Pressable
                  onPress={() => {
                    setNote(null);
                    update(revealClue(state));
                  }}
                  accessibilityRole="button"
                  style={{ alignItems: "center", paddingVertical: space.sm + 2, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border }}
                >
                  <Text style={[type.body, { color: colors.textPrimary }]}>{t("mystery.nextClue")}</Text>
                </Pressable>
              ) : (
                <Text style={[type.bodySmall, { color: colors.textMuted, textAlign: "center" }]}>{t("mystery.lastClue")}</Text>
              )}
              <Pressable onPress={() => update(giveUpMystery(state))} accessibilityRole="button" style={{ alignSelf: "center", padding: space.xs }}>
                <Text style={[type.bodySmall, { color: colors.textMuted, textDecorationLine: "underline" }]}>{t("mystery.giveUp")}</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
