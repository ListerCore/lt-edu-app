import Link from 'next/link';
import type { JSX } from 'react';
import type { LegalSection } from '../types';
import { LegalBlock } from './legal-block';
import { LegalPage } from './legal-page';

const sections: LegalSection[] = [
  { id: 'objeto', title: 'Objeto' },
  { id: 'cuentas', title: 'Cuentas de acceso' },
  { id: 'uso', title: 'Uso responsable' },
  { id: 'comunicados', title: 'Comunicados oficiales' },
  { id: 'academico', title: 'Información académica' },
  { id: 'pagos', title: 'Pensiones y pagos' },
  { id: 'propiedad', title: 'Contenidos' },
  { id: 'reclamos', title: 'Reclamos' },
  { id: 'ley', title: 'Ley aplicable' },
];

// Terms of use of the institution's website and of the accounts of its community
export const TermsPage = (): JSX.Element => (
  <LegalPage code="LEG/02" eyebrow="Condiciones de uso" title="Términos y" highlight="condiciones." summary="Reglas para usar el sitio web de la institución y las cuentas de estudiantes, apoderados, docentes y personal." updatedAt="4 de noviembre de 2026" sections={sections}>
    <LegalBlock id="objeto" index={1} title="Objeto">
      <p>Estos términos regulan el uso de este sitio y de las cuentas que la institución entrega a su comunidad. Al usarlos aceptas estas condiciones, además del reglamento interno de la institución.</p>
    </LegalBlock>
    <LegalBlock id="cuentas" index={2} title="Cuentas de acceso">
      <ul>
        <li>Cada cuenta es personal e intransferible y se asocia al correo registrado en secretaría.</li>
        <li>Lo que ves y puedes hacer depende de tu rol: estudiante, apoderado, docente o personal administrativo.</li>
        <li>Cuida tu contraseña y activa la verificación en dos pasos. Si sospechas un acceso indebido, cámbiala y avisa a soporte.</li>
      </ul>
    </LegalBlock>
    <LegalBlock id="uso" index={3} title="Uso responsable">
      <p>No intentes acceder a información de otras personas ni a funciones fuera de tu rol, no compartas datos de otros estudiantes o familias y no uses el sitio para fines ajenos a la vida académica. El incumplimiento puede llevar a la suspensión de la cuenta y a las medidas del reglamento interno.</p>
    </LegalBlock>
    <LegalBlock id="comunicados" index={4} title="Comunicados oficiales">
      <p>
        Los comunicados, anuncios y avisos publicados en la sección{' '}
        <Link className="text-foreground underline underline-offset-4 hover:text-brand" href="/news">
          Comunicados
        </Link>{' '}
        y dentro de tu cuenta son canales oficiales de la institución. Revísalos con frecuencia.
      </p>
    </LegalBlock>
    <LegalBlock id="academico" index={5} title="Información académica">
      <p>Las notas, la asistencia y los horarios que ves en tu cuenta son informativos. Los documentos con validez oficial (actas, certificados y constancias) se solicitan en secretaría. Si encuentras un error, comunícalo dentro del plazo que fija el reglamento.</p>
    </LegalBlock>
    <LegalBlock id="pagos" index={6} title="Pensiones y pagos">
      <p>El estado de cuenta en línea refleja los pagos registrados por la institución. Los montos, fechas de vencimiento y condiciones se rigen por lo informado al momento de la matrícula.</p>
    </LegalBlock>
    <LegalBlock id="propiedad" index={7} title="Contenidos">
      <p>Los materiales, logotipos y contenidos publicados por la institución están protegidos. Puedes usarlos para tus estudios, pero no copiarlos ni difundirlos con otros fines sin autorización.</p>
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
      <p>Estos términos se rigen por las leyes de la República del Perú y la normativa del sector educación.</p>
    </LegalBlock>
  </LegalPage>
);
