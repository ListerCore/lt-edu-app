'use client';

import { useState } from 'react';
import { sileo } from 'sileo';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { createPostAction } from '../actions/create-post';

// Writes a thread or a reply; trims the text and resolves true when it was posted (so the composer clears)
export const useCreatePost = (itemId: string, onPosted: () => void): { post: (body: string, parentId: string) => Promise<boolean>; isPosting: boolean } => {
  const slug = useInstitutionSlug();
  const [isPosting, setIsPosting] = useState(false);
  const post = async (body: string, parentId: string): Promise<boolean> => {
    const text = body.trim();
    if (!text) return false;
    setIsPosting(true);
    try {
      const r = await createPostAction(slug, itemId, parentId, text.slice(0, 5000));
      if (!r.ok) {
        sileo.error({ title: 'No se pudo publicar', description: r.message });
        return false;
      }
      onPosted();
      return true;
    } finally {
      setIsPosting(false);
    }
  };
  return { post, isPosting };
};
