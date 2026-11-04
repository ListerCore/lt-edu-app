'use client';

import Image from 'next/image';
import { useRef, type JSX } from 'react';
import { ImageUp, Trash2 } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { useFileDrop } from '@/hooks/use-file-drop';
import { cn } from '@/lib/utils';
import { IMAGE_TYPES } from '../data/announcements-data';
import type { AnnouncementImageDropzoneProps } from '../types';

// Cover image field: drag and drop an image or click to pick one; shows the preview with a remove button
export const AnnouncementImageDropzone = ({ imageUrl, error, disabled = false, onSelect, onRemove }: AnnouncementImageDropzoneProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDragging, dropHandlers } = useFileDrop(onSelect);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">
        Imagen <span className="font-normal text-muted-foreground">· opcional</span>
      </span>

      {imageUrl ? (
        <div {...dropHandlers} className={cn('group relative aspect-video overflow-hidden rounded-lg border bg-surface', isDragging ? 'border-brand ring-3 ring-brand/20' : 'border-border')}>
          <Image src={imageUrl} alt="Vista previa de la imagen" fill unoptimized className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-linear-to-t from-black/60 to-transparent p-3">
            <button type="button" disabled={disabled} onClick={(): void => inputRef.current?.click()} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-background/90 px-3 text-xs font-semibold text-foreground transition-colors hover:bg-background">
              <MorphIcon icon={ImageUp} size={14} />
              Cambiar
            </button>
            <button type="button" disabled={disabled} onClick={onRemove} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-background/90 px-3 text-xs font-semibold text-destructive transition-colors hover:bg-background">
              <MorphIcon icon={Trash2} size={14} />
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={(): void => inputRef.current?.click()}
          {...dropHandlers}
          aria-describedby={error ? 'announcement-image-error' : 'announcement-image-hint'}
          className={cn('flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-7 text-center transition-colors', isDragging ? 'border-brand bg-brand-soft' : error ? 'border-destructive/60' : 'border-border hover:border-brand hover:bg-surface')}
        >
          <span className={cn('flex size-10 items-center justify-center rounded-full transition-colors', isDragging ? 'bg-brand-solid text-white' : 'bg-brand-soft text-brand')}>
            <MorphIcon icon={ImageUp} size={18} />
          </span>
          <span className="text-sm font-medium text-foreground">{isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para elegirla'}</span>
          <span id="announcement-image-hint" className="text-xs text-muted-foreground">
            PNG, JPG o WebP · hasta 5 MB
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event): void => {
          const file = event.target.files?.item(0);
          if (file) onSelect(file);
          // Allows picking the same file again after removing it
          event.target.value = '';
        }}
      />

      {error && (
        <p id="announcement-image-error" role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
