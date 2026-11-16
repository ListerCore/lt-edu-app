'use client';

import type { JSX } from 'react';
import { Search, Sparkles } from 'lucide';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, SelectField, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { useClassroomCatalog } from '../hooks/use-classroom-catalog';
import { RoomCard } from './room-card';

// Aula virtual: the rooms of a period grouped by cycle and grade. Staff pick the period and generate the rooms from
// the plan of study; students see the published rooms of their grade
export const ClassroomPage = (): JSX.Element => {
  const page = useClassroomCatalog();
  const data = page.data;
  const family = data?.mode === 'family';

  return (
    <AcademicPage
      titleId="classroom-title"
      title={family ? 'Mis aulas virtuales' : 'Aulas virtuales'}
      description={family ? 'El material de cada área, organizado por unidades. Lo que ya abriste queda marcado.' : 'Un aula por área y grado del periodo, con su material por unidades y sesiones en vivo.'}
      context={data?.canManage ? { canManage: true } : null}
      actions={
        <button type="button" className="btn-brand" onClick={page.generate} disabled={page.isGenerating || !page.periodId}>
          <MorphIcon icon={Sparkles} size={16} />
          {page.isGenerating ? 'Generando…' : 'Generar aulas del plan de estudios'}
        </button>
      }
    >
      <div className="flex flex-wrap gap-3">
        {data && !family && data.periods.length > 0 && (
          <div className="w-full sm:w-64">
            <SelectField id="classroom-period" value={page.periodId} options={data.periods.map((p) => ({ value: p.id, label: p.name }))} onChange={page.setPeriodId} />
          </div>
        )}
        <label className="relative min-w-0 flex-1 basis-64">
          <span className="sr-only">Buscar aula</span>
          <MorphIcon icon={Search} size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
          <Input value={page.query} onChange={(e): void => page.setQuery(e.target.value)} placeholder={family ? 'Buscar por área' : 'Buscar por área, grado o docente'} className={`${controlClassName} pl-9`} />
        </label>
      </div>

      <div className="mt-6">
        {page.error ? (
          <LoadError message={page.error} onRetry={page.reload} />
        ) : page.isLoading ? (
          <PageSkeleton />
        ) : page.total === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            {family
              ? 'Aún no hay aulas publicadas para tu grado.'
              : data?.mode === 'teacher'
                ? 'No tienes aulas en este periodo. Coordinación las genera a partir de tu carga docente.'
                : data?.canManage
                  ? 'Este periodo aún no tiene aulas. Genéralas a partir del plan de estudios vigente.'
                  : 'Este periodo aún no tiene aulas.'}
          </p>
        ) : (
          <div className="space-y-8">
            {!family && page.drafts > 0 && (
              <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
                {page.drafts === 1 ? 'Un aula está en borrador' : `${page.drafts} aulas están en borrador`}: los estudiantes no las ven hasta que se publican desde sus ajustes.
              </p>
            )}
            {page.groups.length === 0 && <p className="text-sm text-muted-foreground">Ningún aula coincide con la búsqueda.</p>}
            {page.groups.map((g) => (
              <section key={g.key} aria-label={g.title}>
                <h2 className="text-sm font-semibold text-muted-foreground">{g.title}</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {g.rooms.map((r) => (
                    <RoomCard key={r.id} room={r} family={family} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </AcademicPage>
  );
};
