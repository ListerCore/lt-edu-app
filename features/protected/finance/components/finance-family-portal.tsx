'use client';

import type { ChangeEvent, JSX } from 'react';
import { useState } from 'react';
import { ArrowLeft, BadgeCheck, BookOpenCheck, CalendarDays, CircleAlert, Clock3, Download, FileUp, GraduationCap, MessageCircle, Video, Wallet } from 'lucide-react';
import type { FamilyAccount } from '../data/finance-data';

const FinanceFamilyPortal = ({ account, onBack, onAction }: { account: FamilyAccount; onBack: () => void; onAction: (message: string) => void }): JSX.Element => {
  const [uploadedFile, setUploadedFile] = useState('');
  const onFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      onAction(`Voucher ${file.name} listo para revisión de tesorería.`);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-350 min-w-0 flex-col gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6 lg:px-8">
      <section className="relative overflow-hidden rounded-xl bg-primary p-5 text-primary-foreground sm:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-20 size-64 rounded-full border border-primary-foreground/10" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-2.5 py-1 text-[8px] font-semibold">
              <Wallet aria-hidden="true" className="size-3" />
              Portal familiar · modo apoderado
            </div>
            <h1 className="mt-3 font-heading text-xl font-bold tracking-tight sm:text-2xl">Bienvenida, {account.guardian}</h1>
            <p className="mt-1 text-[10px] text-primary-foreground/75">
              Responsable económica de {account.name} · {account.grade}
            </p>
          </div>
          <button type="button" onClick={onBack} className="inline-flex h-9 items-center gap-2 rounded-md bg-primary-foreground/10 px-3 text-[9px] font-semibold hover:bg-primary-foreground/20">
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Volver a tesorería
          </button>
        </div>
      </section>
      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)]">
        <div className="space-y-4">
          <article className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded bg-destructive/10 px-2 py-1 text-[8px] font-bold text-destructive">
                  <CircleAlert aria-hidden="true" className="size-3" />
                  Pago pendiente · octubre 2026
                </div>
                <p className="mt-3 font-heading text-3xl font-bold tabular-nums text-foreground">S/ {account.amount.toFixed(2)}</p>
                <p className="mt-1 text-[9px] text-muted-foreground">{account.amount > 0 ? 'Vencimiento: 05 de octubre' : 'No tienes cuotas pendientes al día de hoy'}</p>
              </div>
              <span className="grid size-10 place-items-center rounded-md bg-accent text-primary">
                <CalendarDays aria-hidden="true" className="size-5" />
              </span>
            </div>
            <div className="mt-4 rounded-md bg-secondary/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-foreground">Paga al toque con Yape o Plin</p>
                  <p className="mt-1 text-[9px] text-muted-foreground">Número oficial CEBA</p>
                  <p className="mt-1 font-mono text-sm font-bold text-primary">966 238 190</p>
                </div>
                <span className="grid size-20 place-items-center rounded-md border-4 border-primary bg-background text-primary">
                  <span aria-hidden="true" className="grid size-12 grid-cols-3 grid-rows-3 gap-1">
                    {Array.from({ length: 9 }, (_, index) => (
                      <span key={index} className={`rounded-[1px] ${[0, 1, 3, 5, 7, 8].includes(index) ? 'bg-primary' : 'bg-muted'}`} />
                    ))}
                  </span>
                </span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <label className="inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-secondary px-3 text-[9px] font-semibold text-secondary-foreground hover:opacity-90">
                  <FileUp aria-hidden="true" className="size-3.5" />
                  {uploadedFile ? 'Cambiar voucher' : 'Subir foto del voucher'}
                  <input type="file" accept="image/*,.pdf" onChange={onFileChange} className="sr-only" />
                </label>
                <button type="button" onClick={(): void => onAction('Historial de boletas listo para consultar.')} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-[9px] font-semibold text-foreground hover:bg-muted">
                  <Download aria-hidden="true" className="size-3.5" />
                  Boletas anteriores
                </button>
              </div>
              {uploadedFile && (
                <p role="status" className="mt-2 text-[8px] text-secondary">
                  Archivo seleccionado: {uploadedFile}
                </p>
              )}
            </div>
          </article>
          <article className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-heading text-sm font-bold text-foreground">Asistencia virtual</h2>
                <p className="mt-1 text-[9px] text-muted-foreground">Semáforo verde · clases síncronas en vivo</p>
              </div>
              <span className="text-xl font-bold text-secondary">{account.attendance}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-secondary" style={{ width: `${account.attendance}%` }} />
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                ['38 sesiones', 'Asistencia puntual'],
                ['4 sesiones', 'Justificadas por trabajo'],
                ['0 faltas', 'Sin aviso'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-md bg-muted/50 p-3">
                  <p className="text-[10px] font-bold text-foreground">{value}</p>
                  <p className="mt-1 text-[8px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[8px] font-semibold text-secondary">
              <BadgeCheck aria-hidden="true" className="size-3" />
              Cumple el 80% mínimo para aprobar
            </p>
          </article>
          <article className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <GraduationCap aria-hidden="true" className="size-4 text-primary" />
              <div>
                <h2 className="font-heading text-sm font-bold text-foreground">Notas del bimestre II</h2>
                <p className="mt-1 text-[8px] text-muted-foreground">Escala oficial MINEDU · AD, A, B, C</p>
              </div>
            </div>
            <div className="mt-3 divide-y divide-border">
              {[
                ['Matemática EBA', 'A'],
                ['Comunicación Integral', 'AD'],
                ['Desarrollo Personal / DPC', 'A'],
              ].map(([subject, grade]) => (
                <div key={subject} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-[9px] text-foreground">{subject}</span>
                  <span className={`rounded px-2 py-1 text-[8px] font-bold ${grade === 'AD' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>Logro {grade}</span>
                </div>
              ))}
            </div>
            <button type="button" onClick={(): void => onAction('Libreta completa disponible para la familia.')} className="mt-3 text-[9px] font-bold text-primary hover:underline">
              Ver libreta completa →
            </button>
          </article>
        </div>
        <aside className="min-w-0 space-y-4">
          <article className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Video aria-hidden="true" className="size-4 text-primary" />
              <h2 className="font-heading text-sm font-bold text-foreground">Avisos del CEBA</h2>
            </div>
            <div className="mt-3 rounded-md bg-accent/50 p-3">
              <p className="text-[10px] font-semibold text-foreground">Taller de habilidades laborales</p>
              <p className="mt-1 text-[9px] text-muted-foreground">Viernes, 20:00 hrs · Virtual por Zoom</p>
            </div>
            <div className="mt-2 rounded-md bg-secondary/5 p-3">
              <p className="flex items-center gap-1.5 text-[9px] font-semibold text-secondary">
                <Clock3 aria-hidden="true" className="size-3.5" />
                Horario nocturno habilitado
              </p>
              <p className="mt-1 text-[8px] text-muted-foreground">Atención pedagógica hasta las 22:30 hrs.</p>
            </div>
            <button type="button" onClick={(): void => onAction('Conectando con el tutor asignado: Lic. Carlos Mendoza.')} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2.5 text-[9px] font-semibold text-foreground hover:bg-muted">
              <MessageCircle aria-hidden="true" className="size-3.5 text-primary" />
              Chatear con el tutor asignado
            </button>
            <p className="mt-2 text-center text-[8px] text-muted-foreground">Lic. Carlos Mendoza · Ayacucho</p>
          </article>
          <article className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <BookOpenCheck aria-hidden="true" className="size-4 text-secondary" />
              <h2 className="font-heading text-xs font-bold text-foreground">Tu estado de cuenta</h2>
            </div>
            <p className="mt-2 text-[9px] leading-4 text-muted-foreground">Periodo académico 2026-II · {account.status}</p>
            <div className="mt-3 flex items-center justify-between rounded-md bg-muted/50 p-3 text-[9px]">
              <span className="text-muted-foreground">Saldo pendiente</span>
              <strong className="text-destructive">S/ {account.amount.toFixed(2)}</strong>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-md bg-muted/50 p-3 text-[9px]">
              <span className="text-muted-foreground">Boletas emitidas</span>
              <strong className="text-foreground">2 comprobantes</strong>
            </div>
            <button type="button" onClick={(): void => onAction('Resumen de estado de cuenta listo para impresión.')} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-[9px] font-semibold text-primary-foreground">
              <Download aria-hidden="true" className="size-3.5" />
              Descargar estado de cuenta
            </button>
          </article>
        </aside>
      </section>
      <footer className="border-t border-border pt-3 text-center text-[8px] text-muted-foreground">CEBA Privado Virtual Joseph Lister · Portal seguro para familias</footer>
    </div>
  );
};

export { FinanceFamilyPortal };
