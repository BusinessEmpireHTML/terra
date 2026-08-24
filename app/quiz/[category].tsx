import React from "react";
import { useLocalSearchParams } from "expo-router";
import QuizSessionScreen from "../../src/screens/QuizSessionScreen";
import type { CategoryFilter } from "../../src/quiz/sessionBuilder";

export default function QuizRoute() {
  const { category, country, daily } = useLocalSearchParams<{ category: string; country?: string; daily?: string }>();
  const filter = (category as CategoryFilter) ?? "mixed";
  return <QuizSessionScreen filter={filter} focusCountryId={country} isDailyChallenge={daily === "1"} />;
}
