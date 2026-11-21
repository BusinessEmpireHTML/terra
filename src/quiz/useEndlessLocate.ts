import { useCallback, useEffect, useRef, useState } from "react";
import { ELIGIBLE_POOLS, generateQuestion } from "./generators";
import { rankPairs } from "./sessionBuilder";
import { recordAnswer } from "./answerRecorder";
import { progressStore } from "../services/progressStore";
import { storage } from "../services/storage";
import { shuffle } from "../utils/random";
import type { AnswerResult, Question } from "./types";

/** Don't bring a country back until at least this many others have been asked. */
const NO_REPEAT_WINDOW = 25;

/**
 * Endless "Find it on the globe": questions never run out. Countries come in
 * spaced-repetition order (due reviews first, then ones never tried), and
 * once all 165 have been asked the deck is reshuffled. Tracks score, the
 * current streak, and the all-time best streak.
 */
export function useEndlessLocate() {
  const queue = useRef<string[]>([]);
  const recent = useRef<string[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answered, setAnswered] = useState<AnswerResult | null>(null);
  const [found, setFound] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [runBest, setRunBest] = useState(0);
  const [bestEver, setBestEver] = useState(0);
  const [previousBest, setPreviousBest] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const draw = useCallback((): Question => {
    if (queue.current.length === 0) {
      queue.current = shuffle(ELIGIBLE_POOLS.locate.map((c) => c.id)).filter((id) => !recent.current.includes(id));
    }
    const id = queue.current.shift()!;
    recent.current = [id, ...recent.current].slice(0, NO_REPEAT_WINDOW);
    return generateQuestion("locate", id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([progressStore.getAll().catch(() => []), storage.loadFindBestStreak().catch(() => 0)]).then(([records, best]) => {
      if (cancelled) return;
      const pairs = ELIGIBLE_POOLS.locate.map((c) => ({ countryId: c.id, category: "locate" as const }));
      queue.current = rankPairs(pairs, records).map((p) => p.countryId);
      setBestEver(best);
      setPreviousBest(best);
      setQuestion(draw());
    });
    return () => {
      cancelled = true;
    };
  }, [draw]);

  // Guards against a double tap answering the same question twice before React re-renders.
  const answeredId = useRef<string | null>(null);

  const submit = useCallback(
    (chosenLabel: string) => {
      if (!question || answered || answeredId.current === question.id) return;
      answeredId.current = question.id;
      const correct = question.choices[0].label === chosenLabel;
      const nextStreak = correct ? streak + 1 : 0;
      setAnswered({ question, chosenLabel, correct });
      setAttempts((n) => n + 1);
      if (correct) setFound((n) => n + 1);
      setStreak(nextStreak);
      setRunBest((b) => Math.max(b, nextStreak));
      if (nextStreak > bestEver) {
        setBestEver(nextStreak);
        storage.saveFindBestStreak(nextStreak).catch(() => {});
      }
      recordAnswer(question, correct)
        .then((xp) => setXpEarned((x) => x + xp))
        .catch(() => {});
    },
    [question, answered, streak, bestEver]
  );

  const next = useCallback(() => {
    setAnswered(null);
    setQuestion(draw());
  }, [draw]);

  return { question, answered, found, attempts, streak, runBest, bestEver, isNewBest: runBest > previousBest, xpEarned, submit, next };
}
