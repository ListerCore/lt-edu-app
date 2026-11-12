'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';
import { ArrowLeft, Ban, CalendarSync, CircleCheckBig, ExternalLink, Eye, LoaderCircle, Megaphone, Pencil, TriangleAlert } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { AttachmentsPanel } from '@/features/protected/attachments/components/attachments-panel';
import { cn } from '@/lib/utils';
import { APAFA_PATH, meetingCategories } from '../data/apafa-data';
import { useConveneMeeting } from '../hooks/use-convene-meeting';
import { useDeleteMeeting } from '../hooks/use-delete-meeting';
import { useGetMeeting } from '../hooks/use-get-meeting';
import type { MeetingDetailPageProps } from '../types';
import { ApafaMeetingDialog } from './apafa-meeting-dialog';
import { ApafaCancelDialog, ApafaMinutesDialog, ApafaRescheduleDialog } from './apafa-status-dialogs';

type DialogKind = 'edit' | 'reschedule' | 'cancel' | 'minutes' | null;

// One APAFA meeting: when and where, the agenda, its status, the acta once held and its documents. Managers convene,
// edit, reschedule, cancel and record the acta from here; everyone else reads
export const ApafaMeetingDetailPage = ({ id }: MeetingDetailPageProps): JSX.Element => {
  const { meeting: m, canManage, error, reload } = useGetMeeting(id);
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogKind>(null);
  const close = (): void => setDialog(null);
  const done = (): void => {
    setDialog(null);
    reload();
  };
  const convene = useConveneMeeting({ meetingId: id, onDone: reload });
  const remove = useDeleteMeeting({ meetingId: id, onDeleted: (): void => router.push(APAFA_PATH) });

  const back = (
    <Link href={APAFA_PATH} className="btn-alt mb-6">
      <MorphIcon icon={ArrowLeft} size={16} />
      Todas las reuniones
    </Link>
  );

  if (error)
    return (
      <AcademicPage titleId="meeting-title" title="Reunión de la APAFA" description="" context={null} back={back}>
        <LoadError message={error} onRetry={reload} />
      </AcademicPage>
    );
  if (!m)
    return (
      <AcademicPage titleId="meeting-title" title="Reunión de la APAFA" description="" context={null} back={back}>
        <PageSkeleton />
      </AcademicPage>
    );

  const manageOpen = canManage && m.isOpen;
  return (
    <AcademicPage
      titleId="meeting-title"
      title={m.title}
      description={`${m.kindLabel} · ${m.audienceLabel}`}
      back={back}
      context={canManage ? { canManage: true } : null}
      actions={
        <>
          {m.isDraft && (
            <button type="button" className="btn-brand" onClick={convene.run} disabled={convene.isPending || m.isDue}>
              <MorphIcon icon={convene.isPending ? LoaderCircle : Megaphone} size={16} className={convene.isPending ? 'animate-spin' : ''} />
              Convocar y notificar
            </button>
          )}
          {m.status !== 'cancelled' && (m.isDue || m.status === 'held') && (
            <button type="button" className={m.status === 'held' ? 'btn-alt' : 'btn-brand'} onClick={(): void => setDialog('minutes')}>
              <MorphIcon icon={m.status === 'held' ? Pencil : CircleCheckBig} size={16} />
              {m.status === 'held' ? 'Editar acta' : 'Marcar realizada'}
            </button>
          )}
          {manageOpen && (
            <>
              <button type="button" className="btn-alt" onClick={(): void => setDialog('edit')}>
                <MorphIcon icon={Pencil} size={16} />
                Editar
              </button>
              <button type="button" className="btn-alt" onClick={(): void => setDialog('reschedule')}>
                <MorphIcon icon={CalendarSync} size={16} />
                Reprogramar
              </button>
              <button type="button" className="btn-alt text-destructive" onClick={(): void => setDialog('cancel')}>
                <MorphIcon icon={Ban} size={16} />
                Cancelar
              </button>
            </>
          )}
          {m.isDraft && m.files === 0 && <ConfirmDelete title="Eliminar el borrador" description="La reunión no se convocó: se borra sin avisar a nadie." isPending={remove.isPending} onConfirm={remove.run} />}
        </>
      }
    >
      <div className="space-y-6">
        {!canManage && (
          <p className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
            <MorphIcon icon={Eye} size={16} />
            Solo lectura: dirección y secretaría convocan las reuniones y registran las actas.
          </p>
        )}
        {canManage && m.isDraft && (
          <p role="status" className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm text-foreground">
            <MorphIcon icon={Eye} size={16} className="text-muted-foreground" />
            Borrador: las familias no ven esta reunión hasta que la convoques.
          </p>
        )}
        {canManage && m.isDue && (
          <p role="status" className="flex items-center gap-2 rounded-lg bg-warning/10 px-4 py-3 text-sm text-foreground">
            <MorphIcon icon={TriangleAlert} size={16} className="text-warning" />
            La fecha ya pasó: márcala como realizada con su acta, o reprográmala.
          </p>
        )}
        {m.status === 'cancelled' && (
          <p className="rounded-lg bg-destructive/8 px-4 py-3 text-sm text-destructive">
            <span className="font-semibold">Cancelada.</span> {m.cancelReason}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-2xl border border-border bg-background p-5 text-sm">
              <dt className="text-muted-foreground">Estado</dt>
              <dd>
                <span className={cn('pill', m.statusClass)}>{m.statusLabel}</span>
                {m.notifiedLabel && <span className="ml-2 text-xs text-muted-foreground">Convocada el {m.notifiedLabel}</span>}
              </dd>
              <dt className="text-muted-foreground">Fecha</dt>
              <dd className="text-foreground">
                <span className="font-medium">{m.whenLabel}</span>, {m.timeLabel}
                {m.previousLabel && (
                  <span className="block text-xs text-muted-foreground">
                    Antes: {m.previousLabel}
                    {m.rescheduleReason && ` · ${m.rescheduleReason}`}
                  </span>
                )}
              </dd>
              <dt className="text-muted-foreground">Modalidad</dt>
              <dd className="text-foreground">{m.modalityLabel}</dd>
              {m.place && (
                <>
                  <dt className="text-muted-foreground">Lugar</dt>
                  <dd className="text-foreground">{m.place}</dd>
                </>
              )}
              {m.meetingUrl && (
                <>
                  <dt className="text-muted-foreground">Enlace</dt>
                  <dd>
                    <a href={m.meetingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium break-all text-brand hover:underline">
                      {m.meetingUrl}
                      <MorphIcon icon={ExternalLink} size={13} />
                    </a>
                  </dd>
                </>
              )}
              <dt className="text-muted-foreground">Convocados</dt>
              <dd className="text-foreground">{m.audienceLabel}</dd>
            </dl>

            <section aria-labelledby="meeting-agenda" className="rounded-2xl border border-border bg-background p-5">
              <h2 id="meeting-agenda" className="text-base font-semibold text-foreground">
                Agenda
              </h2>
              {m.agenda.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">Sin agenda escrita. Revisa los documentos adjuntos.</p>
              ) : (
                <ol className="mt-3 space-y-1.5 text-sm text-foreground">
                  {m.agenda.map((point, i) => (
                    <li key={`${i}-${point}`} className="leading-6">
                      {point}
                    </li>
                  ))}
                </ol>
              )}
            </section>

            {m.status === 'held' && (
              <section aria-labelledby="meeting-minutes" className="rounded-2xl border border-border bg-background p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 id="meeting-minutes" className="text-base font-semibold text-foreground">
                    Acta
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {m.attendees !== undefined && `${m.attendees} asistentes`}
                    {canManage && !m.minutesPublished && ' · sin publicar a las familias'}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 whitespace-pre-line text-foreground/90">{m.minutes}</p>
                {m.agreements.length > 0 && (
                  <>
                    <h3 className="mt-5 text-sm font-semibold text-foreground">Acuerdos</h3>
                    <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                      {m.agreements.map((a, i) => (
                        <li key={`${i}-${a}`} className="flex gap-2 leading-6">
                          <MorphIcon icon={CircleCheckBig} size={15} className="mt-1 shrink-0 text-success" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            )}
          </div>

          <AttachmentsPanel ownerKind="apafa_meeting" ownerId={m.id} module="apafa" title="Documentos" description="Agenda, acta firmada, estados financieros y lista de asistencia." categories={[...meetingCategories]} readOnly={!canManage} className="self-start" />
        </div>
      </div>

      {dialog === 'edit' && <ApafaMeetingDialog meeting={m.raw} onClose={close} onSaved={done} />}
      {dialog === 'reschedule' && <ApafaRescheduleDialog meeting={m} onClose={close} onDone={done} />}
      {dialog === 'cancel' && <ApafaCancelDialog meeting={m} onClose={close} onDone={done} />}
      {dialog === 'minutes' && <ApafaMinutesDialog meeting={m} onClose={close} onDone={done} />}
    </AcademicPage>
  );
};
