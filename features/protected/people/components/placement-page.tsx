'use client';

import Link from 'next/link';
import { useState, useTransition, type JSX } from 'react';
import { Plus } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { AcademicPage, ConfirmDelete, controlClassName, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay, items, todayISO } from '@/features/protected/academic/data/academic-data';
import { runAcademicAction, useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { isPeopleEvent } from '@/hooks/use-live';
import { createPlacementAction, deletePlacementAction, getPlacementsAction, searchStudentsAction } from '../actions/people-actions';
import { fullName, placementKindLabels, studentPath } from '../data/people-data';
import { useDebounced } from '../hooks/use-debounced';
import { usePeopleContext } from '../hooks/use-people-context';
import type { PeopleContextData, Placement, PlacementFormValues, Student } from '../types';
import { SearchBox } from './people-ui';

// Ubicación y convalidación (EBA): who was placed by a test or had grades validated, and in which cycle and grade
export const PlacementPage = (): JSX.Element => {
  const { data: ctx, error, isLoading, reload, slug } = usePeopleContext();
  const { data, reload: reloadList } = useAcademicData(`placements:${slug}`, () => getPlacementsAction(slug), isPeopleEvent);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const usable = ctx?.context.usesAttentionModes;

  return (
    <AcademicPage
      titleId="placement-title"
      title="Ubicación y convalidación"
      description="Quien no tiene certificados rinde una prueba de ubicación que define su ciclo y grado; quien estudió en otra institución convalida los grados aprobados. El resultado orienta su matrícula."
      context={ctx ? { ...ctx.context, canManage: ctx.canManage } : null}
      actions={
        usable && (
          <button type="button" className="btn-brand" onClick={(): void => setCreating(true)}>
            <MorphIcon icon={Plus} size={16} />
            Registrar
          </button>
        )
      }
    >
      {isLoading ? (
        <PageSkeleton />
      ) : error || !ctx ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : !usable ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">La ubicación y la convalidación son propias de la Educación Básica Alternativa (CEBA).</p>
      ) : (data ?? []).length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Aún no hay registros.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-medium">Estudiante</th>
                <th scope="col" className="px-4 py-3 font-medium">Proceso</th>
                <th scope="col" className="px-4 py-3 font-medium">Resultado</th>
                <th scope="col" className="px-4 py-3 font-medium">Fecha</th>
                <th scope="col" className="px-4 py-3 font-medium">Referencia</th>
                {ctx.canManage && <th scope="col" className="sr-only">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(data ?? []).map((p: Placement) => (
                <tr key={p.id}>
                  <td className="px-4 py-2.5">
                    <Link href={studentPath(p.studentId)} className="font-medium text-foreground hover:text-brand">
                      {p.studentName}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-foreground">{placementKindLabels[p.kind]}</td>
                  <td className="px-4 py-2.5 text-foreground">
                    {p.levelName} · {p.gradeName}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{formatDay(p.decidedOn)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{p.reference || '—'}</td>
                  {ctx.canManage && (
                    <td className="px-2 py-2 text-right">
                      <ConfirmDelete compact isPending={isPending} title="¿Eliminar el registro?" description={`${placementKindLabels[p.kind]} de ${p.studentName}.`} onConfirm={(): void => startTransition(async (): Promise<void> => { await runAcademicAction(deletePlacementAction(slug, p.id)); reloadList(); })} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {ctx && creating && <PlacementDialog slug={slug} ctx={ctx} onClose={(): void => setCreating(false)} onSaved={reloadList} />}
    </AcademicPage>
  );
};

const PlacementDialog = ({ slug, ctx, onClose, onSaved }: { slug: string; ctx: PeopleContextData; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const [today] = useState(todayISO);
  const [picked, setPicked] = useState<Student | null>(null);
  const [search, setSearch] = useState('');
  const query = useDebounced(search);
  const first = ctx.levels[0];
  const { values, errors, isPending, setField, submit } = useAcademicForm<PlacementFormValues, Placement>({
    initial: { studentId: '', kind: 'placement_test', levelId: first?.id ?? '', gradeId: first?.grades[0]?.id ?? '', decidedOn: today, reference: '', notes: '' },
    validate: (v): Record<string, string> => (v.studentId ? {} : { studentId: 'Elige un estudiante.' }),
    save: (v) => createPlacementAction(slug, v),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });
  const { data: results } = useAcademicData(`placement-search:${slug}:${query}`, async () => (picked ? { ok: true as const, data: [] as Student[] } : searchStudentsAction(slug, query, '')));
  const level = ctx.levels.find((l) => l.id === values.levelId);

  return (
    <FormDialog title="Registrar ubicación o convalidación" submitLabel="Registrar" isPending={isPending} onSubmit={submit} onClose={onClose} wide>
      <FormField id="pl-student" label="Estudiante" required error={errors.studentId}>
        {picked ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-brand/40 bg-brand-soft px-4 py-2.5 text-sm">
            <span className="font-medium text-foreground">{fullName(picked)}</span>
            <button type="button" className="text-sm font-medium text-brand hover:underline" onClick={(): void => { setPicked(null); setField('studentId', ''); }}>
              Cambiar
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <SearchBox value={search} onChange={setSearch} placeholder="Nombre, código o DNI" autoFocus />
            <ul className="max-h-44 divide-y divide-border overflow-y-auto rounded-lg border border-border">
              {(results ?? []).map((s) => (
                <li key={s.id}>
                  <button type="button" className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-secondary" onClick={(): void => { setPicked(s); setField('studentId', s.id); }}>
                    <span className="text-foreground">{fullName(s)}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{s.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </FormField>
      <div className="grid gap-5 sm:grid-cols-3">
        <FormField id="pl-kind" label="Proceso" required>
          <SelectField id="pl-kind" value={values.kind} options={items(placementKindLabels)} onChange={(v): void => setField('kind', v)} />
        </FormField>
        <FormField id="pl-level" label="Ciclo" required error={errors.levelId}>
          <SelectField id="pl-level" value={values.levelId} options={ctx.levels.map((l) => ({ value: l.id, label: l.name }))} onChange={(v): void => { setField('levelId', v); setField('gradeId', ctx.levels.find((l) => l.id === v)?.grades[0]?.id ?? ''); }} />
        </FormField>
        <FormField id="pl-grade" label={values.kind === 'validation' ? 'Convalida hasta' : 'Se ubica en'} required error={errors.gradeId}>
          <SelectField id="pl-grade" value={values.gradeId} options={(level?.grades ?? []).map((g) => ({ value: g.id, label: g.name }))} onChange={(v): void => setField('gradeId', v)} />
        </FormField>
        <FormField id="pl-date" label="Fecha" required error={errors.decidedOn}>
          <Input id="pl-date" type="date" max={today} value={values.decidedOn} onChange={(e): void => setField('decidedOn', e.target.value)} className={controlClassName} />
        </FormField>
        <FormField id="pl-reference" label="Referencia" error={errors.reference} hint="Resolución, acta o certificado.">
          <Input id="pl-reference" value={values.reference} maxLength={120} onChange={(e): void => setField('reference', e.target.value)} className={controlClassName} />
        </FormField>
      </div>
      <FormField id="pl-notes" label="Observaciones" error={errors.notes}>
        <Textarea id="pl-notes" rows={2} maxLength={1000} value={values.notes} onChange={(e): void => setField('notes', e.target.value)} className="rounded-lg bg-background" />
      </FormField>
    </FormDialog>
  );
};
