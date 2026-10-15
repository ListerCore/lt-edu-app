'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { Check, Download, FileCheck2, Filter, History, RotateCcw, X } from 'lucide-react';
import { backupSnapshots } from '../data/backup-data';

const BackupHistory = (): JSX.Element => {
  const [filter, setFilter] = useState('Todos los tipos');
  const [verified, setVerified] = useState<string[]>([]);
  const [restoreId, setRestoreId] = useState<string | null>(null);
  const [restoreScope, setRestoreScope] = useState('selective');
  const [confirmation, setConfirmation] = useState('');
  const [feedback, setFeedback] = useState('');
  const visibleSnapshots = useMemo(() => (filter === 'Todos los tipos' ? backupSnapshots : backupSnapshots.filter(({ type }) => type === filter)), [filter]);
  const selectedSnapshot = backupSnapshots.find(({ id }) => id === restoreId);

  const exportLog = (): void => {
    const csv = ['Código,Fecha y hora,Tipo,Alcance,Tamaño,Hash,Estado', ...visibleSnapshots.map(({ id, date, type, scope, size, hash, status }) => [id, date, type, scope, size, hash, status].map((value) => `"${value}"`).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'sige-jl-backup-audit.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const verifySnapshot = (id: string): void => {
    setVerified((current) => (current.includes(id) ? current : [...current, id]));
    setFeedback(`Integridad de ${id} verificada en esta sesión.`);
  };

  const closeRestore = (): void => {
    setRestoreId(null);
    setConfirmation('');
  };

  return (
    <section aria-labelledby="backup-history-heading" className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex flex-col gap-3 border-b border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
            <History aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0">
            <h2 id="backup-history-heading" className="font-heading text-sm font-bold text-foreground">
              Historial de snapshots
            </h2>
            <p className="mt-1 text-[9px] leading-4 text-muted-foreground">Verificación SHA-256 e integridad de los paquetes de respaldo.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-0 flex-1 sm:flex-none">
            <Filter aria-hidden="true" className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <select aria-label="Filtrar tipo de respaldo" value={filter} onChange={(event): void => setFilter(event.target.value)} className="h-8 max-w-full rounded-md border border-border bg-background pl-8 pr-2 text-[9px] text-foreground sm:w-48">
              <option>Todos los tipos</option>
              {Array.from(new Set(backupSnapshots.map(({ type }) => type))).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={exportLog} className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[9px] font-semibold text-foreground hover:bg-muted">
            <Download aria-hidden="true" className="size-3.5" />
            Exportar log
          </button>
        </div>
      </header>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-220 border-collapse text-left">
          <thead className="bg-muted/50 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">
            <tr>
              {['Código snapshot', 'Fecha y hora', 'Tipo', 'Alcance', 'Tamaño', 'SHA-256', 'Estado', 'Acciones'].map((label) => (
                <th key={label} scope="col" className="px-3 py-3 first:pl-4">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleSnapshots.map((snapshot) => (
              <tr key={snapshot.id} className="hover:bg-muted/20">
                <td className="px-3 py-3 pl-4 font-mono text-[9px] font-semibold text-foreground">{snapshot.id}</td>
                <td className="px-3 py-3 text-[9px] text-muted-foreground">{snapshot.date}</td>
                <td className="max-w-36 px-3 py-3 text-[9px] text-foreground">{snapshot.type}</td>
                <td className="max-w-40 px-3 py-3 text-[9px] text-muted-foreground">{snapshot.scope}</td>
                <td className="whitespace-nowrap px-3 py-3 text-[9px] tabular-nums text-foreground">{snapshot.size}</td>
                <td className="px-3 py-3 font-mono text-[8px] text-muted-foreground">{snapshot.hash}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded bg-secondary/10 px-1.5 py-1 text-[8px] font-semibold text-secondary">
                    <Check aria-hidden="true" className="size-3" />
                    {snapshot.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button type="button" aria-label={`Descargar ${snapshot.id}`} onClick={(): void => setFeedback(`Descarga preparada para ${snapshot.id}.`)} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Download aria-hidden="true" className="size-3.5" />
                    </button>
                    <button type="button" aria-label={`Verificar integridad de ${snapshot.id}`} onClick={(): void => verifySnapshot(snapshot.id)} className={`grid size-7 place-items-center rounded hover:bg-muted ${verified.includes(snapshot.id) ? 'text-secondary' : 'text-muted-foreground hover:text-foreground'}`}>
                      <FileCheck2 aria-hidden="true" className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(): void => {
                        setRestoreId(snapshot.id);
                        setFeedback('');
                      }}
                      className="inline-flex h-7 items-center gap-1 rounded bg-destructive/10 px-2 text-[8px] font-bold text-destructive hover:bg-destructive/20"
                    >
                      <RotateCcw aria-hidden="true" className="size-3" />
                      Restaurar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visibleSnapshots.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No hay snapshots para este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-[9px] text-muted-foreground">
        <span>Mostrando {visibleSnapshots.length} de 28 copias históricas</span>
        <div className="flex items-center gap-1">
          <button type="button" className="h-7 rounded border border-border px-2 hover:bg-muted">
            Anterior
          </button>
          <button type="button" aria-current="page" className="size-7 rounded bg-primary text-primary-foreground">
            1
          </button>
          <button type="button" className="size-7 rounded hover:bg-muted">
            2
          </button>
          <button type="button" className="size-7 rounded hover:bg-muted">
            3
          </button>
          <button type="button" className="h-7 rounded border border-border px-2 hover:bg-muted">
            Siguiente
          </button>
        </div>
      </footer>
      {feedback && (
        <p role="status" className="border-t border-border px-4 py-2 text-[9px] font-medium text-secondary">
          {feedback}
        </p>
      )}
      {selectedSnapshot && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="restore-heading" className="w-full max-w-lg rounded-lg border border-border bg-card p-5 shadow-xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="restore-heading" className="font-heading text-base font-bold text-foreground">
                  Confirmar restauración
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">Snapshot {selectedSnapshot.id}</p>
              </div>
              <button type="button" onClick={closeRestore} aria-label="Cerrar" className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted">
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <div className="mt-4 rounded-md border border-destructive/20 bg-destructive/5 p-3 text-[10px] leading-5 text-muted-foreground">
              <strong className="text-destructive">Acción crítica.</strong> La restauración requiere mantenimiento, validación de integridad y autorización 2FA. Esta pantalla es una demostración de interfaz y no modifica datos.
            </div>
            <fieldset className="mt-4 space-y-2">
              <legend className="text-[10px] font-semibold text-foreground">Alcance de restauración</legend>
              <label className="flex cursor-pointer items-start gap-2 rounded-md border border-border p-3 text-[10px] text-foreground">
                <input type="radio" name="restore-scope" value="selective" checked={restoreScope === 'selective'} onChange={(): void => setRestoreScope('selective')} className="mt-0.5 accent-primary" />
                <span>
                  <strong>Selectiva</strong>
                  <span className="block text-muted-foreground">Recuperar un módulo específico.</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-2 rounded-md border border-border p-3 text-[10px] text-foreground">
                <input type="radio" name="restore-scope" value="total" checked={restoreScope === 'total'} onChange={(): void => setRestoreScope('total')} className="mt-0.5 accent-primary" />
                <span>
                  <strong>Total</strong>
                  <span className="block text-muted-foreground">Reemplazar el estado integral.</span>
                </span>
              </label>
            </fieldset>
            <label className="mt-4 block text-[10px] font-semibold text-foreground">
              Escribe RESTAURAR para habilitar la simulación
              <input value={confirmation} onChange={(event): void => setConfirmation(event.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 font-mono text-xs text-foreground outline-none focus:border-ring" />
            </label>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={closeRestore} className="h-9 rounded-md border border-border px-3 text-xs font-semibold text-foreground hover:bg-muted">
                Cancelar
              </button>
              <button
                type="button"
                disabled={confirmation !== 'RESTAURAR'}
                onClick={(): void => {
                  setFeedback(`Simulación de restauración iniciada para ${selectedSnapshot.id} (${restoreScope === 'total' ? 'total' : 'selectiva'}).`);
                  closeRestore();
                }}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-destructive px-3 text-xs font-semibold text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw aria-hidden="true" className="size-3.5" />
                Iniciar simulación
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export { BackupHistory };
