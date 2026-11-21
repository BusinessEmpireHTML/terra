import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import {
  BlendMode,
  Canvas,
  createPicture,
  PaintStyle,
  Picture,
  Skia,
  StrokeCap,
  StrokeJoin,
  TileMode,
  type SkCanvas,
  type SkPathBuilder,
} from "@shopify/react-native-skia";
import { cancelAnimation, Easing, useDerivedValue, useSharedValue, withDecay, withTiming } from "react-native-reanimated";
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
import {
  BORDERS,
  FEATURE_IDS,
  GRATICULE,
  hexToArgb,
  hitTest,
  MARKER_IDS,
  MARKER_XYZ,
  nearestAngle,
  RING_CAPS,
  rotationToCenter,
  screenToSphere,
  solveAnchorRotation,
} from "./globeData";
import { DENSITY_BREAKS, POPULATION_BREAKS, type GlobeProps } from "./globeTypes";

const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));
const MIN_ZOOM = 0.7;
/** Deep enough that Luxembourg or Slovenia fills a fingertip. */
const MAX_ZOOM = 12;
const INITIAL_ROTATION = { lambda: -20, phi: -12 };
const FLY_MS = 650;
/** Friction for the spin that continues after a flick (closer to 1 = longer glide). */
const FLICK_DECELERATION = 0.994;
/** Soft fade at the viewport's edges, so a zoomed-in globe never ends in a hard box. */
const EDGE_FADE = 28;
/** Points slightly behind the limb still count as visible so outlines reach the edge without popping. */
const HORIZON = -0.03;
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/** Everything a frame needs besides the rotation, as plain numbers/arrays (cheap to hand to the UI thread). */
interface FrameStyle {
  width: number;
  height: number;
  radius: number;
  ocean: [number, number, number];
  accent: number;
  background: number;
  outlineAlpha: number;
  groupColors: number[];
  groupAlphas: number[];
  /** Per feature (FEATURE_IDS order): index into groupColors, or -1 for no fill. */
  featureGroup: number[];
  /** Distinct marker colors, and each marker's index into them (markers are drawn one path per color). */
  markerColors: number[];
  markerGroup: number[];
  /** Per marker (MARKER_IDS order): ARGB of a halo to draw, or 0 for none. */
  markerHalo: number[];
  /** Wrong-guess dots as flat unit vectors, and the hint arrow as [from xyz, toward xyz] (empty when none). */
  guessXYZ: number[];
  arrowXYZ: number[];
  guessColor: number;
  arrowColor: number;
}

function lonLatToXYZ([lon, lat]: [number, number]): [number, number, number] {
  const λ = lon * DEG2RAD;
  const φ = lat * DEG2RAD;
  return [Math.cos(φ) * Math.cos(λ), Math.sin(φ), Math.cos(φ) * Math.sin(λ)];
}

/** Rotates a unit vector into view: [screen x, screen y, depth (> 0 = facing us)]. */
function toScreen(x: number, y: number, z: number, t: number[], R: number, cx: number, cy: number): [number, number, number] {
  "worklet";
  const [cosL, sinL, cosP, sinP] = t;
  const x1 = x * cosL - z * sinL;
  const z1 = x * sinL + z * cosL;
  const y2 = y * cosP - z1 * sinP;
  const z2 = y * sinP + z1 * cosP;
  return [cx - x1 * R, cy - y2 * R, z2];
}

type Pt = { x: number; y: number };

/**
 * Projects a closed ring onto the visible hemisphere. Hidden points are
 * pushed out to the horizon along their own direction, so a country that
 * straddles the edge is clipped at the limb instead of being mirrored across
 * the face. Returns null when the whole ring is on the far side.
 */
function projectClosed(start: number, length: number, t: number[], R: number, cx: number, cy: number): Pt[] | null {
  "worklet";
  const xyz = BORDERS.xyz;
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
    let px = -x1; // screen x points east; see project() in utils/geo.ts
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
function addOpenLine(builder: SkPathBuilder, start: number, length: number, t: number[], R: number, cx: number, cy: number) {
  "worklet";
  const xyz = GRATICULE.xyz;
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
      run.push({ x: cx - x1 * R, y: cy - y2 * R });
    } else {
      if (run.length > 1) builder.addPoly(run, false);
      run = [];
    }
  }
  if (run.length > 1) builder.addPoly(run, false);
}

