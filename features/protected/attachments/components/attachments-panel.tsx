'use client';

import { useId, type JSX } from 'react';
import { CircleAlert, Paperclip, RotateCw } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAttachmentsPanel } from '../hooks/use-attachments-panel';
import type { AttachmentsPanelProps } from '../types';
import { AttachmentItem } from './attachment-item';
import { AttachmentUploader } from './attachment-uploader';

// Reusable files card for any record (enrollment, student, staff, period, acta...). Lists the files, lets people
// whose role may change the record upload and delete them, and adapts to dialogs with variant="compact"
export const AttachmentsPanel = ({ ownerKind, ownerId, module, title = 'Archivos adjuntos', description, categories, readOnly = false, variant = 'default', className, forbiddenNote }: AttachmentsPanelProps): JSX.Element | null => {
  const panel = useAttachmentsPanel({ ownerKind, ownerId, module, categories, readOnly });
  const headingId = useId();
  const inputId = useId();
  if (!panel.visible) return null;
  // The role opens the page but not these files: nothing to show, unless a dialog was opened on purpose
  if (panel.forbidden) return forbiddenNote ? <p className={cn('text-sm text-muted-foreground', className)}>{forbiddenNote}</p> : null;

  const compact = variant === 'compact';
  const count = panel.attachments.length;

  return (
    <section aria-labelledby={headingId} aria-busy={panel.isLoading} className={cn('flex flex-col', compact ? 'gap-3' : 'gap-4 rounded-2xl border border-border bg-background p-5', className)}>
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {!compact && (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand" aria-hidden="true">
              <MorphIcon icon={Paperclip} size={16} />
            </span>
          )}
          <div className="min-w-0">
            <h2 id={headingId} className={cn('font-semibold text-foreground', compact ? 'text-sm' : 'text-base')}>
              {title}
            </h2>
            {description && !compact && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {!panel.isLoading && !panel.loadError && (
          <span className="shrink-0 pt-0.5 text-xs text-muted-foreground tabular-nums" aria-label={`${count} de ${panel.maxFiles} archivos`}>
            {count}/{panel.maxFiles}
          </span>
        )}
      </header>

      {panel.isLoading && (
        <div className="flex flex-col gap-2" aria-label="Cargando archivos">
          {[0, 1].map((row): JSX.Element => (
            <div key={row} className="flex items-center gap-3">
              <Skeleton className={cn('shrink-0 rounded-lg', compact ? 'size-8' : 'size-10')} />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {panel.loadError && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-destructive/8 px-4 py-3 text-sm text-destructive">
          <span className="flex items-center gap-2">
            <MorphIcon icon={CircleAlert} size={15} />
            {panel.loadError}
          </span>
          <button type="button" onClick={panel.reload} className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline">
            <MorphIcon icon={RotateCw} size={13} />
            Reintentar
          </button>
        </div>
      )}

      {!panel.isLoading && !panel.loadError && (
        <>
          {count > 0 ? (
            <ul aria-label={title} className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              {panel.attachments.map((attachment): JSX.Element => (
                <AttachmentItem key={attachment.id} attachment={attachment} variant={variant} editable={panel.editable} isDeleting={panel.deletingId === attachment.id} onDelete={panel.remove} />
              ))}
            </ul>
          ) : (
            !panel.editable && <p className={cn('rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground', compact ? 'px-4 py-5' : 'px-6 py-8')}>Aún no hay archivos adjuntos.</p>
          )}

          {panel.editable &&
            (panel.full ? (
              <p className="text-xs text-muted-foreground">Este registro llegó al máximo de {panel.maxFiles} archivos. Elimina alguno para subir otro.</p>
            ) : (
              <AttachmentUploader
                variant={variant}
                inputId={inputId}
                staged={panel.staged}
                stageError={panel.stageError}
                categories={panel.categories}
                category={panel.category}
                title={panel.title}
                isUploading={panel.isUploading}
                canSubmit={panel.canSubmit}
                remaining={panel.maxFiles - count}
                onAdd={panel.addFiles}
                onUnstage={panel.unstage}
                onClear={panel.clearStaged}
                onCategory={panel.setCategory}
                onTitle={panel.setTitle}
                onSubmit={panel.submit}
              />
            ))}
        </>
      )}
    </section>
  );
};
