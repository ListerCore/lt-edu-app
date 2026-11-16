'use client';

import { useTransition, type JSX } from 'react';
import { Download, Pencil } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { SelectField } from '@/features/protected/academic/components/academic-ui';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { AttachmentsButton } from '@/features/protected/attachments/components/attachments-button';
import { usePdf } from '@/features/protected/documents/lib/use-pdf';
import { cn } from '@/lib/utils';
import { reportPdfAction } from '../actions/report-pdf';
import { setItemStatusAction } from '../actions/set-item-status';
import { evidenceCategories, itemStatusClass, itemStatusLabels, reportTitles, sectionLabels } from '../data/compliance-data';
import type { ComplianceBoard, Item, Report } from '../types';

interface Props {
  slug: string;
  board: ComplianceBoard;
  onEditReport: (r: Report) => void;
  onEditItem: (it: Item) => void;
  onChange: () => void;
}

// The two technical reports: their data, the verification matrix with the evidence of each row and the PDF
export const ReportsTab = ({ slug, board, onEditReport, onEditItem, onChange }: Props): JSX.Element => {
  const [isPdf, pdf] = usePdf();
  const [isPending, start] = useTransition();
  const status = (it: Item, next: string): void =>
    start(async () => {
      const r = await runAcademicAction(setItemStatusAction(slug, it.id, next), `«${it.element}»: ${itemStatusLabels[next]?.toLowerCase()}.`);
      if (r.ok) onChange();
    });
  return (
    <div className="space-y-8">
      {board.reports.map((report) => {
        const items = board.items.filter((it) => it.report === report.kind);
        const done = items.filter((it) => it.status !== 'pending').length;
        const sections = [...new Set(items.map((it) => it.section))];
        return (
          <section key={report.kind} aria-labelledby={`report-${report.kind}`} className="space-y-3 rounded-2xl border border-border bg-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id={`report-${report.kind}`} className="text-lg font-semibold text-foreground">
                  {reportTitles[report.kind]?.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {reportTitles[report.kind]?.norm}
                  {report.number && ` · Informe N.° ${report.number}`}
                  {report.fileNumber && ` · Expediente ${report.fileNumber}`}
                  {report.evaluatedOn && ` · Evaluado el ${formatDay(report.evaluatedOn)}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {board.canWrite && (
                  <button type="button" className="btn-alt" onClick={(): void => onEditReport(report)}>
                    <MorphIcon icon={Pencil} size={16} />
                    Datos del informe
                  </button>
                )}
                <button type="button" className="btn-brand" disabled={isPdf} onClick={(): void => pdf(() => reportPdfAction(slug, report.kind as 'platform' | 'equipment'))}>
                  <MorphIcon icon={Download} size={16} />
                  {isPdf ? 'Generando…' : done === items.length ? 'Descargar PDF' : 'Descargar borrador'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                <span className="block h-full bg-success" style={{ width: `${(done * 100) / Math.max(1, items.length)}%` }} />
              </span>
              <span className="text-sm text-muted-foreground tabular-nums">
                {done} de {items.length} filas listas
              </span>
            </div>
            {sections.map((section) => (
              <div key={section} className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">{sectionLabels[section]}</h3>
                <ul className="divide-y divide-border rounded-xl border border-border">
                  {items
                    .filter((it) => it.section === section)
                    .map((it) => (
                      <li key={it.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
                        <span className="min-w-0 flex-1 basis-72">
                          <span className="block text-sm font-medium text-foreground">{it.element}</span>
                          <span className="block text-xs text-muted-foreground">
                            {[it.module, it.route].filter(Boolean).join(' · ')}
                            {(it.annex || it.folio) && ` · Anexo ${it.annex || '—'}, folio ${it.folio || '—'}`}
                          </span>
                          {it.verifiedByName && <span className="block text-xs text-success">Verificó {it.verifiedByName}</span>}
                        </span>
                        <span className={cn('pill', it.files > 0 ? 'bg-secondary text-foreground' : 'bg-warning/12 text-warning')}>
                          {it.files === 0 ? 'Sin evidencia' : it.files === 1 ? '1 evidencia' : `${it.files} evidencias`}
                        </span>
                        <span className="flex items-center gap-1">
                          <AttachmentsButton ownerKind="compliance_item" ownerId={it.id} title={`Evidencia · ${it.element}`} description="Capturas con datos de prueba o anonimizados; salen como anexo del informe." categories={evidenceCategories} label="Evidencia" />
                          {board.canWrite && (
                            <button type="button" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={(): void => onEditItem(it)} aria-label={`Editar la fila ${it.element}`}>
                              <MorphIcon icon={Pencil} size={15} />
                            </button>
                          )}
                        </span>
                        {board.canWrite ? (
                          <div className="w-40">
                            <SelectField
                              id={`status-${it.id}`}
                              value={it.status}
                              disabled={isPending}
                              options={[
                                { value: 'pending', label: 'Pendiente' },
                                ...(board.canVerify || it.status === 'verified' ? [{ value: 'verified', label: 'Verificado' }] : []),
                                { value: 'not_applicable', label: 'No aplica' },
                              ]}
                              onChange={(next): void => status(it, next)}
                            />
                          </div>
                        ) : (
                          <span className={cn('pill', itemStatusClass[it.status])}>{itemStatusLabels[it.status]}</span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
      {!board.canVerify && board.canWrite && <p className="text-xs text-muted-foreground">Solo el responsable técnico marca una fila como verificada, y solo con una evidencia subida.</p>}
    </div>
  );
};
