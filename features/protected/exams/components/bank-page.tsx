'use client';

import { useState, useTransition, type JSX } from 'react';
import { Check, Pencil, Plus } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { Pager, SearchBox } from '@/features/protected/people/components/people-ui';
import { useDebounced } from '@/features/protected/people/hooks/use-debounced';
import { isExamsEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { deleteQuestionAction, getExamsOverviewAction, listQuestionsAction, saveQuestionAction } from '../actions/exams-actions';
import { difficultyClass, difficultyLabels, letters } from '../data/exams-data';
import type { Course, Question, QuestionValues } from '../types';

// Banco de preguntas: questions per course with five options, the key, topic, difficulty and the solution
export const BankPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const overview = useAcademicData(`exams-overview:${slug}`, () => getExamsOverviewAction(slug, ''), isExamsEvent);
  const [f, setF] = useState({ courseCode: '', topic: '', difficulty: '', query: '', page: 1 });
  const query = useDebounced(f.query);
  const filter = { ...f, query };
  const list = useAcademicData(`exams-bank:${slug}:${JSON.stringify(filter)}`, () => listQuestionsAction(slug, filter), isExamsEvent);
  const [editing, setEditing] = useState<Question | 'new' | null>(null);
  const [isPending, startTransition] = useTransition();
  const courses = overview.data?.courses ?? [];
  const course = courses.find((c) => c.code === f.courseCode);
  const names = new Map(courses.map((c) => [c.code, c.name]));
  const set = (patch: Partial<typeof f>): void => setF((c) => ({ ...c, page: 1, ...patch }));

  const remove = (q: Question): void =>
    startTransition(async () => {
      const result = await deleteQuestionAction(slug, q.id);
      if (!result.ok) sileo.error({ title: 'No se pudo eliminar', description: result.message });
      else {
        sileo.success({ title: 'Pregunta eliminada' });
        list.reload();
      }
    });

  return (
    <AcademicPage
      titleId="bank-title"
      title="Banco de preguntas"
      description="Las preguntas de cada curso con sus cinco alternativas, la clave y la solución. Los simulacros se arman con ellas."
      context={overview.data ? { canManage: overview.data.canWriteBank } : null}
      actions={
        <button type="button" className="btn-brand" onClick={(): void => setEditing('new')}>
          <MorphIcon icon={Plus} size={16} />
          Nueva pregunta
        </button>
      }
    >
      {overview.error ? (
        <LoadError message={overview.error} onRetry={overview.reload} />
      ) : !overview.data ? (
        <PageSkeleton />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
            <SearchBox value={f.query} onChange={(v): void => setF((c) => ({ ...c, query: v, page: 1 }))} placeholder="Buscar en el enunciado" />
            <SelectField id="bank-course" value={f.courseCode} options={[{ value: '', label: 'Todos los cursos' }, ...courses.map((c) => ({ value: c.code, label: `${c.name} (${c.bank})` }))]} onChange={(v): void => set({ courseCode: v, topic: '' })} />
            <SelectField id="bank-topic" value={f.topic} disabled={!course?.topics.length} options={[{ value: '', label: 'Todos los temas' }, ...(course?.topics ?? []).map((t) => ({ value: t, label: t }))]} onChange={(v): void => set({ topic: v })} />
            <SelectField id="bank-diff" value={f.difficulty} options={[{ value: '', label: 'Cualquier dificultad' }, ...Object.entries(difficultyLabels).map(([value, label]) => ({ value, label }))]} onChange={(v): void => set({ difficulty: v })} />
          </div>
          {list.error ? (
            <LoadError message={list.error} onRetry={list.reload} />
          ) : !list.data ? (
            <PageSkeleton />
          ) : list.data.questions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">No hay preguntas con esos filtros.</p>
          ) : (
            <>
              <ol className="space-y-3">
                {list.data.questions.map((q) => (
                  <li key={q.id} className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{names.get(q.courseCode) ?? q.courseCode}</span>
                        {q.topic && <span>{q.topic}</span>}
                        <span className={cn('pill', difficultyClass[q.difficulty])}>{difficultyLabels[q.difficulty]}</span>
                        {q.uses > 0 && <span>En {q.uses} {q.uses === 1 ? 'simulacro' : 'simulacros'}</span>}
                      </p>
                      {(overview.data?.canManage || q.mine) && (
                        <span className="flex gap-1">
                          <button type="button" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Editar pregunta" onClick={(): void => setEditing(q)}>
                            <MorphIcon icon={Pencil} size={15} />
                          </button>
                          <ConfirmDelete compact title="Eliminar la pregunta" description="Los simulacros que la usan conservan su clave, pero ya no mostrarán el enunciado." isPending={isPending} onConfirm={(): void => remove(q)} />
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-6 whitespace-pre-line text-foreground">{q.stem}</p>
                    <ol className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
                      {q.options.map((o, i) => (
                        <li key={letters[i]} className={cn('flex items-start gap-2 rounded-lg px-2 py-1', letters[i] === q.answer && 'bg-success/10 font-medium text-success')}>
                          <span className="w-5 shrink-0 font-semibold">{letters[i]})</span>
                          <span>{o}</span>
                          {letters[i] === q.answer && <MorphIcon icon={Check} size={14} className="mt-1 shrink-0" />}
                        </li>
                      ))}
                    </ol>
                    {q.explanation && <p className="mt-2 text-xs text-muted-foreground">Solución: {q.explanation}</p>}
                    <p className="mt-2 text-[11px] text-muted-foreground">{q.authorName}</p>
                  </li>
                ))}
              </ol>
              <Pager page={f.page} pageSize={20} total={list.data.total} noun="preguntas" onPage={(page): void => setF((c) => ({ ...c, page }))} />
            </>
          )}
        </div>
      )}
      {editing && overview.data && (
        <QuestionDialog
          slug={slug}
          courses={overview.data.courses}
          question={editing === 'new' ? null : editing}
          defaultCourse={f.courseCode}
          onClose={(): void => setEditing(null)}
          onSaved={(): void => {
            setEditing(null);
            list.reload();
          }}
        />
      )}
    </AcademicPage>
  );
};

