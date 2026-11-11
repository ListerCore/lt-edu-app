'use client';

import { useState, useTransition, type JSX } from 'react';
import { ArrowLeft, CheckCheck, Download, FilePlus, Gavel, Info, RotateCcw } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { levelClass, levels } from '@/features/protected/assessment/data/assessment-data';
import { cn } from '@/lib/utils';
import { confirmSectionAction, decideAction, exportResultsAction, getSectionClosingAction, issueRecordAction, saveRecoveryAction } from '../actions/closing-actions';
import { downloadBase64, situationClass, situationLabels } from '../data/closing-data';
import type { ClosingRow, SectionClosing } from '../types';
import { RecordList } from './record-list';

interface Props {
  slug: string;
  sectionId: string;
  onBack: () => void;
  onRecord: (id: string) => void;
}

export const SectionClosingView = ({ slug, sectionId, onBack, onRecord }: Props): JSX.Element => {
  const { data, error, reload } = useAcademicData(`closing-section:${slug}:${sectionId}`, () => getSectionClosingAction(slug, sectionId), () => false);
  const [deciding, setDeciding] = useState<ClosingRow | null>(null);
  const [recovering, setRecovering] = useState<ClosingRow | null>(null);
  const [showLevels, setShowLevels] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  const c = data;
  const confirmed = c.rows.length > 0 && c.rows.every((r) => r.confirmed);
  const pending = c.rows.filter((r) => r.situation === 'PEN').length;
  const inRecovery = c.rows.filter((r) => r.situation === 'RR');
  const recoveredAll = inRecovery.length > 0 && inRecovery.every((r) => r.afterRecovery);
  const counts = c.rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.situation]: (acc[r.situation] ?? 0) + 1 }), {});
  const columns = c.areas.flatMap((a, i) => a.competencies.map((comp, j) => ({ id: comp.id, code: `${i + 1}.${j + 1}`, name: comp.name, area: a.name })));

  const run = (work: () => Promise<{ ok: boolean; message?: string }>, done?: () => void): void =>
    startTransition(async () => {
      const result = await work();
      if (!result.ok) sileo.error({ title: 'No se pudo completar', description: result.message });
      else {
        if (result.message) sileo.success({ title: result.message });
        done?.();
        reload();
      }
    });

  const issue = (kind: 'final' | 'complementary'): void =>
    startTransition(async () => {
      const result = await issueRecordAction(slug, sectionId, '', kind);
      if (!result.ok) {
        sileo.error({ title: 'No se pudo emitir el acta', description: result.message });
        return;
      }
      sileo.success({ title: `Acta ${result.data.code} emitida` });
      onRecord(result.data.id);
    });

  const exportCsv = (): void =>
    startTransition(async () => {
      const result = await exportResultsAction(slug, sectionId, '');
      if (!result.ok) sileo.error({ title: 'No se pudo exportar', description: result.message });
      else downloadBase64(result.data.fileName, result.data.base64);
    });

  return (
    <div className="space-y-5">
      <button type="button" className="btn-alt" onClick={onBack}>
        <MorphIcon icon={ArrowLeft} size={16} />
        Todas las secciones
      </button>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {c.sectionLabel} · {c.levelName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {c.periodName}
            {c.tutorName && ` · Tutor(a): ${c.tutorName}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-alt" disabled={isPending} onClick={exportCsv}>
            <MorphIcon icon={Download} size={16} />
            Exportar para SIAGIE
          </button>
          {c.canManage && !confirmed && (
            <button type="button" className="btn-brand" disabled={isPending || !c.lastTermClosed || pending > 0} title={!c.lastTermClosed ? 'Cierra antes el último periodo' : pending > 0 ? 'Hay niveles pendientes' : undefined} onClick={(): void => run(() => confirmSectionAction(slug, sectionId))}>
              <MorphIcon icon={CheckCheck} size={16} />
              Confirmar resultados
            </button>
          )}
          {c.canManage && confirmed && (
            <button type="button" className="btn-brand" disabled={isPending} onClick={(): void => issue('final')}>
              <MorphIcon icon={FilePlus} size={16} />
              Emitir acta final
            </button>
          )}
          {c.canManage && confirmed && inRecovery.length > 0 && (
            <button type="button" className="btn-alt" disabled={isPending || !recoveredAll} title={recoveredAll ? undefined : 'Registra antes la recuperación de todos'} onClick={(): void => issue('complementary')}>
              <MorphIcon icon={FilePlus} size={16} />
              Emitir acta de recuperación
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-3 rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
        <MorphIcon icon={Info} size={16} className="mt-0.5 shrink-0" />
        <p>
          <span className="font-medium text-foreground">{c.rule}.</span>{' '}
          {c.automatic
            ? 'Todos promueven sin condiciones.'
            : 'Promueve con A o AD en la mitad o más de las competencias de esas áreas y sin C; permanece con C en más de la mitad de las competencias de esas áreas; lo demás va a recuperación pedagógica (RVM N.° 094-2020-MINEDU).'}
          {c.referential && ' En EBE el resultado es referencial: el equipo decide con el plan de cada estudiante (POI).'} Los niveles finales son los del último periodo de evaluación.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex flex-wrap gap-2">
          {['PRO', 'RR', 'PER', 'PEN'].map((k) =>
            counts[k] ? (
              <span key={k} className={cn('pill', situationClass[k])}>
                {counts[k]} {situationLabels[k].toLowerCase()}
              </span>
            ) : null,
          )}
          {confirmed && <span className="pill bg-success/12 text-success">Resultados confirmados</span>}
        </p>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={showLevels} onChange={(e): void => setShowLevels(e.target.checked)} className="size-4 accent-brand" />
          Ver los niveles finales
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th scope="col" className="w-10 px-3 py-3 font-medium whitespace-nowrap">N.°</th>
              <th scope="col" className="min-w-56 px-3 py-3 font-medium">Estudiante</th>
              {showLevels &&
                columns.map((col) => (
                  <th key={col.id} scope="col" title={`${col.area}: ${col.name}`} className="px-1 py-3 text-center text-xs font-medium tabular-nums">
                    {col.code}
                  </th>
                ))}
              <th scope="col" className="px-3 py-3 font-medium">Situación</th>
              <th scope="col" className="min-w-64 px-3 py-3 font-medium">Motivo</th>
              {c.canManage && <th scope="col" className="px-3 py-3 font-medium"><span className="sr-only">Acciones</span></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {c.rows.map((r, n) => (
              <tr key={r.student?.id} className="align-top">
                <td className="px-3 py-2.5 text-muted-foreground tabular-nums">{n + 1}</td>
                <td className="px-3 py-2.5 font-medium text-foreground">{r.student?.name}</td>
                {showLevels &&
                  columns.map((col) => {
                    const l = r.final[col.id] ?? '';
                    const rec = r.recovery[col.id];
                    return (
                      <td key={col.id} className="px-1 py-2.5 text-center">
                        <span className={cn('inline-flex h-6 min-w-7 items-center justify-center rounded px-1 text-[11px] font-semibold', l ? levelClass[l] : 'text-muted-foreground')}>{l || '—'}</span>
                        {rec && <span className={cn('mt-0.5 block text-[10px] font-semibold', levelClass[rec], 'bg-transparent')}>→{rec}</span>}
                      </td>
                    );
                  })}
                <td className="px-3 py-2.5">
                  <span className={cn('pill', situationClass[r.situation])}>{situationLabels[r.situation]}</span>
                  {r.afterRecovery && (
                    <span className={cn('pill mt-1', situationClass[r.afterRecovery])}>Tras recuperación: {situationLabels[r.afterRecovery].toLowerCase()}</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground">
                  {r.decided ? (
                    <>
                      <span className="block text-foreground">Decisión del equipo: {r.decisionNote}</span>
                      <span className="block">
                        Según las reglas: {situationLabels[r.computed]?.toLowerCase()}. Registró {r.decidedName}.
                      </span>
                    </>
                  ) : (
                    r.reason
                  )}
                </td>
                {c.canManage && (
                  <td className="px-3 py-2.5">
                    <span className="flex justify-end gap-1">
                      {r.situation === 'RR' && r.confirmed && (
                        <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setRecovering(r)}>
                          <MorphIcon icon={RotateCcw} size={14} />
                          Recuperación
                        </button>
                      )}
                      {!c.automatic && (
                        <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setDeciding(r)}>
                          <MorphIcon icon={Gavel} size={14} />
                          Equipo
                        </button>
                      )}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {c.records.length > 0 && (
        <section aria-label="Actas de la sección" className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Actas de la sección</h3>
          <RecordList records={c.records} onOpen={onRecord} />
        </section>
      )}

      {deciding && <DecisionDialog row={deciding} onClose={(): void => setDeciding(null)} onSave={(situation, note): void => run(() => decideAction(slug, sectionId, deciding.student?.id ?? '', situation, note), () => setDeciding(null))} isPending={isPending} />}
      {recovering && (
        <RecoveryDialog
          closing={c}
          row={recovering}
          isPending={isPending}
          onClose={(): void => setRecovering(null)}
          onSave={(levels): void => run(() => saveRecoveryAction(slug, sectionId, recovering.student?.id ?? '', levels), () => setRecovering(null))}
        />
      )}
    </div>
  );
};

const DecisionDialog = ({ row, isPending, onClose, onSave }: { row: ClosingRow; isPending: boolean; onClose: () => void; onSave: (situation: string, note: string) => void }): JSX.Element => {
  const [situation, setSituation] = useState(row.decided);
  const [note, setNote] = useState(row.decisionNote);
  const missing = situation !== '' && !note.trim();
  return (
    <FormDialog
      title={`Decisión del equipo · ${row.student?.name}`}
      description={`Según las reglas: ${situationLabels[row.computed]?.toLowerCase()}. ${row.reason}`}
      submitLabel={situation ? 'Registrar decisión' : 'Volver a las reglas'}
      isPending={isPending}
      disabled={missing}
      onSubmit={(): void => onSave(situation, note.trim())}
      onClose={onClose}
    >
      <FormField id="decision-situation" label="Situación final">
        <SelectField
          id="decision-situation"
          value={situation}
          options={[
            { value: '', label: 'La que dan las reglas' },
            { value: 'PRO', label: 'Promovido' },
            { value: 'RR', label: 'Recuperación pedagógica' },
            { value: 'PER', label: 'Permanece en el grado' },
          ]}
          onChange={setSituation}
        />
      </FormField>
      {situation && (
        <FormField id="decision-note" label="Motivo" required error={missing ? 'El equipo de evaluación registra por qué decide distinto.' : undefined} hint="Queda en el acta junto al estudiante.">
          <Textarea id="decision-note" value={note} rows={4} maxLength={500} onChange={(e): void => setNote(e.target.value)} />
        </FormField>
      )}
    </FormDialog>
  );
};

const RecoveryDialog = ({ closing, row, isPending, onClose, onSave }: { closing: SectionClosing; row: ClosingRow; isPending: boolean; onClose: () => void; onSave: (levels: Record<string, string>) => void }): JSX.Element => {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(row.targets.map((t) => [t, row.recovery[t] ?? ''])));
  const names = new Map(closing.areas.flatMap((a) => a.competencies.map((comp) => [comp.id, { area: a.name, name: comp.name }] as const)));
  return (
    <FormDialog title={`Recuperación · ${row.student?.name}`} description="El nivel que alcanzó en cada competencia evaluada en la recuperación (enero y febrero)." submitLabel="Guardar" isPending={isPending} onSubmit={(): void => onSave(values)} onClose={onClose} wide>
      <ul className="divide-y divide-border rounded-xl border border-border">
        {row.targets.map((t) => {
          const info = names.get(t);
          return (
            <li key={t} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <span className="min-w-0 flex-1 text-sm">
                <span className="block text-xs text-muted-foreground">{info?.area}</span>
                <span className="text-foreground">{info?.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">fin de año: {row.final[t] || '—'}</span>
              </span>
              <span role="radiogroup" aria-label={info?.name} className="flex gap-1">
                {levels.map((l) => (
                  <button
                    key={l}
                    type="button"
                    role="radio"
                    aria-checked={values[t] === l}
                    onClick={(): void => setValues((v) => ({ ...v, [t]: l }))}
                    className={cn('h-8 min-w-10 rounded-md border text-sm font-semibold transition-colors', values[t] === l ? cn(levelClass[l], 'border-transparent ring-2 ring-brand/40') : 'border-border text-muted-foreground hover:text-foreground')}
                  >
                    {l}
                  </button>
                ))}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted-foreground">Con todas registradas, la situación definitiva se calcula sola: promueve si ahora cumple las condiciones; si no, permanece.</p>
    </FormDialog>
  );
};
