'use server';

import { cookies } from 'next/headers';
import { demoInstitutionSlugs } from '@/features/protected/academic/data/academic-data';
import type { InstitutionType, Role } from '@/features/protected/dashboard/types';
import { placeLine } from '@/features/protected/people/data/people-data';
import { peopleRpc } from '@/lib/api/grpc/people';
import { staffRpc } from '@/lib/api/grpc/teaching';
import { paginate, type Pagination } from '@/lib/api/list';
import { SESSION_COOKIE } from '@/lib/auth/cookies';
import { demoCardholders, ownCardholderFor } from '../data/cardholders-roster';
import type { CardActionResult, Cardholder, CardholdersResponse, GetCardholdersParams } from '../types';

// Simulated latency so loading states are visible; replaced by joseph-api calls later
const simulate = async (ms = 350): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Accent-insensitive comparison, so "jose" finds "José"
const fold = (value: string): string => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// Students come from joseph-api (people.students with their enrollment in the running period and main guardian)
const realStudents = async ({ institutionType, search, page, pageSize }: GetCardholdersParams): Promise<CardActionResult<CardholdersResponse>> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return { ok: false, message: 'Tu sesión venció. Ingresa de nuevo.' };
  const slug = demoInstitutionSlugs[institutionType];
  const query = search.trim().slice(0, 80);
  const context = await peopleRpc.context({ institutionSlug: slug }, { token });
  if (!context.ok) return { ok: false, message: context.error.message };
  const period = context.data.periods.find((p) => p.status === 'active');
  const current = Math.max(1, page);
  const result = await peopleRpc.listStudents({ institutionSlug: slug, query, status: 'active', periodId: period?.id ?? '', levelId: '', gradeId: '', sectionId: '', notEnrolled: false, limit: pageSize, offset: (current - 1) * pageSize }, { token });
  if (!result.ok) return { ok: false, message: result.error.message };
  const section = context.data.context?.vocabulary?.section ?? 'Sección';
  const data: Cardholder[] = result.data.students.map((s) => ({
    id: s.id,
    group: 'students',
    name: [s.givenNames, s.paternalSurname, s.maternalSurname].filter(Boolean).join(' '),
    detail: placeLine(s.enrollment, section),
    code: s.code,
    documentNumber: s.documentNumber,
    photoUrl: null,
    emergencyName: s.primaryGuardianName ? `${s.primaryGuardianName} (apoderado)` : 'Sin apoderado registrado',
    emergencyPhone: s.primaryGuardianPhone || '—',
  }));
  const totalPages = Math.max(1, Math.ceil(result.data.total / pageSize));
  const pagination: Pagination = { has_prev_page: current > 1, has_next_page: current < totalPages, page_size: pageSize, current_page: current, total_items: result.data.total, total_pages: totalPages };
  return { ok: true, message: 'ok', data: { data, meta: { search_query: query, filter: { group: 'students' }, pagination } } };
};

// Staff come from joseph-api too (people.staff), with their job as the card detail
const realStaff = async ({ institutionType, search, page, pageSize }: GetCardholdersParams): Promise<CardActionResult<CardholdersResponse>> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return { ok: false, message: 'Tu sesión venció. Ingresa de nuevo.' };
  const query = search.trim().slice(0, 80);
  const current = Math.max(1, page);
  const result = await staffRpc.list({ institutionSlug: demoInstitutionSlugs[institutionType], query, status: 'active', teachersOnly: false, limit: pageSize, offset: (current - 1) * pageSize }, { token });
  if (!result.ok) return { ok: false, message: result.error.message };
  const data: Cardholder[] = result.data.staff.map((s) => ({
    id: s.id,
    group: 'staff',
    name: `${s.givenNames} ${s.surnames}`,
    detail: s.isTeacher && s.specialty ? `${s.position} · ${s.specialty}` : s.position,
    code: s.code,
    documentNumber: s.documentNumber,
    photoUrl: null,
    emergencyName: 'Secretaría de la institución',
    emergencyPhone: s.phone || '—',
  }));
  const totalPages = Math.max(1, Math.ceil(result.data.total / pageSize));
  const pagination: Pagination = { has_prev_page: current > 1, has_next_page: current < totalPages, page_size: pageSize, current_page: current, total_items: result.data.total, total_pages: totalPages };
  return { ok: true, message: 'ok', data: { data, meta: { search_query: query, filter: { group: 'staff' }, pagination } } };
};

// GET /cardholders?group=&search=&page=&page_size= : one page plus meta { search_query, filter, pagination }
export const getCardholdersAction = async (params: GetCardholdersParams): Promise<CardActionResult<CardholdersResponse>> => {
  const { institutionType, group, search, page, pageSize } = params;
  if (group === 'students') return realStudents(params);
  if (group === 'staff') return realStaff(params);
  await simulate();
  const query = search.trim();
  const needle = fold(query);
  const matches = demoCardholders(institutionType).filter((person) => person.group === group && (!needle || fold(`${person.name} ${person.code} ${person.detail}`).includes(needle)));
  const { data, pagination } = paginate(matches, page, pageSize);
  return { ok: true, message: 'ok', data: { data, meta: { search_query: query, filter: { group }, pagination } } };
};

// The signed-in person's own card (the guardian's child for guardians)
export const getOwnCardholderAction = async (institutionType: InstitutionType, role: Role): Promise<CardActionResult<Cardholder>> => {
  await simulate(250);
  const own = ownCardholderFor(institutionType, role);
  return own ? { ok: true, message: 'ok', data: own } : { ok: false, message: 'No encontramos tu carnet.' };
};

// Simulated: joseph-api will receive the file (multipart) and return the stored photo URL
export const updateCardholderPhotoAction = async (id: string, photoUrl: string): Promise<CardActionResult<{ id: string; photoUrl: string }>> => {
  await simulate(500);
  return { ok: true, message: 'Foto actualizada.', data: { id, photoUrl } };
};
