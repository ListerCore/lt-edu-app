import type { Assignment, Staff } from '@/lib/api/grpc/gen/ltedu/teaching/v1/teaching';

export type { Assignment, Staff };

export interface StaffPage {
  staff: Staff[];
  total: number;
  canManage: boolean;
  canGrant: boolean;
}

export interface StaffDetail {
  staff: Staff;
  assignments: Assignment[];
  canManage: boolean;
  canGrant: boolean;
}

export interface StaffQuery {
  query: string;
  status: string;
  teachersOnly: boolean;
  page: number;
}

export interface StaffFormValues {
  code: string;
  documentType: string;
  documentNumber: string;
  givenNames: string;
  surnames: string;
  email: string;
  phone: string;
  position: string;
  isTeacher: boolean;
  specialty: string;
  maxWeeklyHours: string;
  hiredOn: string;
  status: string;
  notes: string;
}
