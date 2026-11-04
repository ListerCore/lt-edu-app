import { CalendarCheck, Clock3, LifeBuoy, Mail, MonitorPlay, ShieldCheck } from 'lucide';
import { siteConfig } from '@/lib/site';
import type { ContactAssurance, ContactChannel, InstitutionTypeCode, ModuleInterest, Option, StudentRange } from '../types';

// Institution types offered in the form, same codes as siteConfig.institutions
export const institutionTypeOptions: Option<InstitutionTypeCode>[] = siteConfig.institutions.map(({ code, label }) => ({ value: code as InstitutionTypeCode, label: `${code} · ${label}` }));

export const studentRangeOptions: Option<StudentRange>[] = [
  { value: 'lt-200', label: 'Menos de 200' },
  { value: '200-500', label: '200 a 500' },
  { value: '500-1000', label: '500 a 1 000' },
  { value: 'gt-1000', label: 'Más de 1 000' },
];

export const moduleOptions: Option<ModuleInterest>[] = [
  { value: 'attendance', label: 'Asistencia' },
  { value: 'grades', label: 'Notas y evaluación' },
  { value: 'periods', label: 'Periodos y cursos' },
  { value: 'enrollment', label: 'Matrícula' },
  { value: 'cards', label: 'Carnets y fotochecks' },
  { value: 'tutoring', label: 'Tutoría y psicología' },
  { value: 'payments', label: 'Pensiones y pagos' },
  { value: 'reports', label: 'Reportes' },
];

// Reassurances shown beside the form
export const contactAssurances: ContactAssurance[] = [
  { icon: Clock3, title: 'Respuesta en un día hábil', description: 'Leemos cada mensaje y te proponemos una reunión para conocer tu institución.' },
  { icon: MonitorPlay, title: 'Demo con tu tipo de institución', description: 'Te mostramos los módulos y roles exactos que usarías: EBR, CEBA, CEBE, pre-universitario o instituto.' },
  { icon: CalendarCheck, title: 'Implementación acompañada', description: 'Cargamos tu estructura académica, periodos y usuarios para que empieces el año o ciclo sin fricción.' },
];

// Direct inboxes by topic
export const contactChannels: ContactChannel[] = [
  { icon: Mail, label: 'Ventas e implementación', description: 'Cotizaciones, demos y contratos.', email: siteConfig.emails.sales },
  { icon: LifeBuoy, label: 'Soporte', description: 'Instituciones que ya usan la plataforma.', email: siteConfig.emails.support },
  { icon: ShieldCheck, label: 'Privacidad', description: 'Datos personales y derechos ARCO.', email: siteConfig.emails.privacy },
];
