'use client';

import { useState, type JSX } from 'react';
import { AlertCircle, CheckCircle2, Menu, X } from 'lucide-react';
import { useDashboard } from '../hooks/use-dashboard';
import type { DashboardBodyProps } from '../types';
import { DashboardAboutSystem } from './dashboard-about-system';
import { DashboardCreateModal } from './dashboard-create-modal';
import { DashboardHeader } from './dashboard-header';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardTable } from './dashboard-table';

export const DashboardBody = ({ initialFilter = true }: DashboardBodyProps): JSX.Element => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const { events, stats, systemInfo, pagination, isLoading, searchTerm, selectedCategory, selectedStatus, isCreateModalOpen, isCreating, notification, setSearchTerm, setSelectedCategory, setSelectedStatus, goToPage, nextPage, prevPage, openCreateModal, closeCreateModal, handleCreateSubmit, clearNotification } = useDashboard(initialFilter);

  return (
    <div className="min-h-screen bg-[#070E1D] text-[#DCE2F7] antialiased selection:bg-emerald-500/30 selection:text-emerald-200 flex">
      <DashboardSidebar totalEvents={stats.totalEvents} activeEvents={stats.activeEvents} isOpenMobile={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)} />

      <main className="flex-1 min-w-0 flex flex-col">
        <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 via-teal-500 to-indigo-600" />

        <div className="lg:hidden flex items-center justify-between border-b border-[#22334F] bg-[#0B1528] px-4 py-3">
          <button type="button" onClick={() => setIsMobileSidebarOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-[#22334F] bg-[#141B2D] px-3 py-1.5 text-xs font-semibold text-white hover:border-emerald-500/50 transition-all cursor-pointer">
            <Menu className="h-4 w-4 text-emerald-400" />
            <span>Menú Lateral</span>
          </button>
          <span className="text-xs font-mono font-bold text-emerald-400">CEBA Lister EBA</span>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
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
      </main>

      <DashboardCreateModal isOpen={isCreateModalOpen} isCreating={isCreating} onClose={closeCreateModal} onSubmit={handleCreateSubmit} />
    </div>
  );
};
