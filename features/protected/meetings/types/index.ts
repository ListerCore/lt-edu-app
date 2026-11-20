import type { Appointment, Attendee, JoinSessionResponse, Session } from '@/lib/api/grpc/gen/ltedu/meetings/v1/meetings';

export type { Appointment, Attendee, JoinSessionResponse as JoinInfo, Session as LiveSession };

// class: live class of the virtual classroom · tutoring: virtual tutoring · psychology: psychology appointment
export type LiveSource = 'class' | 'tutoring' | 'psychology';

// platform: video inside ListerCore Edu · meet: an external link (Google Meet or another)
export type LiveProvider = 'platform' | 'meet';

export interface LiveAgenda {
  sessions: Session[];
  platformAvailable: boolean;
}

export interface AppointmentList {
  appointments: Appointment[];
  platformAvailable: boolean;
}

export interface AppointmentInput {
  id: string;
  caseId: string;
  // "2026-11-20T19:00" in Lima (datetime-local)
  scheduledAt: string;
  durationMin: number;
  mode: 'virtual' | 'in_person';
  provider: LiveProvider;
  link: string;
}

// Where a session stands for a participant: not open yet, open to join, over
export type LivePhase = 'upcoming' | 'open' | 'ended';

export interface ProviderPickerProps {
  id: string;
  provider: LiveProvider;
  link: string;
  platformAvailable: boolean;
  onProvider: (provider: LiveProvider) => void;
  onLink: (link: string) => void;
  linkError?: string;
  // Meet link optional now (tutoring: it can be added later)
  linkOptional?: boolean;
}

export interface LiveCallProps {
  serverUrl: string;
  token: string;
  onLeave: () => void;
}
