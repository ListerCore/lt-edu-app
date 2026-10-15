'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, RotateCcw, ShieldCheck } from 'lucide-react';

const BackupRecovery = (): JSX.Element => {
  const [scope, setScope] = useState('selective');
  const [started, setStarted] = useState(false);

  return (
    <section aria-labelledby="drp-heading" className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex items-center gap-3 border-b border-border bg-muted/40 p-4 sm:p-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-destructive/10 text-destructive">
          <AlertTriangle aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0">
          <h2 id="drp-heading" className="font-heading text-sm font-bold text-foreground">
            Protocolo de recuperación ante desastres
          </h2>
          <p className="mt-1 text-[9px] leading-4 text-muted-foreground">Asistente de reversión segura y continuidad operativa.</p>
        </div>
      </header>
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-start gap-2 rounded-md bg-accent/60 p-3">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-[9px] leading-4 text-muted-foreground">
            <strong className="text-foreground">Validación de alta seguridad.</strong> Toda restauración de producción requiere aprobación de doble factor (2FA) del Promotor General o Administrador TIC.
          </p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-[9px] font-bold text-foreground">1. Selección de alcance</p>
          <p className="mt-1 text-[9px] leading-4 text-muted-foreground">Elige restaurar un módulo o toda la infraestructura.</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <label className={`flex cursor-pointer items-start gap-2 rounded-md border p-2.5 text-[9px] ${scope === 'selective' ? 'border-primary bg-accent/60' : 'border-border'}`}>
              <input type="radio" name="drp-scope" checked={scope === 'selective'} onChange={(): void => setScope('selective')} className="mt-0.5 accent-primary" />
              <span>
                <strong>Selectiva</strong>
                <span className="mt-0.5 block text-muted-foreground">Solo un módulo específico</span>
              </span>
            </label>
            <label className={`flex cursor-pointer items-start gap-2 rounded-md border p-2.5 text-[9px] ${scope === 'total' ? 'border-primary bg-accent/60' : 'border-border'}`}>
              <input type="radio" name="drp-scope" checked={scope === 'total'} onChange={(): void => setScope('total')} className="mt-0.5 accent-primary" />
              <span>
                <strong>Total</strong>
                <span className="mt-0.5 block text-muted-foreground">Sobrescritura integral del estado</span>
              </span>
            </label>
          </div>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-[9px] font-bold text-foreground">2. Aislamiento y mantenimiento</p>
          <p className="mt-1 text-[9px] leading-4 text-muted-foreground">Se suspenderán las sesiones activas durante la restauración y se anunciará la ventana de mantenimiento.</p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-[9px] font-bold text-foreground">3. Verificación y doble factor</p>
          <p className="mt-1 text-[9px] leading-4 text-muted-foreground">La ejecución requiere un token OTP de la aplicación institucional autorizada.</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <span className="text-[9px] text-muted-foreground">
            Tiempo promedio estimado: <strong className="text-foreground">~12 minutos</strong>
          </span>
          <button type="button" onClick={(): void => setStarted(true)} className="inline-flex h-9 items-center gap-2 rounded-md bg-destructive px-3 text-[10px] font-bold text-destructive-foreground hover:opacity-90">
            <RotateCcw aria-hidden="true" className="size-3.5" />
            Iniciar asistente DRP
          </button>
        </div>
        {started && (
          <p role="status" className="rounded-md bg-accent/60 p-2.5 text-[9px] leading-4 text-muted-foreground">
            Asistente de demostración listo para una restauración {scope === 'total' ? 'total' : 'selectiva'}. La ejecución real requiere integración con el servicio de recuperación.
          </p>
        )}
      </div>
    </section>
  );
};

const BackupDrills = (): JSX.Element => (
  <section aria-labelledby="drills-heading" className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-4 sm:p-5">
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary/10 text-secondary">
        <CheckCircle2 aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <h2 id="drills-heading" className="font-heading text-sm font-bold text-foreground">
          Simulacros de resiliencia
        </h2>
        <p className="mt-1 text-[9px] leading-4 text-muted-foreground">Pruebas trimestrales de recuperación ante fallos.</p>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2">
      <div className="rounded-md bg-muted/50 p-3 text-center">
        <p className="text-[8px] uppercase tracking-wide text-muted-foreground">RTO logrado</p>
        <p className="mt-1 font-heading text-xl font-bold text-secondary">14 min</p>
        <p className="mt-1 text-[8px] text-muted-foreground">Meta máxima: &lt; 30 min</p>
      </div>
      <div className="rounded-md bg-muted/50 p-3 text-center">
        <p className="text-[8px] uppercase tracking-wide text-muted-foreground">RPO logrado</p>
        <p className="mt-1 font-heading text-xl font-bold text-primary">2 horas</p>
        <p className="mt-1 text-[8px] text-muted-foreground">Meta máxima: &lt; 4 horas</p>
      </div>
    </div>
    <h3 className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Bitácora de simulacros 2026</h3>
    <div className="mt-2 space-y-2">
      <article className="flex min-w-0 items-start gap-2 rounded-md bg-muted/50 p-3">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-secondary" />
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold text-foreground">Simulacro Q3: corte de fibra Ayacucho</p>
          <p className="mt-1 text-[8px] leading-4 text-muted-foreground">15 set 2026 · Conmutación al NAS local</p>
        </div>
        <span className="rounded bg-secondary/10 px-1.5 py-1 text-[7px] font-bold text-secondary">Aprobado</span>
      </article>
      <article className="flex min-w-0 items-start gap-2 rounded-md bg-muted/50 p-3">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-secondary" />
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold text-foreground">Simulacro Q2: ransomware sandbox</p>
          <p className="mt-1 text-[8px] leading-4 text-muted-foreground">20 jun 2026 · Restauración desde AWS S3 WORM</p>
        </div>
        <span className="rounded bg-secondary/10 px-1.5 py-1 text-[7px] font-bold text-secondary">Aprobado</span>
      </article>
    </div>
    <p className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4 text-[8px] text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <CalendarDays aria-hidden="true" className="size-3" /> Próximo simulacro
      </span>
      <strong className="inline-flex items-center gap-1 text-foreground">
        <Clock3 aria-hidden="true" className="size-3" />
        12 dic 2026
      </strong>
    </p>
  </section>
);

export { BackupDrills, BackupRecovery };
