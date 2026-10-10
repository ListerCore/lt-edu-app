'use client';

import type { JSX } from 'react';
import { useStudents } from '../hooks/use-students';
import { StudentsHeader } from './students-header';
import { StudentsTable } from './students-table';

export const StudentsBody = (): JSX.Element => {
  const { students, pagination, stats, isLoading, searchTerm, selectedCycle, selectedStatus, setSearchTerm, setSelectedCycle, setSelectedStatus, nextPage, prevPage } = useStudents();

  return (
    <main className="min-h-screen bg-[#070E1D] text-[#DCE2F7] antialiased py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <StudentsHeader totalStudents={stats.totalStudents} activeCount={stats.activeCount} avgAttendance={stats.avgAttendance} />

        <StudentsTable students={students} pagination={pagination} isLoading={isLoading} searchTerm={searchTerm} selectedCycle={selectedCycle} selectedStatus={selectedStatus} onSearchChange={setSearchTerm} onCycleChange={setSelectedCycle} onStatusChange={setSelectedStatus} onNextPage={nextPage} onPrevPage={prevPage} />
      </div>
    </main>
  );
};
