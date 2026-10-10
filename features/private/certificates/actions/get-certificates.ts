import type { CertificateRecord } from '../types';

const INITIAL_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'cert-01',
    actaNumber: 'ACTA-EBA-2026-0012',
    type: 'ACTA_CONSOLIDADA',
    title: 'Acta Consolidada de Evaluación Integral - Ciclo Avanzado 4° Grado',
    period: '2026-I',
    cycleGrade: 'Avanzado 4° Grado',
    approvedCount: 42,
    signerName: 'Mg. Roberto Zevallos Ramos (Director)',
    siagieCode: 'SIAGIE-DOC-982341',
    signedAt: '2026-08-15',
    downloadUrl: '#',
  },
  {
    id: 'cert-02',
    actaNumber: 'ACTA-EBA-2026-0013',
    type: 'CERTIFICACION_MODULAR',
    title: 'Certificación Modular: Auxiliar en Gestión y Emprendimiento',
    period: '2026-I',
    cycleGrade: 'Avanzado 3° y 4°',
    approvedCount: 38,
    signerName: 'Lic. Marcela Gómez (Coord. Técnica)',
    siagieCode: 'SIAGIE-DOC-982342',
    signedAt: '2026-08-20',
    downloadUrl: '#',
  },
  {
    id: 'cert-03',
    actaNumber: 'ACTA-EBA-2026-0014',
    type: 'CERTIFICADO_ESTUDIOS',
    title: 'Certificados Oficiales de Culminación de Educación Básica Alternativa',
    period: '2026-I',
    cycleGrade: 'Avanzado 4° Grado',
    approvedCount: 42,
    signerName: 'Mg. Roberto Zevallos Ramos (Director)',
    siagieCode: 'SIAGIE-DOC-982343',
    signedAt: '2026-08-25',
    downloadUrl: '#',
  },
  {
    id: 'cert-04',
    actaNumber: 'ACTA-EBA-2026-0015',
    type: 'ACTA_CONSOLIDADA',
    title: 'Acta Promocional de Recuperación y Evaluación Extraordinaria',
    period: '2026-I',
    cycleGrade: 'Avanzado 1° y 2°',
    approvedCount: 19,
    signerName: 'Prof. Carlos Mejía (Docente)',
    siagieCode: 'SIAGIE-DOC-982344',
    signedAt: '2026-09-02',
    downloadUrl: '#',
  },
];

export const getCertificatesAction = async (filterType?: string): Promise<{ success: boolean; data: CertificateRecord[] }> => {
  await new Promise((resolve) => setTimeout(resolve, 80));

  let items = [...INITIAL_CERTIFICATES];
  if (filterType && filterType !== 'TODOS') {
    items = items.filter((c) => c.type === filterType);
  }

  return { success: true, data: items };
};
