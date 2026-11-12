'use client';

import type { JSX } from 'react';
import { Megaphone } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Switch } from '@/components/ui/switch';
import type { NotifyToggleProps } from '../types';

// The "notify the families" switch every APAFA dialog ends with: it publishes a notice in Comunicados
export const ApafaNotifyToggle = ({ id, label, hint, checked, disabled, onChange }: NotifyToggleProps): JSX.Element => (
  <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-secondary/40 px-4 py-3">
    <div className="min-w-0">
      <p id={id} className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <MorphIcon icon={Megaphone} size={15} className="text-brand" />
        {label}
      </p>
      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{hint}</p>
    </div>
    <Switch checked={checked} disabled={disabled} onCheckedChange={onChange} aria-labelledby={id} />
  </div>
);
