export type WorkspaceModule = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  metrics: { label: string; value: string; detail: string }[];
  actions: string[];
  recordsTitle: string;
  records: { title: string; subtitle: string; status: string; detail: string }[];
  sideTitle: string;
  sideItems: { title: string; detail: string; time: string }[];
};

export const workspaceModules: Record<string, WorkspaceModule> = {
  students: {
    slug: 'students', title: 'Directorio de estudiantes', eyebrow: 'COMUNIDAD EDUCATIVA', description: 'Consulta expedientes, datos de contacto y situación académica de la comunidad estudiantil EBA.',
    metrics: [{ label: 'Estudiantes activos', value: '1,485', detail: 'Periodo 2026-II' }, { label: 'Ciclo avanzado', value: '885', detail: '60% de la matrícula' }, { label: 'Expedientes por revisar', value: '12', detail: 'Requieren actualización' }],
    actions: ['Registrar estudiante', 'Exportar directorio'], recordsTitle: 'Estudiantes recientes',
    records: [{ title: 'Juan Pérez Huamán', subtitle: 'DNI 47829103 · Avanzado, 3.° · Ayacucho', status: 'Activo', detail: 'Último acceso hoy · Matemática funcional' }, { title: 'María Quispe Gutiérrez', subtitle: 'DNI 70482916 · Intermedio, 2.° · Huamanga', status: 'Activo', detail: 'Expediente completo · Asistencia 96%' }, { title: 'Luis Cárdenas Soto', subtitle: 'DNI 73164520 · Avanzado, 4.° · Carmen Alto', status: 'Pendiente', detail: 'Falta actualizar contacto de emergencia' }, { title: 'Rosa Huamán de la Cruz', subtitle: 'DNI 69281347 · Inicial, 1.° · Ayacucho', status: 'Activo', detail: 'Matrícula confirmada · Asistencia 91%' }],
    sideTitle: 'Seguimiento pendiente', sideItems: [{ title: 'Actualizar datos de contacto', detail: '3 expedientes con teléfono sin validar', time: 'Esta semana' }, { title: 'Documentos por verificar', detail: '12 expedientes requieren revisión', time: 'Prioridad media' }, { title: 'Nuevos ingresos', detail: '18 estudiantes registrados este mes', time: 'Octubre' }],
  },
  enrollment: {
    slug: 'enrollment', title: 'Matrícula y expediente digital', eyebrow: 'GESTIÓN ACADÉMICA · EBA', description: 'Ruta integral del postulante según la directiva RVM N.° 125-2020-MINEDU.',
    metrics: [{ label: 'Matrículas del periodo', value: '1,485', detail: '2026-II · 94% confirmadas' }, { label: 'En evaluación', value: '18', detail: 'Convalidación curricular' }, { label: 'Expedientes incompletos', value: '12', detail: 'Pendientes de subsanación' }],
    actions: ['Nuevo registro', 'Exportar reporte'], recordsTitle: 'Ruta del postulante',
    records: [{ title: '1. Preinscripción y registro', subtitle: 'Datos personales, identidad y antecedentes educativos', status: 'En curso', detail: '6 postulantes requieren validación documental' }, { title: '2. Evaluación y convalidación', subtitle: 'Reconocimiento de aprendizajes previos y ubicación EBA', status: '18 pendientes', detail: 'Asistente de convalidación curricular disponible' }, { title: '3. Asignación de ciclo y grado', subtitle: 'Ubicación según trayectoria educativa validada', status: 'Revisar', detail: '4 propuestas esperan aprobación académica' }, { title: '4. Matrícula y emisión FUM', subtitle: 'Ficha única de matrícula y expediente digital', status: 'Activo', detail: 'Periodo lectivo 2026-II · 1,485 matrículas' }],
    sideTitle: 'Asistente de convalidación', sideItems: [{ title: 'Revisión curricular sugerida', detail: 'Cruce de certificados con áreas CNEB de EBA', time: 'Disponible' }, { title: 'Validación documental', detail: 'DNI, certificados y declaración jurada', time: '12 pendientes' }, { title: 'Normativa aplicada', detail: 'RVM N.° 125-2020-MINEDU', time: 'Vigente' }],
  },
  attendance: {
    slug: 'attendance', title: 'Asistencia y seguimiento virtual', eyebrow: 'PERMANENCIA EBA', description: 'Monitorea la actividad del campus, las sesiones y las señales tempranas de inasistencia.',
    metrics: [{ label: 'Asistencia del periodo', value: '94.2%', detail: '+2.1% frente al mes anterior' }, { label: 'Activos últimas 48 h', value: '1,206', detail: '81.2% de estudiantes' }, { label: 'Riesgo de inasistencia', value: '14', detail: 'Requieren contacto tutorial' }],
    actions: ['Registrar asistencia', 'Descargar consolidado'], recordsTitle: 'Matriz de permanencia y riesgo',
    records: [{ title: 'Juan Pérez Huamán', subtitle: 'Avanzado · Matemática funcional · 3 sesiones', status: 'En seguimiento', detail: 'Sin actividad en campus por 36 horas' }, { title: 'María Quispe Gutiérrez', subtitle: 'Intermedio · Comunicación · 5 sesiones', status: 'Regular', detail: 'Último acceso hoy · asistencia 96%' }, { title: 'Luis Cárdenas Soto', subtitle: 'Avanzado · Ciencia y tecnología · 2 sesiones', status: 'Alerta', detail: 'Dos sesiones consecutivas sin conexión' }, { title: 'Rosa Huamán de la Cruz', subtitle: 'Inicial · Matemática · 4 sesiones', status: 'Regular', detail: 'Participación estable durante la semana' }],
    sideTitle: 'Agente de retención', sideItems: [{ title: 'Contactar estudiantes en alerta', detail: 'Priorizar a quienes acumulan 2 faltas consecutivas', time: '14 casos' }, { title: 'Validar sesiones virtuales', detail: 'Cruzar asistencia con actividad y entregas', time: 'Últimas 48 h' }, { title: 'Consolidado semanal', detail: 'Resumen por ciclo, área y docente', time: 'Actualizado hoy' }],
  },
  evaluation: {
    slug: 'evaluation', title: 'Evaluación de competencias', eyebrow: 'LOGROS DE APRENDIZAJE EBA', description: 'Registra evidencias y niveles de logro alineados al Currículo Nacional de Educación Básica.',
    metrics: [{ label: 'Competencias evaluadas', value: '78%', detail: 'Periodo 2026-II' }, { label: 'Logro esperado o destacado', value: '86.8%', detail: '+4.6% respecto al periodo anterior' }, { label: 'Evidencias por revisar', value: '32', detail: 'En 6 áreas curriculares' }],
    actions: ['Registrar evaluación', 'Exportar libreta'], recordsTitle: 'Seguimiento por competencias',
    records: [{ title: 'Resuelve problemas de cantidad', subtitle: 'Matemática funcional · Avanzado', status: 'En proceso', detail: 'Evidencias: presupuesto familiar y cálculo de costos' }, { title: 'Se comunica oralmente en su lengua materna', subtitle: 'Comunicación · Intermedio', status: 'Esperado', detail: 'Última evidencia registrada el 14 de octubre' }, { title: 'Gestiona responsablemente los recursos económicos', subtitle: 'Ciencias sociales · Avanzado', status: 'Por evaluar', detail: 'Pendiente retroalimentación docente' }, { title: 'Indaga mediante métodos científicos', subtitle: 'Ciencia y tecnología · Inicial', status: 'Esperado', detail: '3 evidencias registradas en la unidad actual' }],
    sideTitle: 'Libreta de notas', sideItems: [{ title: 'Corte de evaluación 2026-II', detail: 'Registro abierto hasta el 30 de noviembre', time: 'En curso' }, { title: 'Retroalimentación pendiente', detail: '32 evidencias esperan devolución docente', time: 'Atención' }, { title: 'Escala de logro CNEB', detail: 'AD · A · B · C', time: 'Referencia' }],
  },
  classrooms: {
    slug: 'classrooms', title: 'Aula virtual EBA', eyebrow: 'ENTORNO DE APRENDIZAJE', description: 'Organiza sesiones, recursos y participación de los estudiantes en el campus virtual.',
    metrics: [{ label: 'Aulas activas', value: '24', detail: 'En 6 áreas curriculares' }, { label: 'Participación semanal', value: '89%', detail: 'Estudiantes con actividad' }, { label: 'Recursos publicados', value: '186', detail: 'Materiales y actividades' }],
    actions: ['Crear aula', 'Publicar recurso'], recordsTitle: 'Sesiones y recursos recientes',
    records: [{ title: 'Modelación financiera y fracciones', subtitle: 'Matemática funcional · Unidad didáctica 2', status: 'En vivo', detail: 'Sesión práctica · costos y rentabilidad en producción textil' }, { title: 'Grabación: costos y rentabilidad', subtitle: 'Matemática · Material audiovisual', status: 'Publicado', detail: 'Disponible para repaso · 42 minutos' }, { title: 'Lectura crítica de textos locales', subtitle: 'Comunicación · Unidad didáctica 3', status: 'Publicado', detail: 'Guía de lectura y actividad de comprensión' }, { title: 'Proyecto de emprendimiento familiar', subtitle: 'Educación para el trabajo · Avanzado', status: 'Borrador', detail: 'Revisar instrucciones antes de publicar' }],
    sideTitle: 'Actividad del aula', sideItems: [{ title: 'Estudiantes en alerta', detail: 'Sin ingreso a sus aulas durante 48 horas', time: '14 estudiantes' }, { title: 'Validar asistencia virtual', detail: 'Confirmar registro de sesiones síncronas', time: '3 sesiones' }, { title: 'Próximos vencimientos', detail: 'Actividades con fecha límite esta semana', time: '8 actividades' }],
  },
  alerts: {
    slug: 'alerts', title: 'Alertas e inteligencia educativa', eyebrow: 'PREVENCIÓN Y ACOMPAÑAMIENTO', description: 'Centraliza señales de riesgo académico, inasistencia, matrícula y permanencia para facilitar una respuesta oportuna.',
    metrics: [{ label: 'Alertas abiertas', value: '26', detail: 'En todos los módulos' }, { label: 'Riesgo alto', value: '5', detail: 'Atención prioritaria' }, { label: 'Casos atendidos', value: '84%', detail: 'Durante el periodo actual' }],
    actions: ['Crear alerta', 'Exportar seguimiento'], recordsTitle: 'Bandeja de alertas',
    records: [{ title: 'Inasistencia consecutiva', subtitle: 'Luis Cárdenas Soto · Avanzado', status: 'Prioridad alta', detail: 'Dos sesiones virtuales sin conexión · sugerido: contacto tutorial' }, { title: 'Riesgo de interrupción de estudios', subtitle: 'Juan Pérez Huamán · Avanzado', status: 'Prioridad alta', detail: 'Caída de actividad en campus durante las últimas 36 horas' }, { title: 'Expediente pendiente de subsanación', subtitle: '3 estudiantes · Matrícula 2026-II', status: 'Pendiente', detail: 'Falta validar documento de identidad o certificados' }, { title: 'Retroalimentación académica pendiente', subtitle: 'Área de Matemática · 2 aulas', status: 'En revisión', detail: '32 evidencias aún no cuentan con devolución docente' }],
    sideTitle: 'Criterios de seguimiento', sideItems: [{ title: 'Permanencia', detail: 'Inactividad, ausencias y entregas pendientes', time: '14 señales' }, { title: 'Progreso académico', detail: 'Competencias en inicio y evidencias sin revisar', time: '8 señales' }, { title: 'Gestión institucional', detail: 'Matrícula, documentos y procesos administrativos', time: '4 señales' }],
  },
  academics: {
    slug: 'academics', title: 'Gestión académica', eyebrow: 'ORGANIZACIÓN CURRICULAR EBA', description: 'Administra ciclos, grados, áreas curriculares, secciones y periodos lectivos institucionales.',
    metrics: [{ label: 'Periodo lectivo', value: '2026-II', detail: 'En curso · cierre 30 nov.' }, { label: 'Ciclos EBA', value: '3', detail: 'Inicial · Intermedio · Avanzado' }, { label: 'Áreas curriculares', value: '8', detail: 'Plan de estudios vigente' }],
    actions: ['Nueva sección', 'Descargar estructura'], recordsTitle: 'Estructura académica vigente',
    records: [{ title: 'Ciclo Inicial', subtitle: 'Grados 1.° y 2.° · 180 estudiantes', status: 'Activo', detail: 'Secciones A–D · periodo 2026-II' }, { title: 'Ciclo Intermedio', subtitle: 'Grados 1.° y 2.° · 420 estudiantes', status: 'Activo', detail: 'Secciones A–H · periodo 2026-II' }, { title: 'Ciclo Avanzado', subtitle: 'Grados 1.° a 4.° · 885 estudiantes', status: 'Activo', detail: 'Secciones A–R · periodo 2026-II' }, { title: 'Plan curricular EBA', subtitle: 'Áreas y competencias del CNEB', status: 'Vigente', detail: 'Aplicación institucional · actualización 2026' }],
    sideTitle: 'Operaciones del periodo', sideItems: [{ title: 'Asignación de docentes', detail: 'Revisar cobertura en aulas activas', time: '2 pendientes' }, { title: 'Programación de sesiones', detail: 'Calendario académico y horarios virtuales', time: 'Actualizado' }, { title: 'Cierre de periodo', detail: 'Evaluaciones, actas y consolidado', time: '30 nov. 2026' }],
  },
};
