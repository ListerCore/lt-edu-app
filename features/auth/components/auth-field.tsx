import type { JSX } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AuthFieldProps } from '../types';

export const AuthField = ({ id, label, icon: Icon, type = 'text', placeholder, autoComplete, inputMode, maxLength, value, onChange, trailingAction, required = true }: AuthFieldProps): JSX.Element => (
  <div className="grid gap-2">
    <Label htmlFor={id} className="flex items-center gap-2 text-xs font-semibold text-foreground">
      <Icon aria-hidden="true" className="size-3.5 text-secondary" />
      {label}
    </Label>
    <div className="relative">
      <Input id={id} name={id} type={type} placeholder={placeholder} autoComplete={autoComplete} inputMode={inputMode} maxLength={maxLength} value={value} onChange={onChange} required={required} className={`h-11 rounded-md border-border bg-background px-3 text-sm placeholder:text-muted-foreground/75 ${trailingAction ? 'pr-12' : ''}`} />
      {trailingAction && <div className="absolute inset-y-0 right-1 flex items-center">{trailingAction}</div>}
    </div>
  </div>
);
