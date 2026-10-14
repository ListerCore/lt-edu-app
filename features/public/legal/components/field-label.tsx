import type { JSX } from 'react';
import { Label } from '@/components/ui/label';
import type { FieldLabelProps } from '../types';

export const FieldLabel = ({ icon: Icon, label, children }: FieldLabelProps): JSX.Element => (
  <Label className="flex-col items-stretch gap-1.5 text-xs">
    <span className="inline-flex items-center gap-2"><Icon aria-hidden="true" className="size-3.5 text-secondary" />{label}</span>
    {children}
  </Label>
);
