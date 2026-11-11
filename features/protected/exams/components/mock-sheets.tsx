'use client';

import { useRef, useState, useTransition, type ChangeEvent, type JSX } from 'react';
import { FileUp, Keyboard } from 'lucide';
import { sileo } from 'sileo';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ConfirmDelete, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { cn } from '@/lib/utils';
import { deleteSheetAction, getResultsAction, loadFileAction, loadSheetsAction } from '../actions/exams-actions';
import { formatScore } from '../data/exams-data';
import type { LoadReport, MockDetail } from '../types';

// Respuestas: the optical reader's file, or one student at a time typed by hand
export const MockSheets = ({ slug, detail, canLoad, onSaved }: { slug: string; detail: MockDetail; canLoad: boolean; onSaved: () => void }): JSX.Element => {
  const m = detail.mock;
  const { data, error, reload } = useAcademicData(`mock-sheets:${slug}:${m?.id}`, () => getResultsAction(slug, m?.id ?? ''), () => false);
  const [report, setReport] = useState<LoadReport | null>(null);
  const [studentId, setStudentId] = useState('');
  const [answers, setAnswers] = useState('');
  const [isPending, startTransition] = useTransition();
  const file = useRef<HTMLInputElement>(null);
  if (!m) return <PageSkeleton />;
  const ready = m.questions > 0 && m.keyed === m.questions;
  const typed = answers.toUpperCase().replace(/[^A-E-]/g, '');

  const after = (r: { ok: true; data: LoadReport } | { ok: false; message: string }): void => {
    if (!r.ok) {
      sileo.error({ title: 'No se pudieron cargar', description: r.message });
      return;
    }
    setReport(r.data);
    sileo.success({ title: r.data.saved === 1 ? '1 hoja calificada' : `${r.data.saved} hojas calificadas` });
    reload();
    onSaved();
  };

  const upload = (e: ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      sileo.error({ title: 'El archivo pesa más de 2 MB' });
      return;
    }
    startTransition(async () => after(await loadFileAction(slug, m.id, await f.text())));
  };

  const saveOne = (): void =>
    startTransition(async () => {
      const r = await loadSheetsAction(slug, m.id, [{ studentId, answers: typed }]);
      after(r);
      if (r.ok) {
        setAnswers('');
        setStudentId('');
      }
    });

  const remove = (id: string): void =>
    startTransition(async () => {
      const r = await deleteSheetAction(slug, m.id, id);
      if (!r.ok) sileo.error({ title: 'No se pudo eliminar', description: r.message });
      else {
        reload();
        onSaved();
      }
    });

  if (!ready) return <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Completa la clave ({m.keyed} de {m.questions}) para cargar respuestas.</p>;
  if (error) return <LoadError message={error} onRetry={reload} />;

  const everyone = data ? [...data.missing.map((s) => ({ id: s.id, label: `${s.name} · ${s.levelName.replace('San Marcos · ', '')}`, done: false })), ...data.sheets.map((s) => ({ id: s.studentId, label: `${s.studentName} (ya cargada)`, done: true }))] : [];

  return (
    <div className="space-y-5">
      {canLoad && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section aria-labelledby="sheets-file" className="space-y-3 rounded-2xl border border-border bg-background p-5">
            <h3 id="sheets-file" className="font-semibold text-foreground">
              Archivo de la lectora óptica
            </h3>
            <p className="text-sm text-muted-foreground">
              CSV con una fila por alumno: el código o el DNI y luego las {m.questions} respuestas, juntas (<code className="text-xs">2026-0001;ABCDE-ABC…</code>) o una por columna. Las vacías cuentan como blanco.
            </p>
            <input ref={file} type="file" accept=".csv,.txt,text/csv,text/plain" className="sr-only" onChange={upload} />
            <button type="button" className="btn-brand" disabled={isPending} onClick={(): void => file.current?.click()}>
              <MorphIcon icon={FileUp} size={16} />
              Subir archivo
            </button>
          </section>
          <section aria-labelledby="sheets-manual" className="space-y-3 rounded-2xl border border-border bg-background p-5">
            <h3 id="sheets-manual" className="flex items-center gap-2 font-semibold text-foreground">
              <MorphIcon icon={Keyboard} size={16} />
              Una hoja a mano
            </h3>
            <SelectField id="sheet-student" value={studentId} placeholder="Elige al alumno" options={everyone.map((s) => ({ value: s.id, label: s.label }))} onChange={setStudentId} />
            <label className="block">
              <span className="sr-only">Respuestas</span>
              <input
                value={answers}
                onChange={(e): void => setAnswers(e.target.value)}
                placeholder="ABCDE-AB… (guion = en blanco)"
                spellCheck={false}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm tracking-wider uppercase"
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              <span className={cn('text-xs tabular-nums', typed.length > m.questions ? 'text-destructive' : 'text-muted-foreground')}>
                {typed.length} de {m.questions} respuestas{typed.length < m.questions && ' (las que falten serán blanco)'}
              </span>
              <button type="button" className="btn-brand" disabled={isPending || !studentId || typed.length === 0} onClick={saveOne}>
                Calificar
              </button>
            </div>
          </section>
        </div>
      )}
      {report && (report.unknown.length > 0 || report.otherArea.length > 0) && (
        <div role="status" className="rounded-xl border border-warning/40 bg-warning/8 px-4 py-3 text-sm">
          {report.unknown.length > 0 && <p className="text-foreground">Sin alumno con esos códigos o DNI: {report.unknown.join(', ')}.</p>}
          {report.otherArea.length > 0 && <p className="text-foreground">De áreas que no rinden este simulacro: {report.otherArea.join(', ')}.</p>}
        </div>
      )}
      {!data ? (
        <PageSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="px-3 py-3 font-medium">Alumno</th>
                <th scope="col" className="px-3 py-3 font-medium">Respuestas</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">B / M / En blanco</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">Puntaje</th>
                {canLoad && <th scope="col" className="w-10" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.sheets.map((s) => (
                <tr key={s.studentId}>
                  <td className="px-3 py-2">
                    <span className="block font-medium text-foreground">{s.studentName}</span>
                    <span className="block text-xs text-muted-foreground">
                      {s.studentCode} · {s.levelName.replace('San Marcos · ', '')} · {s.source === 'reader' ? 'lectora' : 'a mano'}
                    </span>
                  </td>
                  <td className="max-w-72 truncate px-3 py-2 font-mono text-xs text-muted-foreground" title={s.answers}>
                    {s.answers}
                  </td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums">
                    <span className="text-success">{s.right}</span> / <span className="text-destructive">{s.wrong}</span> / {s.blank}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums">{formatScore(s.score)}</td>
                  {canLoad && (
                    <td className="px-1">
                      <ConfirmDelete compact title={`Quitar la hoja de ${s.studentName}`} description="Sale del ranking hasta que se cargue de nuevo." isPending={isPending} onConfirm={(): void => remove(s.studentId)} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {data.sheets.length === 0 && <p className="px-6 py-10 text-center text-sm text-muted-foreground">Aún no hay respuestas cargadas.</p>}
          {data.missing.length > 0 && data.sheets.length > 0 && <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">{data.missing.length} alumnos de estas áreas no tienen hoja (no rindieron o faltan cargar).</p>}
        </div>
      )}
    </div>
  );
};
