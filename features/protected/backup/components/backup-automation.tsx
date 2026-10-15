'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { AlarmClock, Archive, Database, FileStack, FolderLock, ShieldCheck, Video } from 'lucide-react';
import { backupModules } from '../data/backup-data';

const moduleIcons = [Database, FolderLock, Video, FileStack];

const BackupAutomation = (): JSX.Element => {
  const [included, setIncluded] = useState<string[]>(backupModules.map(({ id }) => id));

  return (
    <section id="backup-automation" aria-labelledby="backup-automation-heading" className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
      <header className="border-b border-border bg-muted/40 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <Archive aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <h2 id="backup-automation-heading" className="font-heading text-sm font-bold text-foreground">
                Automatización y contenido del backup
              </h2>
              <p className="mt-1 text-[10px] leading-4 text-muted-foreground">Frecuencias programadas y componentes incluidos en las copias.</p>
            </div>
          </div>
          <span className="rounded bg-secondary/10 px-2 py-1 text-[9px] font-bold text-secondary">Motor Cron v4.2 · Activo</span>
        </div>
      </header>
      <div className="space-y-5 p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <article className="flex min-w-0 flex-col rounded-md border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[9px] font-bold uppercase tracking-wide text-primary">Copia diaria</h3>
              <AlarmClock aria-hidden="true" className="size-4 shrink-0 text-secondary" />
            </div>
            <p className="mt-2 flex-1 text-[10px] leading-4 text-muted-foreground">Todos los días a las 03:00. Captura diferencial de transacciones y cambios.</p>
            <p className="mt-3 text-[9px] font-semibold text-primary">RPO objetivo: ≤ 24 h</p>
          </article>
          <article className="flex min-w-0 flex-col rounded-md border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[9px] font-bold uppercase tracking-wide text-primary">Copia semanal full</h3>
              <Archive aria-hidden="true" className="size-4 shrink-0 text-primary" />
            </div>
            <p className="mt-2 flex-1 text-[10px] leading-4 text-muted-foreground">Domingos a las 23:59. Base de datos y repositorios de expedientes.</p>
            <p className="mt-3 text-[9px] font-semibold text-primary">Compresión zstd Lv9</p>
          </article>
          <article className="flex min-w-0 flex-col rounded-md border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[9px] font-bold uppercase tracking-wide text-primary">Cierre de periodo</h3>
              <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-chart-3" />
            </div>
            <p className="mt-2 flex-1 text-[10px] leading-4 text-muted-foreground">Snapshots bimestrales inmutables antes del reporte oficial SIAGIE.</p>
            <p className="mt-3 text-[9px] font-semibold text-chart-3">Retención WORM: 5 años</p>
          </article>
        </div>
        <div>
          <h3 className="text-[11px] font-bold text-foreground">Módulos incluidos en el respaldo integral</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {backupModules.map(({ id, name, detail }, index) => {
              const Icon = moduleIcons[index];
              const checked = included.includes(id);
              return (
                <label key={id} className="flex min-w-0 cursor-pointer items-start gap-3 rounded-md bg-muted/50 p-3 transition-colors hover:bg-muted">
                  <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold text-foreground">{name}</span>
                    <span className="mt-1 block text-[9px] leading-4 text-muted-foreground">{detail}</span>
                  </span>
                  <input aria-label={`Incluir ${name}`} type="checkbox" checked={checked} onChange={(): void => setIncluded((current) => (checked ? current.filter((item) => item !== id) : [...current, id]))} className="mt-0.5 size-4 shrink-0 accent-primary" />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export { BackupAutomation };
