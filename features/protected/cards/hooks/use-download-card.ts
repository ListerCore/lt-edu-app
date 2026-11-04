'use client';

import { useCallback, useState } from 'react';
import { sileo } from 'sileo';
import { CARD_EXPORT_DPI } from '../data/cards-data';
import type { CardExportItem, UseDownloadCardResult } from '../types';

const MM_PER_INCH = 25.4;

// An SVG drawn as an image cannot load external files, so every <image> is inlined as a data URL first
const inlineImages = async (svg: SVGSVGElement): Promise<void> => {
  const images = Array.from(svg.querySelectorAll('image'));
  await Promise.all(
    images.map(async (image) => {
      const href = image.getAttribute('href');
      if (!href || href.startsWith('data:')) return;
      const blob = await (await fetch(href)).blob();
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (): void => resolve(String(reader.result));
        reader.readAsDataURL(blob);
      });
      image.setAttribute('href', dataUrl);
    }),
  );
};

// Rasterizes one card face (SVG sized in mm) to a PNG at 300 dpi and triggers its download
const exportPng = async ({ svg, fileName }: CardExportItem): Promise<void> => {
  if (!svg) throw new Error('svg');
  const clone = svg.cloneNode(true) as SVGSVGElement;
  await inlineImages(clone);
  const [, , widthMm, heightMm] = (clone.getAttribute('viewBox') ?? '0 0 0 0').split(' ').map(Number);
  const width = Math.round((widthMm / MM_PER_INCH) * CARD_EXPORT_DPI);
  const height = Math.round((heightMm / MM_PER_INCH) * CARD_EXPORT_DPI);
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = (): void => resolve();
    image.onerror = (): void => reject(new Error('svg'));
    image.src = url;
  });
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);
  URL.revokeObjectURL(url);
  const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!png) throw new Error('png');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(png);
  link.download = `${fileName}.png`;
  link.click();
  URL.revokeObjectURL(link.href);
};

// Downloads every face given (front and back) as PNGs at 300 dpi, one after the other
export const useDownloadCard = (): UseDownloadCardResult => {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = useCallback((items: CardExportItem[]): void => {
    setIsDownloading(true);
    void (async (): Promise<void> => {
      try {
        for (const item of items) await exportPng(item);
        sileo.success({ title: 'Carnet descargado', description: `${items.length === 2 ? 'Frontal y posterior' : 'Carnet'} en PNG a ${CARD_EXPORT_DPI} dpi, listos para imprimir.` });
      } catch {
        sileo.error({ title: 'No se descargó el carnet', description: 'Vuelve a intentarlo; si sigue fallando, usa Imprimir.' });
      } finally {
        setIsDownloading(false);
      }
    })();
  }, []);

  return { download, isDownloading };
};
