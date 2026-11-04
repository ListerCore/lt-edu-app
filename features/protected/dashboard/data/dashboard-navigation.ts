import { Award, BadgeCheck, Bell, BookOpen, Brain, CalendarDays, CalendarRange, ChartColumn, ClipboardCheck, ClipboardList, Clock, FileText, GraduationCap, HeartHandshake, IdCard, LayoutDashboard, Layers, School, ScrollText, Settings, ShieldAlert, UserCheck, UserCog, Users, UsersRound, Wallet } from 'lucide';
import type { InstitutionType, NavLabel, NavSection } from '../types';

export const DASHBOARD_PATH = '/dashboard';

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
          { label: { default: 'Niveles y grados', EBA: 'Ciclos y grados', CEPRE: 'Ciclos y áreas', IEST: 'Programas de estudio', EBE: 'Niveles y aulas' }, icon: Layers, href: path('academic/structure'), module: 'structure' },
          { label: { default: 'Bimestres', EBA: 'Semestres', CEPRE: 'Ciclos', IEST: 'Semestres académicos', EBE: 'Trimestres' }, icon: CalendarRange, href: path('academic/periods'), module: 'periods' },
          { label: { default: 'Cursos', EBR: 'Áreas y cursos', EBA: 'Áreas curriculares', IEST: 'Unidades didácticas' }, icon: BookOpen, href: path('academic/courses'), module: 'courses' },
          { label: 'Horarios', icon: Clock, href: path('academic/schedules'), module: 'schedules' },
        ],
      },
      { label: 'Matrícula', icon: ClipboardList, href: path('enrollment'), module: 'enrollment' },
      {
        label: 'Evaluación',
        icon: GraduationCap,
        children: [
          { label: 'Notas', icon: ClipboardCheck, href: path('evaluation/grades'), module: 'grades' },
          { label: 'Informes de progreso', icon: FileText, href: path('evaluation/progress-reports'), module: 'progress-reports' },
          { label: 'Simulacros', icon: Award, href: path('evaluation/mock-exams'), module: 'mock-exams' },
          { label: 'Prácticas y créditos', icon: BadgeCheck, href: path('evaluation/internships'), module: 'internships' },
        ],
      },
    ],
  },
  {
    label: 'Personas',
    items: [
      { label: 'Estudiantes', icon: UsersRound, href: path('students'), module: 'students' },
      { label: 'Docentes y personal', icon: Users, href: path('staff'), module: 'staff' },
      {
        label: 'Asistencia',
        icon: UserCheck,
        children: [
          { label: 'De estudiantes', icon: UsersRound, href: path('attendance/students'), module: 'student-attendance' },
          { label: 'De docentes', icon: CalendarDays, href: path('attendance/staff'), module: 'staff-attendance' },
        ],
      },
      { label: 'Carnets', icon: IdCard, href: path('cards'), module: 'cards' },
    ],
  },
  {
    label: 'Bienestar',
    items: [
      { label: 'Tutoría', icon: HeartHandshake, href: path('tutoring'), module: 'tutoring' },
      { label: 'Psicología', icon: Brain, href: path('psychology'), module: 'psychology' },
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
];
