'use client';

import { useState, useTransition, type JSX } from 'react';
import { MessageCircle } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { cn } from '@/lib/utils';
import { getTutorSheetAction, saveTutorSheetAction } from '../actions/assessment-actions';
import { cellKey } from '../data/assessment-data';
import type { Sheet, StudentRef } from '../types';
import { CompetencyLegend, ConclusionDialog, LevelCell, LevelLegend, SaveBar, SheetHeader, useLevelDrafts } from './sheet-ui';

interface TutorSheetProps {
  slug: string;
  sectionId: string;
  termId: string;
  onBack: () => void;
}

// Tutoría: the transversal competencies (no area of their own), the conduct mark and what the tutor writes to each family
export const TutorSheet = ({ slug, sectionId, termId, onBack }: TutorSheetProps): JSX.Element => {
  const { data, error, reload } = useAcademicData(`tutor-sheet:${slug}:${sectionId}:${termId}`, () => getTutorSheetAction(slug, sectionId, termId), () => false);
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  return <TutorGrid key={JSON.stringify(data.submitted ?? null)} slug={slug} sheet={data} onBack={onBack} reload={reload} />;
};

interface Personal {
  conduct: string;
  note: string;
  comment: string;
}

const TutorGrid = ({ slug, sheet, onBack, reload }: { slug: string; sheet: Sheet; onBack: () => void; reload: () => void }): JSX.Element => {
  const d = useLevelDrafts(sheet.marks);
  const [personal, setPersonal] = useState<Record<string, Personal>>({});
  const [editing, setEditing] = useState<{ studentId: string; competencyId: string } | null>(null);
  const [writing, setWriting] = useState<StudentRef | null>(null);
  const [isPending, startTransition] = useTransition();
  const editable = sheet.canEdit;

  const savedOf = (id: string): Personal => {
    const c = sheet.conductMarks.find((x) => x.studentId === id);
    return { conduct: c ? String(c.score) : '', note: c?.note ?? '', comment: sheet.comments.find((x) => x.studentId === id)?.comment ?? '' };
  };
  const valueOf = (id: string): Personal => personal[id] ?? savedOf(id);
  const setP = (id: string, patch: Partial<Personal>): void =>
    setPersonal((c) => {
      const next = { ...(c[id] ?? savedOf(id)), ...patch };
      const base = savedOf(id);
      if (next.conduct === base.conduct && next.note === base.note && next.comment === base.comment) {
        const rest = { ...c };
        delete rest[id];
        return rest;
      }
      return { ...c, [id]: next };
    });
  const badConduct = Object.values(personal).some((p) => p.conduct !== '' && !(/^\d{1,2}$/.test(p.conduct) && Number(p.conduct) <= 20));
  const count = d.count + Object.keys(personal).length;

  const save = (): void =>
    startTransition(async () => {
      const entries = Object.entries(personal);
      const result = await saveTutorSheetAction(slug, sheet.sectionId, sheet.termId, {
        marks: d.toMarks(),
        conduct: sheet.conduct ? entries.filter(([id, p]) => p.conduct !== savedOf(id).conduct || p.note !== savedOf(id).note).map(([studentId, p]) => ({ studentId, score: p.conduct === '' ? null : Number(p.conduct), note: p.note })) : [],
        comments: entries.filter(([id, p]) => p.comment !== savedOf(id).comment).map(([studentId, p]) => ({ studentId, comment: p.comment })),
      });
      if (!result.ok) {
        sileo.error({ title: 'No se pudo guardar', description: result.message });
        return;
      }
      d.reset();
      setPersonal({});
      sileo.success({ title: 'Hoja de tutoría guardada' });
      reload();
    });

  const student = editing && sheet.students.find((s) => s.id === editing.studentId);
  const compIndex = editing ? sheet.competencies.findIndex((c) => c.id === editing.competencyId) : -1;

  return (
    <div className="space-y-4">
      <SheetHeader slug={slug} sheet={sheet} title={`Tutoría · ${sheet.sectionLabel}`} subtitle={[sheet.levelName, sheet.termName, sheet.tutorName && `Tutor(a): ${sheet.tutorName}`].filter(Boolean).join(' · ')} onBack={onBack} onChanged={reload} dirty={count > 0} />
      {sheet.competencies.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">Competencias transversales: no pertenecen a un área, las registra el tutor con lo que observan todos los docentes.</p>
          <CompetencyLegend competencies={sheet.competencies} />
          <LevelLegend />
        </>
      )}
      <div className="overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th scope="col" className="w-10 px-3 py-3 font-medium whitespace-nowrap">N.°</th>
              <th scope="col" className="min-w-56 px-3 py-3 font-medium">Estudiante</th>
              {sheet.competencies.map((c, i) => (
                <th key={c.id} scope="col" className="px-2 py-3 text-center font-medium" title={c.name}>
                  C{i + 1}
                </th>
              ))}
              {sheet.conduct && (
                <th scope="col" className="px-2 py-3 text-center font-medium">
                  Conducta
                </th>
              )}
              <th scope="col" className="px-3 py-3 font-medium">Comentario a la familia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sheet.students.map((s, n) => {
              const p = valueOf(s.id);
              const bad = p.conduct !== '' && !(/^\d{1,2}$/.test(p.conduct) && Number(p.conduct) <= 20);
              return (
                <tr key={s.id} className={cn(personal[s.id] && 'bg-brand/5')}>
                  <td className="px-3 py-1.5 text-muted-foreground tabular-nums">{n + 1}</td>
                  <td className="px-3 py-1.5 font-medium text-foreground">{s.name}</td>
                  {sheet.competencies.map((c, i) => {
                    const key = cellKey(s.id, c.id);
                    return (
                      <td key={c.id} className="px-2 py-1.5">
                        <div className="flex justify-center">
                          <LevelCell
                            student={s}
                            competency={c}
                            index={i}
                            value={d.valueOf(key)}
                            changed={key in d.drafts}
                            disabled={!editable || isPending}
                            onLevel={(level): void => d.set(key, { ...d.valueOf(key), level })}
                            onConclusion={(): void => setEditing({ studentId: s.id, competencyId: c.id })}
                          />
                        </div>
                      </td>
                    );
                  })}
                  {sheet.conduct && (
                    <td className="px-2 py-1.5 text-center">
                      <input
                        aria-label={`Conducta de ${s.name}`}
                        inputMode="numeric"
                        maxLength={2}
                        value={p.conduct}
                        disabled={!editable || isPending}
                        onChange={(e): void => setP(s.id, { conduct: e.target.value.replace(/\D/g, '') })}
                        className={cn('h-8 w-14 rounded-md border bg-background text-center tabular-nums disabled:opacity-100', bad ? 'border-destructive text-destructive' : 'border-border')}
                      />
                    </td>
                  )}
                  <td className="px-3 py-1.5">
                    <button type="button" onClick={(): void => setWriting(s)} className="flex max-w-80 items-center gap-2 text-left text-xs text-muted-foreground hover:text-foreground">
                      <MorphIcon icon={MessageCircle} size={14} className={p.comment ? 'shrink-0 text-brand' : 'shrink-0'} />
                      <span className="truncate">{p.comment || (editable ? 'Escribir comentario' : '—')}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {editable && (
        <SaveBar
          count={count}
          busy={isPending || badConduct}
          onDiscard={(): void => {
            d.reset();
            setPersonal({});
          }}
          onSave={save}
        >
          {badConduct && <span className="text-sm text-destructive">La conducta va de 0 a 20.</span>}
        </SaveBar>
      )}
      {editing && student && compIndex >= 0 && (
        <ConclusionDialog
          student={student}
          competency={sheet.competencies[compIndex]}
          value={d.valueOf(cellKey(editing.studentId, editing.competencyId))}
          readOnly={!editable}
          onClose={(): void => setEditing(null)}
          onSave={(v): void => {
            d.set(cellKey(editing.studentId, editing.competencyId), v);
            setEditing(null);
          }}
        />
      )}
      {writing && <CommentDialog student={writing} value={valueOf(writing.id)} conduct={sheet.conduct} readOnly={!editable} onClose={(): void => setWriting(null)} onSave={(v): void => { setP(writing.id, v); setWriting(null); }} />}
    </div>
  );
};

const CommentDialog = ({ student, value, conduct, readOnly, onSave, onClose }: { student: StudentRef; value: Personal; conduct: boolean; readOnly: boolean; onSave: (v: Partial<Personal>) => void; onClose: () => void }): JSX.Element => {
  const [comment, setComment] = useState(value.comment);
  const [note, setNote] = useState(value.note);
  return (
    <FormDialog title={student.name} description="Lo que escribas aquí aparece en su libreta." submitLabel="Aplicar" isPending={false} disabled={readOnly} onSubmit={(): void => onSave({ comment: comment.trim(), note: note.trim() })} onClose={onClose}>
      <FormField id="tutor-comment" label="Comentario a la familia" hint="Cómo le fue en el periodo y qué pueden hacer en casa.">
        <Textarea id="tutor-comment" value={comment} rows={5} maxLength={1000} readOnly={readOnly} onChange={(e): void => setComment(e.target.value)} />
      </FormField>
      {conduct && (
        <FormField id="conduct-note" label="Observación de conducta">
          <Input id="conduct-note" value={note} maxLength={500} readOnly={readOnly} onChange={(e): void => setNote(e.target.value)} />
        </FormField>
      )}
    </FormDialog>
  );
};
