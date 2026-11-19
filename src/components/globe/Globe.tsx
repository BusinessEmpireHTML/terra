import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop } from "react-native-svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Easing, runOnJS, useAnimatedReaction, useSharedValue, withTiming } from "react-native-reanimated";
import { tapFeedback } from "../../utils/haptics";
import { graticuleRings, pointInRing, project, projectRingToPath, unproject, type Ring, type Rotation } from "../../utils/geo";
import { COUNTRIES } from "../../data/countries";
import worldBordersRaw from "../../data/worldBorders.json";
import { useTheme } from "../../theme/ThemeProvider";

interface WorldBorderFeature {
  id: string;
  matched: boolean;
  outerRings: [number, number][][];
}
const WORLD_BORDERS = worldBordersRaw as WorldBorderFeature[];

const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));
const MARKER_COUNTRIES = COUNTRIES.filter((c) => c.latlng);
const GRATICULE = graticuleRings(30);
const HIT_RADIUS = 16; // px — generous tap target for small markers
const MIN_ZOOM = 0.7;
const MAX_ZOOM = 2.6;
const DRAG_DEGREES_PER_PX = 0.28;
const INITIAL_ROTATION: Rotation = { lambda: -20, phi: -12 };

/** Countries with polygons, plus a bounding box per ring so most taps skip the full point-in-polygon test. */
const HIT_SHAPES = WORLD_BORDERS.filter((f) => f.matched && COUNTRY_BY_ID.has(f.id)).map((f) => ({
  id: f.id,
  rings: f.outerRings.map((ring) => {
    let minLat = Infinity;
    let maxLat = -Infinity;
    for (const [, lat] of ring) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
    return { ring: ring as Ring, minLat, maxLat };
  }),
}));

function countryAt(lon: number, lat: number): string | null {
  for (const shape of HIT_SHAPES) {
    for (const { ring, minLat, maxLat } of shape.rings) {
      if (lat < minLat || lat > maxLat) continue;
      if (pointInRing([lon, lat], ring)) return shape.id;
    }
  }
  return null;
}

export type GlobeLayer = "political" | "density" | "mastery";

interface GlobeProps {
  size: number;
  layer?: GlobeLayer;
  focusedCountryId?: string | null;
  /** countryId -> mastery score 0–100, only needed when layer === 'mastery'. Computed by the caller so Globe stays decoupled from the progress store. */
  masteryByCca3?: Map<string, number>;
  onSelectCountry: (cca3: string) => void;
}

/** People per km² buckets used by the density layer (and its legend on the home screen). */
export const DENSITY_BREAKS = [10, 50, 150, 400] as const;

