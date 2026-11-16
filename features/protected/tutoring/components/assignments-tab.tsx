'use client';

import { useMemo, useState, useTransition, type JSX } from 'react';
import { UserCheck } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { SearchBox } from '@/features/protected/people/components/people-ui';
import { assignTutorAction } from '../actions/assign-tutor';
import { useTutorAssignments } from '../hooks/use-tutor-assignments';

const fold = (v: string): string => v.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// Dirección and coordinación: the load of each tutor, and a tutor of their own for some students (over their
// section's), or back to the section's
export const AssignmentsTab = ({ slug }: { slug: string }): JSX.Element => {
  const { data, error, reload } = useTutorAssignments(slug);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [staffId, setStaffId] = useState('');
  const [isPending, start] = useTransition();
  const rows = useMemo(() => (data?.students ?? []).filter((s) => !query || fold(`${s.name} ${s.code} ${s.placement} ${s.staffName}`).includes(fold(query))), [data, query]);
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  const assign = (to: string): void =>
    start(async () => {
      const r = await runAcademicAction(assignTutorAction(slug, picked, to));
      if (r.ok) {
        setPicked([]);
        reload();
      }
    });
  return (
    <div className="space-y-6">
      <section aria-labelledby="ta-loads" className="space-y-2">
        <h2 id="ta-loads" className="text-sm font-semibold text-foreground">
          Carga por tutor
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {data.loads.map((l) => (
            <li key={l.staffId} className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-medium text-foreground">{l.name}</span>
                <span className="text-lg font-semibold text-foreground tabular-nums">{l.bySection + l.individual}</span>
              </span>
              <span className="block text-xs text-muted-foreground">
                {l.sections.join(' · ') || 'Sin sección'}
                {l.individual > 0 && ` · ${l.individual} con tutor propio`}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="ta-students" className="space-y-3">
        <h2 id="ta-students" className="text-sm font-semibold text-foreground">
          Estudiantes y su tutor
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-56 flex-1">
            <SearchBox value={query} onChange={setQuery} placeholder="Buscar estudiante, sección o tutor" />
          </div>
          <div className="w-64">
            <SelectField id="ta-staff" value={staffId} options={[{ value: '', label: 'Elige el tutor…' }, ...data.candidates.map((c) => ({ value: c.staffId, label: `${c.name} · ${c.position}` }))]} onChange={setStaffId} />
          </div>
          <button type="button" className="btn-brand" disabled={isPending || picked.length === 0 || !staffId} onClick={(): void => assign(staffId)}>
            <MorphIcon icon={UserCheck} size={16} />
            Asignar a {picked.length}
          </button>
          <button type="button" className="btn-alt" disabled={isPending || picked.length === 0} onClick={(): void => assign('')}>
            Volver al tutor de su sección
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="w-10 px-3 py-2.5">
                  <span className="sr-only">Elegir</span>
                </th>
                <th scope="col" className="px-3 py-2.5 font-medium">Estudiante</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Sección</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Tutor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.slice(0, 300).map((s) => (
                <tr key={s.studentId}>
                  <td className="px-3 py-2">
                    <input type="checkbox" aria-label={`Elegir a ${s.name}`} className="size-4 accent-brand" checked={picked.includes(s.studentId)} onChange={(e): void => setPicked((p) => (e.target.checked ? [...p, s.studentId] : p.filter((x) => x !== s.studentId)))} />
                  </td>
                  <td className="px-3 py-2 text-foreground">{s.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{s.placement}</td>
                  <td className="px-3 py-2">
                    {s.staffName || <span className="text-warning">Sin tutor</span>}
                    {s.individual && <span className="pill ml-2 bg-brand-soft text-brand">Propio</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length > 300 && <p className="text-xs text-muted-foreground">Se muestran 300 de {rows.length}: usa la búsqueda.</p>}
      </section>
    </div>
  );
};
