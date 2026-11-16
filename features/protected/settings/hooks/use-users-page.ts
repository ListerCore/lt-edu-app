'use client';

import { useMemo, useState } from 'react';
import type { Member, MemberGroup, UsersPageState } from '../types';
import { useGetMembers } from './use-get-members';

// Lowercase without accents, so "maria" finds "María"
const fold = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

// One row per person (email): their roles and invitations together, searchable by name or email and filterable by
// role. People who already have an account come first, then the invitations still waiting for sign-up
export const useUsersPage = (): UsersPageState => {
  const remote = useGetMembers();
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const groups = useMemo((): MemberGroup[] => {
    const data = remote.data;
    if (!data) return [];
    const byEmail = new Map<string, MemberGroup>();
    data.members.forEach((m: Member): void => {
      const group = byEmail.get(m.email) ?? { email: m.email, fullName: m.fullName, userId: m.userId, lastSignInAt: m.lastSignInAt, pending: true, isSelf: false, accesses: [] };
      group.accesses.push(m);
      if (!m.pending) {
        group.pending = false;
        group.fullName ||= m.fullName;
        group.userId ||= m.userId;
        group.lastSignInAt ||= m.lastSignInAt;
      }
      group.isSelf = group.userId !== '' && group.userId === data.selfUserId;
      byEmail.set(m.email, group);
    });
    const needle = fold(query.trim());
    return [...byEmail.values()]
      .filter((g) => !roleFilter || g.accesses.some((a) => a.role === roleFilter))
      .filter((g) => !needle || fold(`${g.fullName} ${g.email}`).includes(needle))
      .sort((a, b) => Number(a.pending) - Number(b.pending) || (a.fullName || a.email).localeCompare(b.fullName || b.email, 'es'));
  }, [remote.data, query, roleFilter]);

  return { ...remote, groups, query, setQuery, roleFilter, setRoleFilter, grantableRoles: remote.data?.grantableRoles ?? [] };
};
