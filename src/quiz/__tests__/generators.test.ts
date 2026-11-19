import { COUNTRIES } from "../../data/countries";
import { COUNTRY_CONTENT } from "../../data/countryContent";
import { ELIGIBLE_POOLS, generateQuestion, isEligible } from "../generators";
import { normalizeName } from "../../utils/text";
import { QUIZ_CATEGORIES, type QuizCategory } from "../types";

const byId = new Map(COUNTRIES.map((c) => [c.id, c]));
const byName = new Map(COUNTRIES.map((c) => [c.name.common, c]));
const CATEGORIES = QUIZ_CATEGORIES.map((c) => c.key);
const RUNS = 3; // generation is random; a few runs per pair catches most bad draws

describe.each(CATEGORIES)("%s questions", (category: QuizCategory) => {
  const pool = ELIGIBLE_POOLS[category];

  it("has a sizeable pool of eligible countries", () => {
    expect(pool.length).toBeGreaterThan(100);
  });

  it("generates fair questions for every eligible country", () => {
    for (const country of pool) {
      for (let run = 0; run < RUNS; run++) {
        const q = generateQuestion(category, country.id);
        const labels = q.choices.map((c) => c.label);

        expect(q.countryId).toBe(country.id);
        expect(q.category).toBe(category);
        expect(labels).toHaveLength(4);
        expect(new Set(labels).size).toBe(4); // no duplicate choices
        expect(q.choices.filter((c) => c.correct)).toHaveLength(1);
        expect(labels.every((l) => l.trim().length > 0)).toBe(true);
      }
    }
  });
});

describe("answers are unambiguous", () => {
  it("never offers another currency the country also uses as a wrong answer", () => {
    for (const country of ELIGIBLE_POOLS.currency) {
      const own = new Set(country.currencies!.map((c) => c.name));
      for (let run = 0; run < RUNS; run++) {
        const q = generateQuestion("currency", country.id);
        for (const choice of q.choices) {
          if (!choice.correct) expect(own.has(choice.label)).toBe(false);
        }
        expect(q.choices.find((c) => c.correct)!.label).toBe(country.currencies![0].name);
      }
    }
  });

  it("only offers real neighbors as the answer and non-neighbors as distractors", () => {
    for (const country of ELIGIBLE_POOLS.neighbor) {
      const q = generateQuestion("neighbor", country.id);
      for (const choice of q.choices) {
        const other = byName.get(choice.label)!;
        expect(other).toBeDefined();
        expect(country.borders!.includes(other.id)).toBe(choice.correct);
      }
    }
  });

  it("never offers a country that shares the same dish or landmark as a distractor", () => {
    for (const kind of ["food", "landmark"] as const) {
      for (const country of ELIGIBLE_POOLS[kind]) {
        for (let run = 0; run < RUNS; run++) {
          const q = generateQuestion(kind, country.id);
          const itemName = kind === "food" ? q.promptLabel.replace(/ is a dish from which country\?$/, "") : q.promptLabel.replace(/^Which country is home to (.*)\?$/, "$1");
          for (const choice of q.choices) {
            if (choice.correct) continue;
            const other = byName.get(choice.label)!;
            const items = (kind === "food" ? COUNTRY_CONTENT[other.id]?.food : COUNTRY_CONTENT[other.id]?.landmarks) ?? [];
            expect(items.map((i) => normalizeName(i.name))).not.toContain(normalizeName(itemName));
          }
        }
      }
    }
  });

  it("never uses near-identical flags as distractors", () => {
    const lookalikes: [string, string][] = [
      ["TCD", "ROU"],
      ["IDN", "MCO"],
    ];
    for (const [a, b] of lookalikes) {
      for (let run = 0; run < 30; run++) {
        const labels = generateQuestion("flag", a).choices.map((c) => c.label);
        expect(labels).not.toContain(byId.get(b)!.name.common);
      }
    }
  });

  it("doesn't quiz on dishes too generic to identify a country", () => {
    for (let run = 0; run < 20; run++) {
      for (const id of ["HRV", "MDG", "TUV"]) {
        if (!isEligible("food", id)) continue;
        const prompt = generateQuestion("food", id).promptLabel;
        expect(prompt).not.toMatch(/^(Fresh seafood|Rice|Fish|Breadfruit) is a dish/);
      }
    }
  });
});

describe("eligibility", () => {
  it("rejects unknown countries", () => {
    expect(isEligible("flag", "XXX")).toBe(false);
    expect(() => generateQuestion("flag", "XXX")).toThrow();
  });

  it("knows islands have no neighbor questions and microstates have no shape questions", () => {
    expect(isEligible("neighbor", "ISL")).toBe(false);
    expect(isEligible("shape", "VAT")).toBe(false);
    expect(isEligible("neighbor", "FRA")).toBe(true);
  });

  it("throws rather than produce a broken question for an ineligible pair", () => {
    expect(() => generateQuestion("neighbor", "ISL")).toThrow();
  });
});
