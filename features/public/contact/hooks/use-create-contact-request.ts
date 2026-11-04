'use client';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { useCallback, useRef, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { createContactRequestAction } from '../actions/create-contact-request';
import type { ContactRequestErrors, ContactRequestField, ContactRequestFormValues, ContactRequestPayload, ModuleInterest, UseCreateContactRequestResult } from '../types';

const initialValues: ContactRequestFormValues = {
  fullName: '',
  position: '',
  institution: '',
  institutionType: '',
  students: '',
  email: '',
  phone: '',
  modules: [],
  message: '',
  consent: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Collapses repeated whitespace that people paste from other documents
const clean = (value: string): string => value.trim().replace(/\s+/g, ' ');

// Field-level validation with the messages shown under each input
const validate = (values: ContactRequestFormValues): ContactRequestErrors => {
  const errors: ContactRequestErrors = {};
  if (clean(values.fullName).length < 3) errors.fullName = 'Ingresa tu nombre completo.';
  if (clean(values.institution).length < 2) errors.institution = 'Ingresa el nombre de tu institución.';
  if (!values.institutionType) errors.institutionType = 'Selecciona el tipo de institución.';
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Ingresa un correo válido.';
  if (values.phone && values.phone.replace(/\D/g, '').length < 9) errors.phone = 'Ingresa un teléfono de al menos 9 dígitos.';
  if (clean(values.message).length < 10) errors.message = 'Cuéntanos en pocas líneas qué necesitas.';
  if (!values.consent) errors.consent = 'Necesitamos tu consentimiento para contactarte.';
  return errors;
};

// Validated form values -> joseph-api payload; only called after validate() passes, so institutionType is set
const toPayload = (values: ContactRequestFormValues): ContactRequestPayload => ({
  nombre: clean(values.fullName),
  cargo: clean(values.position) || null,
  institucion: clean(values.institution),
  tipo_institucion: values.institutionType as ContactRequestPayload['tipo_institucion'],
  estudiantes: values.students || null,
  email: values.email.trim().toLowerCase(),
  telefono: values.phone.trim() || null,
  modulos: values.modules,
  mensaje: values.message.trim(),
  consentimiento_at: new Date().toISOString(),
});

// Owns the contact form state and sends it to joseph-api through the server action
export const useCreateContactRequest = (): UseCreateContactRequestResult => {
  const [values, setValues] = useState<ContactRequestFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactRequestErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [captchaToken, setCaptchaTokenState] = useState<string | null>(null);

  const setField = useCallback(<K extends ContactRequestField>(field: K, value: ContactRequestFormValues[K]): void => {
    setValues((current): ContactRequestFormValues => ({ ...current, [field]: value }));
    // Clear the field error as soon as the user edits it
    setErrors((current): ContactRequestErrors => (field in current ? { ...current, [field]: undefined } : current));
  }, []);

  const setCaptchaToken = useCallback((token: string | null): void => {
    setCaptchaTokenState(token);
    if (token) setErrors((current): ContactRequestErrors => ({ ...current, captcha: undefined }));
  }, []);

  // Modules of interest are optional and multi-select; a Set avoids duplicates on fast double clicks
  const toggleModule = useCallback((code: ModuleInterest, checked: boolean): void => {
    setValues((current): ContactRequestFormValues => ({ ...current, modules: checked ? [...new Set([...current.modules, code])] : current.modules.filter((item): boolean => item !== code) }));
  }, []);

  const submit = useCallback((): void => {
    const nextErrors = validate(values);
    if (!captchaToken) nextErrors.captcha = 'Completa la verificación de seguridad.';
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      sileo.warning({ title: 'Revisa el formulario', description: Object.keys(nextErrors).length === 1 && nextErrors.captcha ? 'Confirma que no eres un robot antes de enviar.' : 'Hay campos obligatorios sin completar o con errores.' });
      return;
    }

    startTransition(async (): Promise<void> => {
      const result = await createContactRequestAction(toPayload(values), captchaToken ?? '');
      // Turnstile tokens are single use: get a fresh one for the next attempt
      turnstileRef.current?.reset();
      setCaptchaTokenState(null);
      if (!result.ok) {
        sileo.error({ title: 'No se envió tu mensaje', description: result.message });
        return;
      }
      setIsSubmitted(true);
      sileo.success({ title: 'Mensaje enviado', description: 'Te responderemos por correo en un día hábil.' });
    });
  }, [values, captchaToken]);

  const reset = useCallback((): void => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitted(false);
  }, []);

  return { values, errors, isPending, isSubmitted, turnstileRef, setCaptchaToken, setField, toggleModule, submit, reset };
};
