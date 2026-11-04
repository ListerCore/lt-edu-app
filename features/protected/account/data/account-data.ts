import { BookOpenCheck, BriefcaseBusiness, GraduationCap, HeartPulse, IdCard, UserRound } from 'lucide';
import { ownCardholderFor } from '@/features/protected/cards/data/cardholders-roster';
import { demoInstitutionNames, demoUserNames, roleLabel } from '@/features/protected/dashboard/data/permissions';
import type { InstitutionType, Role } from '@/features/protected/dashboard/types';
import type { AccountActivity, AccountProfile, AccountSection } from '../types';

export const ACCOUNT_REPORT_TITLE = 'Reporte de perfil';

// Photo shared with the ID card: own card for students and staff; guardians have their own (their card is the child's)
export const accountPhotoKey = (institutionType: InstitutionType, role: Role): string => (role === 'guardian' ? `guardian-${institutionType}` : (ownCardholderFor(institutionType, role)?.id ?? `account-${role}`));

const currentPeriod: Record<InstitutionType, string> = {
  EBR: '2026 · IV bimestre',
  EBA: '2026-II · periodo promocional',
  EBE: '2026 · III trimestre',
  CEPRE: 'Ciclo intensivo 2026-II',
  IEST: '2026-II · semestre académico',
};

// One-line academic summary of a student, in the scale each institution type uses
const academicSummary: Record<InstitutionType, { label: string; value: string }> = {
  EBR: { label: 'Logro del periodo', value: 'A · Logro esperado' },
  EBA: { label: 'Logro del periodo', value: 'A · Logro esperado' },
  EBE: { label: 'Informe de progreso', value: 'En proceso, con avances en comunicación' },
  CEPRE: { label: 'Último simulacro', value: 'Puesto 12 de 180 · 1 420 puntos' },
  IEST: { label: 'Promedio ponderado', value: '15.4 / 20' },
};

const coursesFor: Record<InstitutionType, string[]> = {
  EBR: ['Matemática · 3.° A', 'Matemática · 3.° B', 'Razonamiento matemático · 4.° A'],
  EBA: ['Matemática · Ciclo avanzado 2.°', 'Matemática · Ciclo avanzado 4.°'],
  EBE: ['Aula Girasoles · Primaria', 'Taller de comunicación'],
  CEPRE: ['Álgebra · Área B', 'Aritmética · Área A', 'Simulacro semanal'],
  IEST: ['Matemática aplicada · I semestre', 'Estadística · III semestre'],
};

const slug = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .split(' ')
    .slice(0, 2)
    .join('.');

// Recent activity, newest first; hours ago are turned into dates on the server
const activityFor = (role: Role, now: number): AccountActivity[] => {
  const items: Array<{ title: string; detail: string; hoursAgo: number }> = [
    { title: 'Ingresaste a tu cuenta', detail: 'Chrome en Windows · Lima', hoursAgo: 0.2 },
    ...(role === 'student' ? [{ title: 'Consultaste tus notas', detail: 'Evaluación · Matemática', hoursAgo: 20 }] : []),
    ...(role === 'guardian' ? [{ title: 'Justificaste una tardanza', detail: 'Asistencia de tu hijo', hoursAgo: 26 }] : []),
    ...(role === 'teacher' || role === 'tutor' ? [{ title: 'Registraste notas', detail: 'Matemática · 3.° A', hoursAgo: 22 }] : []),
    ...(role === 'director' || role === 'coordinator' ? [{ title: 'Publicaste un comunicado', detail: 'Horario del periodo en curso', hoursAgo: 23 }] : []),
    ...(role === 'secretary' ? [{ title: 'Imprimiste 12 carnets', detail: 'Carnets · 3.° B', hoursAgo: 25 }] : []),
    { title: 'Descargaste tu carnet', detail: 'Formato carnet · frontal y posterior', hoursAgo: 50 },
    { title: 'Cambiaste tu contraseña', detail: 'Desde Mi cuenta', hoursAgo: 24 * 12 },
    { title: 'Activaste la verificación en dos pasos', detail: 'Código por correo', hoursAgo: 24 * 30 },
  ];
  return items.map(({ title, detail, hoursAgo }, index) => ({ id: `act-${index}`, title, detail, at: new Date(now - hoursAgo * 3_600_000).toISOString() }));
};

