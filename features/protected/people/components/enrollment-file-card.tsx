'use client';

import { useState, type JSX } from 'react';
import { Pencil, Printer } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { LoadError } from '@/features/protected/academic/components/academic-ui';
import { usePdf } from '@/features/protected/documents/lib/use-pdf';
import { enrollmentFormPdfAction } from '../actions/enrollment-form-pdf';
import { deviceLabels, fileDocumentLabels, internetLabels, motherTongueLabels, preferredModeLabels } from '../data/people-data';
import { useEnrollmentFile } from '../hooks/use-enrollment-file';
import type { EnrollmentFileCardProps } from '../types';
import { EnrollmentFileDialog } from './enrollment-file-dialog';

const updated = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Lima' });

// The ficha única of an EBA student: what it says, who updated it, and its PDF to print and sign
export const EnrollmentFileCard = ({ slug, studentId, canManage }: EnrollmentFileCardProps): JSX.Element => {
  const { data: file, error, reload } = useEnrollmentFile(slug, studentId);
  const [editing, setEditing] = useState(false);
  const [isPrinting, print] = usePdf();
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!file) return <div className="h-48 animate-pulse rounded-2xl bg-card" />;
  const tongue = file.motherTongue === 'other' ? file.motherTongueOther : motherTongueLabels[file.motherTongue];
  const rows: Array<[string, string]> = [
    ['Lengua materna', tongue],
    ['Ocupación', file.occupation],
    ['Internet', internetLabels[file.internet]],
    ['Dispositivo', deviceLabels[file.device]],
    ['Forma que solicita', preferredModeLabels[file.preferredMode]],
    ['Últimos estudios', file.lastStudies],
    ['Discapacidad', file.disability],
    ['Documentos presentados', file.documents.map((d) => fileDocumentLabels[d]).join(', ')],
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{file.updatedAt ? `Actualizada por ${file.updatedByName || 'secretaría'} el ${updated.format(new Date(file.updatedAt))}.` : 'Aún no se completó la ficha.'}</p>
        <div className="flex gap-2">
          <button type="button" className="btn-alt" disabled={isPrinting} onClick={(): void => print(() => enrollmentFormPdfAction(slug, studentId))}>
            <MorphIcon icon={Printer} size={16} />
            {isPrinting ? 'Generando…' : 'Imprimir ficha'}
          </button>
          {canManage && (
            <button type="button" className="btn-brand" onClick={(): void => setEditing(true)}>
              <MorphIcon icon={Pencil} size={16} />
              Editar
            </button>
          )}
        </div>
      </div>
      <dl className="grid gap-x-6 rounded-2xl border border-border bg-background p-5 text-sm sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-border py-2.5 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium text-foreground">{value || '—'}</dd>
          </div>
        ))}
      </dl>
      {editing && <EnrollmentFileDialog slug={slug} file={file} onClose={(): void => setEditing(false)} onSaved={reload} />}
    </div>
  );
};
