'use client';

import { useState, useTransition, type JSX } from 'react';
import { ArrowLeft, Award, GraduationCap } from 'lucide';
import { sileo } from 'sileo';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { SearchBox } from '@/features/protected/people/components/people-ui';
import { useDebounced } from '@/features/protected/people/hooks/use-debounced';
import { isProgramsEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getMyRecordsAction, getProgramsAction, getRecordAction, listCertificatesAction, listProgramStudentsAction, setCoordinatorAction } from '../actions/programs-actions';
import type { ProgramsData, StudentProgress } from '../types';
import { CertificateScreen } from './certificate-doc';
import { RecordView } from './record-view';

type Open = { kind: 'record'; id: string } | { kind: 'certificate'; id: string } | null;
type Mode = 'certificates' | 'degrees';

// Certificados (modular) and Titulación share the students' records; families see their own record in both
export const CertificatesPage = (): JSX.Element => <RecordsPage mode="certificates" />;
export const DegreesPage = (): JSX.Element => <RecordsPage mode="degrees" />;

const RecordsPage = ({ mode }: { mode: Mode }): JSX.Element => {
  const slug = useInstitutionSlug();
  const mine = useAcademicData(`my-records:${slug}`, () => getMyRecordsAction(slug), isProgramsEvent);
  const programs = useAcademicData(`programs:${slug}`, () => getProgramsAction(slug), isProgramsEvent);
  const [open, setOpen] = useState<Open>(null);
  const title = mode === 'certificates' ? 'Certificados modulares' : 'Titulación';
  const description =
    mode === 'certificates'
      ? 'El expediente de cada estudiante por módulo formativo: unidades didácticas, experiencia formativa y el certificado de cada módulo terminado.'
      : 'Quienes concluyen el plan de estudios, sus requisitos de titulación y el título de Profesional Técnico.';

  if (mine.data && mine.data.length > 0) {
    const record = mine.data[0];
    return (
      <AcademicPage titleId="records-title" title={mode === 'certificates' ? 'Mi expediente' : 'Mi titulación'} description="Tus unidades aprobadas, tus experiencias formativas, tus certificados y lo que te falta para titularte." context={null}>
        {open?.kind === 'certificate' ? <CertificateScreen slug={slug} id={open.id} onBack={(): void => setOpen(null)} /> : <RecordView slug={slug} record={record} onChanged={mine.reload} onCertificate={(id): void => setOpen({ kind: 'certificate', id })} />}
      </AcademicPage>
    );
  }

  return (
    <AcademicPage titleId="records-title" title={title} description={description} context={null}>
      {programs.error ? (
        <LoadError message={programs.error} onRetry={programs.reload} />
      ) : !programs.data ? (
        <PageSkeleton />
      ) : open?.kind === 'certificate' ? (
        <CertificateScreen slug={slug} id={open.id} canAnnul={programs.data.canAssign} onBack={(): void => setOpen(null)} />
      ) : open?.kind === 'record' ? (
        <RecordScreen slug={slug} id={open.id} onBack={(): void => setOpen(null)} onCertificate={(id): void => setOpen({ kind: 'certificate', id })} />
      ) : (
        <Lists slug={slug} mode={mode} data={programs.data} reload={programs.reload} onOpen={setOpen} />
      )}
    </AcademicPage>
  );
};

const RecordScreen = ({ slug, id, onBack, onCertificate }: { slug: string; id: string; onBack: () => void; onCertificate: (id: string) => void }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`record:${slug}:${id}`, () => getRecordAction(slug, id), isProgramsEvent);
  return (
    <div className="space-y-4">
      <button type="button" className="btn-alt" onClick={onBack}>
        <MorphIcon icon={ArrowLeft} size={16} />
        Volver a la lista
      </button>
      {error ? <LoadError message={error} onRetry={reload} /> : !data ? <PageSkeleton /> : <RecordView slug={slug} record={data} onChanged={reload} onCertificate={onCertificate} />}
    </div>
  );
};

