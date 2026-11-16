'use client';

import { useState, type JSX } from 'react';
import { LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { cn } from '@/lib/utils';
import { useTutorBoard } from '../hooks/use-tutor-board';
import type { SessionDraft, Thread, TutorBoardRow, TutoringSession } from '../types';
import { AssignmentsTab } from './assignments-tab';
import { HoldDialog } from './hold-dialog';
import { MessagesTab } from './messages-tab';
import { SaaneeDialog } from './saanee-dialog';
import { SessionDialog } from './session-dialog';
import { SessionsTab } from './sessions-tab';
import { StudentsTab } from './students-tab';

type Tab = 'students' | 'sessions' | 'messages' | 'assignments';
type Open = { threadId?: string; studentId?: string; name: string; placement: string } | null;
type Dialog = { kind: 'session'; draft?: SessionDraft; session?: TutoringSession } | { kind: 'hold'; session: TutoringSession } | { kind: 'saanee'; row: TutorBoardRow } | null;

// The virtual tutor's desk: students with their alerts, sessions, messages and (dirección) the assignments
export const TutorDesk = ({ slug }: { slug: string }): JSX.Element => {
  const [staffId, setStaffId] = useState('');
  const { data: board, error, reload } = useTutorBoard(slug, staffId);
  const [tab, setTab] = useState<Tab>('students');
  const [open, setOpen] = useState<Open>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!board) return <PageSkeleton />;
  const unread = board.threads.reduce((n, t) => n + t.unread, 0);
  const ahead = board.sessions.filter((s) => s.status === 'scheduled').length;
  const tabs: Array<[Tab, string]> = [
    ['students', `Estudiantes (${board.rows.length})`],
    ['sessions', `Tutorías${ahead ? ` (${ahead})` : ''}`],
    ...(board.canMessage ? ([['messages', `Mensajes${unread ? ` (${unread})` : ''}`]] as Array<[Tab, string]>) : []),
    ...(board.canAssign ? ([['assignments', 'Asignación']] as Array<[Tab, string]>) : []),
  ];
  const write = (r: TutorBoardRow): void => {
    const t = board.threads.find((x) => x.studentId === r.student?.studentId);
    setOpen(t ? { threadId: t.id, name: t.studentName, placement: t.placement } : { studentId: r.student?.studentId, name: r.student?.name ?? '', placement: r.student?.placement ?? '' });
    setTab('messages');
  };
  const openThread = (t: Thread): void => setOpen({ threadId: t.id, name: t.studentName, placement: t.placement });
  const done = (): void => {
    setDialog(null);
    reload();
  };
  const saaneeOf = (row: TutorBoardRow) => board.saanee.find((x) => x.studentId === row.student?.studentId);
  return (
    <div className="space-y-5">
      {board.canAssign && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">Tablero de</span>
          <div className="w-72">
            <SelectField
              id="desk-tutor"
              value={staffId}
              options={[{ value: '', label: 'Todos los estudiantes' }, ...board.tutors.map((t) => ({ value: t.staffId, label: `${t.name} (${t.bySection + t.individual})` }))]}
              onChange={(v): void => {
                setStaffId(v);
                setOpen(null);
              }}
            />
          </div>
        </div>
      )}
      <div role="tablist" aria-label="Tutoría virtual" className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={(): void => setTab(key)} className={cn('-mb-px border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors', tab === key ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'students' && <StudentsTab board={board} onWrite={write} onSchedule={(draft): void => setDialog({ kind: 'session', draft })} onSaanee={(row): void => setDialog({ kind: 'saanee', row })} />}
      {tab === 'sessions' && (
        <SessionsTab
          slug={slug}
          sessions={board.sessions}
          onNew={(draft): void => setDialog({ kind: 'session', draft })}
          onEdit={(session): void => setDialog({ kind: 'session', session })}
          onHold={(session): void => setDialog({ kind: 'hold', session })}
          onChange={reload}
        />
      )}
      {tab === 'messages' && <MessagesTab slug={slug} threads={board.threads} open={open} onOpen={openThread} onRead={reload} />}
      {tab === 'assignments' && <AssignmentsTab slug={slug} />}

      {dialog?.kind === 'session' && <SessionDialog slug={slug} staffId={board.staffId} students={board.rows} draft={dialog.draft} session={dialog.session} onClose={(): void => setDialog(null)} onSaved={done} />}
      {dialog?.kind === 'hold' && <HoldDialog slug={slug} session={dialog.session} onClose={(): void => setDialog(null)} onSaved={done} />}
      {dialog?.kind === 'saanee' && (
        <SaaneeDialog slug={slug} student={{ id: dialog.row.student?.studentId ?? '', name: dialog.row.student?.name ?? '' }} referral={saaneeOf(dialog.row)} onClose={(): void => setDialog(null)} onSaved={done} />
      )}
    </div>
  );
};
