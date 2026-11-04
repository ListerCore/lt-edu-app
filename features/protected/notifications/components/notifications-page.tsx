'use client';

import { useState, type JSX } from 'react';
import { BellOff, CheckCheck } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { groupByDay } from '../data/notifications-data';
import { useGetNotifications } from '../hooks/use-get-notifications';
import { useMarkNotificationsRead } from '../hooks/use-mark-notifications-read';
import type { NotificationFilter } from '../types';
import { NotificationTimeline } from './notification-timeline';

const filters: Array<{ value: NotificationFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'unread', label: 'Sin leer' },
];

// Notifications module: all / unread filter and the day-grouped timeline of the current role
export const NotificationsPage = (): JSX.Element => {
  const { notifications, isLoading, now, unreadCount, isRead } = useGetNotifications();
  const { markRead } = useMarkNotificationsRead();
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const visible = filter === 'unread' ? notifications.filter(({ id }) => !isRead(id)) : notifications;

  return (
    <section aria-labelledby="notifications-title" className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="notifications-title" className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Notificaciones
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{unreadCount > 0 ? `Tienes ${unreadCount} sin leer.` : 'Estás al día.'}</p>
        </div>
        <button type="button" disabled={unreadCount === 0} onClick={(): void => markRead(notifications.map(({ id }) => id))} className="btn-alt">
          <MorphIcon icon={CheckCheck} size={16} />
          Marcar todo como leído
        </button>
      </header>

      <div role="radiogroup" aria-label="Filtrar notificaciones" className="mt-6 inline-flex rounded-full bg-surface p-1">
        {filters.map(({ value, label }): JSX.Element => (
          <button key={value} type="button" role="radio" aria-checked={filter === value} onClick={(): void => setFilter(value)} className={cn('rounded-full px-4 py-1.5 text-sm font-medium transition-colors', filter === value ? 'bg-background text-brand shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {label}
            {value === 'unread' && unreadCount > 0 && <span className="ml-1.5 font-mono text-xs tabular-nums">{unreadCount}</span>}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }, (_, index): JSX.Element => (
              <Skeleton key={index} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-14 text-center text-sm text-muted-foreground">
            <MorphIcon icon={BellOff} size={24} />
            {filter === 'unread' ? 'No tienes notificaciones sin leer.' : 'Aún no tienes notificaciones.'}
          </p>
        ) : (
          <NotificationTimeline groups={groupByDay(visible, now)} now={now} isRead={isRead} onOpen={(id): void => markRead([id])} />
        )}
      </div>
    </section>
  );
};