const QuestionDialog = ({ slug, courses, question, defaultCourse, onClose, onSaved }: { slug: string; courses: Course[]; question: Question | null; defaultCourse: string; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const form = useAcademicForm<QuestionValues, Question>({
    initial: {
      courseCode: question?.courseCode ?? (defaultCourse || courses[0]?.code || ''),
      topic: question?.topic ?? '',
      stem: question?.stem ?? '',
      options: question?.options ?? ['', '', '', '', ''],
      answer: question?.answer ?? 'A',
      difficulty: question?.difficulty ?? 'medium',
      explanation: question?.explanation ?? '',
    },
    validate: (v): Record<string, string> => {
      const e: Record<string, string> = {};
      if (!v.stem.trim()) e.stem = 'Escribe el enunciado.';
      if (v.options.some((o) => !o.trim())) e.options = 'Completa las cinco alternativas.';
      return e;
    },
    save: (v) => saveQuestionAction(slug, question?.id ?? '', v),
    onSaved,
  });
  const { values, errors, setField } = form;
  const course = courses.find((c) => c.code === values.courseCode);
  return (
    <FormDialog title={question ? 'Editar pregunta' : 'Nueva pregunta'} submitLabel={question ? 'Guardar' : 'Agregar al banco'} isPending={form.isPending} onSubmit={form.submit} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="q-course" label="Curso" required error={errors.courseCode}>
          <SelectField id="q-course" value={values.courseCode} options={courses.map((c) => ({ value: c.code, label: c.name }))} onChange={(v): void => setField('courseCode', v)} />
        </FormField>
        <FormField id="q-topic" label="Tema">
          {course?.topics.length ? (
            <SelectField id="q-topic" value={values.topic} options={[{ value: '', label: 'Sin tema' }, ...course.topics.map((t) => ({ value: t, label: t }))]} onChange={(v): void => setField('topic', v)} />
          ) : (
            <Input id="q-topic" value={values.topic} maxLength={160} onChange={(e): void => setField('topic', e.target.value)} />
          )}
        </FormField>
        <FormField id="q-diff" label="Dificultad" required>
          <SelectField id="q-diff" value={values.difficulty} options={Object.entries(difficultyLabels).map(([value, label]) => ({ value, label }))} onChange={(v): void => setField('difficulty', v)} />
        </FormField>
      </div>
      <FormField id="q-stem" label="Enunciado" required error={errors.stem}>
        <Textarea id="q-stem" value={values.stem} rows={4} maxLength={3000} onChange={(e): void => setField('stem', e.target.value)} aria-invalid={Boolean(errors.stem)} />
      </FormField>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">
          Alternativas <span className="font-normal text-muted-foreground">(marca la correcta)</span>
        </legend>
        {values.options.map((o, i) => (
          <div key={letters[i]} className="flex items-center gap-2">
            <button
              type="button"
              role="radio"
              aria-checked={values.answer === letters[i]}
              aria-label={`La correcta es la ${letters[i]}`}
              onClick={(): void => setField('answer', letters[i])}
              className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold', values.answer === letters[i] ? 'border-success bg-success text-white' : 'border-border text-muted-foreground hover:text-foreground')}
            >
              {letters[i]}
            </button>
            <Input aria-label={`Alternativa ${letters[i]}`} value={o} maxLength={500} onChange={(e): void => setField('options', values.options.map((x, j) => (j === i ? e.target.value : x)))} />
          </div>
        ))}
        {errors.options && <p className="text-xs text-destructive">{errors.options}</p>}
      </fieldset>
      <FormField id="q-expl" label="Solución" hint="Se ve en el banco y en la clave impresa, no en el cuadernillo.">
        <Textarea id="q-expl" value={values.explanation} rows={2} maxLength={3000} onChange={(e): void => setField('explanation', e.target.value)} />
      </FormField>
    </FormDialog>
  );
};
