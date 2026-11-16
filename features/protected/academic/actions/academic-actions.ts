'use server';

import { academicRpc } from '@/lib/api/grpc/academic';
import { DATE_PATTERN } from '../data/academic-data';
import { notFound, runRpc, toInt, validIds } from '../lib/run-rpc';
import type { AcademicContext, AcademicResult, Grade, GradeFormValues, Level, LevelFormValues, Period, PeriodDetailData, PeriodFormValues, PeriodsData, Section, SectionBatchValues, SectionFormValues, SettingsFormValues, StructureData, Term, TermFormValues } from '../types';

const run = runRpc;
const ids = validIds;
const date = (value: string): string => (DATE_PATTERN.test(value) ? value : '');

// ---------- profile ----------

export const getAcademicContextAction = async (slug: string): Promise<AcademicResult<AcademicContext>> =>
  run(slug, (token) => academicRpc.getContext({ institutionSlug: slug }, { token }), (data) => data.context);

export const updateSettingsAction = async (slug: string, values: SettingsFormValues, gradingScale: string): Promise<AcademicResult<AcademicContext>> =>
  run(
    slug,
    (token) =>
      academicRpc.updateSettings(
        {
          institutionSlug: slug,
          settings: { termScheme: values.termScheme, gradingScale, passingGrade: toInt(values.passingGrade), conductGrade: values.conductGrade, attentionModes: values.attentionModes, shifts: values.shifts, weekDays: values.weekDays.map(Number).filter((d) => d >= 1 && d <= 7),
            lateAfterMinutes: toInt(values.lateAfterMinutes) ?? -1,
            absenceLimitPercent: toInt(values.absenceLimitPercent) ?? 0,
            dre: values.dre.trim().slice(0, 120),
            ugel: values.ugel.trim().slice(0, 120),
            modularCode: values.modularCode.trim(),
            logo: values.logo,
            // Only the two known values travel; anything else is left unset so the API keeps what is stored
            management: values.management === 'public' || values.management === 'private' ? values.management : undefined,
          },
        },
        { token },
      ),
    (data) => data.context,
    'Perfil académico guardado.',
  );

// ---------- structure ----------

export const getStructureAction = async (slug: string): Promise<AcademicResult<StructureData>> =>
  run(slug, (token) => academicRpc.getStructure({ institutionSlug: slug }, { token }), (data) => (data.context ? { context: data.context, levels: data.levels } : undefined));

const levelInput = (values: LevelFormValues) => ({
  code: values.code.trim(),
  name: values.name,
  description: values.description,
  formativeLevel: values.formativeLevel,
  credits: toInt(values.credits),
  attentionModes: values.attentionModes,
  isActive: values.isActive,
});

export const saveLevelAction = async (slug: string, id: string | null, values: LevelFormValues): Promise<AcademicResult<Level>> => {
  if (id && !ids(id)) return notFound;
  return id
    ? run(slug, (token) => academicRpc.updateLevel({ institutionSlug: slug, id, level: levelInput(values) }, { token }), (data) => data.level, 'Cambios guardados.')
    : run(slug, (token) => academicRpc.createLevel({ institutionSlug: slug, level: levelInput(values) }, { token }), (data) => data.level, 'Agregado.');
};

export const deleteLevelAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  ids(id) ? run(slug, (token) => academicRpc.deleteLevel({ institutionSlug: slug, id }, { token }), () => null, 'Eliminado.') : notFound;

export const reorderLevelsAction = async (slug: string, order: string[]): Promise<AcademicResult<null>> =>
  ids(...order) ? run(slug, (token) => academicRpc.reorderLevels({ institutionSlug: slug, ids: order }, { token }), () => null) : notFound;

const gradeInput = (values: GradeFormValues) => ({ code: values.code.trim(), name: values.name, shortName: values.shortName });

export const saveGradeAction = async (slug: string, levelId: string, id: string | null, values: GradeFormValues): Promise<AcademicResult<Grade>> => {
  if (!ids(levelId) || (id && !ids(id))) return notFound;
  return id
    ? run(slug, (token) => academicRpc.updateGrade({ institutionSlug: slug, id, grade: gradeInput(values) }, { token }), (data) => data.grade, 'Cambios guardados.')
    : run(slug, (token) => academicRpc.createGrade({ institutionSlug: slug, levelId, grade: gradeInput(values) }, { token }), (data) => data.grade, 'Agregado.');
};

export const deleteGradeAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  ids(id) ? run(slug, (token) => academicRpc.deleteGrade({ institutionSlug: slug, id }, { token }), () => null, 'Eliminado.') : notFound;

