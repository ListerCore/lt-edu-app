import { Bell, Megaphone, TriangleAlert } from 'lucide';
import type { Announcement, AnnouncementAudience, AnnouncementKind, KindMeta } from '../types';

export const ANNOUNCEMENTS_PATH = '/dashboard/announcements';
export const NEWS_PATH = '/news';

// Cover images accepted when publishing
export const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

// Tab order everywhere: anuncios, comunicados, avisos
export const announcementKinds: AnnouncementKind[] = ['announcement', 'notice', 'alert'];

export const kindMeta: Record<AnnouncementKind, KindMeta> = {
  announcement: { label: 'Anuncio', plural: 'Anuncios', icon: Megaphone, className: 'bg-brand-soft text-brand' },
  notice: { label: 'Comunicado', plural: 'Comunicados', icon: Bell, className: 'bg-success/12 text-success' },
  alert: { label: 'Aviso', plural: 'Avisos', icon: TriangleAlert, className: 'bg-warning/12 text-warning' },
};

export const audienceLabels: Record<AnnouncementAudience, string> = {
  community: 'Toda la comunidad',
  students: 'Estudiantes',
  guardians: 'Apoderados',
  staff: 'Docentes y personal',
};

// Simulated feed, worded to fit every institution type; joseph-api will provide the real one
export const demoAnnouncements: Announcement[] = [
  { id: 'n01', kind: 'notice', title: 'Ya está disponible el horario del periodo en curso', summary: 'Revisa tu horario en el panel. Los cambios de aula y de docente se publican aquí mismo.', audience: 'community', publishedAt: '2026-11-03', isPublic: true, pinned: true },
  { id: 'n02', kind: 'alert', title: 'Mantenimiento programado el sábado de 22:00 a 23:00', summary: 'Durante ese horario no podrás ingresar a tu cuenta. Planifica tus entregas con anticipación.', audience: 'community', publishedAt: '2026-11-02', isPublic: true, pinned: false },
  { id: 'n03', kind: 'announcement', title: 'Actualiza tu foto para la emisión de carnets', summary: 'Sube una foto reciente, de frente y con fondo claro, desde tu cuenta antes del 15 de noviembre.', audience: 'students', publishedAt: '2026-11-01', isPublic: true, pinned: false },
  { id: 'n04', kind: 'alert', title: 'Las inasistencias se justifican dentro de las 48 horas', summary: 'Presenta el sustento en secretaría o súbelo desde el panel; pasado el plazo la falta queda registrada.', audience: 'guardians', publishedAt: '2026-10-30', isPublic: true, pinned: false },
  { id: 'n05', kind: 'notice', title: 'Reunión general de coordinación', summary: 'Viernes a las 4:00 p. m. en la sala de profesores. Se revisará el avance del periodo y el calendario de evaluaciones.', audience: 'staff', publishedAt: '2026-10-29', isPublic: false, pinned: false },
  { id: 'n06', kind: 'announcement', title: 'Abiertas las inscripciones de admisión', summary: 'Consulta requisitos, fechas y vacantes en la sección de Admisión o escríbenos desde Contacto.', audience: 'community', publishedAt: '2026-10-27', isPublic: true, pinned: true },
  { id: 'n07', kind: 'notice', title: 'Publicación de notas al cierre de la evaluación', summary: 'Las notas se publican en el panel dentro de los cinco días hábiles posteriores a cada cierre.', audience: 'students', publishedAt: '2026-10-24', isPublic: true, pinned: false },
  { id: 'n08', kind: 'alert', title: 'Vence el pago de la pensión del mes', summary: 'El último día de pago sin mora es el 30. Puedes revisar tu estado de cuenta desde el panel.', audience: 'guardians', publishedAt: '2026-10-22', isPublic: false, pinned: false },
  { id: 'n09', kind: 'announcement', title: 'Semana de orientación vocacional', summary: 'Charlas y talleres con el área de tutoría y psicología. Inscríbete con tu tutor.', audience: 'students', publishedAt: '2026-10-20', isPublic: true, pinned: false },
];

// Pinned first, then newest first
export const sortAnnouncements = (items: Announcement[]): Announcement[] => [...items].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.publishedAt.localeCompare(a.publishedAt));

// "3 de noviembre de 2026"; fixed ISO dates, so it is safe while prerendering
const dateFormat = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatPublishedAt = (isoDate: string): string => dateFormat.format(new Date(`${isoDate}T00:00:00Z`));

// What the public /news page shows
export const publicAnnouncements: Announcement[] = sortAnnouncements(demoAnnouncements.filter(({ isPublic }) => isPublic));
