'use server';

import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { programsRpc } from '@/lib/api/grpc/programs';
import type { Certificate, CertificateContent, Internship, InternshipDetail, InternshipValues, ProgramsData, StudentProgress, StudentRecord } from '../types';

const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));
const day = (v: string): string => (DATE_PATTERN.test(v) ? v : '');

export const getProgramsAction = async (slug: string): Promise<AcademicResult<ProgramsData>> =>
  runRpc(slug, (token) => programsRpc.programs({ institutionSlug: slug }, { token }), (d) => ({ programs: d.programs, canAssign: d.canAssign, staff: d.staff }));

export const setCoordinatorAction = async (slug: string, levelId: string, staffId: string): Promise<AcademicResult<null>> =>
  validIds(levelId) && optional(staffId) ? runRpc(slug, (token) => programsRpc.setCoordinator({ institutionSlug: slug, levelId, staffId }, { token }), () => null, 'Coordinación del programa actualizada.') : notFound;

export const listProgramStudentsAction = async (slug: string, levelId: string, query: string): Promise<AcademicResult<StudentProgress[]>> =>
  validIds(levelId) ? runRpc(slug, (token) => programsRpc.students({ institutionSlug: slug, levelId, query: query.slice(0, 80) }, { token }), (d) => d.students) : notFound;

export const getRecordAction = async (slug: string, studentId: string): Promise<AcademicResult<StudentRecord>> =>
  validIds(studentId) ? runRpc(slug, (token) => programsRpc.record({ institutionSlug: slug, studentId }, { token }), (d) => d.record) : notFound;

export const getMyRecordsAction = async (slug: string): Promise<AcademicResult<StudentRecord[]>> => runRpc(slug, (token) => programsRpc.mine({ institutionSlug: slug }, { token }), (d) => d.records);

export const listInternshipsAction = async (slug: string, levelId: string, status: string): Promise<AcademicResult<{ internships: Internship[]; canManage: boolean }>> =>
  optional(levelId) ? runRpc(slug, (token) => programsRpc.internships({ institutionSlug: slug, levelId, status }, { token }), (d) => ({ internships: d.internships, canManage: d.canManage })) : notFound;

export const getInternshipAction = async (slug: string, id: string): Promise<AcademicResult<InternshipDetail>> =>
  validIds(id) ? runRpc(slug, (token) => programsRpc.internship({ institutionSlug: slug, id }, { token }), (d) => d) : notFound;

export const saveInternshipAction = async (slug: string, id: string, v: InternshipValues): Promise<AcademicResult<Internship>> =>
  optional(id, v.studentId, v.subjectId)
    ? runRpc(
        slug,
        (token) =>
          programsRpc.saveInternship(
            {
              institutionSlug: slug,
              internship: {
                id,
                studentId: v.studentId,
                studentName: '',
                studentCode: '',
                subjectId: v.subjectId,
                subjectName: '',
                moduleName: '',
                levelId: '',
                programName: '',
                company: v.company.slice(0, 160),
                companyRuc: v.companyRuc.replace(/\D/g, '').slice(0, 11),
                area: v.area.slice(0, 120),
                supervisor: v.supervisor.slice(0, 160),
                supervisorContact: v.supervisorContact.slice(0, 160),
                startsOn: day(v.startsOn),
                endsOn: day(v.endsOn),
                requiredHours: 0,
                loggedHours: 0,
                status: '',
                evaluation: '',
                evaluatedName: '',
                evaluatedAt: '',
              },
            },
            { token },
          ),
        (d) => d.internship,
        id ? 'Experiencia formativa actualizada.' : 'Experiencia formativa registrada.',
      )
    : notFound;

export const deleteInternshipAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => programsRpc.deleteInternship({ institutionSlug: slug, id }, { token }), () => null, 'Experiencia formativa eliminada.') : notFound;

export const addLogAction = async (slug: string, id: string, v: { day: string; hours: string; activity: string }): Promise<AcademicResult<InternshipDetail>> =>
  validIds(id)
    ? runRpc(slug, (token) => programsRpc.addLog({ institutionSlug: slug, id, log: { id: '', day: day(v.day), hours: Number(v.hours.replace(',', '.')) || 0, activity: v.activity.slice(0, 300) } }, { token }), (d) => d.internship, 'Horas registradas.')
    : notFound;

export const deleteLogAction = async (slug: string, id: string, logId: string): Promise<AcademicResult<InternshipDetail>> =>
  validIds(id, logId) ? runRpc(slug, (token) => programsRpc.deleteLog({ institutionSlug: slug, id, logId }, { token }), (d) => d.internship) : notFound;

export const evaluateAction = async (slug: string, id: string, score: number, evaluation: string): Promise<AcademicResult<InternshipDetail>> =>
  validIds(id) ? runRpc(slug, (token) => programsRpc.evaluate({ institutionSlug: slug, id, score, evaluation: evaluation.slice(0, 1000) }, { token }), (d) => d.internship, 'Evaluación registrada.') : notFound;

export const issueModularAction = async (slug: string, studentId: string, moduleId: string): Promise<AcademicResult<Certificate>> =>
  validIds(studentId, moduleId) ? runRpc(slug, (token) => programsRpc.issueModular({ institutionSlug: slug, studentId, moduleId }, { token }), (d) => d.certificate) : notFound;

export const issueDegreeAction = async (slug: string, studentId: string): Promise<AcademicResult<Certificate>> =>
  validIds(studentId) ? runRpc(slug, (token) => programsRpc.issueDegree({ institutionSlug: slug, studentId }, { token }), (d) => d.certificate) : notFound;

export const setRequirementAction = async (slug: string, studentId: string, code: string, done: boolean, note: string): Promise<AcademicResult<StudentRecord>> =>
  validIds(studentId) ? runRpc(slug, (token) => programsRpc.setRequirement({ institutionSlug: slug, studentId, code, done, note: note.slice(0, 300) }, { token }), (d) => d.record, 'Requisito actualizado.') : notFound;

export const listCertificatesAction = async (slug: string, levelId: string, kind: string): Promise<AcademicResult<{ certificates: Certificate[]; canAnnul: boolean }>> =>
  optional(levelId) ? runRpc(slug, (token) => programsRpc.certificates({ institutionSlug: slug, levelId, kind }, { token }), (d) => ({ certificates: d.certificates, canAnnul: d.canAnnul })) : notFound;

export const getCertificateAction = async (slug: string, id: string): Promise<AcademicResult<{ certificate: Certificate; content: CertificateContent }>> =>
  validIds(id)
    ? runRpc(slug, (token) => programsRpc.certificate({ institutionSlug: slug, id }, { token }), (d) => {
        if (!d.certificate) return undefined;
        try {
          return { certificate: d.certificate, content: JSON.parse(d.content) as CertificateContent };
        } catch {
          return undefined;
        }
      })
    : notFound;

export const annulCertificateAction = async (slug: string, id: string, reason: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => programsRpc.annul({ institutionSlug: slug, id, reason: reason.slice(0, 300) }, { token }), () => null, 'Certificado anulado.') : notFound;
