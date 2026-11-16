'use client';

import type { JSX } from 'react';
import { Eye, FileSignature, PenLine } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { actStatusClass, actStatusLabels } from '@/features/protected/people/data/people-data';
import { cn } from '@/lib/utils';
import type { useRecordAct } from '../hooks/use-record-act';
import type { RecordInfo } from '../types';

interface Props {
  record: RecordInfo;
  canManage: boolean;
  act: ReturnType<typeof useRecordAct>;
  onSigners: () => void;
}

// The signed version of a consolidated acta (EBA): generate it for its signers, sign it, and open it with its seal
export const RecordActBar = ({ record: r, canManage, act, onSigners }: Props): JSX.Element | null => {
  if (r.kind === 'unit') return null;
  const replaced = r.status === 'replaced';
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm print:hidden">
      <MorphIcon icon={FileSignature} size={18} className="text-brand" />
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-foreground">Acta firmada</span>
        <span className="block text-xs text-muted-foreground">
          {r.actVersionId
            ? 'Versión con el encabezado oficial, las firmas y el código QR de verificación.'
            : replaced
              ? 'Esta emisión fue reemplazada: firma la vigente.'
              : 'Genera la versión con el encabezado oficial y el QR para que la firmen coordinación y dirección.'}
        </span>
      </span>
      {r.actStatus && <span className={cn('pill', actStatusClass[r.actStatus])}>{actStatusLabels[r.actStatus] ?? r.actStatus}</span>}
      {canManage && (
        <button type="button" className="btn-alt h-9 px-3 text-xs" onClick={onSigners}>
          Firmantes
        </button>
      )}
      {canManage && !replaced && (!r.actVersionId || r.actStatus !== 'published') && (
        <button type="button" className="btn-alt h-9 px-3 text-xs" disabled={act.busy !== null} onClick={(): void => act.generate(r)}>
          <MorphIcon icon={FileSignature} size={14} />
          {act.busy === 'generate' ? 'Generando…' : r.actVersionId ? 'Volver a generar' : 'Generar para firma'}
        </button>
      )}
      {r.actStatus === 'pending' && (
        <button type="button" className="btn-alt h-9 px-3 text-xs" disabled={act.busy !== null} onClick={(): void => act.sign(r)}>
          <MorphIcon icon={PenLine} size={14} />
          {act.busy === 'sign' ? 'Firmando…' : 'Firmar'}
        </button>
      )}
      {r.actVersionId && (
        <button type="button" className="btn-brand h-9 px-3 text-xs" disabled={act.preview.isPending} onClick={(): void => act.view(r)}>
          <MorphIcon icon={Eye} size={14} />
          {act.preview.isPending ? 'Abriendo…' : 'Ver acta firmada'}
        </button>
      )}
    </div>
  );
};
