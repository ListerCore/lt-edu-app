'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { moderatePostAction } from '../actions/moderate-post';
import type { Post } from '../types';

// Moderation: pin or unpin a thread, show a hidden post, or hide one with the reason families will read
export const useModeratePost = (
  onDone: () => void,
): { pin: (post: Post) => Promise<void>; show: (post: Post) => Promise<void>; hide: (post: Post, reason: string) => Promise<boolean>; isHiding: boolean } => {
  const slug = useInstitutionSlug();
  const [isHiding, setIsHiding] = useState(false);
  const run = async (post: Post, pinned: boolean, hidden: boolean, reason: string, message: string): Promise<boolean> => {
    const r = await runAcademicAction(moderatePostAction(slug, post.id, pinned, hidden, reason.trim().slice(0, 300)), message);
    if (r.ok) onDone();
    return r.ok;
  };
  return {
    pin: async (post: Post): Promise<void> => {
      await run(post, !post.pinned, post.hidden, post.hiddenReason, post.pinned ? 'Mensaje desfijado.' : 'Mensaje fijado arriba.');
    },
    show: async (post: Post): Promise<void> => {
      await run(post, post.pinned, false, '', 'El mensaje vuelve a verse.');
    },
    hide: async (post: Post, reason: string): Promise<boolean> => {
      setIsHiding(true);
      try {
        return await run(post, post.pinned, true, reason, 'Mensaje oculto.');
      } finally {
        setIsHiding(false);
      }
    },
    isHiding,
  };
};
