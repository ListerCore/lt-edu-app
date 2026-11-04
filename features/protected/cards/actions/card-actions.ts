'use server';

import type { InstitutionType, Role } from '@/features/protected/dashboard/types';
import { paginate } from '@/lib/api/list';
import { demoCardholders } from '../data/cards-data';
import type { CardActionResult, Cardholder, CardholdersResponse, GetCardholdersParams } from '../types';

// Simulated latency so loading states are visible; replaced by joseph-api calls later
const simulate = async (ms = 350): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Accent-insensitive comparison, so "jose" finds "José"
const fold = (value: string): string => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// GET /cardholders?group=&search=&page=&page_size= : one page plus meta { search_query, filter, pagination }
export const getCardholdersAction = async ({ institutionType, group, search, page, pageSize }: GetCardholdersParams): Promise<CardActionResult<CardholdersResponse>> => {
  await simulate();
  const query = search.trim();
  const needle = fold(query);
  const matches = demoCardholders(institutionType).filter((person) => person.group === group && (!needle || fold(`${person.name} ${person.code} ${person.detail}`).includes(needle)));
  const { data, pagination } = paginate(matches, page, pageSize);
  return { ok: true, message: 'ok', data: { data, meta: { search_query: query, filter: { group }, pagination } } };
};

// Which roster entry is the signed-in person (simulated until the session carries it): students and guardians
// get a student card, staff roles their own fotocheck
export const getOwnCardholderAction = async (institutionType: InstitutionType, role: Role): Promise<CardActionResult<Cardholder>> => {
  await simulate(250);
  const roster = demoCardholders(institutionType);
  const students = roster.filter(({ group }) => group === 'students');
  const staff = roster.filter(({ group }) => group === 'staff');
  const own = role === 'student' || role === 'guardian' ? students[0] : role === 'teacher' ? staff[1] : role === 'tutor' ? staff[2] : staff[0];
  return own ? { ok: true, message: 'ok', data: own } : { ok: false, message: 'No encontramos tu carnet.' };
};

// Simulated: joseph-api will receive the file (multipart) and return the stored photo URL
export const updateCardholderPhotoAction = async (id: string, photoUrl: string): Promise<CardActionResult<{ id: string; photoUrl: string }>> => {
  await simulate(500);
  return { ok: true, message: 'Foto actualizada.', data: { id, photoUrl } };
};
