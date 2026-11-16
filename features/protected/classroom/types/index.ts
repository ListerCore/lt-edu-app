import type { IconInput } from 'morphicons/react';
import type { Answer, Assessment, Competency, Delivery, Forum, Item, LibraryItem, Participation, Period, Post, Question, Room, RosterRow, Submission, Thread, Unit } from '@/lib/api/grpc/gen/joseph/classroom/v1/classroom';
import type { AcademicResult, FormState, RemoteState } from '@/features/protected/academic/types';

export type { AcademicResult, Answer, Assessment, Competency, Delivery, Forum, FormState, Item, LibraryItem, Participation, Period, Post, Question, RemoteState, Room, RosterRow, Submission, Thread, Unit };

// manager: every room · teacher: their rooms · reader: reads all · family: a student's rooms
export type ClassroomMode = 'manager' | 'teacher' | 'reader' | 'family';

// ---------- catalog ----------

export interface CatalogData {
  periods: Period[];
  periodId: string;
  rooms: Room[];
  canManage: boolean;
  mode: ClassroomMode;
}

// Rooms of one cycle and grade, as the catalog groups them
export interface RoomGroup {
  key: string;
  title: string;
  rooms: Room[];
}

export interface CatalogPageState extends RemoteState<CatalogData> {
  periodId: string;
  setPeriodId: (id: string) => void;
  query: string;
  setQuery: (q: string) => void;
  groups: RoomGroup[];
  total: number;
  drafts: number;
  generate: () => void;
  isGenerating: boolean;
}

export interface RoomCardProps {
  room: Room;
  family: boolean;
}

// ---------- room ----------

export interface RoomData {
  room: Room;
  units: Unit[];
  canEdit: boolean;
  family: boolean;
}

// A live session as the room shows it: when, and whether the link is open now
export interface LiveState {
  label: string;
  // upcoming: not yet · open: 15 minutes before until it ends · ended
  phase: 'upcoming' | 'open' | 'ended';
}

export interface RoomPageState extends RemoteState<RoomData> {
  // Student progress: material opened over material available
  progress: { viewed: number; total: number } | null;
  nextLive: { item: Item; unitTitle: string; live: LiveState } | null;
  liveOf: (item: Item) => LiveState | null;
}

export interface UnitValues {
  title: string;
  summary: string;
  opensOn: string;
  published: boolean;
}

export interface UnitPayload extends UnitValues {
  id: string;
  roomId: string;
}

export interface UseUnitFormParams {
  roomId: string;
  unit: Unit | null;
  onSaved: () => void;
}

export interface ItemValues {
  kind: string;
  title: string;
  body: string;
  url: string;
  complementary: boolean;
  // datetime-local value (Lima time)
  startsAt: string;
  durationMinutes: string;
  recordingUrl: string;
  published: boolean;
}

export interface ItemPayload {
  id: string;
  unitId: string;
  kind: string;
  title: string;
  body: string;
  url: string;
  complementary: boolean;
  startsAt: string;
  durationMinutes: number | undefined;
  recordingUrl: string;
  libraryItemId: string;
  published: boolean;
}

export interface UseItemFormParams {
  unitId: string;
  item: Item | null;
  onSaved: () => void;
}

export interface RoomSettingsValues {
  description: string;
  published: boolean;
}

export interface UseRoomSettingsParams {
  room: Room;
  onSaved: () => void;
}

export interface UseMoveResult {
  move: (ids: string[], index: number, delta: -1 | 1) => void;
  isMoving: boolean;
}

export interface UseDeleteResult {
  remove: (id: string) => void;
  deletingId: string | null;
}

export interface UseAddFromLibraryResult {
  add: (unitId: string, entry: LibraryItem) => void;
  addingId: string | null;
}

export interface UseCopyRoomParams {
  room: Room;
  onCopied: () => void;
}

export interface UseCopyRoomResult {
  periods: Period[];
  periodId: string;
  setPeriodId: (id: string) => void;
  sources: Room[];
  isLoading: boolean;
  copy: (fromRoomId: string) => void;
  isCopying: boolean;
}

// ---------- library ----------

export interface LibraryData {
  items: LibraryItem[];
  canEdit: boolean;
}

export interface LibraryPageState extends RemoteState<LibraryData> {
  query: string;
  setQuery: (q: string) => void;
  kind: string;
  setKind: (k: string) => void;
  filtered: LibraryItem[];
}

export interface LibraryValues {
  kind: string;
  title: string;
  description: string;
  body: string;
  url: string;
  topic: string;
}

export interface LibraryPayload extends LibraryValues {
  id: string;
}

export interface UseLibraryFormParams {
  entry: LibraryItem | null;
  onSaved: () => void;
}

// ---------- deliveries ----------

export interface DeliveryPayload {
  unitId: string;
  studentId: string;
  deliveredOn: string;
  returnedOn: string;
  notes: string;
}

export interface UseDeliveriesResult extends RemoteState<Delivery[]> {
  save: (studentId: string, deliveredOn: string, returnedOn: string) => void;
  savingId: string | null;
  delivered: number;
  returned: number;
}

// ---------- components ----------

export interface ItemKindMeta {
  label: string;
  icon: IconInput;
  hint: string;
}

export interface UnitSectionProps {
  unit: Unit;
  index: number;
  count: number;
  room: Room;
  canEdit: boolean;
  family: boolean;
  liveOf: (item: Item) => LiveState | null;
  isMoving: boolean;
  onMove: (delta: -1 | 1) => void;
  onEdit: () => void;
  onChanged: () => void;
}

