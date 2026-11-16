import type { AcademicContext, Level, Period, Section } from '@/lib/api/grpc/gen/joseph/academic/v1/academic';
import type { RemoteState } from '@/features/protected/academic/types';
import type { Subject } from '@/lib/api/grpc/gen/joseph/academic/v1/curriculum';
import type { Enrollment, EnrollmentFile, Guardian, Placement, RollFilter, RollRow, SectionOccupancy, Student, StudentDetail } from '@/lib/api/grpc/gen/joseph/people/v1/people';

export type { AcademicContext, Enrollment, EnrollmentFile, Guardian, Level, Period, Placement, RollFilter, RollRow, Section, SectionOccupancy, Student, StudentDetail, Subject };

export interface PeopleContextData {
  context: AcademicContext;
  canManage: boolean;
  levels: Level[];
  periods: Period[];
}

export interface StudentsPage {
  students: Student[];
  total: number;
}

export interface StudentsQuery {
  query: string;
  status: string;
  periodId: string;
  levelId: string;
  gradeId: string;
  sectionId: string;
  notEnrolled: boolean;
  page: number;
}

export interface BoardData {
  period: Period;
  sections: Section[];
  occupancy: SectionOccupancy[];
  enrollments: Enrollment[];
  total: number;
  units: Subject[];
  unitLevelIds: string[];
}

export interface BoardQuery {
  periodId: string;
  levelId: string;
  gradeId: string;
  sectionId: string;
  status: string;
  query: string;
  page: number;
}

export interface StudentFormValues {
  code: string;
  documentType: string;
  documentNumber: string;
  givenNames: string;
  paternalSurname: string;
  maternalSurname: string;
  birthDate: string;
  sex: string;
  email: string;
  phone: string;
  address: string;
  specialNeeds: boolean;
  notes: string;
  status: string;
}

export interface GuardianFormValues {
  documentType: string;
  documentNumber: string;
  givenNames: string;
  surnames: string;
  email: string;
  phone: string;
  occupation: string;
  relationship: string;
  isPrimary: boolean;
  canPickUp: boolean;
  livesWith: boolean;
}

export interface EnrollFormValues {
  studentId: string;
  periodId: string;
  levelId: string;
  gradeId: string;
  sectionId: string;
  kind: string;
  enrolledOn: string;
  origin: string;
  notes: string;
  unitIds: string[];
}

export interface MoveFormValues {
  gradeId: string;
  sectionId: string;
  notes: string;
  unitIds: string[];
}

export interface EndFormValues {
  status: string;
  endedOn: string;
  destination: string;
}

export interface PlacementFormValues {
  studentId: string;
  kind: string;
  levelId: string;
  gradeId: string;
  decidedOn: string;
  reference: string;
  notes: string;
  origin: string;
  originStudies: string;
  subjectIds: string[];
}

export interface RatifyResult {
  enrolled: number;
  withoutSection: number;
  already: number;
  finishing: number;
  inactive: number;
}

// ---------- EBA enrollment (phase E1) ----------

// Cycle and grade the cuadro de equivalencias proposes for EBR studies
export interface PlacementProposal {
  levelId: string;
  levelName: string;
  gradeId: string;
  gradeName: string;
  done: boolean;
}

// An area of the cycle's plan in force, to validate
export interface PlanArea {
  id: string;
  name: string;
}

export interface RollData {
  rows: RollRow[];
  pending: number;
  exported: number;
  observed: number;
  exempt: number;
  canManage: boolean;
}

export interface EnrollmentFileValues {
  motherTongue: string;
  motherTongueOther: string;
  occupation: string;
  disability: string;
  internet: string;
  device: string;
  preferredMode: string;
  lastStudies: string;
  documents: string[];
}

export interface EnrollmentFileCardProps {
  slug: string;
  studentId: string;
  canManage: boolean;
}

export interface EnrollmentFileDialogProps {
  slug: string;
  file: EnrollmentFile;
  onClose: () => void;
  onSaved: () => void;
}

export interface ExemptionDialogProps {
  slug: string;
  row: RollRow;
  onClose: () => void;
  onSaved: () => void;
}

export interface ObserveDialogProps {
  slug: string;
  enrollmentIds: string[];
  onClose: () => void;
  onSaved: () => void;
}

export interface PlacementActCellProps {
  placement: Placement;
  canManage: boolean;
  busy: string | null;
  onGenerate: () => void;
  onSign: () => void;
  onView: () => void;
}

export interface PlacementDialogProps {
  slug: string;
  ctx: PeopleContextData;
  onClose: () => void;
  onSaved: () => void;
}

export interface RollPageState extends RemoteState<RollData> {
  filter: RollFilter;
  setFilter: (patch: Partial<RollFilter>) => void;
  // Sections present in the rows, for the section filter
  sections: Array<{ value: string; label: string }>;
  selected: string[];
  toggle: (enrollmentId: string, on: boolean) => void;
  toggleAll: (on: boolean) => void;
  mark: (status: 'pending' | 'exported') => void;
  isMarking: boolean;
}

export interface RollPageProps {
  ctx: PeopleContextData;
  slug: string;
}

export interface SiagieExportDialogProps {
  slug: string;
  filter: RollFilter;
  pending: number;
  canManage: boolean;
  onClose: () => void;
  onDone: () => void;
}
