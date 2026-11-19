import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import {
  Canvas,
  createPicture,
  PaintStyle,
  Picture,
  Skia,
  StrokeJoin,
  TileMode,
  type SkCanvas,
  type SkPathBuilder,
} from "@shopify/react-native-skia";
import { Easing, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import {
  GestureDetector,
  useCompetingGestures,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
  useTapGesture,
} from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { COUNTRIES } from "../../data/countries";
import { useTheme } from "../../theme/ThemeProvider";
import { tapFeedback } from "../../utils/haptics";
import { BORDERS, FEATURE_IDS, GRATICULE, hexToArgb, hitTest, MARKER_IDS, MARKER_XYZ, nearestAngle, rotationToCenter } from "./globeData";
import { DENSITY_BREAKS, type GlobeProps } from "./globeTypes";

const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));
const MIN_ZOOM = 0.7;
const MAX_ZOOM = 2.6;
const DRAG_DEGREES_PER_PX = 0.28;
const INITIAL_ROTATION = { lambda: -20, phi: -12 };
const FLY_MS = 650;
/** Points slightly behind the limb still count as visible so outlines reach the edge without popping. */
const HORIZON = -0.03;
const DEG2RAD = Math.PI / 180;

/** Everything a frame needs besides the rotation, as plain numbers/arrays (cheap to hand to the UI thread). */
interface FrameStyle {
  size: number;
  radius: number;
  ocean: [number, number, number];
  accent: number;
  background: number;
  outlineAlpha: number;
  groupColors: number[];
  groupAlphas: number[];
  /** Per feature (FEATURE_IDS order): index into groupColors, or -1 for no fill. */
  featureGroup: number[];
  markerColors: number[];
  /** Per marker (MARKER_IDS order): ARGB of a halo to draw, or 0 for none. */
  markerHalo: number[];
}

type Pt = { x: number; y: number };

/**
 * Projects a closed ring onto the visible hemisphere. Hidden points are
 * pushed out to the horizon along their own direction, so a country that
 * straddles the edge is clipped at the limb instead of being mirrored across
 * the face. Returns null when the whole ring is on the far side.
 */
function projectClosed(xyz: number[], start: number, length: number, t: number[], R: number, cx: number, cy: number): Pt[] | null {
  "worklet";
  const [cosL, sinL, cosP, sinP] = t;
  const pts: Pt[] = new Array(length);
  let anyVisible = false;
  for (let k = 0; k < length; k++) {
    const i = (start + k) * 3;
    const x = xyz[i];
    const y = xyz[i + 1];
    const z = xyz[i + 2];
    const x1 = x * cosL - z * sinL;
    const z1 = x * sinL + z * cosL;
    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;
    let px = x1;
    let py = -y2;
    if (z2 > HORIZON) {
      anyVisible = true;
    } else {
      const r = Math.sqrt(px * px + py * py);
      if (r > 1e-9) {
        px /= r;
        py /= r;
      }
    }
    pts[k] = { x: cx + px * R, y: cy + py * R };
  }
  return anyVisible ? pts : null;
}

/** Adds an open polyline (graticule), skipping hidden stretches so nothing is drawn across the globe. */
function addOpenLine(builder: SkPathBuilder, xyz: number[], start: number, length: number, t: number[], R: number, cx: number, cy: number) {
  "worklet";
  const [cosL, sinL, cosP, sinP] = t;
  let run: Pt[] = [];
  for (let k = 0; k < length; k++) {
    const i = (start + k) * 3;
    const x = xyz[i];
    const y = xyz[i + 1];
    const z = xyz[i + 2];
    const x1 = x * cosL - z * sinL;
    const z1 = x * sinL + z * cosL;
    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;
    if (z2 > HORIZON) {
      run.push({ x: cx + x1 * R, y: cy - y2 * R });
    } else {
      if (run.length > 1) builder.addPoly(run, false);
      run = [];
    }
  }
  if (run.length > 1) builder.addPoly(run, false);
}

