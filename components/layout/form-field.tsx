import type { JSX } from 'react';
import { Label } from '@/components/ui/label';
import type { FormFieldProps } from './types';

// Label + control + hint/error wrapper; error text is linked to the control via `${id}-error`
export const FormField = ({ id, label, required = false, error, hint, children }: FormFieldProps): JSX.Element => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id} className="text-sm font-medium text-foreground">
      {label}
      {required && <span className="text-brand">*</span>}
    </Label>
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
        {error}
      </p>
    ) : (
      hint && <p className="text-xs text-muted-foreground">{hint}</p>
    )}
  </div>
);
