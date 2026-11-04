'use client';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { useCallback, useRef, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { createComplaintAction } from '../actions/create-complaint';
import type { ComplaintErrors, ComplaintField, ComplaintFormValues, ComplaintPayload, UseCreateComplaintResult } from '../types';

const initialValues: ComplaintFormValues = {
  fullName: '',
  documentType: 'DNI',
  documentNumber: '',
  address: '',
  phone: '',
  email: '',
  isMinor: false,
  guardianName: '',
  serviceDescription: '',
  amount: '',
  kind: 'RECLAMO',
  detail: '',
  request: '',
  consent: false,
};

const clean = (value: string): string => value.trim().replace(/\s+/g, ' ');

// Validation mirrors the minimum content required for a complaint sheet
const validate = (values: ComplaintFormValues): ComplaintErrors => {
  const errors: ComplaintErrors = {};
  if (clean(values.fullName).length < 3) errors.fullName = 'Ingresa tu nombre completo.';
  if (values.documentType === 'DNI' && !/^\d{8}$/.test(values.documentNumber.trim())) errors.documentNumber = 'El DNI debe tener 8 dígitos.';
  if (values.documentType === 'RUC' && !/^\d{11}$/.test(values.documentNumber.trim())) errors.documentNumber = 'El RUC debe tener 11 dígitos.';
  if (values.documentNumber.trim().length < 6) errors.documentNumber ??= 'Ingresa tu número de documento.';
  if (clean(values.address).length < 5) errors.address = 'Ingresa tu domicilio.';
  if (values.phone.replace(/\D/g, '').length < 9) errors.phone = 'Ingresa un teléfono de al menos 9 dígitos.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Ingresa un correo válido.';
  if (values.isMinor && clean(values.guardianName).length < 3) errors.guardianName = 'Ingresa el nombre del padre, madre o apoderado.';
  if (clean(values.serviceDescription).length < 3) errors.serviceDescription = 'Describe el servicio contratado.';
  if (values.amount && Number.isNaN(Number(values.amount.replace(',', '.')))) errors.amount = 'Ingresa un monto válido.';
  if (clean(values.detail).length < 10) errors.detail = 'Describe lo ocurrido (mínimo 10 caracteres).';
  if (clean(values.request).length < 5) errors.request = 'Indica qué solución solicitas.';
  if (!values.consent) errors.consent = 'Debes confirmar que la información es correcta.';
  return errors;
};

const buildPayload = (values: ComplaintFormValues): ComplaintPayload => ({
  nombre: clean(values.fullName).toUpperCase(),
  tipo_documento: values.documentType,
  numero_documento: values.documentNumber.trim().toUpperCase(),
  domicilio: clean(values.address).toUpperCase(),
  telefono: values.phone.trim().replace(/(?!^\+)[^\d]/g, ''),
  email: values.email.trim().toLowerCase(),
  apoderado: values.isMinor ? clean(values.guardianName).toUpperCase() : null,
  bien_contratado: clean(values.serviceDescription),
  monto_reclamado: values.amount ? Number(values.amount.replace(',', '.')) : null,
  tipo: values.kind,
  detalle: values.detail.trim(),
  pedido: values.request.trim(),
  aceptado_at: new Date().toISOString(),
});

// Owns the complaint sheet state and submission; the API returns the correlative code
export const useCreateComplaint = (): UseCreateComplaintResult => {
  const [values, setValues] = useState<ComplaintFormValues>(initialValues);
  const [errors, setErrors] = useState<ComplaintErrors>({});
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [captchaToken, setCaptchaTokenState] = useState<string | null>(null);

  const setField = useCallback(<K extends ComplaintField>(field: K, value: ComplaintFormValues[K]): void => {
    setValues((current): ComplaintFormValues => ({ ...current, [field]: value }));
    setErrors((current): ComplaintErrors => (field in current ? { ...current, [field]: undefined } : current));
  }, []);

  const setCaptchaToken = useCallback((token: string | null): void => {
    setCaptchaTokenState(token);
    if (token) setErrors((current): ComplaintErrors => ({ ...current, captcha: undefined }));
  }, []);

  const submit = useCallback((): void => {
    const nextErrors = validate(values);
    if (!captchaToken) nextErrors.captcha = 'Completa la verificación de seguridad.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      sileo.warning({ title: 'Revisa la hoja de reclamación', description: Object.keys(nextErrors).length === 1 && nextErrors.captcha ? 'Confirma que no eres un robot antes de enviar.' : 'Hay campos obligatorios sin completar o con errores.' });
      return;
    }

    startTransition(async (): Promise<void> => {
      const result = await createComplaintAction(buildPayload(values), captchaToken ?? '');
      // Turnstile tokens are single use: get a fresh one for the next attempt
      turnstileRef.current?.reset();
      setCaptchaTokenState(null);
      if (!result.ok) {
        sileo.error({ title: 'No se registró la hoja', description: result.message });
        return;
      }
      sileo.success({ title: 'Hoja registrada', description: 'Te enviaremos una copia por correo y responderemos dentro del plazo de ley.' });
      setSubmittedCode(result.code ?? 'Pendiente de asignación');
    });
  }, [values, captchaToken]);

  const reset = useCallback((): void => {
    setValues(initialValues);
    setErrors({});
    setSubmittedCode(null);
  }, []);

  return { values, errors, isPending, submittedCode, turnstileRef, setCaptchaToken, setField, submit, reset };
};
