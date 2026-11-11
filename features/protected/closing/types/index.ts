import type { ClosingArea, ClosingRow, GetClosingResponse, RecordInfo, SectionClosing, UnitClosing, UnitRow } from '@/lib/api/grpc/gen/joseph/assessment/v1/closing';

export type { ClosingArea, ClosingRow, GetClosingResponse as ClosingOverview, RecordInfo, SectionClosing, UnitClosing, UnitRow };

// The frozen body of an acta (joseph-api service.RecordContent)
export interface RecordContent {
  title: string;
  institution: string;
  period: string;
  section: string;
  level: string;
  subject?: string;
  teacher?: string;
  tutor?: string;
  rule?: string;
  groups: Array<{ name: string; columns: Array<{ code: string; name: string }> }>;
  rows: Array<{ n: number; code: string; document: string; name: string; cells: string[]; situation: string; note?: string }>;
  summary: Array<{ label: string; count: number }> | null;
  legend: string[];
  signatures: string[];
  issuedOn: string;
}

export interface RecordData {
  record: RecordInfo;
  content: RecordContent;
}

export interface ExportFile {
  fileName: string;
  base64: string;
}
