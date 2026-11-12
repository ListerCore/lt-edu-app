'use client';

import { useState, type JSX } from 'react';
import { Paperclip } from 'lucide';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { useAttachmentsAccess } from '../hooks/use-attachments-access';
import type { AttachmentsButtonProps } from '../types';
import { AttachmentsPanel } from './attachments-panel';

// "Adjuntos" button for a row or a card (an interview, a fault, a session...). Opens the files of that record in a
// dialog, so a long list only fetches the files someone asks for. Hidden without view permission on the module
export const AttachmentsButton = ({ ownerKind, ownerId, module, title = 'Archivos adjuntos', description, categories, readOnly, label = 'Adjuntos', iconOnly = false, className }: AttachmentsButtonProps): JSX.Element | null => {
  const allowed = useAttachmentsAccess({ ownerKind, module });
  const [open, setOpen] = useState(false);
  if (!allowed) return null;
  return (
    <>
      {iconOnly ? (
        <button type="button" className={cn('inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground', className)} onClick={(): void => setOpen(true)} aria-haspopup="dialog" aria-label={label} title={label}>
          <MorphIcon icon={Paperclip} size={15} />
        </button>
      ) : (
        <button type="button" className={cn('btn-alt h-8 px-3 text-xs', className)} onClick={(): void => setOpen(true)} aria-haspopup="dialog">
          <MorphIcon icon={Paperclip} size={14} />
          {label}
        </button>
      )}
      {open && (
        <Dialog open onOpenChange={(next): void => setOpen(next)}>
          <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
            <AttachmentsPanel ownerKind={ownerKind} ownerId={ownerId} module={module} title="Archivos" categories={categories} readOnly={readOnly} variant="compact" forbiddenNote="Tu rol no puede ver los archivos de este registro." />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
