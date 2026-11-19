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

/**
 * Inverse of `project` for the visible hemisphere: unit-circle screen
 * coordinates back to [lon, lat]. Returns null outside the globe's disk.
 */
export function unproject(x: number, y: number, rotation: Rotation): [number, number] | null {
  const r2 = x * x + y * y;
  if (r2 > 1) return null;
  const λ = rotation.lambda * DEG2RAD;
  const φ = rotation.phi * DEG2RAD;

  const x1 = x;
  const y2 = -y;
  const z2 = Math.sqrt(1 - r2); // front hemisphere

  // Undo the pitch, then the yaw (each is a plain 2D rotation).
  const py = y2 * Math.cos(φ) + z2 * Math.sin(φ);
  const z1 = -y2 * Math.sin(φ) + z2 * Math.cos(φ);
  const px = x1 * Math.cos(λ) + z1 * Math.sin(λ);
  const pz = -x1 * Math.sin(λ) + z1 * Math.cos(λ);

  const lat = Math.asin(Math.max(-1, Math.min(1, py))) / DEG2RAD;
  const lon = Math.atan2(pz, px) / DEG2RAD;
  return [lon, lat];
}

/**
 * Build an SVG path 'd' string for a ring, projected onto the visible
 * hemisphere. Returns null if the whole ring is on the far side.
 *
 * - `closed` rings (country outlines): points behind the globe are pushed
 *   out to the horizon along their own direction, so a country straddling
 *   the edge is clipped cleanly at the limb instead of its hidden half being
 *   drawn mirrored across the visible face.
 * - Open lines (graticule): hidden stretches are skipped entirely and the
 *   path is never closed, so meridians don't get a chord drawn across them.
 */
export function projectRingToPath(
  ring: Ring,
  rotation: Rotation,
  radius: number,
  cx: number,
  cy: number,
  closed = true
): string | null {
  let anyVisible = false;
  let d = "";
  let penDown = false;

  for (let i = 0; i < ring.length; i++) {
    const [lon, lat] = ring[i];
    const p = project(lon, lat, rotation);
    let px = p.x;
    let py = p.y;

    if (p.visible) {
      anyVisible = true;
    } else if (closed) {
      const r = Math.hypot(px, py);
      if (r > 1e-9) {
        px /= r;
        py /= r;
      }
    } else {
      penDown = false; // lift the pen; the next visible point starts a new segment
      continue;
    }

    const x = (cx + px * radius).toFixed(1);
    const y = (cy + py * radius).toFixed(1);
    d += penDown ? `L${x},${y}` : `M${x},${y}`;
    penDown = true;
  }

  if (!anyVisible) return null;
  return closed ? d + "Z" : d;
}

/**
 * Shifts western longitudes by +360° for rings that straddle the
 * antimeridian (Russia's Chukotka, Fiji), so they become one contiguous shape
 * instead of spanning the whole map. Rings that don't straddle it are
 * returned unchanged.
 */
export function unwrapAntimeridian(rings: Ring[]): Ring[] {
  const lons = rings.flat().map(([lon]) => lon);
  if (lons.length === 0 || Math.max(...lons) - Math.min(...lons) <= 180) return rings;
  return rings.map((ring) => ring.map(([lon, lat]) => [lon < 0 ? lon + 360 : lon, lat] as [number, number]));
}

/** Ray-casting point-in-polygon on a [lon, lat] ring (antimeridian-aware). */
export function pointInRing(point: [number, number], ring: Ring): boolean {
  const [lon0, lat] = point;
  const [unwrapped] = unwrapAntimeridian([ring]);
  const lons = unwrapped === ring ? [lon0] : [lon0, lon0 + 360];
  return lons.some((lon) => {
    let inside = false;
    for (let i = 0, j = unwrapped.length - 1; i < unwrapped.length; j = i++) {
      const [xi, yi] = unwrapped[i];
      const [xj, yj] = unwrapped[j];
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  });
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

/** 1_234_567 -> "1.2M", 9_492 -> "9.5K", 0.44 -> "0.44". Keeps one decimal only where it adds information. */
export function formatCompactNumber(n?: number): string {
  if (n == null || !Number.isFinite(n)) return "—";
  const fmt = (v: number, suffix: string) => `${v >= 100 ? Math.round(v) : Number(v.toFixed(1))}${suffix}`;
  if (n >= 999_950_000) return fmt(n / 1_000_000_000, "B");
  if (n >= 999_950) return fmt(n / 1_000_000, "M");
  if (n >= 1_000) return fmt(n / 1_000, "K");
  return n >= 100 ? String(Math.round(n)) : String(Number(n.toFixed(2)));
}

/** Decimal degrees -> "48.9°N, 2.4°E" for display. */
export function formatLatLng(lat: number, lng: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(1)}°${ns}, ${Math.abs(lng).toFixed(1)}°${ew}`;
}

/**
 * Flattens a country's border rings into SVG path(s) that fill a
 * `size`×`size` box with even padding, preserving aspect ratio — used for
 * the Shapes quiz, where the country is shown on its own rather than
 * rotating on the globe. Longitude is scaled by cos(mid-latitude) so
 * high-latitude countries keep the proportions people know from maps
 * (plain lon→x would make Norway or Canada look twice as wide as they are),
 * and antimeridian-straddling countries are unwrapped first.
 */
export function flattenShapeToPaths(outerRings: [number, number][][], size: number, padding = 16): string[] {
  const rings = unwrapAntimeridian(outerRings);
  const allPoints = rings.flat();
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

  const xScale = Math.max(Math.cos(((minLat + maxLat) / 2) * DEG2RAD), 0.2);
  const spanX = Math.max((maxLon - minLon) * xScale, 0.01);
  const spanY = Math.max(maxLat - minLat, 0.01);
  const drawable = size - padding * 2;
  const scale = Math.min(drawable / spanX, drawable / spanY);

  const offsetX = (size - spanX * scale) / 2;
  const offsetY = (size - spanY * scale) / 2;

  return rings.map((ring) => {
    let d = "";
    ring.forEach(([lon, lat], i) => {
      const x = offsetX + (lon - minLon) * xScale * scale;
      const y = offsetY + (maxLat - lat) * scale; // flip: SVG y grows downward
      d += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return d + "Z";
  });
}
