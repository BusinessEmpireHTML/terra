import React from "react";
import { useLocalSearchParams } from "expo-router";
import CountryDetailScreen from "../../src/screens/CountryDetailScreen";
import { COUNTRIES } from "../../src/data/countries";

/** Web export: pre-render a page for every country, so links work on static hosts. */
export function generateStaticParams(): { code: string }[] {
  return COUNTRIES.map((c) => ({ code: c.id }));
}

export default function CountryRoute() {
  const { code } = useLocalSearchParams<{ code: string }>();
  return <CountryDetailScreen cca3={(code ?? "").toUpperCase()} />;
}
