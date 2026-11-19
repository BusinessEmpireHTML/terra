import worldBorders from "../../data/worldBorders.json";
import {
  flagFromCca2,
  flattenShapeToPaths,
  formatCompactNumber,
  formatLatLng,
  graticuleRings,
  pointInRing,
  project,
  projectRingToPath,
  unproject,
  type Ring,
} from "../geo";

const features = worldBorders as unknown as { id: string; outerRings: Ring[] }[];
const feature = (id: string) => features.find((f) => f.id === id)!;
const contains = (id: string, lon: number, lat: number) => feature(id).outerRings.some((r) => pointInRing([lon, lat], r));
const points = (d: string) => [...d.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);

describe("orthographic projection", () => {
  it.each([
    [48.8, 2.3],
    [-33.9, 151.2],
    [64, -150],
    [0, 0],
  ])("centers (%p, %p) with yaw = 90° - lon and pitch = lat", (lat, lon) => {
    const p = project(lon, lat, { lambda: 90 - lon, phi: lat });
    expect(p.x).toBeCloseTo(0, 9);
    expect(p.y).toBeCloseTo(0, 9);
    expect(p.visible).toBe(true);
  });

  it("is not mirrored: east is right and north is up", () => {
    const rotation = { lambda: 90 - 20, phi: 0 }; // centered on 0°N, 20°E
    expect(project(30, 0, rotation).x).toBeGreaterThan(0); // 10° east -> right
    expect(project(10, 0, rotation).x).toBeLessThan(0); // 10° west -> left
    expect(project(20, 10, rotation).y).toBeLessThan(0); // 10° north -> up
  });

  it("puts Madagascar to the right of Africa's interior when viewing Africa", () => {
    const rotation = { lambda: 90 - 25, phi: 0 };
    expect(project(46.9, -18.8, rotation).x).toBeGreaterThan(project(25, -18.8, rotation).x);
  });

  it("matches drag directions: increasing yaw moves the surface right, increasing pitch moves it down", () => {
    const at = (lambda: number, phi: number) => project(20, 0, { lambda, phi });
    expect(at(75, 0).x).toBeGreaterThan(at(70, 0).x);
    expect(at(70, 5).y).toBeGreaterThan(at(70, 0).y);
  });

  it("unproject inverts project on the visible hemisphere", () => {
    const rotation = { lambda: 137, phi: -23 };
    for (let i = 0; i < 200; i++) {
      // Sample a spiral strictly inside the unit disk.
      const r = 0.98 * (i / 200);
      const x = r * Math.cos(i * 2.4);
      const y = r * Math.sin(i * 2.4);
      const [lon, lat] = unproject(x, y, rotation)!;
      const p = project(lon, lat, rotation);
      expect(p.x).toBeCloseTo(x, 9);
      expect(p.y).toBeCloseTo(y, 9);
    }
    expect(unproject(0.9, 0.9, rotation)).toBeNull(); // outside the disk
  });

  it("never draws country outlines outside the globe's disk", () => {
    for (const rotation of [{ lambda: -20, phi: -12 }, { lambda: 160, phi: 45 }]) {
      for (const f of features) {
        for (const ring of f.outerRings) {
          const d = projectRingToPath(ring, rotation, 100, 0, 0);
          if (!d) continue;
          for (const [x, y] of points(d)) expect(Math.hypot(x, y)).toBeLessThanOrEqual(100.2);
        }
      }
    }
  });

  it("culls rings entirely on the far side", () => {
    // Australia is on the far side when looking straight at the mid-Atlantic.
    const rotation = { lambda: 90 + 30, phi: 0 };
    expect(feature("AUS").outerRings.every((r) => projectRingToPath(r, rotation, 100, 0, 0) === null)).toBe(true);
  });

  it("leaves graticule lines open (no closing chord across the globe)", () => {
    const paths = graticuleRings(30)
      .map((r) => projectRingToPath(r, { lambda: 0, phi: 0 }, 100, 0, 0, false))
      .filter((d): d is string => Boolean(d));
    expect(paths.length).toBeGreaterThan(0);
    expect(paths.some((d) => d.endsWith("Z"))).toBe(false);
  });
});

describe("hit testing", () => {
  it("finds the country containing a point", () => {
    expect(contains("FRA", 2.35, 48.85)).toBe(true); // Paris
    expect(contains("FRA", 13.4, 52.5)).toBe(false); // Berlin
    expect(contains("BRA", -47.9, -15.8)).toBe(true); // Brasília
  });

  it("handles countries that straddle the antimeridian", () => {
    expect(contains("RUS", 177, 64.7)).toBe(true);
    expect(contains("RUS", -173, 65.8)).toBe(true);
    expect(contains("FJI", 178.44, -18.1)).toBe(true);
    expect(contains("FJI", -170, -16.3)).toBe(false); // open ocean at Fiji's latitude
  });
});

describe("silhouettes", () => {
  it("keeps every path inside the box", () => {
    for (const id of ["CHL", "RUS", "FJI", "USA", "IDN"]) {
      for (const d of flattenShapeToPaths(feature(id).outerRings, 180)) {
        for (const [x, y] of points(d)) {
          expect(x).toBeGreaterThanOrEqual(-0.1);
          expect(x).toBeLessThanOrEqual(180.1);
          expect(y).toBeGreaterThanOrEqual(-0.1);
          expect(y).toBeLessThanOrEqual(180.1);
        }
      }
    }
  });

  it("draws Russia as one contiguous shape, not split across the whole map", () => {
    const xs = flattenShapeToPaths(feature("RUS").outerRings, 180).flatMap((d) => points(d).map(([x]) => x));
    // Before unwrapping, the Chukotka sliver sat at the far left edge.
    const leftEdgeSlivers = xs.filter((x) => x < 20).length;
    expect(leftEdgeSlivers).toBeLessThan(xs.length * 0.05);
  });

  it("keeps a tall, narrow country tall", () => {
    const pts = flattenShapeToPaths(feature("CHL").outerRings, 180).flatMap(points);
    const width = Math.max(...pts.map((p) => p[0])) - Math.min(...pts.map((p) => p[0]));
    const height = Math.max(...pts.map((p) => p[1])) - Math.min(...pts.map((p) => p[1]));
    expect(height / width).toBeGreaterThan(3);
  });
});

describe("formatting", () => {
  it("formats compact numbers", () => {
    expect(formatCompactNumber(undefined)).toBe("—");
    expect(formatCompactNumber(882)).toBe("882");
    expect(formatCompactNumber(9_492)).toBe("9.5K");
    expect(formatCompactNumber(52_000)).toBe("52K");
    expect(formatCompactNumber(341_784_857)).toBe("342M");
    expect(formatCompactNumber(999_999)).toBe("1M");
    expect(formatCompactNumber(1_463_865_525)).toBe("1.5B");
    expect(formatCompactNumber(0.44)).toBe("0.44");
  });

  it("formats coordinates with hemispheres", () => {
    expect(formatLatLng(46, 2)).toBe("46.0°N, 2.0°E");
    expect(formatLatLng(-33.9, -70.7)).toBe("33.9°S, 70.7°W");
  });

  it("builds flag emoji from ISO codes", () => {
    expect(flagFromCca2("fr")).toBe("🇫🇷");
  });
});
