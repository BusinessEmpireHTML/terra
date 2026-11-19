import React from "react";
import { useLocalSearchParams } from "expo-router";
import QuizSessionScreen from "../../src/screens/QuizSessionScreen";
import { isCategoryFilter } from "../../src/quiz/sessionBuilder";

export default function QuizRoute() {
  const { category, country, daily, expedition } = useLocalSearchParams<{
    category: string;
    country?: string;
    daily?: string;
    expedition?: string;
  }>();
  // Anything unexpected in the URL (a typo, an old link) falls back to a mixed
  // session rather than crashing the session builder.
  const filter = isCategoryFilter(category) ? category : "mixed";
  return (
    <QuizSessionScreen
      filter={filter}
      focusCountryId={country?.toUpperCase()}
      expeditionId={expedition}
      isDailyChallenge={daily === "1"}
    />
  );
}
