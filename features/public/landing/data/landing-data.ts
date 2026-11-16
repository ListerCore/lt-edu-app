import { BookOpen, ClipboardCheck, ClipboardList, FileLock2, GraduationCap, HeartHandshake, KeyRound, Megaphone, Radio, ScanLine, School, UserCog, Users, UsersRound, Wallet } from 'lucide';
import type { HeroFact, InstitutionVocabulary, PlatformModule, RoleAccess, SecurityPoint } from '../types';

// What every institution gets, told in three facts under the hero pitch
export const heroFacts: HeroFact[] = [
  { value: '5 tipos', label: 'de institución en una sola plataforma' },
  { value: 'Tu marca', label: 'logo y colores en el panel y los documentos' },
  { value: 'Cada día', label: 'backup cifrado y monitoreo continuo' },
];

export const supportedInstitutions = ['Colegios', 'CEBA', 'CEBE', 'Academias', 'Institutos'];

// Areas of the system in the order of the panel sidebar; each preview is what that screen shows first
export const platformModules: PlatformModule[] = [
  {
    id: 'enrollment',
    icon: ClipboardList,
    name: 'Matrícula',
    summary: 'Vacantes, documentos y matrícula por grado y sección, con el historial de cada estudiante.',
    features: ['Niveles, grados y secciones', 'Ubicación y convalidación', 'Fichas de estudiante y familia', 'Carnets con código QR'],
    preview: {
      title: 'Matrícula 2026',
      caption: 'Vacantes por grado',
      rows: [
        { label: '1.° de secundaria', detail: '3 secciones', value: '86 / 90', tone: 'warning' },
        { label: '2.° de secundaria', detail: '3 secciones', value: '78 / 90', tone: 'success' },
        { label: '3.° de secundaria', detail: '2 secciones', value: '60 / 60', tone: 'muted' },
        { label: '4.° de secundaria', detail: '2 secciones', value: '51 / 60', tone: 'success' },
      ],
    },
  },
  {
    id: 'attendance',
    icon: ScanLine,
    name: 'Asistencia',
    summary: 'El carnet se escanea en la puerta y la familia sabe al instante si su hijo llegó.',
    features: ['Ingreso con QR del carnet', 'Asistencia por clase', 'Justificaciones en línea', 'Asistencia de docentes'],
    preview: {
      title: 'Asistencia de hoy',
      caption: 'Por sección',
      rows: [
        { label: '3.° B', detail: 'Tutora: Rosa Medina', value: '31 / 32', tone: 'success' },
        { label: '3.° C', detail: 'Tutor: Luis Paucar', value: '28 / 31', tone: 'warning' },
        { label: '4.° A', detail: 'Tutora: Elena Soto', value: '30 / 30', tone: 'success' },
        { label: '5.° C', detail: 'Tutor: Jorge Vilca', value: '24 / 29', tone: 'warning' },
      ],
    },
  },
  {
    id: 'grades',
    icon: ClipboardCheck,
    name: 'Notas',
    summary: 'Registro por competencias o de 0 a 20, libretas al cierre del bimestre y ranking en academias.',
    features: ['Notas por competencias', 'Libretas e informes de progreso', 'Simulacros y ranking', 'Banco de preguntas'],
    preview: {
      title: 'Matemática · 3.° B',
      caption: 'II bimestre',
      rows: [
        { label: 'Resuelve problemas de cantidad', detail: '32 estudiantes', value: 'A', tone: 'success' },
        { label: 'Resuelve problemas de regularidad', detail: '32 estudiantes', value: 'B', tone: 'brand' },
        { label: 'Resuelve problemas de forma', detail: '32 estudiantes', value: 'A', tone: 'success' },
        { label: 'Resuelve problemas de gestión de datos', detail: 'Falta registrar', value: '—', tone: 'muted' },
      ],
    },
  },
  {
    id: 'payments',
    icon: Wallet,
    name: 'Pensiones',
    summary: 'Cuotas, pagos y deudas por familia, con recordatorios antes del vencimiento.',
    features: ['Cronograma de pensiones', 'Pagos y comprobantes', 'Deudas por familia', 'Reportes de cobranza'],
    preview: {
      title: 'Pensión de noviembre',
      caption: 'Vence el 30/11',
      rows: [
        { label: 'Familia Ccori Mamani', detail: '2 hijos', value: 'Pagado', tone: 'success' },
        { label: 'Familia Quispe Rojas', detail: '1 hijo', value: 'Pagado', tone: 'success' },
        { label: 'Familia Huamán Ccama', detail: '1 hijo', value: 'Pendiente', tone: 'warning' },
        { label: 'Familia Flores Ayala', detail: '3 hijos', value: 'Parcial', tone: 'brand' },
      ],
    },
  },
  {
    id: 'announcements',
    icon: Megaphone,
    name: 'Comunicados',
    summary: 'Publica para toda la institución o para una sección; llega en vivo, con imágenes y PDF.',
    features: ['Por audiencia: familias, docentes, sección', 'Adjuntos con vista previa', 'Destacados en la página de inicio', 'Actualización en tiempo real'],
    preview: {
      title: 'Comunicados',
      caption: 'Esta semana',
      rows: [
        { label: 'Reunión de padres de 3.° de secundaria', detail: 'Familias · 3.° B', value: 'Hoy', tone: 'brand' },
        { label: 'Cronograma de exámenes bimestrales', detail: 'Toda la institución', value: 'Ayer', tone: 'muted' },
        { label: 'Simulacro de sismo', detail: 'Toda la institución', value: 'Lun', tone: 'muted' },
        { label: 'Actualización de datos de contacto', detail: 'Familias', value: 'Lun', tone: 'muted' },
      ],
    },
  },
];

