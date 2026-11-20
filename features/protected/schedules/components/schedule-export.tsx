'use client';

import { useMemo, useState, useTransition, type JSX } from 'react';
import { Check, Eye, FileSpreadsheet, FileStack, History, PenLine, QrCode, Users } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { LoadError, SelectField, StatusPill } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { generateSchedulesAction, scheduleIssuesAction, schedulesPdfAction, schedulesXlsxAction, signVersionAction, versionPdfAction } from '@/features/protected/documents/actions/document-actions';
import { PdfViewer } from '@/features/protected/documents/components/pdf-viewer';
import { SignersDialog } from '@/features/protected/documents/components/signers-dialog';
import { usePdf, usePdfPreview } from '@/features/protected/documents/lib/use-pdf';
import type { DocumentVersion, IssuedDocument, ListScheduleIssuesResponse, Signer } from '@/lib/api/grpc/gen/ltedu/documents/v1/documents';
import { cn } from '@/lib/utils';
import { gradesOf, sectionName, teachersOf } from '../data/schedule-export';
import type { PlannerData } from '../types';
import { EmptyNote } from './week-grid';

type Mode = 'section' | 'grade' | 'teacher' | 'general';

const modes: Array<[Mode, string]> = [
  ['section', 'Por sección'],
  ['grade', 'Por grado'],
  ['teacher', 'Por docente'],
  ['general', 'General'],
];

const modeNames: Record<string, string> = { section: 'por sección', grade: 'por grado', teacher: 'por docente', general: 'general' };

export const versionLabels: Record<string, string> = { pending: 'Pendiente de firma', published: 'Vigente', superseded: 'Reemplazada', cancelled: 'Anulada' };
export const versionClass: Record<string, string> = {
  pending: 'bg-warning/12 text-warning',
  published: 'bg-success/12 text-success',
  superseded: 'bg-secondary text-muted-foreground',
  cancelled: 'bg-secondary text-muted-foreground line-through',
};

const eventLabels: Record<string, string> = { generated: 'Generada', signed: 'Firmada', published: 'Publicada', superseded: 'Reemplazada', cancelled: 'Anulada', signers: 'Firmantes actualizados' };

// Most signatures a document can ask for (the API's limit)

