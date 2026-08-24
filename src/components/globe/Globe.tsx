import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop } from "react-native-svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { graticuleRings, project, projectRingToPath, type Rotation } from "../../utils/geo";
import { COUNTRIES } from "../../data/countries";
import worldBordersRaw from "../../data/worldBorders.json";
import { useTheme } from "../../theme/ThemeProvider";

interface WorldBorderFeature {
  id: string;
  matched: boolean;
  outerRings: [number, number][][];
}
const WORLD_BORDERS = worldBordersRaw as WorldBorderFeature[];

const MARKER_COUNTRIES = COUNTRIES.filter((c) => c.latlng);
const HIT_RADIUS = 16; // px — generous tap target for small markers

export type GlobeLayer = "political" | "density" | "mastery";

interface GlobeProps {
  size: number;
  layer?: GlobeLayer;
  focusedCountryId?: string | null;
  /** countryId -> mastery score 0–100, only needed when layer === 'mastery'. Computed by the caller so Globe stays decoupled from the progress store. */
  masteryByCca3?: Map<string, number>;
  onSelectCountry: (cca3: string) => void;
}

export function Globe({ size, layer = "political", focusedCountryId, masteryByCca3, onSelectCountry }: GlobeProps) {
  const { colors } = useTheme();
  const radius = size / 2;
  const cx = radius;
  const cy = radius;

  // Population-density choropleth: five buckets (people/km²), using a
  // dedicated sequential scale (not reused role colors, so the sparsest
  // bucket stays visible against the background instead of blending in).
  const densityByCca3 = useMemo(() => {
    const [step0, step1, step2, step3, step4] = colors.densityScale;
    const map = new Map<string, string>();
    for (const c of COUNTRIES) {
      if (!c.population || !c.areaKm2) continue;
      const d = c.population / c.areaKm2;
      const color = d < 10 ? step0 : d < 50 ? step1 : d < 150 ? step2 : d < 400 ? step3 : step4;
      map.set(c.id, color);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  // Mastery layer: unlit (no fill, outline only) until a country has been
  // practiced at all, then warms up through the same sequential scale as
  // its score rises — the globe literally lights up country by country.
  const masteryColorFor = useCallback(
    (cca3: string): string | null => {
      const score = masteryByCca3?.get(cca3);
      if (score == null || score <= 0) return null;
      const [step0, step1, step2, step3, step4] = colors.densityScale;
      if (score < 20) return step0;
      if (score < 40) return step1;
      if (score < 60) return step2;
      if (score < 80) return step3;
      return step4;
    },
    [masteryByCca3, colors]
  );

  const lambda = useSharedValue(-20);
  const phi = useSharedValue(-12);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const [rotation, setRotation] = useState<Rotation>({ lambda: -20, phi: -12 });
  const [zoom, setZoom] = useState(1);

  const syncRotation = useCallback((l: number, p: number) => setRotation({ lambda: l, phi: p }), []);
  const syncZoom = useCallback((s: number) => setZoom(s), []);

  useAnimatedReaction(
    () => ({ l: lambda.value, p: phi.value }),
    (cur, prev) => {
      if (!prev || Math.abs(cur.l - prev.l) > 0.5 || Math.abs(cur.p - prev.p) > 0.5) {
        runOnJS(syncRotation)(cur.l, cur.p);
      }
    }
  );

  useAnimatedReaction(
    () => scale.value,
    (cur, prev) => {
      if (!prev || Math.abs(cur - prev) > 0.008) runOnJS(syncZoom)(cur);
    }
  );

  const effectiveRadius = radius * zoom;

  const pan = Gesture.Pan()
    .minDistance(3)
    .onChange((e) => {
      lambda.value += e.changeX * 0.28;
      phi.value = Math.max(-80, Math.min(80, phi.value - e.changeY * 0.28));
    });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.7, Math.min(2.6, savedScale.value * e.scale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const handleMarkerTap = useCallback(
    (code: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const country = COUNTRIES.find((c) => c.id === code);
      if (country) {
        const [lat, lon] = country.latlng;
        // Centering a point at (lon, lat) requires yaw = 90° - lon and
        // pitch = lat exactly — see geo.ts's rotation convention. (An
        // earlier version used -lon with a damped pitch, which rotated the
        // tapped country toward the horizon instead of the center.)
        lambda.value = withTiming(90 - lon, { duration: 650, easing: Easing.out(Easing.cubic) });
        phi.value = withTiming(Math.max(-80, Math.min(80, lat)), {
          duration: 650,
          easing: Easing.out(Easing.cubic),
        });
      }
      setTimeout(() => onSelectCountry(code), 380);
    },
    [lambda, phi, onSelectCountry]
  );

  const handleTapAt = useCallback(
    (x: number, y: number) => {
      let nearest: { code: string; dist: number } | null = null;
      for (const m of projectedMarkersRef.current) {
        const dist = Math.hypot(m.x - x, m.y - y);
        if (dist <= HIT_RADIUS && (!nearest || dist < nearest.dist)) nearest = { code: m.code, dist };
      }
      if (nearest) handleMarkerTap(nearest.code);
    },
    [handleMarkerTap]
  );

  const tap = Gesture.Tap()
    .maxDuration(280)
    .maxDistance(8)
    .onEnd((e, success) => {
      if (success) runOnJS(handleTapAt)(e.x, e.y);
    });

  const composed = Gesture.Simultaneous(Gesture.Race(tap, pan), pinch);

  const countryShapes = useMemo(() => {
    const shapes: { id: string; d: string; fillColor: string | null }[] = [];
    for (const feature of WORLD_BORDERS) {
      let combined = "";
      let any = false;
      for (const ring of feature.outerRings) {
        const d = projectRingToPath(ring, rotation, effectiveRadius, cx, cy);
        if (d) {
          combined += d;
          any = true;
        }
      }
      if (any) {
        const fillColor =
          layer === "density" ? densityByCca3.get(feature.id) ?? null : layer === "mastery" ? masteryColorFor(feature.id) : null;
        shapes.push({ id: feature.id, d: combined, fillColor });
      }
    }
    return shapes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation.lambda, rotation.phi, effectiveRadius, cx, cy, layer, densityByCca3, masteryColorFor]);

  const graticule = useMemo(() => {
    const rings = graticuleRings(30);
    return rings
      .map((r) => projectRingToPath(r, rotation, effectiveRadius, cx, cy))
      .filter((d): d is string => Boolean(d));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation.lambda, rotation.phi, effectiveRadius, cx, cy]);

  const markers = useMemo(() => {
    return MARKER_COUNTRIES.map((c) => {
      const [lat, lon] = c.latlng;
      const p = project(lon, lat, rotation);
      const focused = c.id === focusedCountryId;
      return {
        code: c.id,
        x: cx + p.x * effectiveRadius,
        y: cy + p.y * effectiveRadius,
        visible: p.visible,
        color: c.accentColor ?? colors.accent,
        focused,
      };
    }).filter((m) => m.visible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation.lambda, rotation.phi, effectiveRadius, cx, cy, focusedCountryId]);

  // Kept in a ref (mirrors `markers`) so the worklet-originated tap handler
  // can read current positions without becoming a dependency of the gesture.
  const projectedMarkersRef = React.useRef(markers);
  projectedMarkersRef.current = markers;

  return (
    <GestureDetector gesture={composed}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Defs>
            <RadialGradient id="ocean" cx="32%" cy="28%" r="80%">
              <Stop offset="0%" stopColor={colors.globeHighlight} stopOpacity={1} />
              <Stop offset="55%" stopColor={colors.globeBase} stopOpacity={1} />
              <Stop offset="100%" stopColor={colors.globeEdge} stopOpacity={1} />
            </RadialGradient>
          </Defs>

          <Circle
            cx={cx}
            cy={cy}
            r={effectiveRadius}
            fill="url(#ocean)"
            stroke={colors.accent}
            strokeWidth={1.25}
            strokeOpacity={0.5}
          />

          <G>
            {graticule.map((d, i) => (
              <Path key={`grat-${i}`} d={d} fill="none" stroke={colors.accent} strokeOpacity={0.08} strokeWidth={0.5} />
            ))}
          </G>

          <G>
            {countryShapes.map((s) => (
              <Path
                key={`shape-${s.id}`}
                d={s.d}
                fill={s.fillColor ?? "none"}
                fillOpacity={s.fillColor ? 0.65 : 0}
                stroke={colors.accent}
                strokeOpacity={layer === "political" ? 0.55 : 0.35}
                strokeWidth={0.75}
              />
            ))}
          </G>

          <G>
            {markers.map((m) => (
              <G key={m.code}>
                {m.focused && <Circle cx={m.x} cy={m.y} r={12} fill={m.color} opacity={0.22} />}
                <Circle cx={m.x} cy={m.y} r={m.focused ? 5.5 : 3.5} fill={m.color} opacity={0.95} />
                <Circle cx={m.x} cy={m.y} r={m.focused ? 5.5 : 3.5} fill="none" stroke={colors.background} strokeWidth={0.75} />
              </G>
            ))}
          </G>
        </Svg>
      </View>
    </GestureDetector>
  );
}
