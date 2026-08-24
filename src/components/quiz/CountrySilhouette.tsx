import React, { useMemo } from "react";
import Svg, { Path } from "react-native-svg";
import worldBordersRaw from "../../data/worldBorders.json";
import { flattenShapeToPaths } from "../../utils/geo";
import { useTheme } from "../../theme/ThemeProvider";

interface WorldBorderFeature {
  id: string;
  matched: boolean;
  outerRings: [number, number][][];
}
const WORLD_BORDERS = worldBordersRaw as WorldBorderFeature[];
const byId = new Map(WORLD_BORDERS.filter((f) => f.matched).map((f) => [f.id, f]));

export function CountrySilhouette({ countryId, size = 180 }: { countryId: string; size?: number }) {
  const { colors } = useTheme();
  const paths = useMemo(() => {
    const feature = byId.get(countryId);
    if (!feature) return [];
    return flattenShapeToPaths(feature.outerRings, size);
  }, [countryId, size]);

  return (
    <Svg width={size} height={size}>
      {paths.map((d, i) => (
        <Path key={i} d={d} fill={colors.accent} fillOpacity={0.9} stroke={colors.accentBright} strokeWidth={1.5} />
      ))}
    </Svg>
  );
}
