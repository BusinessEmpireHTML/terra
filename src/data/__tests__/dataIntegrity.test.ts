import { COUNTRIES } from "../countries";
import { COUNTRY_CONTENT } from "../countryContent";
import worldBorders from "../worldBorders.json";
import { FLAG_SVGS } from "../flags";

const ids = new Set(COUNTRIES.map((c) => c.id));
const byId = new Map(COUNTRIES.map((c) => [c.id, c]));

describe("country data", () => {
  it("has 194 countries with unique ids", () => {
    expect(COUNTRIES).toHaveLength(194);
    expect(ids.size).toBe(194);
  });

  it("has the core facts for every country", () => {
    for (const c of COUNTRIES) {
      expect(c.population).toBeGreaterThan(0);
      expect(c.populationYear).toBeGreaterThanOrEqual(2020);
      expect(c.areaKm2).toBeGreaterThan(0);
      expect(c.capital?.length).toBeGreaterThan(0);
      expect(c.currencies?.length).toBeGreaterThan(0);
      expect(c.flagEmoji).toBeTruthy();
      expect(c.accentColor).toMatch(/^#[0-9A-F]{6}$/i);
      expect(c.funFact).toBeTruthy();
      expect(c.religions?.length).toBeGreaterThan(0);
    }
  });

  it("only lists borders that resolve to other countries, symmetrically", () => {
    for (const c of COUNTRIES) {
      for (const b of c.borders ?? []) {
        expect(ids.has(b)).toBe(true);
        expect(byId.get(b)!.borders ?? []).toContain(c.id);
      }
    }
  });

  it("flags border geometry only where a polygon exists", () => {
    const withShapes = new Set((worldBorders as { id: string; matched: boolean }[]).filter((f) => f.matched).map((f) => f.id));
    for (const c of COUNTRIES) expect(withShapes.has(c.id)).toBe(c.hasBorderGeometry);
  });

  it("has narrative content for every country and nothing else", () => {
    for (const c of COUNTRIES) expect(COUNTRY_CONTENT[c.id]).toBeDefined();
    for (const key of Object.keys(COUNTRY_CONTENT)) expect(ids.has(key)).toBe(true);
  });

  it("has an SVG flag for every country", () => {
    for (const c of COUNTRIES) expect(FLAG_SVGS[c.cca2]).toMatch(/^<svg[\s\S]*<\/svg>$/);
  });

  it("keeps the corrected facts corrected", () => {
    expect(byId.get("BGR")!.currencies![0].name).toBe("Euro");
    expect(byId.get("ZWE")!.currencies![0].name).toBe("Zimbabwe Gold");
    expect(byId.get("LKA")!.borders).toBeUndefined();
  });
});
