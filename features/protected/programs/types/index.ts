import type { Certificate, GetInternshipResponse, Internship, InternshipLog, Program, RecordModule, RecordUnit, Requirement, StudentProgress, StudentRecord } from '@/lib/api/grpc/gen/ltedu/programs/v1/programs';
import type { Staff } from '@/lib/api/grpc/gen/ltedu/teaching/v1/teaching';

export type { Certificate, GetInternshipResponse as InternshipDetail, Internship, InternshipLog, Program, RecordModule, RecordUnit, Requirement, Staff, StudentProgress, StudentRecord };

export interface ProgramsData {
  programs: Program[];
  canAssign: boolean;
  staff: Staff[];
}

export interface InternshipValues {
  studentId: string;
  subjectId: string;
  company: string;
  companyRuc: string;
  area: string;
  supervisor: string;
  supervisorContact: string;
  startsOn: string;
  endsOn: string;
}

// The frozen certificate (lt-edu-api service.CertificateContent)
export interface CertificateContent {
  title: string;
  institution: string;
  program: string;
  module?: string;
  degree?: string;
  student: string;
  document: string;
  code: string;
  credits: number;
  units: Array<{ name: string; semester: string; credits: number; grade: string; period: string }> | null;
  placements: Array<{ name: string; company: string; hours: string; grade: string }> | null;
  issuedOn: string;
  signatures: string[];
  legend: string;
}
