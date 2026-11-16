'use client';

import { useState, type JSX } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { createSectionsAction, savePeriodAction, updateSectionAction, updateTermAction } from '../actions/academic-actions';
import { attentionModeLabels, daysBetween, distanceVariantHints, distanceVariantLabels, ebaProgramHints, ebaProgramLabels, ebaProgramsFor, items, lower, seasonLabels, shiftLabels, splitNames, suggestedPeriodName, termSchemeHints, termSchemeLabels, termStatusLabels } from '../data/academic-data';
import { useAcademicForm } from '../hooks/use-academic-form';
import type { AcademicContext, EbaSectionFieldsProps, EbaSectionValues, Level, Period, PeriodFormValues, Section, SectionBatchValues, SectionFormValues, Term, TermFormValues } from '../types';
import { ChoiceChips, controlClassName, SelectField } from './academic-ui';
import { FormDialog } from './form-dialog';

interface PeriodDialogProps {
  slug: string;
  context: AcademicContext;
  period: Period | null;
  onClose: () => void;
  onSaved: (period: Period) => void;
}

const requireDates = (v: { startsOn: string; endsOn: string }): Record<string, string> => {
  const fields: Record<string, string> = {};
  if (!v.startsOn) fields.startsOn = 'Indica la fecha de inicio.';
  if (!v.endsOn) fields.endsOn = 'Indica la fecha de término.';
  if (v.startsOn && v.endsOn && v.endsOn < v.startsOn) fields.endsOn = 'Debe terminar después de empezar.';
  return fields;
};

// Create or edit a school year, promotional period, cycle or semester. New ones split into terms by themselves
export const PeriodDialog = ({ slug, context, period, onClose, onSaved }: PeriodDialogProps): JSX.Element => {
  const noun = lower(context.vocabulary?.period ?? 'periodo');
  const [year] = useState(() => new Date().getFullYear() + 1);
  const defaultSeason = context.usesSeasons ? 'summer' : '';
  const [nameTouched, setNameTouched] = useState(Boolean(period));
  const planning = !period || period.status === 'planning';
  const { values, errors, isPending, setField, submit } = useAcademicForm<PeriodFormValues, Period>({
    initial: {
      name: period?.name ?? suggestedPeriodName(context.periodKind, defaultSeason, year),
      season: period?.season || defaultSeason,
      startsOn: period?.startsOn ?? '',
      endsOn: period?.endsOn ?? '',
      termScheme: period?.termScheme ?? context.settings?.termScheme ?? context.termSchemes[0] ?? 'none',
    },
    validate: (v): Record<string, string> => ({ ...(v.name.trim().length < 3 ? { name: 'Escribe el nombre.' } : {}), ...requireDates(v) }),
    save: (v) => savePeriodAction(slug, period?.id ?? null, v),
    onSaved: (saved) => {
      onSaved(saved);
      onClose();
    },
  });

  const setSeason = (season: string): void => {
    setField('season', season);
    if (!nameTouched) setField('name', suggestedPeriodName(context.periodKind, season, Number(values.startsOn.slice(0, 4)) || year));
  };

  const days = values.startsOn && values.endsOn && values.endsOn >= values.startsOn ? daysBetween(values.startsOn, values.endsOn) : null;

  return (
    <FormDialog
      title={period ? `Editar ${noun}` : `Nuevo ${noun}`}
      description={period ? undefined : values.termScheme !== 'none' ? `Se divide solo en ${lower(termSchemeLabels[values.termScheme])} iguales; luego ajustas sus fechas para las vacaciones.` : 'Empieza en planificación: arma sus secciones y actívalo cuando inicien las clases.'}
      submitLabel={period ? 'Guardar cambios' : `Crear ${noun}`}
      isPending={isPending}
      onSubmit={submit}
      onClose={onClose}
    >
      {context.usesSeasons && (
        <FormField id="period-season" label="Temporada" required error={errors.season}>
          <SelectField id="period-season" value={values.season} options={items(seasonLabels)} onChange={setSeason} invalid={Boolean(errors.season)} />
        </FormField>
      )}
      <FormField id="period-name" label="Nombre" required error={errors.name}>
        <Input placeholder="Ej.: Año lectivo 2027"
          id="period-name"
          value={values.name}
          maxLength={80}
          onChange={(e): void => {
            setNameTouched(true);
            setField('name', e.target.value);
          }}
          aria-invalid={Boolean(errors.name)}
          className={controlClassName}
        />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="period-start" label="Inicio" required error={errors.startsOn}>
          <Input id="period-start" type="date" value={values.startsOn} onChange={(e): void => setField('startsOn', e.target.value)} aria-invalid={Boolean(errors.startsOn)} className={controlClassName} />
        </FormField>
        <FormField id="period-end" label="Término" required error={errors.endsOn} hint={days ? `${days} días` : undefined}>
          <Input id="period-end" type="date" min={values.startsOn || undefined} value={values.endsOn} onChange={(e): void => setField('endsOn', e.target.value)} aria-invalid={Boolean(errors.endsOn)} className={controlClassName} />
        </FormField>
      </div>
      {context.termSchemes.length > 1 && (
        <FormField id="period-scheme" label="División" error={errors.termScheme} hint={planning ? termSchemeHints[values.termScheme] : 'La división se cambia solo mientras está en planificación.'}>
          <SelectField id="period-scheme" value={values.termScheme} options={items(termSchemeLabels, context.termSchemes)} onChange={(v): void => setField('termScheme', v)} disabled={!planning} />
        </FormField>
      )}
      {period && planning && period.terms.length > 0 && <p className="text-xs text-muted-foreground">Si cambias las fechas o la división, los {lower(termSchemeLabels[values.termScheme] ?? 'tramos')} se vuelven a calcular.</p>}
    </FormDialog>
  );
};

