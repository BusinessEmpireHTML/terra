import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COUNTRIES } from "../../data/countries";
import { useTheme } from "../../theme/ThemeProvider";
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
        {question.promptVisual === "flag" && country && <Text style={{ fontSize: 88 }}>{country.flagEmoji}</Text>}
        {question.promptVisual === "shape" && <CountrySilhouette countryId={question.countryId} size={180} />}
        <Text style={[type.title, { color: colors.textPrimary, textAlign: "center", marginTop: space.md }]}>
          {question.promptLabel}
        </Text>
      </View>

      <View style={{ gap: space.sm }}>
        {question.choices.map((choice) => {
          const isChosen = answered?.chosenLabel === choice.label;
          const revealCorrect = answered && choice.correct;
          const revealWrongChosen = answered && isChosen && !choice.correct;

          let borderColor: string = colors.border;
          let backgroundColor: string = colors.surfaceRaised;
          if (revealCorrect) {
            borderColor = colors.accentSecondary;
            backgroundColor = colors.accentSecondary + "22";
          } else if (revealWrongChosen) {
            borderColor = colors.ember;
            backgroundColor = colors.ember + "22";
          }

          return (
            <AnimatedPressable
              key={choice.label}
              haptic={false}
              onPress={() => !answered && onSelect(choice.label)}
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
          style={{
            marginTop: space.lg,
            padding: space.md,
            borderRadius: radius.md,
            backgroundColor: colors.surfaceRaised,
            borderLeftWidth: 3,
            borderLeftColor: answered.correct ? colors.accentSecondary : colors.ember,
          }}
        >
          <Text style={[type.label, { color: answered.correct ? colors.accentSecondary : colors.ember, marginBottom: 4 }]}>
            {answered.correct ? "CORRECT" : "NOT QUITE"}
          </Text>
          <Text style={[type.body, { color: colors.textPrimary }]}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
}