const Lists = ({ slug, mode, data, reload, onOpen }: { slug: string; mode: Mode; data: ProgramsData; reload: () => void; onOpen: (o: Open) => void }): JSX.Element => {
  const [levelId, setLevelId] = useState(data.programs[0]?.levelId ?? '');
  const [tab, setTab] = useState<'students' | 'issued'>('students');
  const [query, setQuery] = useState('');
  const debounced = useDebounced(query);
  const program = data.programs.find((p) => p.levelId === levelId) ?? data.programs[0];
  const students = useAcademicData(`program-students:${slug}:${program?.levelId}:${debounced}`, () => listProgramStudentsAction(slug, program?.levelId ?? '', debounced), isProgramsEvent);
  const certs = useAcademicData(`program-certs:${slug}:${program?.levelId}:${mode}`, () => listCertificatesAction(slug, program?.levelId ?? '', mode === 'certificates' ? 'modular' : 'degree'), isProgramsEvent);
  const [isPending, startTransition] = useTransition();
  const rows = (students.data ?? []).filter((s) => mode === 'certificates' || s.approvedCredits === s.totalCredits || s.status === 'graduated');

  const assign = (staffId: string): void =>
    startTransition(async () => {
      const r = await setCoordinatorAction(slug, program?.levelId ?? '', staffId);
      if (!r.ok) sileo.error({ title: 'No se pudo guardar', description: r.message });
      else {
        sileo.success({ title: r.message ?? 'Listo' });
        reload();
      }
    });

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-3">
        {data.programs.map((p) => (
          <button key={p.levelId} type="button" onClick={(): void => setLevelId(p.levelId)} className={cn('rounded-2xl border p-4 text-left transition-colors', p.levelId === program?.levelId ? 'border-brand bg-brand/5' : 'border-border bg-background hover:border-foreground/25')}>
            <span className="block font-semibold text-foreground">{p.name}</span>
            <span className="mt-1 block text-xs text-muted-foreground tabular-nums">
              {p.students} estudiantes · {p.modules} módulos · {p.totalCredits} créditos
            </span>
            <span className="mt-2 flex flex-wrap gap-3 text-xs tabular-nums">
              <span className="flex items-center gap-1 text-foreground">
                <MorphIcon icon={Award} size={12} className="text-brand" />
                {p.modulars} {p.modulars === 1 ? 'certificado' : 'certificados'}
              </span>
              <span className="flex items-center gap-1 text-foreground">
                <MorphIcon icon={GraduationCap} size={12} className="text-brand" />
                {p.degrees} {p.degrees === 1 ? 'título' : 'títulos'}
              </span>
            </span>
            <span className="mt-1 block truncate text-xs text-muted-foreground">Coordinación: {p.coordinatorName || 'sin asignar'}</span>
          </button>
        ))}
      </div>
      {data.canAssign && program && (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-muted-foreground">Coordinador(a) de {program.name}:</span>
          <div className="w-72">
            <SelectField id="program-coordinator" value={program.coordinatorId} disabled={isPending} options={[{ value: '', label: 'Sin asignar' }, ...data.staff.map((s) => ({ value: s.id, label: `${s.surnames}, ${s.givenNames}` }))]} onChange={assign} />
          </div>
          <span className="text-xs text-muted-foreground">Para que entre al panel, dale el rol «Coordinador de programa» desde Docentes y personal.</span>
        </div>
      )}
      <div role="tablist" aria-label="Vistas" className="flex gap-1 border-b border-border">
        {(
          [
            ['students', mode === 'certificates' ? 'Expedientes' : 'Por titularse'],
            ['issued', mode === 'certificates' ? 'Certificados emitidos' : 'Títulos emitidos'],
          ] as Array<['students' | 'issued', string]>
        ).map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={(): void => setTab(k)} className={cn('-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors', tab === k ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'students' ? (
        <>
          <SearchBox value={query} onChange={setQuery} placeholder="Buscar por nombre, código o DNI" />
          {students.error ? (
            <LoadError message={students.error} onRetry={students.reload} />
          ) : !students.data ? (
            <PageSkeleton />
          ) : rows.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">{mode === 'degrees' ? 'Nadie ha concluido el plan de estudios todavía.' : 'Sin estudiantes.'}</p>
          ) : (
            <StudentsTable rows={rows} mode={mode} onOpen={(id): void => onOpen({ kind: 'record', id })} />
          )}
        </>
      ) : !certs.data ? (
        <PageSkeleton />
      ) : certs.data.certificates.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Aún no hay documentos emitidos.</p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
          {certs.data.certificates.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={(): void => onOpen({ kind: 'certificate', id: c.id })} className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left text-sm hover:bg-surface">
                <span className="w-32 font-semibold text-foreground tabular-nums">{c.code}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-foreground">{c.studentName}</span>
                  <span className="block truncate text-xs text-muted-foreground">{c.kind === 'modular' ? c.moduleName : `Profesional Técnico en ${c.programName}`}</span>
                </span>
                <span className="text-xs text-muted-foreground">{formatDay(c.issuedOn)}</span>
                {c.status === 'annulled' && <span className="pill bg-destructive/12 text-destructive">Anulado</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const StudentsTable = ({ rows, mode, onOpen }: { rows: StudentProgress[]; mode: Mode; onOpen: (id: string) => void }): JSX.Element => (
  <div className="overflow-x-auto rounded-2xl border border-border bg-background">
    <table className="w-full min-w-[44rem] text-left text-sm">
      <thead>
        <tr className="border-b border-border text-muted-foreground">
          <th scope="col" className="px-4 py-3 font-medium">Estudiante</th>
          <th scope="col" className="px-4 py-3 font-medium">Semestre</th>
          <th scope="col" className="w-56 px-4 py-3 font-medium">Créditos</th>
          <th scope="col" className="px-4 py-3 font-medium">Experiencias</th>
          <th scope="col" className="px-4 py-3 font-medium">{mode === 'certificates' ? 'Certificados' : 'Título'}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((s) => {
          const pct = s.totalCredits ? Math.round((s.approvedCredits * 100) / s.totalCredits) : 0;
          return (
            <tr key={s.id} className="cursor-pointer hover:bg-surface" onClick={(): void => onOpen(s.id)}>
              <td className="px-4 py-2.5">
                <span className="block font-medium text-foreground">{s.name}</span>
                <span className="block text-xs text-muted-foreground tabular-nums">{s.code}</span>
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">{s.status === 'graduated' ? 'Egresado(a)' : s.semester}</td>
              <td className="px-4 py-2.5">
                <span className="block h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                  <span className="block h-full rounded-full bg-success" style={{ width: `${pct}%` }} />
                </span>
                <span className="mt-1 block text-xs text-muted-foreground tabular-nums">
                  {s.approvedCredits} de {s.totalCredits}
                </span>
              </td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground tabular-nums">
                {s.efsrtDone}/{s.efsrtTotal} aprobadas
              </td>
              <td className="px-4 py-2.5 text-xs tabular-nums">
                {mode === 'certificates' ? (
                  <span className={cn(s.certified === s.modules ? 'text-success' : 'text-foreground')}>
                    {s.certified}/{s.modules} módulos
                  </span>
                ) : s.degree ? (
                  <span className="pill bg-success/12 text-success">Titulado(a)</span>
                ) : (
                  <span className="pill bg-warning/14 text-warning">En trámite</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