interface TermDialogProps {
  slug: string;
  period: Period;
  term: Term;
  onClose: () => void;
  onSaved: () => void;
}

export const TermDialog = ({ slug, period, term, onClose, onSaved }: TermDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useAcademicForm<TermFormValues, Term>({
    initial: { name: term.name, startsOn: term.startsOn, endsOn: term.endsOn, status: term.status },
    validate: requireDates,
    save: (v) => updateTermAction(slug, period.id, term.id, v),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });

  return (
    <FormDialog title={`Editar ${term.name}`} description={`Debe quedar dentro de ${period.name}, sin cruzarse con los demás.`} submitLabel="Guardar cambios" isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="term-name" label="Nombre" required error={errors.name}>
        <Input placeholder="Ej.: I bimestre" id="term-name" value={values.name} maxLength={40} onChange={(e): void => setField('name', e.target.value)} className={controlClassName} />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="term-start" label="Inicio" required error={errors.startsOn}>
          <Input id="term-start" type="date" min={period.startsOn} max={period.endsOn} value={values.startsOn} onChange={(e): void => setField('startsOn', e.target.value)} aria-invalid={Boolean(errors.startsOn)} className={controlClassName} />
        </FormField>
        <FormField id="term-end" label="Término" required error={errors.endsOn}>
          <Input id="term-end" type="date" min={values.startsOn || period.startsOn} max={period.endsOn} value={values.endsOn} onChange={(e): void => setField('endsOn', e.target.value)} aria-invalid={Boolean(errors.endsOn)} className={controlClassName} />
        </FormField>
      </div>
      <FormField id="term-status" label="Estado" error={errors.status} hint="Cerrado: sus resultados quedan finales (se usará al registrar notas).">
        <SelectField id="term-status" value={values.status} options={items(termStatusLabels)} onChange={(v): void => setField('status', v)} />
      </FormField>
    </FormDialog>
  );
};

interface SectionsDialogProps {
  slug: string;
  context: AcademicContext;
  period: Period;
  levels: Level[];
  initialLevelId?: string;
  onClose: () => void;
  onSaved: () => void;
}

// EBA fields of a section: the form of attention, the program (Alfabetización only in cycles that never go remote, and
// always in person) and, for the distance form, whether it is online or itinerant
const EbaSectionFields = <V extends EbaSectionValues>({ idPrefix, levelModes, gradeCount, values, errors, setField }: EbaSectionFieldsProps<V>): JSX.Element => {
  const programs = ebaProgramsFor(levelModes);
  const modes = values.program === 'literacy' ? levelModes.filter((m) => m === 'in_person') : levelModes;
  const pickProgram = (program: string): void => {
    setField('program', program as V['program']);
    if (program === 'literacy') setField('attentionMode', 'in_person' as V['attentionMode']);
  };
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField id={`${idPrefix}-mode`} label="Forma de atención" required error={errors.attentionMode}>
        <SelectField id={`${idPrefix}-mode`} value={values.attentionMode} options={items(attentionModeLabels, modes)} onChange={(v): void => setField('attentionMode', v as V['attentionMode'])} invalid={Boolean(errors.attentionMode)} />
      </FormField>
      {programs.length > 1 && (
        <FormField id={`${idPrefix}-program`} label="Programa" required error={errors.program} hint={ebaProgramHints[values.program]}>
          <SelectField id={`${idPrefix}-program`} value={values.program} options={items(ebaProgramLabels, programs)} onChange={pickProgram} invalid={Boolean(errors.program)} />
        </FormField>
      )}
      {values.attentionMode === 'distance' && (
        <FormField id={`${idPrefix}-variant`} label="Modalidad a distancia" required error={errors.distanceVariant} hint={distanceVariantHints[values.distanceVariant]}>
          <SelectField
            id={`${idPrefix}-variant`}
            value={values.distanceVariant}
            options={items(distanceVariantLabels, Object.keys(distanceVariantLabels))}
            onChange={(v): void => setField('distanceVariant', v as V['distanceVariant'])}
            invalid={Boolean(errors.distanceVariant)}
          />
        </FormField>
      )}
      {gradeCount > 1 && (
        <div className="sm:col-span-2">
          <label htmlFor={`${idPrefix}-multigrade`} className="flex items-start gap-3 text-sm">
            <Checkbox id={`${idPrefix}-multigrade`} checked={values.multigrade} onCheckedChange={(c): void => setField('multigrade', (c === true) as V['multigrade'])} className="mt-0.5" />
            <span>
              <span className="font-medium text-foreground">Aula multigrado</span>
              <span className="block text-xs text-muted-foreground">Reúne estudiantes de varios grados del ciclo con un mismo docente. Se matricula a cada uno en su grado.</span>
            </span>
          </label>
          {errors.multigrade && <p className="mt-1 text-sm text-destructive">{errors.multigrade}</p>}
        </div>
      )}
    </div>
  );
};

