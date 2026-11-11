'use client';

import { useState, type JSX } from 'react';
import { FilePlus } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { isAttendanceEvent, useLiveRefresh } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getMyAttendanceAction, getOverviewAction } from '../actions/attendance-actions';
import type { Overview, StudentAttendance } from '../types';
import { AlertsView } from './alerts-view';
import { DayPicker, Empty, Tabs } from './attendance-ui';
import { ClassesView } from './classes-view';
import { DayView } from './day-view';
import { GateView } from './gate-view';
import { SubmitJustificationDialog, JustificationsView } from './justifications-view';
import { StudentRecord } from './student-record';

type Tab = 'day' | 'gate' | 'classes' | 'justifications' | 'alerts';

// Asistencia de estudiantes: the institution sees the day, the gate, the classes, the justifications and the alerts;
// families see their children
export const StudentAttendancePage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const today = useToday();
  const [day, setDay] = useState('');
  const current = day || today;
  const overview = useAcademicData(`att-overview:${slug}:${current}`, () => getOverviewAction(slug, current), isAttendanceEvent);
  const mine = useAcademicData(`att-mine:${slug}`, () => getMyAttendanceAction(slug), () => false);
  const family = Boolean(mine.data && mine.data.length > 0);

  if (family && mine.data) return <FamilyAttendance slug={slug} today={today} students={mine.data} reload={mine.reload} />;
  return (
    <AcademicPage wide titleId="attendance-title" title="Asistencia" description="La llegada de cada estudiante por la puerta, el registro de cada sección, la asistencia por clase y las justificaciones de las familias." context={null}>
      {overview.error && !overview.data ? (
        mine.data && mine.data.length === 0 && overview.error.includes('rol') ? (
          <Empty>No hay estudiantes vinculados a tu cuenta.</Empty>
        ) : (
          <LoadError message={overview.error} onRetry={overview.reload} />
        )
      ) : !overview.data ? (
        <PageSkeleton />
      ) : (
        <InstitutionAttendance slug={slug} overview={overview.data} today={today} onDay={setDay} reload={overview.reload} />
      )}
    </AcademicPage>
  );
};

interface InstitutionProps {
  slug: string;
  overview: Overview;
  today: string;
  onDay: (day: string) => void;
  reload: () => void;
}

const InstitutionAttendance = ({ slug, overview, today, onDay, reload }: InstitutionProps): JSX.Element => {
  const isToday = overview.day === (today || overview.today);
  const tabs: Array<[Tab, string, number?]> = [
    ['day', isToday ? 'Hoy' : 'El día'],
    ...(overview.canScan && isToday ? ([['gate', 'Puerta']] as Array<[Tab, string]>) : []),
    ...(overview.canTakeClasses ? ([['classes', 'Clases']] as Array<[Tab, string]>) : []),
    ...(overview.canReview ? ([['justifications', 'Justificaciones', overview.pendingJustifications]] as Array<[Tab, string, number]>) : []),
    ['alerts', 'Alertas'],
  ];
  const [tab, setTab] = useState<Tab>(overview.canScan ? 'day' : overview.tutoring.length === 0 && overview.canTakeClasses ? 'classes' : 'day');
  const shown = tabs.some(([k]) => k === tab) ? tab : 'day';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs label="Vistas de asistencia" tabs={tabs} current={shown} onChange={setTab} />
        {(shown === 'day' || shown === 'classes') && <DayPicker day={overview.day} today={today || overview.today} onChange={onDay} />}
      </div>
      {shown === 'day' && <DayView slug={slug} overview={overview} reload={reload} />}
      {shown === 'gate' && <GateView slug={slug} />}
      {shown === 'classes' && <ClassesView key={overview.day} slug={slug} overview={overview} />}
      {shown === 'justifications' && <JustificationsView slug={slug} />}
      {shown === 'alerts' && <AlertsView slug={slug} overview={overview} />}
    </div>
  );
};

interface FamilyProps {
  slug: string;
  today: string;
  students: StudentAttendance[];
  reload: () => void;
}

// Families: each child with today's arrival (it updates the moment the card is read at the gate) and the period
const FamilyAttendance = ({ slug, today, students, reload }: FamilyProps): JSX.Element => {
  const [selected, setSelected] = useState(students[0]?.student?.id ?? '');
  const [justifying, setJustifying] = useState(false);
  const ids = new Set(students.map((s) => s.student?.id));
  useLiveRefresh((event) => event.type === 'attendance.changed' && ids.has(event.data.student), reload, 150);
  const record = students.find((s) => s.student?.id === selected) ?? students[0];
  const pick = students.map((s) => ({ id: s.student?.id ?? '', name: s.student?.name ?? '' }));

  return (
    <AcademicPage wide titleId="attendance-title" title="Asistencia" description="Cuándo llegó, las faltas y tardanzas del periodo y las justificaciones que enviaste." context={null}>
      <div className="space-y-6">
        {students.length > 1 && (
          <div role="tablist" aria-label="Estudiantes" className="flex flex-wrap gap-2">
            {students.map((s) => (
              <button
                key={s.student?.id}
                type="button"
                role="tab"
                aria-selected={s.student?.id === record?.student?.id}
                onClick={(): void => setSelected(s.student?.id ?? '')}
                className={cn('rounded-full border px-4 py-2 text-sm font-medium transition-colors', s.student?.id === record?.student?.id ? 'border-brand bg-brand/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground')}
              >
                {s.student?.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}
        {record && (
          <>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{record.student?.name}</h2>
              <p className="text-sm text-muted-foreground">{record.sectionLabel}</p>
            </div>
            <StudentRecord
              record={record}
              showToday
              actions={
                <button type="button" className="btn-brand" onClick={(): void => setJustifying(true)}>
                  <MorphIcon icon={FilePlus} size={16} />
                  Justificar una falta
                </button>
              }
            />
          </>
        )}
      </div>
      {justifying && today && (
        <SubmitJustificationDialog
          slug={slug}
          today={today}
          students={record ? [pick.find((p) => p.id === record.student?.id) ?? pick[0], ...pick.filter((p) => p.id !== record.student?.id)] : pick}
          onClose={(): void => setJustifying(false)}
          onDone={(): void => {
            setJustifying(false);
            reload();
          }}
        />
      )}
    </AcademicPage>
  );
};
