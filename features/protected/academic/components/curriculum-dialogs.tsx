'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { createCurriculumAction, duplicateCurriculumAction, saveCompetencyAction, saveModuleAction, saveSubjectAction, updateCurriculumAction } from '../actions/curriculum-actions';
import { assessedNoun, componentLabels, items, lower, subjectKindLabels, subjectKindsFor } from '../data/academic-data';
import { useAcademicForm } from '../hooks/use-academic-form';
import type { AcademicContext, Competency, CompetencyFormValues, Curriculum, Level, Module, ModuleFormValues, NewCurriculumValues, PlanValues, Subject, SubjectFormValues } from '../types';
import { ChoiceChips, controlClassName, SelectField } from './academic-ui';
import { FormDialog } from './form-dialog';

const digits = (value: string, max = 2): string => value.replace(/\D/g, '').slice(0, max);

interface NewCurriculumDialogProps {
  slug: string;
  context: AcademicContext;
  levels: Level[];
  templateLevelIds: string[];
  initialLevelId?: string;
  onClose: () => void;
  onSaved: (plan: Curriculum) => void;
}

// A new draft plan for a level: from the suggested plan of its kind (when there is one) or empty
export const NewCurriculumDialog = ({ slug, context, levels, templateLevelIds, initialLevelId, onClose, onSaved }: NewCurriculumDialogProps): JSX.Element => {
  const first = levels.find((l) => l.id === initialLevelId) ?? levels[0];
  const { values, errors, isPending, setField, submit } = useAcademicForm<NewCurriculumValues, Curriculum>({
    initial: { levelId: first?.id ?? '', name: '', fromTemplate: templateLevelIds.includes(first?.id ?? '') },
    validate: (v): Record<string, string> => (v.levelId ? {} : { levelId: 'Elige uno.' }),
    save: (v) => createCurriculumAction(slug, v),
    onSaved: (plan) => {
      onSaved(plan);
      onClose();
    },
  });
  const hasTemplate = templateLevelIds.includes(values.levelId);

  return (
    <FormDialog title="Nuevo plan de estudios" description="Empieza como borrador. Cuando esté listo, ponlo en vigencia." submitLabel="Crear plan" isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="plan-level" label={context.vocabulary?.level ?? 'Nivel'} required error={errors.levelId}>
        <SelectField
          id="plan-level"
          value={values.levelId}
          options={levels.map((l) => ({ value: l.id, label: l.name }))}
          onChange={(v): void => {
            setField('levelId', v);
            setField('fromTemplate', templateLevelIds.includes(v));
          }}
          invalid={Boolean(errors.levelId)}
        />
      </FormField>
      <FormField id="plan-name" label="Nombre" error={errors.name} hint="Vacío: «Plan CNEB», «Plan UNI», «Plan de estudios 2026»…">
        <Input id="plan-name" value={values.name} maxLength={80} onChange={(e): void => setField('name', e.target.value)} aria-invalid={Boolean(errors.name)} className={controlClassName} />
      </FormField>
      <label className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
        <span>
          <span className="block text-sm font-medium text-foreground">Partir del plan sugerido</span>
          <span className="block text-xs text-muted-foreground">{hasTemplate ? suggestedHint(context.institutionKind) : 'No hay un plan sugerido para esta opción: empezará vacío.'}</span>
        </span>
        <Switch checked={values.fromTemplate && hasTemplate} disabled={!hasTemplate} onCheckedChange={(next): void => setField('fromTemplate', next)} />
      </label>
    </FormDialog>
  );
};

const suggestedHint = (kind: string): string => {
  switch (kind) {
    case 'cepre':
      return 'Cursos del examen de admisión con sus horas y temas.';
    case 'institute':
      return 'Tres módulos, unidades didácticas con créditos y las EFSRT: 120 créditos.';
    default:
      return 'Áreas y competencias del Currículo Nacional, con horas de referencia.';
  }
};

interface PlanDialogProps {
  slug: string;
  plan: Curriculum;
  mode: 'edit' | 'duplicate';
  onClose: () => void;
  onSaved: (plan: Curriculum) => void;
}

