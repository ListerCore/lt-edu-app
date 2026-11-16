'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { signVersionAction } from '@/features/protected/documents/actions/document-actions';
import { usePdfPreview } from '@/features/protected/documents/lib/use-pdf';
import { generateRecordActAction } from '../actions/generate-record-act';
import { recordActPdfAction } from '../actions/record-act-pdf';
import type { RecordInfo } from '../types';

// The signed version of an acta: generate it, sign it as the viewer and open its PDF; busy names the action running
export const useRecordAct = (
  slug: string,
  onChange: () => void,
): { generate: (r: RecordInfo) => void; sign: (r: RecordInfo) => void; view: (r: RecordInfo) => void; busy: string | null; preview: ReturnType<typeof usePdfPreview> } => {
  const [busy, setBusy] = useState<string | null>(null);
  const preview = usePdfPreview();
  const run = (key: string, task: () => Promise<unknown>): void => {
    setBusy(key);
    void task().finally((): void => setBusy(null));
  };
  return {
    generate: (r): void =>
      run('generate', async () => {
        const res = await runAcademicAction(generateRecordActAction(slug, r.id, ''));
        if (res.ok) onChange();
      }),
    sign: (r): void =>
      run('sign', async () => {
        const res = await runAcademicAction(signVersionAction(slug, r.actVersionId), 'Firmaste el acta.');
        if (res.ok) onChange();
      }),
    view: (r): void => preview.open(`Acta ${r.code}`, () => recordActPdfAction(slug, r.id)),
    busy,
    preview,
  };
};
