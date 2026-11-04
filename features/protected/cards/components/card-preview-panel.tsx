'use client';

import { useRef, useState, type JSX } from 'react';
import { Camera, Download, LoaderCircle, Maximize2, Printer } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { useFileDrop } from '@/hooks/use-file-drop';
import { IMAGE_TYPES } from '@/features/protected/announcements/data/announcements-data';
import { cn } from '@/lib/utils';
import { useDownloadCard } from '../hooks/use-download-card';
import type { CardPreviewPanelProps, CardSide } from '../types';
import { CardFormatToggle } from './card-format-toggle';
import { CardZoomDialog } from './card-zoom-dialog';
import { IdCardSvg } from './id-card-svg';

// Preview of both faces with the format switch, photo upload (drop a photo on the card), PNG download and print
export const CardPreviewPanel = ({ cardholder, issuer, format, onFormatChange, onPrint, onPhotoSelect, photoError, isPhotoPending = false }: CardPreviewPanelProps): JSX.Element => {
  const frontRef = useRef<SVGSVGElement>(null);
  const backRef = useRef<SVGSVGElement>(null);
  const [zoomSide, setZoomSide] = useState<CardSide | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { download, isDownloading } = useDownloadCard();
  const { isDragging, dropHandlers } = useFileDrop((file: File): void => onPhotoSelect?.(file));
  const fileName = `${format}-${cardholder.code}`;
  const faceClassName = cn('row-in h-auto drop-shadow-[0_14px_24px_rgb(43_33_27/0.22)]', format === 'carnet' ? 'w-full max-w-sm' : 'w-full max-w-44');

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-background p-5">
      <CardFormatToggle value={format} onChange={onFormatChange} />
      <div {...(onPhotoSelect ? dropHandlers : {})} className={cn('relative grid gap-4 rounded-xl bg-surface bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-size-[14px_14px] p-5 transition-colors', format === 'fotocheck' && 'grid-cols-2', isDragging && 'bg-brand-soft ring-2 ring-brand')}>
        {(['front', 'back'] as const).map((side): JSX.Element => (
          <figure key={side} className="flex flex-col items-center gap-2">
            <button type="button" onClick={(): void => setZoomSide(side)} aria-label={`Ampliar cara ${side === 'front' ? 'frontal' : 'posterior'}`} className="group relative flex w-full cursor-zoom-in justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand">
              <IdCardSvg key={`${format}-${side}-${cardholder.id}-${cardholder.photoUrl ?? ''}`} cardholder={cardholder} issuer={issuer} format={format} side={side} idPrefix="preview" svgRef={side === 'front' ? frontRef : backRef} className={cn(faceClassName, 'transition-transform duration-200 group-hover:scale-[1.02]')} />
              <span aria-hidden="true" className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <MorphIcon icon={Maximize2} size={14} />
              </span>
            </button>
            <figcaption className="text-xs font-medium text-muted-foreground">{side === 'front' ? 'Frontal' : 'Posterior'}</figcaption>
          </figure>
        ))}
        {isDragging && <span className="absolute inset-x-0 bottom-3 text-center text-sm font-semibold text-brand">Suelta la foto para el carnet</span>}
      </div>

      {onPhotoSelect && (
        <div className="flex flex-col gap-1.5">
          <button type="button" disabled={isPhotoPending} onClick={(): void => inputRef.current?.click()} className="inline-flex items-center gap-2 self-start text-sm font-medium text-foreground transition-colors hover:text-brand">
            <MorphIcon icon={isPhotoPending ? LoaderCircle : Camera} size={16} className={cn('text-brand', isPhotoPending && 'animate-spin')} />
            {cardholder.photoUrl ? 'Cambiar foto' : 'Subir foto'}
            <span className="font-normal text-muted-foreground">· o arrástrala sobre el carnet</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_TYPES.join(',')}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event): void => {
              const file = event.target.files?.item(0);
              if (file) onPhotoSelect(file);
              event.target.value = '';
            }}
          />
          {photoError && (
            <p role="alert" className="text-xs text-destructive">
              {photoError}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button type="button" disabled={isDownloading} onClick={(): void => download([{ svg: frontRef.current, fileName: `${fileName}-frontal` }, { svg: backRef.current, fileName: `${fileName}-posterior` }])} className="btn-brand">
          <MorphIcon icon={isDownloading ? LoaderCircle : Download} size={16} className={isDownloading ? 'animate-spin' : ''} />
          Descargar
        </button>
        <button type="button" onClick={onPrint} className="btn-alt">
          <MorphIcon icon={Printer} size={16} />
          Imprimir
        </button>
      </div>
      <CardZoomDialog cardholder={cardholder} issuer={issuer} format={format} side={zoomSide} onSideChange={setZoomSide} />
      <p className="text-xs leading-5 text-muted-foreground">Haz clic en una cara para verla en grande. Se descargan dos PNG a 300 dpi (frontal y posterior). Imprimir arma una hoja de frontales y otra de posteriores para doble cara; también puedes guardarlo como PDF.</p>
    </div>
  );
};