// Several sections at once: one per chosen grade and name ("A, B" for 1.° to 5.°)
export const SectionsDialog = ({ slug, context, period, levels, initialLevelId, onClose, onSaved }: SectionsDialogProps): JSX.Element => {
  const vocabulary = context.vocabulary;
  const shifts = context.settings?.shifts ?? ['morning'];
  const active = levels.filter((l) => l.isActive && (!context.hasGrades || l.grades.length > 0));
  const firstLevel = active.find((l) => l.id === initialLevelId) ?? active[0];
  const { values, errors, isPending, setField, submit } = useAcademicForm<SectionBatchValues, Section[]>({
    initial: {
      levelId: firstLevel?.id ?? '',
      gradeIds: firstLevel?.grades.map((g) => g.id) ?? [],
      names: context.institutionKind === 'cepre' ? 'Aula 1' : 'A',
      shift: shifts[0],
      attentionMode: firstLevel?.attentionModes[0] ?? '',
      program: 'pebaja',
      distanceVariant: 'virtual',
      multigrade: false,
      capacity: context.institutionKind === 'ebe' ? '10' : context.institutionKind === 'cepre' ? '45' : '30',
      room: '',
    },
    validate: (v): Record<string, string> => ({
      ...(v.levelId ? {} : { levelId: 'Elige uno.' }),
      ...(context.hasGrades && v.gradeIds.length === 0 ? { gradeIds: 'Elige al menos uno.' } : {}),
      ...(splitNames(v.names).length === 0 ? { names: 'Escribe al menos un nombre.' } : {}),
    }),
    save: (v) => createSectionsAction(slug, period.id, v, splitNames(v.names)),
    onSaved: () => {
      onSaved();
      onClose();
    },
    successTitle: 'Secciones creadas',
  });
  const level = active.find((l) => l.id === values.levelId);
  const count = (context.hasGrades ? values.gradeIds.length : 1) * splitNames(values.names).length;

  const pickLevel = (id: string): void => {
    const next = active.find((l) => l.id === id);
    setField('levelId', id);
    setField('gradeIds', next?.grades.map((g) => g.id) ?? []);
    setField('attentionMode', next?.attentionModes[0] ?? '');
    setField('program', 'pebaja');
  };

  const sectionsNoun = lower(vocabulary?.sections ?? 'secciones');
  return (
    <FormDialog
      title={`Agregar ${sectionsNoun}`}
      description={`En ${period.name}. Se crea una por cada ${context.hasGrades ? `${lower(vocabulary?.grade ?? 'grado')} y ` : ''}nombre.`}
      submitLabel={count > 0 ? `Crear ${count} ${count === 1 ? lower(vocabulary?.section ?? 'sección') : sectionsNoun}` : 'Crear'}
      isPending={isPending}
      onSubmit={submit}
      onClose={onClose}
      wide
    >
      {active.length === 0 ? (
        <p className="text-sm text-muted-foreground">Primero arma la estructura: no hay {lower(vocabulary?.levels ?? 'niveles')} activos{context.hasGrades ? ` con ${lower(vocabulary?.grades ?? 'grados')}` : ''}.</p>
      ) : (
        <>
          <FormField id="sections-level" label={vocabulary?.level ?? 'Nivel'} required error={errors.levelId}>
            <SelectField id="sections-level" value={values.levelId} options={active.map((l) => ({ value: l.id, label: l.name }))} onChange={pickLevel} invalid={Boolean(errors.levelId)} />
          </FormField>
          {context.hasGrades && level && (
            <FormField id="sections-grades" label={vocabulary?.grades ?? 'Grados'} required error={errors.gradeIds}>
              <ChoiceChips label={vocabulary?.grades ?? 'Grados'} options={level.grades.map((g) => ({ value: g.id, label: g.shortName, hint: g.name }))} selected={values.gradeIds} onChange={(next): void => setField('gradeIds', next)} invalid={Boolean(errors.gradeIds)} />
            </FormField>
          )}
          <FormField id="sections-names" label="Nombres" required error={errors.names} hint="Separados por comas: «A, B, C»">
            <Input placeholder="Ej.: A, B, C" id="sections-names" value={values.names} maxLength={300} onChange={(e): void => setField('names', e.target.value)} aria-invalid={Boolean(errors.names)} className={controlClassName} />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-3">
            <FormField id="sections-shift" label="Turno" required error={errors.shift}>
              <SelectField id="sections-shift" value={values.shift} options={items(shiftLabels, shifts)} onChange={(v): void => setField('shift', v)} />
            </FormField>
            <FormField id="sections-capacity" label="Vacantes" required error={errors.capacity}>
              <Input placeholder="Ej.: 30" id="sections-capacity" inputMode="numeric" value={values.capacity} onChange={(e): void => setField('capacity', e.target.value.replace(/\D/g, '').slice(0, 3))} aria-invalid={Boolean(errors.capacity)} className={controlClassName} />
            </FormField>
            <FormField id="sections-room" label="Ambiente" error={errors.room}>
              <Input id="sections-room" value={values.room} maxLength={60} placeholder="Aula 204" onChange={(e): void => setField('room', e.target.value)} className={controlClassName} />
            </FormField>
          </div>
          {context.usesAttentionModes && level && (
            <EbaSectionFields idPrefix="sections" levelModes={level.attentionModes} gradeCount={level.grades.length} values={values} errors={errors} setField={setField} />
          )}
        </>
      )}
    </FormDialog>
  );
};

