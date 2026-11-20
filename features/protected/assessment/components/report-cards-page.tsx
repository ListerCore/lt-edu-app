'use client';

import { useMemo, useState, type JSX } from 'react';
import { Download } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { reportCardsPdfAction } from '@/features/protected/documents/actions/document-actions';
import { usePdf } from '@/features/protected/documents/lib/use-pdf';
import { isAssessmentEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getGradebookAction, getMyCardsAction, getReportCardAction, getSectionCardsAction } from '../actions/assessment-actions';
import type { FamilyCard, Gradebook, ReportCard } from '../types';
import { ReportCardView } from './report-card';

// Libretas: staff browse and print the cards of a section; students and guardians read only their own (or their
// children's). The role in use decides the view, never the data that came back: a family never sees the section list
export const ReportCardsPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const { role } = useWorkspace();
  const familyRole = role === 'student' || role === 'guardian';
  const mine = useAcademicData(`my-cards:${slug}`, () => getMyCardsAction(slug), isAssessmentEvent);
  const family = familyRole || Boolean(mine.data && mine.data.length > 0);
  const [periodId, setPeriodId] = useState('');
  const [termId, setTermId] = useState('');
  const book = useAcademicData(`cards-book:${slug}:${periodId}:${termId}`, () => getGradebookAction(slug, periodId, termId), isAssessmentEvent);
  const literal = (book.data?.scale ?? mine.data?.[0]?.card?.scale ?? 'literal') === 'literal';

  return (
    <AcademicPage wide
      titleId="cards-title"
      title={literal ? 'Libretas' : 'Boletas de notas'}
      description={literal ? 'El informe de progreso de cada estudiante: niveles por competencia, conclusiones, asistencia y el comentario del tutor.' : 'El promedio de cada unidad o curso con sus evaluaciones y la asistencia.'}
      context={null}
    >
      {family ? (
        mine.error ? (
          <LoadError message={mine.error} onRetry={mine.reload} />
        ) : !mine.data ? (
          <PageSkeleton />
        ) : mine.data.length > 0 ? (
          <FamilyCards slug={slug} items={mine.data} />
        ) : (
          <DemoFamilyCard slug={slug} />
        )
      ) : mine.isLoading ? (
        <PageSkeleton />
      ) : book.error ? (
        <LoadError message={book.error} onRetry={book.reload} />
      ) : !book.data ? (
        <PageSkeleton />
      ) : (
        <StaffCards
          slug={slug}
          book={book.data}
          onPeriod={(id): void => {
            setPeriodId(id);
            setTermId('');
          }}
          onTerm={setTermId}
        />
      )}
    </AcademicPage>
  );
};

