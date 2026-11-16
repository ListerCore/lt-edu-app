'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { sileo } from 'sileo';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { handInAction } from '../actions/hand-in';
import { saveAnswersAction } from '../actions/save-answers';
import { startAttemptAction } from '../actions/start-attempt';
import type { Answer, AssessmentData, Submission, UseAttemptResult } from '../types';

const SAVE_DELAY_MS = 1500;

// The student's attempt: starts or continues it, keeps the answers saved a moment after each change (so a dropped
// connection loses little), and hands it in with the last answers
export const useAttempt = (data: AssessmentData, onChanged: () => void): UseAttemptResult => {
  const slug = useInstitutionSlug();
  const inProgress = data.attempts.find((s) => s.status === 'in_progress') ?? null;
  const [started, setStarted] = useState<Submission | null>(null);
  const current = started ?? inProgress;
  const [answers, setAnswers] = useState<Record<string, Answer>>(() => inProgress?.answers ?? {});
  const [saveState, setSaveState] = useState<UseAttemptResult['saveState']>('idle');
  const [isStarting, setIsStarting] = useState(false);
  const [isHandingIn, setIsHandingIn] = useState(false);
  const dirty = useRef(false);

  // Debounced autosave while answering
  useEffect(() => {
    if (!current || !dirty.current) return;
    const timer = setTimeout((): void => {
      setSaveState('saving');
      void saveAnswersAction(slug, current.id, answers).then((r): void => setSaveState(r.ok ? 'saved' : 'error'));
    }, SAVE_DELAY_MS);
    return (): void => clearTimeout(timer);
  }, [answers, current, slug]);

  const edit = (next: (prev: Record<string, Answer>) => Record<string, Answer>): void => {
    dirty.current = true;
    setAnswers(next);
  };

  const setChoice = useCallback((questionId: string, index: number, multiple: boolean): void => {
    edit((prev) => {
      const choices = prev[questionId]?.choices ?? [];
      const next = multiple ? (choices.includes(index) ? choices.filter((c) => c !== index) : [...choices, index]) : [index];
      return { ...prev, [questionId]: { choices: next, text: '' } };
    });
  }, []);

  const setText = useCallback((questionId: string, text: string): void => {
    edit((prev) => ({ ...prev, [questionId]: { choices: [], text: text.slice(0, 5000) } }));
  }, []);

  const start = (): void => {
    setIsStarting(true);
    void runAcademicAction(startAttemptAction(slug, data.assessment.itemId))
      .then((r): void => {
        if (!r.ok) return;
        setStarted(r.data);
        setAnswers(r.data.answers);
      })
      .finally((): void => setIsStarting(false));
  };

  const handIn = (): void => {
    if (!current) return;
    setIsHandingIn(true);
    void runAcademicAction(handInAction(slug, current.id, answers))
      .then((r): void => {
        if (!r.ok) return;
        dirty.current = false;
        setStarted(null);
        if (r.data.late) sileo.info({ title: 'Entregado fuera de plazo', description: 'Tu docente verá que llegó tarde.' });
        onChanged();
      })
      .finally((): void => setIsHandingIn(false));
  };

  return { current, answers, setChoice, setText, start, handIn, isStarting, isHandingIn, saveState };
};
