import Link from 'next/link';
import type { JSX } from 'react';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { notificationKindMeta, relativeTime } from '../data/notifications-data';
import type { NotificationTimelineProps } from '../types';

// Day groups on a vertical line: each notification hangs from it on its kind icon; unread ones carry a brand dot
export const NotificationTimeline = ({ groups, now, isRead, onOpen }: NotificationTimelineProps): JSX.Element => (
  <div className="flex flex-col gap-10">
    {groups.map(({ label, items }): JSX.Element => (
      <section key={label} aria-label={label}>
        <h2 className="mb-4 text-sm font-semibold text-foreground">{label}</h2>
        <ol className="relative ml-5 border-l border-border">
          {items.map((item): JSX.Element => {
            const meta = notificationKindMeta[item.kind];
            const unread = !isRead(item.id);
            return (
              <li key={item.id} className="row-in relative pb-6 pl-8 last:pb-0">
                <span className={cn('absolute top-0 -left-5 flex size-10 items-center justify-center rounded-full ring-4 ring-background', meta.className)}>
                  <MorphIcon icon={meta.icon} size={18} />
                </span>
                <Link href={item.href} onClick={(): void => onOpen(item.id)} className={cn('group block rounded-lg border p-4 transition-colors hover:border-brand/50', unread ? 'border-brand/30 bg-brand-soft/40' : 'border-border bg-background')}>
                  <div className="flex items-start justify-between gap-3">
                    <p className={cn('text-sm text-foreground', unread ? 'font-semibold' : 'font-medium')}>
                      {item.title}
                      {unread && <span className="sr-only"> (sin leer)</span>}
                    </p>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      <time dateTime={new Date(item.createdAt).toISOString()}>{relativeTime(item.createdAt, now)}</time>
                      {unread && <span aria-hidden="true" className="size-2 rounded-full bg-brand-solid" />}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
                  <p className="mt-2 text-xs font-medium text-muted-foreground">{meta.label}</p>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    ))}
  </div>
);
