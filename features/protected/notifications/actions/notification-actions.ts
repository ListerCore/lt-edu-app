'use server';

import type { Management, Role } from '@/features/protected/dashboard/types';
import { notificationSeeds } from '../data/notifications-data';
import type { AppNotification, NotificationActionResult } from '../types';

// Simulated latency so loading states are visible; replaced by joseph-api calls later
const simulate = async (ms = 400): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Notifications addressed to the role (and the institution's management type), with absolute timestamps resolved at
// request time
export const getNotificationsAction = async (role: Role, management: Management): Promise<NotificationActionResult<AppNotification[]>> => {
  await simulate();
  const now = Date.now();
  const data: AppNotification[] = notificationSeeds.filter((seed) => (!seed.roles || seed.roles.includes(role)) && (!seed.management || seed.management === management)).map(({ id, kind, title, body, href, minutesAgo }) => ({ id, kind, title, body, href, createdAt: now - minutesAgo * 60_000 }));
  return { ok: true, message: 'ok', data };
};

// Simulated: joseph-api will persist read receipts per user; for now the client keeps them
export const markNotificationsReadAction = async (ids: string[]): Promise<NotificationActionResult<string[]>> => {
  await simulate(150);
  return { ok: true, message: 'ok', data: ids };
};
