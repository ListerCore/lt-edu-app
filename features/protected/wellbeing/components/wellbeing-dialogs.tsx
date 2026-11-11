'use client';

import { useEffect, useState, type JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { addMeasureAction, getMeasureContextAction, referAction, saveCommitmentAction, saveIncidentAction, saveInterviewAction } from '../actions/wellbeing-actions';
import { groundLabels, interviewKindLabels, measureGrounds, measureKindLabels, partyLabels, severityLabels } from '../data/wellbeing-data';
import type { Incident, IncidentCategory, Interview, MeasureContext, WellStudent } from '../types';
import { DateInput, OneOf, StudentPicker, TextArea, useAct } from './wellbeing-ui';

interface Base {
  slug: string;
  onClose: () => void;
  onSaved: () => void;
}

// Records (or corrects) an interview of the tutor with the student or the family
export const InterviewDialog = ({ slug, studentId, interview, onClose, onSaved }: Base & { studentId: string; interview?: Interview }): JSX.Element => {
  const today = useToday();
  const [isPending, act] = useAct();
  const [kind, setKind] = useState(interview?.kind ?? 'family');
  const [heldOn, setHeldOn] = useState(interview?.heldOn ?? '');
  const [topic, setTopic] = useState(interview?.topic ?? '');
  const [notes, setNotes] = useState(interview?.notes ?? '');
  const [agreements, setAgreements] = useState(interview?.agreements ?? '');
  const day = heldOn || today;
  return (
    <FormDialog
      title={interview ? 'Editar entrevista' : 'Nueva entrevista'}
      description="Las notas solo las lee el personal; los acuerdos también los ve la familia."
      submitLabel="Guardar entrevista"
      isPending={isPending}
      disabled={!topic.trim() || !day}
      wide
      onSubmit={(): void =>
        act(
          () => saveInterviewAction(slug, { id: interview?.id ?? '', studentId, studentName: '', kind, heldOn: day, topic, notes, agreements, authorName: '' }),
          onSaved,
        )
      }
      onClose={onClose}
    >
      <OneOf label="Con quién" value={kind} options={Object.entries(interviewKindLabels)} onChange={setKind} />
      <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <FormField id="iv-topic" label="Motivo" required>
          <Input id="iv-topic" value={topic} maxLength={160} onChange={(e): void => setTopic(e.target.value)} placeholder="Bajo rendimiento, tardanzas, entrega de informe…" />
        </FormField>
        <DateInput id="iv-date" label="Fecha" value={day} max={today} onChange={setHeldOn} required />
      </div>
      <TextArea id="iv-notes" label="Lo conversado (reservado)" value={notes} onChange={setNotes} max={4000} rows={4} />
      <TextArea id="iv-agreements" label="Acuerdos" value={agreements} onChange={setAgreements} max={2000} hint="La familia los ve en su panel." />
    </FormDialog>
  );
};

// A commitment of the student, the family or the school, reviewed on a date
export const CommitmentDialog = ({ slug, studentId, interviewId = '', onClose, onSaved }: Base & { studentId: string; interviewId?: string }): JSX.Element => {
  const [isPending, act] = useAct();
  const [party, setParty] = useState('student');
  const [text, setText] = useState('');
  const [dueOn, setDueOn] = useState('');
  return (
    <FormDialog
      title="Nuevo compromiso"
      description="Se revisa en la fecha indicada: si vence sin revisión, aparece en las alertas del tutor."
      submitLabel="Guardar compromiso"
      isPending={isPending}
      disabled={!text.trim() || !dueOn}
      onSubmit={(): void =>
        act(
          () => saveCommitmentAction(slug, { id: '', studentId, studentName: '', placement: '', interviewId, party, description: text, dueOn, status: 'pending', checkedOn: '', authorName: '' }),
          onSaved,
        )
      }
      onClose={onClose}
    >
      <OneOf label="Quién se compromete" value={party} options={Object.entries(partyLabels)} onChange={setParty} />
      <TextArea id="cm-text" label="Compromiso" value={text} onChange={setText} max={500} required />
      <DateInput id="cm-due" label="Revisar el" value={dueOn} onChange={setDueOn} required />
    </FormDialog>
  );
};

// Refers a student to psychology; only the psychology team reads the case afterwards
export const ReferDialog = ({ slug, student, onClose, onSaved }: Base & { student: WellStudent | null }): JSX.Element => {
  const [isPending, act] = useAct();
  const [who, setWho] = useState<WellStudent | null>(student);
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState('normal');
  return (
    <FormDialog
      title="Derivar a psicología"
      description="Lo que escribas lo leerá el equipo de psicología. Verás el estado de la derivación y las recomendaciones que te compartan."
      submitLabel="Enviar derivación"
      isPending={isPending}
      disabled={!who || !reason.trim()}
      onSubmit={(): void => act(() => referAction(slug, who?.id ?? '', reason, priority), onSaved)}
      onClose={onClose}
    >
      {!student && (
        <FormField id="wb-student" label="Estudiante" required>
          <StudentPicker slug={slug} value={who} onChange={setWho} />
        </FormField>
      )}
      <TextArea id="ref-reason" label="Motivo" value={reason} onChange={setReason} max={2000} required rows={4} placeholder="Qué observaste, desde cuándo, qué se hizo hasta ahora" />
      <OneOf
        label="Prioridad"
        value={priority}
        options={[
          ['normal', 'Normal'],
          ['urgent', 'Urgente'],
        ]}
        onChange={setPriority}
      />
    </FormDialog>
  );
};

// Reports a fault of the catalog (DS 021-2026-MINEDU); the severity follows the fault chosen
export const IncidentDialog = ({ slug, student, catalog, incident, onClose, onSaved }: Base & { student: WellStudent | null; catalog: IncidentCategory[]; incident?: Incident }): JSX.Element => {
  const today = useToday();
  const [isPending, act] = useAct();
  const [who, setWho] = useState<WellStudent | null>(student);
  const [severity, setSeverity] = useState(incident?.severity ?? 'minor');
  const [category, setCategory] = useState(incident?.category ?? '');
  const [occurredOn, setOccurredOn] = useState(incident?.occurredOn ?? '');
  const [notified, setNotified] = useState(incident?.familyNotifiedOn ?? '');
  const [description, setDescription] = useState(incident?.description ?? '');
  const chosen = catalog.find((c) => c.code === category);
  const day = occurredOn || today;
  return (
    <FormDialog
      title={incident ? 'Corregir la falta' : 'Registrar una falta'}
      description="Las faltas leves las atiende el docente con medidas correctivas; las graves y muy graves, la dirección."
      submitLabel="Registrar falta"
      isPending={isPending}
      disabled={!(who || incident) || !category || !description.trim() || !day}
      wide
      onSubmit={(): void =>
        act(
          () =>
            saveIncidentAction(slug, {
              id: incident?.id ?? '',
              studentId: incident?.studentId ?? who?.id ?? '',
              studentName: '',
              placement: '',
              occurredOn: day,
              severity: '',
              category,
              description,
              reportedName: '',
              familyNotifiedOn: notified,
              status: incident?.status ?? 'open',
              measures: [],
              mine: false,
            }),
          onSaved,
        )
      }
      onClose={onClose}
    >
      {!student && !incident && (
        <FormField id="wb-student" label="Estudiante" required>
          <StudentPicker slug={slug} value={who} onChange={setWho} />
        </FormField>
      )}
      <OneOf
        label="Gravedad"
        value={severity}
        options={Object.entries(severityLabels)}
        onChange={(v): void => {
          setSeverity(v);
          setCategory('');
        }}
      />
      <FormField id="inc-category" label="Falta" required>
        <SelectField id="inc-category" value={category} placeholder="Elige la falta" options={catalog.filter((c) => c.severity === severity).map((c) => ({ value: c.code, label: c.label }))} onChange={setCategory} />
      </FormField>
      {chosen?.crime && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">Puede constituir delito: la dirección debe comunicarlo de inmediato a la comisaría o a la fiscalía.</p>}
      {chosen?.violence && <p className="rounded-lg bg-warning/15 px-3 py-2 text-sm text-foreground">Es un caso de violencia escolar: además, regístralo en el SíseVe y aplica el protocolo que corresponde.</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <DateInput id="inc-date" label="Fecha" value={day} max={today} onChange={setOccurredOn} required />
        <DateInput id="inc-notified" label="Comunicada a la familia el" value={notified} min={day} max={today} onChange={setNotified} />
      </div>
      <TextArea id="inc-description" label="Qué ocurrió" value={description} onChange={setDescription} max={2000} required rows={4} placeholder="Hechos, sin calificativos: qué, dónde, quiénes estaban" />
    </FormDialog>
  );
};

// Applies a measure; shows the record so the ground chosen can be checked before sending
export const MeasureDialog = ({ slug, studentId, incident, canDecide, onClose, onSaved }: Base & { studentId: string; incident?: Incident; canDecide: boolean }): JSX.Element => {
  const today = useToday();
  const [isPending, act] = useAct();
  const kinds = canDecide ? (incident ? ['corrective', 'suspension', 'conditional', 'expulsion'] : ['conditional', 'expulsion']) : ['corrective'];
  const [kind, setKind] = useState(kinds[0] ?? 'corrective');
  const [ground, setGround] = useState(measureGrounds[kinds[0] ?? 'corrective']?.[0] ?? '');
  const [days, setDays] = useState('1');
  const [startsOn, setStartsOn] = useState('');
  const [notified, setNotified] = useState('');
  const [detail, setDetail] = useState('');
  const [record, setRecord] = useState<MeasureContext | null>(null);
  useEffect(() => {
    let active = true;
    if (!canDecide) return;
    void getMeasureContextAction(slug, studentId, incident?.id ?? '').then((r) => {
      if (active && r.ok) setRecord(r.data);
    });
    return (): void => {
      active = false;
    };
  }, [slug, studentId, incident?.id, canDecide]);
  const met: Record<string, boolean | undefined> = record
    ? {
        serious_fault: incident ? incident.severity !== 'minor' : false,
        three_minor: record.minorInTerm >= 3,
        repeated_minor: record.minorInYear >= 3,
        two_suspensions: record.suspensions >= 2,
        conduct: record.conductAverage >= 0 && record.conductAverage < 11,
        three_suspensions: record.suspensions >= 3,
        very_serious: record.verySeriousFault,
      }
    : {};
  return (
    <FormDialog
      title="Aplicar una medida"
      description={canDecide ? 'Con proporcionalidad y respeto a la dignidad del estudiante. Comunica formalmente la medida a la familia.' : 'Medida correctiva para una falta leve.'}
      submitLabel="Registrar medida"
      isPending={isPending}
      disabled={!detail.trim()}
      wide
      onSubmit={(): void =>
        act(
          () =>
            addMeasureAction(slug, {
              id: '',
              studentId,
              incidentId: incident?.id ?? '',
              kind,
              ground: kind === 'corrective' ? '' : ground,
              detail,
              startsOn: startsOn || today,
              days: kind === 'suspension' ? Number(days) : 0,
              decidedName: '',
              notifiedOn: notified,
              reconsiderationOn: '',
              reconsiderationReason: '',
              reconsiderationBy: '',
              resolvedOn: '',
              outcome: '',
              resolution: '',
              reconsiderUntil: '',
              resolveUntil: '',
              studentName: '',
              placement: '',
            }),
          onSaved,
        )
      }
      onClose={onClose}
    >
      {kinds.length > 1 && (
        <OneOf
          label="Medida"
          value={kind}
          options={kinds.map((k) => [k, measureKindLabels[k] ?? k])}
          onChange={(v): void => {
            setKind(v);
            setGround(measureGrounds[v]?.[0] ?? '');
          }}
        />
      )}
      {record && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg bg-surface px-3 py-2 text-xs sm:grid-cols-4">
          <div>
            <dt className="text-muted-foreground">Leves en el bimestre</dt>
            <dd className="font-semibold tabular-nums">{record.minorInTerm}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Leves en el año</dt>
            <dd className="font-semibold tabular-nums">{record.minorInYear}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Suspensiones</dt>
            <dd className="font-semibold tabular-nums">{record.suspensions}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Conducta (promedio)</dt>
            <dd className="font-semibold tabular-nums">{record.conductAverage >= 0 ? record.conductAverage.toFixed(1) : '—'}</dd>
          </div>
        </dl>
      )}
      {kind !== 'corrective' && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Causal</span>
          <div role="radiogroup" aria-label="Causal" className="space-y-1.5">
            {(measureGrounds[kind] ?? []).map((g) => (
              <label key={g} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm has-checked:border-brand has-checked:bg-brand-soft">
                <input type="radio" name="ground" value={g} checked={ground === g} onChange={(): void => setGround(g)} className="accent-brand" />
                <span className="flex-1">{groundLabels[g]}</span>
                {met[g] === true && <span className="pill bg-success/12 text-success">Se cumple</span>}
                {met[g] === false && <span className="pill bg-secondary text-muted-foreground">No se cumple</span>}
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        {kind === 'suspension' && (
          <FormField id="ms-days" label="Días hábiles" required>
            <SelectField
              id="ms-days"
              value={days}
              options={['1', '2', '3'].map((d) => ({ value: d, label: d === '1' ? '1 día' : `${d} días` }))}
              onChange={setDays}
            />
          </FormField>
        )}
        <DateInput id="ms-start" label="Desde" value={startsOn || today} onChange={setStartsOn} />
        {kind !== 'corrective' && <DateInput id="ms-notified" label="Comunicada a la familia el" value={notified} max={today} onChange={setNotified} />}
      </div>
      <TextArea
        id="ms-detail"
        label={kind === 'corrective' ? 'Medida correctiva' : 'Fundamento y acompañamiento'}
        value={detail}
        onChange={setDetail}
        max={2000}
        required
        rows={4}
        hint={ground === 'systematic' || ground === 'no_family_support' ? 'Esta causal requiere una justificación detallada (al menos 40 caracteres).' : undefined}
      />
    </FormDialog>
  );
};
