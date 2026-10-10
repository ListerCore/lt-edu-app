'use client';

import { useEffect, useState } from 'react';
import { getEvaluationsAction } from '../actions/get-evaluations';
import type { EvaluationRecord, GradeLevel, UseEvaluationsResult } from '../types';

export const useEvaluations = (): UseEvaluationsResult => {
  const [records, setRecords] = useState<EvaluationRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('TODOS');

  useEffect(() => {
    let active = true;
    const run = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const res = await getEvaluationsAction({
          filter: true,
          search: searchTerm,
          grade: selectedGrade,
        });
        if (active && res.success) {
          setRecords(res.data);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    run();
    return (): void => {
      active = false;
    };
  }, [searchTerm, selectedGrade]);

  const updateScore = (id: string, competency: 'competency1' | 'competency2' | 'competency3', val: GradeLevel): void => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== id) return rec;
        const updated = { ...rec, [competency]: val };
        const scores = [updated.competency1, updated.competency2, updated.competency3];
        const hasC = scores.includes('C');
        const hasAD = scores.filter((s) => s === 'AD').length >= 2;
        const finalScore: GradeLevel = hasAD ? 'AD' : hasC ? 'C' : 'A';
        return {
          ...updated,
          finalScore,
          isPedagogicalRisk: hasC,
        };
      }),
    );
  };

  const totalEvaluated = records.length;
  const outstandingCount = records.filter((r) => r.finalScore === 'AD').length;
  const riskCount = records.filter((r) => r.isPedagogicalRisk).length;

  return {
    records,
    isLoading,
    searchTerm,
    selectedGrade,
    stats: {
      totalEvaluated,
      outstandingCount,
      riskCount,
    },
    setSearchTerm,
    setSelectedGrade,
    updateScore,
  };
};
