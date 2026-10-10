export type CertificateType = 'ACTA_CONSOLIDADA' | 'CERTIFICADO_ESTUDIOS' | 'CERTIFICACION_MODULAR';

export interface CertificateRecord {
  id: string;
  actaNumber: string;
  type: CertificateType;
  title: string;
  period: string;
  cycleGrade: string;
  approvedCount: number;
  signerName: string;
  siagieCode: string;
  signedAt: string;
  downloadUrl: string;
}

export interface CertificatesHeaderProps {
  totalActas: number;
  totalCertificates: number;
}

export interface CertificatesTableProps {
  records: CertificateRecord[];
}

export interface UseCertificatesResult {
  records: CertificateRecord[];
  isLoading: boolean;
  selectedType: string;
  setSelectedType: (t: string) => void;
}
