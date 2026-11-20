import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { CircleAlert, CircleCheck, CircleX, CloudOff, FileText, History, Search, TriangleAlert } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { documentsRpc } from '@/lib/api/grpc/documents';
import type { DocumentVersion } from '@/lib/api/grpc/gen/ltedu/documents/v1/documents';
import { cn } from '@/lib/utils';

const TRACKING = /^[0-9a-z]{12}$/;
const CODE = /^[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/;

const stateLabels: Record<string, string> = { pending: 'Pendiente de firma', published: 'Vigente', superseded: 'Reemplazada', cancelled: 'Anulada' };
const stateClass: Record<string, string> = {
  pending: 'bg-warning/12 text-warning',
  published: 'bg-success/12 text-success',
  superseded: 'bg-secondary text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};
const eventLabels: Record<string, string> = { generated: 'Versión generada', signed: 'Firmada', published: 'Publicada', superseded: 'Reemplazada', cancelled: 'Anulada antes de publicarse', signers: 'Firmantes actualizados' };

// "11 nov. 2026, 17:11" in Lima
const when = (iso: string): string => (iso ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Lima' }).format(new Date(iso)) : '');

interface Verdict {
  tone: 'ok' | 'warn' | 'bad' | 'info';
  title: string;
  text: string;
}

// What the scanned code says about the paper in hand
const verdictOf = (code: string, matched: DocumentVersion | undefined, current: DocumentVersion | undefined): Verdict => {
  if (!code) return current ? { tone: 'info', title: `Versión vigente: ${current.number}`, text: 'Compara el código de verificación impreso junto al QR con el de la versión vigente.' } : { tone: 'warn', title: 'Aún no hay una versión publicada', text: 'El documento existe, pero ninguna versión completó sus firmas.' };
  if (!matched) return { tone: 'bad', title: 'El código no corresponde a este documento', text: 'Revisa el código impreso. Si coincide y aun así no aparece, el papel no fue emitido por la institución.' };
  switch (matched.status) {
    case 'published':
      return { tone: 'ok', title: 'Documento válido: es la versión vigente', text: `Versión ${matched.number}, firmada por todos y publicada el ${when(matched.publishedAt)}` };
    case 'superseded':
      return { tone: 'warn', title: `Esta versión fue reemplazada`, text: `El papel corresponde a la versión ${matched.number}. ${current ? `La vigente es la versión ${current.number}.` : ''}` };
    case 'pending':
      return { tone: 'warn', title: 'Esta versión aún no se publica', text: 'Le faltan firmas: todavía no tiene validez.' };
    default:
      return { tone: 'bad', title: 'Esta versión fue anulada', text: 'Se reemplazó antes de firmarse y nunca tuvo validez.' };
  }
};

const toneClass: Record<Verdict['tone'], string> = {
  ok: 'bg-success/10 text-success',
  warn: 'bg-warning/10 text-warning',
  bad: 'bg-destructive/10 text-destructive',
  info: 'bg-card text-foreground',
};
const toneIcon = { ok: CircleCheck, warn: TriangleAlert, bad: CircleX, info: CircleAlert };

// Placeholder while the document loads
export const TrackingSkeleton = (): JSX.Element => (
  <div className="space-y-4" aria-hidden>
    <div className="h-8 w-2/3 animate-pulse rounded-md bg-card" />
    <div className="h-24 animate-pulse rounded-xl bg-card" />
    <div className="h-48 animate-pulse rounded-xl bg-card" />
  </div>
);

// /seguimiento/<code>: whether a printed document is the current version, who signed it and its history. Without a
// session; only names, positions, dates and codes are shown
export const TrackingDetail = async ({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<JSX.Element> => {
  const { code: raw } = await params;
  const query = await searchParams;
  const tracking = raw.toLowerCase();
  if (!TRACKING.test(tracking)) notFound();
  const given = typeof query.codigo === 'string' ? query.codigo.trim().toUpperCase() : '';
  const code = CODE.test(given) ? given : '';
  const result = await documentsRpc.track({ trackingCode: tracking, code });
  if (!result.ok) {
    if (result.error.code === 'not_found') notFound();
    return (
      <p className="flex flex-col items-center gap-3 rounded-xl bg-card px-6 py-12 text-center text-sm text-muted-foreground">
        <MorphIcon icon={CloudOff} size={24} />
        {result.error.message}
      </p>
    );
  }
  const doc = result.data.document;
  if (!doc) notFound();
  const current = doc.versions.find((v) => v.status === 'published');
  const matched = doc.versions.find((v) => v.number === result.data.matched);
  const verdict = verdictOf(given, matched, current);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">{doc.institutionName}</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{doc.title}</h1>
        <p className="text-sm text-muted-foreground">
          Código de seguimiento <span className="font-mono text-foreground">{doc.trackingCode}</span>
        </p>
      </header>

      <div role="status" className={cn('flex gap-3 rounded-xl p-4', toneClass[verdict.tone])}>
        <MorphIcon icon={toneIcon[verdict.tone]} size={22} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">{verdict.title}</p>
          <p className="mt-0.5 text-sm text-foreground/80">{verdict.text}</p>
        </div>
      </div>

      <form method="get" className="flex flex-wrap items-end gap-2">
        <label htmlFor="codigo" className="w-full text-sm font-medium">
          Verificar un código impreso
        </label>
        <input id="codigo" name="codigo" defaultValue={given} placeholder="XXXX-XXXX-XXXX" autoComplete="off" spellCheck={false} pattern="[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}" className="h-10 w-56 rounded-lg bg-card px-3 font-mono text-sm uppercase ring-1 ring-border outline-none focus-visible:ring-2 focus-visible:ring-brand" />
        <button type="submit" className="btn-alt h-10">
          <MorphIcon icon={Search} size={16} />
          Verificar
        </button>
      </form>

      <section aria-labelledby="versions-title" className="space-y-3">
        <h2 id="versions-title" className="text-base font-semibold">
          Versiones
        </h2>
        <ol className="space-y-3">
          {doc.versions.map((v) => (
            <li key={v.number} className={cn('rounded-xl bg-card p-4', v.number === matched?.number && 'ring-2 ring-brand')}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">Versión {v.number}</span>
                  <span className={cn('pill', stateClass[v.status])}>{stateLabels[v.status] ?? v.status}</span>
                  {v.number === matched?.number && <span className="text-xs text-brand">El código que ingresaste</span>}
                </p>
                {(v.status === 'published' || v.status === 'superseded') && (
                  <a href={`/api/files/seguimiento/${doc.trackingCode}/${v.number}`} target="_blank" rel="noopener" className="btn-alt h-8 px-2.5 text-xs">
                    <MorphIcon icon={FileText} size={14} />
                    Ver PDF
                  </a>
                )}
              </div>
              <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {/* The API leaves the codes out: they prove a sheet, so only who holds it knows them */}
                {v.verificationCode && (
                  <div>
                    <dt className="inline text-muted-foreground">Código de verificación: </dt>
                    <dd className="inline font-mono">{v.verificationCode}</dd>
                  </div>
                )}
                <div>
                  <dt className="inline text-muted-foreground">Generada: </dt>
                  <dd className="inline">{when(v.createdAt)}</dd>
                </div>
                {v.publishedAt && (
                  <div>
                    <dt className="inline text-muted-foreground">Publicada: </dt>
                    <dd className="inline">{when(v.publishedAt)}</dd>
                  </div>
                )}
              </dl>
              <ul className="mt-3 space-y-2 border-t border-border/60 pt-3">
                {v.signatures.map((s) => (
                  <li key={s.sort} className="text-sm">
                    {s.signedAt ? (
                      <>
                        <p>
                          <span className="text-muted-foreground">Firmado digitalmente por:</span> <b className="font-medium">{s.name}</b>
                        </p>
                        <p className="text-muted-foreground">{s.position}</p>
                        <p className="text-xs text-muted-foreground">
                          Fecha: {when(s.signedAt)}
                          {s.code && (
                            <>
                              {' '}
                              · Código de verificación: <span className="font-mono text-foreground">{s.code}</span>
                            </>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">Firma simulada: se reemplazará por la firma digital oficial.</p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">
                        Pendiente de firma: <span className="text-foreground">{s.name}</span> · {s.position}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="history-title" className="space-y-3">
        <h2 id="history-title" className="flex items-center gap-2 text-base font-semibold">
          <MorphIcon icon={History} size={18} />
          Historial de cambios
        </h2>
        <ol className="space-y-1.5 text-sm">
          {doc.events
            .slice()
            .reverse()
            .map((e, i) => (
              <li key={`${e.at}-${i}`} className="flex flex-wrap gap-x-3">
                <span className="w-40 shrink-0 text-muted-foreground">{when(e.at)}</span>
                <span>
                  Versión {e.version}: {eventLabels[e.action] ?? e.action}
                  {e.actor && <span className="text-muted-foreground"> · {e.actor}</span>}
                  {e.note && <span className="text-muted-foreground"> — {e.note}</span>}
                </span>
              </li>
            ))}
        </ol>
      </section>
    </div>
  );
};
