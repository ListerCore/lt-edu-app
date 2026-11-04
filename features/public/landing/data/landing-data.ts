import { HeartHandshake, MessagesSquare, Target } from 'lucide';
import type { InstitutionType } from '@/features/protected/dashboard/types';
import type { AboutValue, AccountAudience, LandingContent } from '../types';

// Same for every institution: who we are and what each person finds in their account
export const aboutStatement = 'Acompañamos a cada estudiante con exigencia y cercanía, y mantenemos a su familia al tanto de cada paso.';

export const aboutValues: AboutValue[] = [
  { icon: HeartHandshake, title: 'Acompañamiento cercano', description: 'Tutoría y psicología para cada estudiante, con seguimiento de su avance durante todo el periodo.' },
  { icon: MessagesSquare, title: 'Familias informadas', description: 'Comunicados, asistencia y notas en línea, sin esperar a la reunión de fin de periodo.' },
  { icon: Target, title: 'Exigencia con propósito', description: 'Evaluamos para aprender: cada nota viene con lo que falta lograr y cómo lograrlo.' },
];

export const accountAudiences: AccountAudience[] = [
  { title: 'Estudiantes', items: ['Horario del día y de la semana', 'Notas y avance por curso', 'Asistencia y justificaciones', 'Carnet digital'] },
  { title: 'Familias', items: ['Asistencia diaria de cada hijo', 'Notas y libretas', 'Estado de pensiones y pagos', 'Comunicados de la institución'] },
  { title: 'Docentes', items: ['Registro de asistencia por clase', 'Registro de notas', 'Comunicados a sus secciones', 'Horario y carga horaria'] },
];

const commonRequirements = ['Documento de identidad del estudiante', 'Foto tamaño carnet, de frente y con fondo claro'];

