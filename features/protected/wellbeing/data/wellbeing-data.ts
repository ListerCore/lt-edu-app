export type RiskLevel = 'Crítico' | 'Moderado' | 'Estable';

export interface WellbeingStudent {
  id: string;
  initials: string;
  name: string;
  dni: string;
  age: number;
  grade: string;
  cycle: string;
  occupation: string;
  risk: RiskLevel;
  reason: string;
  attendance: number;
  tasks: string;
  level: string;
  lastIntervention: string;
  nextAppointment: string;
  contact: string;
  motivation: string;
  family: string;
  learningStyle: string;
  adaptation: string;
  supportPlan: string[];
}

export const wellbeingStudents: WellbeingStudent[] = [
  { id: 'silvia', initials: 'SC', name: 'Silvia Cárdenas Palomino', dni: '74819203', age: 28, grade: '2.° Avanzado B', cycle: 'Avanzado', occupation: 'Operaria textil / confecciones', risk: 'Crítico', reason: 'Sobrecarga laboral nocturna; sin acceso a PC durante su jornada', attendance: 41, tasks: '2 / 7', level: 'C · Inicio', lastIntervention: 'Llamada telefónica · 19/10', nextAppointment: 'Hoy · 16:30 · Meet', contact: 'Datos móviles prepago · Bitel / Claro', motivation: 'Tiene interés en Enfermería Técnica o Contabilidad. Cuando se acumulan tareas, le ayudan metas cortas y fechas de entrega flexibles.', family: 'Cuenta con apoyo parcial de su hermana mayor para el cuidado de su hija. Estudia desde el teléfono celular.', learningStyle: 'Visual y práctico; prefiere infografías, explicaciones breves y cápsulas de audio.', adaptation: 'Aceptar fotografías de cuaderno y notas de voz. Extender plazos de entrega hasta los domingos sin penalización.', supportPlan: ['Subir tres evidencias pendientes los domingos antes de las 23:59 · revisión 25 oct.', 'Coordinar tutoría entre pares con Juan Pérez para compartir resúmenes.', 'Evaluar avance de nivelación de C a B después de revisar el portafolio.'] },
  { id: 'edwin', initials: 'EM', name: 'Edwin Mendoza Alarcón', dni: '46193021', age: 34, grade: '3.° Avanzado A', cycle: 'Avanzado', occupation: 'Comerciante independiente', risk: 'Moderado', reason: 'Cruce con horario de cierre comercial y tardanzas en sesiones', attendance: 68, tasks: '5 / 7', level: 'B · Proceso', lastIntervention: 'Reunión Meet · 21/10', nextAppointment: 'Viernes · 20:00', contact: 'Conexión móvil irregular durante el cierre', motivation: 'Quiere completar la secundaria y mejorar sus oportunidades de trabajo.', family: 'Su familia apoya sus estudios, aunque los horarios del comercio varían durante la semana.', learningStyle: 'Aprende mejor con resúmenes breves y grabaciones que pueda revisar fuera del horario comercial.', adaptation: 'Compartir grabaciones de clases y permitir actividades asincrónicas en días de mayor actividad.', supportPlan: ['Enviar cápsula audiovisual de Matemática y CTS.', 'Revisar asistencia síncrona al cierre de la siguiente quincena.', 'Mantener tutoría entre pares para recuperar contenidos clave.'] },
  { id: 'brayan', initials: 'BQ', name: 'Brayan Quispe Sulca', dni: '70349182', age: 22, grade: '1.° Avanzado C', cycle: 'Avanzado', occupation: 'Trabajador del agro · Huanta', risk: 'Moderado', reason: 'Conectividad intermitente en zona rural y paquetes de datos agotados', attendance: 62, tasks: '6 / 7', level: 'B · Proceso', lastIntervention: 'Llamada de tutoría · 17/10', nextAppointment: 'Sin cita próxima', contact: 'Conectividad rural limitada', motivation: 'Desea completar sus estudios mientras apoya las actividades agrícolas de su familia.', family: 'Reside en una zona con cobertura móvil limitada y comparte dispositivo en el hogar.', learningStyle: 'Material descargable y audios que pueda consultar sin conexión.', adaptation: 'Entregar guías comprimidas para uso offline y recibir tareas cuando recupere conectividad.', supportPlan: ['Activar paquete descargable de guías en PDF y audio.', 'Recibir tareas por el canal institucional cuando vuelva la señal.', 'Revisar conexión y participación en la próxima llamada.'] },
  { id: 'juan', initials: 'JP', name: 'Juan Pérez Huamán', dni: '45892100', age: 30, grade: '2.° Avanzado B', cycle: 'Avanzado', occupation: 'Asistente administrativo / logística', risk: 'Estable', reason: 'Organización de tiempo consolidada; sin dificultades críticas', attendance: 92, tasks: '7 / 7', level: 'A · Esperado', lastIntervention: 'Tutoría grupal · 15/10', nextAppointment: 'Monitoreo mensual', contact: 'Acceso regular a clases virtuales', motivation: 'Participa activamente en talleres vocacionales y acompaña a sus pares.', family: 'Cuenta con horarios de estudio estables y una red de apoyo familiar.', learningStyle: 'Prefiere sesiones colaborativas y ejemplos aplicados a situaciones laborales.', adaptation: 'Mantener seguimiento mensual ordinario y participación como tutor par voluntario.', supportPlan: ['Continuar con monitoreo mensual.', 'Compartir apuntes de sesiones con tutoría entre pares.', 'Participar en taller vocacional del periodo.'] },
];

export const interventionHistory = [
  { title: 'Intento de llamada por desconexión prolongada', date: '19 oct 2026 · 19:40', detail: 'Se coordinó con su hermana el mejor horario para comunicarse. La estudiante devolverá la llamada al finalizar su turno.', channel: 'Vía celular', status: 'Seguimiento pendiente' },
  { title: 'Sesión síncrona de reorientación académica', date: '12 oct 2026 · 21:00', detail: 'Se revisó el avance en Comunicación Integral y Ciencias. Acordaron reprogramar las evidencias pendientes.', channel: 'Meet institucional', status: 'Compromiso firmado' },
  { title: 'Ficha diagnóstica inicial EBA', date: '01 set 2026', detail: 'Registro inicial del entorno sociofamiliar, disponibilidad tecnológica y preferencias de aprendizaje.', channel: 'Coordinación de tutoría', status: 'Registrado' },
];
