'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';
import { Plus, UserRound } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, SelectField, StatusPill } from '@/features/protected/academic/components/academic-ui';
import { lower } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { isPeopleEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getStudentsAction } from '../actions/people-actions';
import { accessClass, accessLabels, NEW_STUDENT_PATH, PAGE_SIZE, placeLine, studentPath, studentStatusClass, studentStatusLabels } from '../data/people-data';
import { useDebounced } from '../hooks/use-debounced';
import { usePeopleContext } from '../hooks/use-people-context';
import type { PeopleContextData, StudentsQuery } from '../types';
import { Pager, SearchBox } from './people-ui';

const ANY = '';

// Estudiantes / Alumnos: search and filter by where they are enrolled, open one to see its family and enrollments
export const StudentsPage = (): JSX.Element => {
  const { data: ctx, error: ctxError, isLoading: ctxLoading, reload: reloadCtx, slug } = usePeopleContext();
  const noun = ctx?.context.vocabulary?.level === 'Área' ? 'alumnos' : 'estudiantes';

  return (
    <AcademicPage
      titleId="students-title"
      title={noun === 'alumnos' ? 'Alumnos' : 'Estudiantes'}
      description="Ficha de cada estudiante, su familia y dónde está matriculado. Busca por nombre, código o documento."
      context={ctx ? { ...ctx.context, canManage: ctx.canManage } : null}
      actions={
        <Link href={NEW_STUDENT_PATH} className="btn-brand">
          <MorphIcon icon={Plus} size={16} />
          Nuevo {noun === 'alumnos' ? 'alumno' : 'estudiante'}
        </Link>
      }
    >
      {ctxLoading ? <PageSkeleton /> : ctxError || !ctx ? <LoadError message={ctxError ?? 'Sin datos.'} onRetry={reloadCtx} /> : <StudentsList slug={slug} ctx={ctx} noun={noun} />}
    </AcademicPage>
  );
};

const StudentsList = ({ slug, ctx, noun }: { slug: string; ctx: PeopleContextData; noun: string }): JSX.Element => {
  const router = useRouter();
  const vocabulary = ctx.context.vocabulary;
  const defaultPeriod = ctx.periods.find((p) => p.status === 'active') ?? ctx.periods[0];
  const [filters, setFilters] = useState<StudentsQuery>({ query: '', status: 'active', periodId: defaultPeriod?.id ?? '', levelId: '', gradeId: '', sectionId: '', notEnrolled: false, page: 1 });
  const query = useDebounced(filters.query);
  const effective = { ...filters, query };
  const { data, error, isLoading, reload } = useAcademicData(`students:${slug}:${JSON.stringify(effective)}`, () => getStudentsAction(slug, effective), isPeopleEvent);
  const set = (patch: Partial<StudentsQuery>): void => setFilters((current) => ({ ...current, page: 1, ...patch }));
  const level = ctx.levels.find((l) => l.id === filters.levelId);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
        <SearchBox value={filters.query} onChange={(value): void => setFilters((c) => ({ ...c, query: value, page: 1 }))} placeholder="Buscar por nombre, código o DNI" />
        <SelectField id="filter-period" value={filters.periodId} options={[{ value: ANY, label: 'Cualquier periodo' }, ...ctx.periods.map((p) => ({ value: p.id, label: p.name }))]} onChange={(v): void => set({ periodId: v, levelId: '', gradeId: '', notEnrolled: false })} />
        <SelectField id="filter-level" value={filters.notEnrolled ? '__none' : filters.levelId} disabled={!filters.periodId} options={[{ value: ANY, label: `Todos los ${lower(vocabulary?.levels ?? 'niveles')}` }, ...ctx.levels.map((l) => ({ value: l.id, label: l.name })), { value: '__none', label: 'Sin matrícula en el periodo' }]} onChange={(v): void => (v === '__none' ? set({ notEnrolled: true, levelId: '', gradeId: '' }) : set({ levelId: v, gradeId: '', notEnrolled: false }))} />
        {ctx.context.hasGrades ? (
          <SelectField id="filter-grade" value={filters.gradeId} disabled={!level} options={[{ value: ANY, label: `Todos los ${lower(vocabulary?.grades ?? 'grados')}` }, ...(level?.grades ?? []).map((g) => ({ value: g.id, label: g.name }))]} onChange={(v): void => set({ gradeId: v })} />
        ) : (
          <span className="hidden md:block" />
        )}
        <SelectField id="filter-status" value={filters.status} options={[{ value: ANY, label: 'Cualquier estado' }, ...Object.entries(studentStatusLabels).map(([value, label]) => ({ value, label }))]} onChange={(v): void => set({ status: v })} />
      </div>

      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : (
        <div className={cn('overflow-x-auto rounded-2xl border border-border bg-background transition-opacity', isLoading && 'opacity-60')}>
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-medium">
                  {noun === 'alumnos' ? 'Alumno' : 'Estudiante'}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {filters.periodId ? (ctx.periods.find((p) => p.id === filters.periodId)?.name ?? 'Matrícula') : 'Última matrícula'}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">Apoderado principal</th>
                <th scope="col" className="px-4 py-3 font-medium">Panel</th>
                <th scope="col" className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(data?.students ?? []).map((s) => (
                <tr key={s.id} className="cursor-pointer transition-colors hover:bg-surface" onClick={(): void => router.push(studentPath(s.id))}>
                  <td className="px-4 py-3">
                    <Link href={studentPath(s.id)} className="flex items-center gap-3" onClick={(e): void => e.stopPropagation()}>
                      <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                        <MorphIcon icon={UserRound} size={16} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-foreground">
                          {[s.paternalSurname, s.maternalSurname].filter(Boolean).join(' ')}, {s.givenNames}
                        </span>
                        <span className="block text-xs text-muted-foreground tabular-nums">
                          {s.code} · {s.documentType.toUpperCase()} {s.documentNumber}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground">{placeLine(s.enrollment, vocabulary?.section)}</td>
                  <td className="px-4 py-3">
                    {s.primaryGuardianName ? (
                      <>
                        <span className="block text-foreground">{s.primaryGuardianName}</span>
                        <span className="block text-xs text-muted-foreground tabular-nums">{s.primaryGuardianPhone || 'Sin teléfono'}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill className={accessClass[s.access]}>{accessLabels[s.access]}</StatusPill>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill className={studentStatusClass[s.status]}>{studentStatusLabels[s.status]}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && (data?.students.length ?? 0) === 0 && <p className="px-6 py-10 text-center text-sm text-muted-foreground">No hay {noun} con esos filtros.</p>}
          {isLoading && !data && <p className="px-6 py-10 text-center text-sm text-muted-foreground">Cargando…</p>}
        </div>
      )}
      {data && <Pager page={filters.page} pageSize={PAGE_SIZE} total={data.total} noun={noun} onPage={(page): void => setFilters((c) => ({ ...c, page }))} />}
    </div>
  );
};
