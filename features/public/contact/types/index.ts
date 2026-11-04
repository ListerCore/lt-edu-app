import type { TurnstileInstance } from '@marsidev/react-turnstile';
import type { RefObject } from 'react';
import type { IconInput } from 'morphicons/react';

// Who is writing: the applicant, a family member or someone else
export type ContactRelation = 'applicant' | 'guardian' | 'other';

export type ContactTopic = 'admission' | 'academic' | 'payments' | 'documents' | 'platform' | 'other';

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
  relation: ContactRelation | '';
  email: string;
  phone: string;
  topic: ContactTopic | '';
  interest: string;
  message: string;
  consent: boolean;
}

export type ContactRequestField = keyof ContactRequestFormValues;

export type ContactRequestErrors = Partial<Record<ContactRequestField | 'captcha', string>>;

// Shape sent to joseph-api, snake_case like the other payloads
export interface ContactRequestPayload {
  nombre: string;
  relacion: ContactRelation;
  email: string;
  telefono: string | null;
  motivo: ContactTopic;
  interes: string | null;
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

export interface OfficeMapProps {
  className?: string;
  zoom?: number;
}
