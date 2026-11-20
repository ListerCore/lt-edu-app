import type { BoardMember, Fees, Meeting } from '@/lib/api/grpc/gen/ltedu/apafa/v1/apafa';
import type { AcademicResult, FormState } from '@/features/protected/academic/types';

export type { BoardMember, Fees, Meeting };
export type { AcademicResult, FormState };

// ---------- API data ----------

// What the APAFA page loads: meetings (newest first), board, fee collection (staff only) and whether the person manages
export interface ApafaData {
  meetings: Meeting[];
  board: BoardMember[];
  fees: Fees | null;
  canManage: boolean;
}

export interface MeetingDetail {
  meeting: Meeting;
  canManage: boolean;
}

// ---------- action payloads (already cleaned by the hooks) ----------

export interface MeetingPayload {
  id: string;
  title: string;
  kind: string;
  // RFC 3339 with the Lima offset
  scheduledAt: string;
  modality: string;
  place: string;
  meetingUrl: string;
  agenda: string;
  audience: string;
  notify: boolean;
}

export interface ReschedulePayload {
  id: string;
  scheduledAt: string;
  reason: string;
  notify: boolean;
}

export interface CancelPayload {
  id: string;
  reason: string;
  notify: boolean;
}

export interface MinutesPayload {
  id: string;
  minutes: string;
  agreements: string;
  attendees?: number;
  publish: boolean;
}

export interface BoardMemberPayload {
  id: string;
  fullName: string;
  position: string;
  phone: string;
  startsOn: string;
  endsOn: string;
}

// ---------- form values (raw, as typed) ----------

export interface MeetingValues {
  title: string;
  kind: string;
  // datetime-local value (YYYY-MM-DDTHH:mm, Lima wall time)
  scheduledAt: string;
  modality: string;
  place: string;
  meetingUrl: string;
  agenda: string;
  audience: string;
  notify: boolean;
}

export interface RescheduleValues {
  scheduledAt: string;
  reason: string;
  notify: boolean;
}

export interface CancelValues {
  reason: string;
  notify: boolean;
}

export interface MinutesValues {
  minutes: string;
  agreements: string;
  attendees: string;
  publish: boolean;
}

export interface BoardMemberValues {
  fullName: string;
  position: string;
  phone: string;
  startsOn: string;
  endsOn: string;
}

// ---------- prepared for the components ----------

// A meeting with its labels and dates already formatted
export interface MeetingView {
  id: string;
  title: string;
  kind: string;
  kindLabel: string;
  status: string;
  statusLabel: string;
  statusClass: string;
  // Never convened: families do not see it yet
  isDraft: boolean;
  // Still to be held (scheduled or rescheduled)
  isOpen: boolean;
  // Its time has come (an open meeting in the past waits for its acta)
  isDue: boolean;
  dayLabel: string;
  monthLabel: string;
  whenLabel: string;
  timeLabel: string;
  previousLabel: string;
  modality: string;
  modalityLabel: string;
  place: string;
  meetingUrl: string;
  audience: string;
  audienceLabel: string;
  agenda: string[];
  rescheduleReason: string;
  cancelReason: string;
  minutes: string;
  agreements: string[];
  attendees?: number;
  minutesPublished: boolean;
  notifiedLabel: string;
  createdName: string;
  files: number;
  href: string;
  raw: Meeting;
}

export interface BoardMemberView {
  id: string;
  fullName: string;
  position: string;
  positionLabel: string;
  phone: string;
  periodLabel: string;
  current: boolean;
  raw: BoardMember;
}

export interface FeesView {
  expected: string;
  collected: string;
  pending: string;
  charged: number;
  settled: number;
  // 0–100
  percent: number;
}

export interface UseGetApafaResult {
  data: ApafaData | null;
  error: string | null;
  isLoading: boolean;
  reload: () => void;
}

export interface UseApafaPageResult {
  isLoading: boolean;
  error: string | null;
  reload: () => void;
  canManage: boolean;
  isFamily: boolean;
  upcoming: MeetingView[];
  past: MeetingView[];
  // Open meetings whose time has passed: they wait for the acta
  pendingMinutes: number;
  board: BoardMemberView[];
  fees: FeesView | null;
}

export interface UseGetMeetingResult {
  meeting: MeetingView | null;
  canManage: boolean;
  error: string | null;
  isLoading: boolean;
  reload: () => void;
}

export interface UseMeetingFormParams {
  meeting: Meeting | null;
  onSaved: (meeting: Meeting) => void;
}

export interface UseMeetingFormResult extends FormState<MeetingValues> {
  isNew: boolean;
  // Already convened: the date moves only through "Reprogramar"
  isConvened: boolean;
}

export interface UseMeetingActionParams {
  meetingId: string;
  onDone: (meeting: Meeting) => void;
}

export interface UseRunActionResult {
  run: () => void;
  isPending: boolean;
}

export interface UseDeleteMeetingParams {
  meetingId: string;
  onDeleted: () => void;
}

export interface UseBoardFormParams {
  member: BoardMember | null;
  onSaved: () => void;
}

export interface UseDeleteBoardMemberResult {
  remove: (id: string) => void;
  deletingId: string | null;
}

// ---------- component props ----------

export interface MeetingDetailPageProps {
  id: string;
}

export interface MeetingCardProps {
  meeting: MeetingView;
  canManage: boolean;
}

export interface MeetingListProps {
  title: string;
  meetings: MeetingView[];
  canManage: boolean;
  empty: string;
}

export interface MeetingDialogProps {
  meeting: Meeting | null;
  onClose: () => void;
  onSaved: (meeting: Meeting) => void;
}

export interface MeetingActionDialogProps {
  meeting: MeetingView;
  onClose: () => void;
  onDone: (meeting: Meeting) => void;
}

export interface BoardSectionProps {
  members: BoardMemberView[];
  canManage: boolean;
  onChanged: () => void;
}

export interface BoardDialogProps {
  member: BoardMember | null;
  onClose: () => void;
  onSaved: () => void;
}

export interface FeesCardProps {
  fees: FeesView;
}

export interface NotifyToggleProps {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}