/** Draws one frame of the globe. Runs on the UI thread (a worklet), so dragging never re-renders React. */
function drawGlobe(canvas: SkCanvas, lambdaDeg: number, phiDeg: number, zoom: number, s: FrameStyle) {
  "worklet";
  const R = s.radius * zoom;
  const cx = s.size / 2;
  const cy = s.size / 2;
  const lam = lambdaDeg * DEG2RAD;
  const ph = phiDeg * DEG2RAD;
  const t = [Math.cos(lam), Math.sin(lam), Math.cos(ph), Math.sin(ph)];

  const fill = Skia.Paint();
  fill.setAntiAlias(true);
  fill.setStyle(PaintStyle.Fill);
  const stroke = Skia.Paint();
  stroke.setAntiAlias(true);
  stroke.setStyle(PaintStyle.Stroke);
  stroke.setStrokeJoin(StrokeJoin.Round);

  // Ocean: a radial gradient lit from the upper left, like an engraved brass globe.
  fill.setShader(
    Skia.Shader.MakeRadialGradient(
      { x: cx - 0.36 * R, y: cy - 0.44 * R },
      1.6 * R,
      [Skia.Color(s.ocean[0]), Skia.Color(s.ocean[1]), Skia.Color(s.ocean[2])],
      [0, 0.55, 1],
      TileMode.Clamp
    )
  );
  canvas.drawCircle(cx, cy, R, fill);
  fill.setShader(null);

  stroke.setColor(Skia.Color(s.accent));
  stroke.setAlphaf(0.5);
  stroke.setStrokeWidth(1.25);
  canvas.drawCircle(cx, cy, R, stroke);

  // Graticule.
  const grat = Skia.PathBuilder.Make();
  for (let r = 0; r < GRATICULE.ringStart.length; r++) {
    addOpenLine(grat, GRATICULE.xyz, GRATICULE.ringStart[r], GRATICULE.ringLength[r], t, R, cx, cy);
  }
  stroke.setAlphaf(0.08);
  stroke.setStrokeWidth(0.5);
  canvas.drawPath(grat.detach(), stroke);

  // Countries: one outline path for everything, one fill path per color group.
  const outline = Skia.PathBuilder.Make();
  const fills: SkPathBuilder[] = [];
  for (let g = 0; g < s.groupColors.length; g++) fills.push(Skia.PathBuilder.Make());
  for (let r = 0; r < BORDERS.ringStart.length; r++) {
    const pts = projectClosed(BORDERS.xyz, BORDERS.ringStart[r], BORDERS.ringLength[r], t, R, cx, cy);
    if (!pts) continue;
    outline.addPoly(pts, true);
    const g = s.featureGroup[BORDERS.ringFeature[r]];
    if (g >= 0) fills[g].addPoly(pts, true);
  }
  for (let g = 0; g < fills.length; g++) {
    fill.setColor(Skia.Color(s.groupColors[g]));
    fill.setAlphaf(s.groupAlphas[g]);
    canvas.drawPath(fills[g].detach(), fill);
  }
  stroke.setColor(Skia.Color(s.accent));
  stroke.setAlphaf(s.outlineAlpha);
  stroke.setStrokeWidth(0.75);
  canvas.drawPath(outline.detach(), stroke);

  // Markers at each country's centroid.
  const [cosL, sinL, cosP, sinP] = t;
  stroke.setColor(Skia.Color(s.background));
  stroke.setAlphaf(1);
  for (let m = 0; m < s.markerColors.length; m++) {
    const i = m * 3;
    const x = MARKER_XYZ[i];
    const y = MARKER_XYZ[i + 1];
    const z = MARKER_XYZ[i + 2];
    const x1 = x * cosL - z * sinL;
    const z1 = x * sinL + z * cosL;
    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;
    if (z2 <= HORIZON) continue;
    const mx = cx + x1 * R;
    const my = cy - y2 * R;
    const halo = s.markerHalo[m];
    if (halo !== 0) {
      fill.setColor(Skia.Color(halo));
      fill.setAlphaf(0.28);
      canvas.drawCircle(mx, my, 12, fill);
    }
    const r = halo !== 0 ? 5.5 : 3.5;
    fill.setColor(Skia.Color(s.markerColors[m]));
    fill.setAlphaf(0.95);
    canvas.drawCircle(mx, my, r, fill);
    stroke.setStrokeWidth(0.75);
    canvas.drawCircle(mx, my, r, stroke);
  }
}

