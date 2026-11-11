import type { AcademicContext, Period, Section } from '@/lib/api/grpc/gen/joseph/academic/v1/academic';
import type { Assignment, ScheduleEntry, ScheduleGroup, Staff, TimeBlock } from '@/lib/api/grpc/gen/joseph/teaching/v1/teaching';

export type { AcademicContext, Assignment, Period, ScheduleEntry, ScheduleGroup, Section, Staff, TimeBlock };

export interface PlannerData {
  context: AcademicContext;
  period: Period;
  sections: Section[];
  blocks: TimeBlock[];
  assignments: Assignment[];
  entries: ScheduleEntry[];
  teachers: Staff[];
  elsewhere: ScheduleEntry[];
}

export interface MyScheduleData {
  kind: string;
  weekDays: number[];
  blocks: TimeBlock[];
  groups: ScheduleGroup[];
}

export interface BlockDraft {
  startsAt: string;
  endsAt: string;
  kind: string;
}
