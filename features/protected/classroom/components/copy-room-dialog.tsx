'use client';

import type { JSX } from 'react';
import { Copy } from 'lucide';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MorphIcon } from '@/components/ui/morph-icon';
import { SelectField } from '@/features/protected/academic/components/academic-ui';
import { useCopyRoom } from '../hooks/use-copy-room';
import type { CopyRoomDialogProps } from '../types';

// Reuse the units of the same area from another period; only into an empty room
export const CopyRoomDialog = ({ room, onClose, onCopied }: CopyRoomDialogProps): JSX.Element => {
  const copy = useCopyRoom({
    room,
    onCopied: (): void => {
      onCopied();
      onClose();
    },
  });
  return (
    <Dialog open onOpenChange={(open): void => (open ? undefined : onClose())}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Copiar material de otro periodo</DialogTitle>
          <DialogDescription>Se copian las unidades y el material de {room.subjectName}. Los archivos propios no se copian; los recursos de la biblioteca sí.</DialogDescription>
        </DialogHeader>
        {copy.periods.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay otros periodos de donde copiar.</p>
        ) : (
          <>
            <SelectField id="copy-period" value={copy.periodId} options={copy.periods.map((p) => ({ value: p.id, label: p.name }))} onChange={copy.setPeriodId} />
            <ul className="divide-y divide-border">
              {copy.isLoading ? (
                <li className="py-4 text-sm text-muted-foreground">Cargando…</li>
              ) : copy.sources.length === 0 ? (
                <li className="py-4 text-sm text-muted-foreground">En ese periodo no hay aulas de {room.subjectName} con material.</li>
              ) : (
                copy.sources.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {r.subjectName} · {r.gradeName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.units} unidades · {r.items} materiales{r.staffName && ` · ${r.staffName}`}
                      </p>
                    </div>
                    <button type="button" className="btn-alt h-8 px-3 text-xs" disabled={copy.isCopying} onClick={(): void => copy.copy(r.id)}>
                      <MorphIcon icon={Copy} size={14} />
                      Copiar
                    </button>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
