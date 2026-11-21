import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, PrimaryButton } from "../components/ui/Primitives";
import { QuestionCard } from "../components/quiz/QuestionCard";
import { LocateCard } from "../components/quiz/LocateCard";
import { useTheme } from "../theme/ThemeProvider";
import { useQuizSession } from "../quiz/useQuizSession";
import { whenAnswersSaved } from "../quiz/answerRecorder";
import { QUIZ_CATEGORIES } from "../quiz/types";
import { DEFAULT_SESSION_LENGTH, type CategoryFilter } from "../quiz/sessionBuilder";
import { dailyNumber, type DailyAnswer } from "../quiz/daily";
import { DailyResultCard } from "../components/quiz/DailyResultCard";
import { localDateString } from "../gamification/streaks";
import { dailyStore } from "../services/dailyStore";
import { checkForNewAchievements } from "../gamification/checkAchievements";
import { EXPEDITIONS_BY_ID } from "../gamification/expeditions";
import { COUNTRIES } from "../data/countries";
import { useSafeBack } from "../hooks/useSafeBack";
import type { Achievement } from "../gamification/types";

interface Props {
  filter: CategoryFilter;
  focusCountryId?: string;
  expeditionId?: string;
  isDailyChallenge?: boolean;
}


export default function QuizSessionScreen({ filter, focusCountryId, expeditionId, isDailyChallenge }: Props) {
  const { colors, type, space, radius } = useTheme();
  const goBack = useSafeBack();
  const expedition = expeditionId ? EXPEDITIONS_BY_ID.get(expeditionId) : undefined;
  const focusCountry = focusCountryId ? COUNTRIES.find((c) => c.id === focusCountryId) : undefined;

  // The Daily is pinned to the date the screen opened, so a game that runs past midnight stays one game.
  const [dailyDate] = useState(() => localDateString());
  const { loading, error, currentQuestion, answered, index, total, results, correctCount, xpEarned, isComplete, submitAnswer, next, retry } =
    useQuizSession(filter, {
      length: DEFAULT_SESSION_LENGTH,
      focusCountryId,
      countryIds: expedition?.countryIds,
      dailyDate: isDailyChallenge ? dailyDate : undefined,
    });
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const wrapUpStarted = useRef(false);
  // Daily answers: undefined while checking storage, null if not yet played today.
  const [dailyAnswers, setDailyAnswers] = useState<DailyAnswer[] | null | undefined>(isDailyChallenge ? undefined : null);
  const [playedEarlier, setPlayedEarlier] = useState(false);

  useEffect(() => {
    if (!isDailyChallenge) return;
    dailyStore
      .getToday()
      .then((d) => {
        const earlier = d.date === dailyDate && d.dailyQuizAnswers?.length ? d.dailyQuizAnswers : null;
        setDailyAnswers(earlier);
        setPlayedEarlier(Boolean(earlier));
      })
      .catch(() => setDailyAnswers(null));
  }, [isDailyChallenge, dailyDate]);

  const categoryMeta = filter !== "mixed" ? QUIZ_CATEGORIES.find((c) => c.key === filter) : null;
  const title = focusCountry
    ? `Practice: ${focusCountry.name.common}`
    : expedition
      ? expedition.title
      : isDailyChallenge
        ? `Daily #${dailyNumber(dailyDate)}`
        : categoryMeta?.label ?? "Mixed review";

  useEffect(() => {
    if (!isComplete || wrapUpStarted.current) return;
    wrapUpStarted.current = true;
    let cancelled = false;
    (async () => {
      try {
        if (isDailyChallenge) {
          const answers = results.map((r) => ({ category: r.question.category, correct: r.correct }));
          await dailyStore.markDailyQuizDone(dailyDate, answers);
          if (!cancelled) setDailyAnswers(answers);
        }
        // Make sure the final answer has been written before evaluating
        // achievements, or one earned on the last question would be missed.
        await whenAnswersSaved();
        const unlocked = await checkForNewAchievements();
        if (!cancelled) setNewAchievements(unlocked);
      } catch (err) {
        if (__DEV__) console.warn("Quiz wrap-up failed:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
    // `results` is complete once isComplete flips; reading it then is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, isDailyChallenge, dailyDate]);

  // Already played today's Daily: show the result (and share) instead of replaying it.
  if (isDailyChallenge && (dailyAnswers === undefined || playedEarlier)) {
    return (
      <GradientBackground>
        <SafeAreaView style={{ flex: 1, paddingHorizontal: space.xl }}>
          <View style={{ flexDirection: "row", paddingTop: space.sm }}>
            <Pressable onPress={goBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close">
              <Ionicons name="close" size={26} color={colors.textPrimary} />
            </Pressable>
          </View>
          {dailyAnswers && (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={[type.title, { color: colors.textPrimary, textAlign: "center", marginBottom: space.lg }]}>
                You've played today's Daily
              </Text>
              <DailyResultCard date={dailyDate} answers={dailyAnswers} />
              <PrimaryButton label="Done" onPress={goBack} style={{ marginTop: space.md, alignSelf: "stretch" }} />
            </View>
          )}
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const percent = total ? Math.round((correctCount / total) * 100) : 0;
  const progress = total ? (index + (answered ? 1 : 0)) / total : 0;

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm }}>
          <Pressable onPress={goBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close quiz">
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[type.section, { color: colors.textMuted }]} numberOfLines={1}>
              {title.toUpperCase()}
            </Text>
            {!loading && !isComplete && total > 0 && (
              <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 2 }]}>
                {index + 1} / {total}
              </Text>
            )}
          </View>
          <View style={{ width: 26 }} />
        </View>

        {!loading && !isComplete && total > 0 && (
          <View
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: total, now: index + (answered ? 1 : 0) }}
            style={{ height: 3, marginHorizontal: space.lg, marginTop: space.sm, borderRadius: 2, backgroundColor: colors.surfaceRaised, overflow: "hidden" }}
          >
            <View style={{ height: "100%", width: `${progress * 100}%`, backgroundColor: colors.accent }} />
          </View>
        )}

        {loading && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={[type.body, { color: colors.textMuted }]}>Building your session…</Text>
          </View>
        )}

        {!loading && error && (
          <CenteredMessage icon="cloud-offline-outline" title="Something went wrong" body={error}>
            <PrimaryButton label="Try again" onPress={retry} style={{ marginTop: space.xl, width: "100%" }} />
          </CenteredMessage>
        )}

        {!loading && !error && total === 0 && (
          <CenteredMessage
            icon="checkmark-done-circle-outline"
            title="Nothing to practice here"
            body="There aren't any questions available for this selection. Try a mixed review or another category."
          >
            <PrimaryButton label="Back" onPress={goBack} style={{ marginTop: space.xl, width: "100%" }} />
          </CenteredMessage>
        )}

        {currentQuestion &&
          (currentQuestion.promptVisual === "globe" ? (
            // No ScrollView here: a vertical drag must rotate the globe, not scroll the page.
            <View style={{ flex: 1, paddingTop: space.md }}>
              <LocateCard question={currentQuestion} answered={answered} onSelect={submitAnswer} />
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxl }}>
              <QuestionCard question={currentQuestion} answered={answered} onSelect={submitAnswer} />
            </ScrollView>
          ))}

        {isComplete && (
          <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center", padding: space.xl }}>
            {isDailyChallenge && dailyAnswers ? (
              <>
                <DailyResultCard date={dailyDate} answers={dailyAnswers} />
                {xpEarned > 0 && <Text style={[type.body, { color: colors.textMuted, marginTop: 4 }]}>+{xpEarned} XP</Text>}
              </>
            ) : (
              <>
                <Text style={{ fontSize: 56 }} accessible={false}>
                  {percent >= 80 ? "🏆" : percent >= 50 ? "🌍" : "🧭"}
                </Text>
                <Text
                  style={[type.hero, { color: colors.textPrimary, marginTop: space.md, fontSize: 32 }]}
                  accessibilityLabel={`${correctCount} out of ${total} correct`}
                >
                  {correctCount} / {total}
                </Text>
                <Text style={[type.body, { color: colors.textMuted, marginTop: 4 }]}>
                  {percent}% correct{xpEarned > 0 ? ` · +${xpEarned} XP` : ""}
                </Text>
              </>
            )}
            {newAchievements.length > 0 && (
              <View
                style={{
                  marginTop: space.lg,
                  alignItems: "center",
                  padding: space.md,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.accent,
                  alignSelf: "stretch",
                }}
              >
                <Text style={[type.label, { color: colors.accent }]}>
                  {newAchievements.length > 1 ? "ACHIEVEMENTS UNLOCKED" : "ACHIEVEMENT UNLOCKED"}
                </Text>
                {newAchievements.map((a) => (
                  <Text key={a.id} style={[type.body, { color: colors.textPrimary, marginTop: 4 }]}>
                    🏅 {a.title}
                  </Text>
                ))}
              </View>
            )}
            <PrimaryButton label="Done" onPress={goBack} style={{ marginTop: space.xl, width: "100%" }} />
          </ScrollView>
        )}

        {currentQuestion && answered && (
          <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
            <PrimaryButton label={index + 1 >= total ? "See results" : "Next"} onPress={next} />
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

function CenteredMessage({
  icon,
  title,
  body,
  children,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  const { colors, type, space } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: space.xl }}>
      <Ionicons name={icon} size={56} color={colors.accent} />
      <Text style={[type.title, { color: colors.textPrimary, textAlign: "center", marginTop: space.md }]}>{title}</Text>
      <Text style={[type.body, { color: colors.textMuted, textAlign: "center", marginTop: space.sm }]}>{body}</Text>
      {children}
    </View>
  );
}
