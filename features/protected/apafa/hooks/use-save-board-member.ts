'use client';

import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { saveBoardMemberAction } from '../actions/save-board-member';
import type { BoardMemberValues, FormState, UseBoardFormParams } from '../types';

// A new office defaults to the school year: March to the end of next February
const defaultPeriod = (): { startsOn: string; endsOn: string } => {
  const year = new Date().getFullYear();
  return { startsOn: `${year}-03-01`, endsOn: `${year + 1}-02-28` };
};

const validate = (v: BoardMemberValues): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (v.fullName.trim().length < 3) errors.full_name = 'Escribe el nombre completo.';
  if (!v.position) errors.position = 'Elige el cargo.';
  if (!DATE_PATTERN.test(v.startsOn)) errors.starts_on = 'Indica desde cuándo.';
  if (!DATE_PATTERN.test(v.endsOn)) errors.ends_on = 'Indica hasta cuándo.';
  else if (v.endsOn < v.startsOn) errors.ends_on = 'El periodo debe terminar después de empezar.';
  return errors;
};

// Add/edit an office of the board; names are kept as typed (proper case), only spaces are cleaned
export const useSaveBoardMember = ({ member, onSaved }: UseBoardFormParams): FormState<BoardMemberValues> => {
  const slug = useInstitutionSlug();
  return useAcademicForm({
    initial: member ? { fullName: member.fullName, position: member.position, phone: member.phone, startsOn: member.startsOn, endsOn: member.endsOn } : { fullName: '', position: '', phone: '', ...defaultPeriod() },
    validate,
    save: (v: BoardMemberValues) =>
      saveBoardMemberAction(slug, {
        id: member?.id ?? '',
        fullName: v.fullName.trim().replace(/\s+/g, ' ').slice(0, 160),
        position: v.position,
        phone: v.phone
          .replace(/[^\d+ ]/g, '')
          .trim()
          .slice(0, 20),
        startsOn: v.startsOn,
        endsOn: v.endsOn,
      }),
    onSaved: () => onSaved(),
  });
};
