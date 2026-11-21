import { buildChallengeQuiz, CHALLENGE_LENGTH, decodeChallenge, encodeChallenge, formatChallengeCode, randomSeed } from "../challenge";

describe("friend challenges", () => {
  it("round-trips seed and score through a short code", () => {
    for (let i = 0; i < 200; i++) {
      const seed = randomSeed();
      const score = i % 31;
      const code = encodeChallenge({ seed, score });
      expect(code).toMatch(/^[0-9A-HJKMNP-TV-Z]{8}$/);
      expect(decodeChallenge(code)).toEqual({ seed, score });
    }
  });

  it("encodes a fresh, unplayed challenge", () => {
    const code = encodeChallenge({ seed: 123456, score: null });
    expect(decodeChallenge(code)).toEqual({ seed: 123456, score: null });
  });

  it("forgives casing, dashes, spaces and look-alike characters", () => {
    const code = encodeChallenge({ seed: 987654321, score: 24 });
    const typed = ` ${formatChallengeCode(code).toLowerCase()} `.replace(/1/g, "l").replace(/0/g, "o");
    expect(decodeChallenge(typed)).toEqual({ seed: 987654321, score: 24 });
  });

  it("rejects garbage", () => {
    expect(decodeChallenge("")).toBeNull();
    expect(decodeChallenge("HELLO")).toBeNull();
    expect(decodeChallenge("UUUUUUUU")).toBeNull(); // U isn't in the alphabet
    expect(decodeChallenge("00000000")).toBeNull(); // wrong version
  });

  it("gives everyone with the same code the same 10 countries", () => {
    const a = buildChallengeQuiz(42).map((q) => q.countryId);
    expect(a).toHaveLength(CHALLENGE_LENGTH);
    expect(new Set(a).size).toBe(CHALLENGE_LENGTH);
    expect(buildChallengeQuiz(42).map((q) => q.countryId)).toEqual(a);
    expect(buildChallengeQuiz(43).map((q) => q.countryId)).not.toEqual(a);
  });
});
