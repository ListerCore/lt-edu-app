'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { closingRpc } from '@/lib/api/grpc/closing';
import type { ClosingOverview, ExportFile, RecordContent, RecordData, RecordInfo, SectionClosing, UnitClosing } from '../types';

const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));

export const getClosingAction = async (slug: string, periodId: string): Promise<AcademicResult<ClosingOverview>> =>
  optional(periodId) ? runRpc(slug, (token) => closingRpc.overview({ institutionSlug: slug, periodId }, { token }), (d) => d) : notFound;

export const getSectionClosingAction = async (slug: string, sectionId: string): Promise<AcademicResult<SectionClosing>> =>
  validIds(sectionId) ? runRpc(slug, (token) => closingRpc.section({ institutionSlug: slug, sectionId }, { token }), (d) => d.closing) : notFound;

export const decideAction = async (slug: string, sectionId: string, studentId: string, situation: string, note: string): Promise<AcademicResult<SectionClosing>> =>
  validIds(sectionId, studentId)
    ? runRpc(slug, (token) => closingRpc.decide({ institutionSlug: slug, sectionId, studentId, situation, note: note.slice(0, 500) }, { token }), (d) => d.closing, situation ? 'Decisión del equipo registrada.' : 'Vuelve a la situación que dan las reglas.')
    : notFound;

export const confirmSectionAction = async (slug: string, sectionId: string): Promise<AcademicResult<SectionClosing>> =>
  validIds(sectionId) ? runRpc(slug, (token) => closingRpc.confirm({ institutionSlug: slug, sectionId }, { token }), (d) => d.closing, 'Resultados confirmados.') : notFound;

export const saveRecoveryAction = async (slug: string, sectionId: string, studentId: string, levels: Record<string, string>): Promise<AcademicResult<SectionClosing>> =>
  validIds(sectionId, studentId)
    ? runRpc(slug, (token) => closingRpc.saveRecovery({ institutionSlug: slug, sectionId, studentId, levels: Object.fromEntries(Object.entries(levels).filter(([k]) => validIds(k))) }, { token }), (d) => d.closing, 'Recuperación registrada.')
    : notFound;

export const getUnitClosingAction = async (slug: string, assignmentId: string): Promise<AcademicResult<UnitClosing>> =>
  validIds(assignmentId) ? runRpc(slug, (token) => closingRpc.unit({ institutionSlug: slug, assignmentId }, { token }), (d) => d.closing) : notFound;

export const confirmUnitAction = async (slug: string, assignmentId: string): Promise<AcademicResult<UnitClosing>> =>
  validIds(assignmentId) ? runRpc(slug, (token) => closingRpc.confirmUnit({ institutionSlug: slug, assignmentId }, { token }), (d) => d.closing, 'Resultados de la unidad confirmados.') : notFound;

export const saveUnitRecoveryAction = async (slug: string, assignmentId: string, studentId: string, score: number | null): Promise<AcademicResult<UnitClosing>> =>
  validIds(assignmentId, studentId) ? runRpc(slug, (token) => closingRpc.saveUnitRecovery({ institutionSlug: slug, assignmentId, studentId, score: score ?? undefined }, { token }), (d) => d.closing) : notFound;

export const issueRecordAction = async (slug: string, sectionId: string, assignmentId: string, kind: 'final' | 'complementary' | 'unit'): Promise<AcademicResult<RecordInfo>> =>
  optional(sectionId, assignmentId) ? runRpc(slug, (token) => closingRpc.issue({ institutionSlug: slug, sectionId, assignmentId, kind }, { token }), (d) => d.record) : notFound;

export const getRecordAction = async (slug: string, id: string): Promise<AcademicResult<RecordData>> =>
  validIds(id)
    ? runRpc(slug, (token) => closingRpc.record({ institutionSlug: slug, id }, { token }), (d) => {
        if (!d.record) return undefined;
        try {
          return { record: d.record, content: JSON.parse(d.content) as RecordContent };
        } catch {
          return undefined;
        }
      })
    : notFound;

export const exportResultsAction = async (slug: string, sectionId: string, assignmentId: string): Promise<AcademicResult<ExportFile>> =>
  optional(sectionId, assignmentId) ? runRpc(slug, (token) => closingRpc.export({ institutionSlug: slug, sectionId, assignmentId }, { token }), (d) => ({ fileName: d.fileName, base64: Buffer.from(d.content).toString('base64') })) : notFound;