// Simulated profile of the signed-in person for the institution type and role; joseph-api will return the real one
export const buildAccountProfile = (institutionType: InstitutionType, role: Role, now: number): AccountProfile => {
  const card = ownCardholderFor(institutionType, role);
  const isStudent = role === 'student';
  const isGuardian = role === 'guardian';
  const fullName = isStudent && card ? card.name : demoUserNames[role];
  const institutionName = demoInstitutionNames[institutionType];
  const label = roleLabel(role, institutionType);

  const personal: AccountSection = {
    id: 'personal',
    title: 'Datos personales',
    icon: UserRound,
    fields: [
      { label: 'Nombres y apellidos', value: fullName },
      { label: 'Documento', value: `DNI ${isGuardian ? '41752368' : (card?.documentNumber ?? '41752368')}`, mono: true },
      { label: 'Fecha de nacimiento', value: isStudent ? '14 de marzo de 2011' : '2 de agosto de 1984' },
      { label: 'Sexo', value: ['student', 'tutor', 'secretary', 'psychologist'].includes(role) || role === 'director' ? 'Femenino' : 'Masculino' },
    ],
  };

  const roleSection: AccountSection = isStudent
    ? {
        id: 'academic',
        title: 'Información académica',
        icon: GraduationCap,
        fields: [
          { label: 'Código de estudiante', value: card?.code ?? '—', mono: true },
          { label: institutionType === 'IEST' ? 'Programa y semestre' : institutionType === 'CEPRE' ? 'Ciclo y área' : 'Grado y sección', value: card?.detail ?? '—' },
          { label: 'Periodo', value: currentPeriod[institutionType] },
          { label: 'Tutor', value: 'Ana Torres Salazar' },
          { label: 'Asistencia del periodo', value: '94 % · 2 tardanzas' },
          academicSummary[institutionType],
        ],
      }
    : isGuardian
      ? {
          id: 'guardian',
          title: 'Datos del apoderado',
          icon: BookOpenCheck,
          fields: [
            { label: 'Parentesco', value: 'Padre' },
            { label: 'Estudiantes a cargo', value: '1' },
            { label: 'Estado de pagos', value: 'Al día' },
            { label: 'Periodo', value: currentPeriod[institutionType] },
          ],
        }
      : {
          id: 'work',
          title: 'Información laboral',
          icon: BriefcaseBusiness,
          fields: [
            { label: 'Código de personal', value: card?.code ?? '—', mono: true },
            { label: 'Cargo', value: label },
            { label: 'Área', value: card?.detail ?? label },
            { label: 'Fecha de ingreso', value: '1 de marzo de 2019' },
            { label: 'Condición', value: 'Nombrado · tiempo completo' },
            ...(role === 'teacher' || role === 'tutor' ? [{ label: 'Cursos a cargo', value: coursesFor[institutionType].join(' · ') }, { label: 'Carga horaria', value: '30 horas semanales' }] : []),
          ],
        };

  const emergency: AccountSection = {
    id: 'emergency',
    title: isStudent ? 'Apoderado y emergencia' : 'Contacto de emergencia',
    icon: HeartPulse,
    fields: [
      { label: isStudent ? 'Apoderado' : 'Contacto', value: isStudent ? (card?.emergencyName ?? '—') : (card?.emergencyName ?? 'Carmen Huamán') },
      { label: 'Teléfono', value: card?.emergencyPhone ?? '987 654 321', mono: true },
      { label: 'Seguro de salud', value: isStudent ? 'SIS' : 'EsSalud' },
      { label: 'Grupo sanguíneo', value: 'O+' },
    ],
  };

  const cardSection: AccountSection = {
    id: 'card',
    title: isGuardian ? 'Carnet de tu hijo' : 'Carnet',
    icon: IdCard,
    fields: [
      { label: 'Código', value: card?.code ?? '—', mono: true },
      { label: 'Vigencia', value: '2026' },
      { label: 'Estado', value: 'Emitido · listo para descargar' },
    ],
  };

  const email = `${slug(fullName)}@${isStudent || isGuardian ? 'correo.pe' : 'joseph.pe'}`;

  return {
    photoKey: accountPhotoKey(institutionType, role),
    fullName,
    roleLabel: label,
    institutionName,
    institutionType,
    role,
    code: isGuardian ? `AP-${(card?.code ?? '0000').slice(-4)}` : (card?.code ?? '—'),
    headline: isStudent ? (card?.detail ?? label) : isGuardian ? `Apoderado de ${card?.name ?? 'su hijo'}` : (card?.detail ?? label),
    contact: { email, phone: '987 654 321', address: 'Jr. Las Magnolias 245, Comas, Lima' },
    sections: [personal, roleSection, emergency, cardSection],
    linked: isGuardian && card ? [{ name: card.name, detail: card.detail, code: card.code }] : [],
    activity: activityFor(role, now),
    security: { twoFactor: true, passwordUpdatedAt: new Date(now - 12 * 86_400_000).toISOString(), lastAccessAt: new Date(now - 12 * 60_000).toISOString(), lastAccessFrom: 'Chrome en Windows · Lima' },
  };
};

const dateTime = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' });
const dateOnly = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatDateTime = (iso: string): string => dateTime.format(new Date(iso));
export const formatDate = (iso: string): string => dateOnly.format(new Date(iso));
