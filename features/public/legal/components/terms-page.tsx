import type { JSX } from 'react';
import Link from 'next/link';
import { BookOpenCheck, Bot, CalendarCheck, CreditCard, FileCheck2, FileText, Gauge, Gavel, GraduationCap, HeartHandshake, LockKeyhole, Scale, ShieldCheck, ShieldEllipsis, Sparkles, UserRoundCheck, UsersRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LegalPage } from './legal-page';
import { LegalSectionHeading } from './legal-section-heading';

const sections = [
  'Aceptación de los términos',
  'Definiciones generales',
  'Descripción del servicio educativo',
  'Requisitos de acceso y matrícula',
  'Cuentas de usuario y seguridad',
  'Conducta y convivencia virtual',
  'Asistencia y evaluación',
  'Pensiones y pagos',
  'Uso de herramientas de inteligencia artificial',
  'Propiedad intelectual',
  'Disponibilidad y mantenimiento',
  'Limitación de responsabilidad',
  'Privacidad y datos personales',
  'Libro de Reclamaciones Virtual',
  'Modificaciones de los términos',
  'Ley aplicable y jurisdicción',
  'Canales de contacto oficial',
].map((title, index) => ({ id: `terminos-${index + 1}`, title }));

const sectionText = [
  'Al navegar por este sitio o utilizar los servicios digitales, aceptas estas condiciones en lo que resulte aplicable al servicio solicitado. Los servicios educativos y la matrícula se rigen también por la información y documentación que la institución entrega para cada periodo.',
  'En este documento, “institución” se refiere a CEBA Joseph Lister; “estudiante” a quien recibe el servicio educativo; “apoderado” a quien ejerce representación cuando corresponde; y “plataforma” a los canales digitales institucionales.',
  'La institución brinda servicios de Educación Básica Alternativa. La información del sitio tiene carácter orientativo; la modalidad, los ciclos disponibles y las condiciones del servicio se confirman por los canales institucionales.',
  'La admisión y matrícula requieren presentar la información y documentación que indique la institución para el periodo correspondiente. La recepción de una consulta no confirma una vacante ni completa la matrícula.',
  'Cada persona debe proteger sus credenciales y notificar cualquier uso no autorizado. Las cuentas son personales y no deben compartirse ni utilizarse para suplantar a otra persona.',
  'Quienes usan las aulas y canales virtuales deben mantener un trato respetuoso y cumplir las normas de convivencia escolar y las indicaciones del personal educativo. No se permite acosar, amenazar, suplantar ni interrumpir deliberadamente las actividades.',
  'La asistencia, participación y evaluación se gestionan de acuerdo con las disposiciones educativas vigentes y los criterios comunicados por la institución. Las actividades y evidencias deben corresponder al trabajo del estudiante.',
  'Los costos, fechas y medios de pago vigentes se informan antes de contratar el servicio. Los pagos deben realizarse por los canales indicados por la institución y conservarse sus comprobantes.',
  'Las herramientas digitales de apoyo, si están disponibles, sirven como complemento educativo. El estudiante debe verificar la información generada y cumplir las reglas académicas sobre autoría y uso de dichas herramientas.',
  'Los materiales del sitio y del aula virtual están protegidos por los derechos de sus titulares. Su uso se limita al propósito educativo o informativo autorizado; no se permite redistribuirlos con fines comerciales sin autorización.',
  'La institución procura mantener disponibles sus canales digitales, pero puede realizar actualizaciones o suspensiones temporales por mantenimiento, seguridad o causas fuera de su control.',
  'La institución atiende los servicios con diligencia y dentro de las obligaciones aplicables. Esta sección no limita derechos que la normativa reconoce a estudiantes y consumidores.',
  'El tratamiento de datos personales se describe en la Política de Privacidad y Protección de Datos Personales, disponible en el sitio. Al proporcionar información, debes procurar que sea exacta y pertinente para el trámite solicitado.',
  'Las personas usuarias pueden presentar una queja o reclamo mediante el canal del Libro de Reclamaciones. Consulta la página correspondiente para conocer cómo registrar una solicitud.',
  'Estas condiciones pueden actualizarse para reflejar cambios en los servicios o en la normativa. La versión vigente se publicará en esta página.',
  'Las condiciones se interpretan conforme a las leyes de la República del Perú, sin afectar los derechos irrenunciables reconocidos por la legislación aplicable.',
  'Para consultas sobre estas condiciones, escribe a informes@cebajosephlister.edu.pe o llama al (066) 31-4520.',
];

const sectionIcons = [Scale, FileText, GraduationCap, UserRoundCheck, LockKeyhole, HeartHandshake, CalendarCheck, CreditCard, Bot, FileCheck2, Gauge, ShieldEllipsis, ShieldCheck, BookOpenCheck, Sparkles, Gavel, UsersRound];

export const TermsPage = (): JSX.Element => (
  <LegalPage eyebrow="Transparencia y legal" title="Términos y Condiciones del Servicio" summary="Condiciones generales de uso, derechos, deberes y convivencia virtual para estudiantes, apoderados y visitantes de los canales digitales de CEBA Joseph Lister." tags={['Servicio educativo EBA', 'Normas de uso', 'CEBA Joseph Lister']} icon={Scale} sections={sections}>
    <section className="scroll-mt-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Antes de empezar</p>
      <h2 className="mt-2 font-heading text-xl font-bold text-foreground">Cuatro principios para el uso del servicio</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          { title: 'Convivencia respetuosa', body: 'Participa con respeto en clases, foros y comunicaciones institucionales.', icon: HeartHandshake },
          { title: 'Cuenta personal', body: 'Cuida tus credenciales y no permitas que otras personas usen tu cuenta.', icon: LockKeyhole },
          { title: 'Información vigente', body: 'Confirma directamente con la institución las condiciones de matrícula y costos del periodo.', icon: CalendarCheck },
          { title: 'Protección de datos', body: 'Consulta la política de privacidad para conocer cómo se trata la información personal.', icon: ShieldCheck },
        ].map(({ title, body, icon: Icon }) => (
          <Card key={title} size="sm" className="bg-background shadow-none">
            <CardContent>
            <span className="mb-3 grid size-9 place-items-center rounded-lg bg-secondary/10 text-secondary">
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-xs leading-5 text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
    {sections.map((section, index) => {
      const Icon = sectionIcons[index];
      return (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <LegalSectionHeading icon={Icon} number={`Sección ${String(index + 1).padStart(2, '0')}`} title={section.title} />
          <p>{sectionText[index]}</p>
          {index === 12 && (
            <p className="mt-3">
              <Link href="/legal/privacy" className="font-medium text-secondary underline underline-offset-4">
                Ver Política de Privacidad
              </Link>
            </p>
          )}
          {index === 13 && (
            <p className="mt-3">
              <Link href="/legal/complaints" className="font-medium text-secondary underline underline-offset-4">
                Ir al Libro de Reclamaciones
              </Link>
            </p>
          )}
        </section>
      );
    })}
    <section>
      <h2>¿Tienes dudas sobre estos términos?</h2>
      <p>
        Comunícate con la institución en{' '}
        <a className="font-medium text-secondary underline underline-offset-4" href="mailto:informes@cebajosephlister.edu.pe">
          informes@cebajosephlister.edu.pe
        </a>{' '}
        o al (066) 31-4520, de lunes a sábado.
      </p>
    </section>
  </LegalPage>
);
