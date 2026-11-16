'use client';

import { useState, useTransition, type JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { holdSessionAction } from '../actions/hold-session';
import { formatWhen } from '../data/tutoring-data';
import type { HoldInput, TutoringSession } from '../types';

// Records a session held: who came (each gets the interview in their file, which also counts for the permanence),
// what was talked about (staff only), the agreements (the student reads them) and a commitment to follow up
export const HoldDialog = ({ slug, session, onClose, onSaved }: { slug: string; session: TutoringSession; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const [v, setV] = useState<HoldInput>({ id: session.id, attended: session.attendees.map((a) => a.studentId), notes: '', agreements: '', commitment: '', commitmentDue: '' });
  const [isPending, start] = useTransition();
  const set = (patch: Partial<HoldInput>): void => setV((x) => ({ ...x, ...patch }));
  const missingDue = v.commitment.trim() !== '' && !v.commitmentDue;
  const submit = (): void =>
    start(async () => {
      const r = await runAcademicAction(holdSessionAction(slug, { ...v, notes: v.notes.trim(), agreements: v.agreements.trim(), commitment: v.commitment.trim() }));
      if (r.ok) onSaved();
    });
  return (
    <FormDialog title="Registrar la tutoría" description={`${session.reason} · ${formatWhen(session.scheduledAt)}. Sin asistentes queda como «no asistió».`} submitLabel={v.attended.length > 0 ? 'Registrar' : 'Registrar como no asistió'} isPending={isPending} disabled={missingDue} onSubmit={submit} onClose={onClose} wide>
      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-foreground">¿Quiénes asistieron?</legend>
        <ul className="grid gap-1 sm:grid-cols-2">
          {session.attendees.map((a) => (
            <li key={a.studentId}>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" className="size-4 accent-brand" checked={v.attended.includes(a.studentId)} onChange={(e): void => set({ attended: e.target.checked ? [...v.attended, a.studentId] : v.attended.filter((x) => x !== a.studentId) })} />
                {a.studentName}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <FormField id="hold-notes" label="Lo conversado" hint="Solo lo lee el personal.">
        <Textarea id="hold-notes" rows={3} maxLength={4000} value={v.notes} onChange={(e): void => set({ notes: e.target.value })} />
      </FormField>
      <FormField id="hold-agreements" label="Acuerdos" hint="El estudiante los ve en su tutoría.">
        <Textarea id="hold-agreements" rows={2} maxLength={2000} value={v.agreements} onChange={(e): void => set({ agreements: e.target.value })} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-[1fr_11rem]">
        <FormField id="hold-commitment" label="Compromiso del estudiante" hint="Opcional: se revisa en la fecha.">
          <Input id="hold-commitment" maxLength={500} value={v.commitment} onChange={(e): void => set({ commitment: e.target.value })} />
        </FormField>
        <FormField id="hold-due" label="Para el" error={missingDue ? 'Indica la fecha.' : undefined}>
          <Input id="hold-due" type="date" value={v.commitmentDue} onChange={(e): void => set({ commitmentDue: e.target.value })} />
        </FormField>
      </div>
    </FormDialog>
  );
};
