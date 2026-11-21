/**
 * Geometry for the Skia globe, prepared once at module load in the flat,
 * number-only layout that worklets can capture cheaply and iterate fast:
 * every border point is pre-converted to a unit-sphere (x, y, z) triple, so
 * a frame only has to rotate points, never call trig per point.
 */
import { COUNTRIES } from "../../data/countries";
import worldBordersRaw from "../../data/worldBorders.json";
import { graticuleRings, pointInRing, project, unproject, type Ring, type Rotation } from "../../utils/geo";

interface WorldBorderFeature {
  id: string;
  matched: boolean;
  outerRings: [number, number][][];
}
const WORLD_BORDERS = worldBordersRaw as unknown as WorldBorderFeature[];
const DEG2RAD = Math.PI / 180;
const COUNTRY_BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));

function pushXYZ(out: number[], lon: number, lat: number) {
  const λ = lon * DEG2RAD;
  const φ = lat * DEG2RAD;
  out.push(Math.cos(φ) * Math.cos(λ), Math.sin(φ), Math.cos(φ) * Math.sin(λ));
}

/** Country outlines: rings of points; `ringFeature` maps each ring to its index in FEATURE_IDS. */
export interface RingGeometry {
  xyz: number[];
  ringStart: number[]; // index of the ring's first point
  ringLength: number[];
  ringFeature: number[];
}

function buildRings(rings: { ring: Ring; feature: number }[]): RingGeometry {
  const geometry: RingGeometry = { xyz: [], ringStart: [], ringLength: [], ringFeature: [] };
  let point = 0;
  for (const { ring, feature } of rings) {
    geometry.ringStart.push(point);
    geometry.ringLength.push(ring.length);
    geometry.ringFeature.push(feature);
    for (const [lon, lat] of ring) pushXYZ(geometry.xyz, lon, lat);
    point += ring.length;
  }
  return geometry;
}

/** Feature ids in drawing order (includes unmatched/territory shapes, which are drawn but never selectable). */
export const FEATURE_IDS = WORLD_BORDERS.map((f) => f.id);
export const BORDERS = buildRings(WORLD_BORDERS.flatMap((f, feature) => f.outerRings.map((ring) => ({ ring: ring as Ring, feature }))));
export const GRATICULE = buildRings(graticuleRings(30).map((ring) => ({ ring, feature: -1 })));

/**
 * A bounding cap per border ring: unit-vector center plus angular radius
 * (flat: [x, y, z, radiusRad] per ring). Lets each frame skip rings that are
 * wholly on the far side of the globe, or off-screen when zoomed in, without
 * projecting a single point.
 */
export const RING_CAPS: number[] = [];
for (let r = 0; r < BORDERS.ringStart.length; r++) {
  const start = BORDERS.ringStart[r];
  const n = BORDERS.ringLength[r];
  let sx = 0;
  let sy = 0;
  let sz = 0;
  for (let k = 0; k < n; k++) {
    const i = (start + k) * 3;
    sx += BORDERS.xyz[i];
    sy += BORDERS.xyz[i + 1];
    sz += BORDERS.xyz[i + 2];
  }
  const len = Math.hypot(sx, sy, sz) || 1;
  const cx = sx / len;
  const cy = sy / len;
  const cz = sz / len;
  let maxAngle = 0;
  for (let k = 0; k < n; k++) {
    const i = (start + k) * 3;
    const dot = cx * BORDERS.xyz[i] + cy * BORDERS.xyz[i + 1] + cz * BORDERS.xyz[i + 2];
    maxAngle = Math.max(maxAngle, Math.acos(Math.max(-1, Math.min(1, dot))));
  }
  RING_CAPS.push(cx, cy, cz, maxAngle);
}

/**
 * The point on the unit sphere under unit-circle screen coords (u, v) for
 * rotation (lambda, phi) in degrees, or null off the globe. Same math as
 * utils/geo's unproject, returning a vector so worklets can use it directly.
 */
export function screenToSphere(u: number, v: number, lambdaDeg: number, phiDeg: number): [number, number, number] | null {
  "worklet";
  const r2 = u * u + v * v;
  if (r2 >= 1) return null;
  const λ = (lambdaDeg * Math.PI) / 180;
  const φ = (phiDeg * Math.PI) / 180;
  const x1 = -u;
  const y2 = -v;
  const z2 = Math.sqrt(1 - r2);
  const py = y2 * Math.cos(φ) + z2 * Math.sin(φ);
  const z1 = -y2 * Math.sin(φ) + z2 * Math.cos(φ);
  return [x1 * Math.cos(λ) + z1 * Math.sin(λ), py, -x1 * Math.sin(λ) + z1 * Math.cos(λ)];
}

/**
 * The rotation (lambda, phi in degrees) that puts sphere point `p` at
 * unit-circle screen coords (u, v), choosing the solution nearest the current
 * rotation. This is what makes dragging feel attached to the finger: the spot
 * you grabbed stays under it, at any zoom. Returns null when no rotation can
 * (e.g. the finger left the globe, or the point would need the pole to tip
 * past ±80°).
 */
