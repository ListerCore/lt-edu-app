'use server';

import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { attendanceRpc } from '@/lib/api/grpc/attendance';
import type { CardCode, ClassDay, ClassSheet, JustificationPage, JustificationValues, MarkDraft, Overview, Report, Roster, ScanResult, StaffDay, StudentAttendance, GateScan, Justification } from '../types';

// Empty or a valid YYYY-MM-DD: the API takes empty as today in Lima
const day = (value: string): string => (DATE_PATTERN.test(value) ? value : '');
const marks = (items: MarkDraft[]): MarkDraft[] => items.filter((m) => validIds(m.personId)).map((m) => ({ personId: m.personId, status: m.status, note: m.note.slice(0, 300) }));

export const getOverviewAction = async (slug: string, date: string): Promise<AcademicResult<Overview>> => runRpc(slug, (token) => attendanceRpc.overview({ institutionSlug: slug, day: day(date) }, { token }), (d) => d);

export const scanAction = async (slug: string, input: string): Promise<AcademicResult<ScanResult>> =>
  runRpc(slug, (token) => attendanceRpc.scan({ institutionSlug: slug, input: input.trim().slice(0, 80) }, { token }), (d) => d);

export const getRecentScansAction = async (slug: string): Promise<AcademicResult<GateScan[]>> => runRpc(slug, (token) => attendanceRpc.recentScans({ institutionSlug: slug, limit: 30 }, { token }), (d) => d.scans);

export const getRosterAction = async (slug: string, sectionId: string, date: string): Promise<AcademicResult<Roster>> =>
  validIds(sectionId) ? runRpc(slug, (token) => attendanceRpc.roster({ institutionSlug: slug, sectionId, day: day(date) }, { token }), (d) => d) : notFound;

export const markStudentsAction = async (slug: string, sectionId: string, date: string, items: MarkDraft[]): Promise<AcademicResult<Roster>> =>
  validIds(sectionId) ? runRpc(slug, (token) => attendanceRpc.markStudents({ institutionSlug: slug, sectionId, day: day(date), marks: marks(items) }, { token }), (d) => d.roster, 'Asistencia guardada.') : notFound;

export const closeDayAction = async (slug: string, date: string, sectionId: string): Promise<AcademicResult<number>> => {
  if (sectionId && !validIds(sectionId)) return notFound;
  return runRpc(slug, (token) => attendanceRpc.closeDay({ institutionSlug: slug, day: day(date), sectionId }, { token }), (d) => d.marked);
};

export const getStaffDayAction = async (slug: string, date: string): Promise<AcademicResult<StaffDay>> => runRpc(slug, (token) => attendanceRpc.staffDay({ institutionSlug: slug, day: day(date) }, { token }), (d) => d);

export const markStaffAction = async (slug: string, date: string, items: MarkDraft[]): Promise<AcademicResult<StaffDay>> =>
  runRpc(slug, (token) => attendanceRpc.markStaff({ institutionSlug: slug, day: day(date), marks: marks(items) }, { token }), (d) => d.day, 'Asistencia guardada.');

export const closeStaffDayAction = async (slug: string, date: string): Promise<AcademicResult<number>> => runRpc(slug, (token) => attendanceRpc.closeStaffDay({ institutionSlug: slug, day: day(date) }, { token }), (d) => d.marked);

export const getClassesAction = async (slug: string, date: string, sectionId: string): Promise<AcademicResult<ClassDay>> => {
  if (sectionId && !validIds(sectionId)) return notFound;
  return runRpc(slug, (token) => attendanceRpc.classes({ institutionSlug: slug, day: day(date), sectionId }, { token }), (d) => d);
};

export const getClassAction = async (slug: string, assignmentId: string, blockId: string, date: string): Promise<AcademicResult<ClassSheet>> =>
  validIds(assignmentId, blockId) ? runRpc(slug, (token) => attendanceRpc.getClass({ institutionSlug: slug, assignmentId, blockId, day: day(date) }, { token }), (d) => d) : notFound;

export const saveClassAction = async (slug: string, assignmentId: string, blockId: string, date: string, topic: string, items: MarkDraft[]): Promise<AcademicResult<ClassSheet>> =>
  validIds(assignmentId, blockId)
    ? runRpc(slug, (token) => attendanceRpc.saveClass({ institutionSlug: slug, assignmentId, blockId, day: day(date), topic: topic.slice(0, 200), marks: marks(items) }, { token }), (d) => d.sheet, 'Asistencia de la clase guardada.')
    : notFound;

export const getJustificationsAction = async (slug: string, status: string, studentId: string, page: number): Promise<AcademicResult<JustificationPage>> => {
  if (studentId && !validIds(studentId)) return notFound;
  return runRpc(slug, (token) => attendanceRpc.justifications({ institutionSlug: slug, status, studentId, limit: 20, offset: Math.max(0, page - 1) * 20 }, { token }), (d) => ({ items: d.items, total: d.total, canReview: d.canReview }));
};

export const submitJustificationAction = async (slug: string, v: JustificationValues): Promise<AcademicResult<Justification>> =>
  validIds(v.studentId)
    ? runRpc(slug, (token) => attendanceRpc.submitJustification({ institutionSlug: slug, studentId: v.studentId, fromDay: day(v.fromDay), toDay: day(v.toDay), reason: v.reason, description: v.description.slice(0, 1000) }, { token }), (d) => d.justification, 'Justificación enviada.')
    : notFound;

export const reviewJustificationAction = async (slug: string, id: string, approve: boolean, note: string): Promise<AcademicResult<Justification>> =>
  validIds(id) ? runRpc(slug, (token) => attendanceRpc.reviewJustification({ institutionSlug: slug, id, approve, note: note.slice(0, 500) }, { token }), (d) => d.justification, approve ? 'Justificación aceptada.' : 'Justificación observada.') : notFound;

export const getReportAction = async (slug: string, sectionId: string): Promise<AcademicResult<Report>> => {
  if (sectionId && !validIds(sectionId)) return notFound;
  return runRpc(slug, (token) => attendanceRpc.report({ institutionSlug: slug, periodId: '', sectionId }, { token }), (d) => d);
};

export const getStudentAttendanceAction = async (slug: string, studentId: string): Promise<AcademicResult<StudentAttendance>> =>
  validIds(studentId) ? runRpc(slug, (token) => attendanceRpc.student({ institutionSlug: slug, studentId }, { token }), (d) => d.attendance) : notFound;

export const getMyAttendanceAction = async (slug: string): Promise<AcademicResult<StudentAttendance[]>> => runRpc(slug, (token) => attendanceRpc.mine({ institutionSlug: slug }, { token }), (d) => d.students);

export const getCardCodesAction = async (slug: string, kind: 'student' | 'staff', ids: string[]): Promise<AcademicResult<CardCode[]>> => {
  const valid = ids.filter((id) => validIds(id)).slice(0, 200);
  if (valid.length === 0) return { ok: true, data: [] };
  return runRpc(slug, (token) => attendanceRpc.cardCodes({ institutionSlug: slug, kind, ids: valid }, { token }), (d) => d.codes);
};

export const renewCardAction = async (slug: string, kind: 'student' | 'staff', id: string): Promise<AcademicResult<CardCode>> =>
  validIds(id) ? runRpc(slug, (token) => attendanceRpc.renewCard({ institutionSlug: slug, kind, id }, { token }), (d) => d.code, 'Carnet renovado: el anterior ya no sirve.') : notFound;
