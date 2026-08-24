import React from "react";
import { useLocalSearchParams } from "expo-router";
import ExpeditionDetailScreen from "../../src/screens/ExpeditionDetailScreen";

export default function ExpeditionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ExpeditionDetailScreen expeditionId={id} />;
}