export function Globe({ size, layer = "political", focusedCountryId, masteryByCca3, onSelectCountry }: GlobeProps) {
  const { colors } = useTheme();
  const radius = size / 2;
  const cx = radius;
  const cy = radius;

  // Population-density choropleth: five buckets (people/km²), using a
  // dedicated sequential scale (not reused role colors, so the sparsest
  // bucket stays visible against the background instead of blending in).
  const densityByCca3 = useMemo(() => {
    const scale = colors.densityScale;
    const map = new Map<string, string>();
    for (const c of COUNTRIES) {
      if (!c.population || !c.areaKm2) continue;
      const d = c.population / c.areaKm2;
      const bucket = DENSITY_BREAKS.findIndex((limit) => d < limit);
      map.set(c.id, scale[bucket === -1 ? scale.length - 1 : bucket]);
    }
    return map;
  }, [colors.densityScale]);

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
    [masteryByCca3, colors.densityScale]
  );

  const lambda = useSharedValue(INITIAL_ROTATION.lambda);
  const phi = useSharedValue(INITIAL_ROTATION.phi);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const [rotation, setRotation] = useState<Rotation>(INITIAL_ROTATION);
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

  // Latest values for the tap handler, kept in refs so the gesture objects
  // below can stay stable across the many re-renders a drag causes.
  const onSelectRef = useRef(onSelectCountry);
  onSelectRef.current = onSelectCountry;
  const viewRef = useRef({ rotation, effectiveRadius, cx, cy });
  viewRef.current = { rotation, effectiveRadius, cx, cy };
  const selectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (selectTimer.current) clearTimeout(selectTimer.current);
    },
    []
  );

  const flyToAndSelect = useCallback(
    (code: string) => {
      tapFeedback();
      const country = COUNTRY_BY_ID.get(code);
      if (country) {
        const [lat, lon] = country.latlng;
        // Centering a point at (lon, lat) requires yaw = 90° - lon and
        // pitch = lat exactly — see geo.ts's rotation convention.
        // Take the short way round instead of unwinding accumulated spins.
        const current = lambda.value;
        const target = 90 - lon;
        const delta = ((((target - current) % 360) + 540) % 360) - 180;
        lambda.value = withTiming(current + delta, { duration: 650, easing: Easing.out(Easing.cubic) });
        phi.value = withTiming(Math.max(-80, Math.min(80, lat)), { duration: 650, easing: Easing.out(Easing.cubic) });
      }
      if (selectTimer.current) clearTimeout(selectTimer.current);
      selectTimer.current = setTimeout(() => onSelectRef.current(code), 380);
    },
    [lambda, phi]
  );

  const markers = useMemo(() => {
    return MARKER_COUNTRIES.map((c) => {
      const [lat, lon] = c.latlng;
      const p = project(lon, lat, rotation);
      return {
        code: c.id,
        x: cx + p.x * effectiveRadius,
        y: cy + p.y * effectiveRadius,
        visible: p.visible,
        color: c.accentColor ?? colors.accent,
        focused: c.id === focusedCountryId,
      };
    }).filter((m) => m.visible);
  }, [rotation, effectiveRadius, cx, cy, focusedCountryId, colors.accent]);

  const markersRef = useRef(markers);
  markersRef.current = markers;

  const handleTapAt = useCallback(
    (x: number, y: number) => {
      // Nearest marker within reach — the only way to hit microstates that
      // have no polygon at this map scale.
      let nearest: { code: string; dist: number } | null = null;
      for (const m of markersRef.current) {
        const dist = Math.hypot(m.x - x, m.y - y);
        if (dist <= HIT_RADIUS && (!nearest || dist < nearest.dist)) nearest = { code: m.code, dist };
      }

      // The country whose outline actually contains the tap.
      const view = viewRef.current;
      const lonLat = unproject((x - view.cx) / view.effectiveRadius, (y - view.cy) / view.effectiveRadius, view.rotation);
      const inside = lonLat ? countryAt(lonLat[0], lonLat[1]) : null;

      // Prefer the polygon, unless the nearby marker is a microstate sitting
      // inside or beside it (e.g. San Marino within Italy).
      const markerIsMicrostate = nearest ? !COUNTRY_BY_ID.get(nearest.code)?.hasBorderGeometry : false;
      const target = nearest && (markerIsMicrostate || !inside) ? nearest.code : inside;
      if (target) flyToAndSelect(target);
    },
    [flyToAndSelect]
  );

  const composed = useMemo(() => {
    const pan = Gesture.Pan()
      .minDistance(3)
      .onChange((e) => {
        // Slow the spin down when zoomed in, so a drag tracks the finger.
        const k = DRAG_DEGREES_PER_PX / scale.value;
        lambda.value += e.changeX * k;
        phi.value = Math.max(-80, Math.min(80, phi.value - e.changeY * k));
      });

    const pinch = Gesture.Pinch()
      .onUpdate((e) => {
        scale.value = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, savedScale.value * e.scale));
      })
      .onEnd(() => {
        savedScale.value = scale.value;
      });

    const tap = Gesture.Tap()
      .maxDuration(280)
      .maxDistance(8)
      .onEnd((e, success) => {
        if (success) runOnJS(handleTapAt)(e.x, e.y);
      });

    return Gesture.Simultaneous(Gesture.Race(tap, pan), pinch);
  }, [handleTapAt, lambda, phi, scale, savedScale]);

  const countryShapes = useMemo(() => {
    const shapes: { id: string; d: string; fillColor: string | null }[] = [];
    for (const feature of WORLD_BORDERS) {
      let combined = "";
      for (const ring of feature.outerRings) {
        const d = projectRingToPath(ring, rotation, effectiveRadius, cx, cy);
        if (d) combined += d;
      }
      if (combined) {
        const fillColor =
          layer === "density" ? densityByCca3.get(feature.id) ?? null : layer === "mastery" ? masteryColorFor(feature.id) : null;
        shapes.push({ id: feature.id, d: combined, fillColor });
      }
    }
    return shapes;
  }, [rotation, effectiveRadius, cx, cy, layer, densityByCca3, masteryColorFor]);

  const graticule = useMemo(
    () =>
      GRATICULE.map((r) => projectRingToPath(r, rotation, effectiveRadius, cx, cy, false)).filter((d): d is string => Boolean(d)),
    [rotation, effectiveRadius, cx, cy]
  );

  return (
    <GestureDetector gesture={composed}>
      <View
        style={{ width: size, height: size }}
        accessible
        accessibilityRole="image"
        accessibilityLabel="Interactive globe"
        accessibilityHint="Drag to rotate, pinch to zoom, and tap a country to open it. Use the search button to find a country by name."
      >
        <Svg width={size} height={size}>
          <Defs>
            <RadialGradient id="ocean" cx="32%" cy="28%" r="80%">
              <Stop offset="0%" stopColor={colors.globeHighlight} stopOpacity={1} />
              <Stop offset="55%" stopColor={colors.globeBase} stopOpacity={1} />
              <Stop offset="100%" stopColor={colors.globeEdge} stopOpacity={1} />
            </RadialGradient>
          </Defs>

          <Circle cx={cx} cy={cy} r={effectiveRadius} fill="url(#ocean)" stroke={colors.accent} strokeWidth={1.25} strokeOpacity={0.5} />

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
                strokeLinejoin="round"
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
