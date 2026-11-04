import type { JSX } from 'react';
import { siteConfig } from '@/lib/site';
import type { LegalSection } from '../types';
import { LegalBlock } from './legal-block';
import { LegalPage } from './legal-page';

const sections: LegalSection[] = [
  { id: 'responsable', title: 'Responsable' },
  { id: 'datos', title: 'Datos que tratamos' },
  { id: 'finalidades', title: 'Finalidades' },
  { id: 'instituciones', title: 'Datos de las instituciones' },
  { id: 'menores', title: 'Menores de edad' },
  { id: 'sensibles', title: 'Datos sensibles' },
  { id: 'demo', title: 'Demo' },
  { id: 'conservacion', title: 'Conservación' },
  { id: 'destinatarios', title: 'Destinatarios' },
  { id: 'seguridad', title: 'Seguridad' },
  { id: 'derechos', title: 'Derechos ARCO' },
  { id: 'cookies', title: 'Cookies' },
];

const linkClassName = 'text-foreground underline underline-offset-4 hover:text-brand';

// Privacy policy under Ley N.° 29733 and its regulation (D.S. 016-2024-JUS), adapted to an education SaaS
export const PrivacyPage = (): JSX.Element => (
  <LegalPage code="LEG/01" eyebrow="Protección de datos personales" title="Política de" highlight="privacidad." summary="Cómo tratamos los datos personales que recibimos en este sitio, en la demo y en la plataforma de cada institución, conforme a la Ley N.° 29733 y su reglamento." updatedAt="4 de noviembre de 2026" sections={sections}>
    <LegalBlock id="responsable" index={1} title="Responsable">
      <p>
        El responsable del tratamiento de los datos recogidos en <strong>{siteConfig.domain}</strong> es {siteConfig.name}. Puedes escribirnos sobre cualquier tema de privacidad a{' '}
        <a className={linkClassName} href={`mailto:${siteConfig.emails.privacy}`}>
          {siteConfig.emails.privacy}
        </a>
        .
      </p>
    </LegalBlock>
    <LegalBlock id="datos" index={2} title="Datos que tratamos">
      <p>Cuando solicitas la implementación, pruebas la demo o te comunicas con nosotros, tratamos:</p>
      <ul>
        <li>Datos de identificación y contacto: nombre, cargo, correo y teléfono o WhatsApp.</li>
        <li>Datos de la institución: nombre, tipo (EBR, EBA, EBE, pre-universitario o instituto), número aproximado de estudiantes y región.</li>
        <li>El mensaje que nos escribas y la fecha en que diste tu consentimiento.</li>
        <li>Datos técnicos mínimos para prevenir abuso: dirección IP y navegador.</li>
      </ul>
    </LegalBlock>
    <LegalBlock id="finalidades" index={3} title="Finalidades">
      <ul>
        <li>Atender tu solicitud y coordinar una reunión, una cotización o la implementación.</li>
        <li>Prestar el servicio a las instituciones que contratan la plataforma.</li>
        <li>Proteger los formularios contra envíos automatizados o abusivos.</li>
        <li>Atender reclamos y quejas registrados en el Libro de Reclamaciones.</li>
      </ul>
      <p>No usamos tus datos para fines distintos ni los vendemos a terceros.</p>
    </LegalBlock>
    <LegalBlock id="instituciones" index={4} title="Datos de las instituciones">
      <p>
        En la plataforma de cada cliente, la <strong>institución educativa es la titular del banco de datos</strong> de sus estudiantes, apoderados, docentes y personal: matrícula, asistencia, notas, carnets con fotografía, tutoría y pagos. {siteConfig.name} actúa como <strong>encargado del tratamiento</strong>: solo trata esos datos para prestar el servicio y según las instrucciones de la institución.
      </p>
      <p>Cada institución está aislada de las demás: ningún usuario puede ver datos de otra institución, y dentro de cada una el acceso depende del rol asignado.</p>
    </LegalBlock>
    <LegalBlock id="menores" index={5} title="Menores de edad">
      <p>La plataforma trata datos de estudiantes menores de edad por encargo de su institución. La institución es responsable de contar con el consentimiento de los padres, madres o apoderados cuando la ley lo exige. Los apoderados acceden solo a la información de los estudiantes a su cargo.</p>
    </LegalBlock>
    <LegalBlock id="sensibles" index={6} title="Datos sensibles">
      <p>
        Los módulos de <strong>psicología</strong>, acompañamiento y bienestar pueden contener datos de salud, que la ley considera sensibles. Esa información solo es visible para los roles autorizados por la institución (por ejemplo, el área de psicología), sus accesos quedan registrados y no se incluye en reportes generales.
      </p>
    </LegalBlock>
    <LegalBlock id="demo" index={7} title="Demo">
      <p>La demo pública funciona exclusivamente con datos ficticios y se restablece periódicamente. No cargues en ella datos reales de estudiantes, familias ni personal.</p>
    </LegalBlock>
    <LegalBlock id="conservacion" index={8} title="Conservación">
      <p>Conservamos los datos de las solicitudes comerciales mientras exista una relación en curso y, como máximo, dos años desde el último contacto. Los datos de cada institución se conservan mientras dure el contrato y se devuelven o eliminan al terminarlo, según lo que la institución indique.</p>
    </LegalBlock>
    <LegalBlock id="destinatarios" index={9} title="Destinatarios">
      <p>Compartimos datos solo con proveedores que nos ayudan a operar el servicio (alojamiento, correo y mensajería), bajo obligaciones de confidencialidad. Si alguno se ubica fuera del Perú, el flujo transfronterizo se realiza con las garantías que exige la normativa.</p>
    </LegalBlock>
    <LegalBlock id="seguridad" index={10} title="Seguridad">
      <p>Aplicamos medidas técnicas y organizativas: conexiones cifradas, acceso restringido por rol y por módulo, separación de datos por institución, copias de respaldo y registros de actividad.</p>
    </LegalBlock>
    <LegalBlock id="derechos" index={11} title="Derechos ARCO">
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición escribiendo a{' '}
        <a className={linkClassName} href={`mailto:${siteConfig.emails.privacy}`}>
          {siteConfig.emails.privacy}
        </a>{' '}
        con una copia de tu documento de identidad. Si tus datos pertenecen a una institución cliente (por ejemplo, eres estudiante o apoderado), la solicitud la atiende esa institución y nosotros la apoyamos. Si no estás conforme con la respuesta, puedes acudir a la Autoridad Nacional de Protección de Datos Personales.
      </p>
    </LegalBlock>
    <LegalBlock id="cookies" index={12} title="Cookies">
      <p>Este sitio solo usa almacenamiento local para recordar tu preferencia de tema (claro, oscuro o sistema) y cookies técnicas para mantener la sesión en la plataforma. Si en el futuro incorporamos analítica, te pediremos consentimiento antes de activarla.</p>
    </LegalBlock>
  </LegalPage>
);