interface SectionDialogProps {
  slug: string;
  context: AcademicContext;
  section: Section;
  level: Level | undefined;
  onClose: () => void;
  onSaved: () => void;
}

export const SectionDialog = ({ slug, context, section, level, onClose, onSaved }: SectionDialogProps): JSX.Element => {
  const shifts = context.settings?.shifts ?? ['morning'];
  const { values, errors, isPending, setField, submit } = useAcademicForm<SectionFormValues, Section>({
    initial: {
      name: section.name,
      shift: section.shift,
      attentionMode: section.attentionMode,
      program: section.program || 'pebaja',
      distanceVariant: section.distanceVariant || 'virtual',
      multigrade: section.multigrade,
      capacity: String(section.capacity),
      room: section.room,
    },
    validate: (v): Record<string, string> => (v.name.trim() === '' ? { name: 'Escribe el nombre.' } : {}),
    save: (v) => updateSectionAction(slug, section.id, v),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });

  return (
    <FormDialog title={`${context.vocabulary?.section ?? 'Sección'} ${section.gradeShort ? `${section.gradeShort} ` : ''}${section.name}`} description={`${section.levelName}${section.gradeName ? ` · ${section.gradeName}` : ''}`} submitLabel="Guardar cambios" isPending={isPending} onSubmit={submit} onClose={onClose}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="section-name" label="Nombre" required error={errors.name}>
          <Input placeholder="Ej.: A" id="section-name" value={values.name} maxLength={40} onChange={(e): void => setField('name', e.target.value)} aria-invalid={Boolean(errors.name)} className={controlClassName} />
        </FormField>
        <FormField id="section-shift" label="Turno" required error={errors.shift}>
          <SelectField id="section-shift" value={values.shift} options={items(shiftLabels, shifts.includes(values.shift) ? shifts : [...shifts, values.shift])} onChange={(v): void => setField('shift', v)} invalid={Boolean(errors.shift)} />
        </FormField>
        <FormField id="section-capacity" label="Vacantes" required error={errors.capacity}>
          <Input placeholder="Ej.: 30" id="section-capacity" inputMode="numeric" value={values.capacity} onChange={(e): void => setField('capacity', e.target.value.replace(/\D/g, '').slice(0, 3))} aria-invalid={Boolean(errors.capacity)} className={controlClassName} />
        </FormField>
        <FormField id="section-room" label="Ambiente" error={errors.room}>
          <Input placeholder="Ej.: Aula 204" id="section-room" value={values.room} maxLength={60} onChange={(e): void => setField('room', e.target.value)} className={controlClassName} />
        </FormField>
      </div>
      {context.usesAttentionModes && level && <EbaSectionFields idPrefix="section" levelModes={level.attentionModes} gradeCount={level.grades.length} values={values} errors={errors} setField={setField} />}
    </FormDialog>
  );
};
