'use client';

import Link from 'next/link';
import type { JSX } from 'react';
import { Bell, CheckCheck } from 'lucide';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { NOTIFICATIONS_PATH, notificationKindMeta, relativeTime } from '../data/notifications-data';
import { useGetNotifications } from '../hooks/use-get-notifications';
import { useMarkNotificationsRead } from '../hooks/use-mark-notifications-read';

const PREVIEW_COUNT = 6;

// Header bell: unread count badge and a dropdown with the latest notifications on a compact timeline
export const NotificationBell = (): JSX.Element => {
  const { notifications, now, unreadCount, isRead } = useGetNotifications();
  const { markRead } = useMarkNotificationsRead();
  const latest = [...notifications].sort((a, b) => b.createdAt - a.createdAt).slice(0, PREVIEW_COUNT);
  const badge = unreadCount > 9 ? '9+' : String(unreadCount);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={unreadCount > 0 ? `Notificaciones, ${unreadCount} sin leer` : 'Notificaciones'} className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand data-popup-open:bg-accent data-popup-open:text-foreground">
        <MorphIcon icon={Bell} size={18} />
        {unreadCount > 0 && (
          <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-solid px-1 font-mono text-[10px] font-semibold text-white tabular-nums ring-2 ring-background">
            {badge}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-[22rem] p-0">
        <DropdownMenuGroup>
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">Notificaciones</DropdownMenuLabel>
            {unreadCount > 0 && <span className="pill bg-brand-soft text-brand">{unreadCount} sin leer</span>}
          </div>
        </DropdownMenuGroup>

        {latest.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">No tienes notificaciones.</p>
        ) : (
          <DropdownMenuGroup className="relative max-h-96 overflow-y-auto py-2">
            <span aria-hidden="true" className="absolute top-4 bottom-4 left-[1.9rem] w-px bg-border" />
            {latest.map((item): JSX.Element => {
              const meta = notificationKindMeta[item.kind];
              const unread = !isRead(item.id);
              return (
                <DropdownMenuItem key={item.id} render={<Link href={item.href} />} onClick={(): void => markRead([item.id])} className="mx-1 items-start gap-3 px-3 py-2.5">
                  <span className={cn('relative z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ring-4 ring-popover', meta.className)}>
                    <MorphIcon icon={meta.icon} size={14} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn('block text-sm leading-snug text-foreground', unread ? 'font-semibold' : 'font-normal')}>{item.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{relativeTime(item.createdAt, now)}</span>
                  </span>
                  {unread && <span aria-label="Sin leer" className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-solid" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        )}

        <DropdownMenuSeparator className="m-0" />
        <div className="flex items-center justify-between gap-2 p-1">
          <DropdownMenuItem disabled={unreadCount === 0} onClick={(): void => markRead(notifications.map(({ id }) => id))} className="text-xs">
            <MorphIcon icon={CheckCheck} />
            Marcar todo como leído
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={NOTIFICATIONS_PATH} />} className="text-xs font-medium text-brand">
            Ver todas
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
