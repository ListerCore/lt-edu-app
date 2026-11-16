import type { Role } from '@/features/protected/dashboard/types';

export interface GuideStep {
  title: string;
  text: string;
  // Panel page where it is done (relative to /dashboard)
  href?: string;
}

export interface Guide {
  title: string;
  intro: string;
  steps: GuideStep[];
}

// Short guides per role (phase E9): the first things each person does in the panel, in order
export const guides: Partial<Record<Role, Guide>> = {
  director: {
    title: 'Dirección',
    intro: 'Configura el CEBA, decide quién firma y revisa que todo avance.',
    steps: [
      { title: 'Ficha de la institución', text: 'Registra las autorizaciones (con su PDF) y la ficha de la plataforma: URL, proveedor, instancia y responsable técnico.', href: 'settings/institution' },
      { title: 'Usuarios', text: 'Invita al personal con su correo y su rol: coordinación, secretaría, docentes, tutores virtuales, responsable técnico.', href: 'settings/users' },
      { title: 'Estructura y periodo', text: 'Revisa ciclos, grados y secciones con su forma de atención, y el periodo promocional en curso.', href: 'academic/structure' },
      { title: 'Firmantes', text: 'En cada documento (actas de ubicación y de evaluación, constancias) elige quién firma. Las versiones pendientes esperan tu firma.' },
      { title: 'Seguimiento', text: 'Revisa la permanencia a distancia, el tablero de tutoría y las alertas de bienestar cada semana.', href: 'attendance/permanence' },
    ],
  },
  coordinator: {
    title: 'Coordinación académica',
    intro: 'Organiza las aulas virtuales, la evaluación y el cierre del periodo.',
    steps: [
      { title: 'Aulas virtuales', text: 'Genera las aulas del periodo (una por área y grado) y revisa que cada una tenga sus unidades publicadas.', href: 'classroom' },
      { title: 'Tutores', text: 'En Tutoría virtual › Asignación ves la carga de cada tutor y asignas tutor propio a quien lo necesite.', href: 'virtual-tutoring' },
      { title: 'Reglas de promoción', text: 'En el cierre, fija la regla de cada ciclo si el CEBA la define distinta a la norma por defecto.', href: 'evaluation/closing' },
      { title: 'Cierre', text: 'Al terminar el último periodo de evaluación: confirma cada sección, registra la recuperación, emite el acta y genérala para firma.', href: 'evaluation/closing' },
    ],
  },
  secretary: {
    title: 'Secretaría',
    intro: 'Matrícula, SIAGIE y documentos de los estudiantes.',
    steps: [
      { title: 'Importar la nómina', text: 'Descarga la plantilla, llénala con los estudiantes y súbela. Corrige las filas con error y concilia los totales por sección antes de importar.', href: 'enrollment/import' },
      { title: 'Ficha única', text: 'En cada estudiante completa la ficha única (lengua, ocupación, conectividad) y la exoneración de Religión si la pide.', href: 'students' },
      { title: 'Ubicación y convalidación', text: 'Registra el trámite, revisa el grado que propone el cuadro de equivalencias y genera el acta para la firma de dirección.', href: 'enrollment/placement' },
      { title: 'SIAGIE', text: 'Descarga la nómina y las notas para el SIAGIE; marca como exportados y anota las observaciones que te devuelva.', href: 'enrollment/roll' },
      { title: 'Constancias', text: 'En la ficha del estudiante, pestaña Constancias: emite la de matrícula, estudios o conclusión de ciclo.', href: 'students' },
    ],
  },
  teacher: {
    title: 'Docente',
    intro: 'Tu material, tus evaluaciones y tus notas.',
    steps: [
      { title: 'Arma tus unidades', text: 'En tu aula, crea unidades por semana con lecturas, videos, enlaces y archivos. Publica cuando estén listas.', href: 'classroom' },
      { title: 'Evaluaciones', text: 'Agrega cuestionarios o tareas con fecha de cierre e intentos. Califica con niveles AD, A, B y C y pásalos al registro.', href: 'classroom' },
      { title: 'Foros', text: 'Abre un foro de debate o de consultas y responde a tus estudiantes.', href: 'classroom' },
      { title: 'Notas', text: 'Revisa y completa el registro de cada competencia por periodo de evaluación.', href: 'evaluation/grades' },
    ],
  },
  tutor: {
    title: 'Tutor virtual',
    intro: 'Acompaña a tus estudiantes para que no abandonen.',
    steps: [
      { title: 'Tu tablero', text: 'Empieza por las alertas: quién no se conecta, quién tiene entregas vencidas, quién tiene permanencia baja.', href: 'virtual-tutoring' },
      { title: 'Escríbeles', text: 'Usa «Escribir» junto al estudiante. Responde los mensajes sin leer el mismo día.', href: 'virtual-tutoring' },
      { title: 'Agenda tutorías', text: 'Individuales o grupales, con el enlace de la videollamada. Después regístralas: quién vino, los acuerdos y un compromiso.', href: 'virtual-tutoring' },
      { title: 'Deriva cuando haga falta', text: 'A psicología desde Bienestar, o al SAANEE desde tu tablero, con su seguimiento.', href: 'virtual-tutoring' },
      { title: 'Permanencia', text: 'Revisa la permanencia de tu sección y ajusta una semana con justificación cuando corresponda.', href: 'attendance/permanence' },
    ],
  },
  technicalLead: {
    title: 'Responsable técnico',
    intro: 'Sostén la plataforma y arma el expediente de la DRE.',
    steps: [
      { title: 'Ficha de la plataforma', text: 'Mantén al día la URL, el proveedor, la instancia y la vigencia del servicio, con el contrato o captura adjunta.', href: 'settings/institution' },
      { title: 'Equipos', text: 'Registra el ambiente de tutoría, el inventario y las pruebas de conectividad y de acceso, con sus capturas.', href: 'compliance' },
      { title: 'Evidencias', text: 'Sube una captura por fila de cada informe (con perfiles de prueba, sin datos personales) y márcala como verificada.', href: 'compliance' },
      { title: 'Informes', text: 'Completa los datos y la conclusión de cada informe y descarga los dos PDF para firmarlos.', href: 'compliance' },
      { title: 'Disponibilidad y respaldos', text: 'Revisa la disponibilidad de la URL y confirma cada semana que el respaldo se restaura.', href: 'compliance' },
    ],
  },
  psychologist: {
    title: 'Psicología',
    intro: 'Atiende las derivaciones con reserva.',
    steps: [
      { title: 'Derivaciones', text: 'Revisa las derivaciones pendientes, abre el caso y registra las sesiones. Lo que anotas es confidencial.', href: 'psychology' },
      { title: 'Alertas', text: 'Revisa la bandeja de alertas de bienestar.', href: 'wellbeing' },
    ],
  },
  student: {
    title: 'Estudiante',
    intro: 'Estudia a tu ritmo desde el celular.',
    steps: [
      { title: 'Tu aula', text: 'Entra a tus aulas, revisa el material de la semana y entrega tus tareas antes de la fecha de cierre.', href: 'classroom' },
      { title: 'Foros', text: 'Participa en los foros de tus áreas: también cuenta como actividad.' },
      { title: 'Tu tutor', text: 'En «Tutoría virtual» escribe a tu tutor si no puedes conectarte y únete a tus tutorías con el enlace.', href: 'virtual-tutoring' },
      { title: 'Tus notas', text: 'Revisa tu informe de progreso al terminar cada periodo.', href: 'evaluation/report-cards' },
    ],
  },
};
