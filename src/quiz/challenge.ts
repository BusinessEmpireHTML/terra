import { ELIGIBLE_POOLS, generateQuestion } from "./generators";
import { LOCATE_MAX_POINTS } from "./locateHints";
import { seededRng, shuffle } from "../utils/random";
import type { Question } from "./types";

/**
 * "Challenge a friend" for Find it. A challenge is just a random seed plus the
 * challenger's score, packed into a short code; the seed always yields the
 * same 10 countries, so no server is needed — the friend plays the same round
 * and compares scores.
 */
export const CHALLENGE_LENGTH = 10;
export const CHALLENGE_MAX_POINTS = CHALLENGE_LENGTH * LOCATE_MAX_POINTS;
const VERSION = 1;

// Crockford base32: no I, L, O or U, so codes survive being read aloud or retyped.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const CODE_LENGTH = 8; // 40 bits: version (2) | score (6) | seed (32)

export interface Challenge {
  seed: number;
  /** The challenger's points (0–30), or null for a fresh challenge nobody has played yet. */
  score: number | null;
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 32) >>> 0;
}

/** "7KQ2X9MB"-style code. Score 63 is reserved to mean "not played yet". */
export function encodeChallenge({ seed, score }: Challenge): string {
  const s = score == null ? 63 : Math.max(0, Math.min(62, Math.round(score)));
  let value = VERSION * 2 ** 38 + s * 2 ** 32 + (seed >>> 0);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code = ALPHABET[value % 32] + code;
    value = Math.floor(value / 32);
  }
  return code;
}

/** Accepts any casing, spaces or dashes, and the usual look-alikes (I/L → 1, O → 0). Null if it isn't a valid code. */
export function decodeChallenge(input: string): Challenge | null {
  const cleaned = input
    .toUpperCase()
    .replace(/[\s-]/g, "")
    .replace(/[IL]/g, "1")
    .replace(/O/g, "0");
  if (cleaned.length !== CODE_LENGTH) return null;
  let value = 0;
  for (const ch of cleaned) {
    const digit = ALPHABET.indexOf(ch);
    if (digit < 0) return null;
    value = value * 32 + digit;
  }
  const version = Math.floor(value / 2 ** 38);
  if (version !== VERSION) return null;
  const score = Math.floor(value / 2 ** 32) % 64;
  return { seed: value % 2 ** 32, score: score === 63 ? null : score };
}

/** "7KQ2-X9MB" for display. */
export function formatChallengeCode(code: string): string {
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

/** The challenge's 10 countries, identical for everyone with the same seed. */
export function buildChallengeQuiz(seed: number): Question[] {
  const rng = seededRng(seed);
  const ids = shuffle(
    ELIGIBLE_POOLS.locate.map((c) => c.id),
    rng
  ).slice(0, CHALLENGE_LENGTH);
  return ids.map((id, i) => ({ ...generateQuestion("locate", id, rng), id: `challenge:${seed}:${i}` }));
}
