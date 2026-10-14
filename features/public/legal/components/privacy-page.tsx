import type { JSX } from 'react';
import { ArrowRight, Cookie, Database, FileText, GraduationCap, Handshake, LockKeyhole, Scale, ShieldCheck, UserRound, UsersRound, Workflow, BadgeCheck, ContactRound, History, CheckCircle2, Eye, Pencil, Trash2, Ban, Server, ReceiptText, BookOpenCheck, BrainCircuit, FileCheck2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LegalPage } from './legal-page';
import { LegalSectionHeading } from './legal-section-heading';
import { PrivacyRightsForm } from './privacy-rights-form';

const sections = [
  { id: 'marco-legal', title: 'Introducción y marco legal' },
  { id: 'responsable', title: 'Responsable del tratamiento' },
  { id: 'datos', title: 'Datos personales recopilados' },
  { id: 'finalidades', title: 'Finalidades del tratamiento' },
  { id: 'menores', title: 'Datos de menores de edad' },
  { id: 'inteligencia-artificial', title: 'Herramientas educativas' },
  { id: 'convivencia', title: 'Convivencia escolar virtual' },
  { id: 'terceros', title: 'Transferencia a terceros' },
  { id: 'conservacion', title: 'Conservación de la información' },
  { id: 'seguridad', title: 'Medidas de seguridad' },
  { id: 'derechos-arco', title: 'Derechos sobre los datos' },
  { id: 'solicitud-arco', title: 'Formulario de solicitud ARCO' },
  { id: 'cookies', title: 'Cookies y sesión virtual' },
  { id: 'cambios', title: 'Actualizaciones de la política' },
  { id: 'autoridad', title: 'Canales de contacto y autoridad' },
];