export default function GlobeCanvas({
  size,
  layer = "political",
  focusedCountryId,
  masteryByCca3,
  highlights,
  flyToCountryId,
  onSelectCountry,
  onTap,
}: GlobeProps) {
  const { colors } = useTheme();
  const radius = size / 2;

  const lambda = useSharedValue(INITIAL_ROTATION.lambda);
  const phi = useSharedValue(INITIAL_ROTATION.phi);
  const zoom = useSharedValue(1);
  const savedZoom = useSharedValue(1);

  // ---- Colors for this render (recomputed only when data/theme change) ----
  const style = useMemo<FrameStyle>(() => {
    const scale = colors.densityScale.map((c) => hexToArgb(c));
    const highlightColor = { correct: hexToArgb(colors.accentSecondary), wrong: hexToArgb(colors.ember) };
    // Groups 0–4: the layer's sequential scale. Groups 5–6: game highlights.
    const groupColors = [...scale, highlightColor.correct, highlightColor.wrong];
    const groupAlphas = [0.65, 0.65, 0.65, 0.65, 0.65, 0.8, 0.8];
    const HIGHLIGHT_GROUP = { correct: 5, wrong: 6 } as const;

    const featureGroup = FEATURE_IDS.map((id) => {
      const highlight = highlights?.[id];
      if (highlight) return HIGHLIGHT_GROUP[highlight];
      if (layer === "density") {
        const c = COUNTRY_BY_ID.get(id);
        if (!c?.population || !c.areaKm2) return -1;
        const d = c.population / c.areaKm2;
        const bucket = DENSITY_BREAKS.findIndex((limit) => d < limit);
        return bucket === -1 ? DENSITY_BREAKS.length : bucket;
      }
      if (layer === "mastery") {
        // Unlit until practiced, then warming up through the scale as the score rises.
        const score = masteryByCca3?.get(id) ?? 0;
        if (score <= 0) return -1;
        return Math.min(4, Math.floor(score / 20));
      }
      return -1;
    });

    const markerColors = MARKER_IDS.map((id) => hexToArgb(COUNTRY_BY_ID.get(id)?.accentColor ?? colors.accent));
    const markerHalo = MARKER_IDS.map((id) => {
      const highlight = highlights?.[id];
      // Microstates have no outline to fill, so a highlight shows as a halo instead.
      if (highlight && !COUNTRY_BY_ID.get(id)?.hasBorderGeometry) return highlightColor[highlight];
      if (id === focusedCountryId) return markerColors[MARKER_IDS.indexOf(id)];
      return 0;
    });

    return {
      size,
      radius,
      ocean: [hexToArgb(colors.globeHighlight), hexToArgb(colors.globeBase), hexToArgb(colors.globeEdge)],
      accent: hexToArgb(colors.accent),
      background: hexToArgb(colors.background),
      outlineAlpha: layer === "political" ? 0.55 : 0.35,
      groupColors,
      groupAlphas,
      featureGroup,
      markerColors,
      markerHalo,
    };
  }, [colors, layer, masteryByCca3, highlights, focusedCountryId, size, radius]);

  const picture = useDerivedValue(
    () => createPicture((canvas) => drawGlobe(canvas, lambda.value, phi.value, zoom.value, style), { width: size, height: size }),
    [style, size]
  );

  // ---- Fly-to ----
  const flyTo = useCallback(
    (cca3: string) => {
      const country = COUNTRY_BY_ID.get(cca3);
      if (!country) return;
      const target = rotationToCenter(country.latlng[0], country.latlng[1]);
      const timing = { duration: FLY_MS, easing: Easing.out(Easing.cubic) };
      lambda.value = withTiming(nearestAngle(lambda.value, target.lambda), timing);
      phi.value = withTiming(target.phi, timing);
    },
    [lambda, phi]
  );

  useEffect(() => {
    if (flyToCountryId) flyTo(flyToCountryId);
  }, [flyToCountryId, flyTo]);

  // ---- Taps (resolved on the JS thread; only happens once per tap) ----
  const onTapRef = useRef(onTap);
  onTapRef.current = onTap;
  const onSelectRef = useRef(onSelectCountry);
  onSelectRef.current = onSelectCountry;
  const selectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (selectTimer.current) clearTimeout(selectTimer.current);
    },
    []
  );

  const handleTap = useCallback(
    (x: number, y: number, l: number, p: number, z: number) => {
      const hit = hitTest(x, y, { rotation: { lambda: l, phi: p }, radius: radius * z, cx: radius, cy: radius });
      if (onTapRef.current) {
        onTapRef.current(hit);
        return;
      }
      const id = hit.countryId;
      if (!id) return;
      tapFeedback();
      flyTo(id);
      if (selectTimer.current) clearTimeout(selectTimer.current);
      selectTimer.current = setTimeout(() => onSelectRef.current?.(id), 380);
    },
    [radius, flyTo]
  );

  // ---- Gestures (callbacks are UI-thread worklets) ----
  const pan = usePanGesture({
    minDistance: 3,
    onUpdate: (e) => {
      "worklet";
      // Slow the spin when zoomed in, so a drag keeps tracking the finger.
      const k = DRAG_DEGREES_PER_PX / zoom.value;
      lambda.value += e.changeX * k;
      phi.value = Math.max(-80, Math.min(80, phi.value - e.changeY * k));
    },
  });
  const pinch = usePinchGesture({
    onUpdate: (e) => {
      "worklet";
      zoom.value = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, savedZoom.value * e.scale));
    },
    onDeactivate: () => {
      "worklet";
      savedZoom.value = zoom.value;
    },
  });
  const tap = useTapGesture({
    maxDuration: 280,
    maxDistance: 8,
    onActivate: (e) => {
      "worklet";
      scheduleOnRN(handleTap, e.x, e.y, lambda.value, phi.value, zoom.value);
    },
  });
  const gesture = useSimultaneousGestures(useCompetingGestures(tap, pan), pinch);

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={{ width: size, height: size }}
        accessible
        accessibilityRole="image"
        accessibilityLabel="Interactive globe"
        accessibilityHint={
          onTap
            ? "Drag to rotate and pinch to zoom, then tap where you think the country is."
            : "Drag to rotate, pinch to zoom, and tap a country to open it. Use the search button to find a country by name."
        }
      >
        <Canvas style={{ width: size, height: size }}>
          <Picture picture={picture} />
        </Canvas>
      </View>
    </GestureDetector>
  );
}
