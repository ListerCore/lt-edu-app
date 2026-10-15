'use client';

import type { JSX } from 'react';
import { CalendarDays, CheckCircle2, CircleAlert, Download, FileCheck2, Handshake, MessageCircle, ReceiptText, Send, WalletCards } from 'lucide-react';
import { recentReceipts } from '../data/finance-data';

const FinanceSchedule = ({ onAction }: { onAction: (message: string) => void }): JSX.Element => (
  <section className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
    <header className="border-b border-border bg-muted/40 p-4 sm:p-5">
      <h2 className="font-heading text-sm font-bold text-foreground">Cronograma institucional de cuotas · 2026-II</h2>
      <p className="mt-1 text-[9px] text-muted-foreground">Calendario semestral EBA con fechas de vencimiento y montos por concepto.</p>
    </header>
    <div className="grid min-w-0 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-5">
      {[
        { title: 'Matrícula institucional', due: '15 de agosto', amount: 'S/ 100.00', state: 'Cerrada', detail: '850 pagos conciliados' },
        { title: 'Cuota 1 · Septiembre', due: '05 de septiembre', amount: 'S/ 150.00', state: 'Cerrada', detail: '750 pagos registrados' },
        { title: 'Cuota 2 · Octubre', due: '05 de octubre', amount: 'S/ 150.00', state: 'En cobranza', detail: '100 pagos pendientes' },
        { title: 'Cuota 3 · Noviembre', due: '05 de noviembre', amount: 'S/ 150.00', state: 'Programada', detail: 'Aviso previo 01 de noviembre' },
        { title: 'Cuota 4 · Diciembre', due: '05 de diciembre', amount: 'S/ 150.00', state: 'Programada', detail: 'Fin de periodo académico' },
      ].map(({ title, due, amount, state, detail }) => (
        <article key={title} className="flex min-w-0 flex-col rounded-md border border-border p-4">
          <div className="flex items-start justify-between gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent text-primary">
              <CalendarDays aria-hidden="true" className="size-4" />
            </span>
            <span className={`rounded px-2 py-1 text-[8px] font-bold ${state === 'Cerrada' ? 'bg-secondary/10 text-secondary' : state === 'En cobranza' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>{state}</span>
          </div>
          <h3 className="mt-3 text-[10px] font-bold text-foreground">{title}</h3>
          <p className="mt-1 text-[9px] text-muted-foreground">Vencimiento: {due}</p>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-bold text-foreground">{amount}</span>
            <span className="text-[8px] text-muted-foreground">{detail}</span>
          </div>
          <button type="button" onClick={(): void => onAction(`Detalle del cronograma ${title}.`)} className="mt-3 text-left text-[8px] font-semibold text-primary hover:underline">
            Ver detalle de cuota →
          </button>
        </article>
      ))}
    </div>
    <div className="mx-4 mb-4 flex flex-wrap items-center justify-between gap-2 rounded-md bg-accent/50 p-3 sm:mx-5 sm:mb-5">
      <div>
        <p className="text-[9px] font-semibold text-primary">Costo semestral regular: S/ 700.00</p>
        <p className="mt-1 text-[8px] text-muted-foreground">Matrícula institucional más cuatro cuotas académicas.</p>
      </div>
      <button type="button" onClick={(): void => onAction('Editor del cronograma listo para configurar fechas y montos.')} className="h-8 rounded-md bg-primary px-3 text-[8px] font-semibold text-primary-foreground">
        Configurar cronograma
      </button>
    </div>
  </section>
);

const FinanceReceipts = ({ onAction }: { onAction: (message: string) => void }): JSX.Element => (
  <section className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 p-4 sm:p-5">
      <div>
        <h2 className="font-heading text-sm font-bold text-foreground">Comprobantes electrónicos · SUNAT</h2>
        <p className="mt-1 text-[9px] text-muted-foreground">Boletas electrónicas emitidas tras la confirmación de pagos.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={(): void => onAction('Archivo PLE / SIRE preparado para descarga de demostración.')} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-[8px] font-semibold text-foreground hover:bg-muted">
          <Download aria-hidden="true" className="size-3.5" />
          Descargar PLE / SIRE
        </button>
        <button type="button" onClick={(): void => onAction('Consulta CDR finalizada: comprobantes de referencia aceptados.')} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[8px] font-semibold text-primary-foreground">
          <FileCheck2 aria-hidden="true" className="size-3.5" />
          Consultar CDR
        </button>
      </div>
    </header>
    <div className="divide-y divide-border">
      {recentReceipts.map(({ code, name, time, amount }) => (
        <article key={code} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-secondary/10 text-secondary">
              <ReceiptText aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-[9px] font-bold text-foreground">{code}</p>
                <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-[7px] font-bold text-secondary">ACEPTADO</span>
              </div>
              <p className="mt-1 truncate text-[8px] text-muted-foreground">
                {name} · {time}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-foreground">S/ {amount.toFixed(2)}</span>
            <button type="button" aria-label={`Descargar ${code}`} onClick={(): void => onAction(`Comprobante ${code} preparado para descarga.`)} className="grid size-8 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-primary">
              <Download aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        </article>
      ))}
    </div>
    <footer className="flex items-center gap-2 border-t border-border px-4 py-3 text-[8px] text-secondary">
      <CheckCircle2 aria-hidden="true" className="size-3.5" />
      OSE Nubefact conectado · respuesta SUNAT operativa
    </footer>
  </section>
);

const FinanceCashflow = (): JSX.Element => (
  <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
    <article className="rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <WalletCards aria-hidden="true" className="size-4 text-primary" />
        <h2 className="font-heading text-sm font-bold text-foreground">Recaudación y flujo de caja</h2>
      </div>
      <p className="mt-1 text-[9px] text-muted-foreground">Ingresos mensuales consolidados · 2026</p>
      <div className="mt-5 grid h-52 grid-cols-6 items-end gap-3 border-b border-border px-2">
        {[
          { month: 'May', pct: 49 },
          { month: 'Jun', pct: 62 },
          { month: 'Jul', pct: 57 },
          { month: 'Ago', pct: 74 },
          { month: 'Sep', pct: 81 },
          { month: 'Oct', pct: 88 },
        ].map(({ month, pct }) => (
          <div key={month} className="flex h-full flex-col items-center justify-end gap-2">
            <span className="text-[8px] tabular-nums text-muted-foreground">{pct}%</span>
            <div className="flex w-full max-w-12 items-end rounded-t bg-muted" style={{ height: `${pct}%` }}>
              <div className={`w-full rounded-t ${month === 'Oct' ? 'bg-secondary' : 'bg-primary/70'}`} style={{ height: '100%' }} />
            </div>
            <span className="pb-2 text-[8px] text-muted-foreground">{month}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-between gap-2 text-[9px]">
        <span className="text-muted-foreground">Recaudado en octubre</span>
        <strong className="text-foreground">S/ 114,750 · 88.2% de meta</strong>
      </div>
    </article>
    <article className="rounded-lg border border-border bg-card p-4 sm:p-5">
      <h2 className="font-heading text-sm font-bold text-foreground">Resumen de cartera</h2>
      <p className="mt-1 text-[9px] text-muted-foreground">Comportamiento de cobros del periodo vigente.</p>
      <div className="mt-4 space-y-3">
        {[
          ['Pensiones conciliadas', '750', '88.2%', 'bg-secondary'],
          ['Por cobrar', '100', '11.8%', 'bg-destructive'],
          ['Becas y convenios', '42', '4.9%', 'bg-chart-3'],
        ].map(([label, value, percent, color]) => (
          <div key={label}>
            <div className="flex justify-between gap-2 text-[9px]">
              <span className="text-muted-foreground">{label}</span>
              <strong className="text-foreground">
                {value} · {percent}
              </strong>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className={`h-full rounded-full ${color}`} style={{ width: percent }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-md bg-accent/50 p-3">
        <p className="text-[9px] font-semibold text-primary">Conciliación bancaria</p>
        <p className="mt-1 text-[8px] leading-4 text-muted-foreground">578 transacciones Yape / Plin identificadas y asociadas a cuentas familiares.</p>
      </div>
    </article>
  </section>
);

const FinanceCollections = ({ onAction }: { onAction: (message: string) => void }): JSX.Element => (
  <section className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <MessageCircle aria-hidden="true" className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground">Centro de cobranzas y WhatsApp IA</h2>
        </div>
        <p className="mt-1 text-[9px] text-muted-foreground">Priorización de seguimiento con comunicación respetuosa y alternativas de pago.</p>
      </div>
      <span className="rounded bg-secondary/10 px-2 py-1 text-[8px] font-bold text-secondary">Asistente activo</span>
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {[
        { name: 'Silvia Cárdenas Palomino', due: 'S/ 150 · 15 días de mora', guardian: 'Herminia Palomino', risk: 'Seguimiento prioritario' },
        { name: 'Edwin Mendoza Alarcón', due: 'S/ 150 · vence próximamente', guardian: 'José Mendoza Rojas', risk: 'Aviso preventivo' },
        { name: 'Brayan Quispe Sulca', due: 'S/ 70 · pago fraccionado', guardian: 'Luz Sulca Huamán', risk: 'Confirmar siguiente abono' },
      ].map(({ name, due, guardian, risk }) => (
        <article key={name} className="rounded-md border border-border p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[9px] font-bold text-foreground">{name}</h3>
            <CircleAlert aria-hidden="true" className="size-3.5 shrink-0 text-chart-3" />
          </div>
          <p className="mt-2 text-[9px] font-semibold text-destructive">{due}</p>
          <p className="mt-1 text-[8px] text-muted-foreground">Apoderado: {guardian}</p>
          <p className="mt-2 rounded bg-muted/50 p-2 text-[8px] text-muted-foreground">{risk} · considerar fraccionamiento por campaña laboral.</p>
          <button type="button" onClick={(): void => onAction(`Mensaje empático listo para ${guardian}.`)} className="mt-3 inline-flex items-center gap-1.5 text-[8px] font-bold text-primary hover:underline">
            <Send aria-hidden="true" className="size-3" />
            Preparar WhatsApp
          </button>
        </article>
      ))}
    </div>
    <div className="mt-4 flex items-start gap-2 rounded-md bg-accent/50 p-3 text-[8px] leading-4 text-muted-foreground">
      <Handshake aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
      <p>Las sugerencias priorizan continuidad educativa y ofrecen convenios de pago según la situación familiar y laboral.</p>
    </div>
  </section>
);

export { FinanceCashflow, FinanceCollections, FinanceReceipts, FinanceSchedule };
