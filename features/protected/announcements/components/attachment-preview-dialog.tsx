'use client';

import Image from 'next/image';
import type { JSX } from 'react';
import { Download, ExternalLink } from 'lucide';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MorphIcon } from '@/components/ui/morph-icon';
import { formatBytes } from '../data/announcements-data';
import type { AttachmentPreviewDialogProps } from '../types';

// Full preview of an attachment: the image at size, or the PDF in the browser's own viewer, with download
export const AttachmentPreviewDialog = ({ attachment, onClose }: AttachmentPreviewDialogProps): JSX.Element => (
  <Dialog open={attachment !== null} onOpenChange={(open): void => (open ? undefined : onClose())}>
    <DialogContent className="max-h-[94svh] gap-3 sm:max-w-4xl">
      {attachment && (
        <>
          <DialogHeader>
            <DialogTitle className="truncate pr-8">{attachment.fileName}</DialogTitle>
            <DialogDescription>
              {attachment.kind === 'image' ? 'Imagen' : 'Documento PDF'} · {formatBytes(attachment.sizeBytes)}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            {attachment.kind === 'image' ? (
              <div className="relative h-[70svh]">
                <Image src={attachment.url} alt={attachment.fileName} fill unoptimized sizes="90vw" className="object-contain" />
              </div>
            ) : (
              <iframe src={`${attachment.url}#view=FitH`} title={`Vista previa de ${attachment.fileName}`} className="h-[70svh] w-full bg-white" />
            )}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <a href={attachment.url} target="_blank" rel="noopener" className="btn-alt">
              <MorphIcon icon={ExternalLink} size={16} />
              Abrir en otra pestaña
            </a>
            <a href={attachment.url} download={attachment.fileName} className="btn-brand">
              <MorphIcon icon={Download} size={16} />
              Descargar
            </a>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
);
