'use client';

import { useState, useTransition, type JSX } from 'react';
import { sileo } from 'sileo';
import { Checkbox } from '@/components/ui/checkbox';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { usePdf } from '@/features/protected/documents/lib/use-pdf';
import { siagieXlsxAction } from '../actions/siagie-xlsx';
import type { SiagieExportDialogProps } from '../types';

// Downloads the SIAGIE upload spreadsheet of what the filter shows (the pending ones by default) and, if asked,
// marks those enrollments as exported
export const SiagieExportDialog = ({ slug, filter, pending, canManage, onClose, onDone }: SiagieExportDialogProps): JSX.Element => {
  const [onlyPending, setOnlyPending] = useState(true);
  const [mark, setMark] = useState(canManage);
  const [, download] = usePdf();
  const [isPending, start] = useTransition();
  const submit = (): void =>
    start(async () => {
      const f = { ...filter, siagieStatus: onlyPending ? 'pending' : filter.siagieStatus };
      const r = await siagieXlsxAction(slug, f, mark && canManage);
      if (!r.ok) {
        sileo.error({ title: 'No se pudo generar la planilla', description: r.message });
        return;
      }
      download(async () => r);
      if (r.data.marked > 0) sileo.success({ title: 'Planilla lista', description: `${r.data.marked} matrículas quedan como exportadas.` });
      onDone();
      onClose();
    });
  return (
    <FormDialog
      title="Planilla para el SIAGIE"
      description="Un Excel con las columnas de la nómina de matrícula del SIAGIE, para cargarlo sin copiar a mano. Revisa el formato con la plantilla vigente de tu UGEL."
      submitLabel="Descargar planilla"
      isPending={isPending}
      disabled={onlyPending && pending === 0}
      onSubmit={submit}
      onClose={onClose}
    >
      <div className="space-y-3 text-sm">
        <label htmlFor="siagie-pending" className="flex items-start gap-3">
          <Checkbox id="siagie-pending" checked={onlyPending} onCheckedChange={(c): void => setOnlyPending(c === true)} className="mt-0.5" />
          <span>
            <span className="font-medium text-foreground">Solo las pendientes</span>
            <span className="block text-xs text-muted-foreground">{pending === 0 ? 'No hay matrículas pendientes con este filtro.' : `${pending} matrículas aún no exportadas.`}</span>
          </span>
        </label>
        {canManage && (
          <label htmlFor="siagie-mark" className="flex items-start gap-3">
            <Checkbox id="siagie-mark" checked={mark} onCheckedChange={(c): void => setMark(c === true)} className="mt-0.5" />
            <span>
              <span className="font-medium text-foreground">Marcarlas como exportadas</span>
              <span className="block text-xs text-muted-foreground">Las observadas también: vuelven a cargarse corregidas.</span>
            </span>
          </label>
        )}
      </div>
    </FormDialog>
  );
};
