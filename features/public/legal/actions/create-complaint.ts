'use server';

import { apiRequest } from '@/lib/api/server';
import { siteConfig } from '@/lib/site';
import type { ComplaintPayload, CreateComplaintResponse } from '../types';

// Server Functions are reachable by direct POST, so required fields are re-checked here
const isValidPayload = (payload: ComplaintPayload): boolean => {
  const required = [payload.nombre, payload.numero_documento, payload.domicilio, payload.telefono, payload.email, payload.bien_contratado, payload.detalle, payload.pedido, payload.aceptado_at];
  return required.every((value): boolean => typeof value === 'string' && value.trim().length > 0) && (payload.tipo === 'RECLAMO' || payload.tipo === 'QUEJA');
};

// POST /complaints on lt-edu-api, behind Turnstile; the API assigns the correlative sheet number
export const createComplaintAction = async (payload: ComplaintPayload, captchaToken: string): Promise<CreateComplaintResponse> => {
  if (!isValidPayload(payload)) return { ok: false, message: 'Revisa los datos de la hoja de reclamación.' };

  if (!captchaToken) return { ok: false, message: 'Completa la verificación de seguridad.' };

  const apiUrl = process.env.APP__API__URL;

  if (!apiUrl) {
    // Development only: production must never acknowledge a complaint it did not store
    if (process.env.NODE_ENV !== 'production') {
      console.info('[complaint] APP__API__URL not set, complaint not persisted', payload);
      return { ok: true, message: 'Hoja registrada (modo desarrollo).', code: 'DEV-000000' };
    }
    return { ok: false, message: `No pudimos registrar tu reclamo en línea. Escríbenos a ${siteConfig.emails.support}.` };
  }

  const result = await apiRequest<{ id: string; codigo: string }>('/complaints', { method: 'POST', body: payload, captchaToken });
  return result.ok ? { ok: true, message: 'Hoja registrada.', code: result.data.codigo } : { ok: false, message: result.error.message };
};
