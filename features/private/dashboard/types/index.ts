export type EventStatus = 'ACTIVO' | 'PENDIENTE' | 'FINALIZADO' | 'CANCELADO';

export type EventCategory = 'MATRICULA' | 'EVALUACION' | 'TALLER_NIVELACION' | 'CONFERENCIA_DOCENTE' | 'CAPACITACION' | 'GRADUACION' | 'MODULO_ACADEMICO';

export interface EventItem {
  id: string;
  code: string;
  name: string;
  category: EventCategory;
  date: string;
  location: string;
  attendeesCount: number;
  maxCapacity: number;
  status: EventStatus;
  organizer: string;
  createdAt: string;
}

export interface SystemStats {
  totalEvents: number;
  activeEvents: number;
  pendingEvents: number;
  completedEvents: number;
  totalAttendees: number;
  averageOccupancyRate: number;
}

export interface SystemInfo {
  name: string;
  version: string;
  environment: string;
  status: 'OPTIMO' | 'DEGRADADO' | 'MANTENIMIENTO';
  lastSync: string;
  uptime: string;
  databaseLatencyMs: number;
  description: string;
}

export interface GetEventParams {
  filter: boolean;
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'name' | 'attendeesCount';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetEventResponse {
  success: boolean;
  data: EventItem[];
  meta?: PaginationMeta;
  stats?: SystemStats;
  message?: string;
}

export interface CreateEventRawData {
  name: string;
  category: string;
  date: string;
  location: string;
  maxCapacity: number | string;
  organizer: string;
}

export interface CreateEventPayload {
  payload: {
    NAME: string;
    CATEGORY: EventCategory;
    DATE: string;
    LOCATION: string;
    MAX_CAPACITY: number;
    ORGANIZER: string;
    STATUS: EventStatus;
  };
}

export interface CreateEventResponse {
  success: boolean;
  data: EventItem;
  message: string;
}

export interface UseGetEventParams {
  filter: boolean;
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface UseGetEventResult {
  events: EventItem[];
  allEvents: EventItem[];
  stats: SystemStats;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedStatus: (stat: string) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refetch: () => Promise<void>;
}

export interface UseCreateEventResult {
  isCreating: boolean;
  createEvent: (rawData: CreateEventRawData) => Promise<boolean>;
  error: string | null;
  notification: {
    type: 'success' | 'error';
    message: string;
  } | null;
  clearNotification: () => void;
}

export interface UseDashboardResult {
  events: EventItem[];
  stats: SystemStats;
  systemInfo: SystemInfo;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
  isCreateModalOpen: boolean;
  isCreating: boolean;
  notification: {
    type: 'success' | 'error';
    message: string;
  } | null;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedStatus: (stat: string) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  handleCreateSubmit: (rawData: CreateEventRawData) => Promise<void>;
  clearNotification: () => void;
  refreshData: () => Promise<void>;
}

export interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onOpenCreateModal: () => void;
  stats: SystemStats;
}

export interface DashboardTableProps {
  events: EventItem[];
  pagination: PaginationMeta;
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onOpenCreateModal: () => void;
}

export interface DashboardTableRowProps {
  event: EventItem;
}

export interface DashboardCreateModalProps {
  isOpen: boolean;
  isCreating: boolean;
  onClose: () => void;
  onSubmit: (rawData: CreateEventRawData) => Promise<void>;
}

export interface DashboardAboutSystemProps {
  systemInfo: SystemInfo;
  stats: SystemStats;
}

export interface DashboardBodyProps {
  initialFilter?: boolean;
}

export interface DashboardSidebarProps {
  currentPath?: string;
  totalEvents?: number;
  activeEvents?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}
