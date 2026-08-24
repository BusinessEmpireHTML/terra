import React from "react";
import { useLocalSearchParams } from "expo-router";
import CountryDetailScreen from "../../src/screens/CountryDetailScreen";

export default function CountryRoute() {
  const { code } = useLocalSearchParams<{ code: string }>();
  return <CountryDetailScreen cca3={(code ?? "").toUpperCase()} />;
}
