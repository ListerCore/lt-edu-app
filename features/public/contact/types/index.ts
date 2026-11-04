import type { TurnstileInstance } from '@marsidev/react-turnstile';
import type { RefObject } from 'react';
import type { IconInput } from 'morphicons/react';

export type InstitutionTypeCode = 'EBR' | 'EBA' | 'EBE' | 'CEPRE' | 'IEST';

export type StudentRange = 'lt-200' | '200-500' | '500-1000' | 'gt-1000';

export type ModuleInterest = 'attendance' | 'grades' | 'periods' | 'enrollment' | 'cards' | 'tutoring' | 'payments' | 'reports';

export interface Option<T extends string> {
  value: T;
  label: string;
}

export interface ContactAssurance {
  icon: IconInput;
  title: string;
  description: string;
}

export interface ContactChannel {
  icon: IconInput;
  label: string;
  description: string;
  email: string;
}

// Raw values as the form holds them
export interface ContactRequestFormValues {
  fullName: string;
  position: string;
  institution: string;
  institutionType: InstitutionTypeCode | '';
  students: StudentRange | '';
  email: string;
  phone: string;
  modules: ModuleInterest[];
  message: string;
  consent: boolean;
}

export type ContactRequestField = keyof ContactRequestFormValues;

export type ContactRequestErrors = Partial<Record<ContactRequestField | 'captcha', string>>;

// Shape sent to joseph-api, snake_case like the other payloads
export interface ContactRequestPayload {
  nombre: string;
  cargo: string | null;
  institucion: string;
  tipo_institucion: InstitutionTypeCode;
  estudiantes: StudentRange | null;
  email: string;
  telefono: string | null;
  modulos: ModuleInterest[];
  mensaje: string;
  consentimiento_at: string;
}

export interface CreateContactRequestResponse {
  ok: boolean;
  message: string;
}

export interface UseCreateContactRequestResult {
  values: ContactRequestFormValues;
  errors: ContactRequestErrors;
  isPending: boolean;
  isSubmitted: boolean;
  setField: <K extends ContactRequestField>(field: K, value: ContactRequestFormValues[K]) => void;
  toggleModule: (code: ModuleInterest, checked: boolean) => void;
  // Turnstile widget and its single-use token (the token is sent with the form, joseph-api verifies it)
  turnstileRef: RefObject<TurnstileInstance | null>;
  setCaptchaToken: (token: string | null) => void;
  submit: () => void;
  reset: () => void;
}

export interface ContactRequestSuccessProps {
  email: string;
  onReset: () => void;
}
