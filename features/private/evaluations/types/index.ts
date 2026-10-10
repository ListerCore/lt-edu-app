export type GradeLevel = 'AD' | 'A' | 'B' | 'C';

export interface EvaluationRecord {
  id: string;
  studentDni: string;
  studentName: string;
  cycleGrade: string;
  competency1: GradeLevel;
  competency2: GradeLevel;
  competency3: GradeLevel;
  finalScore: GradeLevel;
  descriptiveConclusion: string;
  isPedagogicalRisk: boolean;
}

export interface EvaluationsFilterParams {
  filter: boolean;
  search?: string;
  grade?: string;
}

export interface UseEvaluationsResult {
  records: EvaluationRecord[];
  isLoading: boolean;
  searchTerm: string;
  selectedGrade: string;
  stats: {
    totalEvaluated: number;
    outstandingCount: number;
    riskCount: number;
  };
  setSearchTerm: (t: string) => void;
  setSelectedGrade: (g: string) => void;
  updateScore: (id: string, competency: 'competency1' | 'competency2' | 'competency3', val: GradeLevel) => void;
}

export interface EvaluationsHeaderProps {
  totalEvaluated: number;
  outstandingCount: number;
  riskCount: number;
}

export interface EvaluationsTableProps {
  records: EvaluationRecord[];
  isLoading: boolean;
  searchTerm: string;
  selectedGrade: string;
  onSearchChange: (t: string) => void;
  onGradeChange: (g: string) => void;
  onUpdateScore: (id: string, comp: 'competency1' | 'competency2' | 'competency3', val: GradeLevel) => void;
}
