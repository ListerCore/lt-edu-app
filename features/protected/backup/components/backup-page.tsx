'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, CheckCircle2, ChevronRight, Cloud, Fingerprint, LockKeyhole, MapPin, Plus, ShieldCheck } from 'lucide-react';
import { BackupAutomation } from './backup-automation';
import { BackupDrills, BackupRecovery } from './backup-recovery';
import { BackupHistory } from './backup-history';
import { BackupMetrics } from './backup-metrics';
import { BackupTopology } from './backup-topology';

const BackupPage = (): JSX.Element => {
  const [backupCreated, setBackupCreated] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-2 text-[9px] text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          CEBA Joseph Lister
        </Link>
        <ChevronRight aria-hidden="true" className="size-3" />
        <span>Administración</span>
        <ChevronRight aria-hidden="true" className="size-3" />
        <span className="font-semibold text-foreground">Backup y recuperación</span>
      </div>
      <section className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-[8px] font-bold text-secondary">
              <span className="size-1.5 animate-pulse rounded-full bg-secondary" />
              Sistema de respaldo: activo
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-accent px-2.5 py-1 text-[8px] font-semibold text-primary">
              <LockKeyhole aria-hidden="true" className="size-3" />
              AES-256 en reposo y tránsito
            </span>
          </div>
          <h1 className="mt-3 max-w-3xl font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">Centro de respaldo y continuidad operativa</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-[8px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1">
              <Cloud aria-hidden="true" className="size-3 text-primary" />
              AWS Cloud + réplica local Ayacucho
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1">
              <ShieldCheck aria-hidden="true" className="size-3 text-secondary" />
              Cumplimiento EBA-MINEDU · R.V.M. 094
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="#backup-automation" className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-[9px] font-semibold text-foreground hover:bg-muted">
            <Fingerprint aria-hidden="true" className="size-3.5 text-primary" />
            Configurar políticas
          </a>
          <button type="button" onClick={(): void => setBackupCreated(true)} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[9px] font-semibold text-primary-foreground hover:opacity-90">
            <Plus aria-hidden="true" className="size-3.5" />
            Crear respaldo manual
          </button>
        </div>
      </section>
      {backupCreated && (
        <p role="status" className="flex items-center gap-2 rounded-md bg-secondary/10 px-3 py-2 text-[9px] font-semibold text-secondary">
          <CheckCircle2 aria-hidden="true" className="size-3.5" />
          Solicitud de respaldo manual registrada en esta demostración.
        </p>
      )}
      <BackupMetrics />
      <section className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1.8fr)_minmax(17rem,0.8fr)]">
        <BackupAutomation />
        <BackupTopology />
      </section>
      <BackupHistory />
      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <BackupRecovery />
        <BackupDrills />
      </section>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-[9px] text-muted-foreground">
        <span>CEBA Privado Virtual Joseph Lister · Seguridad de datos SIGE-JL</span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin aria-hidden="true" className="size-3" />
          Sede Central Ayacucho <CalendarDays aria-hidden="true" className="ml-2 size-3" />
          Periodo 2026-II
        </span>
        <Link href="/dashboard/settings" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
          Políticas de seguridad <ArrowRight aria-hidden="true" className="size-3" />
        </Link>
      </div>
    </main>
  );
};

export { BackupPage };
