'use client';

import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { updateRoomAction } from '../actions/update-room';
import type { FormState, RoomSettingsValues, UseRoomSettingsParams } from '../types';

// Description and publication of a room; the description keeps its line breaks, only trims the ends
export const useUpdateRoom = ({ room, onSaved }: UseRoomSettingsParams): FormState<RoomSettingsValues> => {
  const slug = useInstitutionSlug();
  return useAcademicForm({
    initial: { description: room.description, published: room.status === 'published' },
    validate: (v: RoomSettingsValues): Record<string, string> => (v.description.trim().length > 2000 ? { description: 'Máximo 2000 caracteres.' } : {}),
    save: (v: RoomSettingsValues) => updateRoomAction(slug, room, v.description.trim(), v.published ? 'published' : 'draft'),
    onSaved: () => onSaved(),
  });
};