// "11 nov. 2026, 17:11" in Lima
export const when = (iso: string): string => (iso ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Lima' }).format(new Date(iso)) : '');

// Publicar: the timetables as PDF (preview in a dialog, crossed and without codes), the whole period as Excel and the
// versioned publications. Dirección or coordinación generate a version; the signers sign it and with the last
// signature it becomes the current one. Every sheet carries a QR to its public tracking page
export const ScheduleExport = ({ slug, data, manage }: { slug: string; data: PlannerData; manage: boolean }): JSX.Element => {
  const [mode, setMode] = useState<Mode>('section');
  const [target, setTarget] = useState('');
  // Only sections with classes placed are published (inicial plans, for one, carry no hours)
  const sections = useMemo(() => data.sections.filter((s) => data.entries.some((e) => e.sectionId === s.id)), [data]);
  const grades = useMemo(() => gradesOf(sections), [sections]);
  const teachers = useMemo(() => teachersOf(data), [data]);
  const options = mode === 'section' ? sections.map((s) => ({ value: s.id, label: sectionName(s, true) })) : mode === 'grade' ? grades.map((g) => ({ value: g.id, label: `${g.name} · ${g.levelName}` })) : mode === 'teacher' ? teachers.map((t) => ({ value: t.id, label: t.name })) : [];
  const all = mode === 'section' ? 'Todas las secciones' : mode === 'grade' ? 'Todos los grados' : 'Todos los docentes';
  const targetLabel = mode === 'general' ? 'Horario general' : (options.find((o) => o.value === target)?.label ?? all);
  const issues = useAcademicData(`schedule-issues:${slug}:${data.period.id}`, () => scheduleIssuesAction(slug, data.period.id));
  const viewer = usePdfPreview();
  const [xlsxPending, download] = usePdf();
  const [dialog, setDialog] = useState<'generate' | 'signers' | null>(null);

  if (data.entries.length === 0) return <EmptyNote>Todavía no hay clases ubicadas en este periodo.</EmptyNote>;
  // Both the session's role (API) and the role in use must allow generating and choosing signers
  const canManage = manage && (issues.data?.canManage ?? false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div role="radiogroup" aria-label="Qué publicar" className="inline-flex rounded-lg bg-secondary p-0.5">
          {modes.map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={mode === k}
              onClick={(): void => {
                setMode(k);
                setTarget('');
              }}
              className={cn('h-8 rounded-md px-3 text-sm font-medium', mode === k ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
            >
              {label}
            </button>
          ))}
        </div>
        {mode !== 'general' && (
          <div className="w-72">
            <SelectField id="export-target" value={target} options={[{ value: '', label: all }, ...options]} onChange={setTarget} />
          </div>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          <button type="button" className="btn-alt" disabled={xlsxPending} onClick={(): void => download(() => schedulesXlsxAction(slug, data.period.id))}>
            <MorphIcon icon={FileSpreadsheet} size={16} />
            {xlsxPending ? 'Generando Excel…' : 'Excel'}
          </button>
          <button type="button" className="btn-alt" disabled={viewer.isPending} onClick={(): void => viewer.open(`Vista previa · ${targetLabel}`, () => schedulesPdfAction(slug, data.period.id, mode, mode === 'general' ? '' : target))}>
            <MorphIcon icon={Eye} size={16} />
            {viewer.isPending ? 'Abriendo…' : 'Vista previa'}
          </button>
          {canManage && (
            <button type="button" className="btn-brand" onClick={(): void => setDialog('generate')}>
              <MorphIcon icon={FileStack} size={16} />
              Generar versión
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">Hoja A4 horizontal por {mode === 'general' ? 'turno (cada día con una columna por sección)' : mode === 'grade' ? 'grado' : mode === 'teacher' ? 'docente (cada día con curso y sección)' : 'sección'}, con la leyenda abajo y el espacio para las firmas y el QR. La vista previa no tiene validez: la publicación sale de una versión firmada.</p>

      {issues.error ? <LoadError message={issues.error} onRetry={issues.reload} /> : issues.data ? <Publications slug={slug} data={{ ...issues.data, canManage }} onView={viewer.open} onSigners={(): void => setDialog('signers')} onChange={issues.reload} /> : <div className="h-32 animate-pulse rounded-xl bg-card" />}

      {dialog === 'generate' && <GenerateDialog slug={slug} query={{ periodId: data.period.id, mode, targetId: mode === 'general' ? '' : target }} label={`${targetLabel} (${modeNames[mode]})`} signers={issues.data?.signers ?? []} onClose={(): void => setDialog(null)} onSigners={(): void => setDialog('signers')} onDone={issues.reload} />}
      {dialog === 'signers' && <SignersDialog slug={slug} kind="schedules" title="Firmantes de los horarios" onClose={(): void => setDialog(null)} onDone={issues.reload} />}
      <PdfViewer file={viewer.file} onClose={viewer.close} />
    </div>
  );
};

// The chain of signers, in order
const SignerChain = ({ signers }: { signers: Signer[] }): JSX.Element =>
  signers.length === 0 ? (
    <span className="text-warning">Nadie asignado todavía</span>
  ) : (
    <span>
      {signers.map((s, i) => (
        <span key={s.staffId}>
          {i > 0 && <span className="px-1.5 text-muted-foreground">→</span>}
          <b className="font-medium text-foreground">{s.name}</b> <span className="text-muted-foreground">({s.position})</span>
        </span>
      ))}
    </span>
  );

// The period's publications: the signers, what waits for the viewer's signature and every document with its versions
const Publications = ({ slug, data, onView, onSigners, onChange }: { slug: string; data: ListScheduleIssuesResponse; onView: (title: string, load: () => ReturnType<typeof versionPdfAction>) => void; onSigners: () => void; onChange: () => void }): JSX.Element => {
  const mine = data.documents.flatMap((d) => d.versions.filter((v) => v.status === 'pending' && data.myStaffId && v.signatures.some((s) => s.staffId === data.myStaffId && !s.signedAt)).map((v) => ({ d, v })));
  return (
    <section aria-labelledby="pub-title" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="pub-title" className="text-base font-semibold">
          Publicaciones y versiones
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <MorphIcon icon={Users} size={16} />
          <span>Firman:</span>
          <SignerChain signers={data.signers} />
          {data.canManage && (
            <button type="button" className="btn-alt h-8 px-2.5 text-xs" onClick={onSigners}>
              Firmantes
            </button>
          )}
        </div>
      </div>
      {mine.length > 0 && (
        <div className="space-y-2 rounded-xl bg-warning/10 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-warning">
            <MorphIcon icon={PenLine} size={16} />
            {mine.length === 1 ? 'Un documento espera tu firma' : `${mine.length} documentos esperan tu firma`}
          </p>
          {mine.map(({ d, v }) => (
            <div key={v.id} className="flex flex-wrap items-center gap-3 text-sm">
              <span className="min-w-0 flex-1">
                {d.title} · versión {v.number}
              </span>
              <button type="button" className="btn-alt h-8 px-2.5 text-xs" onClick={(): void => onView(`${d.title} · versión ${v.number}`, () => versionPdfAction(slug, v.id))}>
                Revisar
              </button>
              <SignButton slug={slug} version={v} onDone={onChange} />
            </div>
          ))}
        </div>
      )}
      {data.documents.length === 0 ? (
        <EmptyNote>Aún no se generó ninguna versión en este periodo. {data.canManage ? 'Elige qué publicar y usa «Generar versión».' : 'Dirección o coordinación la generan.'}</EmptyNote>
      ) : (
        <ul className="space-y-3">
          {data.documents.map((d) => (
            <DocumentCard key={d.id} slug={slug} doc={d} myStaffId={data.myStaffId} onView={onView} onChange={onChange} />
          ))}
        </ul>
      )}
    </section>
  );
};

// Signs a pending version as the viewer; the version is published with the last signature
const SignButton = ({ slug, version, onDone }: { slug: string; version: DocumentVersion; onDone: () => void }): JSX.Element => {
  const [isPending, start] = useTransition();
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <button type="button" className="btn-brand h-8 px-2.5 text-xs" disabled={isPending} onClick={(): void => setConfirm(true)}>
        <MorphIcon icon={PenLine} size={14} />
        Firmar
      </button>
      {confirm && (
        <FormDialog
          title={`Firmar la versión ${version.number}`}
          description="Tu firma queda registrada con la fecha, la hora y un código de verificación. Por ahora es una firma simulada; luego se reemplazará por la firma digital oficial."
          submitLabel="Firmar"
          isPending={isPending}
          onClose={(): void => setConfirm(false)}
          onSubmit={(): void =>
            start(async () => {
              const r = await signVersionAction(slug, version.id);
              if (!r.ok) {
                sileo.error({ title: 'No se pudo firmar', description: r.message });
                return;
              }
              sileo.success({ title: r.data.published ? 'Firmado y publicado' : 'Firmado', description: r.data.published ? 'Es la versión vigente desde ahora.' : 'Falta la firma de los demás firmantes.' });
              setConfirm(false);
              onDone();
            })
          }
        >
          <p className="text-sm text-muted-foreground">Revisa el PDF antes de firmar: el contenido de esta versión ya no cambia.</p>
        </FormDialog>
      )}
    </>
  );
};

// One publication: its tracking code, the current version and the list of versions with signatures and history
const DocumentCard = ({ slug, doc, myStaffId, onView, onChange }: { slug: string; doc: IssuedDocument; myStaffId: string; onView: (title: string, load: () => ReturnType<typeof versionPdfAction>) => void; onChange: () => void }): JSX.Element => {
  const [history, setHistory] = useState(false);
  const [isPending, download] = usePdf();
  const current = doc.versions.find((v) => v.status === 'published');
  return (
    <li className="rounded-xl bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{doc.title}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
            <MorphIcon icon={QrCode} size={13} />
            Seguimiento:{' '}
            <a href={doc.trackingUrl} target="_blank" rel="noopener" className="font-mono text-foreground underline-offset-2 hover:underline">
              {doc.trackingCode}
            </a>
            {current ? <span>· vigente: versión {current.number}</span> : <span>· sin versión vigente</span>}
          </p>
        </div>
        <button type="button" className="btn-alt h-8 px-2.5 text-xs" aria-expanded={history} onClick={(): void => setHistory((h) => !h)}>
          <MorphIcon icon={History} size={14} />
          Historial
        </button>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="py-1.5 pr-3 font-medium">
                Versión
              </th>
              <th scope="col" className="py-1.5 pr-3 font-medium">
                Estado
              </th>
              <th scope="col" className="py-1.5 pr-3 font-medium">
                Código
              </th>
              <th scope="col" className="py-1.5 pr-3 font-medium">
                Firmas
              </th>
              <th scope="col" className="py-1.5 font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {doc.versions.map((v) => {
              const mineToSign = Boolean(myStaffId) && v.status === 'pending' && v.signatures.some((s) => s.staffId === myStaffId && !s.signedAt);
              return (
                <tr key={v.id} className="border-t border-border/60 align-top">
                  <td className="py-2 pr-3">
                    <p className="font-medium">v{v.number}</p>
                    <p className="text-xs text-muted-foreground">{when(v.createdAt)}</p>
                    {v.note && <p className="max-w-56 text-xs text-muted-foreground">«{v.note}»</p>}
                  </td>
                  <td className="py-2 pr-3">
                    <StatusPill className={versionClass[v.status]}>{versionLabels[v.status] ?? v.status}</StatusPill>
                  </td>
                  <td className="py-2 pr-3 font-mono text-xs">{v.verificationCode}</td>
                  <td className="py-2 pr-3">
                    <ul className="space-y-0.5 text-xs">
                      {v.signatures.map((s) => (
                        <li key={s.sort} className={cn('flex items-center gap-1.5', s.signedAt ? 'text-foreground' : 'text-muted-foreground')}>
                          {s.signedAt ? <MorphIcon icon={Check} size={13} className="text-success" /> : <span className="inline-block size-[13px] rounded-full ring-1 ring-current" aria-hidden />}
                          <span>
                            {s.name} <span className="text-muted-foreground">· {s.position}</span>
                            {s.signedAt && <span className="text-muted-foreground"> · {when(s.signedAt)}</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" className="btn-alt h-8 px-2.5 text-xs" onClick={(): void => onView(`${doc.title} · versión ${v.number}`, () => versionPdfAction(slug, v.id))}>
                        <MorphIcon icon={Eye} size={14} />
                        Ver
                      </button>
                      <button type="button" className="btn-alt h-8 px-2.5 text-xs" disabled={isPending} onClick={(): void => download(() => versionPdfAction(slug, v.id))} aria-label={`Descargar la versión ${v.number}`}>
                        PDF
                      </button>
                      {mineToSign && <SignButton slug={slug} version={v} onDone={onChange} />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {history && (
        <ol className="mt-3 space-y-1 border-t border-border/60 pt-3 text-xs">
          {doc.events
            .slice()
            .reverse()
            .map((e, i) => (
              <li key={`${e.at}-${i}`} className="flex flex-wrap gap-x-2">
                <span className="w-36 shrink-0 text-muted-foreground">{when(e.at)}</span>
                <span className="font-medium">
                  v{e.version} · {eventLabels[e.action] ?? e.action}
                </span>
                {e.actor && <span className="text-muted-foreground">por {e.actor}</span>}
                {e.note && <span className="text-muted-foreground">— {e.note}</span>}
              </li>
            ))}
        </ol>
      )}
    </li>
  );
};

// Generates a version of what is chosen: a note on what changed, and the signers it will need
const GenerateDialog = ({ slug, query, label, signers, onClose, onSigners, onDone }: { slug: string; query: { periodId: string; mode: string; targetId: string }; label: string; signers: Signer[]; onClose: () => void; onSigners: () => void; onDone: () => void }): JSX.Element => {
  const [note, setNote] = useState('');
  const [isPending, start] = useTransition();
  return (
    <FormDialog
      title="Generar versión"
      description={`Congela ${label} tal como está ahora, con su código de verificación y su QR. Queda pendiente hasta que firmen todos; con la última firma pasa a ser la versión vigente.`}
      submitLabel="Generar versión"
      isPending={isPending}
      disabled={signers.length === 0}
      onClose={onClose}
      onSubmit={(): void =>
        start(async () => {
          const r = await generateSchedulesAction(slug, { ...query, note });
          if (!r.ok) {
            sileo.error({ title: 'No se pudo generar', description: r.message });
            return;
          }
          const v = r.data.version;
          sileo.success(r.data.created ? { title: `Versión ${v?.number} generada`, description: `Código ${v?.verificationCode}. Espera las firmas.` } : { title: 'Sin cambios', description: `El contenido es igual a la versión ${v?.number}; no se generó otra.` });
          onDone();
          onClose();
        })
      }
    >
      <FormField id="gen-note" label="Qué cambió" hint="Queda en el historial. Opcional.">
        <Textarea id="gen-note" value={note} maxLength={300} placeholder="Ej.: cambio de docente en Matemática de 3.° B" onChange={(e): void => setNote(e.target.value)} />
      </FormField>
      <div className="space-y-1.5 text-sm">
        <p className="font-medium">Firmarán, en este orden</p>
        {signers.length === 0 ? (
          <p className="text-warning">
            Primero indica quién firma.{' '}
            <button type="button" className="underline underline-offset-2" onClick={onSigners}>
              Asignar firmantes
            </button>
          </p>
        ) : (
          <ol className="list-decimal space-y-0.5 pl-5 text-muted-foreground">
            {signers.map((s) => (
              <li key={s.staffId}>
                <span className="text-foreground">{s.name}</span> · {s.position}
              </li>
            ))}
          </ol>
        )}
      </div>
    </FormDialog>
  );
};
