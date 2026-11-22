import React from "react";
import { useLocalSearchParams } from "expo-router";
import ChallengeScreen from "../../src/screens/ChallengeScreen";

export default function ChallengeRoute() {
  const { code } = useLocalSearchParams<{ code: string }>();
  return <ChallengeScreen code={code ?? ""} />;
}
