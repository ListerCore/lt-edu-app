import { Award, BookOpenCheck, CalendarClock, ClipboardCheck, GraduationCap, Laptop, LockKeyhole, MessageCircle, NotebookPen, Play, UserRoundCheck } from 'lucide-react';

export const programs = [
  {
    cycle: 'Ciclo Inicial',
    grades: '1.° y 2.° grado',
    description: 'Fortalece tus aprendizajes y avanza con una base sólida para continuar tus estudios.',
    duration: '2 grados',
    icon: BookOpenCheck,
    color: 'text-primary',
  },
  {
    cycle: 'Ciclo Intermedio',
    grades: '1.° y 2.° grado',
    description: 'Desarrolla competencias para seguir creciendo en tu vida personal, familiar y laboral.',
    duration: '2 grados',
    icon: NotebookPen,
    color: 'text-secondary',
  },
  {
    cycle: 'Ciclo Avanzado',
    grades: '1.° al 4.° grado',
    description: 'Completa la secundaria y obtén tu certificado oficial para abrir nuevas oportunidades.',
    duration: '4 grados',
    icon: GraduationCap,
    color: 'text-primary',
  },
];

export const benefits = [
  { title: 'Aula virtual 24/7', description: 'Estudia y consulta tus materiales cuando tengas tiempo, desde cualquier dispositivo.', icon: Laptop },
  { title: 'Acompañamiento cercano', description: 'Docentes y tutores te orientan durante cada etapa de tu aprendizaje.', icon: UserRoundCheck },
  { title: 'Horarios flexibles', description: 'Organiza tus clases alrededor de tu trabajo, familia y actividades.', icon: CalendarClock },
  { title: 'Avance visible', description: 'Revisa tus actividades, evaluaciones y progreso desde tu espacio virtual.', icon: ClipboardCheck },
  { title: 'Entorno seguro', description: 'Accede a una plataforma privada pensada para acompañar tu experiencia educativa.', icon: LockKeyhole },
  { title: 'Certificación oficial', description: 'Culmina tus estudios de acuerdo con el programa de Educación Básica Alternativa.', icon: Award },
];

export const enrollmentSteps = [
  { title: 'Preinscríbete', description: 'Déjanos tus datos para iniciar la orientación de matrícula.', icon: NotebookPen },
  { title: 'Conversemos', description: 'Un asesor te ayudará a identificar el ciclo que te corresponde.', icon: MessageCircle },
  { title: 'Completa tus documentos', description: 'Recibe orientación para presentar la documentación necesaria.', icon: ClipboardCheck },
  { title: 'Empieza tus clases', description: 'Activa tu acceso al aula virtual y organiza tu horario.', icon: Play },
];
