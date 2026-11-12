'use client';

import { useId, type JSX } from 'react';
import type { MeetingListProps } from '../types';
import { ApafaMeetingCard } from './apafa-meeting-card';

// A titled group of meetings (próximas or anteriores) with its empty state
export const ApafaMeetingList = ({ title, meetings, canManage, empty }: MeetingListProps): JSX.Element => {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <h2 id={headingId} className="flex items-baseline gap-2 text-sm font-semibold text-foreground">
        {title}
        <span className="text-xs font-normal text-muted-foreground tabular-nums">{meetings.length}</span>
      </h2>
      {meetings.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="grid gap-3">
          {meetings.map((m) => (
            <ApafaMeetingCard key={m.id} meeting={m} canManage={canManage} />
          ))}
        </ul>
      )}
    </section>
  );
};
