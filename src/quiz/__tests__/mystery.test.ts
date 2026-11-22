import {
  anonymousCurrency,
  CLUE_COUNT,
  CLUE_ORDER,
  dailyMysteryId,
  giveUpMystery,
  guessMystery,
  isMysteryState,
  MYSTERY_POOL,
  mysteryClues,
  mysteryHint,
  mysteryShareText,
  randomMysteryId,
  revealClue,
  startMystery,
} from "../mystery";
import { countryOfTheDay, dailyNumber } from "../daily";
import { addDays } from "../../gamification/streaks";
import { seededRng } from "../../utils/random";

describe("clues", () => {
  it("gives every pool country a full set, vague to specific, ending with the flag", () => {
    for (const c of MYSTERY_POOL) {
      const clues = mysteryClues(c.id, "en");
      expect(clues.map((k) => k.kind)).toEqual([...CLUE_ORDER]);
      for (const clue of clues) expect(clue.value.length).toBeGreaterThan(0);
      // No clue (other than the flag code) gives the name away.
      for (const clue of clues.slice(0, -1)) expect(clue.value).not.toContain(c.name.common);
    }
    expect(CLUE_COUNT).toBe(8);
  });

  it("describes borders in plain words", () => {
    const value = (id: string) => mysteryClues(id, "en").find((c) => c.kind === "borders")!.value;
    expect(value("ISL")).toBe("No land borders — an island nation");
    expect(value("CHE")).toBe("Landlocked, bordering 5 countries");
    expect(value("PRT")).toBe("Borders 1 country");
    expect(mysteryClues("DEU", "en").find((c) => c.kind === "capital")!.value).toBe("Starts with “B” (6 letters)");
  });

  it("hides the country in currency names", () => {
    expect(anonymousCurrency("Albanian lek")).toBe("lek");
    expect(anonymousCurrency("United States dollar")).toBe("dollar");
    expect(anonymousCurrency("Bosnia and Herzegovina convertible mark")).toBe("convertible mark");
    expect(anonymousCurrency("Central African CFA franc")).toBe("CFA franc");
    expect(anonymousCurrency("Euro")).toBe("Euro");
  });

  it("speaks the chosen language", () => {
    const clues = mysteryClues("DEU", "es");
    expect(clues[0]).toEqual({ kind: "continent", label: "Continente", value: "Europa" });
  });
});

describe("which country", () => {
  it("picks the same daily mystery for everyone, never the Country of the Day", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 60; i++) {
      const date = addDays("2026-11-01", i);
      const id = dailyMysteryId(date);
      expect(id).toBe(dailyMysteryId(date));
      expect(id).not.toBe(countryOfTheDay(date));
      expect(MYSTERY_POOL.some((c) => c.id === id)).toBe(true);
      ids.add(id);
    }
    expect(ids.size).toBeGreaterThan(55); // walks a shuffled list, so it rarely repeats
  });

  it("picks practice mysteries outside the ones to avoid", () => {
    const avoid = new Set(MYSTERY_POOL.slice(0, MYSTERY_POOL.length - 1).map((c) => c.id));
    expect(randomMysteryId(seededRng(1), avoid)).toBe(MYSTERY_POOL[MYSTERY_POOL.length - 1].id);
  });
});

describe("playing", () => {
  it("scores by clues used", () => {
    let s = startMystery("DEU");
    s = guessMystery(s, "FRA"); // wrong: next clue
    s = revealClue(s); // asked for a clue
    expect(s.cluesShown).toBe(3);
    s = guessMystery(s, "FRA"); // repeating a wrong guess is free
    expect(s.cluesShown).toBe(3);
    s = guessMystery(s, "DEU");
    expect(s.status).toBe("solved");
    expect(s.points).toBe(4);
    expect(s.trail).toEqual(["wrong", "clue", "solved"]);
    expect(guessMystery(s, "AUT")).toBe(s);
  });

  it("ends after a wrong guess on the last clue", () => {
    let s = startMystery("DEU");
    for (let i = 1; i < CLUE_COUNT; i++) s = revealClue(s);
    expect(s.cluesShown).toBe(CLUE_COUNT);
    expect(revealClue(s)).toBe(s);
    s = guessMystery(s, "FRA");
    expect(s.status).toBe("failed");
    expect(s.points).toBe(0);
  });

  it("can give up", () => {
    const s = giveUpMystery(startMystery("DEU"));
    expect(s.status).toBe("failed");
    expect(s.trail).toEqual(["failed"]);
  });

  it("hints from a wrong guess toward the answer", () => {
    const { km, bearing } = mysteryHint("ESP", "DEU");
    expect(km).toBeGreaterThan(500);
    expect(bearing).toBeLessThan(90);
  });

  it("shares a spoiler-free result", () => {
    const date = "2026-11-22";
    let s = startMystery(dailyMysteryId(date));
    s = revealClue(guessMystery(s, s.countryId === "FRA" ? "DEU" : "FRA"));
    s = guessMystery(s, s.countryId);
    const text = mysteryShareText(date, s, "en");
    expect(text).toBe(`Terra Mystery #${dailyNumber(date)} 🕵️\nSolved with 3 clues\n🟥⬜🟩`);
    expect(text).not.toContain(s.countryId);
  });

  it("validates saved state", () => {
    expect(isMysteryState(startMystery("DEU"))).toBe(true);
    expect(isMysteryState({ countryId: "DEU" })).toBe(false);
    expect(isMysteryState(null)).toBe(false);
  });
});
