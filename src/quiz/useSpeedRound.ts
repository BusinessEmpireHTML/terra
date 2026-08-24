import { useCallback, useEffect, useRef, useState } from "react";
import { ELIGIBLE_POOLS, generateQuestion } from "./generators";
import { applyAnswer, newProgressRecord } from "./srs";
import { progressStore } from "../services/progressStore";
import { activityStore, localDateString } from "../services/activityStore";
import { pickRandom } from "../utils/random";
import type { Question, QuizCategory } from "./types";

const SPEED_CATEGORIES: QuizCategory[] = ["flag", "capital", "currency", "neighbor"];
const XP_CORRECT = 10;

function randomQuestion(): Question {
  const category = SPEED_CATEGORIES[Math.floor(Math.random() * SPEED_CATEGORIES.length)];
  const country = pickRandom(ELIGIBLE_POOLS[category], 1)[0];
  return generateQuestion(category, country.id);
}

export function useSpeedRound(seconds = 60) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [question, setQuestion] = useState<Question>(() => randomQuestion());
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [running, setRunning] = useState(true);
  const runningRef = useRef(true);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          runningRef.current = false;
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const answer = useCallback(
    (label: string) => {
      if (!runningRef.current) return;
      const correct = question.choices.find((c) => c.label === label)?.correct ?? false;
      setAttempted((a) => a + 1);
      setFlash(correct ? "correct" : "wrong");
      setTimeout(() => setFlash(null), 220);

      if (correct) setScore((s) => s + 1);

      // Persist real progress in the background — speed round is fast, but still counts.
      (async () => {
        const existing = await progressStore.get(question.countryId, question.category);
        const base = existing ?? newProgressRecord(question.countryId, question.category);
        await progressStore.upsert(applyAnswer(base, correct));
        await activityStore.log({
          date: localDateString(),
          timestamp: new Date().toISOString(),
          countryId: question.countryId,
          category: question.category,
          correct,
          xpEarned: correct ? XP_CORRECT : 0,
        });
      })();

      setQuestion(randomQuestion());
    },
    [question]
  );

  return { timeLeft, question, score, attempted, flash, isOver: !running, answer };
}
