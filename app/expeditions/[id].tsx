import React from "react";
import { useLocalSearchParams } from "expo-router";
import ExpeditionDetailScreen from "../../src/screens/ExpeditionDetailScreen";
import { EXPEDITIONS } from "../../src/gamification/expeditions";

/** Web export: pre-render every expedition page, so links work on static hosts. */
export function generateStaticParams(): { id: string }[] {
  return EXPEDITIONS.map((e) => ({ id: e.id }));
}

export default function ExpeditionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ExpeditionDetailScreen expeditionId={id} />;
}
