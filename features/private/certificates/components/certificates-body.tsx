'use client';

import type { JSX } from 'react';
import { useCertificates } from '../hooks/use-certificates';
import { CertificatesHeader } from './certificates-header';
import { CertificatesTable } from './certificates-table';

export const CertificatesBody = (): JSX.Element => {
  const { records } = useCertificates();

  const totalActas = records.filter((r) => r.type === 'ACTA_CONSOLIDADA').length;
  const totalCertificates = records.filter((r) => r.type !== 'ACTA_CONSOLIDADA').length;

  return (
    <main className="min-h-screen bg-[#070E1D] text-[#DCE2F7] antialiased py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <CertificatesHeader totalActas={totalActas} totalCertificates={totalCertificates} />
        <CertificatesTable records={records} />
      </div>
    </main>
  );
};
