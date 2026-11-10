'use client';

import Image from 'next/image';
import { useRef, type JSX } from 'react';
import { FileText, Paperclip, Plus, X } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { PdfThumbnail } from '@/components/ui/pdf-thumbnail';
import { useFileDrop } from '@/hooks/use-file-drop';
import { cn } from '@/lib/utils';
import { ATTACHMENT_ACCEPT, formatBytes, MAX_ATTACHMENTS } from '../data/announcements-data';
import type { AnnouncementFilesDropzoneProps } from '../types';

const noop = (): void => undefined;

// Images and PDFs of a publication: drop or pick several; each one shows its thumbnail (the first page of a PDF,
// drawn in the browser) with a remove button. The first image becomes the cover
export const AnnouncementFilesDropzone = ({ kept = [], onRemoveKept, files, error, disabled = false, onAdd, onRemove }: AnnouncementFilesDropzoneProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDragging, dropHandlers } = useFileDrop(noop, onAdd);
  // The cover is the first image, stored ones first
  const coverKey = kept.find(({ kind }) => kind === 'image')?.id ?? files.find(({ kind }) => kind === 'image')?.key;
  const total = kept.length + files.length;
  const full = total >= MAX_ATTACHMENTS;

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-baseline justify-between gap-2 text-sm font-medium text-foreground">
        <span>
          Imágenes y PDF <span className="font-normal text-muted-foreground">· opcional</span>
        </span>
        {total > 0 && (
          <span className="text-xs font-normal text-muted-foreground tabular-nums">
            {total}/{MAX_ATTACHMENTS}
          </span>
        )}
      </span>

      {total > 0 && (
        <ul {...dropHandlers} aria-label="Archivos adjuntos" className={cn('grid grid-cols-3 gap-2 rounded-lg p-0.5 sm:grid-cols-4', isDragging && 'ring-3 ring-brand/30')}>
          {kept.map((stored): JSX.Element => (
            <li key={stored.id} className="group relative overflow-hidden rounded-lg border border-border bg-surface">
              <div className="relative aspect-[3/4]">
                {stored.kind === 'image' ? <Image src={stored.url} alt={`Vista previa de ${stored.fileName}`} fill unoptimized sizes="160px" className="object-cover" /> : <PdfThumbnail key={stored.id} source={stored.url} label={`Primera página de ${stored.fileName}`} className="h-full" />}
                {stored.id === coverKey && <span className="absolute top-1.5 left-1.5 pill bg-brand-solid px-1.5 text-[10px] font-semibold text-white">Portada</span>}
                {stored.kind === 'document' && (
                  <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    <MorphIcon icon={FileText} size={10} />
                    PDF
                  </span>
                )}
                {onRemoveKept && (
                  <button type="button" disabled={disabled} onClick={(): void => onRemoveKept(stored.id)} aria-label={`Quitar ${stored.fileName}`} className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background hover:text-destructive">
                    <MorphIcon icon={X} size={12} />
                  </button>
                )}
              </div>
              <p className="truncate border-t border-border px-2 py-1 text-[11px] text-foreground" title={stored.fileName}>
                {stored.fileName}
                <span className="block text-muted-foreground">{formatBytes(stored.sizeBytes)}</span>
              </p>
            </li>
          ))}
          {files.map((draft): JSX.Element => (
            <li key={draft.key} className="group relative overflow-hidden rounded-lg border border-border bg-surface">
              <div className="relative aspect-[3/4]">
                {draft.kind === 'image' && draft.previewUrl ? <Image src={draft.previewUrl} alt={`Vista previa de ${draft.file.name}`} fill unoptimized className="object-cover" /> : <PdfThumbnail key={draft.key} source={draft.file} label={`Primera página de ${draft.file.name}`} className="h-full" />}
                {draft.key === coverKey && <span className="absolute top-1.5 left-1.5 pill bg-brand-solid px-1.5 text-[10px] font-semibold text-white">Portada</span>}
                {draft.kind === 'document' && (
                  <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    <MorphIcon icon={FileText} size={10} />
                    PDF
                  </span>
                )}
                <button type="button" disabled={disabled} onClick={(): void => onRemove(draft.key)} aria-label={`Quitar ${draft.file.name}`} className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background hover:text-destructive">
                  <MorphIcon icon={X} size={12} />
                </button>
              </div>
              <p className="truncate border-t border-border px-2 py-1 text-[11px] text-foreground" title={draft.file.name}>
                {draft.file.name}
                <span className="block text-muted-foreground">{formatBytes(draft.file.size)}</span>
              </p>
            </li>
          ))}
          {!full && (
            <li>
              <button type="button" disabled={disabled} onClick={(): void => inputRef.current?.click()} className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border text-xs font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand">
                <MorphIcon icon={Plus} size={18} />
                Agregar
              </button>
            </li>
          )}
        </ul>
      )}

      {total === 0 && (
        <button
          type="button"
          disabled={disabled}
          onClick={(): void => inputRef.current?.click()}
          {...dropHandlers}
          aria-describedby={error ? 'announcement-files-error' : 'announcement-files-hint'}
          className={cn('flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-7 text-center transition-colors', isDragging ? 'border-brand bg-brand-soft' : error ? 'border-destructive/60' : 'border-border hover:border-brand hover:bg-surface')}
        >
          <span className={cn('flex size-10 items-center justify-center rounded-full transition-colors', isDragging ? 'bg-brand-solid text-white' : 'bg-brand-soft text-brand')}>
            <MorphIcon icon={Paperclip} size={18} />
          </span>
          <span className="text-sm font-medium text-foreground">{isDragging ? 'Suelta los archivos aquí' : 'Arrastra imágenes o PDF, o haz clic para elegirlos'}</span>
          <span id="announcement-files-hint" className="text-xs text-muted-foreground">
            Imágenes PNG, JPG o WebP hasta 5 MB · PDF hasta 10 MB · máximo {MAX_ATTACHMENTS} archivos
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ATTACHMENT_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event): void => {
          const picked = Array.from(event.target.files ?? []);
          if (picked.length > 0) onAdd(picked);
          // Allows picking the same file again after removing it
          event.target.value = '';
        }}
      />

      {error && (
        <p id="announcement-files-error" role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
