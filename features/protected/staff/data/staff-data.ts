import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';

export const STAFF_PATH = `${DASHBOARD_PATH}/staff`;
export const staffPath = (id: string): string => `${STAFF_PATH}/${id}`;
export const STAFF_PAGE_SIZE = 25;

export const staffStatusLabels: Record<string, string> = { active: 'Activo', inactive: 'Inactivo' };
export const staffStatusClass: Record<string, string> = { active: 'bg-success/12 text-success', inactive: 'bg-secondary text-muted-foreground' };

// Panel roles that can be given to staff, in the order of the picker
export const staffRoleLabels: Record<string, string> = {
  director: 'Director(a)',
  academic_coordinator: 'Coordinación académica',
  program_coordinator: 'Coordinación de programa',
  secretary: 'Secretaría',
  teacher: 'Docente',
  tutor: 'Tutor(a)',
  assistant: 'Auxiliar',
  psychologist: 'Psicología',
  special_ed_specialist: 'Especialista de educación especial',
  treasurer: 'Tesorería',
};
