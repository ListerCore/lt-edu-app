'use server';

import { teachingRpc } from '@/lib/api/grpc/teaching';
import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { Assignment, BlockDraft, MyScheduleData, PlannerData, ScheduleEntry, TimeBlock } from '../types';

export const getPlannerAction = async (slug: string, periodId: string): Promise<AcademicResult<PlannerData>> =>
  validIds(periodId)
    ? runRpc(
        slug,
        (token) => teachingRpc.planner({ institutionSlug: slug, periodId }, { token }),
        (d) => (d.context && d.period ? { context: d.context, period: d.period, sections: d.sections, blocks: d.blocks, assignments: d.assignments, entries: d.entries, teachers: d.teachers, elsewhere: d.elsewhere } : undefined),
      )
    : notFound;

export const getMyScheduleAction = async (slug: string): Promise<AcademicResult<MyScheduleData>> =>
  runRpc(
    slug,
    (token) => teachingRpc.mySchedule({ institutionSlug: slug }, { token }),
    (d) => ({ kind: d.kind, weekDays: d.weekDays, blocks: d.blocks, groups: d.groups }),
  );

export const prepareLoadAction = async (slug: string, periodId: string): Promise<AcademicResult<number>> =>
  validIds(periodId)
    ? runRpc(
        slug,
        (token) => teachingRpc.prepareLoad({ institutionSlug: slug, periodId }, { token }),
        (d) => d.added,
      )
    : notFound;

export const updateAssignmentAction = async (slug: string, id: string, staffId: string, weeklyHours: number): Promise<AcademicResult<Assignment>> =>
  validIds(id) && (staffId === '' || validIds(staffId))
    ? runRpc(
        slug,
        (token) => teachingRpc.updateAssignment({ institutionSlug: slug, id, staffId, weeklyHours: Math.max(0, Math.min(40, Math.round(weeklyHours))) }, { token }),
        (d) => d.assignment,
      )
    : notFound;

export const deleteAssignmentAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id)
    ? runRpc(
        slug,
        (token) => teachingRpc.deleteAssignment({ institutionSlug: slug, id }, { token }),
        () => null,
        'Quitado de la carga.',
      )
    : notFound;

export const setTutorAction = async (slug: string, sectionId: string, staffId: string): Promise<AcademicResult<null>> =>
  validIds(sectionId) && (staffId === '' || validIds(staffId))
    ? runRpc(
        slug,
        (token) => teachingRpc.setTutor({ institutionSlug: slug, sectionId, staffId }, { token }),
        () => null,
        'Tutor actualizado.',
      )
    : notFound;

export const setTimeBlocksAction = async (slug: string, shift: string, blocks: BlockDraft[]): Promise<AcademicResult<TimeBlock[]>> =>
  runRpc(
    slug,
    (token) => teachingRpc.setTimeBlocks({ institutionSlug: slug, shift, blocks: blocks.slice(0, 16).map((b, i) => ({ id: '', shift, position: i, ...b })) }, { token }),
    (d) => d.blocks,
    'Horario del turno guardado.',
  );

export const placeClassAction = async (slug: string, sectionId: string, assignmentId: string, weekday: number, blockId: string, room: string): Promise<AcademicResult<ScheduleEntry>> =>
  validIds(sectionId, assignmentId, blockId)
    ? runRpc(
        slug,
        (token) => teachingRpc.placeClass({ institutionSlug: slug, sectionId, assignmentId, weekday, blockId, room: room.slice(0, 60) }, { token }),
        (d) => d.entry,
      )
    : notFound;

export const removeClassAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id)
    ? runRpc(
        slug,
        (token) => teachingRpc.removeClass({ institutionSlug: slug, id }, { token }),
        () => null,
      )
    : notFound;

export const clearSectionAction = async (slug: string, sectionId: string): Promise<AcademicResult<null>> =>
  validIds(sectionId)
    ? runRpc(
        slug,
        (token) => teachingRpc.clearSection({ institutionSlug: slug, sectionId }, { token }),
        () => null,
        'Horario vaciado.',
      )
    : notFound;

export const autoFillAction = async (slug: string, periodId: string, sectionId: string): Promise<AcademicResult<{ placed: number; pending: number }>> =>
  validIds(periodId) && (sectionId === '' || validIds(sectionId))
    ? runRpc(
        slug,
        (token) => teachingRpc.autoFill({ institutionSlug: slug, periodId, sectionId }, { token }),
        (d) => ({ placed: d.placed, pending: d.pending }),
      )
    : notFound;
