import type { EventItem, SystemStats } from '../types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-001',
    code: 'CEBA-2026-001',
    name: 'Proceso de Matrícula y Convalidación Ciclo Avanzado',
    category: 'MATRICULA',
    date: '2026-10-18T09:00:00Z',
    location: 'Auditorio Central CEBA Lister, Pabellón A',
    attendeesCount: 180,
    maxCapacity: 220,
    status: 'ACTIVO',
    organizer: 'COORD. PEDAGÓGICA',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'evt-002',
    code: 'CEBA-2026-002',
    name: 'Taller de Nivelación en Comunicación y Razonamiento Matemático',
    category: 'TALLER_NIVELACION',
    date: '2026-10-22T15:30:00Z',
    location: 'Aula Multiusos 3B',
    attendeesCount: 45,
    maxCapacity: 50,
    status: 'ACTIVO',
    organizer: 'PROF. CARLOS MEJÍA',
    createdAt: '2026-09-05T12:00:00Z',
  },
  {
    id: 'evt-003',
    code: 'CEBA-2026-003',
    name: 'Evaluación Diagnóstica y Ubicación Curricular 2026-II',
    category: 'EVALUACION',
    date: '2026-10-28T08:30:00Z',
    location: 'Laboratorio de Cómputo 1',
    attendeesCount: 38,
    maxCapacity: 40,
    status: 'PENDIENTE',
    organizer: 'LIC. HUGO VALENCIA',
    createdAt: '2026-09-10T15:30:00Z',
  },
  {
    id: 'evt-004',
    code: 'CEBA-2026-004',
    name: 'Jornada Pedagógica Docente: Estrategias en Educación de Adultos',
    category: 'CONFERENCIA_DOCENTE',
    date: '2026-11-04T10:00:00Z',
    location: 'Salón de Actos Académicos',
    attendeesCount: 65,
    maxCapacity: 80,
    status: 'ACTIVO',
    organizer: 'DIR. MARÍA ESPINOZA',
    createdAt: '2026-09-12T09:00:00Z',
  },
  {
    id: 'evt-005',
    code: 'CEBA-2026-005',
    name: 'Taller de Capacitación en Alfabetización Digital y Ofimática',
    category: 'CAPACITACION',
    date: '2026-11-12T16:00:00Z',
    location: 'Laboratorio de Cómputo 2',
    attendeesCount: 28,
    maxCapacity: 30,
    status: 'PENDIENTE',
    organizer: 'ING. MATEO ROJAS',
    createdAt: '2026-09-15T11:20:00Z',
  },
  {
    id: 'evt-006',
    code: 'CEBA-2026-006',
    name: 'Inicio del Módulo Formativo: Emprendimiento y Gestión Financiera',
    category: 'MODULO_ACADEMICO',
    date: '2026-09-30T14:00:00Z',
    location: 'Aula Virtual CEBA Lister',
    attendeesCount: 120,
    maxCapacity: 150,
    status: 'FINALIZADO',
    organizer: 'LIC. PATRICIA ALARCÓN',
    createdAt: '2026-08-20T08:15:00Z',
  },
  {
    id: 'evt-007',
    code: 'CEBA-2026-007',
    name: 'Ceremonia de Graduación y Entrega de Certificados Ciclo Avanzado',
    category: 'GRADUACION',
    date: '2026-09-25T18:00:00Z',
    location: 'Patio de Honor - Campus Central',
    attendeesCount: 290,
    maxCapacity: 300,
    status: 'FINALIZADO',
    organizer: 'COMITÉ DE GRADUACIÓN',
    createdAt: '2026-08-15T14:00:00Z',
  },
  {
    id: 'evt-008',
    code: 'CEBA-2026-008',
    name: 'Taller de Fortalecimiento Vocacional y Empleabilidad Juvenil',
    category: 'TALLER_NIVELACION',
    date: '2026-11-20T10:00:00Z',
    location: 'Aula 201 - Bloque B',
    attendeesCount: 35,
    maxCapacity: 45,
    status: 'ACTIVO',
    organizer: 'PSIC. LUCÍA NAVARRO',
    createdAt: '2026-09-18T16:45:00Z',
  },
  {
    id: 'evt-009',
    code: 'CEBA-2026-009',
    name: 'Evaluación Extraordinaria y Recuperación Académica de Áreas',
    category: 'EVALUACION',
    date: '2026-11-25T09:00:00Z',
    location: 'Pabellón Académico 1',
    attendeesCount: 52,
    maxCapacity: 60,
    status: 'PENDIENTE',
    organizer: 'COORD. DE EVALUACIÓN',
    createdAt: '2026-09-22T10:00:00Z',
  },
  {
    id: 'evt-010',
    code: 'CEBA-2026-010',
    name: 'Inducción de Matrícula para Estudiantes de Ciclo Inicial e Intermedio',
    category: 'MATRICULA',
    date: '2026-12-02T16:30:00Z',
    location: 'Auditorio Central CEBA Lister',
    attendeesCount: 95,
    maxCapacity: 120,
    status: 'ACTIVO',
    organizer: 'DIR. MARÍA ESPINOZA',
    createdAt: '2026-09-25T18:00:00Z',
  },
];

let eventsStore: EventItem[] = [...INITIAL_EVENTS];

export const getStoredEvents = (): EventItem[] => {
  return eventsStore;
};

export const addStoredEvent = (event: EventItem): void => {
  eventsStore = [event, ...eventsStore];
};

export const calculateStats = (items: EventItem[]): SystemStats => {
  const totalEvents = items.length;
  const activeEvents = items.filter((e) => e.status === 'ACTIVO').length;
  const pendingEvents = items.filter((e) => e.status === 'PENDIENTE').length;
  const completedEvents = items.filter((e) => e.status === 'FINALIZADO').length;
  const totalAttendees = items.reduce((acc, curr) => acc + curr.attendeesCount, 0);
  const totalCapacity = items.reduce((acc, curr) => acc + curr.maxCapacity, 0);
  const averageOccupancyRate = totalCapacity > 0 ? Math.round((totalAttendees / totalCapacity) * 100) : 0;

  return {
    totalEvents,
    activeEvents,
    pendingEvents,
    completedEvents,
    totalAttendees,
    averageOccupancyRate,
  };
};
