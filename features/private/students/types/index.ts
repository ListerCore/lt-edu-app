export type StudentCycle = 'INICIAL' | 'INTERMEDIO' | 'AVANZADO_1' | 'AVANZADO_2' | 'AVANZADO_3' | 'AVANZADO_4';

export type StudentStatus = 'MATRICULADO' | 'EN_TRASLADO' | 'RETIRADO' | 'EGRESADO';

export interface StudentItem {
  id: string;
  code: string;
  dni: string;
  fullName: string;
  cycle: StudentCycle;
  modality: 'PRESENCIAL' | 'SEMIPRESENCIAL' | 'A_DISTANCIA';
  shift: 'MANANA' | 'TARDE' | 'NOCHE';
  status: StudentStatus;
  attendanceRate: number;
  phone: string;
}

export interface GetStudentsParams {
  filter: boolean;
  search?: string;
  cycle?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface StudentsPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetStudentsResponse {
  success: boolean;
  data: StudentItem[];
  meta?: StudentsPaginationMeta;
  stats?: {
    totalStudents: number;
    activeCount: number;
    advancedCycleCount: number;
    avgAttendance: number;
  };
  message: string;
}

export interface UseStudentsResult {
  students: StudentItem[];
  pagination: StudentsPaginationMeta;
  stats: {
    totalStudents: number;
    activeCount: number;
    advancedCycleCount: number;
    avgAttendance: number;
  };
  isLoading: boolean;
  searchTerm: string;
  selectedCycle: string;
  selectedStatus: string;
  setSearchTerm: (t: string) => void;
  setSelectedCycle: (c: string) => void;
  setSelectedStatus: (s: string) => void;
  goToPage: (p: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export interface StudentsHeaderProps {
  totalStudents: number;
  activeCount: number;
  avgAttendance: number;
}

export interface StudentsTableProps {
  students: StudentItem[];
  pagination: StudentsPaginationMeta;
  isLoading: boolean;
  searchTerm: string;
  selectedCycle: string;
  selectedStatus: string;
  onSearchChange: (t: string) => void;
  onCycleChange: (c: string) => void;
  onStatusChange: (s: string) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export interface StudentsRowProps {
  student: StudentItem;
}
