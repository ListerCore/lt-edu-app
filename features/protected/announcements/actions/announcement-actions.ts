'use server';

import { demoAnnouncements, sortAnnouncements } from '../data/announcements-data';
import type { Announcement, AnnouncementActionResult, AnnouncementDraft } from '../types';

// Simulated latency so loading states are visible; replaced by joseph-api calls later
const simulate = async (ms = 500): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Lists every announcement for the panel (public and internal), pinned first
export const getAnnouncementsAction = async (): Promise<AnnouncementActionResult<Announcement[]>> => {
  await simulate();
  return { ok: true, message: 'ok', data: sortAnnouncements(demoAnnouncements) };
};

// Simulated publish: echoes the draft back with an id and today's date (nothing is stored)
export const createAnnouncementAction = async (draft: AnnouncementDraft): Promise<AnnouncementActionResult<Announcement>> => {
  await simulate(700);
  if (draft.title.trim().length < 5 || draft.summary.trim().length < 10) return { ok: false, message: 'Completa el título y el detalle.' };
  const announcement: Announcement = { ...draft, title: draft.title.trim(), summary: draft.summary.trim(), id: `n-${Date.now()}`, publishedAt: new Date().toISOString().slice(0, 10), pinned: false };
  return { ok: true, message: 'Publicado.', data: announcement };
};