export function solveAnchorRotation(
  p: [number, number, number],
  u: number,
  v: number,
  currentLambda: number,
  currentPhi: number
): [number, number] | null {
  "worklet";
  const r2 = u * u + v * v;
  if (r2 >= 1) return null;
  const x1 = -u;
  const y2 = -v;
  const z2 = Math.sqrt(1 - r2);
  const rho2 = p[0] * p[0] + p[2] * p[2];
  if (x1 * x1 > rho2) return null;
  const alpha = Math.atan2(p[2], p[0]);
  const RAD = 180 / Math.PI;

  let best: [number, number] | null = null;
  let bestCost = Infinity;
  for (const sign of [1, -1]) {
    const z1 = sign * Math.sqrt(rho2 - x1 * x1);
    let lambda = (Math.atan2(z1, x1) - alpha) * RAD;
    let phi = (Math.atan2(z2, y2) - Math.atan2(z1, p[1])) * RAD;
    phi = ((((phi + 180) % 360) + 360) % 360) - 180;
    if (phi < -80 || phi > 80) continue;
    lambda = currentLambda + ((((lambda - currentLambda) % 360) + 540) % 360) - 180;
    const cost = Math.abs(lambda - currentLambda) + Math.abs(phi - currentPhi);
    if (cost < bestCost) {
      bestCost = cost;
      best = [lambda, phi];
    }
  }
  return best;
}

/** One marker per country at its centroid (the only way to reach microstates without outlines). */
export const MARKER_IDS = COUNTRIES.map((c) => c.id);
export const MARKER_XYZ: number[] = [];
for (const c of COUNTRIES) pushXYZ(MARKER_XYZ, c.latlng[1], c.latlng[0]);

/** "#RRGGBB" -> 0xAARRGGBB, the integer form Skia.Color accepts (cheap to pass into worklets). */
export function hexToArgb(hex: string, alpha = 1): number {
  const rgb = parseInt(hex.replace("#", "").slice(0, 6), 16);
  return ((Math.round(alpha * 255) << 24) | rgb) >>> 0;
}

/** Yaw/pitch that put (lat, lon) at the center of the globe — see geo.ts's rotation convention. */
export function rotationToCenter(lat: number, lon: number): Rotation {
  return { lambda: 90 - lon, phi: Math.max(-80, Math.min(80, lat)) };
}

/** Shortest equivalent of `target` relative to `current`, so a fly-to never unwinds several accumulated spins. */
export function nearestAngle(current: number, target: number): number {
  const delta = ((((target - current) % 360) + 540) % 360) - 180;
  return current + delta;
}

// ---- Hit testing (JS thread, only on tap) ------------------------------------

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

/** The country whose outline contains (lon, lat), if any. */
export function countryAt(lon: number, lat: number): string | null {
  for (const shape of HIT_SHAPES) {
    for (const { ring, minLat, maxLat } of shape.rings) {
      if (lat < minLat || lat > maxLat) continue;
      if (pointInRing([lon, lat], ring)) return shape.id;
    }
  }
  return null;
}

export interface GlobeView {
  rotation: Rotation;
  radius: number; // effective (zoomed) radius in px
  cx: number;
  cy: number;
}

export interface GlobeHit {
  /** The country that was tapped, or null for open ocean / outside the globe. */
  countryId: string | null;
  /** Where on Earth the tap landed, or null if it missed the globe entirely. */
  lonLat: [number, number] | null;
  /** Every country whose marker is within reach of the tap, nearest first. */
  nearbyIds: string[];
}

const MARKER_HIT_RADIUS = 16; // px — generous tap target for small markers

/**
 * Resolves a tap at view coordinates (x, y). Prefers the outline that
 * contains the tap, unless a marker for a microstate (no outline at this map
 * scale) is within reach — so San Marino stays tappable inside Italy.
 */
export function hitTest(x: number, y: number, view: GlobeView): GlobeHit {
  const lonLat = unproject((x - view.cx) / view.radius, (y - view.cy) / view.radius, view.rotation);

  const near: { id: string; dist: number }[] = [];
  for (const c of COUNTRIES) {
    const p = project(c.latlng[1], c.latlng[0], view.rotation);
    if (!p.visible) continue;
    const dist = Math.hypot(view.cx + p.x * view.radius - x, view.cy + p.y * view.radius - y);
    if (dist <= MARKER_HIT_RADIUS) near.push({ id: c.id, dist });
  }
  near.sort((a, b) => a.dist - b.dist);
  const nearest = near[0];

  const inside = lonLat ? countryAt(lonLat[0], lonLat[1]) : null;
  const markerIsMicrostate = nearest ? !COUNTRY_BY_ID.get(nearest.id)?.hasBorderGeometry : false;
  const countryId = nearest && (markerIsMicrostate || !inside) ? nearest.id : inside;
  return { countryId, lonLat, nearbyIds: near.map((n) => n.id) };
}
