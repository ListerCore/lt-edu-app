import type { GetEventParams, GetEventResponse, PaginationMeta } from '../types';
import { calculateStats, getStoredEvents } from './mock-events';

export const getEventAction = async (params: GetEventParams): Promise<GetEventResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 80));

  const allItems = [...getStoredEvents()];
  const stats = calculateStats(allItems);

  if (!params.filter) {
    return {
      success: true,
      data: allItems,
      stats,
      message: 'Todos los eventos recuperados con éxito',
    };
  }

  let filtered = allItems;

  if (params.search && params.search.trim() !== '') {
    const term = params.search.toLowerCase().trim();
    filtered = filtered.filter((item) => item.name.toLowerCase().includes(term) || item.code.toLowerCase().includes(term) || item.location.toLowerCase().includes(term) || item.organizer.toLowerCase().includes(term) || item.category.toLowerCase().includes(term));
  }

  if (params.category && params.category !== 'TODAS') {
    filtered = filtered.filter((item) => item.category === params.category);
  }

  if (params.status && params.status !== 'TODOS') {
    filtered = filtered.filter((item) => item.status === params.status);
  }

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 5;
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  const paginationMeta: PaginationMeta = {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };

  return {
    success: true,
    data: paginatedData,
    meta: paginationMeta,
    stats,
    message: 'Eventos filtrados y paginados recuperados correctamente',
  };
};
