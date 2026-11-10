'use client';

import { useEffect, useEffectEvent, useRef, useState, type JSX } from 'react';
import { FileText } from 'lucide';
import { cn } from '@/lib/utils';
import { MorphIcon } from './morph-icon';

type PdfJs = typeof import('pdfjs-dist');

// pdf.js is heavy: loaded on first use, with its worker bundled next to it
let pdfjsPromise: Promise<PdfJs> | null = null;
const loadPdfJs = (): Promise<PdfJs> =>
  (pdfjsPromise ??= import('pdfjs-dist').then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerPort ??= new Worker(new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url), { type: 'module' });
    return pdfjs;
  }));

interface PdfThumbnailProps {
  // The PDF: a picked File/Blob, or the URL it is served from
  source: Blob | string | null;
  // Accessible name of the preview
  label: string;
  className?: string;
  // Called once the document is read, with its page count
  onPages?: (pages: number) => void;
}

// First page of a PDF drawn on a canvas, in the browser. Give it a key per file: a new source starts fresh
export const PdfThumbnail = ({ source, label, className, onPages }: PdfThumbnailProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const reportPages = useEffectEvent((pages: number): void => onPages?.(pages));

  useEffect(() => {
    if (!source) return;
    let cancelled = false;
    let destroy: (() => void) | undefined;

    void (async (): Promise<void> => {
      try {
        const blob = typeof source === 'string' ? await (await fetch(source)).blob() : source;
        const pdfjs = await loadPdfJs();
        const task = pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) });
        destroy = (): void => void task.destroy();
        const pdf = await task.promise;
        if (cancelled) return;
        reportPages(pdf.numPages);
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        if (cancelled || !canvas) return;
        // Sharp on retina: drawn at the device pixel ratio and scaled down by CSS
        const width = canvas.parentElement?.clientWidth || 240;
        const scale = (width / page.getViewport({ scale: 1 }).width) * Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        await page.render({ canvas, viewport }).promise;
        if (!cancelled) setState('ready');
      } catch {
        if (!cancelled) setState('error');
      }
    })();

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [source]);

  return (
    <div role="img" aria-label={label} className={cn('relative aspect-[1/1.414] w-full overflow-hidden bg-white', className)}>
      <canvas ref={canvasRef} aria-hidden="true" className={cn('size-full object-contain object-top transition-opacity duration-300', state === 'ready' ? 'opacity-100' : 'opacity-0')} />
      {state !== 'ready' && <span className="absolute inset-0 flex items-center justify-center bg-surface text-muted-foreground">{state === 'loading' ? <span className="size-full animate-pulse bg-muted" /> : <MorphIcon icon={FileText} size={28} />}</span>}
    </div>
  );
};
