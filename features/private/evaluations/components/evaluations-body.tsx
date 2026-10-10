'use client';

import type { JSX } from 'react';
import { useEvaluations } from '../hooks/use-evaluations';
import { EvaluationsHeader } from './evaluations-header';
import { EvaluationsTable } from './evaluations-table';

export const EvaluationsBody = (): JSX.Element => {
  const { records, isLoading, searchTerm, selectedGrade, stats, setSearchTerm, setSelectedGrade, updateScore } = useEvaluations();

  return (
    <main className="min-h-screen bg-[#070E1D] text-[#DCE2F7] antialiased py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <EvaluationsHeader totalEvaluated={stats.totalEvaluated} outstandingCount={stats.outstandingCount} riskCount={stats.riskCount} />

        <EvaluationsTable records={records} isLoading={isLoading} searchTerm={searchTerm} selectedGrade={selectedGrade} onSearchChange={setSearchTerm} onGradeChange={setSelectedGrade} onUpdateScore={updateScore} />
      </div>
    </main>
  );
};
