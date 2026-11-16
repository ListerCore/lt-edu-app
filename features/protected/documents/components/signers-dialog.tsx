'use client';

import { useState, useTransition, type JSX } from 'react';
import { ArrowDown, ArrowUp, Trash2, UserPlus } from 'lucide';
import { sileo } from 'sileo';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { scheduleSignersAction, setScheduleSignersAction } from '../actions/document-actions';

const MAX_SIGNERS = 10;

export interface SignersDialogProps {
  slug: string;
  // schedules | placement
  kind: string;
  title: string;
  onClose: () => void;
  onDone: () => void;
}

// Who signs a kind of document, in order: any staff member, with the position printed under the name (Director(a),
// Responsable de…). Several signers sign one after another
export const SignersDialog = ({ slug, kind, title, onClose, onDone }: SignersDialogProps): JSX.Element => {
  const setup = useAcademicData(`signers:${kind}:${slug}`, () => scheduleSignersAction(slug, kind));
  const [rows, setRows] = useState<Array<{ staffId: string; position: string }> | null>(null);
  const [isPending, start] = useTransition();
  const [error, setError] = useState('');
  const list = rows ?? setup.data?.signers.map((s) => ({ staffId: s.staffId, position: s.position })) ?? [];
  const candidates = setup.data?.candidates ?? [];
  const edit = (next: Array<{ staffId: string; position: string }>): void => setRows(next);
  const move = (i: number, by: number): void => {
    const next = list.slice();
    [next[i], next[i + by]] = [next[i + by], next[i]];
    edit(next);
  };
  return (
    <FormDialog
      wide
      title={title}
      description="Firman en este orden. Puede ser solo la dirección o varias personas (coordinación, un responsable designado). El cargo se imprime bajo el nombre. Las versiones pendientes se actualizan: las firmas hechas se mantienen, quien sale deja de firmar y quien entra pasa a firmar."
      submitLabel="Guardar firmantes"
      isPending={isPending}
      disabled={!setup.data || list.length === 0 || list.some((r) => !r.staffId || !r.position.trim())}
      onClose={onClose}
      onSubmit={(): void =>
        start(async () => {
          const r = await setScheduleSignersAction(slug, list, kind);
          if (!r.ok) {
            setError(r.fields?.signers ?? r.message);
            return;
          }
          sileo.success({ title: 'Firmantes guardados', description: 'Las versiones nuevas y las pendientes los piden en este orden.' });
          onDone();
          onClose();
        })
      }
    >
      {setup.error && <p className="text-sm text-destructive">{setup.error}</p>}
      {!setup.data && !setup.error && <div className="h-24 animate-pulse rounded-lg bg-secondary" />}
      {setup.data && (
        <div className="space-y-3">
          {list.length === 0 && <p className="text-sm text-warning">Sin firmantes. Agrega al menos uno.</p>}
          {list.map((r, i) => (
            <div key={r.staffId || `new-${i}`} className="grid gap-2 rounded-lg bg-secondary/50 p-3 sm:grid-cols-[1fr_1fr_auto]">
              <SelectField
                id={`signer-${i}`}
                value={r.staffId}
                placeholder="Elige a la persona"
                // Someone already in another row is not offered again
                options={candidates.filter((c) => c.staffId === r.staffId || !list.some((x) => x.staffId === c.staffId)).map((c) => ({ value: c.staffId, label: `${c.name} · ${c.position}` }))}
                onChange={(v): void => {
                  const c = candidates.find((x) => x.staffId === v);
                  edit(list.map((x, j) => (j === i ? { staffId: v, position: x.position || c?.position || '' } : x)));
                }}
              />
              <Input aria-label="Cargo" placeholder="Cargo, ej.: Director(a)" value={r.position} maxLength={120} onChange={(e): void => edit(list.map((x, j) => (j === i ? { ...x, position: e.target.value } : x)))} />
              <div className="flex gap-1">
                <button type="button" className="btn-alt size-10 p-0" disabled={i === 0} aria-label="Subir" onClick={(): void => move(i, -1)}>
                  <MorphIcon icon={ArrowUp} size={15} />
                </button>
                <button type="button" className="btn-alt size-10 p-0" disabled={i === list.length - 1} aria-label="Bajar" onClick={(): void => move(i, 1)}>
                  <MorphIcon icon={ArrowDown} size={15} />
                </button>
                <button type="button" className="btn-alt size-10 p-0" aria-label={`Quitar a ${candidates.find((c) => c.staffId === r.staffId)?.name ?? 'este firmante'}`} title="Quitar" onClick={(): void => edit(list.filter((_, j) => j !== i))}>
                  <MorphIcon icon={Trash2} size={15} />
                </button>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-alt" disabled={list.length >= MAX_SIGNERS} onClick={(): void => edit([...list, { staffId: '', position: '' }])}>
              <MorphIcon icon={UserPlus} size={16} />
              Agregar firmante
            </button>
            <span className="text-xs text-muted-foreground">
              {list.length} de {MAX_SIGNERS}
            </span>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
      )}
    </FormDialog>
  );
};
