'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { BadgeCheck, BellRing, CircleDollarSign, FileText, Handshake, Search, Send, SlidersHorizontal } from 'lucide-react';
import { familyAccounts, type FamilyAccount, type PaymentStatus } from '../data/finance-data';

const statusClass: Record<PaymentStatus, string> = {
  'Al día': 'bg-secondary/10 text-secondary',
  'Convenio / Beca': 'bg-chart-3/15 text-chart-3',
  'Por vencer': 'bg-accent text-primary',
  'En mora': 'bg-destructive/10 text-destructive',
  Fraccionado: 'bg-primary/10 text-primary',
};

const FinanceStudents = ({ selectedId, onSelect, onAction }: { selectedId: string; onSelect: (account: FamilyAccount) => void; onAction: (message: string) => void }): JSX.Element => {
  const [query, setQuery] = useState('');
  const [cycle, setCycle] = useState('Todos los ciclos');
  const [status, setStatus] = useState('Estado de pago');
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const filtered = useMemo(() => familyAccounts.filter((account) => `${account.name} ${account.dni} ${account.grade}`.toLowerCase().includes(query.toLowerCase()) && (cycle === 'Todos los ciclos' || account.cycle === cycle) && (status === 'Estado de pago' || account.status === status) && (!scholarshipOnly || account.status === 'Convenio / Beca')), [query, cycle, status, scholarshipOnly]);
  const exportAccounts = (): void => {
    const rows = [['Estudiante', 'DNI', 'Grado', 'Ciclo', 'Estado', 'Monto pendiente', 'Apoderado'], ...filtered.map((account) => [account.name, account.dni, account.grade, account.cycle, account.status, account.amount, account.guardian])];
    const blob = new Blob([rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'padron-pensiones-eba.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-labelledby="finance-students-heading" className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 p-4">
        <div className="min-w-0">
          <h2 id="finance-students-heading" className="font-heading text-xs font-bold text-foreground sm:text-sm">
            Matriz de pensiones EBA
          </h2>
          <p className="mt-1 text-[8px] text-muted-foreground">850 inscritos · 750 al día · 100 con deuda</p>
        </div>
        <button type="button" onClick={exportAccounts} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[8px] font-semibold text-foreground hover:bg-muted">
          <FileText aria-hidden="true" className="size-3.5" />
          Exportar padrón
        </button>
      </header>
      <div className="flex min-w-0 flex-wrap gap-2 border-b border-border p-3">
        <label className="relative min-w-44 flex-1 basis-48">
          <Search aria-hidden="true" className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(event): void => setQuery(event.target.value)} placeholder="Buscar estudiante o DNI" className="h-9 w-full rounded-md border border-border bg-muted/50 pl-8 pr-3 text-[9px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring" />
        </label>
        <select aria-label="Filtrar por ciclo" value={cycle} onChange={(event): void => setCycle(event.target.value)} className="h-9 min-w-0 max-w-full rounded-md border border-border bg-muted/50 px-2 text-[9px] text-foreground">
          <option>Todos los ciclos</option>
          <option>Avanzado</option>
          <option>Intermedio</option>
          <option>Inicial</option>
        </select>
        <select aria-label="Filtrar por estado de pago" value={status} onChange={(event): void => setStatus(event.target.value)} className="h-9 min-w-0 max-w-full rounded-md border border-border bg-muted/50 px-2 text-[9px] text-foreground">
          <option>Estado de pago</option>
          <option>Al día</option>
          <option>Por vencer</option>
          <option>En mora</option>
          <option>Convenio / Beca</option>
          <option>Fraccionado</option>
        </select>
        <button type="button" aria-pressed={scholarshipOnly} onClick={(): void => setScholarshipOnly((value) => !value)} className={`inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-[9px] font-semibold ${scholarshipOnly ? 'bg-chart-3/15 text-chart-3' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}>
          <SlidersHorizontal aria-hidden="true" className="size-3.5" />
          Becas / convenios
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-170 border-collapse text-left">
          <thead className="bg-muted/30 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">
            <tr>
              {['Estudiante / grado', 'Ciclo EBA', 'Situación / cuota', 'Monto / comprobante', 'Acciones'].map((title) => (
                <th key={title} scope="col" className="px-3 py-3 first:pl-4">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((account) => {
              const selected = selectedId === account.id;
              return (
                <tr key={account.id} onClick={(): void => onSelect(account)} className={`cursor-pointer transition-colors hover:bg-muted/40 ${selected ? 'bg-accent/50' : ''}`}>
                  <th scope="row" className="px-3 py-3 pl-4">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[8px] font-bold ${account.id === 'silvia' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>{account.initials}</span>
                      <span className="min-w-0">
                        <span className="block max-w-40 truncate text-[9px] font-semibold text-foreground">{account.name}</span>
                        <span className="mt-0.5 block text-[8px] font-normal text-muted-foreground">
                          DNI: {account.dni} · {account.grade}
                        </span>
                      </span>
                    </span>
                  </th>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[8px] font-semibold text-primary">{account.cycle}</span>
                  </td>
                  <td className="max-w-36 px-3 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-[8px] font-semibold ${statusClass[account.status]}`}>{account.status}</span>
                    <span className="mt-1 block max-w-36 text-[8px] leading-4 text-muted-foreground">{account.note}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`block whitespace-nowrap text-[9px] font-bold ${account.amount > 0 ? (account.status === 'En mora' ? 'text-destructive' : 'text-foreground') : 'text-secondary'}`}>{account.amount > 0 ? `S/ ${account.amount.toFixed(2)}` : 'Cancelado'}</span>
                    <span className="mt-1 block max-w-32 truncate font-mono text-[8px] text-muted-foreground">{account.receipt}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Ver comprobante ${account.name}`}
                        onClick={(event): void => {
                          event.stopPropagation();
                          onAction(`Comprobantes de ${account.name}`);
                        }}
                        className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-primary"
                      >
                        <FileText aria-hidden="true" className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Enviar recordatorio a ${account.name}`}
                        onClick={(event): void => {
                          event.stopPropagation();
                          onAction(`Recordatorio preparado para ${account.guardian} vía WhatsApp.`);
                        }}
                        className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-secondary"
                      >
                        {account.status === 'En mora' ? <BellRing aria-hidden="true" className="size-3.5" /> : account.status === 'Convenio / Beca' ? <Handshake aria-hidden="true" className="size-3.5" /> : account.amount > 0 ? <Send aria-hidden="true" className="size-3.5" /> : <BadgeCheck aria-hidden="true" className="size-3.5" />}
                      </button>
                      <button
                        type="button"
                        aria-label={`Registrar abono de ${account.name}`}
                        onClick={(event): void => {
                          event.stopPropagation();
                          onAction(`Registro de pago iniciado para ${account.name}.`);
                        }}
                        className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-primary"
                      >
                        <CircleDollarSign aria-hidden="true" className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No hay estudiantes que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-[8px] text-muted-foreground">
        <span>Mostrando {filtered.length} de 850 estudiantes registrados en 2026-II</span>
        <div className="flex items-center gap-1">
          <button type="button" disabled className="h-7 rounded px-2 hover:bg-muted disabled:opacity-50">
            Anterior
          </button>
          {['1', '2', '3'].map((page) => (
            <button type="button" key={page} aria-current={page === '1' ? 'page' : undefined} className={`size-7 rounded text-[8px] ${page === '1' ? 'bg-primary font-bold text-primary-foreground' : 'hover:bg-muted'}`}>
              {page}
            </button>
          ))}
          <span>…</span>
          <button type="button" className="size-7 rounded hover:bg-muted">
            85
          </button>
          <button type="button" className="h-7 rounded px-2 hover:bg-muted">
            Siguiente
          </button>
        </div>
      </footer>
    </section>
  );
};

export { FinanceStudents };
