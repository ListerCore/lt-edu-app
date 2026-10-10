'use client';

import { useEffect, useState } from 'react';
import { getStudentsAction } from '../actions/get-students';
import type { StudentItem, StudentsPaginationMeta, UseStudentsResult } from '../types';

const DEFAULT_PAGINATION: StudentsPaginationMeta = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 5,
  hasNextPage: false,
  hasPrevPage: false,
};

export const useStudents = (): UseStudentsResult => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [pagination, setPagination] = useState<StudentsPaginationMeta>(DEFAULT_PAGINATION);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCount: 0,
    advancedCycleCount: 0,
    avgAttendance: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCycle, setSelectedCycle] = useState<string>('TODOS');
  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    let active = true;
    const run = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const res = await getStudentsAction({
          filter: true,
          search: searchTerm,
          cycle: selectedCycle,
          status: selectedStatus,
          page: currentPage,
          limit: 5,
        });
        if (active && res.success) {
          setStudents(res.data);
          if (res.meta) setPagination(res.meta);
          if (res.stats) setStats(res.stats);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    run();
    return (): void => {
      active = false;
    };
  }, [searchTerm, selectedCycle, selectedStatus, currentPage]);

  const handleSearchChange = (t: string): void => {
    setSearchTerm(t);
    setCurrentPage(1);
  };

  const handleCycleChange = (c: string): void => {
    setSelectedCycle(c);
    setCurrentPage(1);
  };

  const handleStatusChange = (s: string): void => {
    setSelectedStatus(s);
    setCurrentPage(1);
  };

  const goToPage = (p: number): void => {
    setCurrentPage(p);
  };

  const nextPage = (): void => {
    if (pagination.hasNextPage) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = (): void => {
    if (pagination.hasPrevPage) setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return {
    students,
    pagination,
    stats,
    isLoading,
    searchTerm,
    selectedCycle,
    selectedStatus,
    setSearchTerm: handleSearchChange,
    setSelectedCycle: handleCycleChange,
    setSelectedStatus: handleStatusChange,
    goToPage,
    nextPage,
    prevPage,
  };
};
