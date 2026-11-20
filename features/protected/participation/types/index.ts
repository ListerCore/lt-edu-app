import type { AcademicResult, RemoteState } from '@/features/protected/academic/types';
import type {
  DistanceSection,
  GetPermanenceBoardResponse,
  GetSectionPermanenceResponse,
  PermanenceRule,
  PermanenceWindow,
  RoomParticipation,
  StudentPermanence,
} from '@/lib/api/grpc/gen/ltedu/participation/v1/participation';

export type { AcademicResult, DistanceSection, PermanenceRule, PermanenceWindow, RemoteState, RoomParticipation, StudentPermanence };

export type PermanenceBoard = GetPermanenceBoardResponse;
export type SectionPermanence = GetSectionPermanenceResponse;

export interface RuleValues {
  windowDays: string;
  minActiveDays: string;
  inactiveDays: string;
  lowPercent: string;
}

// A window the tutor is adjusting, with its student
export interface AdjustTarget {
  student: StudentPermanence;
  window: PermanenceWindow;
}

export interface PermanencePageState {
  board: RemoteState<PermanenceBoard>;
  sectionId: string;
  setSectionId: (id: string) => void;
  section: RemoteState<SectionPermanence>;
}

export interface RuleDialogProps {
  slug: string;
  rule: PermanenceRule;
  onClose: () => void;
  onSaved: () => void;
}

export interface AdjustDialogProps {
  slug: string;
  target: AdjustTarget;
  onClose: () => void;
  onSaved: () => void;
}

export interface WeekStripProps {
  student: StudentPermanence;
  canAdjust: boolean;
  onPick: (window: PermanenceWindow) => void;
}

export interface SectionTableProps {
  slug: string;
  sectionId: string;
  data: SectionPermanence;
  onAdjust: (target: AdjustTarget) => void;
}

export interface RoomParticipationPageProps {
  roomId: string;
}
