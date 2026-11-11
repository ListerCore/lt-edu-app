'use client';

import { useState, useTransition, type JSX } from 'react';
import { Ban, BellRing, Percent, Plus, Receipt, Wallet } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { cn } from '@/lib/utils';
import { addChargeAction, deleteDiscountAction, payAction, saveDiscountAction, voidChargeAction } from '../actions/finance-actions';
import { methodLabels, soles, toCents } from '../data/finance-data';
import type { Charge, Statement } from '../types';

// Whole days between a due date and today (UTC dates, so no DST drift)
const daysLate = (due: string, today: string): number => Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${due}T00:00:00Z`)) / 86_400_000);

// Status pill of a charge: paid, void, due soon or days overdue
export const ChargeState = ({ c, today }: { c: Charge; today: string }): JSX.Element => {
  if (c.status === 'void') return <span className="pill bg-secondary text-muted-foreground">Anulada</span>;
  if ((c.balance ?? 0) <= 0) return <span className="pill bg-success/12 text-success">Pagada</span>;
  if (c.dueOn < today) {
    const d = daysLate(c.dueOn, today);
    return <span className="pill bg-destructive/12 text-destructive">Vencida · {d} {d === 1 ? 'día' : 'días'}</span>;
  }
  return <span className="pill bg-secondary text-foreground">{(c.paid ?? 0) > 0 ? 'Pago parcial' : 'Por vencer'}</span>;
};

interface Props {
  slug: string;
  st: Statement;
  onChanged: () => void;
  onReceipt: (id: string) => void;
}

// A student's account: the schedule with what was paid of each charge, the payments with their receipts, discounts
// and reminders; tesorería collects from here
export const StatementView = ({ slug, st, onChanged, onReceipt }: Props): JSX.Element => {
  const [paying, setPaying] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [adding, setAdding] = useState(false);
  const [isPending, startTransition] = useTransition();
  const periods = [...new Map(st.charges.map((c) => [c.periodId, c.periodName])).entries()];
  const periodId = periods[0]?.[0] ?? '';

  const act = (work: () => Promise<{ ok: boolean; message?: string }>): void =>
    startTransition(async () => {
      const r = await work();
      if (!r.ok) sileo.error({ title: 'No se pudo completar', description: r.message });
      else {
        if (r.message) sileo.success({ title: r.message });
        onChanged();
      }
    });

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-2xl border border-border bg-background p-5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{st.studentName}</h2>
          <p className="text-xs text-muted-foreground tabular-nums">{st.studentCode}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-sm text-muted-foreground">Vencido</p>
          <p className={cn('text-2xl font-semibold tracking-tight tabular-nums', (st.overdue ?? 0) > 0 ? 'text-destructive' : 'text-foreground')}>{soles(st.overdue)}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-sm text-muted-foreground">Saldo del periodo</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">{soles(st.balance)}</p>
        </div>
      </div>
      {st.canManage && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-brand" disabled={(st.balance ?? 0) <= 0} onClick={(): void => setPaying(true)}>
            <MorphIcon icon={Wallet} size={16} />
            Registrar pago
          </button>
          <button type="button" className="btn-alt" onClick={(): void => setDiscount(true)}>
            <MorphIcon icon={Percent} size={16} />
            Descuento
          </button>
          <button type="button" className="btn-alt" onClick={(): void => setAdding(true)}>
            <MorphIcon icon={Plus} size={16} />
            Otro cargo
          </button>
        </div>
      )}
      {st.discounts.map((d) => (
        <p key={d.periodId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand/8 px-4 py-2.5 text-sm text-foreground">
          <span>
            <strong>{d.percent} %</strong> de descuento en las pensiones · {d.reason}
          </span>
          {st.canManage && (
            <button type="button" className="text-xs text-brand hover:underline" disabled={isPending} onClick={(): void => act(() => deleteDiscountAction(slug, st.studentId, d.periodId))}>
              Quitar
            </button>
          )}
        </p>
      ))}
      {/* Phones get one row per charge instead of a seven-column table */}
      <ul className="divide-y divide-border rounded-2xl border border-border bg-background sm:hidden">
        {st.charges.map((c) => (
          <li key={c.id} className={cn('flex items-center gap-3 px-4 py-3 text-sm', c.status === 'void' && 'text-muted-foreground line-through')}>
            <span className="min-w-0 flex-1">
              <span className="block text-foreground">{c.name}</span>
              <span className="block text-xs text-muted-foreground">vence {formatDay(c.dueOn)}</span>
            </span>
            <span className="flex flex-col items-end gap-1">
              <span className="font-semibold whitespace-nowrap tabular-nums">{soles((c.balance ?? 0) > 0 ? c.balance : (c.amount ?? 0) - (c.discount ?? 0))}</span>
              <ChargeState c={c} today={st.today} />
            </span>
          </li>
        ))}
        {st.charges.length === 0 && <li className="px-6 py-10 text-center text-sm text-muted-foreground">Sin cronograma de pagos.</li>}
      </ul>
      <div className="hidden overflow-x-auto rounded-2xl border border-border bg-background sm:block">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th scope="col" className="px-4 py-3 font-medium">Concepto</th>
              <th scope="col" className="px-4 py-3 font-medium">Vence</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Monto</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Pagado</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Saldo</th>
              <th scope="col" className="px-4 py-3 font-medium">Estado</th>
              {st.canManage && <th scope="col" className="w-10" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {st.charges.map((c) => (
              <tr key={c.id} className={cn(c.status === 'void' && 'text-muted-foreground line-through decoration-muted-foreground/40')}>
                <td className="px-4 py-2.5">
                  <span className="block text-foreground">{c.name}</span>
                  <span className="block text-xs text-muted-foreground no-underline">{c.periodName}</span>
                </td>
                <td className="px-4 py-2.5 tabular-nums">{formatDay(c.dueOn)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {soles((c.amount ?? 0) - (c.discount ?? 0))}
                  {(c.discount ?? 0) > 0 && <span className="block text-[11px] text-muted-foreground">−{soles(c.discount)}</span>}
                </td>
                <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">{soles(c.paid)}</td>
                <td className="px-4 py-2.5 text-right font-semibold tabular-nums">{soles(c.balance)}</td>
                <td className="px-4 py-2.5">
                  <ChargeState c={c} today={st.today} />
                </td>
                {st.canManage && (
                  <td className="px-1">
                    {c.status === 'pending' && (c.paid ?? 0) === 0 && <VoidButton isPending={isPending} name={c.name} onVoid={(reason): void => act(() => voidChargeAction(slug, c.id, reason))} />}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {st.charges.length === 0 && <p className="px-6 py-10 text-center text-sm text-muted-foreground">Sin cronograma de pagos.</p>}
      </div>
      <section aria-label="Pagos" className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Pagos</h3>
        {st.payments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">Aún no hay pagos.</p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {st.payments.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={(): void => onReceipt(p.id)} className={cn('flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-surface', p.status === 'annulled' && 'text-muted-foreground')}>
                  <MorphIcon icon={Receipt} size={15} className="shrink-0 text-brand" />
                  {/* Stacked on phones, one line on wider screens */}
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                    <span className="font-medium tabular-nums sm:w-28">{p.receipt}</span>
                    <span className="text-xs text-muted-foreground tabular-nums sm:w-24 sm:text-sm sm:text-foreground">
                      {formatDay(p.paidOn, false)}
                      <span className="sm:hidden"> · {methodLabels[p.method]}</span>
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{p.allocations.map((a) => a.chargeName.split(' · ')[0]).join(', ')}</span>
                    <span className="hidden text-xs text-muted-foreground sm:inline">{methodLabels[p.method]}</span>
                  </span>
                  <span className={cn('w-24 shrink-0 text-right font-semibold whitespace-nowrap tabular-nums', p.status === 'annulled' && 'line-through')}>{soles(p.amount)}</span>
                  {p.status === 'annulled' && <span className="pill bg-secondary text-muted-foreground">Anulado</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      {st.reminders.length > 0 && (
        <section aria-label="Recordatorios" className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Recordatorios</h3>
          <ul className="space-y-2">
            {st.reminders.map((r) => (
              <li key={r.id} className="flex gap-3 rounded-xl border border-warning/30 bg-warning/8 px-4 py-3 text-sm">
                <MorphIcon icon={BellRing} size={16} className="mt-0.5 shrink-0 text-warning" />
                <span>
                  <span className="block text-foreground">{r.message}</span>
                  <span className="block text-xs text-muted-foreground">
                    {r.sentName} · {formatDay(r.sentAt.slice(0, 10))}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {paying && <PayDialog slug={slug} st={st} onClose={(): void => setPaying(false)} onPaid={(id): void => { setPaying(false); onChanged(); onReceipt(id); }} />}
      {discount && periodId && (
        <SimpleDialog
          title="Descuento en las pensiones"
          description="Se aplica a las pensiones que aún no tienen pagos."
          fields={[
            { id: 'percent', label: 'Porcentaje', placeholder: '15' },
            { id: 'reason', label: 'Motivo', placeholder: 'Beca, hermanos, convenio…' },
          ]}
          isPending={isPending}
          onClose={(): void => setDiscount(false)}
          onSave={(v): void => act(async () => {
            const r = await saveDiscountAction(slug, st.studentId, periodId, Number(v.percent.replace(',', '.')) || 0, v.reason);
            if (r.ok) setDiscount(false);
            return r;
          })}
        />
      )}
      {adding && periodId && (
        <SimpleDialog
          title="Otro cargo"
          description="Un concepto fuera del plan: agenda, uniforme, salida de estudios…"
          fields={[
            { id: 'name', label: 'Concepto', placeholder: 'Agenda escolar' },
            { id: 'amount', label: 'Monto (S/)', placeholder: '25,00' },
            { id: 'dueOn', label: 'Vence', placeholder: '', type: 'date' },
          ]}
          isPending={isPending}
          onClose={(): void => setAdding(false)}
          onSave={(v): void => act(async () => {
            const r = await addChargeAction(slug, st.studentId, periodId, v.name, toCents(v.amount) || 0, v.dueOn);
            if (r.ok) setAdding(false);
            return r;
          })}
        />
      )}
    </div>
  );
};

// Voids an unpaid charge after asking why
const VoidButton = ({ name, isPending, onVoid }: { name: string; isPending: boolean; onVoid: (reason: string) => void }): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  return (
    <>
      <button type="button" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`Anular ${name}`} title="Anular cuota" onClick={(): void => setOpen(true)}>
        <MorphIcon icon={Ban} size={15} />
      </button>
      {open && (
        <FormDialog title={`Anular «${name}»`} description="La cuota deja de cobrarse; queda en el historial con el motivo." submitLabel="Anular cuota" isPending={isPending} disabled={!reason.trim()} onSubmit={(): void => { onVoid(reason.trim()); setOpen(false); }} onClose={(): void => setOpen(false)}>
          <FormField id="void-reason" label="Motivo" required>
            <Input id="void-reason" value={reason} maxLength={200} onChange={(e): void => setReason(e.target.value)} placeholder="Retiro del estudiante, error de cobro…" />
          </FormField>
        </FormDialog>
      )}
    </>
  );
};

// Small form dialog for the discount and the extra charge
const SimpleDialog = ({ title, description, fields, isPending, onClose, onSave }: { title: string; description: string; fields: Array<{ id: string; label: string; placeholder: string; type?: string }>; isPending: boolean; onClose: () => void; onSave: (v: Record<string, string>) => void }): JSX.Element => {
  const [v, setV] = useState<Record<string, string>>({});
  return (
    <FormDialog title={title} description={description} submitLabel="Guardar" isPending={isPending} disabled={fields.some((f) => !(v[f.id] ?? '').trim())} onSubmit={(): void => onSave(v)} onClose={onClose}>
      {fields.map((f) => (
        <FormField key={f.id} id={`sd-${f.id}`} label={f.label} required>
          <Input id={`sd-${f.id}`} type={f.type ?? 'text'} value={v[f.id] ?? ''} placeholder={f.placeholder} onChange={(e): void => setV((x) => ({ ...x, [f.id]: e.target.value }))} />
        </FormField>
      ))}
    </FormDialog>
  );
};

// Registers a payment; it settles the oldest pending charges first
const PayDialog = ({ slug, st, onClose, onPaid }: { slug: string; st: Statement; onClose: () => void; onPaid: (id: string) => void }): JSX.Element => {
  const suggested = (st.overdue ?? 0) > 0 ? st.overdue : (st.charges.find((c) => (c.balance ?? 0) > 0)?.balance ?? 0);
  const [amount, setAmount] = useState(((suggested ?? 0) / 100).toFixed(2).replace('.', ','));
  const [method, setMethod] = useState('cash');
  const [reference, setReference] = useState('');
  const [paidOn, setPaidOn] = useState(st.today);
  const [payer, setPayer] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const cents = toCents(amount);
  const bad = Number.isNaN(cents) || cents <= 0;
  return (
    <FormDialog
      title="Registrar pago"
      description={`Se aplica a las cuotas más antiguas. Saldo: ${soles(st.balance)}.`}
      submitLabel={bad ? 'Registrar' : `Registrar ${soles(cents)}`}
      isPending={isPending}
      disabled={bad}
      onSubmit={(): void =>
        startTransition(async () => {
          const r = await payAction(slug, st.studentId, { amount: cents, method, reference, paidOn, payer, notes: '', chargeIds: [] });
          if (!r.ok) {
            setErrors(r.fields ?? {});
            sileo.error({ title: 'No se pudo registrar', description: r.message });
            return;
          }
          sileo.success({ title: `Pago registrado · ${r.data.receipt}` });
          onPaid(r.data.id);
        })
      }
      onClose={onClose}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="pay-amount" label="Monto (S/)" required error={errors.amount}>
          <Input placeholder="0,00" id="pay-amount" inputMode="decimal" value={amount} onChange={(e): void => setAmount(e.target.value.replace(/[^\d.,]/g, ''))} className="text-lg font-semibold tabular-nums" />
        </FormField>
        <FormField id="pay-date" label="Fecha" required error={errors.paidOn}>
          <Input id="pay-date" type="date" value={paidOn} max={st.today} onChange={(e): void => setPaidOn(e.target.value)} />
        </FormField>
      </div>
      <FormField id="pay-method" label="Medio de pago" required error={errors.method}>
        <div className="flex flex-wrap gap-2">
          {Object.entries(methodLabels).map(([k, label]) => (
            <button key={k} type="button" aria-pressed={method === k} onClick={(): void => setMethod(k)} className={cn('rounded-full border px-3 py-1.5 text-sm', method === k ? 'border-brand bg-brand/10 font-medium text-foreground' : 'border-border text-muted-foreground')}>
              {label}
            </button>
          ))}
        </div>
      </FormField>
      {method !== 'cash' && (
        <FormField id="pay-ref" label="N.° de operación" required error={errors.reference}>
          <Input placeholder="Ej.: N.° de operación 123456" id="pay-ref" value={reference} maxLength={80} onChange={(e): void => setReference(e.target.value)} />
        </FormField>
      )}
      <FormField id="pay-payer" label="Quién paga" hint="Aparece en el recibo.">
        <Input id="pay-payer" value={payer} maxLength={160} onChange={(e): void => setPayer(e.target.value)} placeholder="Nombre del apoderado" />
      </FormField>
      {errors.notes && <p className="text-xs text-destructive">{errors.notes}</p>}
    </FormDialog>
  );
};
