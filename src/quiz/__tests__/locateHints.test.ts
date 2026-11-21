import { compassName, distanceKm, initialBearing, locatePoints, LOCATE_MAX_TRIES, nearestPointOfCountry, pointToward } from "../locateHints";
import { initialBearing as bearing } from "../locateHints";

describe("Find it scoring", () => {
  it("gives fewer points for each wrong try and none for a miss", () => {
    expect(LOCATE_MAX_TRIES).toBe(3);
    expect([1, 2, 3].map((n) => locatePoints(true, n))).toEqual([3, 2, 1]);
    expect(locatePoints(false, 3)).toBe(0);
    expect(locatePoints(false, 0)).toBe(0);
  });
});

describe("distance and direction hints", () => {
  const paris: [number, number] = [2.35, 48.86];
  const madrid: [number, number] = [-3.7, 40.42];
  const tokyo: [number, number] = [139.69, 35.69];

  it("measures great-circle distance", () => {
    expect(distanceKm(paris, madrid)).toBeGreaterThan(1000);
    expect(distanceKm(paris, madrid)).toBeLessThan(1100); // ~1,054 km
  });

  it("gives compass bearings", () => {
    expect(compassName(initialBearing(paris, madrid))).toBe("southwest");
    expect(compassName(initialBearing(madrid, paris))).toBe("northeast");
    expect(compassName(initialBearing([0, 0], [10, 0]))).toBe("east");
    expect(compassName(initialBearing([0, 0], [0, -10]))).toBe("south");
    // Shortest route from Paris to Tokyo heads north-east, over Russia.
    expect(compassName(bearing(paris, tokyo))).toMatch(/north|northeast/);
  });

  it("measures a near miss to the country's edge, not its middle", () => {
    // A point just across Spain's border in southern France.
    const nearSpain: [number, number] = [1.8, 43.0];
    const { km } = nearestPointOfCountry("ESP", nearSpain);
    expect(km).toBeLessThan(80);
    // The middle of Spain is several hundred km away.
    expect(distanceKm(nearSpain, [-4, 40])).toBeGreaterThan(400);
  });

  it("falls back to the centroid for microstates", () => {
    const { km } = nearestPointOfCountry("VAT", [12.5, 41.9]);
    expect(km).toBeLessThan(5);
  });

  it("steps along the shortest route", () => {
    const ahead = pointToward(paris, madrid, 2)!;
    expect(distanceKm(paris, ahead)).toBeCloseTo(2 * 111.195, 0);
    expect(distanceKm(ahead, madrid)).toBeLessThan(distanceKm(paris, madrid));
    expect(pointToward(paris, paris, 2)).toBeNull();
  });
});
