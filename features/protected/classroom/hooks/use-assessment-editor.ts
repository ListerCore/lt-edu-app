'use client';

import { useCallback, useMemo, useState } from 'react';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { saveAssessmentAction } from '../actions/save-assessment';
import { isoToLimaLocal, limaLocalToIso } from '../data/classroom-data';
import type { AssessmentData, AssessmentSettingsValues, Question, QuestionDraft, UseAssessmentEditorResult } from '../types';

let seq = 0;
const newKey = (): string => `q${Date.now().toString(36)}${(seq++).toString(36)}`;

const toDraft = (q: Question): QuestionDraft => ({ key: q.id || newKey(), kind: q.kind, prompt: q.prompt, options: q.options, correct: q.correct, accepted: q.accepted.join('\n'), points: String(q.points) });

const blank = (kind: string): QuestionDraft => ({
  key: newKey(),
  kind,
  prompt: '',
  options: kind === 'single' || kind === 'multiple' ? ['', '', ''] : [],
  correct: [],
  accepted: '',
  points: kind === 'open' ? '5' : '1',
});

// Questions as lt-edu-api wants them: trimmed, blank options dropped (right answers re-indexed), one accepted
// answer per line
const toQuestion = (d: QuestionDraft): Question => {
  const kept = d.options.map((text, i) => ({ text: text.trim(), i })).filter((o) => o.text !== '');
  const correct = kept.flatMap((o, newIndex) => (d.correct.includes(o.i) ? [newIndex] : []));
  return {
    id: '',
    kind: d.kind,
    prompt: d.prompt.trim(),
    options: d.kind === 'single' || d.kind === 'multiple' ? kept.map((o) => o.text) : [],
    correct: d.kind === 'single' || d.kind === 'multiple' ? correct : [],
    accepted: d.kind === 'short' ? d.accepted.split('\n').map((a) => a.trim()).filter(Boolean) : [],
    points: Number(d.points) || 1,
  };
};

// Checks the editor can make before the API: every question asks something and has its right answer
const validateDrafts = (qs: QuestionDraft[]): Record<string, string> => {
  const errors: Record<string, string> = {};
  qs.forEach((q, i) => {
    const key = `questions.${i}`;
    const options = q.options.filter((o) => o.trim());
    if (!q.prompt.trim()) errors[key] = 'Escribe la pregunta.';
    else if ((q.kind === 'single' || q.kind === 'multiple') && options.length < 2) errors[key] = 'Escribe al menos dos alternativas.';
    else if ((q.kind === 'single' || q.kind === 'multiple') && !q.correct.some((c) => q.options[c]?.trim())) errors[key] = 'Marca la alternativa correcta.';
    else if (q.kind === 'short' && !q.accepted.trim()) errors[key] = 'Escribe al menos una respuesta aceptada.';
    else if (!(Number(q.points) >= 1 && Number(q.points) <= 100)) errors[key] = 'De 1 a 100 puntos.';
  });
  return errors;
};

// Settings and question editor of a quiz or task. Times are typed in Lima and travel as UTC; questions are only
// sent when they can still change (nobody handed it in)
export const useAssessmentEditor = (data: AssessmentData, onSaved: () => void): UseAssessmentEditorResult => {
  const slug = useInstitutionSlug();
  const a = data.assessment;
  const isQuiz = a.kind === 'quiz';
  const [questions, setQuestions] = useState<QuestionDraft[]>(() => a.questions.map(toDraft));

  const form = useAcademicForm<AssessmentSettingsValues, unknown>({
    initial: { opensAt: a.opensAt ? isoToLimaLocal(a.opensAt) : '', closesAt: a.closesAt ? isoToLimaLocal(a.closesAt) : '', maxAttempts: String(a.maxAttempts || 1), competencyIds: a.competencyIds, showAnswers: a.showAnswers },
    validate: (v) => {
      const errors: Record<string, string> = isQuiz && !data.questionsLocked ? validateDrafts(questions) : {};
      if (v.opensAt && v.closesAt && limaLocalToIso(v.closesAt) <= limaLocalToIso(v.opensAt)) errors.closesAt = 'El cierre debe ser después de la apertura.';
      if (!(Number(v.maxAttempts) >= 1 && Number(v.maxAttempts) <= 10)) errors.maxAttempts = 'De 1 a 10.';
      if (isQuiz && !data.questionsLocked && questions.length === 0) errors.questions = 'Agrega al menos una pregunta.';
      return errors;
    },
    save: (v) =>
      saveAssessmentAction(slug, {
        itemId: a.itemId,
        opensAt: limaLocalToIso(v.opensAt),
        closesAt: limaLocalToIso(v.closesAt),
        maxAttempts: Number(v.maxAttempts),
        competencyIds: v.competencyIds,
        showAnswers: v.showAnswers,
        replaceQuestions: isQuiz && !data.questionsLocked,
        questions: isQuiz && !data.questionsLocked ? questions.map(toQuestion) : [],
      }),
    onSaved: () => onSaved(),
  });

  const addQuestion = useCallback((kind: string): void => setQuestions((qs) => [...qs, blank(kind)]), []);
  const updateQuestion = useCallback((key: string, patch: Partial<QuestionDraft>): void => setQuestions((qs) => qs.map((q) => (q.key === key ? { ...q, ...patch } : q))), []);
  const removeQuestion = useCallback((key: string): void => setQuestions((qs) => qs.filter((q) => q.key !== key)), []);
  const moveQuestion = useCallback(
    (key: string, delta: -1 | 1): void =>
      setQuestions((qs) => {
        const i = qs.findIndex((q) => q.key === key);
        const j = i + delta;
        if (i < 0 || j < 0 || j >= qs.length) return qs;
        const next = [...qs];
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      }),
    [],
  );
  const totalPoints = useMemo(() => questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0), [questions]);

  return { ...form, questions, addQuestion, updateQuestion, removeQuestion, moveQuestion, totalPoints };
};
