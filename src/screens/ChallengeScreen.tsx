import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, PrimaryButton } from "../components/ui/Primitives";
import { useTheme } from "../theme/ThemeProvider";
import { useT } from "../i18n/useT";
import { useSafeBack } from "../hooks/useSafeBack";
import { CHALLENGE_LENGTH, CHALLENGE_MAX_POINTS, decodeChallenge, randomSeed } from "../quiz/challenge";
import QuizSessionScreen from "./QuizSessionScreen";

/**
 * A friend challenge: with no code, starts a fresh one (random 10 countries);
 * with a code, plays the same 10 your friend did and compares scores.
 */
export default function ChallengeScreen({ code }: { code?: string }) {
  const { colors, type, space } = useTheme();
  const t = useT();
  const goBack = useSafeBack();
  const decoded = code ? decodeChallenge(code) : null;
  const [seed] = useState(() => decoded?.seed ?? randomSeed());
  const [playing, setPlaying] = useState(false);
  const opponentScore = decoded?.score ?? null;

  if (playing) return <QuizSessionScreen filter="locate" challenge={{ seed, opponentScore }} />;

  const invalid = code != null && !decoded;
  const title = invalid ? t("challenge.invalidTitle") : !code ? t("challenge.newIntroTitle") : t("challenge.receivedIntroTitle");
  const body = invalid
    ? t("challenge.invalidBody")
    : !code
      ? t("challenge.newIntroBody", { count: CHALLENGE_LENGTH })
      : opponentScore == null
        ? t("challenge.freshIntroBody", { count: CHALLENGE_LENGTH })
        : t("challenge.receivedIntroBody", { score: opponentScore, max: CHALLENGE_MAX_POINTS, count: CHALLENGE_LENGTH });

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: space.xl }}>
        <View style={{ flexDirection: "row", paddingTop: space.sm }}>
          <Pressable onPress={goBack} hitSlop={12} accessibilityRole="button" accessibilityLabel={t("common.close")}>
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 56 }} accessible={false}>
            {invalid ? "🤔" : "⚔️"}
          </Text>
          <Text accessibilityRole="header" style={[type.title, { color: colors.textPrimary, textAlign: "center", marginTop: space.md }]}>
            {title}
          </Text>
          <Text style={[type.body, { color: colors.textMuted, textAlign: "center", marginTop: space.sm }]}>{body}</Text>
          {invalid ? (
            <PrimaryButton label={t("common.back")} onPress={goBack} style={{ marginTop: space.xl, alignSelf: "stretch" }} />
          ) : (
            <PrimaryButton label={t("challenge.start")} onPress={() => setPlaying(true)} style={{ marginTop: space.xl, alignSelf: "stretch" }} />
          )}
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}