export const reorderGradesAction = async (slug: string, levelId: string, order: string[]): Promise<AcademicResult<null>> =>
  ids(levelId, ...order) ? run(slug, (token) => academicRpc.reorderGrades({ institutionSlug: slug, levelId, ids: order }, { token }), () => null) : notFound;

export const applyTemplateAction = async (slug: string): Promise<AcademicResult<Level[]>> =>
  run(slug, (token) => academicRpc.applyTemplate({ institutionSlug: slug }, { token }), (data) => data.levels, 'Estructura cargada.');

// ---------- periods ----------

export const getPeriodsAction = async (slug: string): Promise<AcademicResult<PeriodsData>> =>
  run(slug, (token) => academicRpc.listPeriods({ institutionSlug: slug }, { token }), (data) => (data.context ? { context: data.context, periods: data.periods } : undefined));

export const getPeriodAction = async (slug: string, id: string): Promise<AcademicResult<PeriodDetailData>> => {
  if (!ids(id)) return notFound;
  return run(
    slug,
    (token) => academicRpc.getPeriod({ institutionSlug: slug, id }, { token }),
    (data) => (data.context && data.period ? { context: data.context, period: data.period, sections: data.sections, levels: data.levels, otherPeriods: data.otherPeriods } : undefined),
  );
};

const periodInput = (values: PeriodFormValues) => ({ name: values.name, season: values.season, startsOn: date(values.startsOn), endsOn: date(values.endsOn), termScheme: values.termScheme });

export const savePeriodAction = async (slug: string, id: string | null, values: PeriodFormValues): Promise<AcademicResult<Period>> => {
  if (id && !ids(id)) return notFound;
  return id
    ? run(slug, (token) => academicRpc.updatePeriod({ institutionSlug: slug, id, period: periodInput(values) }, { token }), (data) => data.period, 'Cambios guardados.')
    : run(slug, (token) => academicRpc.createPeriod({ institutionSlug: slug, period: periodInput(values) }, { token }), (data) => data.period, 'Periodo creado.');
};

export const setPeriodStatusAction = async (slug: string, id: string, status: string): Promise<AcademicResult<Period>> =>
  ids(id) ? run(slug, (token) => academicRpc.setPeriodStatus({ institutionSlug: slug, id, status }, { token }), (data) => data.period) : notFound;

export const deletePeriodAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  ids(id) ? run(slug, (token) => academicRpc.deletePeriod({ institutionSlug: slug, id }, { token }), () => null, 'Periodo eliminado.') : notFound;

export const updateTermAction = async (slug: string, periodId: string, id: string, values: TermFormValues): Promise<AcademicResult<Term>> =>
  ids(periodId, id)
    ? run(
        slug,
        (token) => academicRpc.updateTerm({ institutionSlug: slug, periodId, id, name: values.name, startsOn: date(values.startsOn), endsOn: date(values.endsOn), status: values.status }, { token }),
        (data) => data.term,
        'Cambios guardados.',
      )
    : notFound;

// ---------- sections ----------

export const createSectionsAction = async (slug: string, periodId: string, values: SectionBatchValues, names: string[]): Promise<AcademicResult<Section[]>> => {
  if (!ids(periodId) || (values.levelId && !ids(values.levelId)) || !ids(...values.gradeIds)) return notFound;
  return run(
    slug,
    (token) =>
      academicRpc.createSections(
        { institutionSlug: slug, periodId, levelId: values.levelId, gradeIds: values.gradeIds, names, shift: values.shift, attentionMode: values.attentionMode, program: values.program, distanceVariant: values.distanceVariant, multigrade: values.multigrade, capacity: toInt(values.capacity) ?? 0, room: values.room },
        { token },
      ),
    (data) => data.sections,
  );
};

export const updateSectionAction = async (slug: string, id: string, values: SectionFormValues): Promise<AcademicResult<Section>> =>
  ids(id)
    ? run(
        slug,
        (token) => academicRpc.updateSection({ institutionSlug: slug, id, section: { name: values.name, shift: values.shift, attentionMode: values.attentionMode, program: values.program, distanceVariant: values.distanceVariant, multigrade: values.multigrade, capacity: toInt(values.capacity) ?? 0, room: values.room } }, { token }),
        (data) => data.section,
        'Cambios guardados.',
      )
    : notFound;

export const deleteSectionAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  ids(id) ? run(slug, (token) => academicRpc.deleteSection({ institutionSlug: slug, id }, { token }), () => null, 'Eliminada.') : notFound;

export const copySectionsAction = async (slug: string, periodId: string, fromPeriodId: string): Promise<AcademicResult<number>> =>
  ids(periodId, fromPeriodId) ? run(slug, (token) => academicRpc.copySections({ institutionSlug: slug, periodId, fromPeriodId }, { token }), (data) => data.added) : notFound;
