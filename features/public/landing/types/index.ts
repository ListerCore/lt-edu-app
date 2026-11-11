import type { IconInput } from 'morphicons/react';

// What the hero ID card prints
export interface IdCardSample {
  name: string;
  detail: string;
  code: string;
  role: string;
}

export interface IdCardProps {
  card: IdCardSample;
  className?: string;
}

// One check-in of the hero attendance log
export interface CheckIn {
  time: string;
  name: string;
  section: string;
  status: 'on-time' | 'late';
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
