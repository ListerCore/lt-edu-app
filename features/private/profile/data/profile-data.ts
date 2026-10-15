import { Activity, Bell, IdCard, LockKeyhole, SlidersHorizontal, UserRound, FileCheck2 } from 'lucide-react';
import type { ProfileActivityItem, ProfileChecklistItem, ProfileField, ProfileSectionLink } from '../types';

export const profileSectionLinks: ProfileSectionLink[] = [
  { label: 'Información personal', href: '#informacion-personal', icon: UserRound },
  { label: 'Datos institucionales', href: '#datos-institucionales', icon: IdCard },
  { label: 'Seguridad', href: '#seguridad', icon: LockKeyhole },
  { label: 'Notificaciones', href: '#notificaciones', icon: Bell },
  { label: 'Actividad', href: '#actividad', icon: Activity },
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
  { title: 'Preferencias revisadas', description: 'Configuración de la cuenta', time: '12 oct · 11:06', icon: SlidersHorizontal },
];
