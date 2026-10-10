import type { GetStudentsParams, GetStudentsResponse, StudentItem, StudentsPaginationMeta } from '../types';

const INITIAL_STUDENTS: StudentItem[] = [
  {
    id: 'stu-01',
    code: 'EST-2026-0042',
    dni: '48392019',
    fullName: 'Mamani Quispe, Juan Carlos',
    cycle: 'AVANZADO_4',
    modality: 'SEMIPRESENCIAL',
    shift: 'NOCHE',
    status: 'MATRICULADO',
    attendanceRate: 94,
    phone: '984712039',
  },
  {
    id: 'stu-02',
    code: 'EST-2026-0043',
    dni: '72940182',
    fullName: 'Ramos Huamán, Rosa Elvira',
    cycle: 'AVANZADO_3',
    modality: 'SEMIPRESENCIAL',
    shift: 'NOCHE',
    status: 'MATRICULADO',
    attendanceRate: 91,
    phone: '971029384',
  },
  {
    id: 'stu-03',
    code: 'EST-2026-0044',
    dni: '10928374',
    fullName: 'Flores Condori, Pedro Pablo',
    cycle: 'AVANZADO_2',
    modality: 'A_DISTANCIA',
    shift: 'NOCHE',
    status: 'MATRICULADO',
    attendanceRate: 88,
    phone: '958291038',
  },
  {
    id: 'stu-04',
    code: 'EST-2026-0045',
    dni: '45920183',
    fullName: 'Gutiérrez Paucar, Ana María',
    cycle: 'AVANZADO_1',
    modality: 'PRESENCIAL',
    shift: 'TARDE',
    status: 'MATRICULADO',
    attendanceRate: 96,
    phone: '948201928',
  },
  {
    id: 'stu-05',
    code: 'EST-2026-0046',
    dni: '70291823',
    fullName: 'Zevallos Medina, Jorge Luis',
    cycle: 'INTERMEDIO',
    modality: 'PRESENCIAL',
    shift: 'NOCHE',
    status: 'EN_TRASLADO',
    attendanceRate: 78,
    phone: '992819203',
  },
  {
    id: 'stu-06',
    code: 'EST-2026-0047',
    dni: '41920394',
    fullName: 'Chávez Alarcón, Marilú Elena',
    cycle: 'INICIAL',
    modality: 'PRESENCIAL',
    shift: 'TARDE',
    status: 'MATRICULADO',
    attendanceRate: 92,
    phone: '918293049',
  },
  {
    id: 'stu-07',
    code: 'EST-2026-0048',
    dni: '60192834',
    fullName: 'Torres Benavente, Raúl Eduardo',
    cycle: 'AVANZADO_4',
    modality: 'SEMIPRESENCIAL',
    shift: 'NOCHE',
    status: 'EGRESADO',
    attendanceRate: 98,
    phone: '938291029',
  },
  {
    id: 'stu-08',
    code: 'EST-2026-0049',
    dni: '74829102',
    fullName: 'Mendoza Vargas, Gladys Beatriz',
    cycle: 'AVANZADO_3',
    modality: 'A_DISTANCIA',
    shift: 'NOCHE',
    status: 'MATRICULADO',
    attendanceRate: 89,
    phone: '928192038',
  },
];

export const getStudentsAction = async (params: GetStudentsParams): Promise<GetStudentsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 80));

  let items = [...INITIAL_STUDENTS];

  if (params.filter) {
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter((s) => s.fullName.toLowerCase().includes(q) || s.dni.includes(q) || s.code.toLowerCase().includes(q));
    }
    if (params.cycle && params.cycle !== 'TODOS') {
      items = items.filter((s) => s.cycle === params.cycle);
    }
    if (params.status && params.status !== 'TODOS') {
      items = items.filter((s) => s.status === params.status);
    }
  }

  const page = params.page || 1;
  const limit = params.limit || 5;
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const current = Math.min(page, totalPages);
  const paginated = items.slice((current - 1) * limit, current * limit);

  const meta: StudentsPaginationMeta = {
    currentPage: current,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: current < totalPages,
    hasPrevPage: current > 1,
  };

  return {
    success: true,
    data: paginated,
    meta,
    stats: {
      totalStudents: INITIAL_STUDENTS.length,
      activeCount: INITIAL_STUDENTS.filter((s) => s.status === 'MATRICULADO').length,
      advancedCycleCount: INITIAL_STUDENTS.filter((s) => s.cycle.startsWith('AVANZADO')).length,
      avgAttendance: 92.4,
    },
    message: 'Nómina de estudiantes recuperada con éxito',
  };
};
