'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { CheckCircle2, CircleAlert, CreditCard, Handshake, MessageCircle, QrCode, ReceiptText, X } from 'lucide-react';
import { feeSchedule, type FamilyAccount } from '../data/finance-data';

type AccountAction = 'payment' | 'qr' | 'installment' | null;

const FinanceAccountPanel = ({ account, onMessage }: { account: FamilyAccount; onMessage: (message: string) => void }): JSX.Element => {
  const [action, setAction] = useState<AccountAction>(null);
  const [amount, setAmount] = useState(account.amount > 0 ? String(account.amount) : '150');
  const [method, setMethod] = useState('Yape / Plin');
  const outstanding = account.amount;
  const totalCost = 700;
  const closeAction = (): void => setAction(null);

  return (
    <div className="min-w-0 space-y-4">
      <section aria-labelledby="account-detail-heading" className="min-w-0 rounded-lg border border-border bg-card p-4">
        <header className="flex min-w-0 items-start gap-3 border-b border-border pb-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{account.initials}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="account-detail-heading" className="font-heading text-xs font-bold text-foreground">
                {account.name}
              </h2>
              {account.amount > 0 && <span className="rounded bg-destructive/10 px-1.5 py-1 text-[7px] font-bold text-destructive">1 cuota pendiente</span>}
            </div>
            <p className="mt-1 text-[8px] text-muted-foreground">
              DNI: {account.dni} · Ciclo {account.cycle} ({account.grade})
            </p>
            <p className="mt-1 text-[8px] text-muted-foreground">
              Resp. económico:{' '}
              <span className="font-semibold text-foreground">
                {account.guardian} ({account.guardianRelation})
              </span>
            </p>
          </div>
          <button type="button" aria-label="Abrir ficha familiar" onClick={(): void => onMessage(`Ficha económica de ${account.name}`)} className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground hover:text-primary">
            <ReceiptText aria-hidden="true" className="size-3.5" />
          </button>
        </header>
        <div className="flex items-center justify-between gap-2 py-3">
          <h3 className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Cronograma semestral</h3>
          <span className="text-[8px] font-semibold text-primary">Periodo 2026-II</span>
        </div>
        <div className="space-y-2">
          {feeSchedule.map((fee) => {
            const paid = fee.status === 'paid';
            const dueForAccount = fee.id === 'october' ? account.amount : fee.amount;
            const isCurrentOverdue = fee.id === 'october' && account.status === 'En mora';
            return (
              <article key={fee.id} className={`flex min-w-0 items-center gap-2 rounded-md p-2.5 ${isCurrentOverdue ? 'border-l-2 border-destructive bg-destructive/5' : paid ? 'bg-secondary/5' : 'bg-muted/50'}`}>
                <span className={`grid size-4 shrink-0 place-items-center rounded-full ${paid ? 'text-secondary' : isCurrentOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>{paid ? <CheckCircle2 aria-hidden="true" className="size-3.5" /> : isCurrentOverdue ? <CircleAlert aria-hidden="true" className="size-3.5" /> : <span className="size-2 rounded-full border border-current" />}</span>
                <div className="min-w-0 flex-1">
                  <p className={`text-[9px] font-semibold ${isCurrentOverdue ? 'text-destructive' : 'text-foreground'}`}>{fee.title}</p>
                  <p className="mt-0.5 truncate text-[8px] text-muted-foreground">{paid ? `Pagado · boleta ${fee.receipt}` : isCurrentOverdue ? 'Venció el 05/10/2026 · 15 días de mora' : `Vence: ${fee.due}`}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[9px] font-bold tabular-nums text-foreground">S/ {(fee.id === 'october' && account.status === 'Fraccionado' ? dueForAccount : fee.amount).toFixed(2)}</p>
                  <p className={`mt-0.5 text-[7px] font-semibold ${paid ? 'text-secondary' : isCurrentOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>{paid ? 'Cancelado' : isCurrentOverdue ? 'Pendiente' : fee.status === 'upcoming' ? 'Por vencer' : 'Programado'}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-3 space-y-1.5 rounded-md bg-accent/60 p-3 text-[9px]">
          <p className="flex justify-between gap-2 text-muted-foreground">
            <span>Costo total del semestre</span>
            <strong className="text-foreground">S/ {totalCost.toFixed(2)}</strong>
          </p>
          <p className="flex justify-between gap-2 text-secondary">
            <span>Total pagado a la fecha</span>
            <strong>S/ {account.paid.toFixed(2)}</strong>
          </p>
          <p className="flex justify-between gap-2 text-destructive">
            <span>Saldo pendiente exigible</span>
            <strong>S/ {outstanding.toFixed(2)}</strong>
          </p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={(): void => {
              setAmount(String(outstanding || 150));
              setAction('payment');
            }}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-primary px-2 text-[9px] font-semibold text-primary-foreground hover:opacity-90"
          >
            <CreditCard aria-hidden="true" className="size-3.5" />
            Registrar pago
          </button>
          <button type="button" onClick={(): void => setAction('qr')} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-secondary px-2 text-[9px] font-semibold text-secondary-foreground hover:opacity-90">
            <QrCode aria-hidden="true" className="size-3.5" />
            Cobro Yape QR
          </button>
          <button type="button" onClick={(): void => setAction('installment')} className="sm:col-span-2 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md bg-accent px-2 text-[9px] font-semibold text-primary hover:bg-accent/80">
            <Handshake aria-hidden="true" className="size-3.5" />
            Proponer fraccionamiento
          </button>
        </div>
      </section>
      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
            <MessageCircle aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[10px] font-bold text-foreground">Sugerencia de cobranza EBA</h3>
              <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-[7px] font-bold text-secondary">Empatía social</span>
            </div>
            <p className="mt-2 text-[9px] leading-4 text-muted-foreground">
              {account.name} asiste al {account.attendance}% de sus clases virtuales. Se recomienda contactar a {account.guardian} con una alternativa flexible para no interrumpir su continuidad educativa.
            </p>
            <button type="button" onClick={(): void => onMessage(`Plantilla humanizada preparada para ${account.guardian} vía WhatsApp.`)} className="mt-3 inline-flex items-center gap-1 text-[9px] font-bold text-primary hover:underline">
              Preparar mensaje WhatsApp <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
      {action && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="finance-action-heading" className="w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="finance-action-heading" className="font-heading text-sm font-bold text-foreground">
                  {action === 'payment' ? 'Registrar pago' : action === 'qr' ? 'Cobro con Yape / Plin' : 'Proponer fraccionamiento'}
                </h3>
                <p className="mt-1 text-[9px] text-muted-foreground">
                  {account.name} · {account.grade}
                </p>
              </div>
              <button type="button" onClick={closeAction} aria-label="Cerrar" className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted">
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            {action === 'payment' && (
              <div className="mt-4 space-y-3">
                <label className="block text-[9px] font-semibold text-foreground">
                  Monto recibido
                  <input inputMode="decimal" value={amount} onChange={(event): void => setAmount(event.target.value)} className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-ring" />
                </label>
                <label className="block text-[9px] font-semibold text-foreground">
                  Método de pago
                  <select value={method} onChange={(event): void => setMethod(event.target.value)} className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground">
                    <option>Yape / Plin</option>
                    <option>Transferencia BCP</option>
                    <option>Transferencia BBVA</option>
                    <option>Efectivo en tesorería</option>
                  </select>
                </label>
                <label className="block text-[9px] font-semibold text-foreground">
                  Código de operación
                  <input placeholder="Ej. 892014" className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-ring" />
                </label>
              </div>
            )}
            {action === 'qr' && (
              <div className="mt-4 rounded-lg bg-accent/50 p-5 text-center">
                <span className="mx-auto grid size-28 place-items-center rounded-md border-4 border-primary bg-background">
                  <QrCode aria-hidden="true" className="size-20 text-primary" />
                </span>
                <p className="mt-3 text-xs font-bold text-foreground">Número oficial CEBA</p>
                <p className="mt-1 text-sm font-mono font-semibold text-primary">966 238 190</p>
                <p className="mt-2 text-[9px] text-muted-foreground">Monto pendiente: S/ {outstanding.toFixed(2)} · QR de demostración</p>
              </div>
            )}
            {action === 'installment' && (
              <div className="mt-4 space-y-3">
                <p className="rounded-md bg-accent/50 p-3 text-[9px] leading-4 text-muted-foreground">Propuesta de campaña agrícola: dividir el saldo en dos abonos y programar las fechas según el calendario familiar.</p>
                <label className="block text-[9px] font-semibold text-foreground">
                  Número de cuotas
                  <select className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground">
                    <option>2 cuotas</option>
                    <option>3 cuotas</option>
                  </select>
                </label>
              </div>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={closeAction} className="h-9 rounded-md border border-border px-3 text-[9px] font-semibold text-foreground hover:bg-muted">
                Cancelar
              </button>
              <button
                type="button"
                onClick={(): void => {
                  onMessage(action === 'payment' ? `Pago de S/ ${amount} registrado en demostración mediante ${method}.` : action === 'qr' ? 'Código de cobro de demostración listo para compartir con el apoderado.' : `Propuesta de fraccionamiento preparada para ${account.name}.`);
                  closeAction();
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[9px] font-semibold text-primary-foreground"
              >
                <CheckCircle2 aria-hidden="true" className="size-3.5" />
                {action === 'payment' ? 'Confirmar pago' : action === 'qr' ? 'Compartir código' : 'Enviar propuesta'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export { FinanceAccountPanel };
