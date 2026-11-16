'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { signVersionAction } from '@/features/protected/documents/actions/document-actions';
import { usePdfPreview } from '@/features/protected/documents/lib/use-pdf';
import { isPeopleEvent } from '@/hooks/use-live';
import { certificatePdfAction } from '../actions/certificate-pdf';
import { getStudentCertificatesAction } from '../actions/get-student-certificates';
import type { RemoteState } from '@/features/protected/academic/types';
import type { CertificateBoard, StudentCertificate } from '../types';

export interface CertificatesState {
  board: RemoteState<CertificateBoard>;
  preview: ReturnType<typeof usePdfPreview>;
  busy: string | null;
  sign: (c: StudentCertificate) => void;
  view: (c: StudentCertificate) => void;
}

// A student's constancias: the board, signing one as the viewer and opening its PDF; busy names the one being signed
export const useCertificates = (slug: string, studentId: string): CertificatesState => {
  const board = useAcademicData(`certificates:${slug}:${studentId}`, () => getStudentCertificatesAction(slug, studentId), isPeopleEvent);
  const preview = usePdfPreview();
  const [busy, setBusy] = useState<string | null>(null);
  const sign = (c: StudentCertificate): void => {
    setBusy(c.id);
    void runAcademicAction(signVersionAction(slug, c.versionId), 'Firmaste la constancia.')
      .then((r) => r.ok && board.reload())
      .finally((): void => setBusy(null));
  };
  const view = (c: StudentCertificate): void => preview.open(`${c.code} · ${c.studentName}`, () => certificatePdfAction(slug, c.id));
  return { board, preview, busy, sign, view };
};
