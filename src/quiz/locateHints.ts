import { COUNTRIES } from "../data/countries";
import worldBordersRaw from "../data/worldBorders.json";

/**
 * Scoring and "warmer/colder" hints for Find it on the globe: each country
 * gets three tries, and every miss says how far away the country is and in
 * which direction.
 */

export const LOCATE_MAX_TRIES = 3;

/** 3 points on the first try, 2 on the second, 1 on the third, 0 if never found. */
export function locatePoints(found: boolean, attempts: number): number {
  if (!found) return 0;
  return Math.max(1, LOCATE_MAX_TRIES + 1 - Math.max(1, attempts));
}

export const LOCATE_MAX_POINTS = locatePoints(true, 1);

type LonLat = [number, number];
const DEG = Math.PI / 180;
const KM_PER_DEGREE = 111.195; // mean Earth radius × π / 180

const byId = new Map(COUNTRIES.map((c) => [c.id, c]));
const rings = new Map(
  (worldBordersRaw as unknown as { id: string; matched: boolean; outerRings: LonLat[][] }[])
    .filter((f) => f.matched)
    .map((f) => [f.id, f.outerRings])
);

/** Great-circle distance in km. */
export function distanceKm([lon1, lat1]: LonLat, [lon2, lat2]: LonLat): number {
  const φ1 = lat1 * DEG;
  const φ2 = lat2 * DEG;
  const h = Math.sin(((lat2 - lat1) * DEG) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(((lon2 - lon1) * DEG) / 2) ** 2;
  return (2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))) / DEG * KM_PER_DEGREE;
}

/** Initial compass bearing (0 = north, 90 = east) for the shortest route from `from` to `to`. */
export function initialBearing([lon1, lat1]: LonLat, [lon2, lat2]: LonLat): number {
  const φ1 = lat1 * DEG;
  const φ2 = lat2 * DEG;
  const Δλ = (lon2 - lon1) * DEG;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) / DEG) % 360 + 360) % 360;
}

const COMPASS = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"] as const;
export type CompassPoint = (typeof COMPASS)[number];

export function compassName(bearing: number): CompassPoint {
  return COMPASS[Math.round((((bearing % 360) + 360) % 360) / 45) % 8];
}

/**
 * The closest point of a country's outline to `p` (or its centroid, for
 * microstates with no outline at this map scale). Measuring to the nearest
 * edge rather than the middle makes a near miss read as "120 km", not "900 km".
 */
export function nearestPointOfCountry(countryId: string, p: LonLat): { point: LonLat; km: number } {
  const country = byId.get(countryId);
  const outline = rings.get(countryId);
  if (!outline) {
    const centroid: LonLat = country ? [country.latlng[1], country.latlng[0]] : p;
    return { point: centroid, km: distanceKm(p, centroid) };
  }
  // Closest point on each edge in a local equirectangular frame centred on p
  // (accurate at the scale where it matters), then measured on the sphere.
  const [lon0, lat0] = p;
  const k = Math.cos(lat0 * DEG);
  const toXY = ([lon, lat]: LonLat): [number, number] => [((((lon - lon0 + 540) % 360) - 180) * k), lat - lat0];
  let best: LonLat = outline[0][0];
  let bestD2 = Infinity;
  for (const ring of outline) {
    for (let i = 0; i < ring.length - 1; i++) {
      const [ax, ay] = toXY(ring[i]);
      const [bx, by] = toXY(ring[i + 1]);
      const dx = bx - ax;
      const dy = by - ay;
      const len2 = dx * dx + dy * dy;
      const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2));
      const cx = ax + t * dx;
      const cy = ay + t * dy;
      const d2 = cx * cx + cy * cy;
      if (d2 < bestD2) {
        bestD2 = d2;
        best = [lon0 + cx / (k || 1e-9), lat0 + cy];
      }
    }
  }
  return { point: best, km: distanceKm(p, best) };
}

function toVec([lon, lat]: LonLat): [number, number, number] {
  return [Math.cos(lat * DEG) * Math.cos(lon * DEG), Math.sin(lat * DEG), Math.cos(lat * DEG) * Math.sin(lon * DEG)];
}

/**
 * The point `angleDeg` along the great circle from `from` toward `to` (capped
 * at halfway). The globe projects it to aim the hint arrow, so the arrow
 * follows the true shortest route on screen however the globe is turned.
 */
export function pointToward(from: LonLat, to: LonLat, angleDeg: number): LonLat | null {
  const a = toVec(from);
  const b = toVec(to);
  const omega = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
  if (omega < 1e-4 || Math.PI - omega < 1e-4) return null;
  const t = Math.min(angleDeg * DEG, omega / 2) / omega;
  const s = Math.sin(omega);
  const wa = Math.sin((1 - t) * omega) / s;
  const wb = Math.sin(t * omega) / s;
  const v = [wa * a[0] + wb * b[0], wa * a[1] + wb * b[1], wa * a[2] + wb * b[2]];
  return [Math.atan2(v[2], v[0]) / DEG, Math.asin(Math.max(-1, Math.min(1, v[1]))) / DEG];
}

/** From one country (its centre) to another (its nearest edge): how far, and which way. */
export function hintBetween(fromId: string, toId: string): { km: number; bearing: number } {
  const c = byId.get(fromId);
  const from: LonLat = c ? [c.latlng[1], c.latlng[0]] : [0, 0];
  const { point, km } = nearestPointOfCountry(toId, from);
  return { km, bearing: initialBearing(from, point) };
}
