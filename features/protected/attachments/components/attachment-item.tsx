'use client';

import type { JSX } from 'react';
import { Download, ExternalLink, LoaderCircle, Trash2 } from 'lucide';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { fileKindMeta } from '../data/attachments-data';
import type { AttachmentItemProps } from '../types';

const actionClassName = 'inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none';

// One stored file: type icon, name (or title), category, size, who uploaded it and when; open, download and delete
export const AttachmentItem = ({ attachment, variant, editable, isDeleting, onDelete }: AttachmentItemProps): JSX.Element => {
  const meta = fileKindMeta[attachment.fileKind];
  const compact = variant === 'compact';
  const heading = attachment.title || attachment.fileName;

  return (
    <li className={cn('flex items-center gap-3', compact ? 'px-3 py-2.5' : 'px-4 py-3', isDeleting && 'opacity-60')}>
      <span className={cn('flex shrink-0 items-center justify-center rounded-lg', compact ? 'size-8' : 'size-10', meta.className)} aria-hidden="true">
        <MorphIcon icon={meta.icon} size={compact ? 15 : 18} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <p className="min-w-0 truncate text-sm font-medium text-foreground" title={attachment.fileName}>
            {heading}
          </p>
          <span className="pill bg-secondary px-2 text-[11px] text-secondary-foreground">{attachment.categoryLabel}</span>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {attachment.title && <span className="text-foreground/80">{attachment.fileName} · </span>}
          {meta.label} · {attachment.sizeLabel}
          {!compact && attachment.uploadedName && ` · ${attachment.uploadedName}`} · <time dateTime={attachment.createdAt}>{attachment.createdLabel}</time>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        {attachment.canPreview && (
          <a href={attachment.url} target="_blank" rel="noopener noreferrer" aria-label={`Ver ${attachment.fileName}`} title="Ver" className={actionClassName}>
            <MorphIcon icon={ExternalLink} size={15} />
          </a>
        )}
        <a href={attachment.url} download={attachment.fileName} aria-label={`Descargar ${attachment.fileName}`} title="Descargar" className={actionClassName}>
          <MorphIcon icon={Download} size={15} />
        </a>
        {editable && attachment.canDelete && (
          <AlertDialog>
            <AlertDialogTrigger render={<button type="button" disabled={isDeleting} aria-label={`Eliminar ${attachment.fileName}`} title="Eliminar" className={cn(actionClassName, 'hover:bg-destructive/10 hover:text-destructive')} />}>
              <MorphIcon icon={isDeleting ? LoaderCircle : Trash2} size={15} className={isDeleting ? 'animate-spin' : ''} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar este archivo?</AlertDialogTitle>
                <AlertDialogDescription>Se elimina «{attachment.fileName}» de forma permanente. No se puede deshacer.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={(): void => onDelete(attachment)}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </li>
  );
};
