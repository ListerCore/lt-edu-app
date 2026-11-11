'use client';

import { useState, useTransition, type JSX } from 'react';
import { ArrowLeft, CheckCheck, Download, FilePlus } from 'lucide';
import { sileo } from 'sileo';
import { MorphIcon } from '@/components/ui/morph-icon';
import { LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { formatAverage } from '@/features/protected/assessment/data/assessment-data';
import { cn } from '@/lib/utils';
import { confirmUnitAction, exportResultsAction, getUnitClosingAction, issueRecordAction, saveUnitRecoveryAction } from '../actions/closing-actions';
import { downloadBase64, unitClass, unitLabels } from '../data/closing-data';
import { RecordList } from './record-list';

interface Props {
  slug: string;
  assignmentId: string;
  onBack: () => void;
  onRecord: (id: string) => void;
}

const two = (v?: number): string => (v === undefined ? '—' : String(v).padStart(2, '0'));

// The result of one unit: average of its evaluations, absences, recovery and the acta signed by its teacher
export const UnitClosingView = ({ slug, assignmentId, onBack, onRecord }: Props): JSX.Element => {
  const { data, error, reload } = useAcademicData(`closing-unit:${slug}:${assignmentId}`, () => getUnitClosingAction(slug, assignmentId), () => false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  const u = data;
  const confirmed = u.rows.length > 0 && u.rows.every((r) => r.confirmed);
  const missing = u.rows.reduce((n, r) => n + r.missing, 0);

  const act = (work: () => Promise<{ ok: boolean; message?: string }>, after?: () => void): void =>
    startTransition(async () => {
      const result = await work();
      if (!result.ok) sileo.error({ title: 'No se pudo completar', description: result.message });
      else {
        if (result.message) sileo.success({ title: result.message });
        after?.();
        reload();
      }
    });

  const saveRecovery = (studentId: string): void => {
    const t = drafts[studentId] ?? '';
    if (t !== '' && !(/^\d{1,2}$/.test(t) && Number(t) <= 20)) {
      sileo.error({ title: 'La nota va de 0 a 20' });
      return;
    }
    act(
      () => saveUnitRecoveryAction(slug, assignmentId, studentId, t === '' ? null : Number(t)),
      () => setDrafts((d) => {
        const rest = { ...d };
        delete rest[studentId];
        return rest;
      }),
    );
  };

  const issue = (): void =>
    startTransition(async () => {
      const result = await issueRecordAction(slug, '', assignmentId, 'unit');
      if (!result.ok) sileo.error({ title: 'No se pudo emitir el acta', description: result.message });
      else {
        sileo.success({ title: `Acta ${result.data.code} emitida` });
        onRecord(result.data.id);
      }
    });

  const exportCsv = (): void =>
    startTransition(async () => {
      const result = await exportResultsAction(slug, '', assignmentId);
      if (!result.ok) sileo.error({ title: 'No se pudo exportar', description: result.message });
      else downloadBase64(result.data.fileName, result.data.base64);
    });

  return (
    <div className="space-y-5">
      <button type="button" className="btn-alt" onClick={onBack}>
        <MorphIcon icon={ArrowLeft} size={16} />
        Todas las unidades
      </button>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{u.subjectName}</h2>
          <p className="text-sm text-muted-foreground">
            {u.sectionLabel} · {u.levelName} · {u.periodName} · {u.staffName || 'Sin docente'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-alt" disabled={isPending} onClick={exportCsv}>
            <MorphIcon icon={Download} size={16} />
            Exportar notas
          </button>
          {u.canManage && (
            <button type="button" className={confirmed ? 'btn-alt' : 'btn-brand'} disabled={isPending} onClick={(): void => act(() => confirmUnitAction(slug, assignmentId))}>
              <MorphIcon icon={CheckCheck} size={16} />
              {confirmed ? 'Volver a confirmar' : 'Confirmar resultados'}
            </button>
          )}
          {u.canManage && confirmed && (
            <button type="button" className="btn-brand" disabled={isPending} onClick={issue}>
              <MorphIcon icon={FilePlus} size={16} />
              Emitir acta
            </button>
          )}
        </div>
      </div>
      <p className="rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
        Aprueba con {u.passingGrade}; con {u.absenceLimit} % o más de faltas a sus clases queda inhabilitado. Quien desaprueba puede rendir la recuperación y se queda con la nota más alta.
        {missing > 0 && <span className="text-warning"> Hay {missing} notas sin registrar: no cuentan en el promedio.</span>}
      </p>
      <div className="overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th scope="col" className="w-10 px-3 py-3 font-medium whitespace-nowrap">N.°</th>
              <th scope="col" className="min-w-52 px-3 py-3 font-medium">Estudiante</th>
              {u.evaluations.map((e) => (
                <th key={e.id} scope="col" className="px-2 py-3 text-center text-xs font-medium" title={`${e.name} · peso ${e.weight}`}>
                  {e.name}
                </th>
              ))}
              <th scope="col" className="px-2 py-3 text-center font-medium">Promedio</th>
              <th scope="col" className="px-2 py-3 text-center font-medium">Faltas</th>
              <th scope="col" className="px-2 py-3 text-center font-medium">Recuperación</th>
              <th scope="col" className="px-2 py-3 text-center font-medium">Final</th>
              <th scope="col" className="px-3 py-3 font-medium">Situación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {u.rows.map((r, n) => {
              const id = r.student?.id ?? '';
              const canRecover = u.canManage && r.confirmed && (r.status === 'recovery' || r.recoveryScore !== undefined) && r.status !== 'barred';
              const value = drafts[id] ?? (r.recoveryScore === undefined ? '' : String(r.recoveryScore));
              return (
                <tr key={id}>
                  <td className="px-3 py-2 text-muted-foreground tabular-nums">{n + 1}</td>
                  <td className="px-3 py-2 font-medium text-foreground">{r.student?.name}</td>
                  {u.evaluations.map((e) => (
                    <td key={e.id} className="px-2 py-2 text-center tabular-nums">
                      {two(r.scores[e.id])}
                    </td>
                  ))}
                  <td className="px-2 py-2 text-center tabular-nums">
                    <span className={cn('font-semibold', r.grade !== undefined && r.grade < u.passingGrade ? 'text-destructive' : 'text-foreground')}>{two(r.grade)}</span>
                    <span className="block text-[11px] text-muted-foreground">{formatAverage(r.average)}</span>
                  </td>
                  <td className={cn('px-2 py-2 text-center tabular-nums', r.absentPercent >= u.absenceLimit ? 'font-semibold text-destructive' : 'text-muted-foreground')}>{Math.round(r.absentPercent)} %</td>
                  <td className="px-2 py-2 text-center">
                    {canRecover ? (
                      <span className="inline-flex items-center gap-1">
                        <input placeholder="–"
                          aria-label={`Recuperación de ${r.student?.name}`}
                          inputMode="numeric"
                          maxLength={2}
                          value={value}
                          onChange={(e): void => setDrafts((d) => ({ ...d, [id]: e.target.value.replace(/\D/g, '') }))}
                          className="placeholder:text-muted-foreground/60 h-8 w-12 rounded-md border border-border bg-background text-center tabular-nums"
                        />
                        {id in drafts && (
                          <button type="button" className="btn-brand h-8 px-2 text-xs" disabled={isPending} onClick={(): void => saveRecovery(id)}>
                            OK
                          </button>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground tabular-nums">{two(r.recoveryScore)}</span>
                    )}
                  </td>
                  <td className="px-2 py-2 text-center font-semibold tabular-nums">{two(r.finalGrade)}</td>
                  <td className="px-3 py-2">
                    <span className={cn('pill', unitClass[r.status])}>{unitLabels[r.status]}</span>
                    {!r.confirmed && <span className="block text-[11px] text-muted-foreground">Vista previa</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {u.records.length > 0 && (
        <section aria-label="Actas de la unidad" className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Actas de la unidad</h3>
          <RecordList records={u.records} onOpen={onRecord} />
        </section>
      )}
    </div>
  );
};
