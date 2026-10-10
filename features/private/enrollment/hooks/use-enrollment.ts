'use client';

import { useState } from 'react';
import { saveEnrollmentAction } from '../actions/save-enrollment';
import type { EnrollmentFormData, EnrollmentRecord, SaveEnrollmentPayload, UseEnrollmentResult } from '../types';

const INITIAL_FORM: EnrollmentFormData = {
  docType: 'DNI',
  docNumber: '',
  paternalSurname: '',
  maternalSurname: '',
  firstNames: '',
  birthDate: '',
  gender: 'MASCULINO',
  phone: '',
  email: '',
  address: '',
  cycleLevel: 'AVANZADO_1',
  modality: 'SEMIPRESENCIAL',
  nativeLanguage: 'Castellano',
  hasSpecialNeeds: false,
  specialNeedsDescription: '',
  isWorking: true,
  occupation: '',
  availableShift: 'NOCHE',
};

export const useEnrollment = (): UseEnrollmentResult => {
  const [formData, setFormData] = useState<EnrollmentFormData>(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [lastRecord, setLastRecord] = useState<EnrollmentRecord | null>(null);

  const updateField = <K extends keyof EnrollmentFormData>(field: K, value: EnrollmentFormData[K]): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const clearNotification = (): void => {
    setNotification(null);
  };

  const resetForm = (): void => {
    setFormData(INITIAL_FORM);
    setLastRecord(null);
    clearNotification();
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    try {
      const docNumber = formData.docNumber.trim();
      const paternalSurname = formData.paternalSurname.trim();
      const maternalSurname = formData.maternalSurname.trim();
      const firstNames = formData.firstNames.trim();

      if (!docNumber || !paternalSurname || !firstNames) {
        throw new Error('Por favor, completa los datos obligatorios de identificación del estudiante.');
      }

      const payload: SaveEnrollmentPayload = {
        payload: {
          DOC_TYPE: formData.docType,
          DOC_NUMBER: docNumber,
          PATERNAL_SURNAME: paternalSurname.toUpperCase(),
          MATERNAL_SURNAME: maternalSurname.toUpperCase(),
          FIRST_NAMES: firstNames.toUpperCase(),
          BIRTH_DATE: formData.birthDate,
          GENDER: formData.gender,
          PHONE: formData.phone.trim(),
          EMAIL: formData.email.trim().toLowerCase(),
          ADDRESS: formData.address.trim().toUpperCase(),
          CYCLE_LEVEL: formData.cycleLevel,
          MODALITY: formData.modality,
          NATIVE_LANGUAGE: formData.nativeLanguage.trim().toUpperCase(),
          HAS_SPECIAL_NEEDS: formData.hasSpecialNeeds,
          SPECIAL_NEEDS_DESCRIPTION: formData.specialNeedsDescription.trim().toUpperCase(),
          IS_WORKING: formData.isWorking,
          OCCUPATION: formData.occupation.trim().toUpperCase(),
          AVAILABLE_SHIFT: formData.availableShift,
        },
      };

      const response = await saveEnrollmentAction(payload);

      if (response.success) {
        setLastRecord(response.data);
        setNotification({
          type: 'success',
          message: response.message,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error inesperado al registrar matrícula';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    isSaving,
    notification,
    lastRecord,
    updateField,
    handleSubmit,
    clearNotification,
    resetForm,
  };
};
