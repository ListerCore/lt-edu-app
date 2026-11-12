'use client';

import { useMemo, useState, useTransition, type JSX } from 'react';
import { ArrowLeft, BellRing, Ban, Download, Plus, Printer, Trash2 } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { SearchBox } from '@/features/protected/people/components/people-ui';
import { isFinanceEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { annulPaymentAction, deletePlanAction, generateAction, getCashAction, getMyStatementsAction, getPaymentAction, getStatementAction, getSummaryAction, listPlansAction, remindAction, savePlanAction } from '../actions/finance-actions';
import { methodLabels, monthLabel, soles, toCents } from '../data/finance-data';
import { usePaymentsCopy } from '../hooks/use-payments-copy';
import type { FeePlan, PlanItemDraft, Summary } from '../types';
import { StatementView } from './statement-view';
import { receiptPdfAction } from '@/features/protected/documents/actions/document-actions';
import { usePdf } from '@/features/protected/documents/lib/use-pdf';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';

type Tab = 'summary' | 'accounts' | 'cash' | 'plans';
type Open = { kind: 'student'; id: string } | { kind: 'receipt'; id: string } | null;

const fold = (v: string): string =>
  v
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

// Pensiones y pagos ("Pagos" in public institutions, which charge no tuition): what each period charges, who paid
// and who owes, the cash of each day and the fee plans. Families see their own account here
export const PaymentsPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const { copy } = usePaymentsCopy();
  const mine = useAcademicData(`my-statements:${slug}`, () => getMyStatementsAction(slug), isFinanceEvent);
  const [periodId, setPeriodId] = useState('');
  const summary = useAcademicData(`finance:${slug}:${periodId}`, () => getSummaryAction(slug, periodId), isFinanceEvent);
  const [picked, setTab] = useState<Tab>('summary');
  // Tabs follow the role in use (data/permissions.ts pageTabs)
  const { canTab } = useWorkspace();
  const tabs = (
    [
      ['summary', 'Resumen'],
      ['accounts', 'Cuentas'],
      ['cash', 'Caja'],
      ['plans', 'Planes de pago'],
    ] as Array<[Tab, string]>
  ).filter(([k]) => canTab('payments', k));
  const tab: Tab | undefined = tabs.find(([k]) => k === picked)?.[0] ?? tabs[0]?.[0];
  const [open, setOpen] = useState<Open>(null);
  const [back, setBack] = useState<Open>(null);
  const [debtOnly, setDebtOnly] = useState(false);
  const openReceipt = (id: string): void => {
    setBack(open);
    setOpen({ kind: 'receipt', id });
  };

  if (mine.data && mine.data.length > 0)
    return (
      <AcademicPage wide titleId="pay-title" title={copy.title} description={copy.familyDescription} context={null}>
        {open?.kind === 'receipt' ? <ReceiptView slug={slug} id={open.id} onBack={(): void => setOpen(null)} /> : <FamilyView slug={slug} items={mine.data} onReceipt={(id): void => setOpen({ kind: 'receipt', id })} reload={mine.reload} />}
      </AcademicPage>
    );

  return (
    <AcademicPage wide titleId="pay-title" title={copy.title} description={copy.staffDescription} context={null}>
      {summary.error ? (
        <LoadError message={summary.error} onRetry={summary.reload} />
      ) : !summary.data ? (
        <PageSkeleton />
      ) : open?.kind === 'receipt' ? (
        <ReceiptView slug={slug} id={open.id} onBack={(): void => setOpen(back)} />
      ) : open?.kind === 'student' ? (
        <StudentScreen slug={slug} id={open.id} onBack={(): void => setOpen(null)} onReceipt={openReceipt} />
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div role="tablist" aria-label="Vistas" className="flex gap-1 overflow-x-auto border-b border-border">
              {tabs.map(([k, label]) => (
                <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={(): void => setTab(k)} className={cn('-mb-px border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors', tab === k ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
                  {label}
                </button>
              ))}
            </div>
            {summary.data.periods.length > 1 && tab !== 'cash' && (
              <div className="w-64">
                <SelectField id="pay-period" value={summary.data.period?.id ?? ''} options={summary.data.periods.map((p) => ({ value: p.id, label: p.name }))} onChange={setPeriodId} />
              </div>
            )}
          </div>
          {!tab && <p className="rounded-xl bg-card p-6 text-sm text-muted-foreground">{copy.noRole}</p>}
          {tab === 'summary' && (
            <SummaryView
              slug={slug}
              data={summary.data}
              onStudent={(id): void => setOpen({ kind: 'student', id })}
              onAll={(): void => {
                setDebtOnly(true);
                setTab('accounts');
              }}
            />
          )}
          {tab === 'accounts' && <AccountsView data={summary.data} debtOnly={debtOnly} onStudent={(id): void => setOpen({ kind: 'student', id })} />}
          {tab === 'cash' && <CashView slug={slug} canManage={summary.data.canManage} onReceipt={openReceipt} />}
          {tab === 'plans' && summary.data.period && <PlansView slug={slug} periodId={summary.data.period.id} periodStart={summary.data.period.startsOn} />}
        </div>
      )}
    </AcademicPage>
  );
};

// One KPI tile of the summary and the cash report
const Figure = ({ label, value, detail, tone }: { label: string; value: string; detail?: string; tone?: string }): JSX.Element => (
  <div className="rounded-2xl border border-border bg-background p-4">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className={cn('mt-1 text-2xl font-semibold tracking-tight tabular-nums', tone ?? 'text-foreground')}>{value}</p>
    {detail && <p className="text-xs text-muted-foreground tabular-nums">{detail}</p>}
  </div>
);

// Period KPIs, collection by due month and the families with overdue fees
const SummaryView = ({ slug, data, onStudent, onAll }: { slug: string; data: Summary; onStudent: (id: string) => void; onAll: () => void }): JSX.Element => {
  const [isPending, startTransition] = useTransition();
  const { copy, isPublic } = usePaymentsCopy();
  const net = (data.expected ?? 0) - (data.discounts ?? 0);
  const rate = net ? Math.round(((data.collected ?? 0) * 100) / net) : 0;
  const top = Math.max(1, ...data.months.map((m) => m.expected ?? 0));
  const debtors = data.accounts.filter((a) => (a.overdue ?? 0) > 0).sort((a, b) => (b.overdue ?? 0) - (a.overdue ?? 0));
  const remind = (): void =>
    startTransition(async () => {
      const r = await remindAction(slug, data.period?.id ?? '', []);
      if (!r.ok) sileo.error({ title: 'No se pudo enviar', description: r.message });
      else sileo.success({ title: r.data === 1 ? 'Recordatorio enviado a 1 familia' : `Recordatorios enviados a ${r.data} familias`, description: `Lo verán en su panel, en ${copy.title}.` });
    });
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Figure label="A cobrar en el periodo" value={soles(net)} detail={(data.discounts ?? 0) > 0 ? `${soles(data.discounts)} en ${isPublic ? 'exoneraciones y descuentos' : 'becas y descuentos'}` : undefined} />
        <Figure label="Cobrado" value={soles(data.collected)} detail={`${rate} % de lo programado`} tone="text-success" />
        <Figure label="Vencido sin pagar" value={soles(data.overdue)} detail={`${data.debtors} de ${data.students} estudiantes`} tone={(data.overdue ?? 0) > 0 ? 'text-destructive' : undefined} />
        <Figure label="Por vencer" value={soles((data.pending ?? 0) - (data.overdue ?? 0))} />
      </div>
      <section aria-labelledby="pay-months" className="rounded-2xl border border-border bg-background p-5">
        <h2 id="pay-months" className="text-sm font-semibold text-foreground">
          Por mes de vencimiento
        </h2>
        <div className="mt-4 flex h-44 items-end gap-2" role="img" aria-label={data.months.map((m) => `${monthLabel(m.month)}: ${soles(m.collected)} de ${soles(m.expected)}`).join('; ')}>
          {data.months.map((m) => {
            const h = ((m.expected ?? 0) * 100) / top;
            const paid = m.expected ? ((m.collected ?? 0) * 100) / (m.expected ?? 1) : 0;
            const future = `${m.month}-01` > data.today;
            return (
              <div key={m.month} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[10px] text-muted-foreground tabular-nums">{Math.round(paid)} %</span>
                <div className="relative w-full overflow-hidden rounded-t-md bg-secondary" style={{ height: `${h}%` }}>
                  <div className={cn('absolute inset-x-0 bottom-0', future ? 'bg-brand/40' : paid >= 95 ? 'bg-success' : 'bg-warning')} style={{ height: `${paid}%` }} />
                </div>
                <span className="text-xs text-muted-foreground capitalize">{monthLabel(m.month)}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">La barra completa es lo programado para el mes; la parte de color, lo ya cobrado.</p>
      </section>
      <section aria-labelledby="pay-debtors" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="pay-debtors" className="text-lg font-semibold text-foreground">
            Con cuotas vencidas
          </h2>
          {data.canManage && debtors.length > 0 && (
            <button type="button" className="btn-alt" disabled={isPending} onClick={remind}>
              <MorphIcon icon={BellRing} size={16} />
              Enviar recordatorio a {debtors.length} {debtors.length === 1 ? 'familia' : 'familias'}
            </button>
          )}
        </div>
        {debtors.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Nadie tiene cuotas vencidas.</p>
        ) : (
          <>
            <AccountTable rows={debtors.slice(0, 15)} onStudent={onStudent} />
            {debtors.length > 15 && (
              <button type="button" className="btn-alt" onClick={onAll}>
                Ver las {debtors.length} cuentas con deuda
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
};

// Accounts list; a row opens the student's statement
const AccountTable = ({ rows, onStudent }: { rows: Summary['accounts']; onStudent: (id: string) => void }): JSX.Element => (
  <div className="overflow-x-auto rounded-2xl border border-border bg-background">
    <table className="w-full min-w-[44rem] text-left text-sm">
      <thead>
        <tr className="border-b border-border text-muted-foreground">
          <th scope="col" className="px-4 py-3 font-medium">
            Estudiante
          </th>
          <th scope="col" className="px-4 py-3 text-right font-medium">
            Pagado
          </th>
          <th scope="col" className="px-4 py-3 text-right font-medium">
            Vencido
          </th>
          <th scope="col" className="px-4 py-3 font-medium">
            Desde
          </th>
          <th scope="col" className="px-4 py-3 font-medium">
            Recordatorio
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((a) => (
          <tr key={a.studentId} className="cursor-pointer hover:bg-surface" onClick={(): void => onStudent(a.studentId)}>
            <td className="px-4 py-2.5">
              <span className="block font-medium text-foreground">{a.name}</span>
              <span className="block text-xs text-muted-foreground">
                {a.code} · {a.placement}
              </span>
            </td>
            <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">{soles(a.paid)}</td>
            <td className={cn('px-4 py-2.5 text-right font-semibold tabular-nums', (a.overdue ?? 0) > 0 ? 'text-destructive' : 'text-muted-foreground')}>
              {soles(a.overdue)}
              {a.overdueCount > 0 && (
                <span className="block text-[11px] font-normal text-muted-foreground">
                  {a.overdueCount} {a.overdueCount === 1 ? 'cuota' : 'cuotas'}
                </span>
              )}
            </td>
            <td className="px-4 py-2.5 text-xs text-muted-foreground">{a.oldestDue ? formatDay(a.oldestDue) : '—'}</td>
            <td className="px-4 py-2.5 text-xs text-muted-foreground">{a.lastReminder ? formatDay(a.lastReminder.slice(0, 10)) : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Every account of the period, searchable and filterable by overdue debt
const AccountsView = ({ data, debtOnly, onStudent }: { data: Summary; debtOnly: boolean; onStudent: (id: string) => void }): JSX.Element => {
  const [query, setQuery] = useState('');
  const [onlyDebt, setOnlyDebt] = useState(debtOnly);
  const rows = useMemo(() => data.accounts.filter((a) => (!onlyDebt || (a.overdue ?? 0) > 0) && (!query || fold(`${a.name} ${a.code} ${a.placement}`).includes(fold(query)))), [data, query, onlyDebt]);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-64 flex-1">
          <SearchBox value={query} onChange={setQuery} placeholder="Buscar estudiante, código o sección" />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={onlyDebt} onChange={(e): void => setOnlyDebt(e.target.checked)} className="size-4 accent-brand" />
          Solo con deuda vencida
        </label>
      </div>
      <AccountTable rows={rows.slice(0, 200)} onStudent={onStudent} />
      {rows.length > 200 && <p className="text-xs text-muted-foreground">Se muestran 200 de {rows.length}: usa la búsqueda.</p>}
    </div>
  );
};

// Loads one student's statement for treasury
const StudentScreen = ({ slug, id, onBack, onReceipt }: { slug: string; id: string; onBack: () => void; onReceipt: (id: string) => void }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`statement:${slug}:${id}`, () => getStatementAction(slug, id), isFinanceEvent);
  return (
    <div className="space-y-4">
      <button type="button" className="btn-alt" onClick={onBack}>
        <MorphIcon icon={ArrowLeft} size={16} />
        Volver
      </button>
      {error ? <LoadError message={error} onRetry={reload} /> : !data ? <PageSkeleton /> : <StatementView slug={slug} st={data} onChanged={reload} onReceipt={onReceipt} />}
    </div>
  );
};

// Guardians: one tab per child, read-only statement
const FamilyView = ({ slug, items, onReceipt, reload }: { slug: string; items: Parameters<typeof StatementView>[0]['st'][]; onReceipt: (id: string) => void; reload: () => void }): JSX.Element => {
  const [id, setId] = useState(items[0]?.studentId ?? '');
  const st = items.find((x) => x.studentId === id) ?? items[0];
  return (
    <div className="space-y-5">
      {items.length > 1 && (
        <div role="tablist" aria-label="Estudiantes" className="flex flex-wrap gap-2">
          {items.map((x) => (
            <button key={x.studentId} type="button" role="tab" aria-selected={x.studentId === st?.studentId} onClick={(): void => setId(x.studentId)} className={cn('rounded-full border px-4 py-2 text-sm font-medium', x.studentId === st?.studentId ? 'border-brand bg-brand/10 text-foreground' : 'border-border text-muted-foreground')}>
              {x.studentName.split(' ')[0]}
            </button>
          ))}
        </div>
      )}
      {st && <StatementView slug={slug} st={st} onChanged={reload} onReceipt={onReceipt} />}
      <p className="text-xs text-muted-foreground">Puedes pagar en tesorería, por transferencia, Yape o Plin. Los pagos se reflejan aquí cuando tesorería los registra.</p>
    </div>
  );
};

// Cash report: payments in a date range with totals per method (defaults to today)
const CashView = ({ slug, canManage, onReceipt }: { slug: string; canManage: boolean; onReceipt: (id: string) => void }): JSX.Element => {
  const today = useToday();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [method, setMethod] = useState('');
  const f = from || today;
  const t = to || f;
  const { data, error, reload } = useAcademicData(`cash:${slug}:${f}:${t}:${method}`, () => getCashAction(slug, f, t, method), isFinanceEvent);
  const [annulling, setAnnulling] = useState<string | null>(null);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3 print:hidden">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">Desde</span>
          <Input type="date" value={f} max={today || undefined} onChange={(e): void => setFrom(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">Hasta</span>
          <Input type="date" value={t} min={f} max={today || undefined} onChange={(e): void => setTo(e.target.value)} />
        </label>
        <div className="w-48">
          <SelectField id="cash-method" value={method} options={[{ value: '', label: 'Todos los medios' }, ...Object.entries(methodLabels).map(([value, label]) => ({ value, label }))]} onChange={setMethod} />
        </div>
        <button type="button" className="btn-alt ml-auto" onClick={(): void => window.print()}>
          <MorphIcon icon={Printer} size={16} />
          Imprimir
        </button>
      </div>
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : (
        <div data-print-cards>
          <article data-print-card className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Figure label="Total cobrado" value={soles(data.total)} detail={f === t ? formatDay(f) : `${formatDay(f, false)} – ${formatDay(t)}`} tone="text-success" />
              {Object.entries(data.byMethod).map(([k, v]) => (
                <Figure key={k} label={methodLabels[k] ?? k} value={soles(v)} />
              ))}
            </div>
            {data.payments.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">No hay pagos en esas fechas.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border bg-background">
                <table className="w-full min-w-[44rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th scope="col" className="px-4 py-3 font-medium">
                        Recibo
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Fecha
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Estudiante
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Medio
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">
                        Monto
                      </th>
                      {canManage && <th scope="col" className="w-10 print:hidden" />}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.payments.slice(0, 500).map((p) => (
                      <tr key={p.id} className={cn('cursor-pointer hover:bg-surface', p.status === 'annulled' && 'text-muted-foreground line-through')} onClick={(): void => onReceipt(p.id)}>
                        <td className="px-4 py-2 font-medium tabular-nums">{p.receipt}</td>
                        <td className="px-4 py-2 tabular-nums">{formatDay(p.paidOn, false)}</td>
                        <td className="px-4 py-2">{p.studentName}</td>
                        <td className="px-4 py-2 text-xs">
                          {methodLabels[p.method]}
                          {p.reference && <span className="text-muted-foreground"> · {p.reference}</span>}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold tabular-nums">{soles(p.amount)}</td>
                        {canManage && (
                          <td className="px-1 print:hidden" onClick={(e): void => e.stopPropagation()}>
                            {p.status === 'valid' && (
                              <button type="button" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`Anular ${p.receipt}`} onClick={(): void => setAnnulling(p.id)}>
                                <MorphIcon icon={Ban} size={15} />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {data.annulled > 0 && <p className="text-xs text-muted-foreground">{data.annulled} recibos anulados no suman al total.</p>}
          </article>
        </div>
      )}
      {annulling && (
        <AnnulDialog
          slug={slug}
          id={annulling}
          onClose={(): void => setAnnulling(null)}
          onDone={(): void => {
            setAnnulling(null);
            reload();
          }}
        />
      )}
    </div>
  );
};

// Asks the reason before annulling a receipt
const AnnulDialog = ({ slug, id, onClose, onDone }: { slug: string; id: string; onClose: () => void; onDone: () => void }): JSX.Element => {
  const [reason, setReason] = useState('');
  const [isPending, startTransition] = useTransition();
  return (
    <FormDialog
      title="Anular el pago"
      description="El recibo queda anulado en el historial y las cuotas vuelven a quedar pendientes."
      submitLabel="Anular pago"
      isPending={isPending}
      disabled={!reason.trim()}
      onSubmit={(): void =>
        startTransition(async () => {
          const r = await annulPaymentAction(slug, id, reason.trim());
          if (!r.ok) sileo.error({ title: 'No se pudo anular', description: r.message });
          else onDone();
        })
      }
      onClose={onClose}
    >
      <FormField id="annul-pay" label="Motivo" required>
        <Input id="annul-pay" value={reason} maxLength={200} onChange={(e): void => setReason(e.target.value)} placeholder="Error de digitación, pago rechazado por el banco…" />
      </FormField>
    </FormDialog>
  );
};

// The internal receipt (not a SUNAT electronic invoice)
const ReceiptView = ({ slug, id, onBack }: { slug: string; id: string; onBack: () => void }): JSX.Element => {
  const { data, error, reload } = useAcademicData(
    `receipt:${slug}:${id}`,
    () => getPaymentAction(slug, id),
    () => false,
  );
  const [isPending, pdf] = usePdf();
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  const p = data.payment;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 print:hidden">
        <button type="button" className="btn-alt" onClick={onBack}>
          <MorphIcon icon={ArrowLeft} size={16} />
          Volver
        </button>
        <button type="button" className="btn-brand" disabled={isPending} onClick={(): void => pdf(() => receiptPdfAction(slug, id))}>
          <MorphIcon icon={Download} size={16} />
          {isPending ? 'Generando PDF…' : 'Descargar PDF'}
        </button>
      </div>
      <div data-print-cards>
        <article data-print-card className="relative mx-auto max-w-xl rounded-2xl border border-border bg-background p-8 print:border-0 print:p-0">
          {p.status === 'annulled' && <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl font-bold tracking-widest text-destructive/20 uppercase">Anulado</span>}
          <header className="flex items-start justify-between gap-4 border-b-2 border-brand pb-3">
            <div>
              <p className="font-semibold text-brand">{data.institution}</p>
              <p className="text-xs text-muted-foreground">Recibo de pago</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-foreground tabular-nums">{p.receipt}</p>
              <p className="text-xs text-muted-foreground">{formatDay(p.paidOn)}</p>
            </div>
          </header>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-muted-foreground">Estudiante</dt>
            <dd className="text-foreground">
              {p.studentName} <span className="text-muted-foreground tabular-nums">({p.studentCode})</span>
            </dd>
            {p.payer && (
              <>
                <dt className="text-muted-foreground">Pagó</dt>
                <dd className="text-foreground">{p.payer}</dd>
              </>
            )}
            <dt className="text-muted-foreground">Medio</dt>
            <dd className="text-foreground">
              {methodLabels[p.method]}
              {p.reference && ` · operación ${p.reference}`}
            </dd>
          </dl>
          <table className="mt-5 w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th scope="col" className="py-1.5 text-left font-medium">
                  Concepto
                </th>
                <th scope="col" className="py-1.5 text-right font-medium">
                  Importe
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {p.allocations.map((a) => (
                <tr key={a.chargeId}>
                  <td className="py-1.5 text-foreground">{a.chargeName}</td>
                  <td className="py-1.5 pl-3 text-right whitespace-nowrap tabular-nums">{soles(a.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-foreground">
                <td className="py-2 font-semibold">Total</td>
                <td className="py-2 text-right text-lg font-semibold whitespace-nowrap tabular-nums">{soles(p.amount)}</td>
              </tr>
            </tfoot>
          </table>
          {p.status === 'annulled' && <p className="mt-3 text-sm text-destructive">Anulado: {p.annulReason}</p>}
          <p className="mt-6 text-xs text-muted-foreground">Recibió: {p.receivedName}. Recibo interno de la institución; no reemplaza al comprobante electrónico de SUNAT.</p>
        </article>
      </div>
    </div>
  );
};

// Fee plans of the period and the action that generates each student's schedule
const PlansView = ({ slug, periodId, periodStart }: { slug: string; periodId: string; periodStart: string }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`plans:${slug}:${periodId}`, () => listPlansAction(slug, periodId), isFinanceEvent);
  const [editing, setEditing] = useState<FeePlan | 'new' | null>(null);
  const [isPending, startTransition] = useTransition();
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  const act = (work: () => Promise<{ ok: true; data: unknown; message?: string } | { ok: false; message: string }>, ok?: (d: unknown) => string): void =>
    startTransition(async () => {
      const r = await work();
      if (!r.ok) sileo.error({ title: 'No se pudo completar', description: r.message });
      else {
        sileo.success({ title: ok ? ok(r.data) : (r.message ?? 'Listo') });
        reload();
      }
    });
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Un plan por nivel (o uno general). «Generar cronogramas» da a cada estudiante matriculado las cuotas que aún no tiene.</p>
        {data.canManage && (
          <button type="button" className="btn-brand" onClick={(): void => setEditing('new')}>
            <MorphIcon icon={Plus} size={16} />
            Nuevo plan
          </button>
        )}
      </div>
      {data.plans.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Este periodo aún no tiene plan de pagos.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.plans.map((p) => {
            const total = p.items.reduce((n, i) => n + (i.amount ?? 0), 0);
            return (
              <section key={p.id} aria-label={p.name} className="rounded-2xl border border-border bg-background p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {p.levelName || 'Todos los niveles'} · {p.students} estudiantes con cronograma · {soles(total)} en el año
                    </p>
                  </div>
                  {data.canManage && (
                    <span className="flex gap-1">
                      <button
                        type="button"
                        className="btn-alt h-8 px-3 text-xs"
                        disabled={isPending}
                        onClick={(): void =>
                          act(
                            () => generateAction(slug, p.id),
                            (n) => (n === 0 ? 'Todos ya tenían su cronograma' : `${n} cuotas generadas`),
                          )
                        }
                      >
                        Generar cronogramas
                      </button>
                      <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setEditing(p)}>
                        Editar
                      </button>
                      {p.students === 0 && <ConfirmDelete compact title={`Eliminar «${p.name}»`} description="No se puede deshacer." isPending={isPending} onConfirm={(): void => act(() => deletePlanAction(slug, p.id))} />}
                    </span>
                  )}
                </div>
                <ul className="mt-3 divide-y divide-border text-sm">
                  {p.items.map((i) => (
                    <li key={i.id} className="flex items-center gap-3 py-1.5">
                      <span className="min-w-0 flex-1 truncate text-foreground">{i.name}</span>
                      <span className="text-xs text-muted-foreground">vence {formatDay(i.dueOn, false)}</span>
                      <span className="w-24 text-right font-medium tabular-nums">{soles(i.amount)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
      {editing && (
        <PlanDialog
          slug={slug}
          periodId={periodId}
          periodStart={periodStart}
          plan={editing === 'new' ? null : editing}
          onClose={(): void => setEditing(null)}
          onSaved={(): void => {
            setEditing(null);
            reload();
          }}
        />
      )}
    </div>
  );
};

// Plan editor: amounts typed in soles, sent in céntimos
// Public institutions get the APAFA fee instead of tuition (the API rejects tuition there too)
const PlanDialog = ({ slug, periodId, periodStart, plan, onClose, onSaved }: { slug: string; periodId: string; periodStart: string; plan: FeePlan | null; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const { copy, conceptOptions } = usePaymentsCopy();
  const [name, setName] = useState(plan?.name ?? '');
  const [items, setItems] = useState<PlanItemDraft[]>(plan?.items.map((i) => ({ id: i.id, concept: i.concept, name: i.name, amount: ((i.amount ?? 0) / 100).toFixed(2).replace('.', ','), dueOn: i.dueOn })) ?? [{ id: '', concept: 'enrollment', name: 'Matrícula', amount: '', dueOn: periodStart }]);
  const [isPending, startTransition] = useTransition();
  const bad = !name.trim() || items.length === 0 || items.some((i) => !i.name.trim() || Number.isNaN(toCents(i.amount)) || !i.dueOn);
  const set = (k: number, patch: Partial<PlanItemDraft>): void => setItems((xs) => xs.map((x, j) => (j === k ? { ...x, ...patch } : x)));
  return (
    <FormDialog
      title={plan ? 'Editar plan de pagos' : 'Nuevo plan de pagos'}
      description={plan && plan.students > 0 ? 'Los cronogramas ya generados no cambian; las cuotas nuevas se dan al volver a generar.' : copy.planDescription}
      submitLabel="Guardar plan"
      isPending={isPending}
      disabled={bad}
      wide
      onSubmit={(): void =>
        startTransition(async () => {
          const r = await savePlanAction(slug, {
            id: plan?.id ?? '',
            periodId,
            periodName: '',
            levelId: plan?.levelId ?? '',
            levelName: '',
            name: name.trim(),
            students: 0,
            items: items.map((i) => ({ id: i.id, concept: i.concept, name: i.name.trim(), amount: toCents(i.amount), dueOn: i.dueOn })),
          });
          if (!r.ok) sileo.error({ title: 'No se pudo guardar', description: r.message });
          else onSaved();
        })
      }
      onClose={onClose}
    >
      <FormField id="plan-name" label="Nombre" required>
        <Input id="plan-name" value={name} maxLength={120} onChange={(e): void => setName(e.target.value)} placeholder={copy.planNamePlaceholder} />
      </FormField>
      <div className="space-y-2">
        {items.map((i, k) => (
          <div key={i.id || k} className="grid grid-cols-[8rem_minmax(0,1fr)_7rem_9rem_2rem] items-center gap-2">
            <select aria-label="Concepto" value={i.concept} onChange={(e): void => set(k, { concept: e.target.value })} className="h-9 rounded-md border border-border bg-background px-2 text-sm">
              {conceptOptions(i.concept).map((o) => (
                <option key={o.value} value={o.value} disabled={o.disabled}>
                  {o.label}
                </option>
              ))}
            </select>
            <Input placeholder={copy.itemPlaceholder} aria-label="Nombre de la cuota" value={i.name} maxLength={120} onChange={(e): void => set(k, { name: e.target.value })} />
            <Input aria-label="Monto" inputMode="decimal" value={i.amount} placeholder="0,00" onChange={(e): void => set(k, { amount: e.target.value.replace(/[^\d.,]/g, '') })} className="tabular-nums" />
            <Input aria-label="Vencimiento" type="date" value={i.dueOn} onChange={(e): void => set(k, { dueOn: e.target.value })} />
            <button type="button" aria-label="Quitar cuota" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive" onClick={(): void => setItems((xs) => xs.filter((_, j) => j !== k))}>
              <MorphIcon icon={Trash2} size={14} />
            </button>
          </div>
        ))}
        <button type="button" className="btn-alt h-9 text-sm" onClick={(): void => setItems((xs) => [...xs, { id: '', concept: copy.newItem.concept, name: copy.newItem.name(xs.length), amount: xs[xs.length - 1]?.amount ?? '', dueOn: '' }])}>
          <MorphIcon icon={Plus} size={14} />
          Agregar cuota
        </button>
      </div>
    </FormDialog>
  );
};
