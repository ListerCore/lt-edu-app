'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

// What joseph-api publishes on the live stream (internal/core/service/live_service.go); ids only, never personal data
export type LiveEventType = 'system.ping' | 'announcement.published' | 'announcement.updated' | 'announcement.deleted' | 'academic.changed' | 'people.changed' | 'attendance.changed' | 'assessment.changed';

// Any change to announcements (published, edited or deleted)
export const isAnnouncementEvent = (type: LiveEvent['type']): boolean => type.startsWith('announcement.');

// Academic structure, periods or sections changed somewhere in the institution
export const isAcademicEvent = (type: LiveEvent['type']): boolean => type === 'academic.changed';

// Students, guardians, enrollments or placements changed somewhere in the institution
export const isPeopleEvent = (type: LiveEvent['type']): boolean => type === 'people.changed';

// Attendance changed: data.area is gate | daily | staff | class | justifications, data.student the student (if any)
export const isAttendanceEvent = (type: LiveEvent['type']): boolean => type === 'attendance.changed';

// Grades, conclusions, the tutor's sheets or the teachers' "sent" changed (data.section)
export const isAssessmentEvent = (type: LiveEvent['type']): boolean => type === 'assessment.changed';

// "resync" is local: the socket came back after a drop, so whatever happened meanwhile must be refetched
export interface LiveEvent {
  type: LiveEventType | 'resync';
  data: Record<string, string>;
}

export type LiveStatus = 'connecting' | 'live' | 'reconnecting' | 'offline';

const MAX_BACKOFF_MS = 15_000;
// Navigating between pages unmounts and mounts subscribers; keep the socket through that gap
const IDLE_CLOSE_MS = 5_000;

const listeners = new Set<(event: LiveEvent) => void>();
const statusListeners = new Set<() => void>();
let status: LiveStatus = 'connecting';
let socket: WebSocket | null = null;
let retry: ReturnType<typeof setTimeout> | undefined;
let idleClose: ReturnType<typeof setTimeout> | undefined;
let attempt = 0;
let wasLive = false;

const setStatus = (next: LiveStatus): void => {
  if (status === next) return;
  status = next;
  statusListeners.forEach((listener) => listener());
};

const emit = (event: LiveEvent): void => listeners.forEach((listener) => listener(event));

// One WebSocket per browser tab to /ws/live (relayed by proxy.ts to joseph-api, which reads the Redis stream)
const connect = (): void => {
  const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const current = new WebSocket(`${scheme}://${window.location.host}/ws/live`);
  socket = current;
  current.onmessage = (message): void => {
    let event: { type: string; data?: Record<string, string> };
    try {
      event = JSON.parse(String(message.data)) as typeof event;
    } catch {
      return;
    }
    if (event.type === 'ready') {
      attempt = 0;
      setStatus('live');
      if (wasLive) emit({ type: 'resync', data: {} });
      wasLive = true;
      return;
    }
    if (event.type === 'degraded') {
      setStatus('reconnecting');
      return;
    }
    emit({ type: event.type as LiveEventType, data: event.data ?? {} });
  };
  current.onclose = (): void => {
    if (socket !== current) return;
    socket = null;
    if (listeners.size === 0) return;
    attempt += 1;
    setStatus(attempt > 5 ? 'offline' : 'reconnecting');
    retry = setTimeout(
      () => {
        retry = undefined;
        connect();
      },
      Math.min(1000 * 2 ** attempt, MAX_BACKOFF_MS),
    );
  };
};

const subscribe = (listener: (event: LiveEvent) => void): (() => void) => {
  listeners.add(listener);
  clearTimeout(idleClose);
  if (!socket && retry === undefined) connect();
  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    idleClose = setTimeout(() => {
      clearTimeout(retry);
      retry = undefined;
      const current = socket;
      socket = null;
      current?.close();
      wasLive = false;
      setStatus('connecting');
    }, IDLE_CLOSE_MS);
  };
};

// Calls onEvent for every live event; the handler is read through a ref, so it never reopens anything
export const useLive = (onEvent: (event: LiveEvent) => void): void => {
  const handler = useRef(onEvent);
  useEffect(() => {
    handler.current = onEvent;
  }, [onEvent]);
  useEffect(() => subscribe((event) => handler.current(event)), []);
};

// Runs refresh once a burst of matching events settles (and after a reconnect), instead of polling
export const useLiveRefresh = (matches: (event: LiveEvent) => boolean, refresh: () => void, delayMs = 400): void => {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useLive((event) => {
    if (event.type !== 'resync' && !matches(event)) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(refresh, delayMs);
  });
};

export const useLiveStatus = (): LiveStatus =>
  useSyncExternalStore(
    (listener) => {
      statusListeners.add(listener);
      return () => statusListeners.delete(listener);
    },
    () => status,
    () => 'connecting',
  );
