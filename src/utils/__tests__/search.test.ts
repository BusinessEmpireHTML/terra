import { COUNTRIES } from "../../data/countries";
import { searchCountries } from "../search";

const ids = (q: string) => searchCountries(COUNTRIES, q).map((c) => c.id);

describe("searchCountries", () => {
  it("returns everything for an empty query", () => {
    expect(ids("  ")).toHaveLength(COUNTRIES.length);
  });

  it("ignores accents and case", () => {
    expect(ids("sao tome")).toContain("STP");
    expect(ids("TURKIYE")).toContain("TUR");
  });

  it("matches capitals too", () => {
    expect(ids("bogota")).toEqual(["COL"]);
    expect(ids("canberra")).toEqual(["AUS"]);
  });

  it("ranks name prefixes above substring matches", () => {
    const results = ids("ma");
    expect(results.indexOf("MDG")).toBeLessThan(results.indexOf("GTM")); // Madagascar before Guatemala
  });

  it("matches the start of later words", () => {
    expect(ids("leone")).toContain("SLE");
  });
});
