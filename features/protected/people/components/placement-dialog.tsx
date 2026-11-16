'use client';

import { useState, type JSX } from 'react';
import { Sparkles } from 'lucide';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { controlClassName, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { items, todayISO } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { createPlacementAction, searchStudentsAction } from '../actions/people-actions';
import { equivalenceOrigins, fullName, placementKindHints, placementKindLabels } from '../data/people-data';
import { useDebounced } from '../hooks/use-debounced';
import { usePlanAreas } from '../hooks/use-plan-areas';
import { useProposePlacement } from '../hooks/use-propose-placement';
import type { Placement, PlacementDialogProps, PlacementFormValues, Student } from '../types';
import { SearchBox } from './people-ui';

// Registers a placement procedure: the student, the kind, where they come from and what they bring, the cycle and
// grade (the cuadro de equivalencias can propose it) and the areas validated
export const PlacementDialog = ({ slug, ctx, onClose, onSaved }: PlacementDialogProps): JSX.Element => {
  const [today] = useState(todayISO);
  const [picked, setPicked] = useState<Student | null>(null);
  const [search, setSearch] = useState('');
  const [origin, setOrigin] = useState('ebr_primaria');
  const [passed, setPassed] = useState('6');
  const [proposal, setProposal] = useState('');
  const query = useDebounced(search);
  const first = ctx.levels[0];
  const { values, errors, isPending, setField, submit } = useAcademicForm<PlacementFormValues, Placement>({
    initial: { studentId: '', kind: 'validation', levelId: first?.id ?? '', gradeId: first?.grades[0]?.id ?? '', decidedOn: today, reference: '', notes: '', origin: '', originStudies: '', subjectIds: [] },
    validate: (v): Record<string, string> => ({
      ...(v.studentId ? {} : { studentId: 'Elige un estudiante.' }),
      ...((v.kind === 'validation' || v.kind === 'revalidation') && !v.originStudies.trim() ? { originStudies: 'Indica los estudios que trae.' } : {}),
    }),
    save: (v) => createPlacementAction(slug, v),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });
  const { data: results } = useAcademicData(`placement-search:${slug}:${query}`, async () => (picked ? { ok: true as const, data: [] as Student[] } : searchStudentsAction(slug, query, '')));
  const areas = usePlanAreas(slug, values.kind === 'placement_test' ? '' : values.levelId);
  const { propose, isProposing } = useProposePlacement(slug);
  const level = ctx.levels.find((l) => l.id === values.levelId);

  const pickLevel = (levelId: string): void => {
    setField('levelId', levelId);
    setField('gradeId', ctx.levels.find((l) => l.id === levelId)?.grades[0]?.id ?? '');
    setField('subjectIds', []);
  };
  const applyProposal = (): void => {
    void propose(origin, Number(passed)).then((p): void => {
      if (!p) return;
      if (p.done) {
        setProposal('Con esos estudios ya concluyó la Educación Básica: no hay grado de ingreso.');
        return;
      }
      if (p.levelId !== values.levelId) setField('subjectIds', []);
      setField('levelId', p.levelId);
      setField('gradeId', p.gradeId);
      if (!values.originStudies.trim()) setField('originStudies', `${passed}.° de ${origin === 'ebr_primaria' ? 'primaria' : 'secundaria'}, EBR`);
      setProposal(`El cuadro de equivalencias propone ${p.gradeName} del ${p.levelName}. La dirección decide con la evaluación.`);
    });
  };
  const toggleArea = (id: string, on: boolean): void => setField('subjectIds', on ? [...values.subjectIds, id] : values.subjectIds.filter((x) => x !== id));

  return (
    <FormDialog title="Registrar ubicación o convalidación" description="Con el acta firmada por la dirección, el estudiante se matricula en el grado que fija." submitLabel="Registrar" isPending={isPending} onSubmit={submit} onClose={onClose} wide>
      <FormField id="pl-student" label="Estudiante" required error={errors.studentId}>
        {picked ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-brand/40 bg-brand-soft px-4 py-2.5 text-sm">
            <span className="font-medium text-foreground">{fullName(picked)}</span>
            <button type="button" className="text-sm font-medium text-brand hover:underline" onClick={(): void => { setPicked(null); setField('studentId', ''); }}>
              Cambiar
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <SearchBox value={search} onChange={setSearch} placeholder="Nombre, código o DNI" autoFocus />
            <ul className="max-h-44 divide-y divide-border overflow-y-auto rounded-lg border border-border">
              {(results ?? []).map((s) => (
                <li key={s.id}>
                  <button type="button" className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-secondary" onClick={(): void => { setPicked(s); setField('studentId', s.id); }}>
                    <span className="text-foreground">{fullName(s)}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{s.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="pl-kind" label="Trámite" required hint={placementKindHints[values.kind]}>
          <SelectField id="pl-kind" value={values.kind} options={items(placementKindLabels)} onChange={(v): void => { setField('kind', v); if (v === 'placement_test') setField('subjectIds', []); }} />
        </FormField>
        <FormField id="pl-date" label="Fecha" required error={errors.decidedOn}>
          <Input id="pl-date" type="date" max={today} value={values.decidedOn} onChange={(e): void => setField('decidedOn', e.target.value)} className={controlClassName} />
        </FormField>
        <FormField id="pl-origin" label="Procedencia" error={errors.origin} hint="Institución o programa de origen.">
          <Input id="pl-origin" placeholder="Ej.: IE N.° 38001, Huamanga" value={values.origin} maxLength={160} onChange={(e): void => setField('origin', e.target.value)} className={controlClassName} />
        </FormField>
        <FormField id="pl-studies" label={values.kind === 'placement_test' ? 'Resultado de la prueba' : 'Estudios que acredita'} required={values.kind === 'validation' || values.kind === 'revalidation'} error={errors.originStudies}>
          <Input id="pl-studies" placeholder={values.kind === 'placement_test' ? 'Ej.: Logro esperado en comunicación y matemática' : 'Ej.: 6.° de primaria, EBR'} value={values.originStudies} maxLength={160} onChange={(e): void => setField('originStudies', e.target.value)} className={controlClassName} />
        </FormField>
      </div>

      {(values.kind === 'validation' || values.kind === 'revalidation') && (
        <div className="space-y-2 rounded-xl border border-border bg-surface p-3">
          <p className="text-sm font-medium text-foreground">Cuadro de equivalencias (RVM N.° 0018-2007-ED)</p>
          <div className="flex flex-wrap items-end gap-2">
            <div className="w-44">
              <SelectField id="pl-eq-origin" value={origin} options={items(equivalenceOrigins)} onChange={setOrigin} />
            </div>
            <div className="w-36">
              <SelectField id="pl-eq-passed" value={passed} options={Array.from({ length: origin === 'ebr_primaria' ? 7 : 6 }, (_, i) => ({ value: String(i), label: i === 0 ? 'Ningún grado' : `${i}.° aprobado` }))} onChange={setPassed} />
            </div>
            <button type="button" className="btn-alt h-10" disabled={isProposing} onClick={applyProposal}>
              <MorphIcon icon={Sparkles} size={14} />
              {isProposing ? 'Consultando…' : 'Proponer grado'}
            </button>
          </div>
          {proposal && <p className="text-xs text-muted-foreground">{proposal}</p>}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="pl-level" label="Ciclo" required error={errors.levelId}>
          <SelectField id="pl-level" value={values.levelId} options={ctx.levels.map((l) => ({ value: l.id, label: l.name }))} onChange={pickLevel} />
        </FormField>
        <FormField id="pl-grade" label="Grado en que se ubica" required error={errors.gradeId}>
          <SelectField id="pl-grade" value={values.gradeId} options={(level?.grades ?? []).map((g) => ({ value: g.id, label: g.name }))} onChange={(v): void => setField('gradeId', v)} />
        </FormField>
      </div>

      {values.kind !== 'placement_test' && (areas.data ?? []).length > 0 && (
        <FormField id="pl-areas" label="Áreas convalidadas" error={errors.subjectIds} hint="Las que el estudiante ya no vuelve a cursar.">
          <div className="grid gap-2 sm:grid-cols-2">
            {(areas.data ?? []).map((a) => (
              <label key={a.id} htmlFor={`pl-area-${a.id}`} className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox id={`pl-area-${a.id}`} checked={values.subjectIds.includes(a.id)} onCheckedChange={(c): void => toggleArea(a.id, c === true)} />
                {a.name}
              </label>
            ))}
          </div>
        </FormField>
      )}

      <FormField id="pl-reference" label="Referencia" error={errors.reference} hint="Certificado, informe o resolución que respalda el trámite.">
        <Input placeholder="Ej.: Certificado de estudios N.° 0012345" id="pl-reference" value={values.reference} maxLength={120} onChange={(e): void => setField('reference', e.target.value)} className={controlClassName} />
      </FormField>
      <FormField id="pl-notes" label="Observaciones" error={errors.notes}>
        <Textarea placeholder="Se imprimen en el acta" id="pl-notes" rows={2} maxLength={1000} value={values.notes} onChange={(e): void => setField('notes', e.target.value)} className="rounded-lg bg-background" />
      </FormField>
    </FormDialog>
  );
};