export const roleAccess: RoleAccess[] = [
  { icon: School, title: 'Dirección', description: 'La institución completa en un vistazo.', items: ['Indicadores de asistencia y notas', 'Cobranza del mes', 'Usuarios, roles y auditoría'] },
  { icon: UserCog, title: 'Secretaría', description: 'Los trámites, sin papeles sueltos.', items: ['Matrícula y fichas', 'Carnets y constancias', 'Pagos y comprobantes'] },
  { icon: BookOpen, title: 'Docentes', description: 'Sus secciones y nada más.', items: ['Asistencia por clase', 'Registro de notas', 'Comunicados a sus aulas'] },
  { icon: GraduationCap, title: 'Estudiantes', description: 'Su día en el celular.', items: ['Horario y material', 'Notas por curso', 'Carnet digital'] },
  { icon: UsersRound, title: 'Familias', description: 'Al tanto sin esperar la reunión.', items: ['Llegada de cada hijo', 'Libretas y avance', 'Pensiones y comunicados'] },
  { icon: HeartHandshake, title: 'Tutoría y psicología', description: 'El seguimiento de cada caso.', items: ['Fichas de tutoría', 'Alertas de bienestar', 'Escuela de padres'] },
];

// Taken from the panel sidebar labels: the same system speaks each institution's language
export const institutionVocabulary: InstitutionVocabulary[] = [
  { type: 'EBR', name: 'Educación Básica Regular', levels: 'Inicial, primaria y secundaria', periods: 'Bimestres', courses: 'Áreas y cursos' },
  { type: 'EBA', name: 'Educación Básica Alternativa', levels: 'Ciclos inicial, intermedio y avanzado', periods: 'Periodos promocionales', courses: 'Áreas curriculares' },
  { type: 'EBE', name: 'Educación Básica Especial', levels: 'PRITE, inicial y primaria', periods: 'Trimestres', courses: 'Áreas de desarrollo' },
  { type: 'CEPRE', name: 'Academia preuniversitaria', levels: 'Áreas y aulas', periods: 'Ciclos', courses: 'Cursos y simulacros' },
  { type: 'IEST', name: 'Instituto de educación superior', levels: 'Programas de estudio', periods: 'Semestres académicos', courses: 'Unidades didácticas' },
];

export const securityPoints: SecurityPoint[] = [
  { icon: Users, title: 'Permisos por rol e institución', description: 'Una misma persona puede ser docente en un colegio y apoderada en otro; en cada uno ve solo lo suyo.' },
  { icon: KeyRound, title: 'Verificación en dos pasos', description: 'Código de una app de autenticación al ingresar y códigos de respaldo para cuando no tienes el celular.' },
  { icon: FileLock2, title: 'Archivos privados', description: 'Los adjuntos se entregan solo a quien tiene permiso de verlos, nunca con un enlace público.' },
  { icon: Radio, title: 'Todo al día, en vivo', description: 'Un comunicado publicado o una asistencia registrada aparece al momento, sin recargar la página.' },
];
