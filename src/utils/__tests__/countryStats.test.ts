import { areaComparison, densityComparison, populationRank } from "../countryStats";

describe("relatable country stats", () => {
  it("compares area to a familiar country", () => {
    expect(areaComparison("BDI")).toMatch(/size of (Belgium|Netherlands|Switzerland)/);
    expect(areaComparison("BEL")).not.toMatch(/Belgium/); // never compares a country with itself
    expect(areaComparison("RUS")).toMatch(/^About \d+(\.\d)?× the size of Canada$/);
    expect(areaComparison("VAT")).toBe("Smaller than many cities");
  });

  it("puts density in percentile terms", () => {
    expect(densityComparison("BGD")).toMatch(/^More crowded than (9\d|100)% of countries$/);
    expect(densityComparison("AUS")).toMatch(/^Less crowded than (9\d|100)% of countries$/);
    expect(densityComparison("MNG")).toBe("The least crowded country on Earth");
  });

  it("reads naturally at the extremes", () => {
    expect(areaComparison("BRA")).toBe("About the size of the United States");
    expect(areaComparison("LUX")).not.toMatch(/ of the size/);
    expect(densityComparison("MCO")).toBe("The most crowded country on Earth");
  });

  it("ranks population", () => {
    expect([populationRank("IND"), populationRank("CHN")].sort()).toEqual([1, 2]);
    expect(populationRank("VAT")).toBe(194);
  });
});