export const PrivacyPage = (): JSX.Element => (
  <LegalPage eyebrow="Transparencia y legal" title="Política de Privacidad y Protección de Datos Personales" summary="Conoce cómo se tratan los datos personales de estudiantes, familias, tutores y docentes en los servicios educativos y canales digitales de CEBA Joseph Lister." tags={['Ley N.° 29733', 'D.S. N.° 016-2024-JUS', 'Protección de datos personales']} sections={sections} icon={ShieldCheck}>
    <section id="resumen" className="scroll-mt-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Resumen ejecutivo</p>
      <h2 className="mt-2 font-heading text-xl font-bold text-foreground">Lo esencial sobre tus datos</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          { title: '¿Qué datos?', body: 'Datos de identificación, contacto, información académica y los necesarios para atender solicitudes educativas.', icon: Database },
          { title: '¿Para qué?', body: 'Para gestionar consultas, matrícula, acompañamiento educativo y obligaciones institucionales aplicables.', icon: GraduationCap },
          { title: '¿Con quién?', body: 'Solo con personal y proveedores que necesiten los datos para prestar el servicio, además de comunicaciones exigidas por ley.', icon: UsersRound },
          { title: 'Tus derechos', body: 'Puedes solicitar acceso, rectificación, cancelación u oposición según la normativa aplicable.', icon: Scale },
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
    <section id="marco-legal" className="scroll-mt-24">
      <LegalSectionHeading icon={FileText} number="01" title="Introducción y marco legal" />
      <p>Esta política describe los criterios generales de tratamiento de datos personales vinculados con los servicios educativos y la atención de consultas de CEBA Joseph Lister. El tratamiento se realiza de acuerdo con la Ley N.° 29733, su reglamento aprobado por el Decreto Supremo N.° 016-2024-JUS y demás normas aplicables.</p>
      <p>Aplica a estudiantes, familias, tutores, docentes y personas que interactúan con los canales institucionales.</p>
    </section>
    <section id="responsable" className="scroll-mt-24">
      <LegalSectionHeading icon={ContactRound} number="02" title="Responsable del tratamiento" />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Institución</p>
          <p className="mt-1 font-semibold text-foreground">CEBA Privado Virtual Joseph Lister</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Contacto</p>
          <a className="mt-1 block font-semibold text-secondary underline underline-offset-4" href="mailto:informes@cebajosephlister.edu.pe">
            informes@cebajosephlister.edu.pe
          </a>
          <p className="mt-1">Jr. 28 de Julio, Huamanga, Ayacucho</p>
        </div>
      </div>
    </section>
    <section id="datos" className="scroll-mt-24">
      <LegalSectionHeading icon={Database} number="03" title="Datos personales recopilados" />
      <p>Se recopilan los datos que la persona proporciona y los que resultan necesarios para la relación educativa o la atención solicitada. Según el servicio, pueden incluir:</p>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        <li>Identificación y filiación, como nombres y documento de identidad.</li>
        <li>Contacto y residencia, como dirección, teléfono y correo electrónico.</li>
        <li>Información académica, asistencia, evaluaciones y documentos de trayectoria escolar.</li>
        <li>Información de pago y facturación cuando corresponda.</li>
        <li>Registros técnicos básicos de acceso y uso de las plataformas virtuales.</li>
      </ul>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {[
          { title: 'Identificación y filiación', text: 'Nombres, documento de identidad, fecha de nacimiento y datos de familiares o representantes cuando sean necesarios.' },
          { title: 'Información académica', text: 'Matrícula, trayectoria escolar, asistencia, evaluaciones, actividades y documentos educativos.' },
          { title: 'Contacto y residencia', text: 'Domicilio, teléfono, correo electrónico y datos de contacto de madres, padres o tutores.' },
          { title: 'Datos económicos', text: 'Información de pagos, comprobantes y facturación relacionada con el servicio.' },
          { title: 'Uso de plataformas', text: 'Registros técnicos de acceso, sesión, actividad y seguridad del campus virtual.' },
        ].map(({ title, text }) => <div key={title} className="rounded-lg border border-border bg-background p-3"><h3 className="text-xs font-semibold text-foreground">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div>)}
      </div>
    </section>
    <section id="finalidades" className="scroll-mt-24">
      <LegalSectionHeading icon={Workflow} number="04" title="Finalidades del tratamiento" />
      <p>La información se utiliza para atender consultas, gestionar procesos de admisión y matrícula, organizar el servicio educativo, mantener la comunicación con estudiantes y familias, registrar el progreso académico y cumplir obligaciones administrativas y legales.</p>
      <p>Cuando una finalidad requiera consentimiento, este se solicitará de manera previa y conforme a las reglas aplicables.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4"><h3 className="flex items-center gap-2 text-xs font-semibold text-foreground"><CheckCircle2 className="size-4 text-secondary" />Necesarias para el servicio educativo</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-muted-foreground"><li>Admisión, matrícula y gestión del expediente educativo.</li><li>Organización de clases, tutoría, asistencia y evaluación.</li><li>Comunicación académica con el estudiante y su representante.</li><li>Atención de solicitudes y cumplimiento de obligaciones aplicables.</li></ul></div>
        <div className="rounded-lg border border-border bg-background p-4"><h3 className="flex items-center gap-2 text-xs font-semibold text-foreground"><ShieldCheck className="size-4 text-primary" />Finalidades complementarias</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">El envío de novedades o comunicaciones no indispensables se realiza únicamente cuando corresponda y con la base legal o autorización necesaria. La persona puede solicitar que cesen esas comunicaciones.</p></div>
      </div>
    </section>
    <section id="menores" className="scroll-mt-24">
      <LegalSectionHeading icon={UserRound} number="05" title="Datos de menores de edad" />
      <p>Cuando el tratamiento involucre a una persona menor de edad, la institución aplica las salvaguardas y reglas de representación o consentimiento que correspondan según su edad, el tipo de dato y la normativa aplicable. La información se utiliza en el marco de la prestación educativa y el interés superior del estudiante.</p>
      <div className="mt-3 flex gap-3 rounded-lg border border-secondary/20 bg-secondary/5 p-4"><UserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" /><p className="text-xs leading-5 text-muted-foreground">Cuando se requiera intervención de madre, padre o tutor, la institución podrá solicitar información para verificar la representación y autorización correspondiente. El acceso a los datos se limita a las personas que lo necesitan para la atención educativa.</p></div>
    </section>
    <section id="inteligencia-artificial" className="scroll-mt-24">
      <LegalSectionHeading icon={GraduationCap} number="06" title="Herramientas educativas y automatizadas" />
      <p>Si se utilizan herramientas digitales de apoyo al aprendizaje, estas no reemplazan la evaluación ni las decisiones pedagógicas del personal educativo. Los datos no se usarán para decisiones exclusivamente automatizadas con efectos significativos sin las garantías exigidas por la normativa.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-4"><h3 className="flex items-center gap-2 text-xs font-semibold"><BrainCircuit className="size-4 text-secondary" />Apoyo al aprendizaje</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">Las herramientas pueden ayudar a consultar materiales o recibir explicaciones y comentarios sobre actividades educativas.</p></div>
        <div className="rounded-lg border border-border bg-background p-4"><h3 className="flex items-center gap-2 text-xs font-semibold"><UserRound className="size-4 text-secondary" />Supervisión humana</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">Las decisiones pedagógicas y evaluaciones corresponden al personal educativo. Los resultados automatizados requieren revisión y contexto.</p></div>
      </div>
    </section>
    <section id="convivencia" className="scroll-mt-24">
      <LegalSectionHeading icon={UsersRound} number="07" title="Convivencia escolar virtual" />
      <p>Los registros de actividad en aulas y plataformas pueden utilizarse para mantener la seguridad, atender incidencias y apoyar la convivencia escolar, con acceso limitado al personal autorizado y conforme a las reglas institucionales.</p>
    </section>
    <section id="terceros" className="scroll-mt-24">
      <LegalSectionHeading icon={Handshake} number="08" title="Transferencia a terceros" />
      <p>Los datos pueden compartirse con autoridades educativas u otras entidades cuando sea necesario para cumplir obligaciones legales, y con proveedores que apoyen la operación de los servicios bajo instrucciones y medidas de confidencialidad y seguridad apropiadas.</p>
      <div className="mt-3 overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-[32rem] text-left text-xs"><thead className="bg-muted text-foreground"><tr><th className="p-3 font-semibold">Destinatario</th><th className="p-3 font-semibold">Finalidad</th><th className="p-3 font-semibold">Salvaguarda</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3">Autoridades educativas</td><td className="p-3">Gestiones y registros vinculados al servicio educativo.</td><td className="p-3">Solo los datos necesarios para el trámite.</td></tr><tr><td className="p-3">Proveedores tecnológicos</td><td className="p-3">Alojamiento, comunicación y soporte de plataformas.</td><td className="p-3">Acceso limitado y obligaciones de protección.</td></tr><tr><td className="p-3">Autoridades competentes</td><td className="p-3">Atención de requerimientos conforme a ley.</td><td className="p-3">Entrega conforme al requerimiento aplicable.</td></tr></tbody></table></div>
    </section>
    <section id="conservacion" className="scroll-mt-24">
      <LegalSectionHeading icon={History} number="09" title="Conservación de la información" />
      <p>La información se conserva durante el tiempo necesario para cumplir la finalidad para la que fue recabada y los plazos de conservación establecidos por las obligaciones educativas, administrativas o legales aplicables.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">{[{ title: 'Expediente académico', text: 'Se conserva según las obligaciones y necesidades de gestión educativa.', icon: BookOpenCheck }, { title: 'Registros administrativos', text: 'Se mantienen por los plazos aplicables a obligaciones administrativas y tributarias.', icon: ReceiptText }, { title: 'Registros de acceso', text: 'Se conservan el tiempo necesario para la operación y seguridad de los sistemas.', icon: Server }].map(({ title, text, icon: Icon }) => <div key={title} className="rounded-lg border border-border bg-background p-3"><Icon aria-hidden="true" className="size-4 text-secondary" /><h3 className="mt-2 text-xs font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div>)}</div>
    </section>
    <section id="seguridad" className="scroll-mt-24">
      <LegalSectionHeading icon={LockKeyhole} number="10" title="Medidas de seguridad" />
      <p>La institución adopta medidas organizativas y técnicas razonables para proteger los datos frente a pérdida, alteración, divulgación o acceso no autorizado. El acceso se limita a quienes lo necesitan para cumplir sus funciones.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">{['Accesos individuales y permisos según funciones', 'Protección de sesiones y credenciales', 'Respaldo y continuidad de los servicios', 'Atención de incidentes de seguridad'].map((item) => <p key={item} className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground"><ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-secondary" />{item}</p>)}</div>
    </section>
    <section id="derechos-arco" className="scroll-mt-24">
      <LegalSectionHeading icon={BadgeCheck} number="11" title="Derechos sobre los datos personales" />
      <p>
        La persona titular puede ejercer los derechos de acceso, rectificación, cancelación y oposición, así como los demás derechos previstos por la normativa. Para iniciar una solicitud, escribe a{' '}
        <a className="font-medium text-secondary underline underline-offset-4" href="mailto:informes@cebajosephlister.edu.pe?subject=Solicitud%20de%20datos%20personales">
          informes@cebajosephlister.edu.pe
        </a>{' '}
        e indica el derecho que deseas ejercer. La institución podrá solicitar información razonable para verificar la identidad.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">{[{ title: 'Acceso', text: 'Solicita información sobre tus datos y su tratamiento.', icon: Eye, time: '20 días hábiles' }, { title: 'Rectificación', text: 'Pide corregir o actualizar datos inexactos o incompletos.', icon: Pencil, time: '10 días hábiles' }, { title: 'Cancelación', text: 'Solicita la supresión cuando corresponda conforme a ley.', icon: Trash2, time: '10 días hábiles' }, { title: 'Oposición', text: 'Solicita que cese un tratamiento en los supuestos aplicables.', icon: Ban, time: '10 días hábiles' }].map(({ title, text, icon: Icon, time }) => <div key={title} className="flex gap-3 rounded-lg border border-border bg-background p-3"><Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" /><div><h3 className="text-xs font-semibold text-foreground">{title}<span className="ml-1 font-normal text-muted-foreground">· {time}</span></h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div></div>)}</div>
    </section>
    <section id="solicitud-arco" className="scroll-mt-24">
      <LegalSectionHeading icon={FileCheck2} number="12" title="Formulario de solicitud ARCO" />
      <p>Completa estos datos para preparar una solicitud dirigida a la institución. Al enviarla, se abrirá tu aplicación de correo para que revises y remitas el mensaje.</p>
      <PrivacyRightsForm />
    </section>
    <section id="cookies" className="scroll-mt-24">
      <LegalSectionHeading icon={Cookie} number="13" title="Cookies y sesión virtual" />
      <p>El sitio puede utilizar cookies técnicas necesarias para mantener sesiones y proteger formularios. Las cookies no esenciales, si se habilitan, se informarán y gestionarán de acuerdo con las opciones disponibles y la normativa aplicable.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-lg border border-border bg-background p-3"><p className="inline-flex items-center gap-2 text-xs font-semibold"><LockKeyhole className="size-4 text-secondary" />Cookies necesarias</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Permiten funciones esenciales como mantener una sesión activa o proteger un formulario.</p></div><div className="rounded-lg border border-border bg-background p-3"><p className="inline-flex items-center gap-2 text-xs font-semibold"><Eye className="size-4 text-secondary" />Cookies opcionales</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Las cookies no esenciales requieren la información y opciones de consentimiento que correspondan.</p></div></div>
    </section>
    <section id="cambios" className="scroll-mt-24">
      <LegalSectionHeading icon={FileText} number="14" title="Actualizaciones de la política" />
      <p>Esta política puede actualizarse cuando cambien los servicios o las obligaciones aplicables. La versión vigente estará disponible en esta página y las modificaciones relevantes se comunicarán por los canales institucionales correspondientes.</p>
    </section>
    <section id="autoridad" className="scroll-mt-24">
      <LegalSectionHeading icon={Scale} number="15" title="Canales de contacto y autoridad" />
      <p>
        Para consultas sobre privacidad, comunícate con la institución en{' '}
        <a className="font-medium text-secondary underline underline-offset-4" href="mailto:informes@cebajosephlister.edu.pe">
          informes@cebajosephlister.edu.pe
        </a>{' '}
        o al (066) 31-4520. Si consideras que tus derechos no fueron atendidos, puedes acudir a la Autoridad Nacional de Protección de Datos Personales por los canales oficiales del Estado peruano.
      </p>
      <div className="mt-3 rounded-lg border border-border bg-background p-4"><h3 className="text-xs font-semibold text-foreground">Autoridad Nacional de Protección de Datos Personales</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Si no recibes respuesta o no estás conforme con ella, puedes consultar los procedimientos disponibles ante la autoridad nacional.</p><a className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-secondary underline underline-offset-4" href="https://www.gob.pe/9269-iniciar-procedimiento-para-el-ejercicio-de-derechos-de-acceso-rectificacion-cancelacion-y-oposicion" target="_blank" rel="noreferrer">Consultar el procedimiento oficial <ArrowRight aria-hidden="true" className="size-3.5" /></a></div>
    </section>
  </LegalPage>
);
