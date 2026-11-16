'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { getAuditEventsAction } from '../actions/get-audit-events';
import { auditActionClass, auditActionLabels, auditFieldLabels, auditModuleLabels, memberRoleLabels } from '../data/settings-data';
import type { AuditEvent, AuditFilters, AuditPageState, AuditRow } from '../types';

const EMPTY_FILTERS: AuditFilters = { module: '', from: '', to: '' };

// Lima time, the same on the server and in the browser
const timeFormat = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' });
const dayFormat = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' });

// The detail JSON ({"field": [before, after]}) as readable rows; anything else is left out
const changesOf = (json: string): AuditRow['changes'] => {
  try {
    const parsed: unknown = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') return [];
    return Object.entries(parsed as Record<string, unknown>)
      .filter((entry): entry is [string, [unknown, unknown]] => Array.isArray(entry[1]) && entry[1].length === 2)
      .map(([field, [before, after]]) => ({ field: auditFieldLabels[field] ?? field, before: String(before || '—'), after: String(after || '—') }));
  } catch {
    return [];
  }
};

const toRow = (e: AuditEvent): AuditRow => {
  const at = new Date(e.createdAt);
  return {
    id: e.id,
    when: timeFormat.format(at),
    day: dayFormat.format(at),
    who: e.userName || 'Cuenta eliminada',
    roleLabel: memberRoleLabels[e.role] ?? e.role,
    moduleLabel: auditModuleLabels[e.module] ?? e.module,
    actionLabel: auditActionLabels[e.action] ?? e.action,
    actionClass: auditActionClass[e.action] ?? auditActionClass.other,
    summary: e.summary,
    changes: changesOf(e.changesJson),
  };
};

interface AuditState {
  // Filters + reload count the list belongs to; while it differs from the current one the page is loading
  key: string;
  events: AuditEvent[];
  hasMore: boolean;
  cursor: { at: string; id: string } | null;
  error: string | null;
}

const EMPTY_STATE: AuditState = { key: '', events: [], hasMore: false, cursor: null, error: null };

// The audit log page by page, newest first: filters reset the list, "load more" follows the cursor of the last page
export const useGetAuditEvents = (): AuditPageState => {
  const slug = useInstitutionSlug();
  const [filters, setFilters] = useState<AuditFilters>(EMPTY_FILTERS);
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<AuditState>(EMPTY_STATE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const key = `${slug}|${filters.module}|${filters.from}|${filters.to}|${version}`;

  useEffect(() => {
    let active = true;
    void getAuditEventsAction(slug, { ...filters, beforeAt: '', beforeId: '' }).then((result): void => {
      if (!active) return;
      setState(
        result.ok
          ? { key, events: result.data.events, hasMore: result.data.hasMore, cursor: result.data.hasMore ? { at: result.data.nextBeforeAt, id: result.data.nextBeforeId } : null, error: null }
          : { ...EMPTY_STATE, key, error: result.message },
      );
    });
    return () => {
      active = false;
    };
    // key covers slug, filters and version
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const current = state.key === key;
  const loadMore = useCallback((): void => {
    if (!current || !state.cursor || isLoadingMore) return;
    setIsLoadingMore(true);
    void getAuditEventsAction(slug, { ...filters, beforeAt: state.cursor.at, beforeId: state.cursor.id })
      .then((result): void => {
        if (!result.ok) return;
        // A page of an older filter set is dropped
        setState((s) =>
          s.key === key ? { ...s, events: [...s.events, ...result.data.events], hasMore: result.data.hasMore, cursor: result.data.hasMore ? { at: result.data.nextBeforeAt, id: result.data.nextBeforeId } : null } : s,
        );
      })
      .finally((): void => setIsLoadingMore(false));
  }, [current, state.cursor, isLoadingMore, slug, filters, key]);

  const setFilter = useCallback(<K extends keyof AuditFilters>(k: K, value: AuditFilters[K]): void => setFilters((f) => ({ ...f, [k]: value })), []);
  const clearFilters = useCallback((): void => setFilters(EMPTY_FILTERS), []);
  const reload = useCallback((): void => setVersion((v) => v + 1), []);
  const rows = useMemo(() => (current ? state.events.map(toRow) : []), [current, state.events]);

  return { rows, isLoading: !current, isLoadingMore, error: current ? state.error : null, hasMore: current && state.hasMore, filters, setFilter, clearFilters, loadMore, reload };
};
