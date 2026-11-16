'use client';

import type { JSX } from 'react';
import { Eye, FileSignature, PenLine } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { actCode, actStatusClass, actStatusLabels } from '../data/people-data';
import type { PlacementActCellProps } from '../types';

// The acta of a placement: its number and state, and what can be done (generate, sign, view)
export const PlacementActCell = ({ placement: p, canManage, busy, onGenerate, onSign, onView }: PlacementActCellProps): JSX.Element => {
  const button = 'inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium hover:border-brand/50 hover:text-brand disabled:opacity-50';
  if (!p.actVersionId) {
    return canManage ? (
      <button type="button" className={button} disabled={busy !== null} onClick={onGenerate}>
        <MorphIcon icon={FileSignature} size={13} />
        {busy === `generate:${p.id}` ? 'Generando…' : 'Generar acta'}
      </button>
    ) : (
      <span className="text-xs text-muted-foreground">Sin acta</span>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-foreground tabular-nums">{actCode(p.actYear, p.actNumber)}</span>
      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', actStatusClass[p.actStatus])}>{actStatusLabels[p.actStatus] ?? p.actStatus}</span>
      <button type="button" className={button} onClick={onView} aria-label={`Ver el acta de ${p.studentName}`}>
        <MorphIcon icon={Eye} size={13} />
        Ver
      </button>
      {p.actStatus === 'pending' && (
        <button type="button" className={button} disabled={busy !== null} onClick={onSign}>
          <MorphIcon icon={PenLine} size={13} />
          {busy === `sign:${p.id}` ? 'Firmando…' : 'Firmar'}
        </button>
      )}
    </div>
  );
};
