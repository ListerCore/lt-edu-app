import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, BookOpenCheck, Clock3, ExternalLink, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LegalPage } from './legal-page';
import { ComplaintForm } from './complaints-form';
import { ComplaintStatusForm } from './complaint-status-form';

export const ComplaintsPage = (): JSX.Element => (
  <LegalPage eyebrow="Canal de atención al estudiante" title="Libro de Reclamaciones Virtual" summary="Tu opinión nos ayuda a mejorar. Registra una queja o reclamo relacionado con los servicios educativos de CEBA Joseph Lister." tags={['D.S. N.° 011-2011-PCM', 'Ley N.° 29571', 'Atención virtual']} icon={BookOpenCheck}>
    <Card className="sm:flex-row sm:items-center sm:justify-between">
      <CardContent className="w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Atención de solicitudes</p>
        <h2 className="mt-1 flex items-center gap-2 font-heading text-xl font-bold text-foreground">
          <BookOpenCheck aria-hidden="true" className="size-5 text-secondary" />
          Registro disponible en línea
        </h2>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">Completa tus datos y describe el servicio relacionado con tu solicitud.</p>
      </div>
      <div className="rounded-lg border border-border bg-background p-4 sm:min-w-64">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Clock3 aria-hidden="true" className="size-4 text-secondary" />
          Plazo de respuesta
        </p>
        <p className="mt-1 font-heading text-lg font-bold text-foreground">15 días hábiles</p>
        <p className="mt-1 text-[11px] text-secondary">No prorrogables</p>
      </div>
      </CardContent>
    </Card>
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.9fr)]">
      <ComplaintForm />
      <aside className="space-y-5">
        <Card>
          <CardHeader className="grid-cols-[auto_1fr] items-center gap-3 border-b border-border">
            <Image src="/logo.png" alt="CEBA Joseph Lister" width={40} height={40} className="size-10 rounded-lg object-contain" />
            <div><CardTitle className="text-sm">Proveedor educativo</CardTitle><p className="text-[11px] text-muted-foreground">Datos de atención institucional</p></div>
          </CardHeader>
          <CardContent>
          <dl className="mt-4 space-y-4 text-xs leading-5">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Institución</dt>
              <dd className="mt-1 font-semibold text-foreground">CEBA Privado Virtual Joseph Lister</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Identificación y autorización</dt>
              <dd className="mt-1 text-muted-foreground">RUC 20603819201 · R.D.R. N.° 01482-2018</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Domicilio de atención</dt>
              <dd className="mt-1 text-muted-foreground">Jr. 28 de Julio N.° 450, Centro Histórico, Huamanga, Ayacucho, Perú</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Correo</dt>
              <dd className="mt-1">
                <a className="break-all font-medium text-secondary underline underline-offset-4" href="mailto:libroreclamaciones@cebalister.edu.pe">
                  libroreclamaciones@cebalister.edu.pe
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Teléfono</dt>
              <dd className="mt-1 text-foreground">(066) 31-4520 / +51 966 845 120</dd>
            </div>
          </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="grid-cols-[auto_1fr] items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-secondary/10 text-secondary"><ShieldCheck aria-hidden="true" className="size-5" /></span>
            <div><CardTitle className="text-sm">Garantía y plazos</CardTitle><p className="text-[11px] text-secondary">Información para consumidores</p></div>
          </CardHeader>
          <CardContent>
          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-foreground">
              <Clock3 aria-hidden="true" className="size-4 text-secondary" /> Respuesta dentro de 15 días hábiles no prorrogables.
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">El registro de un reclamo no impide recurrir a otras vías de solución de controversias ni es requisito previo para presentar una denuncia ante Indecopi.</p>
          </div>
          <Link href="https://www.gob.pe/indecopi" target="_blank" rel="noreferrer" className="mt-3 flex min-h-11 items-center justify-between rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-accent">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck aria-hidden="true" className="size-4 text-secondary" /> Portal de Indecopi
            </span>
            <ExternalLink aria-hidden="true" className="size-4 text-muted-foreground" />
          </Link>
          </CardContent>
        </Card>
          <p className="px-1 text-[11px] leading-5 text-muted-foreground">
          ¿Necesitas ayuda para completar la solicitud? También puedes pedir el Libro de Reclamaciones físico en secretaría general.{' '}
          <a className="font-medium text-secondary underline underline-offset-4" href="tel:+5166314520">
            Llámanos al (066) 31-4520
          </a>
          .
        </p>
      </aside>
    </div>
    <section className="rounded-xl border border-border bg-muted/60 p-4 sm:p-5" aria-labelledby="complaint-status-title">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-secondary">Seguimiento de solicitud</p><h2 id="complaint-status-title" className="mt-1 font-heading text-lg font-bold text-foreground">Consulta el estado de tu reclamación</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Ingresa el número de hoja y el documento usado en el registro para preparar una consulta al equipo de atención.</p></div><span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground"><ShieldCheck aria-hidden="true" className="size-3.5 text-secondary" /> Verificación de identidad</span></div>
      <ComplaintStatusForm />
    </section>
  </LegalPage>
);
