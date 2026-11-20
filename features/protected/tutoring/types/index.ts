import type {
  GetMyTutoringResponse,
  GetTutorAssignmentsResponse,
  GetTutorBoardResponse,
  PendingWork,
  SaaneeReferral,
  Thread,
  ThreadView,
  TutorBoardAlert,
  TutorBoardRow,
  TutorCandidate,
  TutoringMessage,
  TutoringSession,
  TutorLoad,
  TutorStudent,
} from '@/lib/api/grpc/gen/ltedu/wellbeing/v1/tutoring';

export type {
  GetMyTutoringResponse as MyTutoring,
  GetTutorAssignmentsResponse as TutorAssignments,
  GetTutorBoardResponse as TutorBoard,
  PendingWork,
  SaaneeReferral,
  Thread,
  ThreadView,
  TutorBoardAlert,
  TutorBoardRow,
  TutorCandidate,
  TutoringMessage,
  TutoringSession,
  TutorLoad,
  TutorStudent,
};

// A session to schedule (or change while not held)
export interface SessionInput {
  id: string;
  staffId: string;
  kind: 'individual' | 'group';
  mode: 'virtual' | 'in_person' | 'phone';
  // "2026-11-20T19:00" in Lima (datetime-local)
  scheduledAt: string;
  durationMin: number;
  link: string;
  // virtual: platform (video inside ListerCore Edu) | meet (link)
  provider: 'platform' | 'meet';
  reason: string;
  alertKind: string;
  studentIds: string[];
}

export interface HoldInput {
  id: string;
  attended: string[];
  notes: string;
  agreements: string;
  commitment: string;
  // YYYY-MM-DD
  commitmentDue: string;
}

// What a new session starts with (from a student or an alert)
export interface SessionDraft {
  studentIds: string[];
  kind: 'individual' | 'group';
  reason: string;
  alertKind: string;
}
