import React from "react";
import { useLocalSearchParams } from "expo-router";
import MysteryScreen from "../../src/screens/MysteryScreen";

/** Web export: both pages are pre-rendered. */
export function generateStaticParams(): { mode: string }[] {
  return [{ mode: "daily" }, { mode: "practice" }];
}

export default function MysteryRoute() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  // The key restarts the screen when switching from the daily to practice.
  return <MysteryScreen key={mode} mode={mode === "practice" ? "practice" : "daily"} />;
}
