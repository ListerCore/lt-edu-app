import Link from 'next/link';
import type { JSX } from 'react';
import { siteConfig } from '@/lib/site';
import type { LegalSection } from '../types';
import { LegalBlock } from './legal-block';
import { LegalPage } from './legal-page';

const sections: LegalSection[] = [
  { id: 'objeto', title: 'Objeto' },
  { id: 'demo', title: 'Uso de la demo' },
  { id: 'cuentas', title: 'Cuentas y roles' },
  { id: 'institucion', title: 'Obligaciones de la institución' },
  { id: 'propiedad', title: 'Propiedad intelectual' },
  { id: 'servicio', title: 'Contratación del servicio' },
  { id: 'responsabilidad', title: 'Responsabilidad' },
  { id: 'reclamos', title: 'Reclamos' },
  { id: 'ley', title: 'Ley aplicable' },
];

// Terms of use for the public site, the demo and the per-institution platform
export const TermsPage = (): JSX.Element => (
  <LegalPage code="LEG/02" eyebrow="Condiciones de uso" title="Términos y" highlight="condiciones." summary={`Reglas para usar ${siteConfig.domain}, la demo por tipo de institución y rol, y la plataforma contratada por cada institución.`} updatedAt="4 de noviembre de 2026" sections={sections}>
    <LegalBlock id="objeto" index={1} title="Objeto">
      <p>
        Estos términos regulan el uso de este sitio, de la demo pública y de la plataforma de gestión educativa de <strong>{siteConfig.name}</strong>. Al usarlos aceptas estas condiciones.
      </p>
    </LegalBlock>
    <LegalBlock id="demo" index={2} title="Uso de la demo">
      <ul>
        <li>La demo permite elegir un tipo de institución y un rol para evaluar la plataforma. No debe usarse para gestionar una institución real.</li>
        <li>Contiene datos ficticios y se restablece periódicamente; todo lo que registres puede borrarse sin aviso.</li>
        <li>No cargues datos personales reales de estudiantes, familias ni personal.</li>
        <li>Los carnets, reportes y documentos que descargues desde la demo no tienen validez.</li>
      </ul>
    </LegalBlock>
    <LegalBlock id="cuentas" index={3} title="Cuentas y roles">
      <p>Las credenciales son personales e intransferibles. Cada usuario solo puede usar las funciones de su rol; no intentes acceder a módulos o datos fuera de tu alcance ni afectar la disponibilidad del servicio. Si encuentras una vulnerabilidad, repórtala a {siteConfig.emails.support}.</p>
    </LegalBlock>
    <LegalBlock id="institucion" index={4} title="Obligaciones de la institución">
      <ul>
        <li>Asignar los roles y permisos de sus usuarios y mantenerlos actualizados.</li>
        <li>Contar con la base legal para tratar los datos de sus estudiantes, apoderados y personal.</li>
        <li>Verificar la información académica (notas, actas, asistencia) antes de emitir documentos oficiales.</li>
      </ul>
    </LegalBlock>
    <LegalBlock id="propiedad" index={5} title="Propiedad intelectual">
      <p>El software, la marca, los diseños y los contenidos de {siteConfig.name} están protegidos. No se permite copiarlos, descompilarlos ni usarlos para desarrollar un producto competidor. Los datos cargados por cada institución le pertenecen a ella.</p>
    </LegalBlock>
    <LegalBlock id="servicio" index={6} title="Contratación del servicio">
      <p>La contratación de la plataforma se rige por un contrato aparte que define el tipo de institución, los módulos activos, el número de usuarios, el precio, los niveles de soporte y el tratamiento de datos como encargado.</p>
    </LegalBlock>
    <LegalBlock id="responsabilidad" index={7} title="Responsabilidad">
      <p>La demo se ofrece “tal cual”, sin garantía de disponibilidad continua. {siteConfig.name} no responde por decisiones tomadas a partir de los datos ficticios de la demo ni por información cargada incorrectamente por los usuarios de una institución.</p>
    </LegalBlock>
    <LegalBlock id="reclamos" index={8} title="Reclamos">
      <p>
        Puedes presentar un reclamo o una queja en nuestro{' '}
        <Link className="text-foreground underline underline-offset-4 hover:text-brand" href="/legal/complaints">
          Libro de Reclamaciones virtual
        </Link>
        , conforme al Código de Protección y Defensa del Consumidor.
      </p>
    </LegalBlock>
    <LegalBlock id="ley" index={9} title="Ley aplicable">
      <p>Estos términos se rigen por las leyes de la República del Perú.</p>
    </LegalBlock>
  </LegalPage>
);
