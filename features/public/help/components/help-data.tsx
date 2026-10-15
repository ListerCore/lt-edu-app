import { BookOpenCheck, Check, Mail, Wifi } from 'lucide-react';

export const onboardingSteps = [
  { title: 'Activa tu cuenta institucional', description: 'Revisa tu correo y sigue las instrucciones para crear tu contraseña.', icon: Mail, timing: 'Primer ingreso' },
  { title: 'Ingresa al Aula Virtual SIGE-JL', description: 'Accede desde tu computadora o celular y completa tu perfil.', icon: Wifi, timing: 'Luego' },
  { title: 'Revisa cursos y horarios', description: 'Ubica tus cursos, docentes, materiales y fechas de actividades.', icon: BookOpenCheck, timing: 'Cada semana' },
  { title: 'Entrega tu primera actividad', description: 'Participa en las actividades y confirma que tus archivos se enviaron.', icon: Check, timing: 'A tu ritmo' },
];