const StaffCards = ({ slug, book, onPeriod, onTerm }: { slug: string; book: Gradebook; onPeriod: (id: string) => void; onTerm: (id: string) => void }): JSX.Element => {
  const sections = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of book.tutor) map.set(t.sectionId, t.sectionLabel);
    for (const s of book.sheets) if (!map.has(s.sectionId)) map.set(s.sectionId, s.sectionLabel);
    return [...map].map(([value, label]) => ({ value, label }));
  }, [book]);
  const [sectionId, setSectionId] = useState('');
  const section = sections.find((s) => s.value === sectionId)?.value ?? sections[0]?.value ?? '';
  const { data, error, reload } = useAcademicData(`section-cards:${slug}:${section}:${book.termId}`, () => getSectionCardsAction(slug, section, book.termId), () => false);
  const [studentId, setStudentId] = useState('');
  const card = data?.find((c) => c.student?.id === studentId) ?? data?.[0];
  const terms = book.period?.terms ?? [];
  const [isPending, pdf] = usePdf();
  // The API builds the PDF: this student's card, or every card of the section in one file
  const download = (all: boolean): void =>
    pdf(() => reportCardsPdfAction(slug, { sectionId: all ? section : '', studentId: all ? '' : (card?.student?.id ?? ''), periodId: book.period?.id ?? '', termId: book.termId }));

  if (sections.length === 0) return <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">No tienes secciones a cargo en este periodo.</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full max-w-xs">
          <SelectField id="cards-section" value={section} options={sections} onChange={(v): void => { setSectionId(v); setStudentId(''); }} />
        </div>
        {terms.length > 0 && (
          <div className="w-56">
            <SelectField id="cards-term" value={book.termId} options={terms.map((t) => ({ value: t.id, label: `${t.name}${t.status === 'open' ? ' (en curso)' : ''}` }))} onChange={onTerm} />
          </div>
        )}
        {book.periods.length > 1 && (
          <div className="w-56">
            <SelectField id="cards-period" value={book.period?.id ?? ''} options={book.periods.map((p) => ({ value: p.id, label: p.name }))} onChange={onPeriod} />
          </div>
        )}
        <div className="ml-auto flex gap-2">
          <button type="button" className="btn-alt" disabled={!card || isPending} onClick={(): void => download(false)}>
            <MorphIcon icon={Download} size={16} />
            PDF de este estudiante
          </button>
          <button type="button" className="btn-brand" disabled={!data?.length || isPending} onClick={(): void => download(true)}>
            <MorphIcon icon={Download} size={16} />
            {isPending ? 'Generando PDF…' : `PDF de la sección (${data?.length ?? 0})`}
          </button>
        </div>
      </div>
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : data.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">La sección no tiene estudiantes.</p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <ol className="max-h-[70svh] overflow-y-auto rounded-2xl border border-border bg-background py-2 print:hidden" aria-label="Estudiantes">
            {data.map((c, i) => (
              <li key={c.student?.id}>
                <button
                  type="button"
                  onClick={(): void => setStudentId(c.student?.id ?? '')}
                  aria-current={c.student?.id === card?.student?.id}
                  className={cn('flex w-full gap-2 px-4 py-2 text-left text-sm transition-colors', c.student?.id === card?.student?.id ? 'bg-brand/10 font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}
                >
                  <span className="w-5 shrink-0 tabular-nums">{i + 1}</span>
                  <span className="truncate">{c.student?.name}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="min-w-0 space-y-6">{card && <ReportCardView card={card} logo={data[0]?.logo} />}</div>
        </div>
      )}
    </div>
  );
};

const FamilyCards = ({ slug, items }: { slug: string; items: FamilyCard[] }): JSX.Element => {
  const [studentId, setStudentId] = useState(items[0]?.studentId ?? '');
  const item = items.find((x) => x.studentId === studentId) ?? items[0];
  return (
    <div className="space-y-5">
      {items.length > 1 && (
        <div role="tablist" aria-label="Estudiantes" className="flex flex-wrap gap-2">
          {items.map((x) => (
            <button
              key={x.studentId}
              type="button"
              role="tab"
              aria-selected={x.studentId === item?.studentId}
              onClick={(): void => setStudentId(x.studentId)}
              className={cn('rounded-full border px-4 py-2 text-sm font-medium transition-colors', x.studentId === item?.studentId ? 'border-brand bg-brand/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground')}
            >
              {x.studentName.split(' ')[0]}
            </button>
          ))}
        </div>
      )}
      {item && (item.card ? <FamilyCardView key={item.studentId} slug={slug} initial={item.card} /> : <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">{item.message || 'Aún no hay libreta.'}</p>)}
    </div>
  );
};

// The demo role selector plays "Estudiante" or "Apoderado" on a staff session, which holds no student of its own: it
// previews the card of a single demo student, as that student would see it, instead of the whole section
const DemoFamilyCard = ({ slug }: { slug: string }): JSX.Element => {
  const book = useAcademicData(`demo-family-book:${slug}`, () => getGradebookAction(slug, '', ''), () => false);
  const sectionId = book.data?.tutor[0]?.sectionId ?? book.data?.sheets[0]?.sectionId ?? '';
  const termId = book.data?.termId ?? '';
  const cards = useAcademicData(`demo-family-cards:${slug}:${sectionId}:${termId}`, async () => (sectionId ? getSectionCardsAction(slug, sectionId, termId) : { ok: true as const, data: [] }), () => false);
  const first = cards.data?.[0];
  if (book.error || cards.error) return <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Tu cuenta aún no está vinculada a un estudiante matriculado.</p>;
  if (!book.data || !cards.data) return <PageSkeleton />;
  if (!first?.student) return <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Aún no hay libreta.</p>;
  return <FamilyCards slug={slug} items={[{ studentId: first.student.id, studentName: first.student.name, card: first, message: '' }]} />;
};

// A family picks among the closed terms; the card of each is loaded on demand
const FamilyCardView = ({ slug, initial }: { slug: string; initial: ReportCard }): JSX.Element => {
  const [termId, setTermId] = useState(initial.termId);
  const studentId = initial.student?.id ?? '';
  const { data } = useAcademicData(`family-card:${slug}:${studentId}:${termId}`, async () => (termId === initial.termId ? { ok: true as const, data: initial } : getReportCardAction(slug, studentId, initial.periodId, termId)), () => false);
  const card = data ?? initial;
  const [isPending, pdf] = usePdf();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {initial.terms.length > 1 ? (
          <div className="w-52">
            <SelectField id="family-term" value={termId} options={initial.terms.map((t) => ({ value: t.id, label: t.name }))} onChange={setTermId} />
          </div>
        ) : (
          <span />
        )}
        <button type="button" className="btn-alt" disabled={isPending} onClick={(): void => pdf(() => reportCardsPdfAction(slug, { sectionId: '', studentId, periodId: initial.periodId, termId }))}>
          <MorphIcon icon={Download} size={16} />
          {isPending ? 'Generando PDF…' : 'Descargar PDF'}
        </button>
      </div>
      <ReportCardView card={card} />
    </div>
  );
};
