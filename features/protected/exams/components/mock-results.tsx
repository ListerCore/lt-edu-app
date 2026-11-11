'use client';

import { useMemo, useState, type JSX } from 'react';
import { SearchBox } from '@/features/protected/people/components/people-ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { isExamsEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getResultsAction, getStudentExamsAction } from '../actions/exams-actions';
import { formatScore, short } from '../data/exams-data';
import type { AnswerSheet, Level } from '../types';
import { StudentExamsCard } from './student-exams';

const fold = (v: string): string => v.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// Resultados: the ranking (general, by area or by classroom) and how each course went
export const MockResultsView = ({ slug, id, levels }: { slug: string; id: string; levels: Level[] }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`mock-results:${slug}:${id}`, () => getResultsAction(slug, id), isExamsEvent);
  const [levelId, setLevelId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [query, setQuery] = useState('');
  const [student, setStudent] = useState<AnswerSheet | null>(null);
  const sections = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of data?.sheets ?? []) if (!levelId || s.levelId === levelId) map.set(s.sectionId, `${s.sectionLabel} · ${s.levelName.replace('San Marcos · ', '')}`);
    return [...map].map(([value, label]) => ({ value, label }));
  }, [data, levelId]);
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  if (data.sheets.length === 0) return <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Aún no hay respuestas cargadas.</p>;

  const areas = levels.filter((l) => data.sheets.some((s) => s.levelId === l.id));
  const rows = data.sheets.filter((s) => (!levelId || s.levelId === levelId) && (!sectionId || s.sectionId === sectionId) && (!query || fold(s.studentName).includes(fold(query)) || s.studentCode.includes(query)));
  const rankOf = (s: AnswerSheet): number => (sectionId ? s.rankSection : levelId ? s.rankLevel : s.rankAll);
  const rankLabel = sectionId ? 'Puesto en el aula' : levelId ? 'Puesto en el área' : 'Puesto general';
  const courses = data.mock?.courses ?? [];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-2xl border border-border bg-background p-5 sm:grid-cols-4">
        <Figure label="Rindieron" value={String(data.sheets.length)} detail={data.missing.length ? `${data.missing.length} sin hoja` : 'todos'} />
        <Figure label="Puntaje promedio" value={formatScore(data.average)} />
        <Figure label="Puntaje más alto" value={formatScore(data.best)} />
        <Figure label="Preguntas" value={String(data.mock?.questions ?? 0)} detail={`+${data.mock?.pointsRight} / −${data.mock?.pointsWrong}`} />
      </div>

      <section aria-labelledby="results-courses" className="space-y-2">
        <h3 id="results-courses" className="text-sm font-semibold text-foreground">
          Respuestas correctas promedio por curso
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.courses.map((c) => {
            const q = courses.find((x) => x.code === c.code)?.questions ?? 1;
            const pct = (c.right * 100) / q;
            return (
              <li key={c.code} className="rounded-xl border border-border bg-background px-4 py-2.5">
                <span className="flex justify-between gap-3 text-sm">
                  <span className="truncate text-foreground">{c.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {short(c.right)}/{q}
                  </span>
                </span>
                <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                  <span className={cn('block h-full rounded-full', pct >= 60 ? 'bg-success' : pct >= 35 ? 'bg-warning' : 'bg-destructive')} style={{ width: `${pct}%` }} />
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <SearchBox value={query} onChange={setQuery} placeholder="Buscar alumno o código" />
        <SelectField
          id="results-area"
          value={levelId}
          options={[{ value: '', label: 'Todas las áreas' }, ...areas.map((l) => ({ value: l.id, label: l.name }))]}
          onChange={(v): void => {
            setLevelId(v);
            setSectionId('');
          }}
        />
        <SelectField id="results-section" value={sectionId} options={[{ value: '', label: 'Todas las aulas' }, ...sections]} onChange={setSectionId} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th scope="col" className="w-16 px-3 py-3 text-center font-medium">{rankLabel}</th>
              <th scope="col" className="px-3 py-3 font-medium">Alumno</th>
              <th scope="col" className="px-3 py-3 font-medium">Área · aula</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Buenas</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Malas</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Puntaje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((s) => {
              const r = rankOf(s);
              return (
                <tr key={s.studentId} className="cursor-pointer hover:bg-surface" onClick={(): void => setStudent(s)}>
                  <td className="px-3 py-2 text-center">
                    <span className={cn('inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold tabular-nums', r === 1 ? 'bg-brand text-brand-foreground' : r <= 3 ? 'bg-brand/14 text-brand' : 'text-muted-foreground')}>{r}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="block font-medium text-foreground">{s.studentName}</span>
                    <span className="block text-xs text-muted-foreground tabular-nums">{s.studentCode}</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {s.levelName.replace('San Marcos · ', '')} · {s.sectionLabel}
                  </td>
                  <td className="px-3 py-2 text-right text-success tabular-nums">{s.right}</td>
                  <td className="px-3 py-2 text-right text-destructive tabular-nums">{s.wrong}</td>
                  <td className="px-3 py-2 text-right font-semibold text-foreground tabular-nums">{formatScore(s.score)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="px-6 py-8 text-center text-sm text-muted-foreground">Nadie con esos filtros.</p>}
      </div>
      {student && <StudentDialog slug={slug} sheet={student} onClose={(): void => setStudent(null)} />}
    </div>
  );
};

const Figure = ({ label, value, detail }: { label: string; value: string; detail?: string }): JSX.Element => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
    {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
  </div>
);

const StudentDialog = ({ slug, sheet, onClose }: { slug: string; sheet: AnswerSheet; onClose: () => void }): JSX.Element => {
  const { data, error } = useAcademicData(`student-exams:${slug}:${sheet.studentId}`, () => getStudentExamsAction(slug, sheet.studentId), () => false);
  return (
    <Dialog open onOpenChange={(open): void => (open ? undefined : onClose())}>
      <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{sheet.studentName}</DialogTitle>
        </DialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : !data ? <PageSkeleton /> : <StudentExamsCard x={data} />}
      </DialogContent>
    </Dialog>
  );
};
