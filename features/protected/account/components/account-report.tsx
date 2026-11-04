import type { JSX } from 'react';
import { BrandMark } from '@/components/layout/brand-mark';
import { UserAvatar } from '@/features/protected/dashboard/components/user-avatar';
import { ACCOUNT_REPORT_TITLE, formatDate, formatDateTime } from '../data/account-data';
import type { AccountReportProps } from '../types';

// Print-only profile report (A4): institution header, identity, every data block, security and recent activity
export const AccountReport = ({ profile, photoUrl, generatedAt }: AccountReportProps): JSX.Element => (
  <article data-print-report aria-hidden="true" className="hidden bg-white p-[6mm] text-[10pt] leading-snug text-neutral-900 print:block">
    <header className="flex items-center justify-between border-b-2 border-[#c4520a] pb-[4mm]">
      <div className="flex items-center gap-[3mm]">
        <BrandMark className="size-[12mm]" />
        <div>
          <p className="text-[12pt] font-bold">{profile.institutionName}</p>
          <p className="text-[9pt] text-neutral-500">{ACCOUNT_REPORT_TITLE}</p>
        </div>
      </div>
      <p className="text-right text-[8pt] text-neutral-500">
        Generado el {generatedAt}
        <br />
        Documento informativo, sin valor oficial
      </p>
    </header>

    <section className="mt-[5mm] flex items-center gap-[5mm]">
      <UserAvatar name={profile.fullName} avatarUrl={photoUrl} className="size-[24mm] text-[16pt]" />
      <div>
        <p className="text-[16pt] font-bold">{profile.fullName}</p>
        <p className="text-neutral-600">
          {profile.roleLabel} · {profile.headline}
        </p>
        <p className="font-mono text-[9pt] text-neutral-600">{profile.code}</p>
      </div>
    </section>

    <div className="mt-[5mm] grid grid-cols-2 gap-[4mm]">
      {[...profile.sections, { id: 'contact', title: 'Contacto', fields: [{ label: 'Correo', value: profile.contact.email }, { label: 'Teléfono', value: profile.contact.phone }, { label: 'Dirección', value: profile.contact.address }] }].map(({ id, title, fields }): JSX.Element => (
        <section key={id} className="break-inside-avoid rounded-[2mm] border border-neutral-300 p-[3.5mm]">
          <h2 className="mb-[2mm] text-[10.5pt] font-bold text-[#9e4208]">{title}</h2>
          <dl className="space-y-[1.5mm]">
            {fields.map(({ label, value }): JSX.Element => (
              <div key={label} className="grid grid-cols-[36%_1fr] gap-[2mm]">
                <dt className="text-neutral-500">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>

    {profile.linked.length > 0 && (
      <section className="mt-[4mm] break-inside-avoid rounded-[2mm] border border-neutral-300 p-[3.5mm]">
        <h2 className="mb-[2mm] text-[10.5pt] font-bold text-[#9e4208]">Estudiantes a cargo</h2>
        {profile.linked.map(({ name, detail, code }): JSX.Element => (
          <p key={code}>
            {name} · {detail} · <span className="font-mono">{code}</span>
          </p>
        ))}
      </section>
    )}

    <section className="mt-[4mm] break-inside-avoid rounded-[2mm] border border-neutral-300 p-[3.5mm]">
      <h2 className="mb-[2mm] text-[10.5pt] font-bold text-[#9e4208]">Seguridad y actividad</h2>
      <p>
        Verificación en dos pasos: {profile.security.twoFactor ? 'activa' : 'inactiva'} · Contraseña cambiada el {formatDate(profile.security.passwordUpdatedAt)}
      </p>
      <ul className="mt-[2mm] space-y-[1mm]">
        {profile.activity.map(({ id, title, detail, at }): JSX.Element => (
          <li key={id} className="grid grid-cols-[42mm_1fr] gap-[2mm]">
            <span className="text-neutral-500">{formatDateTime(at)}</span>
            <span>
              {title} · {detail}
            </span>
          </li>
        ))}
      </ul>
    </section>
  </article>
);
