import type { IconInput } from 'morphicons/react';

// One headline fact under the hero pitch
export interface HeroFact {
  value: string;
  label: string;
}

// Preview rows of a module: a label, its value and an optional tone for the value
export interface ModuleRow {
  label: string;
  detail: string;
  value: string;
  tone?: 'success' | 'warning' | 'brand' | 'muted';
}

// One area of the system, as listed in the panel sidebar
export interface PlatformModule {
  id: string;
  icon: IconInput;
  name: string;
  summary: string;
  features: string[];
  preview: { title: string; caption: string; rows: ModuleRow[] };
}

export interface RoleAccess {
  icon: IconInput;
  title: string;
  description: string;
  items: string[];
}

// How the panel names things for each kind of institution (from the dashboard navigation)
export interface InstitutionVocabulary {
  type: string;
  name: string;
  levels: string;
  periods: string;
  courses: string;
}

export interface SecurityPoint {
  icon: IconInput;
  title: string;
  description: string;
}
