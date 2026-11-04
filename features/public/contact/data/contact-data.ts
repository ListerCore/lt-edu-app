import { CalendarCheck, ClipboardList, Clock3, LifeBuoy, Mail, ShieldCheck } from 'lucide';
import { siteConfig } from '@/lib/site';
import type { ContactAssurance, ContactChannel, ContactRelation, ContactTopic, Option } from '../types';

export const relationOptions: Option<ContactRelation>[] = [
  { value: 'applicant', label: 'Postulante o estudiante' },
  { value: 'guardian', label: 'Padre, madre o apoderado' },
  { value: 'other', label: 'Otro' },
];

// Reasons to write, valid for every institution type
export const topicOptions: Option<ContactTopic>[] = [
  { value: 'admission', label: 'Admisión y matrícula' },
  { value: 'academic', label: 'Información académica' },
  { value: 'payments', label: 'Pensiones y pagos' },
  { value: 'documents', label: 'Certificados y constancias' },
  { value: 'platform', label: 'Acceso a mi cuenta' },
  { value: 'other', label: 'Otro' },
];

// Reassurances shown beside the form
export const contactAssurances: ContactAssurance[] = [
  { icon: Clock3, title: 'Respuesta en un día hábil', description: 'Secretaría revisa cada mensaje y te responde por correo o WhatsApp.' },
  { icon: ClipboardList, title: 'Orientación de admisión', description: 'Te explicamos requisitos, fechas y documentos según el nivel, ciclo o programa que te interesa.' },
  { icon: CalendarCheck, title: 'Visitas a la sede', description: 'Coordina una visita para conocer las instalaciones y al equipo.' },
];

// Direct inboxes by topic
export const contactChannels: ContactChannel[] = [
  { icon: Mail, label: 'Informes y admisión', description: 'Requisitos, vacantes, matrícula y pensiones.', email: siteConfig.emails.info },
  { icon: LifeBuoy, label: 'Soporte técnico', description: 'Problemas para ingresar o usar tu cuenta.', email: siteConfig.emails.support },
  { icon: ShieldCheck, label: 'Privacidad', description: 'Datos personales y derechos ARCO.', email: siteConfig.emails.privacy },
];
