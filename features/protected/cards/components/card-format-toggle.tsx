import type { JSX } from 'react';
import { IdCard, RectangleVertical } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { cardFormats } from '../data/cards-data';
import type { CardFormat, CardFormatToggleProps } from '../types';

const icons: Record<CardFormat, typeof IdCard> = { carnet: IdCard, fotocheck: RectangleVertical };

// Carnet / Fotocheck switch with each format's physical size
export const CardFormatToggle = ({ value, onChange }: CardFormatToggleProps): JSX.Element => (
  <div role="radiogroup" aria-label="Formato" className="grid grid-cols-2 gap-2">
    {(Object.keys(cardFormats) as CardFormat[]).map((format): JSX.Element => {
      const active = value === format;
      return (
        <button key={format} type="button" role="radio" aria-checked={active} onClick={(): void => onChange(format)} className={cn('flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors', active ? 'border-brand bg-brand-soft' : 'border-border hover:border-brand/50')}>
          <MorphIcon icon={icons[format]} size={18} className={active ? 'text-brand' : 'text-muted-foreground'} />
          <span className="leading-tight">
            <span className={cn('block text-sm font-semibold', active ? 'text-brand' : 'text-foreground')}>{cardFormats[format].label}</span>
            <span className="block text-xs text-muted-foreground">{cardFormats[format].description}</span>
          </span>
        </button>
      );
    })}
  </div>
);
