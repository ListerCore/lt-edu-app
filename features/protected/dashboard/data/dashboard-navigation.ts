import {
  Accessibility,
  Activity,
  Award,
  BadgeCheck,
  Bell,
  BellRing,
  BookOpen,
  CircleUserRound,
  Brain,
  Briefcase,
  CalendarDays,
  CalendarRange,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
  ClipboardPen,
  Clock,
  FileCheck,
  FileSearch,
  FileText,
  FolderOpen,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Home,
  IdCard,
  LayoutDashboard,
  Layers,
  Library,
  NotebookText,
  School,
  ScrollText,
  Settings,
  Shapes,
  ShieldAlert,
  Trophy,
  UserCheck,
  UserCog,
  Users,
  UsersRound,
  Wallet,
} from 'lucide';
import type { InstitutionType, NavLabel, NavSection } from '../types';

export const DASHBOARD_PATH = '/dashboard';
export const ACCOUNT_PATH = `${DASHBOARD_PATH}/account`;

const path = (segment: string): string => `${DASHBOARD_PATH}/${segment}`;

// Picks the label for the institution type, falling back to the shared one
export const resolveLabel = (label: NavLabel, institutionType: InstitutionType): string => (typeof label === 'string' ? label : (label[institutionType] ?? label.default));

// Sidebar tree: sections → first-level items → (optional) second-level leaves. Permissions filter it per role and type
export const dashboardNavigation: NavSection[] = [
  {
    label: 'General',
    items: [
      { label: 'Inicio', icon: LayoutDashboard, href: DASHBOARD_PATH, module: 'home' },
      { label: 'Comunicados', icon: Bell, href: path('announcements'), module: 'announcements' },
    ],
  },
  {
    label: 'Académico',
    items: [
      {
        label: 'Estructura académica',
        icon: School,
        children: [
          { label: { default: 'Niveles y grados', EBA: 'Ciclos y grados', CEPRE: 'Áreas y aulas', IEST: 'Programas de estudio', EBE: 'Niveles y aulas' }, icon: Layers, href: path('academic/structure'), module: 'structure' },
          { label: 'Formas de atención', icon: Shapes, href: path('academic/attention-modes'), module: 'attention-modes' },
          { label: { default: 'Bimestres', EBA: 'Periodos promocionales', CEPRE: 'Ciclos', IEST: 'Semestres académicos', EBE: 'Trimestres' }, icon: CalendarRange, href: path('academic/periods'), module: 'periods' },
          { label: 'Plan de estudios', icon: BookOpen, href: path('academic/courses'), module: 'courses' },
          { label: 'Horarios', icon: Clock, href: path('academic/schedules'), module: 'schedules' },
        ],
      },
      {
        label: { default: 'Matrícula', CEPRE: 'Inscripciones' },
        icon: ClipboardList,
        children: [
          { label: { default: 'Matrícula', CEPRE: 'Inscripción por ciclo' }, icon: ClipboardList, href: path('enrollment'), module: 'enrollment' },
          { label: 'Ubicación y convalidación', icon: FileSearch, href: path('enrollment/placement'), module: 'placement' },
        ],
      },
      {
        label: 'Evaluación',
        icon: GraduationCap,
        children: [
          { label: { default: 'Notas', EBR: 'Notas por competencias', EBA: 'Notas por competencias', IEST: 'Notas (0 a 20)' }, icon: ClipboardCheck, href: path('evaluation/grades'), module: 'grades' },
          { label: { default: 'Libretas', IEST: 'Boletas de notas' }, icon: NotebookText, href: path('evaluation/report-cards'), module: 'report-cards' },
          { label: { default: 'Cierre del año y actas', IEST: 'Cierre del semestre y actas' }, icon: FileCheck, href: path('evaluation/closing'), module: 'closing' },
          { label: 'Informes de progreso', icon: FileText, href: path('evaluation/progress-reports'), module: 'progress-reports' },
          { label: 'Simulacros', icon: Award, href: path('evaluation/mock-exams'), module: 'mock-exams' },
          { label: 'Ranking', icon: Trophy, href: path('evaluation/rankings'), module: 'rankings' },
          { label: 'Banco de preguntas', icon: Library, href: path('evaluation/question-bank'), module: 'question-bank' },
        ],
      },
      { label: 'Material de estudio', icon: FolderOpen, href: path('study-materials'), module: 'study-materials' },
      {
        label: 'Certificación',
        icon: BadgeCheck,
        children: [
          { label: 'Experiencias formativas', icon: Briefcase, href: path('certification/internships'), module: 'internships' },
          { label: 'Certificados', icon: ScrollText, href: path('certification/certificates'), module: 'certificates' },
          { label: 'Titulación', icon: GraduationCap, href: path('certification/degrees'), module: 'degrees' },
        ],
      },
    ],
  },
  {
    label: 'Personas',
    items: [
      { label: { default: 'Estudiantes', CEPRE: 'Alumnos' }, icon: UsersRound, href: path('students'), module: 'students' },
      { label: 'Docentes y personal', icon: Users, href: path('staff'), module: 'staff' },
      {
        label: 'Asistencia',
        icon: UserCheck,
        children: [
          { label: { default: 'De estudiantes', CEPRE: 'De alumnos' }, icon: UsersRound, href: path('attendance/students'), module: 'student-attendance' },
          { label: 'De docentes', icon: CalendarDays, href: path('attendance/staff'), module: 'staff-attendance' },
        ],
      },
      { label: 'Carnets', icon: IdCard, href: path('cards'), module: 'cards' },
    ],
  },
  {
    label: 'Bienestar',
    items: [
      {
        label: 'Atención especializada',
        icon: HandHeart,
        children: [
          { label: 'Planes de orientación individual', icon: ClipboardPen, href: path('special-care/individual-plans'), module: 'individual-plans' },
          { label: 'Terapias', icon: Activity, href: path('special-care/therapies'), module: 'therapies' },
          { label: 'Apoyo a la inclusión (SAANEE)', icon: Accessibility, href: path('special-care/inclusion'), module: 'inclusion-support' },
        ],
      },
      { label: 'Tutoría', icon: HeartHandshake, href: path('tutoring'), module: 'tutoring' },
      { label: 'Psicología', icon: Brain, href: path('psychology'), module: 'psychology' },
      { label: 'Escuela de padres', icon: Home, href: path('parent-school'), module: 'parent-school' },
      { label: 'Alertas', icon: ShieldAlert, href: path('wellbeing'), module: 'wellbeing' },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { label: 'Pensiones y pagos', icon: Wallet, href: path('payments'), module: 'payments' },
      { label: 'Reportes', icon: ChartColumn, href: path('reports'), module: 'reports' },
      {
        label: 'Configuración',
        icon: Settings,
        children: [
          { label: 'Institución', icon: School, href: path('settings/institution'), module: 'institution' },
          { label: 'Usuarios y roles', icon: UserCog, href: path('settings/users'), module: 'users' },
          { label: 'Auditoría', icon: ScrollText, href: path('settings/audit'), module: 'audit' },
        ],
      },
    ],
  },
  {
    label: 'Cuenta',
    items: [
      { label: 'Notificaciones', icon: BellRing, href: path('notifications'), module: 'notifications' },
      { label: 'Mi cuenta', icon: CircleUserRound, href: ACCOUNT_PATH, module: 'account' },
    ],
  },
];
