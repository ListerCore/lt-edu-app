'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { signVersionAction } from '@/features/protected/documents/actions/document-actions';
import { usePdfPreview } from '@/features/protected/documents/lib/use-pdf';
import { generatePlacementActAction } from '../actions/generate-placement-act';
import { placementActPdfAction } from '../actions/placement-act-pdf';
import type { Placement } from '../types';

// The acta of a placement: generate a version, sign it as the viewer, and open its PDF; busy names the action running
export const usePlacementAct = (
  slug: string,
  onChange: () => void,
): { generate: (p: Placement) => void; sign: (p: Placement) => void; view: (p: Placement) => void; busy: string | null; preview: ReturnType<typeof usePdfPreview> } => {
  const [busy, setBusy] = useState<string | null>(null);
  const preview = usePdfPreview();
  const run = (key: string, task: () => Promise<unknown>): void => {
    setBusy(key);
    void task().finally((): void => setBusy(null));
  };
  return {
    generate: (p: Placement): void =>
      run(`generate:${p.id}`, async () => {
        const r = await runAcademicAction(generatePlacementActAction(slug, p.id, ''));
        if (r.ok) onChange();
      }),
    sign: (p: Placement): void =>
      run(`sign:${p.id}`, async () => {
        const r = await runAcademicAction(signVersionAction(slug, p.actVersionId), 'Firmaste el acta.');
        if (r.ok) onChange();
      }),
    view: (p: Placement): void => preview.open(`Acta ${p.studentName}`, () => placementActPdfAction(slug, p.id)),
    busy,
    preview,
  };
};
