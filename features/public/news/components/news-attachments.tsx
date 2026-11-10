'use client';

import { useState, type JSX } from 'react';
import { Download, Eye, FileText, Images } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { PdfThumbnail } from '@/components/ui/pdf-thumbnail';
import { AttachmentPreviewDialog } from '@/features/protected/announcements/components/attachment-preview-dialog';
import { AttachmentThumb } from '@/features/protected/announcements/components/attachment-thumb';
import { formatBytes } from '@/features/protected/announcements/data/announcements-data';
import type { AnnouncementAttachment } from '@/features/protected/announcements/types';

interface NewsAttachmentsProps {
  // Everything but the cover, in order
  attachments: AnnouncementAttachment[];
}

// Detail page: the images as a gallery and each PDF with its first page, a preview and a download
export const NewsAttachments = ({ attachments }: NewsAttachmentsProps): JSX.Element | null => {
  const [open, setOpen] = useState<AnnouncementAttachment | null>(null);
  const images = attachments.filter(({ kind }) => kind === 'image');
  const documents = attachments.filter(({ kind }) => kind === 'document');
  if (attachments.length === 0) return null;

  return (
    <div className="space-y-10">
      {documents.length > 0 && (
        <section aria-labelledby="news-documents">
          <h2 id="news-documents" className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <MorphIcon icon={FileText} size={18} className="text-brand" />
            Documentos
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {documents.map((doc): JSX.Element => (
              <li key={doc.id} className="flex gap-4 rounded-xl border border-border bg-background p-3">
                <button type="button" onClick={(): void => setOpen(doc)} aria-label={`Ver ${doc.fileName}`} className="w-24 shrink-0 overflow-hidden rounded-md border border-border transition-colors hover:border-brand/60">
                  <PdfThumbnail key={doc.id} source={doc.url} label={`Primera página de ${doc.fileName}`} />
                </button>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-sm font-medium break-words text-foreground">{doc.fileName}</p>
                  <p className="text-xs text-muted-foreground">PDF · {formatBytes(doc.sizeBytes)}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-3">
                    <button type="button" onClick={(): void => setOpen(doc)} className="btn-alt h-8 px-3 text-xs">
                      <MorphIcon icon={Eye} size={14} />
                      Ver
                    </button>
                    <a href={doc.url} download={doc.fileName} className="btn-alt h-8 px-3 text-xs">
                      <MorphIcon icon={Download} size={14} />
                      Descargar
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {images.length > 0 && (
        <section aria-labelledby="news-images">
          <h2 id="news-images" className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <MorphIcon icon={Images} size={18} className="text-brand" />
            Imágenes
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image): JSX.Element => (
              <li key={image.id}>
                <AttachmentThumb attachment={image} onOpen={(): void => setOpen(image)} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <AttachmentPreviewDialog attachment={open} onClose={(): void => setOpen(null)} />
    </div>
  );
};
