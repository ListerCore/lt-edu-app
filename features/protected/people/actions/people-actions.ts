'use server';

import { peopleRpc } from '@/lib/api/grpc/people';
import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { PAGE_SIZE } from '../data/people-data';
import type { BoardData, BoardQuery, EndFormValues, Enrollment, EnrollFormValues, Guardian, GuardianFormValues, MoveFormValues, PeopleContextData, Placement, PlacementFormValues, RatifyResult, Student, StudentDetail, StudentFormValues, StudentsPage, StudentsQuery } from '../types';

const date = (value: string): string => (DATE_PATTERN.test(value) ? value : '');
const optionalId = (value: string): boolean => value === '' || validIds(value);

export const getPeopleContextAction = async (slug: string): Promise<AcademicResult<PeopleContextData>> =>
  runRpc(slug, (token) => peopleRpc.context({ institutionSlug: slug }, { token }), (d) => (d.context ? { context: d.context, canManage: d.canManage, levels: d.levels, periods: d.periods } : undefined));

// ---------- students ----------

export const getStudentsAction = async (slug: string, q: StudentsQuery): Promise<AcademicResult<StudentsPage>> => {
  if (![q.periodId, q.levelId, q.gradeId, q.sectionId].every(optionalId)) return notFound;
  return runRpc(
    slug,
    (token) =>
      peopleRpc.listStudents(
        { institutionSlug: slug, query: q.query.slice(0, 80), status: q.status, periodId: q.periodId, levelId: q.levelId, gradeId: q.gradeId, sectionId: q.sectionId, notEnrolled: q.notEnrolled, limit: PAGE_SIZE, offset: Math.max(0, q.page - 1) * PAGE_SIZE },
        { token },
      ),
    (d) => ({ students: d.students, total: d.total }),
  );
};

// A short list for pickers (enroll, placement): students matching the text, optionally not yet enrolled in a period
export const searchStudentsAction = async (slug: string, query: string, notEnrolledIn: string): Promise<AcademicResult<Student[]>> =>
  optionalId(notEnrolledIn)
    ? runRpc(slug, (token) => peopleRpc.listStudents({ institutionSlug: slug, query: query.slice(0, 80), status: 'active', periodId: notEnrolledIn, levelId: '', gradeId: '', sectionId: '', notEnrolled: notEnrolledIn !== '', limit: 12, offset: 0 }, { token }), (d) => d.students)
    : notFound;

export const getStudentAction = async (slug: string, id: string): Promise<AcademicResult<StudentDetail>> =>
  validIds(id) ? runRpc(slug, (token) => peopleRpc.getStudent({ institutionSlug: slug, id }, { token }), (d) => d.detail) : notFound;

const studentInput = (v: StudentFormValues) => ({ ...v, birthDate: date(v.birthDate) });

export const saveStudentAction = async (slug: string, id: string | null, values: StudentFormValues): Promise<AcademicResult<Student>> => {
  if (id && !validIds(id)) return notFound;
  return id
    ? runRpc(slug, (token) => peopleRpc.updateStudent({ institutionSlug: slug, id, student: studentInput(values) }, { token }), (d) => d.student, 'Datos guardados.')
    : runRpc(slug, (token) => peopleRpc.createStudent({ institutionSlug: slug, student: studentInput(values) }, { token }), (d) => d.student, 'Estudiante registrado.');
};

export const deleteStudentAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => peopleRpc.deleteStudent({ institutionSlug: slug, id }, { token }), () => null, 'Estudiante eliminado.') : notFound;

// ---------- guardians ----------

export const findGuardianAction = async (slug: string, documentType: string, documentNumber: string): Promise<AcademicResult<Guardian>> =>
  runRpc(slug, (token) => peopleRpc.findGuardian({ institutionSlug: slug, documentType, documentNumber: documentNumber.slice(0, 20) }, { token }), (d) => d.guardian);

const split = (v: GuardianFormValues) => ({
  guardian: { documentType: v.documentType, documentNumber: v.documentNumber, givenNames: v.givenNames, surnames: v.surnames, email: v.email, phone: v.phone, occupation: v.occupation },
  link: { relationship: v.relationship, isPrimary: v.isPrimary, canPickUp: v.canPickUp, livesWith: v.livesWith },
});

export const saveGuardianAction = async (slug: string, studentId: string, guardianId: string | null, existingId: string, values: GuardianFormValues): Promise<AcademicResult<StudentDetail>> => {
  if (!validIds(studentId) || (guardianId && !validIds(guardianId)) || !optionalId(existingId)) return notFound;
  const { guardian, link } = split(values);
  return guardianId
    ? runRpc(slug, (token) => peopleRpc.updateGuardian({ institutionSlug: slug, studentId, guardianId, guardian, link }, { token }), (d) => d.detail, 'Apoderado actualizado.')
    : runRpc(slug, (token) => peopleRpc.addGuardian({ institutionSlug: slug, studentId, guardianId: existingId, guardian, link }, { token }), (d) => d.detail, 'Apoderado vinculado.');
};

