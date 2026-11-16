'use client';

import { useState, useTransition, type JSX } from 'react';
import { Eye, FilePlus, PenLine, Users } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { PdfViewer } from '@/features/protected/documents/components/pdf-viewer';
import { SignersDialog } from '@/features/protected/documents/components/signers-dialog';
import { cn } from '@/lib/utils';
import { generateCertificateAction } from '../actions/generate-certificate';
import { actStatusClass, actStatusLabels, certificateKindLabels, enrollmentStatusLabels, studySituationLabels } from '../data/people-data';
import { useCertificates } from '../hooks/use-certificates';
import type { CertificateBoard, CertificateInput, StudyRecord } from '../types';

const studyResult = (s: StudyRecord): string =>
  s.status === 'withdrawn' || s.status === 'transferred' ? (enrollmentStatusLabels[s.status] ?? s.status) : s.confirmed && studySituationLabels[s.situation] ? studySituationLabels[s.situation] : 'En curso';

// Constancias of an EBA student (phase E7): the studies they rest on, the ones issued with their signature state,
// and issuing a new one (enrollment, studies or conclusion of a cycle) for the director to sign
export const CertificatesTab = ({ slug, studentId }: { slug: string; studentId: string }): JSX.Element => {
  const { board, preview, busy, sign, view } = useCertificates(slug, studentId);
  const [issuing, setIssuing] = useState(false);
  const [signers, setSigners] = useState(false);
  if (board.error) return <LoadError message={board.error} onRetry={board.reload} />;
  if (!board.data) return <PageSkeleton />;
  const b = board.data;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">Cada constancia lleva un número del año, el encabezado oficial y un código QR para verificarla. Se entrega cuando la firma la dirección.</p>
        {b.canManage && (
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-alt" onClick={(): void => setSigners(true)}>
              <MorphIcon icon={Users} size={16} />
              Firmantes
            </button>
            <button type="button" className="btn-brand" disabled={b.studies.length === 0} onClick={(): void => setIssuing(true)}>
              <MorphIcon icon={FilePlus} size={16} />
              Emitir constancia
            </button>
          </div>
        )}
      </div>

      <section aria-labelledby="studies-title" className="space-y-2">
        <h3 id="studies-title" className="text-sm font-semibold text-foreground">
          Estudios en el CEBA
        </h3>
        {b.studies.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">Aún no tiene matrículas.</p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {b.studies.map((s) => (
              <li key={s.enrollmentId} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <span className="w-48 font-medium text-foreground">{s.periodName}</span>
                <span className="min-w-0 flex-1 text-muted-foreground">
                  {s.gradeName} del {s.levelName}
                  {s.sectionName && ` · sección ${s.sectionName}`}
                </span>
                <span className={cn('pill', s.confirmed && s.situation === 'PRO' ? 'bg-success/12 text-success' : 'bg-secondary text-muted-foreground')}>{studyResult(s)}</span>
                {s.lastGrade && s.confirmed && s.situation === 'PRO' && <span className="pill bg-brand-soft text-brand">Concluyó el ciclo</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="certificates-title" className="space-y-2">
        <h3 id="certificates-title" className="text-sm font-semibold text-foreground">
          Constancias emitidas
        </h3>
        {b.certificates.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">No tiene constancias.</p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {b.certificates.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <span className="w-28 font-semibold text-foreground tabular-nums">{c.code}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-foreground">
                    {certificateKindLabels[c.kind]}
                    {c.periodName && ` · ${c.periodName}`}
                    {c.levelName && ` · ${c.levelName}`}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {c.purpose ? `Para ${c.purpose} · ` : ''}
                    {c.createdName} · {formatDay(c.createdAt.slice(0, 10))}
                  </span>
                </span>
                <span className={cn('pill', actStatusClass[c.versionStatus])}>{actStatusLabels[c.versionStatus] ?? c.versionStatus}</span>
                <span className="flex gap-1">
                  {c.versionStatus === 'pending' && (
                    <button type="button" className="btn-alt h-8 px-3 text-xs" disabled={busy !== null} onClick={(): void => sign(c)}>
                      <MorphIcon icon={PenLine} size={14} />
                      {busy === c.id ? 'Firmando…' : 'Firmar'}
                    </button>
                  )}
                  <button type="button" className="btn-alt h-8 px-3 text-xs" disabled={preview.isPending} onClick={(): void => view(c)} aria-label={`Ver la ${certificateKindLabels[c.kind].toLowerCase()} ${c.code}`}>
                    <MorphIcon icon={Eye} size={14} />
                    Ver
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {issuing && <IssueDialog slug={slug} studentId={studentId} board={b} onClose={(): void => setIssuing(false)} onDone={(): void => (setIssuing(false), board.reload())} />}
      {signers && <SignersDialog slug={slug} kind="certificate" title="Firmantes de las constancias" onClose={(): void => setSigners(false)} onDone={board.reload} />}
      {preview.file && <PdfViewer file={preview.file} onClose={preview.close} />}
    </div>
  );
};

const IssueDialog = ({ slug, studentId, board, onClose, onDone }: { slug: string; studentId: string; board: CertificateBoard; onClose: () => void; onDone: () => void }): JSX.Element => {
  const periods = board.studies.map((s) => ({ value: s.periodId, label: `${s.periodName} · ${s.gradeName} del ${s.levelName}` }));
  const cycles = board.concluded.map((s) => ({ value: s.levelId, label: `${s.levelName} (${s.periodName})` }));
  const [input, setInput] = useState<CertificateInput>({ studentId, kind: 'enrollment', periodId: periods[periods.length - 1]?.value ?? '', levelId: cycles[0]?.value ?? '', purpose: '' });
  const [isPending, start] = useTransition();
  const set = (patch: Partial<CertificateInput>): void => setInput((v) => ({ ...v, ...patch }));
  const missing = (input.kind === 'enrollment' && !input.periodId) || (input.kind === 'cycle' && !input.levelId);
  const submit = (): void =>
    start(async () => {
      const r = await runAcademicAction(generateCertificateAction(slug, { ...input, purpose: input.purpose.trim() }));
      if (r.ok) onDone();
    });
  return (
    <FormDialog title="Emitir constancia" description="Queda numerada y pendiente de la firma de la dirección." submitLabel="Emitir" isPending={isPending} disabled={missing} onSubmit={submit} onClose={onClose}>
      <FormField id="certificate-kind" label="Tipo">
        <SelectField
          id="certificate-kind"
          value={input.kind}
          options={[
            { value: 'enrollment', label: certificateKindLabels.enrollment },
            { value: 'studies', label: certificateKindLabels.studies },
            ...(cycles.length > 0 ? [{ value: 'cycle', label: certificateKindLabels.cycle }] : []),
          ]}
          onChange={(v): void => set({ kind: v as CertificateInput['kind'] })}
        />
      </FormField>
      {input.kind === 'enrollment' && (
        <FormField id="certificate-period" label="Matrícula">
          <SelectField id="certificate-period" value={input.periodId} options={periods} onChange={(v): void => set({ periodId: v })} />
        </FormField>
      )}
      {input.kind === 'cycle' && (
        <FormField id="certificate-cycle" label="Ciclo concluido" hint="Solo los ciclos en los que fue promovido del último grado.">
          <SelectField id="certificate-cycle" value={input.levelId} options={cycles} onChange={(v): void => set({ levelId: v })} />
        </FormField>
      )}
      {input.kind === 'studies' && <p className="text-sm text-muted-foreground">Incluye cada periodo con su grado y su situación final ({board.studies.length}).</p>}
      <FormField id="certificate-purpose" label="Para qué la pide" hint="Opcional. Se imprime: «Se expide … para trámite laboral».">
        <Input id="certificate-purpose" maxLength={160} placeholder="trámite laboral" value={input.purpose} onChange={(e): void => set({ purpose: e.target.value })} />
      </FormField>
    </FormDialog>
  );
};
