'use client';

import type { JSX } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { cardFormats } from '../data/cards-data';
import type { CardSide, CardZoomDialogProps } from '../types';
import { IdCardSvg } from './id-card-svg';

const sides: Array<{ value: CardSide; label: string }> = [
  { value: 'front', label: 'Frontal' },
  { value: 'back', label: 'Posterior' },
];

// Full-size look at one face of the card; switch faces with the tabs or the arrow buttons (← → also work)
export const CardZoomDialog = ({ cardholder, issuer, format, side, onSideChange }: CardZoomDialogProps): JSX.Element => {
  const current = side ?? 'front';
  const other: CardSide = current === 'front' ? 'back' : 'front';
  const spec = cardFormats[format];

  return (
    <Dialog open={side !== null} onOpenChange={(open): void => onSideChange(open ? current : null)}>
      <DialogContent
        onKeyDown={(event): void => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') onSideChange(other);
        }}
        className={cn('gap-5 p-5 sm:p-7', format === 'carnet' ? 'sm:max-w-4xl' : 'sm:max-w-xl')}
      >
        <div className="pr-10">
          <DialogTitle className="text-base font-semibold">{cardholder.name}</DialogTitle>
          <DialogDescription className="mt-0.5 text-xs">
            {spec.label} · {spec.description}
          </DialogDescription>
        </div>

        <div className="relative flex items-center justify-center rounded-xl bg-surface bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-size-[16px_16px] px-12 py-8">
          <button type="button" aria-label={`Ver cara ${other === 'front' ? 'frontal' : 'posterior'}`} onClick={(): void => onSideChange(other)} className="absolute left-3 flex size-9 items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-colors hover:text-brand">
            <MorphIcon icon={ChevronLeft} size={18} />
          </button>
          <IdCardSvg key={`${current}-${cardholder.photoUrl ?? ''}`} cardholder={cardholder} issuer={issuer} format={format} side={current} idPrefix="zoom" className={cn('row-in h-auto drop-shadow-[0_24px_40px_rgb(43_33_27/0.3)]', format === 'carnet' ? 'w-full max-w-3xl' : 'h-[min(68svh,40rem)] w-auto')} />
          <button type="button" aria-label={`Ver cara ${other === 'front' ? 'frontal' : 'posterior'}`} onClick={(): void => onSideChange(other)} className="absolute right-3 flex size-9 items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-colors hover:text-brand">
            <MorphIcon icon={ChevronRight} size={18} />
          </button>
        </div>

        <div role="radiogroup" aria-label="Cara del carnet" className="mx-auto inline-flex rounded-full bg-surface p-1">
          {sides.map(({ value, label }): JSX.Element => (
            <button key={value} type="button" role="radio" aria-checked={current === value} onClick={(): void => onSideChange(value)} className={cn('rounded-full px-5 py-1.5 text-sm font-medium transition-colors', current === value ? 'bg-background text-brand shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
              {label}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
