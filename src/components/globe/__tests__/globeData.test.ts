import { COUNTRIES } from "../../../data/countries";
import { project } from "../../../utils/geo";
import { BORDERS, GRATICULE, MARKER_IDS, MARKER_XYZ, hexToArgb, hitTest, nearestAngle, rotationToCenter } from "../globeData";

const byId = new Map(COUNTRIES.map((c) => [c.id, c]));
const centeredOn = (id: string, radius = 150) => {
  const c = byId.get(id)!;
  return { rotation: rotationToCenter(c.latlng[0], c.latlng[1]), radius, cx: radius, cy: radius };
};

describe("flattened geometry", () => {
  it("stores every border point as a unit-sphere triple", () => {
    const totalPoints = BORDERS.ringLength.reduce((a, b) => a + b, 0);
    expect(BORDERS.xyz).toHaveLength(totalPoints * 3);
    expect(BORDERS.ringStart).toHaveLength(BORDERS.ringLength.length);
    for (let i = 0; i < BORDERS.xyz.length; i += 3) {
      const [x, y, z] = BORDERS.xyz.slice(i, i + 3);
      expect(Math.hypot(x, y, z)).toBeCloseTo(1, 9);
    }
  });

  it("has a graticule and one marker per country", () => {
    expect(GRATICULE.ringStart.length).toBeGreaterThan(10);
    expect(MARKER_IDS).toHaveLength(COUNTRIES.length);
    expect(MARKER_XYZ).toHaveLength(COUNTRIES.length * 3);
  });
});

describe("rotation helpers", () => {
  it("centers a country", () => {
    const c = byId.get("JPN")!;
    const p = project(c.latlng[1], c.latlng[0], rotationToCenter(c.latlng[0], c.latlng[1]));
    expect(p.x).toBeCloseTo(0, 9);
    expect(p.y).toBeCloseTo(0, 9);
  });

  it("takes the short way round", () => {
    expect(nearestAngle(350, 10)).toBe(370);
    expect(nearestAngle(10, 350)).toBe(-10);
    expect(nearestAngle(725, 0)).toBe(720);
  });

  it("converts hex colors to ARGB integers", () => {
    expect(hexToArgb("#C9A24B")).toBe(0xffc9a24b);
    expect(hexToArgb("#000000", 0)).toBe(0x00000000);
  });
});

describe("hitTest", () => {
  it("finds the country at the center of the view", () => {
    expect(hitTest(150, 150, centeredOn("BRA")).countryId).toBe("BRA");
  });

  it("reports open ocean with a location, and misses outside the disk", () => {
    const pacific = { rotation: rotationToCenter(-10, -150), radius: 150, cx: 150, cy: 150 };
    const ocean = hitTest(150, 150, pacific);
    expect(ocean.countryId).toBeNull();
    expect(ocean.lonLat![0]).toBeCloseTo(-150, 6);
    expect(hitTest(2, 2, pacific)).toEqual({ countryId: null, lonLat: null, nearbyIds: [] });
  });

  it("lets a microstate's marker win over the country around it", () => {
    expect(hitTest(150, 150, centeredOn("SMR")).countryId).toBe("SMR");
  });

  it("reports every marker within reach, nearest first", () => {
    const hit = hitTest(150, 150, centeredOn("LUX"));
    expect(hit.nearbyIds[0]).toBe("LUX");
  });
});
