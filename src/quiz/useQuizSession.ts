import { useCallback, useEffect, useRef, useState } from "react";
import { buildSession, type CategoryFilter } from "./sessionBuilder";
import { applyAnswer, newProgressRecord } from "./srs";
import { progressStore } from "../services/progressStore";
import { activityStore, localDateString } from "../services/activityStore";
import type { AnswerResult, Question } from "./types";

const XP_CORRECT = 10;
const XP_NEW_PAIR_BONUS = 5; // rewards breadth: the first time you ever try (country, category)

interface SessionState {
  loading: boolean;
  questions: Question[];
  index: number;
  results: AnswerResult[];
  answered: AnswerResult | null; // the just-submitted answer, shown before advancing
}

export function useQuizSession(filter: CategoryFilter, length = 10, focusCountryId?: string) {
  const [state, setState] = useState<SessionState>({ loading: true, questions: [], index: 0, results: [], answered: null });
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    buildSession(filter, length, focusCountryId).then((questions) => {
      setState((s) => ({ ...s, loading: false, questions }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAnswer = useCallback(async (chosenLabel: string) => {
    setState((s) => {
      const question = s.questions[s.index];
      if (!question || s.answered) return s;
      const correct = question.choices.find((c) => c.label === chosenLabel)?.correct ?? false;
      const result: AnswerResult = { question, chosenLabel, correct };
      return { ...s, answered: result, results: [...s.results, result] };
    });
  }, []);

  // Persist SRS progress and log the activity event the moment an answer is recorded.
  useEffect(() => {
    if (!state.answered) return;
    const { question, correct } = state.answered;
    (async () => {
      const [existing, priorAttempts] = await Promise.all([
        progressStore.get(question.countryId, question.category),
        activityStore.countFor(question.countryId, question.category),
      ]);
      const base = existing ?? newProgressRecord(question.countryId, question.category);
      await progressStore.upsert(applyAnswer(base, correct));

      if (correct) {
        const xp = XP_CORRECT + (priorAttempts === 0 ? XP_NEW_PAIR_BONUS : 0);
        await activityStore.log({
          date: localDateString(),
          timestamp: new Date().toISOString(),
          countryId: question.countryId,
          category: question.category,
          correct: true,
          xpEarned: xp,
        });
      } else {
        await activityStore.log({
          date: localDateString(),
          timestamp: new Date().toISOString(),
          countryId: question.countryId,
          category: question.category,
          correct: false,
          xpEarned: 0,
        });
      }
    })();
  }, [state.answered]);

  const next = useCallback(() => {
    setState((s) => ({ ...s, index: s.index + 1, answered: null }));
  }, []);

  const isComplete = !state.loading && state.index >= state.questions.length;
  const currentQuestion = state.loading || isComplete ? null : state.questions[state.index];
  const correctCount = state.results.filter((r) => r.correct).length;

  return {
    loading: state.loading,
    currentQuestion,
    answered: state.answered,
    index: state.index,
    total: state.questions.length,
    results: state.results,
    correctCount,
    isComplete,
    submitAnswer,
    next,
  };
}
