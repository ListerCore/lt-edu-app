'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { documentsRpc } from '@/lib/api/grpc/documents';
import type { DocumentVersion, GenerateSchedulesResponse, ListScheduleIssuesResponse, GetScheduleSignersResponse, PdfFile as PdfMessage, Signer } from '@/lib/api/grpc/gen/joseph/documents/v1/documents';

// A file built by the API (PDF unless mime says otherwise), as base64 so it can cross the server action boundary
export interface PdfDownload {
  fileName: string;
  base64: string;
  mime?: string;
}

// Generating a whole section or every timetable takes longer than a plain read, so these calls wait up to a minute

// True when every id is empty or a valid UUID (empty means "all" or "the default")
const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));

// Turns the API's file into what the browser downloads
const toDownload = (f?: PdfMessage): PdfDownload | undefined => (f ? { fileName: f.fileName, base64: Buffer.from(f.content).toString('base64') } : undefined);

// Report cards as PDF: one student's (studentId) or every card of a section (sectionId)
export const reportCardsPdfAction = async (slug: string, q: { sectionId: string; studentId: string; periodId: string; termId: string }): Promise<AcademicResult<PdfDownload>> =>
  optional(q.sectionId, q.studentId, q.periodId, q.termId) && (q.sectionId || q.studentId)
    ? runRpc(slug, (token) => documentsRpc.reportCards({ institutionSlug: slug, ...q }, { token, timeoutMs: 60_000 }), (d) => toDownload(d.file))
    : notFound;

// Published timetables as PDF: by section, grade or teacher (one target or all) or the general one
export const schedulesPdfAction = async (slug: string, periodId: string, mode: string, targetId: string): Promise<AcademicResult<PdfDownload>> =>
  validIds(periodId) && /^(section|grade|teacher|general)$/.test(mode) && /^[\w:-]{0,60}$/.test(targetId)
    ? runRpc(slug, (token) => documentsRpc.schedules({ institutionSlug: slug, periodId, mode, targetId }, { token, timeoutMs: 60_000 }), (d) => toDownload(d.file))
    : notFound;

// An issued acta as PDF
export const recordPdfAction = async (slug: string, id: string): Promise<AcademicResult<PdfDownload>> =>
  validIds(id) ? runRpc(slug, (token) => documentsRpc.record({ institutionSlug: slug, id }, { token, timeoutMs: 60_000 }), (d) => toDownload(d.file)) : notFound;

// A payment receipt as PDF
export const receiptPdfAction = async (slug: string, id: string): Promise<AcademicResult<PdfDownload>> =>
  validIds(id) ? runRpc(slug, (token) => documentsRpc.receipt({ institutionSlug: slug, id }, { token, timeoutMs: 60_000 }), (d) => toDownload(d.file)) : notFound;

const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// The period's timetable as an Excel workbook
export const schedulesXlsxAction = async (slug: string, periodId: string): Promise<AcademicResult<PdfDownload>> =>
  validIds(periodId)
    ? runRpc(
        slug,
        (token) => documentsRpc.schedulesXlsx({ institutionSlug: slug, periodId }, { token, timeoutMs: 60_000 }),
        (d) => {
          const f = toDownload(d.file);
          return f && { ...f, mime: XLSX };
        },
      )
    : notFound;

// Who signs the timetables (and, for managers, the staff to choose from)
export const scheduleSignersAction = async (slug: string): Promise<AcademicResult<GetScheduleSignersResponse>> => runRpc(slug, (token) => documentsRpc.signers({ institutionSlug: slug }, { token }), (d) => d);

// Replaces the signers, in signing order
export const setScheduleSignersAction = async (slug: string, signers: Array<Pick<Signer, 'staffId' | 'position'>>): Promise<AcademicResult<Signer[]>> =>
  signers.every((x) => validIds(x.staffId))
    ? runRpc(slug, (token) => documentsRpc.setSigners({ institutionSlug: slug, signers: signers.map((x) => ({ staffId: x.staffId, position: x.position.slice(0, 120), name: '' })) }, { token }), (d) => d.signers, 'Firmantes guardados.')
    : notFound;

// The timetable publications of a period with their versions, signatures and history
export const scheduleIssuesAction = async (slug: string, periodId: string): Promise<AcademicResult<ListScheduleIssuesResponse>> =>
  validIds(periodId) ? runRpc(slug, (token) => documentsRpc.issues({ institutionSlug: slug, periodId }, { token }), (d) => d) : notFound;

// Freezes the timetables of a mode and target as a new version waiting for signatures
export const generateSchedulesAction = async (slug: string, q: { periodId: string; mode: string; targetId: string; note: string }): Promise<AcademicResult<GenerateSchedulesResponse>> =>
  validIds(q.periodId) && /^(section|grade|teacher|general)$/.test(q.mode) && /^[\w:-]{0,60}$/.test(q.targetId)
    ? runRpc(slug, (token) => documentsRpc.generate({ institutionSlug: slug, ...q, note: q.note.slice(0, 300) }, { token, timeoutMs: 60_000 }), (d) => d)
    : notFound;

// Signs a pending version as the viewer
export const signVersionAction = async (slug: string, versionId: string): Promise<AcademicResult<{ version?: DocumentVersion; published: boolean }>> =>
  validIds(versionId) ? runRpc(slug, (token) => documentsRpc.sign({ institutionSlug: slug, versionId }, { token }), (d) => d) : notFound;

// The PDF of one version, with its QR and signatures as they stand
export const versionPdfAction = async (slug: string, versionId: string): Promise<AcademicResult<PdfDownload>> =>
  validIds(versionId) ? runRpc(slug, (token) => documentsRpc.versionPdf({ institutionSlug: slug, versionId }, { token, timeoutMs: 60_000 }), (d) => toDownload(d.file)) : notFound;