/** Fades content toward the two edges along one axis (DstIn keeps the destination where the gradient is opaque). */
function fadeEdges(canvas: SkCanvas, width: number, height: number, vertical: boolean) {
  "worklet";
  const length = vertical ? height : width;
  const f = Math.min(0.45, EDGE_FADE / length);
  const paint = Skia.Paint();
  paint.setBlendMode(BlendMode.DstIn);
  paint.setShader(
    Skia.Shader.MakeLinearGradient(
      { x: 0, y: 0 },
      vertical ? { x: 0, y: height } : { x: width, y: 0 },
      [Skia.Color(0x00000000), Skia.Color(0xff000000), Skia.Color(0xff000000), Skia.Color(0x00000000)],
      [0, f, 1 - f, 1],
      TileMode.Clamp
    )
  );
  canvas.drawRect(Skia.XYWHRect(0, 0, width, height), paint);
}

/** Draws one frame of the globe. Runs on the UI thread (a worklet), so dragging never re-renders React. */
function drawGlobe(canvas: SkCanvas, lambdaDeg: number, phiDeg: number, zoom: number, s: FrameStyle) {
  "worklet";
  const R = s.radius * zoom;
  const cx = s.width / 2;
  const cy = s.height / 2;
  const lam = lambdaDeg * DEG2RAD;
  const ph = phiDeg * DEG2RAD;
  const cosL = Math.cos(lam);
  const sinL = Math.sin(lam);
  const cosP = Math.cos(ph);
  const sinP = Math.sin(ph);
  const t = [cosL, sinL, cosP, sinP];
  // Direction toward the viewer in unrotated coordinates, for back-face culling.
  const vx = cosP * sinL;
  const vy = sinP;
  const vz = cosP * cosL;

  const fadeVertical = cy - R < EDGE_FADE || cy + R > s.height - EDGE_FADE;
  const fadeHorizontal = cx - R < EDGE_FADE || cx + R > s.width - EDGE_FADE;
  if (fadeVertical || fadeHorizontal) canvas.saveLayer();

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
    addOpenLine(grat, GRATICULE.ringStart[r], GRATICULE.ringLength[r], t, R, cx, cy);
  }
  stroke.setAlphaf(0.08);
  stroke.setStrokeWidth(0.5);
  canvas.drawPath(grat.detach(), stroke);

  // Countries: one outline path for everything, one fill path per color group.
  const outline = Skia.PathBuilder.Make();
  const fills: SkPathBuilder[] = [];
  for (let g = 0; g < s.groupColors.length; g++) fills.push(Skia.PathBuilder.Make());
  for (let r = 0; r < BORDERS.ringStart.length; r++) {
    const ccx = RING_CAPS[r * 4];
    const ccy = RING_CAPS[r * 4 + 1];
    const ccz = RING_CAPS[r * 4 + 2];
    const angle = RING_CAPS[r * 4 + 3];
    if (angle < Math.PI / 2) {
      const facing = ccx * vx + ccy * vy + ccz * vz;
      const capSin = Math.sin(angle);
      // Entirely behind the globe: skip without projecting anything.
      if (facing < -capSin - 0.05) continue;
      // Entirely in front: skip if its bounding circle is off-screen (matters when zoomed in).
      if (facing > capSin + 0.05) {
        const x1 = ccx * cosL - ccz * sinL;
        const z1 = ccx * sinL + ccz * cosL;
        const y2 = ccy * cosP - z1 * sinP;
        const sx = cx - x1 * R;
        const sy = cy - y2 * R;
        const reach = 2 * Math.sin(angle / 2) * R + 2;
        if (sx + reach < 0 || sx - reach > s.width || sy + reach < 0 || sy - reach > s.height) continue;
      }
    }
    const pts = projectClosed(BORDERS.ringStart[r], BORDERS.ringLength[r], t, R, cx, cy);
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

  // Markers at each country's centroid, batched into one path per color plus one shared outline.
  const markerR = 3.5 + Math.min(1.5, Math.max(0, zoom - 1) * 0.25);
  const dots: (SkPathBuilder | null)[] = new Array(s.markerColors.length).fill(null);
  const rings = Skia.PathBuilder.Make();
  for (let m = 0; m < MARKER_IDS.length; m++) {
    const i = m * 3;
    const x = MARKER_XYZ[i];
    const y = MARKER_XYZ[i + 1];
    const z = MARKER_XYZ[i + 2];
    const x1 = x * cosL - z * sinL;
    const z1 = x * sinL + z * cosL;
    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;
    if (z2 <= HORIZON) continue;
    const mx = cx - x1 * R;
    const my = cy - y2 * R;
    if (mx < -12 || mx > s.width + 12 || my < -12 || my > s.height + 12) continue;
    const halo = s.markerHalo[m];
    const r = halo !== 0 ? markerR + 2 : markerR;
    if (halo !== 0) {
      fill.setColor(Skia.Color(halo));
      fill.setAlphaf(0.28);
      canvas.drawCircle(mx, my, 12, fill);
    }
    const g = s.markerGroup[m];
    let dot = dots[g];
    if (!dot) {
      dot = Skia.PathBuilder.Make();
      dots[g] = dot;
    }
    dot.addCircle(mx, my, r);
    rings.addCircle(mx, my, r);
  }
  fill.setAlphaf(1);
  for (let g = 0; g < dots.length; g++) {
    const dot = dots[g];
    if (!dot) continue;
    fill.setColor(Skia.Color(s.markerColors[g]));
    fill.setAlphaf(0.95);
    canvas.drawPath(dot.detach(), fill);
  }
  stroke.setColor(Skia.Color(s.background));
  stroke.setAlphaf(1);
  stroke.setStrokeWidth(0.75);
  canvas.drawPath(rings.detach(), stroke);

  // Find it: dots where wrong guesses landed…
  for (let i = 0; i < s.guessXYZ.length; i += 3) {
    const [gx, gy, gz] = toScreen(s.guessXYZ[i], s.guessXYZ[i + 1], s.guessXYZ[i + 2], t, R, cx, cy);
    if (gz <= HORIZON) continue;
    fill.setColor(Skia.Color(s.guessColor));
    fill.setAlphaf(1);
    canvas.drawCircle(gx, gy, 6, fill);
    stroke.setStrokeWidth(1.5);
    canvas.drawCircle(gx, gy, 6, stroke);
  }
  // …and an arrow from the latest one, aimed along the shortest route to the answer.
  if (s.arrowXYZ.length === 6) {
    const a = s.arrowXYZ;
    const [ax, ay, az] = toScreen(a[0], a[1], a[2], t, R, cx, cy);
    const [bx, by] = toScreen(a[3], a[4], a[5], t, R, cx, cy);
    const len = Math.hypot(bx - ax, by - ay);
    if (az > HORIZON && len > 1e-6) {
      const ux = (bx - ax) / len;
      const uy = (by - ay) / len;
      const nx = -uy;
      const ny = ux;
      const shaft = Skia.PathBuilder.Make();
      shaft.moveTo(ax + ux * 10, ay + uy * 10);
      shaft.lineTo(ax + ux * 42, ay + uy * 42);
      const head = Skia.PathBuilder.Make();
      head.addPoly(
        [
          { x: ax + ux * 56, y: ay + uy * 56 },
          { x: ax + ux * 40 + nx * 8, y: ay + uy * 40 + ny * 8 },
          { x: ax + ux * 40 - nx * 8, y: ay + uy * 40 - ny * 8 },
        ],
        true
      );
      const shaftPath = shaft.detach();
      const headPath = head.detach();
      // Dark underlay first, so the arrow reads on any background.
      stroke.setStrokeCap(StrokeCap.Round);
      stroke.setColor(Skia.Color(s.background));
      stroke.setAlphaf(0.9);
      stroke.setStrokeWidth(6);
      canvas.drawPath(shaftPath, stroke);
      stroke.setStrokeWidth(3);
      canvas.drawPath(headPath, stroke);
      stroke.setColor(Skia.Color(s.arrowColor));
      stroke.setAlphaf(1);
      stroke.setStrokeWidth(3);
      canvas.drawPath(shaftPath, stroke);
      fill.setColor(Skia.Color(s.arrowColor));
      fill.setAlphaf(1);
      canvas.drawPath(headPath, fill);
    }
  }

  if (fadeVertical || fadeHorizontal) {
    if (fadeVertical) fadeEdges(canvas, s.width, s.height, true);
    if (fadeHorizontal) fadeEdges(canvas, s.width, s.height, false);
    canvas.restore();
  }
}

