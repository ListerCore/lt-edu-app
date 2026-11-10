'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { isAnnouncementEvent, useLive } from '@/hooks/use-live';
import { deleteAnnouncementAction, getAnnouncementAction } from '../actions/announcement-actions';
import { ANNOUNCEMENTS_PATH } from '../data/announcements-data';
import type { Announcement, AnnouncementDetail, UseAnnouncementDetailResult } from '../types';

interface DetailState {
  detail: AnnouncementDetail | null;
  error: string | null;
  isLoading: boolean;
}

// One announcement of the panel: loads it, follows edits made elsewhere (live) and deletes it, then goes back
export const useAnnouncementDetail = (slug: string): UseAnnouncementDetailResult => {
  const router = useRouter();
  const [state, setState] = useState<DetailState>({ detail: null, error: null, isLoading: true });
  const [version, setVersion] = useState(0);
  const [isDeleting, startDelete] = useTransition();
  // Our own delete also comes back over the live channel; it must not read as someone else's
  const deletingHere = useRef(false);

  useEffect(() => {
    let active = true;
    void getAnnouncementAction(slug).then((result) => {
      if (!active) return;
      setState(result.ok && result.data ? { detail: result.data, error: null, isLoading: false } : { detail: null, error: result.message, isLoading: false });
    });
    return () => {
      active = false;
    };
  }, [slug, version]);

  // Back to where the person came from; straight to the list when the page was opened directly
  const leave = useCallback((): void => {
    if (window.history.length > 1) router.back();
    else router.push(ANNOUNCEMENTS_PATH);
  }, [router]);

  useLive((event) => {
    if (!isAnnouncementEvent(event.type) || event.data.slug !== slug) return;
    if (event.type === 'announcement.deleted') {
      if (deletingHere.current) return;
      sileo.info({ title: 'Publicación eliminada', description: 'Alguien más la eliminó.' });
      router.push(ANNOUNCEMENTS_PATH);
      return;
    }
    if (event.type === 'announcement.updated') setVersion((current) => current + 1);
  });

  const replace = useCallback((announcement: Announcement): void => setState((current) => (current.detail ? { ...current, detail: { ...current.detail, announcement } } : current)), []);

  const remove = useCallback((): void => {
    const id = state.detail?.announcement.id;
    if (!id) return;
    deletingHere.current = true;
    startDelete(async (): Promise<void> => {
      const result = await deleteAnnouncementAction(id);
      if (!result.ok) {
        deletingHere.current = false;
        sileo.error({ title: 'No se eliminó', description: result.message });
        return;
      }
      sileo.success({ title: 'Publicación eliminada', description: 'También se quitó de la página pública y sus archivos.' });
      leave();
    });
  }, [state.detail, leave]);

  return { ...state, isDeleting, replace, remove };
};
