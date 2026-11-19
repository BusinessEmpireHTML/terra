import { useCallback, useEffect, useRef, useState } from "react";
import { ELIGIBLE_POOLS, generateQuestion } from "./generators";
import { recordAnswer } from "./answerRecorder";
import { pickRandom } from "../utils/random";
import type { Question, QuizCategory } from "./types";

const SPEED_CATEGORIES: QuizCategory[] = ["flag", "capital", "currency", "neighbor"];
const FLASH_MS = 220;
/** Don't show the same country again within this many questions. */
const RECENT_WINDOW = 8;

function randomQuestion(recentCountryIds: string[]): Question {
  const category = SPEED_CATEGORIES[Math.floor(Math.random() * SPEED_CATEGORIES.length)];
  const pool = ELIGIBLE_POOLS[category].filter((c) => !recentCountryIds.includes(c.id));
  const country = pickRandom(pool.length ? pool : ELIGIBLE_POOLS[category], 1)[0];
  return generateQuestion(category, country.id);
}

export function useSpeedRound(seconds = 60) {
  // Time is derived from a fixed deadline rather than decremented by an
  // interval, so a throttled timer (backgrounded tab, busy JS thread) can't
  // stretch the round past its real length.
  const [endsAt] = useState(() => Date.now() + seconds * 1000);
  const [now, setNow] = useState(() => Date.now());
  const recentRef = useRef<string[]>([]);
  const [question, setQuestion] = useState<Question>(() => {
    const q = randomQuestion([]);
    recentRef.current = [q.countryId];
    return q;
  });
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const answeredIdRef = useRef<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timeLeft = Math.max(0, Math.ceil((endsAt - now) / 1000));
  const isOver = timeLeft === 0;

  useEffect(() => {
    if (isOver) return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [isOver]);

  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    []
  );

  const answer = useCallback(
    (label: string) => {
      if (Date.now() >= endsAt) return;
      if (answeredIdRef.current === question.id) return; // double tap on the same question
      answeredIdRef.current = question.id;

      const correct = question.choices.find((c) => c.label === label)?.correct ?? false;
      setAttempted((a) => a + 1);
      if (correct) setScore((s) => s + 1);

      setFlash(correct ? "correct" : "wrong");
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlash(null), FLASH_MS);

      // Speed round is fast, but it still counts toward SRS progress and XP.
      recordAnswer(question, correct).catch(() => {});

      const nextQuestion = randomQuestion(recentRef.current);
      recentRef.current = [nextQuestion.countryId, ...recentRef.current].slice(0, RECENT_WINDOW);
      setQuestion(nextQuestion);
    },
    [question, endsAt]
  );

  return { timeLeft, question, score, attempted, flash, isOver, answer };
}
