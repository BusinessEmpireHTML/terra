/**
 * Self-contained orthographic-projection math ("the globe illusion" — how
 * paper atlases and antique globes render a sphere in 2D). No runtime geo
 * library needed: everything here is plain spherical trigonometry, which
 * keeps it fast, dependency-free, and easy to move onto the UI thread later
 * if a device needs it.
 *
 * Coordinate convention: this file always takes (lon, lat) in that order,
 * matching GeoJSON. `Country.latlng` in the data layer is [lat, lon] instead
 * (matching its source dataset) — callers are responsible for swapping when
 * they cross that boundary. See Globe.tsx for the one place that happens.
 */

export type Ring = [number, number][]; // [lon, lat][]

export interface Rotation {
  lambda: number; // yaw, degrees — spin around the vertical axis
  phi: number; // pitch, degrees — tilt the pole toward/away from the viewer
}

const DEG2RAD = Math.PI / 180;

function toUnitSphere(lon: number, lat: number) {
  const λ = lon * DEG2RAD;
  const φ = lat * DEG2RAD;
  return {
    x: Math.cos(φ) * Math.cos(λ),
    y: Math.sin(φ),
    z: Math.cos(φ) * Math.sin(λ),
  };
}

function applyRotation(p: { x: number; y: number; z: number }, rotation: Rotation) {
  const λ = rotation.lambda * DEG2RAD;
  const φ = rotation.phi * DEG2RAD;

  // Yaw around the vertical (Y) axis.
  const x1 = p.x * Math.cos(λ) - p.z * Math.sin(λ);
  const z1 = p.x * Math.sin(λ) + p.z * Math.cos(λ);

  // Pitch around the horizontal (X) axis.
  const y2 = p.y * Math.cos(φ) - z1 * Math.sin(φ);
  const z2 = p.y * Math.sin(φ) + z1 * Math.cos(φ);

  return { x: x1, y: y2, z: z2 };
}

export interface Projected {
  x: number; // in unit-circle space, [-1, 1]
  y: number;
  visible: boolean; // true when on the near hemisphere
}

const HORIZON_EPSILON = -0.03; // lets border lines reach the limb without popping

export function project(lon: number, lat: number, rotation: Rotation): Projected {
  const p = applyRotation(toUnitSphere(lon, lat), rotation);
  return { x: p.x, y: -p.y, visible: p.z > HORIZON_EPSILON };
}

/** Build an SVG path 'd' string for a ring, projected + culled to the visible hemisphere. Returns null if the whole ring is on the far side. */
export function projectRingToPath(
  ring: Ring,
  rotation: Rotation,
  radius: number,
  cx: number,
  cy: number
): string | null {
  let anyVisible = false;
  let d = "";

  for (let i = 0; i < ring.length; i++) {
    const [lon, lat] = ring[i];
    const p = project(lon, lat, rotation);
    if (p.visible) anyVisible = true;
    const x = (cx + p.x * radius).toFixed(1);
    const y = (cy + p.y * radius).toFixed(1);
    d += i === 0 ? `M${x},${y}` : `L${x},${y}`;
  }

  if (!anyVisible) return null;
  return d + "Z";
}

export function angularDistanceDeg(a: [number, number], b: [number, number]): number {
  const [lon1, lat1] = a;
  const [lon2, lat2] = b;
  const φ1 = lat1 * DEG2RAD;
  const φ2 = lat2 * DEG2RAD;
  const Δφ = (lat2 - lat1) * DEG2RAD;
  const Δλ = (lon2 - lon1) * DEG2RAD;
  const h = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return (2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))) / DEG2RAD;
}

/** A simple lat/lon graticule (grid lines), generated on the fly rather than stored. */
export function graticuleRings(stepDeg = 30): Ring[] {
  const rings: Ring[] = [];
  for (let lon = -180; lon < 180; lon += stepDeg) {
    const ring: Ring = [];
    for (let lat = -80; lat <= 80; lat += 4) ring.push([lon, lat]);
    rings.push(ring);
  }
  for (let lat = -60; lat <= 60; lat += stepDeg) {
    const ring: Ring = [];
    for (let lon = -180; lon <= 180; lon += 4) ring.push([lon, lat]);
    rings.push(ring);
  }
  return rings;
}

/** Convert an ISO 3166-1 alpha-2 code to its regional-indicator flag emoji. */
export function flagFromCca2(cca2: string): string {
  return cca2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function formatCompactNumber(n?: number): string {
  if (n == null) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

/**
 * Flattens a country's border rings into SVG path(s) that fill a
 * `size`×`size` box with even padding, preserving aspect ratio — used for
 * the Shapes quiz, where the country is shown on its own rather than
 * rotating on the globe. Plain equirectangular (lon→x, lat→y); at the
 * scale of a single country's silhouette the distortion is negligible.
 */
export function flattenShapeToPaths(outerRings: [number, number][][], size: number, padding = 16): string[] {
  const allPoints = outerRings.flat();
  if (allPoints.length === 0) return [];

  let minLon = Infinity,
    maxLon = -Infinity,
    minLat = Infinity,
    maxLat = -Infinity;
  for (const [lon, lat] of allPoints) {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  const spanLon = Math.max(maxLon - minLon, 0.01);
  const spanLat = Math.max(maxLat - minLat, 0.01);
  const drawable = size - padding * 2;
  const scale = Math.min(drawable / spanLon, drawable / spanLat);

  const offsetX = (size - spanLon * scale) / 2;
  const offsetY = (size - spanLat * scale) / 2;

  return outerRings.map((ring) => {
    let d = "";
    ring.forEach(([lon, lat], i) => {
      const x = offsetX + (lon - minLon) * scale;
      const y = offsetY + (maxLat - lat) * scale; // flip: SVG y grows downward
      d += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return d + "Z";
  });
}
