'use client';

import { useState } from 'react';
import type { CreateEventRawData, SystemInfo, UseDashboardResult } from '../types';
import { useCreateEvent } from './use-create-event';
import { useGetEvent } from './use-get-event';

const SYSTEM_METADATA: SystemInfo = {
  name: 'Sistema Joseph Lister Core',
  version: 'v2.6.4-prod',
  environment: 'Producción (Cluster Biomédico)',
  status: 'OPTIMO',
  lastSync: 'Hace 2 minutos',
  uptime: '99.98%',
  databaseLatencyMs: 24,
  description: 'Plataforma centralizada para la gestión, registro y control de eventos médicos, talleres clínicos y simposios quirúrgicos bajo estándares antisépticos internacionales.',
};

export const useDashboard = (initialFilter = true): UseDashboardResult => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const {
    events,
    stats,
    pagination,
    isLoading,
    error: getError,
    searchTerm,
    selectedCategory,
    selectedStatus,
    setSearchTerm,
    setSelectedCategory,
    setSelectedStatus,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  } = useGetEvent({
    filter: initialFilter,
    page: 1,
    limit: 5,
  });

  const { isCreating, createEvent, error: createError, notification, clearNotification } = useCreateEvent();

  const openCreateModal = (): void => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = (): void => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSubmit = async (rawData: CreateEventRawData): Promise<void> => {
    const success = await createEvent(rawData);
    if (success) {
      setIsCreateModalOpen(false);
      await refetch();
    }
  };

  const refreshData = async (): Promise<void> => {
    await refetch();
  };

  return {
    events,
    stats,
    systemInfo: SYSTEM_METADATA,
    pagination,
    isLoading,
    error: getError || createError,
    searchTerm,
    selectedCategory,
    selectedStatus,
    isCreateModalOpen,
    isCreating,
    notification,
    setSearchTerm,
    setSelectedCategory,
    setSelectedStatus,
    goToPage,
    nextPage,
    prevPage,
    openCreateModal,
    closeCreateModal,
    handleCreateSubmit,
    clearNotification,
    refreshData,
  };
};