export interface ItemRowProps {
  item: Item;
  roomId: string;
  index: number;
  count: number;
  canEdit: boolean;
  family: boolean;
  live: LiveState | null;
  isMoving: boolean;
  isDeleting: boolean;
  onMove: (delta: -1 | 1) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface UnitDialogProps {
  roomId: string;
  unit: Unit | null;
  onClose: () => void;
  onSaved: () => void;
}

export interface ItemDialogProps {
  unitId: string;
  item: Item | null;
  onClose: () => void;
  onSaved: () => void;
}

export interface LibraryPickerProps {
  unitId: string;
  onClose: () => void;
  onAdded: () => void;
}

export interface RoomSettingsDialogProps {
  room: Room;
  onClose: () => void;
  onSaved: () => void;
}

export interface CopyRoomDialogProps {
  room: Room;
  onClose: () => void;
  onCopied: () => void;
}

export interface DeliveriesDialogProps {
  unit: Unit;
  onClose: () => void;
}

export interface LibraryDialogProps {
  entry: LibraryItem | null;
  onClose: () => void;
  onSaved: () => void;
}

export interface UnitPrintProps {
  roomId: string;
  unitId: string;
}

// ---------- online assessments ----------

export interface AssessmentData {
  assessment: Assessment;
  canEdit: boolean;
  family: boolean;
  competencies: Competency[];
  roster: RosterRow[];
  questionsLocked: boolean;
  attempts: Submission[];
  extension: string;
  openNow: boolean;
  canStart: boolean;
}

export interface AssessmentSettingsValues {
  // datetime-local values (Lima)
  opensAt: string;
  closesAt: string;
  maxAttempts: string;
  competencyIds: string[];
  showAnswers: boolean;
}

// A question as the editor holds it; accepted answers are one per line
export interface QuestionDraft {
  key: string;
  kind: string;
  prompt: string;
  options: string[];
  correct: number[];
  accepted: string;
  points: string;
}

export interface AssessmentPayload {
  itemId: string;
  opensAt: string;
  closesAt: string;
  maxAttempts: number;
  competencyIds: string[];
  showAnswers: boolean;
  replaceQuestions: boolean;
  questions: Question[];
}

export interface UseAssessmentEditorResult extends FormState<AssessmentSettingsValues> {
  questions: QuestionDraft[];
  addQuestion: (kind: string) => void;
  updateQuestion: (key: string, patch: Partial<QuestionDraft>) => void;
  removeQuestion: (key: string) => void;
  moveQuestion: (key: string, delta: -1 | 1) => void;
  totalPoints: number;
}

export interface UseAttemptResult {
  current: Submission | null;
  answers: Record<string, Answer>;
  setChoice: (questionId: string, index: number, multiple: boolean) => void;
  setText: (questionId: string, text: string) => void;
  start: () => void;
  handIn: () => void;
  isStarting: boolean;
  isHandingIn: boolean;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
}

export interface GradeValues {
  levels: Record<string, string>;
  openPoints: Record<string, string>;
  feedback: string;
}

export interface UseGradeParams {
  submission: Submission;
  onSaved: () => void;
}

export interface ExtensionValues {
  closesAt: string;
  reason: string;
}

export interface UseExtensionParams {
  itemId: string;
  row: RosterRow;
  onSaved: () => void;
}

export interface UseRecordLevelsResult {
  record: () => void;
  isRecording: boolean;
}

export interface AssessmentPageProps {
  roomId: string;
  itemId: string;
}

export interface AssessmentStaffProps {
  roomId: string;
  data: AssessmentData;
  onChanged: () => void;
}

export interface AssessmentStudentProps {
  roomId: string;
  data: AssessmentData;
  onChanged: () => void;
}

export interface GradeDialogProps {
  assessment: Assessment;
  competencies: Competency[];
  submission: Submission;
  onClose: () => void;
  onSaved: () => void;
}

export interface ExtensionDialogProps {
  itemId: string;
  row: RosterRow;
  onClose: () => void;
  onSaved: () => void;
}

export interface QuestionEditorProps {
  question: QuestionDraft;
  error?: string;
  index: number;
  count: number;
  locked: boolean;
  onChange: (patch: Partial<QuestionDraft>) => void;
  onRemove: () => void;
  onMove: (delta: -1 | 1) => void;
}

export interface SubmissionReviewProps {
  assessment: Assessment;
  competencies: Competency[];
  submission: Submission;
}

// ---------- forums ----------

export interface ForumData {
  forum: Forum;
  threads: Thread[];
  canPost: boolean;
  canModerate: boolean;
  myUserId: string;
  newPosts: number;
  participation: Participation[];
}

export interface ForumPageState extends RemoteState<ForumData> {
  // Students with no post yet, for the teacher's nudge
  silent: number;
  post: (body: string, parentId: string) => Promise<boolean>;
  isPosting: boolean;
  edit: (postId: string, body: string) => Promise<boolean>;
  remove: (postId: string) => void;
  togglePin: (post: Post) => void;
  show: (post: Post) => void;
  setClosed: (closed: boolean) => void;
  setKind: (kind: string) => void;
  busyId: string | null;
}

export interface UseModeratePostResult {
  hide: (post: Post, reason: string) => Promise<boolean>;
  isHiding: boolean;
}

export interface ForumPageProps {
  roomId: string;
  itemId: string;
}

export interface PostCardProps {
  post: Post;
  isMine: boolean;
  canModerate: boolean;
  busy: boolean;
  reply?: boolean;
  onEdit: (body: string) => Promise<boolean>;
  onDelete: () => void;
  onPin: () => void;
  onHide: () => void;
  onShow: () => void;
}

export interface PostComposerProps {
  placeholder: string;
  submitLabel: string;
  isPosting: boolean;
  compact?: boolean;
  onSubmit: (body: string) => Promise<boolean>;
}

export interface HidePostDialogProps {
  post: Post;
  onClose: () => void;
  onHidden: () => void;
}
