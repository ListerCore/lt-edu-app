'use client';

import Image from 'next/image';
import type { JSX } from 'react';
import { FileText } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { PdfThumbnail } from '@/components/ui/pdf-thumbnail';
import { cn } from '@/lib/utils';
import { formatBytes } from '../data/announcements-data';
import type { AttachmentThumbProps } from '../types';

// Thumbnail of a stored attachment (image, or the first page of a PDF); opens the preview
export const AttachmentThumb = ({ attachment, onOpen, className }: AttachmentThumbProps): JSX.Element => (
  <button type="button" onClick={onOpen} aria-label={`Ver ${attachment.fileName}`} className={cn('group relative block w-full overflow-hidden rounded-lg border border-border bg-surface text-left transition-colors hover:border-brand/60', className)}>
    <div className="relative aspect-[3/4] overflow-hidden">
      {attachment.kind === 'image' ? <Image src={attachment.url} alt="" fill unoptimized sizes="160px" className="object-cover transition-transform duration-300 group-hover:scale-105" /> : <PdfThumbnail key={attachment.id} source={attachment.url} label={`Primera página de ${attachment.fileName}`} className="h-full" />}
      {attachment.kind === 'document' && (
        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          <MorphIcon icon={FileText} size={10} />
          PDF
        </span>
      )}
    </div>
    <span className="block truncate border-t border-border px-2 py-1 text-[11px] text-foreground">
      {attachment.fileName}
      <span className="block text-muted-foreground">{formatBytes(attachment.sizeBytes)}</span>
    </span>
  </button>
);
