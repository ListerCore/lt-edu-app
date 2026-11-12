'use client';

import Link from 'next/link';
import type { JSX } from 'react';
import { Clock, MapPin, Paperclip, Video } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import type { MeetingCardProps } from '../types';

// One meeting in the list: a calendar tile with the day, title, kind, time and place, and its status
export const ApafaMeetingCard = ({ meeting: m, canManage }: MeetingCardProps): JSX.Element => (
  <li>
    <Link href={m.href} className="group flex gap-4 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-foreground/25 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
      <span className={cn('flex w-14 shrink-0 flex-col items-center justify-center rounded-xl py-2 leading-none', m.status === 'cancelled' ? 'bg-secondary text-muted-foreground' : 'bg-brand-soft text-brand')} aria-hidden="true">
        <span className="text-2xl font-semibold tabular-nums">{m.dayLabel}</span>
        <span className="mt-1 text-[11px] font-semibold tracking-wide uppercase">{m.monthLabel}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className={cn('block truncate font-semibold text-foreground group-hover:text-brand', m.status === 'cancelled' && 'line-through decoration-muted-foreground/60')}>{m.title}</span>
            <span className="block text-xs text-muted-foreground">{m.kindLabel}</span>
          </span>
          <span className="flex shrink-0 flex-wrap justify-end gap-1.5">
            {m.isDue && canManage && <span className="pill bg-warning/14 text-warning">Falta el acta</span>}
            <span className={cn('pill', m.statusClass)}>{m.statusLabel}</span>
          </span>
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MorphIcon icon={Clock} size={13} />
            {m.whenLabel}, {m.timeLabel}
          </span>
          {m.place && (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MorphIcon icon={MapPin} size={13} />
              <span className="truncate">{m.place}</span>
            </span>
          )}
          {m.meetingUrl && (
            <span className="inline-flex items-center gap-1.5">
              <MorphIcon icon={Video} size={13} />
              Virtual
            </span>
          )}
          {m.files > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <MorphIcon icon={Paperclip} size={13} />
              {m.files} {m.files === 1 ? 'documento' : 'documentos'}
            </span>
          )}
        </span>
      </span>
    </Link>
  </li>
);
