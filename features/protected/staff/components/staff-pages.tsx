'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition, type JSX } from 'react';
import { ArrowLeft, KeyRound, Plus, UserRound } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, SelectField, StatusPill } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { Pager, SearchBox } from '@/features/protected/people/components/people-ui';
import { useDebounced } from '@/features/protected/people/hooks/use-debounced';
import { isPeopleEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { deleteStaffAction, getStaffAction, getStaffListAction, grantRoleAction } from '../actions/staff-actions';
import { STAFF_PAGE_SIZE, STAFF_PATH, staffPath, staffRoleLabels, staffStatusClass, staffStatusLabels } from '../data/staff-data';
import type { Staff, StaffQuery } from '../types';
import { StaffForm } from './staff-form';

const roleList = (s: Staff): string => [...s.roles.map((r) => staffRoleLabels[r] ?? r), ...s.invited.filter((r) => !s.roles.includes(r)).map((r) => `${staffRoleLabels[r] ?? r} (invitado)`)].join(', ');

// Docentes y personal: everyone who works at the institution, with their teaching load and panel roles
export const StaffListPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const router = useRouter();
  const [q, setQ] = useState<StaffQuery>({ query: '', status: 'active', teachersOnly: false, page: 1 });
  const query = useDebounced(q.query);
  const effective = { ...q, query };
  const { data, error, isLoading, reload } = useAcademicData(`staff:${slug}:${JSON.stringify(effective)}`, () => getStaffListAction(slug, effective), isPeopleEvent);
  const [creating, setCreating] = useState(false);
  const set = (patch: Partial<StaffQuery>): void => setQ((c) => ({ ...c, page: 1, ...patch }));

  return (
    <AcademicPage
      titleId="staff-title"
      title="Docentes y personal"
      description="Quién trabaja en la institución, qué dicta cada docente y con qué rol entra al panel."
      context={data ? { canManage: data.canManage } : null}
      actions={
        <button type="button" className="btn-brand" onClick={(): void => setCreating(true)}>
          <MorphIcon icon={Plus} size={16} />
          Registrar
        </button>
      }
    >
      {creating ? (
        <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Nuevo registro</h2>
          <StaffForm slug={slug} staff={null} onSaved={(s): void => router.push(staffPath(s.id))} onCancel={(): void => setCreating(false)} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <SearchBox value={q.query} onChange={(v): void => setQ((c) => ({ ...c, query: v, page: 1 }))} placeholder="Buscar por nombre, cargo, especialidad o DNI" />
            <SelectField id="staff-kind" value={q.teachersOnly ? 'teachers' : ''} options={[{ value: '', label: 'Todo el personal' }, { value: 'teachers', label: 'Solo docentes' }]} onChange={(v): void => set({ teachersOnly: v === 'teachers' })} />
            <SelectField id="staff-status" value={q.status} options={[{ value: '', label: 'Cualquier estado' }, ...Object.entries(staffStatusLabels).map(([value, label]) => ({ value, label }))]} onChange={(v): void => set({ status: v })} />
          </div>
          {error ? (
            <LoadError message={error} onRetry={reload} />
          ) : !data ? (
            <PageSkeleton />
          ) : (
            <>
              <div className={cn('overflow-x-auto rounded-2xl border border-border bg-background transition-opacity', isLoading && 'opacity-60')}>
                <table className="w-full min-w-[54rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th scope="col" className="px-4 py-3 font-medium">Persona</th>
                      <th scope="col" className="px-4 py-3 font-medium">Cargo</th>
                      <th scope="col" className="px-4 py-3 font-medium">Carga</th>
                      <th scope="col" className="px-4 py-3 font-medium">Panel</th>
                      <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.staff.map((s) => {
                      const over = s.maxWeeklyHours !== undefined && s.assignedHours > s.maxWeeklyHours;
                      return (
                        <tr key={s.id} className="cursor-pointer hover:bg-surface" onClick={(): void => router.push(staffPath(s.id))}>
                          <td className="px-4 py-3">
                            <Link href={staffPath(s.id)} onClick={(e): void => e.stopPropagation()} className="flex items-center gap-3">
                              <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                                <MorphIcon icon={UserRound} size={16} />
                              </span>
                              <span>
                                <span className="block font-medium text-foreground">
                                  {s.surnames}, {s.givenNames}
                                </span>
                                <span className="block text-xs text-muted-foreground tabular-nums">
                                  {s.code} · DNI {s.documentNumber}
                                </span>
                              </span>
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <span className="block text-foreground">{s.position}</span>
                            {s.specialty && <span className="block text-xs text-muted-foreground">{s.specialty}</span>}
                          </td>
                          <td className="px-4 py-3">
                            {s.isTeacher ? (
                              <span className={cn('tabular-nums', over ? 'font-semibold text-warning' : 'text-foreground')}>
                                {s.assignedHours}
                                {s.maxWeeklyHours !== undefined && ` / ${s.maxWeeklyHours}`} h
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                            {s.tutorOf.length > 0 && <span className="block text-xs text-muted-foreground">Tutor de {s.tutorOf.join(', ')}</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{roleList(s) || 'Sin acceso'}</td>
                          <td className="px-4 py-3">
                            <StatusPill className={staffStatusClass[s.status]}>{staffStatusLabels[s.status]}</StatusPill>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {data.staff.length === 0 && <p className="px-6 py-10 text-center text-sm text-muted-foreground">Nadie con esos filtros.</p>}
              </div>
              <Pager page={q.page} pageSize={STAFF_PAGE_SIZE} total={data.total} noun="personas" onPage={(page): void => setQ((c) => ({ ...c, page }))} />
            </>
          )}
        </div>
      )}
    </AcademicPage>
  );
};

// One person of the staff: record, teaching load in open periods and panel roles
export const StaffDetailPage = ({ id }: { id: string }): JSX.Element => {
  const slug = useInstitutionSlug();
  const router = useRouter();
  const { data, error, isLoading, reload } = useAcademicData(`staff-one:${slug}:${id}`, () => getStaffAction(slug, id), isPeopleEvent);
  const [role, setRole] = useState('teacher');
  const [isPending, startTransition] = useTransition();
  const s = data?.staff;
  const hours = data?.assignments.reduce((sum, a) => sum + a.weeklyHours, 0) ?? 0;

  return (
    <AcademicPage
      titleId="staff-one-title"
      title={s ? `${s.surnames}, ${s.givenNames}` : isLoading ? 'Cargando…' : 'Personal'}
      description={s ? `${s.code} · ${s.position}${s.specialty ? ` · ${s.specialty}` : ''}` : ''}
      context={data ? { canManage: data.canManage } : null}
      back={
        <Link href={STAFF_PATH} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <MorphIcon icon={ArrowLeft} size={15} />
          Docentes y personal
        </Link>
      }
      actions={
        s && (
          <ConfirmDelete
            title={`¿Eliminar a ${s.givenNames}?`}
            description="Solo si no tiene carga docente ni tutoría. Si ya trabajó aquí, márcalo como inactivo."
            disabled={(data?.assignments.length ?? 0) > 0 || s.tutorOf.length > 0}
            disabledReason="Tiene carga docente o tutoría: márcalo como inactivo."
            isPending={isPending}
            onConfirm={(): void =>
              startTransition(async (): Promise<void> => {
                const r = await runAcademicAction(deleteStaffAction(slug, id));
                if (r.ok) router.push(STAFF_PATH);
              })
            }
          />
        )
      }
    >
      {isLoading ? (
        <PageSkeleton />
      ) : error || !data || !s ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <StaffForm key={`${s.id}${s.status}${s.email}`} slug={slug} staff={s} readOnly={!data.canManage} onSaved={reload} />
          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-background p-5">
              <h2 className="font-semibold text-foreground">Acceso al panel</h2>
              {s.roles.length + s.invited.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">Sin acceso.</p>
              ) : (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {s.roles.map((r) => (
                    <li key={r} className="pill bg-success/12 text-success">
                      {staffRoleLabels[r] ?? r}
                    </li>
                  ))}
                  {s.invited
                    .filter((r) => !s.roles.includes(r))
                    .map((r) => (
                      <li key={r} className="pill bg-warning/12 text-warning">
                        {staffRoleLabels[r] ?? r} · invitado
                      </li>
                    ))}
                </ul>
              )}
              {data.canGrant &&
                (s.email ? (
                  <div className="mt-4 flex gap-2">
                    <div className="min-w-0 flex-1">
                      <SelectField id="grant-role" value={role} options={Object.entries(staffRoleLabels).map(([value, label]) => ({ value, label }))} onChange={setRole} />
                    </div>
                    <button type="button" className="btn-alt shrink-0" disabled={isPending} onClick={(): void => startTransition(async (): Promise<void> => { await runAcademicAction(grantRoleAction(slug, id, role)); reload(); })}>
                      <MorphIcon icon={KeyRound} size={15} />
                      Dar rol
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">Registra su correo para darle acceso.</p>
                ))}
            </section>
            {s.isTeacher && (
              <section className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-semibold text-foreground">Carga docente</h2>
                  <span className={cn('text-sm tabular-nums', s.maxWeeklyHours !== undefined && hours > s.maxWeeklyHours ? 'font-semibold text-warning' : 'text-muted-foreground')}>
                    {hours}
                    {s.maxWeeklyHours !== undefined && ` / ${s.maxWeeklyHours}`} h
                  </span>
                </div>
                {s.tutorOf.length > 0 && <p className="mt-2 text-sm text-foreground">Tutor de {s.tutorOf.join(', ')}</p>}
                {data.assignments.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">Sin cursos asignados.</p>
                ) : (
                  <ul className="mt-3 divide-y divide-border text-sm">
                    {data.assignments.map((a) => (
                      <li key={a.id} className="flex items-start justify-between gap-3 py-2">
                        <span>
                          <span className="block text-foreground">{a.subjectName}</span>
                          <span className="block text-xs text-muted-foreground">
                            {a.sectionLabel} · {a.periodName}
                          </span>
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">{a.weeklyHours} h</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </aside>
        </div>
      )}
    </AcademicPage>
  );
};
