'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { PdfDownload } from '../actions/document-actions';

// A blob URL for a file the API built (base64)
export const fileUrl = (f: PdfDownload): string => {
  const bytes = Uint8Array.from(atob(f.base64), (c) => c.charCodeAt(0));
  return URL.createObjectURL(new Blob([bytes], { type: f.mime ?? 'application/pdf' }));
};

// Saves a file the API built with its name
const saveFile = (f: PdfDownload): void => {
  const url = fileUrl(f);
  const a = document.createElement('a');
  a.href = url;
  a.download = f.fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Asks the API for a file (PDF, Excel) and downloads it; the flag says a document is being generated
export const usePdf = (): [boolean, (load: () => Promise<AcademicResult<PdfDownload>>) => void] => {
  const [isPending, startTransition] = useTransition();
  const run = (load: () => Promise<AcademicResult<PdfDownload>>): void =>
    startTransition(async () => {
      const r = await load();
      if (r.ok) saveFile(r.data);
      else sileo.error({ title: 'No se pudo generar el archivo', description: r.message });
    });
  return [isPending, run];
};

// A PDF opened in the viewer dialog
export interface OpenPdf {
  title: string;
  url: string;
  fileName: string;
}

// Asks the API for a PDF and shows it in a dialog instead of downloading it; the blob is freed on close
export const usePdfPreview = (): { isPending: boolean; file: OpenPdf | null; open: (title: string, load: () => Promise<AcademicResult<PdfDownload>>) => void; close: () => void } => {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<OpenPdf | null>(null);
  const current = useRef<string | null>(null);
  const close = useCallback((): void => {
    if (current.current) URL.revokeObjectURL(current.current);
    current.current = null;
    setFile(null);
  }, []);
  useEffect(() => close, [close]);
  const open = (title: string, load: () => Promise<AcademicResult<PdfDownload>>): void =>
    startTransition(async () => {
      const r = await load();
      if (!r.ok) {
        sileo.error({ title: 'No se pudo generar el PDF', description: r.message });
        return;
      }
      if (current.current) URL.revokeObjectURL(current.current);
      const url = fileUrl(r.data);
      current.current = url;
      setFile({ title, url, fileName: r.data.fileName });
    });
  return { isPending, file, open, close };
};