// Offer, admission and ID card wording per institution type; the site picks one with siteConfig.institutionType
export const landingContent: Record<InstitutionType, LandingContent> = {
  EBR: {
    heroLead: 'Educación inicial, primaria y secundaria con seguimiento diario para estudiantes y familias.',
    idCard: { name: 'Valeria Ccori Mamani', detail: '3.° de secundaria · Sección B', code: '2026-0412', role: 'Estudiante' },
    offer: {
      intro: 'Un mismo proyecto educativo acompaña a tu hijo en cada nivel, con evaluación por competencias.',
      sequential: true,
      items: [
        { name: 'Inicial', range: '3 a 5 años', description: 'Juego, lenguaje y autonomía en aulas pequeñas.' },
        { name: 'Primaria', range: '1.° a 6.° grado', description: 'Lectura, matemática y ciencia con un tutor por aula.' },
        { name: 'Secundaria', range: '1.° a 5.° año', description: 'Áreas por especialistas y orientación vocacional.' },
      ],
    },
    admission: {
      intro: 'Las vacantes se asignan por orden de inscripción. Te acompañamos en cada paso.',
      steps: [
        { title: 'Solicita información', description: 'Escríbenos o visítanos para conocer vacantes, horarios y pensiones.' },
        { title: 'Presenta los documentos', description: 'Entrega los requisitos en secretaría o súbelos en línea.' },
        { title: 'Entrevista con la familia', description: 'Conversamos con el estudiante y su familia para conocerlos.' },
        { title: 'Matrícula', description: 'Firmas la matrícula y recibes el acceso a tu cuenta.' },
      ],
      requirements: [...commonRequirements, 'Libreta o constancia de notas del último año', 'Partida de nacimiento'],
    },
  },
  EBA: {
    heroLead: 'Termina la primaria o la secundaria en horarios que se ajustan a tu trabajo y a tu familia.',
    idCard: { name: 'José Huamán Quispe', detail: 'Ciclo avanzado · 2.° grado', code: '2026-1187', role: 'Estudiante' },
    offer: {
      intro: 'Estudia en forma presencial, semipresencial o a distancia y obtén tu certificado oficial.',
      sequential: true,
      items: [
        { name: 'Ciclo inicial', range: '1.° y 2.° grado', description: 'Lectura, escritura y matemática básica.' },
        { name: 'Ciclo intermedio', range: '1.° a 3.° grado', description: 'Equivalente a la primaria completa.' },
        { name: 'Ciclo avanzado', range: '1.° a 4.° grado', description: 'Equivalente a la secundaria completa.' },
      ],
    },
    admission: {
      intro: 'Si dejaste tus estudios, retomas desde el grado que te corresponde.',
      steps: [
        { title: 'Solicita información', description: 'Te contamos las formas de atención y los horarios disponibles.' },
        { title: 'Prueba de ubicación', description: 'Si no tienes certificados, una prueba define tu ciclo y grado.' },
        { title: 'Convalidación', description: 'Reconocemos los grados que ya aprobaste en otra institución.' },
        { title: 'Matrícula', description: 'Eliges tu forma de atención y recibes el acceso a tu cuenta.' },
      ],
      requirements: [...commonRequirements, 'Certificados de estudios anteriores, si los tienes', 'Ser mayor de 14 años'],
    },
  },
  EBE: {
    heroLead: 'Atención especializada para estudiantes con discapacidad, con un plan para cada uno y su familia.',
    idCard: { name: 'Mateo Rojas Flores', detail: 'Primaria · Aula Girasoles', code: '2026-0058', role: 'Estudiante' },
    offer: {
      intro: 'Cada estudiante tiene un plan de orientación individual, terapias y un equipo que lo acompaña.',
      sequential: true,
      items: [
        { name: 'PRITE', range: '0 a 3 años', description: 'Intervención temprana con la familia.' },
        { name: 'Inicial', range: '3 a 6 años', description: 'Desarrollo de la comunicación y la autonomía.' },
        { name: 'Primaria', range: 'Hasta 20 años', description: 'Aprendizajes funcionales y para la vida diaria.' },
      ],
    },
    admission: {
      intro: 'La evaluación inicial define el nivel, el aula y los apoyos que necesita el estudiante.',
      steps: [
        { title: 'Solicita información', description: 'Conversamos sobre las necesidades del estudiante.' },
        { title: 'Evaluación psicopedagógica', description: 'El equipo evalúa al estudiante junto con su familia.' },
        { title: 'Plan de orientación individual', description: 'Definimos metas, terapias y apoyos para el año.' },
        { title: 'Matrícula', description: 'La familia recibe el acceso para seguir el avance en línea.' },
      ],
      requirements: [...commonRequirements, 'Certificado o informe de discapacidad, si lo tienes', 'Informes médicos o de terapias previas'],
    },
  },
  CEPRE: {
    heroLead: 'Prepárate para el examen de admisión con simulacros semanales y un ranking que muestra tu avance.',
    idCard: { name: 'Lucía Paredes Ríos', detail: 'Ciclo intensivo · Área B', code: '2026-3301', role: 'Alumno' },
    offer: {
      intro: 'Todos los ciclos incluyen simulacros, material de estudio y tutoría.',
      sequential: false,
      items: [
        { name: 'Ciclo regular', range: '16 semanas', description: 'Teoría y práctica completa de todos los cursos.' },
        { name: 'Ciclo intensivo', range: '8 semanas', description: 'Repaso acelerado con simulacros cada semana.' },
        { name: 'Ciclo de verano', range: '6 semanas', description: 'Para escolares que quieren adelantar su preparación.' },
      ],
    },
    admission: {
      intro: 'No hay examen de ingreso: te inscribes en el ciclo y el área de tu carrera.',
      steps: [
        { title: 'Elige tu ciclo y área', description: 'Según la universidad y la carrera a la que postulas.' },
        { title: 'Inscríbete', description: 'Completa tus datos en línea o en secretaría.' },
        { title: 'Realiza el pago', description: 'Puedes pagar el ciclo completo o en cuotas.' },
        { title: 'Empieza tus clases', description: 'Recibes tu horario, material y acceso a los simulacros.' },
      ],
      requirements: [...commonRequirements, 'Constancia de estudios de 5.° de secundaria o certificado'],
    },
  },
  IEST: {
    heroLead: 'Carreras técnicas de tres años con experiencias formativas en empresas desde el primer semestre.',
    idCard: { name: 'Ana Torres Salazar', detail: 'Enfermería técnica · III semestre', code: '2026-2044', role: 'Estudiante' },
    offer: {
      intro: 'Seis semestres académicos, prácticas en situaciones reales de trabajo y título a nombre de la Nación.',
      sequential: false,
      items: [
        { name: 'Enfermería técnica', range: '6 semestres', description: 'Cuidado del paciente en hospitales y centros de salud.' },
        { name: 'Desarrollo de sistemas', range: '6 semestres', description: 'Programación, bases de datos y soporte de aplicaciones.' },
        { name: 'Contabilidad', range: '6 semestres', description: 'Contabilidad, tributación y gestión financiera.' },
      ],
    },
    admission: {
      intro: 'El examen de admisión se toma dos veces al año, antes de cada semestre.',
      steps: [
        { title: 'Inscríbete al examen', description: 'Elige tu programa de estudios y completa tus datos.' },
        { title: 'Rinde el examen', description: 'Evaluamos aptitud académica y conocimientos generales.' },
        { title: 'Consulta los resultados', description: 'Se publican en la sección de comunicados.' },
        { title: 'Matrícula', description: 'Si ingresas, te matriculas en el primer semestre.' },
      ],
      requirements: [...commonRequirements, 'Certificado de estudios secundarios completos'],
    },
  },
};
