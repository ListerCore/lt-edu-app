import Link from 'next/link';
import type { JSX } from 'react';
import { BellOff } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { NOTIFICATIONS_PATH, notificationKindMeta, relativeTime } from '@/features/protected/notifications/data/notifications-data';
import { cn } from '@/lib/utils';
import type { DashboardHomeActivityProps } from '../types';

// Recent activity: the newest notifications of the role; opening one marks it as read
export const DashboardHomeActivity = ({ notifications, isLoading, unreadCount, now, isRead, onOpen }: DashboardHomeActivityProps): JSX.Element => (
  <section aria-labelledby="home-activity-title">
    <div className="flex items-baseline justify-between gap-3">
      <h2 id="home-activity-title" className="flex items-center gap-2 text-sm font-semibold text-foreground">
        Actividad reciente
        {unreadCount > 0 && <span className="pill bg-brand-soft px-2 font-mono text-[11px] text-brand tabular-nums">{unreadCount} sin leer</span>}
      </h2>
      <Link href={NOTIFICATIONS_PATH} className="link-underline text-xs font-medium text-muted-foreground hover:text-foreground">
        Ver todo
      </Link>
    </div>

    <div className="mt-3">
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }, (_, index): JSX.Element => (
            <Skeleton key={index} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <p className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          <MorphIcon icon={BellOff} size={22} />
          Sin actividad por ahora.
        </p>
      ) : (
        <ol className="soft-card divide-y divide-border overflow-hidden">
          {notifications.map((item): JSX.Element => {
            const meta = notificationKindMeta[item.kind];
            const unread = !isRead(item.id);
            return (
              <li key={item.id}>
                <Link href={item.href} onClick={(): void => onOpen(item.id)} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/60">
                  <span className={cn('mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full', meta.className)}>
                    <MorphIcon icon={meta.icon} size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn('block truncate text-sm text-foreground', unread ? 'font-semibold' : 'font-medium')}>
                      {item.title}
                      {unread && <span className="sr-only"> (sin leer)</span>}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{item.body}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 pt-0.5 text-xs text-muted-foreground">
                    <time dateTime={new Date(item.createdAt).toISOString()}>{relativeTime(item.createdAt, now)}</time>
                    {unread && <span aria-hidden="true" className="size-2 rounded-full bg-brand-solid" />}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  </section>
);
