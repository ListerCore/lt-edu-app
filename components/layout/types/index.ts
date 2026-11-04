import type { ReactNode } from 'react';

export interface BrandMarkProps {
  className?: string;
}

export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export interface OfficeMapProps {
  className?: string;
  zoom?: number;
}
