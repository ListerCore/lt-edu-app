import type { JSX } from 'react';
import { siteConfig } from '@/lib/site';
import type { LegalSection } from '../types';
import { LegalBlock } from './legal-block';
import { LegalPage } from './legal-page';

const sections: LegalSection[] = [
  { id: 'responsable', title: 'Responsable' },
  { id: 'datos', title: 'Datos que tratamos' },
  { id: 'finalidades', title: 'Finalidades' },
  { id: 'menores', title: 'Menores de edad' },
  { id: 'sensibles', title: 'Datos sensibles' },
  { id: 'imagen', title: 'Fotografías y carnets' },
  { id: 'conservacion', title: 'Conservación' },
  { id: 'destinatarios', title: 'Destinatarios' },
  { id: 'seguridad', title: 'Seguridad' },
  { id: 'derechos', title: 'Derechos ARCO' },
  { id: 'cookies', title: 'Cookies' },
];

const linkClassName = 'text-foreground underline underline-offset-4 hover:text-brand';

// Privacy policy of the institution under Ley N.° 29733 and its regulation (D.S. 016-2024-JUS)
export const PrivacyPage = (): JSX.Element => (
  <LegalPage code="LEG/01" eyebrow="Protección de datos personales" title="Política de" highlight="privacidad." summary="Cómo la institución trata los datos personales de postulantes, estudiantes, apoderados, docentes y personal, conforme a la Ley N.° 29733 y su reglamento." updatedAt="4 de noviembre de 2026" sections={sections}>
    <LegalBlock id="responsable" index={1} title="Responsable">
      <p>
        La institución educativa es la titular de los bancos de datos de su comunidad y la responsable de su tratamiento. Puedes escribirnos sobre cualquier tema de privacidad a{' '}
        <a className={linkClassName} href={`mailto:${siteConfig.emails.privacy}`}>
          {siteConfig.emails.privacy}
        </a>
        .
      </p>
    </LegalBlock>
    <LegalBlock id="datos" index={2} title="Datos que tratamos">
      <ul>
        <li>Identificación y contacto: nombres, documento de identidad, fecha de nacimiento, dirección, correo y teléfono.</li>
        <li>Datos académicos: matrícula, sección o programa, horarios, asistencia, calificaciones, actas y certificados.</li>
        <li>Datos de los apoderados y la relación con cada estudiante a su cargo.</li>
        <li>Datos del personal: cargo, cursos asignados, asistencia y legajo.</li>
        <li>Datos de pagos: conceptos, cuotas y comprobantes.</li>
        <li>Lo que nos escribas en los formularios de contacto o en el Libro de Reclamaciones.</li>
      </ul>
    </LegalBlock>
    <LegalBlock id="finalidades" index={3} title="Finalidades">
      <ul>
        <li>Atender la admisión, la matrícula y los traslados.</li>
        <li>Gestionar la vida académica: horarios, asistencia, evaluaciones, tutoría y documentos oficiales.</li>
        <li>Enviar comunicados, anuncios y avisos a estudiantes, familias y personal.</li>
        <li>Gestionar pensiones y pagos.</li>
        <li>Responder consultas, reclamos y quejas, y cumplir las obligaciones que fija la normativa educativa.</li>
      </ul>
      <p>No usamos tus datos para fines distintos ni los vendemos a terceros.</p>
    </LegalBlock>
    <LegalBlock id="menores" index={4} title="Menores de edad">
      <p>Los datos de estudiantes menores de edad se tratan con el consentimiento de sus padres, madres o apoderados cuando la ley lo exige. Cada apoderado accede solo a la información de los estudiantes a su cargo.</p>
    </LegalBlock>
    <LegalBlock id="sensibles" index={5} title="Datos sensibles">
      <p>
        La información de <strong>psicología</strong>, acompañamiento, salud y necesidades educativas especiales es sensible. Solo la ven las personas autorizadas (por ejemplo, el área de psicología o de tutoría), sus accesos quedan registrados y no se incluye en reportes generales.
      </p>
    </LegalBlock>
    <LegalBlock id="imagen" index={6} title="Fotografías y carnets">
      <p>La fotografía de estudiantes y personal se usa para su carnet o fotocheck de identificación y para el control de asistencia. Cualquier otro uso de imágenes (por ejemplo, en actividades o publicaciones) requiere autorización previa.</p>
    </LegalBlock>
    <LegalBlock id="conservacion" index={7} title="Conservación">
      <p>Los registros académicos oficiales (actas, certificados y notas) se conservan por el plazo que exige la normativa educativa. Los demás datos se conservan mientras dure la relación con la institución y luego se eliminan o anonimizan. Las consultas del formulario de contacto se conservan hasta dos años.</p>
    </LegalBlock>
    <LegalBlock id="destinatarios" index={8} title="Destinatarios">
      <p>Compartimos datos con las autoridades educativas cuando la ley lo exige y con proveedores que nos ayudan a operar los servicios (sistema de gestión académica, alojamiento, correo y mensajería), bajo obligaciones de confidencialidad. Si alguno se ubica fuera del Perú, el flujo transfronterizo se realiza con las garantías que exige la normativa.</p>
    </LegalBlock>
    <LegalBlock id="seguridad" index={9} title="Seguridad">
      <p>Aplicamos medidas técnicas y organizativas: conexiones cifradas, acceso restringido según el rol de cada persona, copias de respaldo y registros de actividad.</p>
    </LegalBlock>
    <LegalBlock id="derechos" index={10} title="Derechos ARCO">
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición escribiendo a{' '}
        <a className={linkClassName} href={`mailto:${siteConfig.emails.privacy}`}>
          {siteConfig.emails.privacy}
        </a>{' '}
        o en secretaría, con una copia de tu documento de identidad. Si eres apoderado, puedes ejercerlos también en nombre de los estudiantes menores a tu cargo. Si no estás conforme con la respuesta, puedes acudir a la Autoridad Nacional de Protección de Datos Personales.
      </p>
    </LegalBlock>
    <LegalBlock id="cookies" index={11} title="Cookies">
      <p>Este sitio solo usa almacenamiento local para recordar tu preferencia de tema (claro, oscuro o sistema) y cookies técnicas para mantener tu sesión. Si en el futuro incorporamos analítica, te pediremos consentimiento antes de activarla.</p>
    </LegalBlock>
  </LegalPage>
);
