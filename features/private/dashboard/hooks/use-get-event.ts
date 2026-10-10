'use client';

import { useCallback, useEffect, useState } from 'react';
import { getEventAction } from '../actions/get-event';
import type { EventItem, PaginationMeta, SystemStats, UseGetEventParams, UseGetEventResult } from '../types';

const DEFAULT_PAGINATION: PaginationMeta = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 5,
  hasNextPage: false,
  hasPrevPage: false,
};

const DEFAULT_STATS: SystemStats = {
  totalEvents: 0,
  activeEvents: 0,
  pendingEvents: 0,
  completedEvents: 0,
  totalAttendees: 0,
  averageOccupancyRate: 0,
};

export const useGetEvent = ({ filter = true, search = '', category = 'TODAS', status = 'TODOS', page = 1, limit = 5 }: UseGetEventParams): UseGetEventResult => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [stats, setStats] = useState<SystemStats>(DEFAULT_STATS);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>(search);
  const [selectedCategory, setSelectedCategory] = useState<string>(category);
  const [selectedStatus, setSelectedStatus] = useState<string>(status);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const refetch = useCallback(async (): Promise<void> => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const executeFetch = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getEventAction({
          filter,
          search: searchTerm,
          category: selectedCategory,
          status: selectedStatus,
          page: currentPage,
          limit,
        });

        if (isCancelled) return;

        if (response.success) {
          setEvents(response.data);
          if (response.meta) {
            setPagination(response.meta);
          }
          if (response.stats) {
            setStats(response.stats);
          }
        } else {
          setError(response.message || 'Error al cargar los eventos del sistema');
        }

        if (filter) {
          const fullResponse = await getEventAction({ filter: false });
          if (!isCancelled && fullResponse.success) {
            setAllEvents(fullResponse.data);
            if (fullResponse.stats) {
              setStats(fullResponse.stats);
            }
          }
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMsg = err instanceof Error ? err.message : 'Error de conexión al obtener los eventos';
          setError(errorMsg);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    executeFetch();

    return (): void => {
      isCancelled = true;
    };
  }, [filter, searchTerm, selectedCategory, selectedStatus, currentPage, limit, refreshTrigger]);

  const handleSearchChange = (term: string): void => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string): void => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleStatusChange = (stat: string): void => {
    setSelectedStatus(stat);
    setCurrentPage(1);
  };

  const goToPage = (targetPage: number): void => {
    if (targetPage >= 1 && targetPage <= pagination.totalPages) {
      setCurrentPage(targetPage);
    }
  };

  const nextPage = (): void => {
    if (pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = (): void => {
    if (pagination.hasPrevPage) {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  return {
    events,
    allEvents,
    stats,
    pagination,
    isLoading,
    error,
    searchTerm,
    selectedCategory,
    selectedStatus,
    setSearchTerm: handleSearchChange,
    setSelectedCategory: handleCategoryChange,
    setSelectedStatus: handleStatusChange,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  };
};
