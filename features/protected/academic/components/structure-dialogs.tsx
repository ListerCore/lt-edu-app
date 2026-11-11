'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { saveGradeAction, saveLevelAction, updateSettingsAction } from '../actions/academic-actions';
import { ALL_SHIFTS, weekdayShort, attentionModeHints, attentionModeLabels, formativeLevelLabels, gradingScaleLabels, items, lower, shiftLabels, termSchemeHints, termSchemeLabels } from '../data/academic-data';
import { useAcademicForm } from '../hooks/use-academic-form';
import type { AcademicContext, Grade, GradeFormValues, Level, LevelFormValues, SettingsFormValues } from '../types';
import { ChoiceChips, controlClassName, SelectField } from './academic-ui';
import { FormDialog } from './form-dialog';

const describedBy = (id: string, error?: string): string | undefined => (error ? `${id}-error` : undefined);

interface LevelDialogProps {
  slug: string;
  context: AcademicContext;
  level: Level | null;
  onClose: () => void;
  onSaved: () => void;
}

// Create or edit a level / cycle / area / study program
export const LevelDialog = ({ slug, context, level, onClose, onSaved }: LevelDialogProps): JSX.Element => {
  const { vocabulary, usesFormativeLevels, usesAttentionModes, settings } = context;
  const offeredModes = settings?.attentionModes ?? [];
  const { values, errors, isPending, setField, submit } = useAcademicForm<LevelFormValues, Level>({
    initial: {
      name: level?.name ?? '',
      code: level?.code ?? '',
      description: level?.description ?? '',
      formativeLevel: level?.formativeLevel || (usesFormativeLevels ? 'professional_technical' : ''),
      credits: level?.credits !== undefined ? String(level.credits) : usesFormativeLevels ? '120' : '',
      attentionModes: level?.attentionModes ?? (usesAttentionModes ? offeredModes.slice(0, 1) : []),
      isActive: level?.isActive ?? true,
    },
    validate: (v): Record<string, string> => (v.name.trim().length < 2 ? { name: 'Escribe el nombre.' } : {}),
    save: (v) => saveLevelAction(slug, level?.id ?? null, v),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });

  return (
    <FormDialog
      title={level ? `Editar ${lower(vocabulary?.level ?? 'nivel')}` : `Nuevo ${lower(vocabulary?.level ?? 'nivel')}`}
      description={level ? undefined : 'Después podrás agregarle sus grados y secciones.'}
      submitLabel={level ? 'Guardar cambios' : 'Agregar'}
      isPending={isPending}
      onSubmit={submit}
      onClose={onClose}
    >
      <FormField id="level-name" label="Nombre" required error={errors.name}>
        <Input id="level-name" value={values.name} maxLength={120} onChange={(e): void => setField('name', e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy('level-name', errors.name)} className={controlClassName} />
      </FormField>
      <FormField id="level-code" label="Código" error={errors.code} hint="Identificador corto. Si lo dejas vacío se arma con el nombre.">
        <Input id="level-code" value={values.code} maxLength={40} placeholder="se-arma-con-el-nombre" onChange={(e): void => setField('code', e.target.value.toLowerCase())} aria-invalid={Boolean(errors.code)} className={controlClassName} />
      </FormField>
      <FormField id="level-description" label="Descripción" error={errors.description}>
        <Textarea id="level-description" rows={2} maxLength={500} value={values.description} onChange={(e): void => setField('description', e.target.value)} className="rounded-lg bg-background" />
      </FormField>
      {usesFormativeLevels && (
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="level-formative" label="Nivel formativo" required error={errors.formativeLevel}>
            <SelectField id="level-formative" value={values.formativeLevel} options={items(formativeLevelLabels)} onChange={(v): void => setField('formativeLevel', v)} invalid={Boolean(errors.formativeLevel)} />
          </FormField>
          <FormField id="level-credits" label="Créditos del plan" required error={errors.credits} hint="Profesional técnico: 120 como mínimo.">
            <Input id="level-credits" inputMode="numeric" value={values.credits} onChange={(e): void => setField('credits', e.target.value.replace(/\D/g, '').slice(0, 3))} aria-invalid={Boolean(errors.credits)} className={controlClassName} />
          </FormField>
        </div>
      )}
      {usesAttentionModes && (
        <FormField id="level-modes" label="Formas de atención" required error={errors.attentionModes}>
          <ChoiceChips label="Formas de atención" options={offeredModes.map((m) => ({ value: m, label: attentionModeLabels[m] ?? m, hint: attentionModeHints[m] }))} selected={values.attentionModes} onChange={(next): void => setField('attentionModes', next)} invalid={Boolean(errors.attentionModes)} />
        </FormField>
      )}
      {level && (
        <label className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-foreground">Activo</span>
            <span className="block text-xs text-muted-foreground">Si lo desactivas deja de ofrecerse, pero se conserva su historial.</span>
          </span>
          <Switch checked={values.isActive} onCheckedChange={(next): void => setField('isActive', next)} />
        </label>
      )}
    </FormDialog>
  );
};

interface GradeDialogProps {
  slug: string;
  context: AcademicContext;
  level: Level;
  grade: Grade | null;
  onClose: () => void;
  onSaved: () => void;
}

export const GradeDialog = ({ slug, context, level, grade, onClose, onSaved }: GradeDialogProps): JSX.Element => {
  const noun = lower(context.vocabulary?.grade ?? 'grado');
  const { values, errors, isPending, setField, submit } = useAcademicForm<GradeFormValues, Grade>({
    initial: { name: grade?.name ?? '', shortName: grade?.shortName ?? '', code: grade?.code ?? '' },
    validate: (v): Record<string, string> => (v.name.trim() === '' ? { name: 'Escribe el nombre.' } : {}),
    save: (v) => saveGradeAction(slug, level.id, grade?.id ?? null, v),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });

  return (
    <FormDialog title={grade ? `Editar ${noun}` : `Nuevo ${noun} en ${level.name}`} submitLabel={grade ? 'Guardar cambios' : 'Agregar'} isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="grade-name" label="Nombre" required error={errors.name} hint="Por ejemplo «1.° grado», «4 años» o «Semestre III».">
        <Input id="grade-name" value={values.name} maxLength={80} onChange={(e): void => setField('name', e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy('grade-name', errors.name)} className={controlClassName} />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="grade-short" label="Nombre corto" error={errors.shortName} hint="Se usa en listas: «1.°», «4 a», «III».">
          <Input id="grade-short" value={values.shortName} maxLength={20} onChange={(e): void => setField('shortName', e.target.value)} className={controlClassName} />
        </FormField>
        <FormField id="grade-code" label="Código" error={errors.code} hint="Vacío: se arma con el nombre.">
          <Input id="grade-code" value={values.code} maxLength={40} onChange={(e): void => setField('code', e.target.value.toLowerCase())} className={controlClassName} />
        </FormField>
      </div>
    </FormDialog>
  );
};

interface SettingsDialogProps {
  slug: string;
  context: AcademicContext;
  onClose: () => void;
  onSaved: () => void;
}

// Academic profile: how periods split, the passing mark, conduct mark, shifts and EBA forms of attention
export const SettingsDialog = ({ slug, context, onClose, onSaved }: SettingsDialogProps): JSX.Element => {
  const settings = context.settings;
  const scale = settings?.gradingScale ?? 'literal';
  const { values, errors, isPending, setField, submit } = useAcademicForm<SettingsFormValues, AcademicContext>({
    initial: {
      termScheme: settings?.termScheme ?? context.termSchemes[0] ?? 'none',
      passingGrade: settings?.passingGrade !== undefined ? String(settings.passingGrade) : '',
      conductGrade: settings?.conductGrade ?? false,
      attentionModes: settings?.attentionModes ?? [],
      shifts: settings?.shifts ?? ['morning'],
      weekDays: (settings?.weekDays ?? [1, 2, 3, 4, 5]).map(String),
      lateAfterMinutes: String(settings?.lateAfterMinutes ?? 10),
      absenceLimitPercent: String(settings?.absenceLimitPercent ?? 30),
    },
    save: (v) => updateSettingsAction(slug, v, scale),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });

  return (
    <FormDialog title="Perfil académico" description={`Reglas de ${context.institutionName}. Se aplican a los periodos que crees desde ahora.`} submitLabel="Guardar" isPending={isPending} onSubmit={submit} onClose={onClose} wide>
      {context.termSchemes.length > 1 && (
        <FormField id="settings-scheme" label={`División de cada ${lower(context.vocabulary?.period ?? 'periodo')}`} error={errors.termScheme} hint={termSchemeHints[values.termScheme]}>
          <SelectField id="settings-scheme" value={values.termScheme} options={items(termSchemeLabels, context.termSchemes)} onChange={(v): void => setField('termScheme', v)} />
        </FormField>
      )}
      <div className="rounded-lg bg-secondary px-4 py-3 text-sm">
        <p className="font-medium text-foreground">Calificación: {gradingScaleLabels[scale]}</p>
        <p className="mt-0.5 text-muted-foreground">La escala la fija el tipo de institución.</p>
      </div>
      {scale === 'vigesimal' && (
        <FormField id="settings-passing" label="Nota mínima aprobatoria" required error={errors.passingGrade} hint="En la mayoría de institutos es 13.">
          <Input id="settings-passing" inputMode="numeric" value={values.passingGrade} onChange={(e): void => setField('passingGrade', e.target.value.replace(/\D/g, '').slice(0, 2))} aria-invalid={Boolean(errors.passingGrade)} className={`${controlClassName} max-w-32`} />
        </FormField>
      )}
      {scale === 'literal' && (
        <label className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-foreground">Nota de conducta de 0 a 20</span>
            <span className="block text-xs text-muted-foreground">Lineamientos de disciplina escolar (DS 021-2026-MINEDU).</span>
          </span>
          <Switch checked={values.conductGrade} onCheckedChange={(next): void => setField('conductGrade', next)} />
        </label>
      )}
      <FormField id="settings-days" label="Días de clase" required error={errors.weekDays}>
        <ChoiceChips label="Días de clase" options={items(weekdayShort, ['1', '2', '3', '4', '5', '6', '7'])} selected={values.weekDays} onChange={(next): void => setField('weekDays', next.sort())} invalid={Boolean(errors.weekDays)} />
      </FormField>
      <FormField id="settings-shifts" label="Turnos" required error={errors.shifts}>
        <ChoiceChips label="Turnos" options={items(shiftLabels, ALL_SHIFTS)} selected={values.shifts} onChange={(next): void => setField('shifts', next)} invalid={Boolean(errors.shifts)} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="settings-late" label="Tolerancia de llegada (minutos)" required error={errors.lateAfterMinutes} hint="Después de la primera hora de clase más estos minutos, cuenta como tardanza.">
          <Input id="settings-late" inputMode="numeric" value={values.lateAfterMinutes} onChange={(e): void => setField('lateAfterMinutes', e.target.value.replace(/\D/g, '').slice(0, 3))} aria-invalid={Boolean(errors.lateAfterMinutes)} className={`${controlClassName} max-w-32`} />
        </FormField>
        <FormField id="settings-limit" label="Límite de inasistencias (%)" required error={errors.absenceLimitPercent} hint="Desde este porcentaje de faltas sin justificar se alerta. En institutos suele ser 30 %.">
          <Input id="settings-limit" inputMode="numeric" value={values.absenceLimitPercent} onChange={(e): void => setField('absenceLimitPercent', e.target.value.replace(/\D/g, '').slice(0, 3))} aria-invalid={Boolean(errors.absenceLimitPercent)} className={`${controlClassName} max-w-32`} />
        </FormField>
      </div>
      {context.usesAttentionModes && (
        <FormField id="settings-modes" label="Formas de atención que ofrece" required error={errors.attentionModes}>
          <ChoiceChips label="Formas de atención" options={Object.keys(attentionModeLabels).map((m) => ({ value: m, label: attentionModeLabels[m], hint: attentionModeHints[m] }))} selected={values.attentionModes} onChange={(next): void => setField('attentionModes', next)} invalid={Boolean(errors.attentionModes)} />
        </FormField>
      )}
    </FormDialog>
  );
};
