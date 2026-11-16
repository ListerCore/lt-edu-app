'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { ChoiceChips, controlClassName, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { items } from '@/features/protected/academic/data/academic-data';
import { deviceLabels, fileDocumentLabels, internetLabels, motherTongueLabels, preferredModeLabels } from '../data/people-data';
import { useSaveEnrollmentFile } from '../hooks/use-save-enrollment-file';
import type { EnrollmentFileDialogProps } from '../types';

// Edits the ficha única: tongue, occupation, disability, connectivity, the form of attention asked for, last studies
// and the documents shown
export const EnrollmentFileDialog = ({ slug, file, onClose, onSaved }: EnrollmentFileDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useSaveEnrollmentFile(slug, file, (): void => {
    onSaved();
    onClose();
  });
  return (
    <FormDialog title="Ficha única de matrícula" description="Lo que la ficha pide además de los datos del estudiante. Sirve para elegir la forma de atención y para el SIAGIE." submitLabel="Guardar ficha" isPending={isPending} onSubmit={submit} onClose={onClose} wide>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="ef-tongue" label="Lengua materna" required>
          <SelectField id="ef-tongue" value={values.motherTongue} options={items(motherTongueLabels)} onChange={(v): void => setField('motherTongue', v)} />
        </FormField>
        {values.motherTongue === 'other' ? (
          <FormField id="ef-tongue-other" label="¿Cuál?" required error={errors.motherTongueOther}>
            <Input id="ef-tongue-other" value={values.motherTongueOther} maxLength={60} onChange={(e): void => setField('motherTongueOther', e.target.value)} className={controlClassName} />
          </FormField>
        ) : (
          <FormField id="ef-occupation" label="Ocupación" error={errors.occupation}>
            <Input id="ef-occupation" placeholder="Ej.: Comerciante" value={values.occupation} maxLength={120} onChange={(e): void => setField('occupation', e.target.value)} className={controlClassName} />
          </FormField>
        )}
        {values.motherTongue === 'other' && (
          <FormField id="ef-occupation" label="Ocupación" error={errors.occupation}>
            <Input id="ef-occupation" placeholder="Ej.: Comerciante" value={values.occupation} maxLength={120} onChange={(e): void => setField('occupation', e.target.value)} className={controlClassName} />
          </FormField>
        )}
        <FormField id="ef-internet" label="Internet" required error={errors.internet}>
          <SelectField id="ef-internet" value={values.internet} options={items(internetLabels)} onChange={(v): void => setField('internet', v)} />
        </FormField>
        <FormField id="ef-device" label="Dispositivo" required error={errors.device}>
          <SelectField id="ef-device" value={values.device} options={items(deviceLabels)} onChange={(v): void => setField('device', v)} />
        </FormField>
        <FormField id="ef-mode" label="Forma de atención que solicita" error={errors.preferredMode} hint="Sin internet ni dispositivo, la forma a distancia es itinerante.">
          <SelectField id="ef-mode" value={values.preferredMode} options={items(preferredModeLabels)} onChange={(v): void => setField('preferredMode', v)} />
        </FormField>
        <FormField id="ef-studies" label="Últimos estudios" error={errors.lastStudies}>
          <Input id="ef-studies" placeholder="Ej.: 6.° de primaria, EBR, 2010" value={values.lastStudies} maxLength={160} onChange={(e): void => setField('lastStudies', e.target.value)} className={controlClassName} />
        </FormField>
      </div>
      <FormField id="ef-disability" label="Discapacidad" error={errors.disability} hint="Si la tiene: el tipo (visual, auditiva, física, intelectual…). Marca también NEE en los datos del estudiante.">
        <Input id="ef-disability" value={values.disability} maxLength={200} onChange={(e): void => setField('disability', e.target.value)} className={controlClassName} />
      </FormField>
      <FormField id="ef-documents" label="Documentos presentados" error={errors.documents} hint="Súbelos escaneados en la pestaña Documentos.">
        <ChoiceChips label="Documentos presentados" options={items(fileDocumentLabels)} selected={values.documents} onChange={(v): void => setField('documents', v)} />
      </FormField>
    </FormDialog>
  );
};
