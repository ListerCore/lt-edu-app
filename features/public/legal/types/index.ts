import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface LegalPageSection {
  id: string;
  title: string;
}

export interface LegalPageProps {
  eyebrow: string;
  title: string;
  summary: string;
  tags?: string[];
  sections?: LegalPageSection[];
  icon?: LucideIcon;
  children: ReactNode;
}

export interface LegalSectionHeadingProps {
  icon: LucideIcon;
  title: string;
  number?: string;
}

export interface FieldLabelProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}
