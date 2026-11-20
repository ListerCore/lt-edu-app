'use client';

import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { saveItemAction } from '../actions/save-item';
import { HTTPS_PATTERN, isoToLimaLocal, limaLocalToIso } from '../data/classroom-data';
import type { FormState, Item, ItemValues, UseItemFormParams } from '../types';

const initialOf = (item: Item | null): ItemValues =>
  item
    ? {
        kind: item.kind,
        title: item.title,
        body: item.libraryItemId ? '' : item.body,
        url: item.libraryItemId ? '' : item.url,
        complementary: item.complementary,
        startsAt: item.startsAt ? isoToLimaLocal(item.startsAt) : '',
        durationMinutes: item.durationMinutes ? String(item.durationMinutes) : '60',
        recordingUrl: item.recordingUrl,
        provider: item.provider === 'platform' ? 'platform' : 'meet',
        published: item.published,
      }
    : { kind: 'reading', title: '', body: '', url: '', complementary: false, startsAt: '', durationMinutes: '60', recordingUrl: '', provider: 'platform', published: false };

// Checks by kind, the same as lt-edu-api; material taken from the library only edits its title and flags
const validate =
  (fromLibrary: boolean) =>
  (v: ItemValues): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (v.title.trim().length < 2) errors.title = 'Escribe el título.';
    if (fromLibrary) return errors;
    if (v.url.trim() && !HTTPS_PATTERN.test(v.url.trim())) errors.url = 'Escribe una dirección completa que empiece con https://.';
    if ((v.kind === 'reading' || v.kind === 'activity') && !v.body.trim()) errors.body = 'Escribe el contenido o las indicaciones.';
    const meetLink = v.kind === 'live' && v.provider === 'meet';
    if (v.kind === 'live' && v.provider === 'platform') delete errors.url;
    if ((v.kind === 'video' || v.kind === 'link' || meetLink) && !v.url.trim()) errors.url = v.kind === 'live' ? 'Pega el enlace de Google Meet.' : 'Pega la dirección.';
    if (v.kind === 'live') {
      if (!limaLocalToIso(v.startsAt)) errors.startsAt = 'Indica el día y la hora.';
      const minutes = Number(v.durationMinutes);
      if (!Number.isInteger(minutes) || minutes < 5 || minutes > 600) errors.durationMinutes = 'De 5 a 600 minutos.';
      if (v.recordingUrl.trim() && !HTTPS_PATTERN.test(v.recordingUrl.trim())) errors.recordingUrl = 'Escribe una dirección que empiece con https://.';
    }
    return errors;
  };

// Create or edit material. The text keeps its line breaks; the session time is typed in Lima time and travels as UTC;
// fields of other kinds are not sent
export const useSaveItem = ({ unitId, item, onSaved }: UseItemFormParams): FormState<ItemValues> => {
  const slug = useInstitutionSlug();
  const fromLibrary = Boolean(item?.libraryItemId);
  return useAcademicForm({
    initial: initialOf(item),
    validate: validate(fromLibrary),
    save: (v: ItemValues) => {
      const live = v.kind === 'live';
      return saveItemAction(slug, {
        id: item?.id ?? '',
        unitId,
        kind: v.kind,
        title: v.title.trim().replace(/\s+/g, ' ').slice(0, 160),
        body: fromLibrary ? '' : v.body.trim().slice(0, 20000),
        url: fromLibrary || (live && v.provider === 'platform') ? '' : v.url.trim(),
        complementary: v.complementary,
        startsAt: live ? limaLocalToIso(v.startsAt) : '',
        durationMinutes: live ? Number(v.durationMinutes) : undefined,
        recordingUrl: live ? v.recordingUrl.trim() : '',
        provider: live ? v.provider : 'meet',
        libraryItemId: item?.libraryItemId ?? '',
        published: v.published,
      });
    },
    onSaved: () => onSaved(),
  });
};
