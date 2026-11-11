'use server';

import { staffRpc } from '@/lib/api/grpc/teaching';
import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { notFound, runRpc, toInt, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { STAFF_PAGE_SIZE } from '../data/staff-data';
import type { Staff, StaffDetail, StaffFormValues, StaffPage, StaffQuery } from '../types';

export const getStaffListAction = async (slug: string, q: StaffQuery): Promise<AcademicResult<StaffPage>> =>
  runRpc(
    slug,
    (token) => staffRpc.list({ institutionSlug: slug, query: q.query.slice(0, 80), status: q.status, teachersOnly: q.teachersOnly, limit: STAFF_PAGE_SIZE, offset: Math.max(0, q.page - 1) * STAFF_PAGE_SIZE }, { token }),
    (d) => ({ staff: d.staff, total: d.total, canManage: d.canManage, canGrant: d.canGrant }),
  );

export const getStaffAction = async (slug: string, id: string): Promise<AcademicResult<StaffDetail>> =>
  validIds(id) ? runRpc(slug, (token) => staffRpc.get({ institutionSlug: slug, id }, { token }), (d) => (d.staff ? { staff: d.staff, assignments: d.assignments, canManage: d.canManage, canGrant: d.canGrant } : undefined)) : notFound;

const input = (v: StaffFormValues) => ({ ...v, maxWeeklyHours: v.isTeacher ? toInt(v.maxWeeklyHours) : undefined, hiredOn: DATE_PATTERN.test(v.hiredOn) ? v.hiredOn : '' });

export const saveStaffAction = async (slug: string, id: string | null, values: StaffFormValues): Promise<AcademicResult<Staff>> => {
  if (id && !validIds(id)) return notFound;
  return id
    ? runRpc(slug, (token) => staffRpc.update({ institutionSlug: slug, id, staff: input(values) }, { token }), (d) => d.staff, 'Datos guardados.')
    : runRpc(slug, (token) => staffRpc.create({ institutionSlug: slug, staff: input(values) }, { token }), (d) => d.staff, 'Registrado.');
};

export const deleteStaffAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => staffRpc.remove({ institutionSlug: slug, id }, { token }), () => null, 'Eliminado.') : notFound;

export const grantRoleAction = async (slug: string, id: string, role: string): Promise<AcademicResult<Staff>> =>
  validIds(id) ? runRpc(slug, (token) => staffRpc.grantRole({ institutionSlug: slug, id, role }, { token }), (d) => d.staff, 'Rol otorgado.') : notFound;