export default function GlobeCanvas({
  size,
  width: widthProp,
  height: heightProp,
  layer = "political",
  focusedCountryId,
  masteryByCca3,
  highlights,
  guesses,
  flyToCountryId,
  onSelectCountry,
  onTap,
}: GlobeProps) {
  const { colors } = useTheme();
  const radius = size / 2;
  const width = widthProp ?? size;
  const height = heightProp ?? size;
  const cx = width / 2;
  const cy = height / 2;

  const lambda = useSharedValue(INITIAL_ROTATION.lambda);
  const phi = useSharedValue(INITIAL_ROTATION.phi);
  const zoom = useSharedValue(1);
  const savedZoom = useSharedValue(1);
  /** Sphere point under the dragging finger (null when the finger is off the globe). */
  const dragAnchor = useSharedValue<[number, number, number] | null>(null);
  /** Sphere point under the pinch's focal point, kept there while zooming. */
  const pinchAnchor = useSharedValue<[number, number, number] | null>(null);
  const pinching = useSharedValue(false);

  // ---- Colors for this render (recomputed only when data/theme change) ----
  const style = useMemo<FrameStyle>(() => {
    const scale = colors.densityScale.map((c) => hexToArgb(c));
    const highlightColor = { correct: hexToArgb(colors.accentSecondary), wrong: hexToArgb(colors.ember) };
    // Groups 0–4: the layer's sequential scale. Groups 5–6: game highlights.
    const groupColors = [...scale, highlightColor.correct, highlightColor.wrong];
    const groupAlphas = [0.65, 0.65, 0.65, 0.65, 0.65, 0.8, 0.8];
    const HIGHLIGHT_GROUP = { correct: 5, wrong: 6 } as const;
    const bucket = (value: number, breaks: readonly number[]) => {
      const i = breaks.findIndex((limit) => value < limit);
      return i === -1 ? breaks.length : i;
    };

    const featureGroup = FEATURE_IDS.map((id) => {
      const highlight = highlights?.[id];
      if (highlight) return HIGHLIGHT_GROUP[highlight];
      const c = COUNTRY_BY_ID.get(id);
      if (layer === "population") return c?.population ? bucket(c.population, POPULATION_BREAKS) : -1;
      if (layer === "density") return c?.population && c.areaKm2 ? bucket(c.population / c.areaKm2, DENSITY_BREAKS) : -1;
      if (layer === "mastery") {
        // Unlit until practiced, then warming up through the scale as the score rises.
        const score = masteryByCca3?.get(id) ?? 0;
        return score <= 0 ? -1 : Math.min(4, Math.floor(score / 20));
      }
      return -1;
    });

    const markerColorOf = (id: string) => hexToArgb(COUNTRY_BY_ID.get(id)?.accentColor ?? colors.accent);
    const markerColors: number[] = [];
    const markerGroup = MARKER_IDS.map((id) => {
      const color = markerColorOf(id);
      let g = markerColors.indexOf(color);
      if (g === -1) g = markerColors.push(color) - 1;
      return g;
    });
    const markerHalo = MARKER_IDS.map((id) => {
      const highlight = highlights?.[id];
      // Microstates have no outline to fill, so a highlight shows as a halo instead.
      if (highlight && !COUNTRY_BY_ID.get(id)?.hasBorderGeometry) return highlightColor[highlight];
      if (id === focusedCountryId) return markerColorOf(id);
      return 0;
    });

    const guessXYZ = (guesses ?? []).flatMap((g) => lonLatToXYZ(g.at));
    const withArrow = [...(guesses ?? [])].reverse().find((g) => g.toward);
    const arrowXYZ = withArrow?.toward ? [...lonLatToXYZ(withArrow.at), ...lonLatToXYZ(withArrow.toward)] : [];

    return {
      guessXYZ,
      arrowXYZ,
      guessColor: hexToArgb(colors.ember),
      arrowColor: hexToArgb(colors.accentBright),
      width,
      height,
      radius,
      ocean: [hexToArgb(colors.globeHighlight), hexToArgb(colors.globeBase), hexToArgb(colors.globeEdge)],
      accent: hexToArgb(colors.accent),
      background: hexToArgb(colors.background),
      outlineAlpha: layer === "political" ? 0.55 : 0.35,
      groupColors,
      groupAlphas,
      featureGroup,
      markerColors,
      markerGroup,
      markerHalo,
    };
  }, [colors, layer, masteryByCca3, highlights, guesses, focusedCountryId, width, height, radius]);

  const picture = useDerivedValue(
    () => createPicture((canvas) => drawGlobe(canvas, lambda.value, phi.value, zoom.value, style), { width, height }),
    [style, width, height]
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
      const hit = hitTest(x, y, { rotation: { lambda: l, phi: p }, radius: radius * z, cx, cy });
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
    [radius, cx, cy, flyTo]
  );

  // ---- Gestures (callbacks are UI-thread worklets) ----
  const pan = usePanGesture({
    minDistance: 2,
    maxPointers: 1,
    onBegin: (e) => {
      "worklet";
      // Touching the globe stops any glide or fly-to, and grabs the point under the finger.
      cancelAnimation(lambda);
      cancelAnimation(phi);
      const R = radius * zoom.value;
      dragAnchor.value = screenToSphere((e.x - cx) / R, (e.y - cy) / R, lambda.value, phi.value);
    },
    onUpdate: (e) => {
      "worklet";
      if (pinching.value) return;
      const R = radius * zoom.value;
      const u = (e.x - cx) / R;
      const v = (e.y - cy) / R;
      const grabbed = dragAnchor.value;
      if (grabbed) {
        // Keep the grabbed spot exactly under the finger.
        const rot = solveAnchorRotation(grabbed, u, v, lambda.value, phi.value);
        if (rot) {
          lambda.value = rot[0];
          phi.value = rot[1];
          return;
        }
      }
      // Finger off the globe (or past the pole limit): rotate by the movement instead…
      const k = RAD2DEG / R;
      lambda.value += e.changeX * k;
      phi.value = Math.max(-80, Math.min(80, phi.value + e.changeY * k));
      // …and grab again as soon as the finger is back over the globe.
      dragAnchor.value = screenToSphere(u, v, lambda.value, phi.value);
    },
    onDeactivate: (e) => {
      "worklet";
      if (pinching.value) return;
      // A flick keeps the globe turning, slowing down like a real one.
      const k = RAD2DEG / (radius * zoom.value);
      lambda.value = withDecay({ velocity: e.velocityX * k, deceleration: FLICK_DECELERATION });
      phi.value = withDecay({ velocity: e.velocityY * k, deceleration: FLICK_DECELERATION, clamp: [-80, 80] });
    },
  });
  const pinch = usePinchGesture({
    onBegin: () => {
      "worklet";
      cancelAnimation(lambda);
      cancelAnimation(phi);
    },
    onActivate: (e) => {
      "worklet";
      pinching.value = true;
      savedZoom.value = zoom.value;
      const R = radius * zoom.value;
      pinchAnchor.value = screenToSphere((e.focalX - cx) / R, (e.focalY - cy) / R, lambda.value, phi.value);
    },
    onUpdate: (e) => {
      "worklet";
      zoom.value = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, savedZoom.value * e.scale));
      // Zoom toward the fingers: the spot between them stays put (two-finger drags pan, too).
      const grabbed = pinchAnchor.value;
      if (!grabbed) return;
      const R = radius * zoom.value;
      const rot = solveAnchorRotation(grabbed, (e.focalX - cx) / R, (e.focalY - cy) / R, lambda.value, phi.value);
      if (rot) {
        lambda.value = rot[0];
        phi.value = rot[1];
      }
    },
    onFinalize: () => {
      "worklet";
      pinching.value = false;
      savedZoom.value = zoom.value;
      dragAnchor.value = null; // a finger left on screen re-grabs on its next move
    },
  });
  const tap = useTapGesture({
    maxDuration: 280,
    maxDistance: 10,
    onActivate: (e) => {
      "worklet";
      scheduleOnRN(handleTap, e.x, e.y, lambda.value, phi.value, zoom.value);
    },
  });
  const gesture = useSimultaneousGestures(useCompetingGestures(tap, pan), pinch);

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={{ width, height }}
        accessible
        accessibilityRole="image"
        accessibilityLabel="Interactive globe"
        accessibilityHint={
          onTap
            ? "Drag to rotate and pinch to zoom, then tap where you think the country is."
            : "Drag to rotate, pinch to zoom, and tap a country to open it. Use the search button to find a country by name."
        }
      >
        <Canvas style={{ width, height }}>
          <Picture picture={picture} />
        </Canvas>
      </View>
    </GestureDetector>
  );
}
