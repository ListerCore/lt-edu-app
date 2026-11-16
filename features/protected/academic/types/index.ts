import type { AcademicContext, Grade, Level, Period, Section, Settings, Term, Vocabulary } from '@/lib/api/grpc/gen/joseph/academic/v1/academic';
import type { Competency, Curriculum, Module, Subject } from '@/lib/api/grpc/gen/joseph/academic/v1/curriculum';

export type { AcademicContext, Competency, Curriculum, Grade, Level, Module, Period, Section, Settings, Subject, Term, Vocabulary };

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
  // EBA only: pebaja | literacy, and virtual | itinerant for the distance form
  program: string;
  distanceVariant: string;
  // EBA only: one section gathers several grades of the cycle
  multigrade: boolean;
  capacity: string;
  room: string;
}

// The EBA fields both section forms share
export interface EbaSectionValues {
  attentionMode: string;
  program: string;
  distanceVariant: string;
  multigrade: boolean;
}

export interface EbaSectionFieldsProps<V extends EbaSectionValues> {
  idPrefix: string;
  levelModes: string[];
  // How many grades the cycle has: multigrade needs two or more
  gradeCount: number;
  values: V;
  errors: Partial<Record<string, string>>;
  setField: <K extends keyof V>(field: K, value: V[K]) => void;
}

export interface SectionFormValues {
  name: string;
  shift: string;
  attentionMode: string;
  program: string;
  distanceVariant: string;
  multigrade: boolean;
  capacity: string;
  room: string;
}

export interface SettingsFormValues {
  termScheme: string;
  passingGrade: string;
  conductGrade: boolean;
  attentionModes: string[];
  shifts: string[];
  weekDays: string[];
  lateAfterMinutes: string;
  absenceLimitPercent: string;
  // Official data printed on the report card; logo is an image data URL ("" removes it)
  dre: string;
  ugel: string;
  modularCode: string;
  logo: string;
  // Tipo de gestión: public | private
  management: string;
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

export interface CurriculaData {
  context: AcademicContext;
  levels: Level[];
  curricula: Curriculum[];
  templateLevelIds: string[];
}

export interface CurriculumData {
  context: AcademicContext;
  curriculum: Curriculum;
  level: Level;
}

export interface NewCurriculumValues {
  levelId: string;
  name: string;
  fromTemplate: boolean;
}

export interface PlanValues {
  name: string;
  notes: string;
}

export interface ModuleFormValues {
  name: string;
  code: string;
  description: string;
}

export interface SubjectFormValues {
  kind: string;
  component: string;
  name: string;
  code: string;
  description: string;
  weeklyHours: string;
  theoryCredits: string;
  practiceCredits: string;
  gradeIds: string[];
  moduleId: string;
}

export interface CompetencyFormValues {
  code: string;
  name: string;
}
