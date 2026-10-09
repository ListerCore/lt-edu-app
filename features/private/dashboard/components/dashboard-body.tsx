'use client';

import type { JSX } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useDashboard } from '../hooks/use-dashboard';
import type { DashboardBodyProps } from '../types';
import { DashboardAboutSystem } from './dashboard-about-system';
import { DashboardCreateModal } from './dashboard-create-modal';
import { DashboardHeader } from './dashboard-header';
import { DashboardTable } from './dashboard-table';

export const DashboardBody = ({ initialFilter = true }: DashboardBodyProps): JSX.Element => {
  const { events, stats, systemInfo, pagination, isLoading, searchTerm, selectedCategory, selectedStatus, isCreateModalOpen, isCreating, notification, setSearchTerm, setSelectedCategory, setSelectedStatus, goToPage, nextPage, prevPage, openCreateModal, closeCreateModal, handleCreateSubmit, clearNotification } = useDashboard(initialFilter);

  return (
    <main className="min-h-screen bg-[#070E1D] text-[#DCE2F7] antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 via-emerald-500 to-indigo-600" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {notification && (
          <div className={`flex items-center justify-between gap-3 rounded-xl border p-4 shadow-lg transition-all ${notification.type === 'success' ? 'border-emerald-500/40 bg-emerald-950/70 text-emerald-300 shadow-emerald-950/40' : 'border-rose-500/40 bg-rose-950/70 text-rose-300 shadow-rose-950/40'}`}>
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> : <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button type="button" onClick={clearNotification} className="rounded-lg p-1 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <DashboardHeader title="Dashboard de Gestión Académica" subtitle="Panel central de control y monitoreo de ciclos formativos, talleres y actividades del CEBA Joseph Lister." onOpenCreateModal={openCreateModal} stats={stats} />

        <DashboardTable
          events={events}
          pagination={pagination}
          isLoading={isLoading}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
          onPageChange={goToPage}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onOpenCreateModal={openCreateModal}
        />

        <DashboardAboutSystem systemInfo={systemInfo} stats={stats} />
      </div>

      <DashboardCreateModal isOpen={isCreateModalOpen} isCreating={isCreating} onClose={closeCreateModal} onSubmit={handleCreateSubmit} />
    </main>
  );
};
