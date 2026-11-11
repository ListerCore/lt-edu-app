'use server';

import { curriculumRpc } from '@/lib/api/grpc/curriculum';
import { notFound, runRpc, toInt, validIds } from '../lib/run-rpc';
import type { AcademicResult, Competency, CompetencyFormValues, Curriculum, CurriculaData, CurriculumData, Module, ModuleFormValues, NewCurriculumValues, PlanValues, Subject, SubjectFormValues } from '../types';

// ---------- plans ----------

export const getCurriculaAction = async (slug: string): Promise<AcademicResult<CurriculaData>> =>
  runRpc(
    slug,
    (token) => curriculumRpc.list({ institutionSlug: slug }, { token }),
    (data) => (data.context ? { context: data.context, levels: data.levels, curricula: data.curricula, templateLevelIds: data.templateLevelIds } : undefined),
  );

export const getCurriculumAction = async (slug: string, id: string): Promise<AcademicResult<CurriculumData>> =>
  validIds(id)
    ? runRpc(slug, (token) => curriculumRpc.get({ institutionSlug: slug, id }, { token }), (data) => (data.context && data.curriculum && data.level ? { context: data.context, curriculum: data.curriculum, level: data.level } : undefined))
    : notFound;

export const createCurriculumAction = async (slug: string, values: NewCurriculumValues): Promise<AcademicResult<Curriculum>> =>
  validIds(values.levelId)
    ? runRpc(slug, (token) => curriculumRpc.create({ institutionSlug: slug, levelId: values.levelId, name: values.name, fromTemplate: values.fromTemplate }, { token }), (data) => data.curriculum, 'Plan creado.')
    : { ok: false, message: 'Revisa los datos del formulario.', fields: { levelId: 'Elige a qué corresponde el plan.' } };

export const duplicateCurriculumAction = async (slug: string, id: string, name: string): Promise<AcademicResult<Curriculum>> =>
  validIds(id) ? runRpc(slug, (token) => curriculumRpc.duplicate({ institutionSlug: slug, id, name }, { token }), (data) => data.curriculum, 'Nueva versión creada.') : notFound;

export const updateCurriculumAction = async (slug: string, id: string, values: PlanValues): Promise<AcademicResult<Curriculum>> =>
  validIds(id) ? runRpc(slug, (token) => curriculumRpc.update({ institutionSlug: slug, id, name: values.name, notes: values.notes }, { token }), (data) => data.curriculum, 'Cambios guardados.') : notFound;

export const setCurriculumStatusAction = async (slug: string, id: string, status: string): Promise<AcademicResult<Curriculum>> =>
  validIds(id) ? runRpc(slug, (token) => curriculumRpc.setStatus({ institutionSlug: slug, id, status }, { token }), (data) => data.curriculum) : notFound;

export const deleteCurriculumAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => curriculumRpc.remove({ institutionSlug: slug, id }, { token }), () => null, 'Plan eliminado.') : notFound;

// ---------- modules ----------

export const saveModuleAction = async (slug: string, curriculumId: string, id: string | null, values: ModuleFormValues): Promise<AcademicResult<Module>> => {
  if (!validIds(curriculumId) || (id && !validIds(id))) return notFound;
  const body = { code: values.code.trim(), name: values.name, description: values.description };
  return id
    ? runRpc(slug, (token) => curriculumRpc.updateModule({ institutionSlug: slug, id, ...body }, { token }), (data) => data.module, 'Cambios guardados.')
    : runRpc(slug, (token) => curriculumRpc.createModule({ institutionSlug: slug, curriculumId, ...body }, { token }), (data) => data.module, 'Módulo agregado.');
};

export const deleteModuleAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => curriculumRpc.deleteModule({ institutionSlug: slug, id }, { token }), () => null, 'Módulo eliminado.') : notFound;

// ---------- subjects ----------

const subjectInput = (values: SubjectFormValues) => ({
  moduleId: values.moduleId,
  kind: values.kind,
  component: values.component,
  code: values.code.trim(),
  name: values.name,
  description: values.description,
  weeklyHours: toInt(values.weeklyHours),
  theoryCredits: toInt(values.theoryCredits),
  practiceCredits: toInt(values.practiceCredits),
  gradeIds: values.gradeIds,
});

export const saveSubjectAction = async (slug: string, curriculumId: string, id: string | null, values: SubjectFormValues): Promise<AcademicResult<Subject>> => {
  if (!validIds(curriculumId) || (id && !validIds(id)) || !validIds(...values.gradeIds) || (values.moduleId && !validIds(values.moduleId))) return notFound;
  return id
    ? runRpc(slug, (token) => curriculumRpc.updateSubject({ institutionSlug: slug, id, subject: subjectInput(values) }, { token }), (data) => data.subject, 'Cambios guardados.')
    : runRpc(slug, (token) => curriculumRpc.createSubject({ institutionSlug: slug, curriculumId, subject: subjectInput(values) }, { token }), (data) => data.subject, 'Agregado.');
};

export const deleteSubjectAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => curriculumRpc.deleteSubject({ institutionSlug: slug, id }, { token }), () => null, 'Eliminado.') : notFound;

export const reorderSubjectsAction = async (slug: string, curriculumId: string, order: string[]): Promise<AcademicResult<null>> =>
  validIds(curriculumId, ...order) ? runRpc(slug, (token) => curriculumRpc.reorderSubjects({ institutionSlug: slug, curriculumId, ids: order }, { token }), () => null) : notFound;

// ---------- competencies ----------

export const saveCompetencyAction = async (slug: string, curriculumId: string, subjectId: string, id: string | null, values: CompetencyFormValues): Promise<AcademicResult<Competency>> => {
  if (!validIds(curriculumId) || (subjectId && !validIds(subjectId)) || (id && !validIds(id))) return notFound;
  return id
    ? runRpc(slug, (token) => curriculumRpc.updateCompetency({ institutionSlug: slug, id, code: values.code, name: values.name }, { token }), (data) => data.competency, 'Cambios guardados.')
    : runRpc(slug, (token) => curriculumRpc.createCompetency({ institutionSlug: slug, curriculumId, subjectId, code: values.code, name: values.name }, { token }), (data) => data.competency, 'Agregada.');
};

export const deleteCompetencyAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => curriculumRpc.deleteCompetency({ institutionSlug: slug, id }, { token }), () => null, 'Eliminada.') : notFound;