// Edit the plan's name and notes, or copy it into a new draft version
export const PlanDialog = ({ slug, plan, mode, onClose, onSaved }: PlanDialogProps): JSX.Element => {
  const duplicate = mode === 'duplicate';
  const { values, errors, isPending, setField, submit } = useAcademicForm<PlanValues, Curriculum>({
    initial: { name: duplicate ? `${plan.name} (nueva versión)` : plan.name, notes: plan.notes },
    validate: (v): Record<string, string> => (v.name.trim().length < 3 ? { name: 'Escribe un nombre de 3 a 80 caracteres.' } : {}),
    save: (v) => (duplicate ? duplicateCurriculumAction(slug, plan.id, v.name) : updateCurriculumAction(slug, plan.id, v)),
    onSaved: (saved) => {
      onSaved(saved);
      onClose();
    },
  });

  return (
    <FormDialog
      title={duplicate ? 'Nueva versión del plan' : 'Editar plan'}
      description={duplicate ? `Copia todo el contenido de «${plan.name}» en un borrador. El plan vigente no cambia hasta que pongas la nueva versión en vigencia.` : undefined}
      submitLabel={duplicate ? 'Crear versión' : 'Guardar cambios'}
      isPending={isPending}
      onSubmit={submit}
      onClose={onClose}
    >
      <FormField id="plan-edit-name" label="Nombre" required error={errors.name}>
        <Input id="plan-edit-name" value={values.name} maxLength={80} onChange={(e): void => setField('name', e.target.value)} aria-invalid={Boolean(errors.name)} className={controlClassName} />
      </FormField>
      {!duplicate && (
        <FormField id="plan-edit-notes" label="Notas" error={errors.notes} hint="Resolución que lo aprueba, cambios respecto a la versión anterior…">
          <Textarea id="plan-edit-notes" rows={4} maxLength={1000} value={values.notes} onChange={(e): void => setField('notes', e.target.value)} className="rounded-lg bg-background" />
        </FormField>
      )}
    </FormDialog>
  );
};

interface ModuleDialogProps {
  slug: string;
  curriculumId: string;
  module: Module | null;
  onClose: () => void;
  onSaved: () => void;
}

export const ModuleDialog = ({ slug, curriculumId, module, onClose, onSaved }: ModuleDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useAcademicForm<ModuleFormValues, Module>({
    initial: { name: module?.name ?? '', code: module?.code ?? '', description: module?.description ?? '' },
    validate: (v): Record<string, string> => (v.name.trim().length < 3 ? { name: 'Escribe el nombre del módulo.' } : {}),
    save: (v) => saveModuleAction(slug, curriculumId, module?.id ?? null, v),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });

  return (
    <FormDialog title={module ? 'Editar módulo' : 'Nuevo módulo formativo'} description={module ? undefined : 'Al aprobar todas sus unidades y su EFSRT, el estudiante recibe el certificado modular.'} submitLabel={module ? 'Guardar cambios' : 'Agregar módulo'} isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="module-name" label="Nombre" required error={errors.name}>
        <Input id="module-name" value={values.name} maxLength={160} onChange={(e): void => setField('name', e.target.value)} aria-invalid={Boolean(errors.name)} className={controlClassName} />
      </FormField>
      <FormField id="module-code" label="Código" error={errors.code} hint="Vacío: se arma con el nombre.">
        <Input id="module-code" value={values.code} maxLength={40} onChange={(e): void => setField('code', e.target.value.toLowerCase())} className={controlClassName} />
      </FormField>
      <FormField id="module-description" label="Descripción" error={errors.description}>
        <Textarea id="module-description" rows={2} maxLength={1000} value={values.description} onChange={(e): void => setField('description', e.target.value)} className="rounded-lg bg-background" />
      </FormField>
    </FormDialog>
  );
};

interface SubjectDialogProps {
  slug: string;
  context: AcademicContext;
  plan: Curriculum;
  level: Level;
  subject: Subject | null;
  initialModuleId?: string;
  onClose: () => void;
  onSaved: () => void;
}

