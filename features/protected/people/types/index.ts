import type { AcademicContext, Level, Period, Section } from '@/lib/api/grpc/gen/joseph/academic/v1/academic';
import type { Subject } from '@/lib/api/grpc/gen/joseph/academic/v1/curriculum';
import type { Enrollment, Guardian, Placement, SectionOccupancy, Student, StudentDetail } from '@/lib/api/grpc/gen/joseph/people/v1/people';

export type { AcademicContext, Enrollment, Guardian, Level, Period, Placement, Section, SectionOccupancy, Student, StudentDetail, Subject };

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
}

export interface RatifyResult {
  enrolled: number;
  withoutSection: number;
  already: number;
  finishing: number;
  inactive: number;
}
