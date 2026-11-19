import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COUNTRIES } from "../../data/countries";
import { useTheme } from "../../theme/ThemeProvider";
import { fontFamily } from "../../theme/tokens";
import { AnimatedPressable } from "../ui/Primitives";
import { CountrySilhouette } from "./CountrySilhouette";
import type { AnswerResult, Question } from "../../quiz/types";

interface Props {
  question: Question;
  answered: AnswerResult | null;
  onSelect: (label: string) => void;
}

export function QuestionCard({ question, answered, onSelect }: Props) {
  const { colors, type, space, radius } = useTheme();
  const country = COUNTRIES.find((c) => c.id === question.countryId);

  return (
    <View>
      <View style={{ alignItems: "center", marginBottom: space.lg }}>
        {question.promptVisual === "flag" && country && (
          // Screen readers announce flag emoji by country name ("flag: France"),
          // which would read the answer aloud — so label it neutrally.
          <Text style={{ fontSize: 88 }} accessibilityLabel="Flag to identify">
            {country.flagEmoji}
          </Text>
        )}
        {question.promptVisual === "shape" && <CountrySilhouette countryId={question.countryId} size={180} />}
        <Text
          accessibilityRole="header"
          style={[type.title, { color: colors.textPrimary, textAlign: "center", marginTop: space.md, fontSize: 24, lineHeight: 30 }]}
        >
          {question.promptLabel}
        </Text>
      </View>

      <View style={{ gap: space.sm }}>
        {question.choices.map((choice) => {
          const isChosen = answered?.chosenLabel === choice.label;
          const revealCorrect = Boolean(answered && choice.correct);
          const revealWrongChosen = Boolean(answered && isChosen && !choice.correct);

          let borderColor: string = colors.border;
          let backgroundColor: string = colors.surfaceRaised;
          if (revealCorrect) {
            borderColor = colors.accentSecondary;
            backgroundColor = colors.accentSecondary + "22";
          } else if (revealWrongChosen) {
            borderColor = colors.ember;
            backgroundColor = colors.ember + "22";
          }

          const a11yLabel = revealCorrect ? `${choice.label}, correct answer` : revealWrongChosen ? `${choice.label}, your answer, incorrect` : choice.label;

          return (
            <AnimatedPressable
              key={choice.label}
              haptic={false}
              disabled={Boolean(answered)}
              onPress={() => onSelect(choice.label)}
              accessibilityLabel={a11yLabel}
              accessibilityState={{ disabled: Boolean(answered), selected: isChosen }}
              style={{
                borderRadius: radius.md,
                borderWidth: 1.5,
                borderColor,
                backgroundColor,
                paddingVertical: space.md,
                paddingHorizontal: space.md,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={[type.body, { color: colors.textPrimary, flex: 1 }]}>{choice.label}</Text>
              {revealCorrect && <Ionicons name="checkmark-circle" size={20} color={colors.accentSecondary} />}
              {revealWrongChosen && <Ionicons name="close-circle" size={20} color={colors.ember} />}
            </AnimatedPressable>
          );
        })}
      </View>

      {answered && (
        <View
          accessibilityLiveRegion="polite"
          style={{
            marginTop: space.lg,
            padding: space.md,
            borderRadius: radius.md,
            backgroundColor: colors.surfaceRaised,
            borderLeftWidth: 3,
            borderLeftColor: answered.correct ? colors.accentSecondary : colors.ember,
          }}
        >
          <Text style={[type.label, { color: answered.correct ? colors.accentSecondary : colors.ember, marginBottom: 4, fontFamily: fontFamily.mono }]}>
            {answered.correct ? "CORRECT" : "NOT QUITE"}
          </Text>
          <Text style={[type.body, { color: colors.textPrimary }]}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
}
