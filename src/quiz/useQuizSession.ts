import { useCallback, useEffect, useRef, useState } from "react";
import { buildSession, type CategoryFilter, type SessionOptions } from "./sessionBuilder";
import { recordAnswer } from "./answerRecorder";
import { locatePoints } from "./locateHints";
import type { AnswerMeta, AnswerResult, Question } from "./types";

interface SessionState {
  loading: boolean;
  error: string | null;
  questions: Question[];
  index: number;
  results: AnswerResult[];
  answered: AnswerResult | null; // the just-submitted answer, shown before advancing
  xpEarned: number;
}

const INITIAL: SessionState = { loading: true, error: null, questions: [], index: 0, results: [], answered: null, xpEarned: 0 };

export function useQuizSession(filter: CategoryFilter, options: SessionOptions = {}) {
  const [state, setState] = useState<SessionState>(INITIAL);
  const stateRef = useRef(state);
  stateRef.current = state;
  // Guards against a double tap answering the same question twice before
  // React has re-rendered with `answered` set.
  const answeredIndexRef = useRef(-1);
  const mountedRef = useRef(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    answeredIndexRef.current = -1;
    setState(INITIAL);
    buildSession(filter, options)
      .then((questions) => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, questions }));
      })
      .catch((err) => {
        if (__DEV__) console.warn("Failed to build quiz session:", err);
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: "Couldn't load your progress to build a session." }));
      });
    return () => {
      cancelled = true;
    };
    // Options are read once per attempt; route params don't change while the screen is mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const submitAnswer = useCallback((chosenLabel: string, meta?: AnswerMeta) => {
    const s = stateRef.current;
    const question = s.questions[s.index];
    if (!question || s.answered || answeredIndexRef.current === s.index) return;
    answeredIndexRef.current = s.index;

    const correct = question.choices.find((c) => c.label === chosenLabel)?.correct ?? false;
    const attempts = meta?.attempts;
    const result: AnswerResult =
      attempts != null ? { question, chosenLabel, correct, attempts, points: locatePoints(correct, attempts) } : { question, chosenLabel, correct };
    setState((prev) => ({ ...prev, answered: result, results: [...prev.results, result] }));

    recordAnswer(question, correct, { hard: correct && (attempts ?? 1) > 1 })
      .then((xp) => {
        if (mountedRef.current && xp > 0) setState((prev) => ({ ...prev, xpEarned: prev.xpEarned + xp }));
      })
      .catch(() => {
        // Already logged by the recorder; the session itself carries on.
      });
  }, []);

  const next = useCallback(() => {
    setState((s) => ({ ...s, index: s.index + 1, answered: null }));
  }, []);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  const isComplete = !state.loading && !state.error && state.questions.length > 0 && state.index >= state.questions.length;
  const currentQuestion = state.loading || isComplete ? null : state.questions[state.index] ?? null;
  const correctCount = state.results.filter((r) => r.correct).length;

  return {
    loading: state.loading,
    error: state.error,
    currentQuestion,
    answered: state.answered,
    index: state.index,
    total: state.questions.length,
    results: state.results,
    correctCount,
    xpEarned: state.xpEarned,
    isComplete,
    submitAnswer,
    next,
    retry,
  };
}
