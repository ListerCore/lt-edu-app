import type { TurnstileInstance } from '@marsidev/react-turnstile';
import type { ReactNode, RefObject } from 'react';

export interface LegalSection {
  id: string;
  title: string;
}

export interface LegalPageProps {
  code: string;
  eyebrow: string;
  title: string;
  highlight: string;
  summary: string;
  updatedAt: string;
  sections: LegalSection[];
  children: ReactNode;
}

export interface LegalBlockProps {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
}

export type DocumentType = 'DNI' | 'CE' | 'PASAPORTE' | 'RUC';

export type ComplaintKind = 'RECLAMO' | 'QUEJA';

// Raw values as the form holds them
export interface ComplaintFormValues {
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  isMinor: boolean;
  guardianName: string;
  serviceDescription: string;
  amount: string;
  kind: ComplaintKind;
  detail: string;
  request: string;
  consent: boolean;
}

export type ComplaintField = keyof ComplaintFormValues;

export type ComplaintErrors = Partial<Record<ComplaintField | 'captcha', string>>;

export interface ComplaintPayload {
  nombre: string;
  tipo_documento: DocumentType;
  numero_documento: string;
  domicilio: string;
  telefono: string;
  email: string;
  apoderado: string | null;
  bien_contratado: string;
  monto_reclamado: number | null;
  tipo: ComplaintKind;
  detalle: string;
  pedido: string;
  aceptado_at: string;
}

export interface CreateComplaintResponse {
  ok: boolean;
  message: string;
  code?: string;
}

export interface UseCreateComplaintResult {
  values: ComplaintFormValues;
  errors: ComplaintErrors;
  isPending: boolean;
  submittedCode: string | null;
  setField: <K extends ComplaintField>(field: K, value: ComplaintFormValues[K]) => void;
  // Turnstile widget and its single-use token (the token is sent with the form, lister-api verifies it)
  turnstileRef: RefObject<TurnstileInstance | null>;
  setCaptchaToken: (token: string | null) => void;
  submit: () => void;
  reset: () => void;
}
