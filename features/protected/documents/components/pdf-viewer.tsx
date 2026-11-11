'use client';

import type { JSX } from 'react';
import { Download, ExternalLink } from 'lucide';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { MorphIcon } from '@/components/ui/morph-icon';
import type { OpenPdf } from '../lib/use-pdf';

// Shows a PDF the API built inside a large dialog, with its download at hand; phones that cannot show PDFs inline
// open it in a new tab
export const PdfViewer = ({ file, onClose }: { file: OpenPdf | null; onClose: () => void }): JSX.Element | null =>
  file && (
    <Dialog open onOpenChange={(open): void => (open ? undefined : onClose())}>
      <DialogContent className="flex h-[92svh] flex-col gap-3 p-3 sm:max-w-6xl sm:p-4">
        <div className="flex flex-wrap items-center gap-2 pr-10">
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate text-base font-semibold">{file.title}</DialogTitle>
            <DialogDescription className="truncate text-xs">{file.fileName}</DialogDescription>
          </div>
          <a href={file.url} target="_blank" rel="noopener" className="btn-alt h-8 px-2.5 text-xs">
            <MorphIcon icon={ExternalLink} size={14} />
            Abrir en otra pestaña
          </a>
          <a href={file.url} download={file.fileName} className="btn-brand h-8 px-2.5 text-xs">
            <MorphIcon icon={Download} size={14} />
            Descargar
          </a>
        </div>
        <iframe title={file.title} src={`${file.url}#view=FitH`} className="min-h-0 w-full flex-1 rounded-md bg-muted ring-1 ring-border" />
      </DialogContent>
    </Dialog>
  );
