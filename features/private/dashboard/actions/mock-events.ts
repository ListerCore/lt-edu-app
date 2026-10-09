import type { EventItem, SystemStats } from '../types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-001',
    code: 'JL-2026-001',
    name: 'Simposio Internacional de Antisepsia y Cirugía Moderna',
    category: 'SIMPOSIO',
    date: '2026-10-18T09:00:00Z',
    location: 'Auditorio Principal Joseph Lister, Pabellón A',
    attendeesCount: 240,
    maxCapacity: 300,
    status: 'ACTIVO',
    organizer: 'DR. CHARLES HIGGINS',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'evt-002',
    code: 'JL-2026-002',
    name: 'Taller Práctico de Técnicas Quirúrgicas Estériles',
    category: 'TALLER',
    date: '2026-10-22T14:30:00Z',
    location: 'Laboratorio Quirúrgico 3B',
    attendeesCount: 45,
    maxCapacity: 50,
    status: 'ACTIVO',
    organizer: 'DRA. ELENA MARTÍNEZ',
    createdAt: '2026-09-05T12:00:00Z',
  },
  {
    id: 'evt-003',
    code: 'JL-2026-003',
    name: 'Demostración Quirúrgica: Manejo de Infecciones Complejas',
    category: 'CIRUGIA_DEMO',
    date: '2026-10-28T08:00:00Z',
    location: 'Quirófano Inteligente 1',
    attendeesCount: 28,
    maxCapacity: 30,
    status: 'PENDIENTE',
    organizer: 'DR. ROBERTO VANCE',
    createdAt: '2026-09-10T15:30:00Z',
  },
  {
    id: 'evt-004',
    code: 'JL-2026-004',
    name: 'Conferencia Anual sobre Avances en Microbiología Clínica',
    category: 'CONFERENCIA',
    date: '2026-11-04T10:00:00Z',
    location: 'Centro de Convenciones Biomédicas',
    attendeesCount: 520,
    maxCapacity: 600,
    status: 'ACTIVO',
    organizer: 'DRA. SOFÍA ALARCÓN',
    createdAt: '2026-09-12T09:00:00Z',
  },
  {
    id: 'evt-005',
    code: 'JL-2026-005',
    name: 'Capacitación en Protocolos de Desinfección Hospitalaria',
    category: 'CAPACITACION',
    date: '2026-11-12T16:00:00Z',
    location: 'Aula Magna de Enfermería',
    attendeesCount: 85,
    maxCapacity: 100,
    status: 'PENDIENTE',
    organizer: 'LIC. MARCELA GÓMEZ',
    createdAt: '2026-09-15T11:20:00Z',
  },
  {
    id: 'evt-006',
    code: 'JL-2026-006',
    name: 'Seminario de Epidemiología y Control de Brotes',
    category: 'SEMINARIO',
    date: '2026-09-30T11:00:00Z',
    location: 'Sala Virtual 2 - Telemedicina',
    attendeesCount: 180,
    maxCapacity: 200,
    status: 'FINALIZADO',
    organizer: 'DR. HUGO STRATTON',
    createdAt: '2026-08-20T08:15:00Z',
  },
  {
    id: 'evt-007',
    code: 'JL-2026-007',
    name: 'Mesa Redonda: Historia y Futuro de la Cirugía Aséptica',
    category: 'CONFERENCIA',
    date: '2026-09-25T17:00:00Z',
    location: 'Sala Histórica Lister',
    attendeesCount: 110,
    maxCapacity: 120,
    status: 'FINALIZADO',
    organizer: 'DR. ARTHUR PENHALIGON',
    createdAt: '2026-08-15T14:00:00Z',
  },
  {
    id: 'evt-008',
    code: 'JL-2026-008',
    name: 'Taller Avanzado de Suturas y Cierre de Heridas Críticas',
    category: 'TALLER',
    date: '2026-11-20T09:30:00Z',
    location: 'Laboratorio Quirúrgico 1A',
    attendeesCount: 35,
    maxCapacity: 40,
    status: 'ACTIVO',
    organizer: 'DRA. LUCÍA NAVARRO',
    createdAt: '2026-09-18T16:45:00Z',
  },
  {
    id: 'evt-009',
    code: 'JL-2026-009',
    name: 'Capacitación en Bioseguridad y Esterilización Láser',
    category: 'CAPACITACION',
    date: '2026-11-25T13:00:00Z',
    location: 'Auditorio Secundario - Bloque Este',
    attendeesCount: 60,
    maxCapacity: 75,
    status: 'PENDIENTE',
    organizer: 'ING. MATEO ROJAS',
    createdAt: '2026-09-22T10:00:00Z',
  },
  {
    id: 'evt-010',
    code: 'JL-2026-010',
    name: 'Seminario Clínico de Farmacología Infecciosa',
    category: 'SEMINARIO',
    date: '2026-12-02T15:00:00Z',
    location: 'Anfiteatro Médico Central',
    attendeesCount: 195,
    maxCapacity: 250,
    status: 'ACTIVO',
    organizer: 'DR. FERNANDO CASAS',
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
