'use server';

import type { InstitutionType, Role } from '@/features/protected/dashboard/types';
import { buildAccountProfile } from '../data/account-data';
import type { AccountActionResult, AccountContact, AccountProfile } from '../types';

// Simulated latency so loading states are visible; replaced by joseph-api calls later
const simulate = async (ms = 400): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /me: everything the institution has on file for the signed-in person
export const getAccountProfileAction = async (institutionType: InstitutionType, role: Role): Promise<AccountActionResult<AccountProfile>> => {
  await simulate();
  return { ok: true, message: 'ok', data: buildAccountProfile(institutionType, role, Date.now()) };
};

// PATCH /me/contact: the person keeps their own contact data up to date (simulated, nothing is stored)
export const updateAccountContactAction = async (contact: AccountContact): Promise<AccountActionResult<AccountContact>> => {
  await simulate(600);
  if (!EMAIL_PATTERN.test(contact.email.trim())) return { ok: false, message: 'Ingresa un correo válido.' };
  return { ok: true, message: 'Datos actualizados.', data: { email: contact.email.trim().toLowerCase(), phone: contact.phone.trim(), address: contact.address.trim() } };
};
