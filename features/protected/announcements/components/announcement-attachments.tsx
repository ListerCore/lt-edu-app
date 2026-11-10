'use client';

import { useState, type JSX } from 'react';
import { cn } from '@/lib/utils';
import type { AnnouncementAttachment, AnnouncementAttachmentsProps } from '../types';
import { AttachmentPreviewDialog } from './attachment-preview-dialog';
import { AttachmentThumb } from './attachment-thumb';

// Thumbnails of an announcement's images and PDFs; clicking one opens its preview
export const AnnouncementAttachments = ({ attachments, skipCover = false, layout = 'strip' }: AnnouncementAttachmentsProps): JSX.Element | null => {
  const [open, setOpen] = useState<AnnouncementAttachment | null>(null);
  const coverId = skipCover ? attachments.find(({ kind }) => kind === 'image')?.id : undefined;
  const items = attachments.filter(({ id }) => id !== coverId);
  if (items.length === 0) return null;

  return (
    <>
      <ul aria-label="Archivos adjuntos" className={cn('grid gap-2', layout === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-4')}>
        {items.map((attachment): JSX.Element => (
          <li key={attachment.id}>
            <AttachmentThumb attachment={attachment} onOpen={(): void => setOpen(attachment)} />
          </li>
        ))}
      </ul>
      <AttachmentPreviewDialog attachment={open} onClose={(): void => setOpen(null)} />
    </>
  );
};
