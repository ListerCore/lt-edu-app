import type {
  CardCode,
  ClassMark,
  ClassSlot,
  DailyMark,
  GateScan,
  GetClassResponse,
  GetOverviewResponse,
  GetReportResponse,
  GetRosterResponse,
  GetStaffDayResponse,
  Justification,
  ListClassesResponse,
  RosterRow,
  ScanResponse,
  SectionDay,
  StaffRow,
  StudentAttendance,
  SubjectTally,
  Tally,
} from '@/lib/api/grpc/gen/joseph/attendance/v1/attendance';

export type {
  CardCode,
  ClassMark,
  ClassSlot,
  DailyMark,
  GateScan,
  GetClassResponse as ClassSheet,
  GetOverviewResponse as Overview,
  GetReportResponse as Report,
  GetRosterResponse as Roster,
  GetStaffDayResponse as StaffDay,
  Justification,
  ListClassesResponse as ClassDay,
  RosterRow,
  ScanResponse as ScanResult,
  SectionDay,
  StaffRow,
  StudentAttendance,
  SubjectTally,
  Tally,
};

export type MarkStatus = 'present' | 'late' | 'absent' | 'justified';

export interface MarkDraft {
  personId: string;
  status: string;
  note: string;
}

export interface JustificationValues {
  studentId: string;
  fromDay: string;
  toDay: string;
  reason: string;
  description: string;
}

export interface JustificationPage {
  items: Justification[];
  total: number;
  canReview: boolean;
}
