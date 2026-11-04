'use server';

import { apiRequest } from '@/lib/api/server';
import { siteConfig } from '@/lib/site';
import type { ContactRequestPayload, CreateContactRequestResponse } from '../types';

// Server Functions are reachable by direct POST, so required fields are re-checked here (the API validates fully)
const isValidPayload = (payload: ContactRequestPayload): boolean => [payload.nombre, payload.relacion, payload.email, payload.motivo, payload.mensaje, payload.consentimiento_at].every((value): boolean => typeof value === 'string' && value.trim().length > 0);

// POST /contact-requests on joseph-api, behind Turnstile; secretaría receives it in the panel
export const createContactRequestAction = async (payload: ContactRequestPayload, captchaToken: string): Promise<CreateContactRequestResponse> => {
  if (!isValidPayload(payload)) return { ok: false, message: 'Revisa los datos del formulario e inténtalo de nuevo.' };

  if (!captchaToken) return { ok: false, message: 'Completa la verificación de seguridad.' };

  if (!process.env.APP__API__URL) {
    // Development only: production must never acknowledge a message it did not store
    if (process.env.NODE_ENV !== 'production') {
      console.info('[contact-request] APP__API__URL not set, request not persisted', payload);
      return { ok: true, message: 'Mensaje recibido (modo desarrollo).' };
    }
    return { ok: false, message: `No pudimos enviar tu mensaje. Escríbenos a ${siteConfig.emails.info}.` };
  }

  const result = await apiRequest<{ id: string }>('/contact-requests', { method: 'POST', body: payload, captchaToken });
  return result.ok ? { ok: true, message: 'Mensaje recibido.' } : { ok: false, message: result.error.message };
};
