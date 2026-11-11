import type { AcademicContext, Grade, Level, Period, Section, Settings, Term, Vocabulary } from '@/lib/api/grpc/gen/joseph/academic/v1/academic';

export type { AcademicContext, Grade, Level, Period, Section, Settings, Term, Vocabulary };

// Every academic call answers with this shape; fields maps form inputs to their error
export type AcademicResult<T> = { ok: true; data: T; message?: string } | { ok: false; message: string; fields?: Record<string, string> };

export interface StructureData {
  context: AcademicContext;
  levels: Level[];
}

export interface PeriodsData {
  context: AcademicContext;
  periods: Period[];
}

export interface PeriodDetailData {
  context: AcademicContext;
  period: Period;
  sections: Section[];
  levels: Level[];
  otherPeriods: Period[];
}

export interface LevelFormValues {
  name: string;
  code: string;
  description: string;
  formativeLevel: string;
  credits: string;
  attentionModes: string[];
  isActive: boolean;
}

export interface GradeFormValues {
  name: string;
  shortName: string;
  code: string;
}

export interface PeriodFormValues {
  name: string;
  season: string;
  startsOn: string;
  endsOn: string;
  termScheme: string;
}

export interface TermFormValues {
  name: string;
  startsOn: string;
  endsOn: string;
  status: string;
}

export interface SectionBatchValues {
  levelId: string;
  gradeIds: string[];
  names: string;
  shift: string;
  attentionMode: string;
  capacity: string;
  room: string;
}

export interface SectionFormValues {
  name: string;
  shift: string;
  attentionMode: string;
  capacity: string;
  room: string;
}

export interface SettingsFormValues {
  termScheme: string;
  passingGrade: string;
  conductGrade: boolean;
  attentionModes: string[];
  shifts: string[];
}

// Remote data in a hook: loading, the data once it arrives, and a way to reload it
export interface RemoteState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

// What a form hook gives its dialog
export interface FormState<V> {
  values: V;
  errors: Record<string, string>;
  isPending: boolean;
  setField: <K extends keyof V>(key: K, value: V[K]) => void;
  submit: () => void;
}
