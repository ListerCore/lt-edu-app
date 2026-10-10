'use client';

import { useEffect, useState } from 'react';
import { getCertificatesAction } from '../actions/get-certificates';
import type { CertificateRecord, UseCertificatesResult } from '../types';

export const useCertificates = (): UseCertificatesResult => {
  const [records, setRecords] = useState<CertificateRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string>('TODOS');

  useEffect(() => {
    let active = true;
    const run = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const res = await getCertificatesAction(selectedType);
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
  }, [selectedType]);

  return {
    records,
    isLoading,
    selectedType,
    setSelectedType,
  };
};