// An area, course, didactic unit or EFSRT: the fields change with the institution kind
export const SubjectDialog = ({ slug, context, plan, level, subject, initialModuleId, onClose, onSaved }: SubjectDialogProps): JSX.Element => {
  const kind = context.institutionKind;
  const kinds = subjectKindsFor[kind] ?? ['area'];
  const institute = kind === 'institute';
  const { values, errors, isPending, setField, submit } = useAcademicForm<SubjectFormValues, Subject>({
    initial: {
      kind: subject?.kind ?? kinds[0],
      component: subject?.component || (institute ? 'specific' : ''),
      name: subject?.name ?? '',
      code: subject?.code ?? '',
      description: subject?.description ?? '',
      weeklyHours: subject?.weeklyHours !== undefined ? String(subject.weeklyHours) : '',
      theoryCredits: subject?.theoryCredits !== undefined ? String(subject.theoryCredits) : institute ? '1' : '',
      practiceCredits: subject?.practiceCredits !== undefined ? String(subject.practiceCredits) : institute ? '1' : '',
      gradeIds: subject?.gradeIds ?? (institute ? level.grades.slice(0, 1).map((g) => g.id) : level.grades.map((g) => g.id)),
      moduleId: subject?.moduleId ?? initialModuleId ?? plan.modules[0]?.id ?? '',
    },
    validate: (v): Record<string, string> => (v.name.trim().length < 2 ? { name: 'Escribe el nombre.' } : {}),
    save: (v) => saveSubjectAction(slug, plan.id, subject?.id ?? null, v),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });
  const efsrt = values.kind === 'efsrt';
  const credits = (Number(values.theoryCredits) || 0) + (Number(values.practiceCredits) || 0);
  const derivedHours = (Number(values.theoryCredits) || 0) + 2 * (Number(values.practiceCredits) || 0);

  return (
    <FormDialog title={subject ? `Editar ${lower(subjectKindLabels[values.kind] ?? 'curso')}` : `Agregar ${lower(subjectKindLabels[values.kind] ?? 'curso')}`} submitLabel={subject ? 'Guardar cambios' : 'Agregar'} isPending={isPending} onSubmit={submit} onClose={onClose} wide>
      {kinds.length > 1 && (
        <FormField id="subject-kind" label="Tipo" required error={errors.kind}>
          <SelectField
            id="subject-kind"
            value={values.kind}
            options={items(subjectKindLabels, kinds)}
            onChange={(v): void => {
              setField('kind', v);
              if (v === 'efsrt') {
                setField('component', 'efsrt');
                setField('theoryCredits', '0');
              } else if (institute && values.component === 'efsrt') setField('component', 'specific');
            }}
          />
        </FormField>
      )}
      <FormField id="subject-name" label="Nombre" required error={errors.name}>
        <Input id="subject-name" value={values.name} maxLength={160} onChange={(e): void => setField('name', e.target.value)} aria-invalid={Boolean(errors.name)} className={controlClassName} />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="subject-code" label="Código" error={errors.code} hint="Vacío: se arma con el nombre.">
          <Input id="subject-code" value={values.code} maxLength={40} onChange={(e): void => setField('code', e.target.value.toLowerCase())} className={controlClassName} />
        </FormField>
        <FormField id="subject-hours" label="Horas semanales" error={errors.weeklyHours} hint={institute ? `Vacío: ${derivedHours} h según los créditos.` : 'Opcional.'}>
          <Input id="subject-hours" inputMode="numeric" value={values.weeklyHours} onChange={(e): void => setField('weeklyHours', digits(e.target.value))} aria-invalid={Boolean(errors.weeklyHours)} className={controlClassName} />
        </FormField>
      </div>
      {institute && (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            {!efsrt && (
              <FormField id="subject-component" label="Competencia" required error={errors.component}>
                <SelectField id="subject-component" value={values.component} options={items(componentLabels, ['specific', 'employability'])} onChange={(v): void => setField('component', v)} />
              </FormField>
            )}
            <FormField id="subject-theory" label="Créditos de teoría" error={errors.theoryCredits}>
              <Input id="subject-theory" inputMode="numeric" value={values.theoryCredits} onChange={(e): void => setField('theoryCredits', digits(e.target.value))} aria-invalid={Boolean(errors.theoryCredits)} className={controlClassName} />
            </FormField>
            <FormField id="subject-practice" label="Créditos de práctica" error={errors.practiceCredits} hint={`${credits} créditos · ${(Number(values.theoryCredits) || 0) * 16 + (Number(values.practiceCredits) || 0) * 32} horas`}>
              <Input id="subject-practice" inputMode="numeric" value={values.practiceCredits} onChange={(e): void => setField('practiceCredits', digits(e.target.value))} className={controlClassName} />
            </FormField>
          </div>
          {plan.modules.length > 0 && (
            <FormField id="subject-module" label="Módulo formativo" error={errors.moduleId}>
              <SelectField id="subject-module" value={values.moduleId} options={[{ value: '', label: 'Sin módulo' }, ...plan.modules.map((m) => ({ value: m.id, label: m.name }))]} onChange={(v): void => setField('moduleId', v)} />
            </FormField>
          )}
        </>
      )}
      {context.hasGrades && (
        <FormField id="subject-grades" label={institute ? 'Semestre en que se dicta' : `${context.vocabulary?.grades ?? 'Grados'} en que se dicta`} required error={errors.gradeIds}>
          <ChoiceChips
            label={context.vocabulary?.grades ?? 'Grados'}
            options={level.grades.map((g) => ({ value: g.id, label: g.shortName, hint: g.name }))}
            selected={values.gradeIds}
            onChange={(next): void => setField('gradeIds', institute ? next.slice(-1) : next)}
            invalid={Boolean(errors.gradeIds)}
          />
        </FormField>
      )}
      <FormField id="subject-description" label="Descripción" error={errors.description}>
        <Textarea id="subject-description" rows={2} maxLength={1000} value={values.description} onChange={(e): void => setField('description', e.target.value)} className="rounded-lg bg-background" />
      </FormField>
    </FormDialog>
  );
};

