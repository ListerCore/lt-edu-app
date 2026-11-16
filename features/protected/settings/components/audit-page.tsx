'use client';

import type { JSX } from 'react';
import { Fragment } from 'react';
import { FilterX } from 'lucide';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, SelectField, StatusPill, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { items } from '@/features/protected/academic/data/academic-data';
import { auditModuleLabels } from '../data/settings-data';
import { useGetAuditEvents } from '../hooks/use-get-audit-events';

// Configuración › Auditoría: who changed what and when, newest first, grouped by day. Nothing here can be edited
export const AuditPage = (): JSX.Element => {
  const page = useGetAuditEvents();
  const { filters } = page;
  const filtered = Boolean(filters.module || filters.from || filters.to);

  return (
    <AcademicPage titleId="audit-title" title="Auditoría" description="Registro de los cambios hechos en el panel: quién, qué y cuándo. No se puede editar ni borrar." context={null}>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex w-full flex-col gap-1 text-xs text-muted-foreground sm:w-60">
          <span id="audit-module-label">Módulo</span>
          <SelectField id="audit-module" value={filters.module} options={[{ value: '', label: 'Todos los módulos' }, ...items(auditModuleLabels)]} onChange={(v): void => page.setFilter('module', v)} />
        </div>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Desde
          <Input type="date" value={filters.from} max={filters.to || undefined} onChange={(e): void => page.setFilter('from', e.target.value)} className={`${controlClassName} sm:w-44`} />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Hasta
          <Input type="date" value={filters.to} min={filters.from || undefined} onChange={(e): void => page.setFilter('to', e.target.value)} className={`${controlClassName} sm:w-44`} />
        </label>
        {filtered && (
          <button type="button" className="btn-alt h-10" onClick={page.clearFilters}>
            <MorphIcon icon={FilterX} size={16} />
            Quitar filtros
          </button>
        )}
      </div>

      <div className="mt-6">
        {page.error ? (
          <LoadError message={page.error} onRetry={page.reload} />
        ) : page.isLoading ? (
          <PageSkeleton />
        ) : page.rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">{filtered ? 'No hay cambios con esos filtros.' : 'Aún no hay cambios registrados.'}</p>
        ) : (
          <ol className="space-y-1">
            {page.rows.map((row, i) => (
              <Fragment key={row.id}>
                {(i === 0 || page.rows[i - 1].day !== row.day) && <li className="pt-5 pb-2 text-xs font-semibold tracking-wide text-muted-foreground first-letter:uppercase">{row.day}</li>}
                <li className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-3 rounded-xl border border-border bg-background px-4 py-3">
                  <time className="pt-0.5 text-xs whitespace-nowrap text-muted-foreground tabular-nums">{row.when}</time>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm text-foreground">
                      <StatusPill className={row.actionClass}>{row.actionLabel}</StatusPill>
                      <span className="min-w-0 break-words">{row.summary}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {row.who}
                      {row.roleLabel && ` · ${row.roleLabel}`} · {row.moduleLabel}
                    </p>
                    {row.changes.length > 0 && (
                      <dl className="mt-2 grid gap-x-4 gap-y-1 text-xs sm:grid-cols-[auto_minmax(0,1fr)]">
                        {row.changes.map((c) => (
                          <Fragment key={c.field}>
                            <dt className="text-muted-foreground">{c.field}</dt>
                            <dd className="text-foreground">
                              <span className="text-muted-foreground line-through">{c.before}</span> → {c.after}
                            </dd>
                          </Fragment>
                        ))}
                      </dl>
                    )}
                  </div>
                </li>
              </Fragment>
            ))}
          </ol>
        )}
        {page.hasMore && !page.isLoading && (
          <div className="mt-6 flex justify-center">
            <button type="button" className="btn-alt" onClick={page.loadMore} disabled={page.isLoadingMore}>
              {page.isLoadingMore ? 'Cargando…' : 'Ver cambios anteriores'}
            </button>
          </div>
        )}
      </div>
    </AcademicPage>
  );
};
