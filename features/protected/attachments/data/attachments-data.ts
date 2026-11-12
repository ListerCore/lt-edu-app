import { File as FileIcon, FileImage, FileSpreadsheet, FileText } from 'lucide';
import type { ModuleKey } from '@/features/protected/dashboard/types';
import type { AttachmentCategory, AttachmentFileKind, AttachmentFileMeta, AttachmentOwnerKind } from '../types';

// joseph-api enforces the same limits (internal/core/service/attachment_service.go)
export const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
export const ATTACHMENTS_PER_UPLOAD = 10;
// One upload travels through a server action (45 MB body limit in next.config.ts)
export const ATTACHMENTS_UPLOAD_MAX_BYTES = 40 * 1024 * 1024;

export const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Accepted by content type and, when the browser reports none (common for .docx/.xlsx), by extension
const typeKinds: Record<string, AttachmentFileKind> = {
  'application/pdf': 'pdf',
  'image/png': 'image',
  'image/jpeg': 'image',
  'image/webp': 'image',
  [DOCX_TYPE]: 'word',
  [XLSX_TYPE]: 'excel',
};
const extensionKinds: Record<string, AttachmentFileKind> = { pdf: 'pdf', png: 'image', jpg: 'image', jpeg: 'image', webp: 'image', docx: 'word', xlsx: 'excel' };

export const ATTACHMENT_ACCEPT = [...Object.keys(typeKinds), ...Object.keys(extensionKinds).map((ext) => `.${ext}`)].join(',');
export const ATTACHMENT_TYPES_HINT = 'PDF, imágenes (PNG, JPG, WebP), Word (.docx) o Excel (.xlsx) · hasta 10 MB cada uno';

// Kind of a picked file, or null when joseph-api would refuse it (it sniffs the bytes again anyway)
export const fileKindOfUpload = (file: File): AttachmentFileKind | null => {
  const byType = typeKinds[file.type];
  if (byType) return byType;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return file.type === '' || file.type === 'application/octet-stream' || file.type === 'application/zip' ? (extensionKinds[ext] ?? null) : null;
};

// Kind of a stored file, from the type joseph-api detected
export const fileKindOf = (contentType: string): AttachmentFileKind => typeKinds[contentType] ?? 'other';

export const fileKindMeta: Record<AttachmentFileKind, AttachmentFileMeta> = {
  pdf: { label: 'PDF', icon: FileText, className: 'bg-destructive/10 text-destructive' },
  image: { label: 'Imagen', icon: FileImage, className: 'bg-warning/12 text-warning' },
  word: { label: 'Word', icon: FileText, className: 'bg-brand-soft text-brand' },
  excel: { label: 'Excel', icon: FileSpreadsheet, className: 'bg-success/12 text-success' },
  other: { label: 'Archivo', icon: FileIcon, className: 'bg-accent text-foreground' },
};

export const categoryLabels: Record<AttachmentCategory, string> = {
  dni: 'DNI',
  birth_certificate: 'Partida de nacimiento',
  study_certificate: 'Certificado de estudios',
  transfer_certificate: 'Constancia de traslado',
  enrollment_form: 'Ficha de matrícula',
  medical_report: 'Informe médico',
  disability_certificate: 'Certificado de discapacidad',
  vaccination_card: 'Carné de vacunación',
  photo: 'Fotografía',
  cv: 'Currículum',
  professional_title: 'Título profesional',
  contract: 'Contrato',
  resolution: 'Resolución',
  certificate: 'Certificado o constancia',
  criminal_record: 'Antecedentes',
  minutes: 'Acta',
  report: 'Informe',
  agreement: 'Acuerdo o convenio',
  evidence: 'Evidencia',
  evaluation: 'Evaluación',
  consent: 'Consentimiento informado',
  referral: 'Derivación',
  plan: 'Plan',
  annex: 'Anexo',
  calendar: 'Calendario',
  thesis: 'Trabajo de titulación',
  payment_receipt: 'Comprobante de pago',
  agenda: 'Agenda',
  financial_statement: 'Estado de cuentas',
  attendance_list: 'Lista de asistencia',
  other: 'Otro',
};

// Unknown codes (a category added in joseph-api first) still read as something
export const categoryLabel = (value: string): string => categoryLabels[value as AttachmentCategory] ?? 'Otro';

// Module whose view permission shows the panel of each owner kind; kinds missing here are always shown (the API decides)
export const ownerKindModules: Partial<Record<AttachmentOwnerKind, ModuleKey>> = {
  enrollment: 'enrollment',
  student: 'students',
  staff: 'staff',
  tutoring: 'tutoring',
  discipline: 'discipline',
  psychology: 'psychology',
  individual_plan: 'individual-plans',
  therapy: 'therapies',
  progress_report: 'progress-reports',
  inclusion_support: 'inclusion-support',
  period: 'periods',
  closing: 'closing',
  internship: 'internships',
  degree: 'degrees',
  attendance_justification: 'student-attendance',
  apafa_meeting: 'apafa',
};

export const attachmentFileUrl = (id: string): string => `/api/files/attachments/${id}`;

// "12 nov 2026" in Lima time, the same on the server and in the browser
const dateFormat = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Lima' });
export const formatAttachmentDate = (iso: string): string => dateFormat.format(new Date(iso));