interface CompetencyDialogProps {
  slug: string;
  context: AcademicContext;
  curriculumId: string;
  subject: Subject | null;
  competency: Competency | null;
  onClose: () => void;
  onSaved: () => void;
}

// A competency of an area (or transversal), a capacity of a unit, or a topic of a course
export const CompetencyDialog = ({ slug, context, curriculumId, subject, competency, onClose, onSaved }: CompetencyDialogProps): JSX.Element => {
  const noun = assessedNoun[context.institutionKind] ?? assessedNoun.ebr;
  const { values, errors, isPending, setField, submit } = useAcademicForm<CompetencyFormValues, Competency>({
    initial: { code: competency?.code ?? '', name: competency?.name ?? '' },
    validate: (v): Record<string, string> => (v.name.trim().length < 3 ? { name: 'Escribe al menos 3 caracteres.' } : {}),
    save: (v) => saveCompetencyAction(slug, curriculumId, subject?.id ?? '', competency?.id ?? null, v),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });
  const where = subject ? subject.name : 'Transversal (no pertenece a un área)';

  return (
    <FormDialog title={competency ? `Editar ${lower(noun.one)}` : `${context.institutionKind === 'cepre' ? 'Nuevo' : 'Nueva'} ${lower(noun.one)}`} description={where} submitLabel={competency ? 'Guardar cambios' : 'Agregar'} isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="competency-name" label={noun.one} required error={errors.name}>
        <Textarea id="competency-name" rows={3} maxLength={300} value={values.name} onChange={(e): void => setField('name', e.target.value)} aria-invalid={Boolean(errors.name)} className="rounded-lg bg-background" />
      </FormField>
      <FormField id="competency-code" label="Código" error={errors.code} hint={context.institutionKind === 'cepre' ? 'Opcional.' : 'Opcional: «C25» para la competencia 25 del CNEB.'}>
        <Input id="competency-code" value={values.code} maxLength={20} onChange={(e): void => setField('code', e.target.value)} className={`${controlClassName} max-w-40`} />
      </FormField>
    </FormDialog>
  );
};
