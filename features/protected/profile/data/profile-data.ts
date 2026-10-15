import { Activity, Bell, IdCard, LockKeyhole, SlidersHorizontal, UserRound, FileCheck2, LayoutDashboard } from 'lucide-react';
import type { ProfileActivityItem, ProfileChecklistItem, ProfileField, ProfileSectionLink } from '../types';

export const profileSectionLinks: ProfileSectionLink[] = [
  { label: 'General', tab: 'general', icon: LayoutDashboard },
  { label: 'Información personal', tab: 'personal', icon: UserRound },
  { label: 'Datos institucionales', tab: 'institutional', icon: IdCard },
  { label: 'Seguridad', tab: 'security', icon: LockKeyhole },
  { label: 'Notificaciones', tab: 'notifications', icon: Bell },
  { label: 'Actividad', tab: 'activity', icon: Activity },
];

export const personalFields: ProfileField[] = [
  { label: 'Nombres', value: 'Fernando' },
  { label: 'Apellidos', value: 'Prado' },
  { label: 'Correo institucional', value: 'fernando.prado@cebalister.edu.pe', verified: true },
  { label: 'Teléfono de contacto', value: 'No registrado' },
  { label: 'Documento de identidad', value: 'Información no disponible' },
  { label: 'Idioma de la plataforma', value: 'Español (Perú)' },
];

export const profileChecklist: ProfileChecklistItem[] = [
  { label: 'Correo institucional verificado', complete: true },
  { label: 'Cargo y sede asignados', complete: true },
  { label: 'Preferencias regionales definidas', complete: true },
  { label: 'Teléfono de contacto', complete: false },
];

export const profileActivity: ProfileActivityItem[] = [
  { title: 'Inicio de sesión', description: 'Acceso al panel institucional', time: 'Hoy · 08:42', icon: UserRound },
  { title: 'Consulta de reportes', description: 'Reportes y analítica académica', time: 'Ayer · 16:18', icon: FileCheck2 },
  { title: 'Revisión de matrícula', description: 'Seguimiento del periodo 2026-II', time: 'Ayer · 10:32', icon: IdCard },
  { title: 'Preferencias revisadas', description: 'Configuración de la cuenta', time: '12 oct · 11:06', icon: SlidersHorizontal },
  { title: 'Acceso a gestión académica', description: 'Consulta de información institucional', time: '11 oct · 15:24', icon: Activity },
];