export const removeGuardianAction = async (slug: string, studentId: string, guardianId: string): Promise<AcademicResult<StudentDetail>> =>
  validIds(studentId, guardianId) ? runRpc(slug, (token) => peopleRpc.removeGuardian({ institutionSlug: slug, studentId, guardianId }, { token }), (d) => d.detail, 'Apoderado desvinculado.') : notFound;

export const grantAccessAction = async (slug: string, studentId: string, guardianId: string): Promise<AcademicResult<StudentDetail>> =>
  validIds(studentId) && optionalId(guardianId) ? runRpc(slug, (token) => peopleRpc.grantAccess({ institutionSlug: slug, studentId, guardianId }, { token }), (d) => d.detail, 'Acceso otorgado.') : notFound;

// ---------- enrollment ----------

export const getBoardAction = async (slug: string, q: BoardQuery, pageSize = 50): Promise<AcademicResult<BoardData>> => {
  if (!validIds(q.periodId) || ![q.levelId, q.gradeId, q.sectionId].every(optionalId)) return notFound;
  return runRpc(
    slug,
    (token) =>
      peopleRpc.board(
        { institutionSlug: slug, periodId: q.periodId, levelId: q.levelId, gradeId: q.gradeId, sectionId: q.sectionId, status: q.status, query: q.query.slice(0, 80), limit: pageSize, offset: Math.max(0, q.page - 1) * pageSize },
        { token },
      ),
    (d) => (d.period ? { period: d.period, sections: d.sections, occupancy: d.occupancy, enrollments: d.enrollments, total: d.total, units: d.units, unitLevelIds: d.unitLevelIds } : undefined),
  );
};

export const enrollAction = async (slug: string, v: EnrollFormValues): Promise<AcademicResult<Enrollment>> => {
  if (!validIds(v.studentId, v.periodId) || ![v.levelId, v.gradeId, v.sectionId].every(optionalId) || !validIds(...v.unitIds)) {
    return { ok: false, message: 'Revisa los datos del formulario.', fields: { studentId: v.studentId ? '' : 'Elige un estudiante.' } };
  }
  return runRpc(slug, (token) => peopleRpc.enroll({ institutionSlug: slug, ...v, enrolledOn: date(v.enrolledOn) }, { token }), (d) => d.enrollment, 'Matrícula registrada.');
};

export const moveEnrollmentAction = async (slug: string, id: string, v: MoveFormValues, setUnits: boolean): Promise<AcademicResult<Enrollment>> =>
  validIds(id) && optionalId(v.gradeId) && optionalId(v.sectionId) && validIds(...v.unitIds)
    ? runRpc(slug, (token) => peopleRpc.updateEnrollment({ institutionSlug: slug, id, gradeId: v.gradeId, sectionId: v.sectionId, notes: v.notes, setUnits, unitIds: v.unitIds }, { token }), (d) => d.enrollment, 'Matrícula actualizada.')
    : notFound;

export const endEnrollmentAction = async (slug: string, id: string, v: EndFormValues): Promise<AcademicResult<Enrollment>> =>
  validIds(id)
    ? runRpc(slug, (token) => peopleRpc.endEnrollment({ institutionSlug: slug, id, status: v.status, endedOn: date(v.endedOn), destination: v.destination }, { token }), (d) => d.enrollment, v.status === 'active' ? 'Matrícula reactivada.' : 'Registrado.')
    : notFound;

export const deleteEnrollmentAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => peopleRpc.deleteEnrollment({ institutionSlug: slug, id }, { token }), () => null, 'Matrícula anulada.') : notFound;

export const ratifyAction = async (slug: string, fromPeriodId: string, toPeriodId: string, preview: boolean): Promise<AcademicResult<RatifyResult>> =>
  validIds(fromPeriodId, toPeriodId)
    ? runRpc(slug, (token) => peopleRpc.ratify({ institutionSlug: slug, fromPeriodId, toPeriodId, preview }, { token }), (d) => ({ enrolled: d.enrolled, withoutSection: d.withoutSection, already: d.already, finishing: d.finishing, inactive: d.inactive }))
    : notFound;

// ---------- placements ----------

export const getPlacementsAction = async (slug: string): Promise<AcademicResult<Placement[]>> => runRpc(slug, (token) => peopleRpc.listPlacements({ institutionSlug: slug }, { token }), (d) => d.placements);

export const createPlacementAction = async (slug: string, v: PlacementFormValues): Promise<AcademicResult<Placement>> =>
  validIds(v.studentId) && optionalId(v.levelId) && optionalId(v.gradeId)
    ? runRpc(slug, (token) => peopleRpc.createPlacement({ institutionSlug: slug, ...v, decidedOn: date(v.decidedOn) }, { token }), (d) => d.placement, 'Registrado.')
    : { ok: false, message: 'Revisa los datos del formulario.', fields: { studentId: 'Elige un estudiante.' } };

export const deletePlacementAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => peopleRpc.deletePlacement({ institutionSlug: slug, id }, { token }), () => null, 'Eliminado.') : notFound;
