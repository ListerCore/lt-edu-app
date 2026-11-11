'use client';

import { useState, useTransition, type JSX } from 'react';
import { ArrowLeft, Ban, Printer } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { annulCertificateAction, getCertificateAction } from '../actions/programs-actions';

// A modular certificate or a degree as it was frozen when issued; prints on A4
export const CertificateScreen = ({ slug, id, canAnnul, onBack }: { slug: string; id: string; canAnnul?: boolean; onBack: () => void }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`certificate:${slug}:${id}`, () => getCertificateAction(slug, id), () => false);
  const [annulling, setAnnulling] = useState(false);
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  const { certificate: c, content: d } = data;
  const degree = c.kind === 'degree';
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 print:hidden">
        <button type="button" className="btn-alt" onClick={onBack}>
          <MorphIcon icon={ArrowLeft} size={16} />
          Volver
        </button>
        <div className="flex gap-2">
          {canAnnul && c.status === 'issued' && (
            <button type="button" className="btn-alt text-destructive" onClick={(): void => setAnnulling(true)}>
              <MorphIcon icon={Ban} size={16} />
              Anular
            </button>
          )}
          <button type="button" className="btn-brand" onClick={(): void => window.print()}>
            <MorphIcon icon={Printer} size={16} />
            Imprimir o guardar PDF
          </button>
        </div>
      </div>
      {c.status === 'annulled' && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive print:hidden">Anulado: {c.annulReason}</p>}
      <div data-print-cards>
        <article data-print-card className="relative mx-auto max-w-4xl rounded-2xl border-4 border-double border-brand/60 bg-background p-8 md:p-12 print:rounded-none">
          {c.status === 'annulled' && <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-6xl font-bold tracking-widest text-destructive/20 uppercase">Anulado</span>}
          <header className="text-center">
            <p className="text-sm font-semibold tracking-wide text-brand">{d.institution}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{degree ? 'Título' : 'Certificado modular'}</h2>
            <p className="mt-1 text-sm text-muted-foreground tabular-nums">N.° {c.code}</p>
          </header>
          <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-7 text-pretty text-foreground">
            {degree ? 'Otorga el título de' : 'Certifica que'} {degree && <strong className="block text-xl">{d.degree}</strong>}
            {degree ? 'a' : ''} <strong className="text-xl">{d.student}</strong>, con DNI {d.document},{' '}
            {degree ? (
              <>por haber concluido el programa de estudios de {d.program}, con {d.credits} créditos, sus experiencias formativas y los requisitos de titulación.</>
            ) : (
              <>
                aprobó el módulo formativo <strong>«{d.module}»</strong> del programa de estudios de {d.program}, con {d.credits} créditos, incluida su experiencia formativa en situaciones reales de trabajo.
              </>
            )}
          </p>
          <table className="mt-8 w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="py-1.5 font-medium">Sem.</th>
                <th scope="col" className="py-1.5 font-medium">Unidad didáctica</th>
                <th scope="col" className="py-1.5 text-right font-medium">Créditos</th>
                <th scope="col" className="py-1.5 text-right font-medium">Nota</th>
                <th scope="col" className="py-1.5 pl-4 font-medium">Periodo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(d.units ?? []).map((u) => (
                <tr key={u.name + u.semester} className="break-inside-avoid">
                  <td className="py-1 tabular-nums">{u.semester}</td>
                  <td className="py-1 text-foreground">{u.name}</td>
                  <td className="py-1 text-right tabular-nums">{u.credits}</td>
                  <td className="py-1 text-right font-semibold tabular-nums">{u.grade}</td>
                  <td className="py-1 pl-4 text-muted-foreground">{u.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(d.placements ?? []).length > 0 && (
            <table className="mt-4 w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th scope="col" className="py-1.5 font-medium">Experiencia formativa</th>
                  <th scope="col" className="py-1.5 font-medium">Empresa o institución</th>
                  <th scope="col" className="py-1.5 text-right font-medium">Horas</th>
                  <th scope="col" className="py-1.5 text-right font-medium">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(d.placements ?? []).map((p) => (
                  <tr key={p.name}>
                    <td className="py-1 text-foreground">{p.name}</td>
                    <td className="py-1">{p.company}</td>
                    <td className="py-1 text-right tabular-nums">{p.hours}</td>
                    <td className="py-1 text-right font-semibold tabular-nums">{p.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="mt-6 text-center text-xs text-muted-foreground">{d.legend}</p>
          <p className="mt-2 text-center text-sm text-foreground">{formatDay(d.issuedOn)}</p>
          <footer className="mt-14 grid grid-cols-2 gap-16 text-center text-xs text-muted-foreground">
            {d.signatures.map((s) => (
              <div key={s} className="border-t border-foreground pt-2">
                {s}
              </div>
            ))}
          </footer>
        </article>
      </div>
      {annulling && <AnnulDialog slug={slug} id={id} onClose={(): void => setAnnulling(false)} onDone={(): void => { setAnnulling(false); reload(); }} />}
    </div>
  );
};

const AnnulDialog = ({ slug, id, onClose, onDone }: { slug: string; id: string; onClose: () => void; onDone: () => void }): JSX.Element => {
  const [reason, setReason] = useState('');
  const [isPending, startTransition] = useTransition();
  return (
    <FormDialog
      title="Anular el documento"
      description="Deja de ser válido y queda en el historial con el motivo. Luego se puede emitir uno nuevo."
      submitLabel="Anular"
      isPending={isPending}
      disabled={!reason.trim()}
      onSubmit={(): void =>
        startTransition(async () => {
          const r = await annulCertificateAction(slug, id, reason.trim());
          if (!r.ok) sileo.error({ title: 'No se pudo anular', description: r.message });
          else onDone();
        })
      }
      onClose={onClose}
    >
      <FormField id="annul-reason" label="Motivo" required>
        <Input id="annul-reason" value={reason} maxLength={300} onChange={(e): void => setReason(e.target.value)} />
      </FormField>
    </FormDialog>
  );
};
