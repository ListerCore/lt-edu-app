import type { EnrollmentRecord, SaveEnrollmentPayload, SaveEnrollmentResponse } from '../types';

let enrollmentsStore: EnrollmentRecord[] = [];

export const getStoredEnrollments = (): EnrollmentRecord[] => enrollmentsStore;

export const saveEnrollmentAction = async (payloadData: SaveEnrollmentPayload): Promise<SaveEnrollmentResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const { payload } = payloadData;
  const count = enrollmentsStore.length + 1;
  const enrollmentCode = `MAT-2026-${count.toString().padStart(4, '0')}`;

  const newRecord: EnrollmentRecord = {
    id: `enr-${Date.now()}`,
    enrollmentCode,
    docType: payload.DOC_TYPE as 'DNI',
    docNumber: payload.DOC_NUMBER,
    paternalSurname: payload.PATERNAL_SURNAME,
    maternalSurname: payload.MATERNAL_SURNAME,
    firstNames: payload.FIRST_NAMES,
    birthDate: payload.BIRTH_DATE,
    gender: payload.GENDER as 'MASCULINO',
    phone: payload.PHONE,
    email: payload.EMAIL,
    address: payload.ADDRESS,
    cycleLevel: payload.CYCLE_LEVEL,
    modality: payload.MODALITY,
    nativeLanguage: payload.NATIVE_LANGUAGE,
    hasSpecialNeeds: payload.HAS_SPECIAL_NEEDS,
    specialNeedsDescription: payload.SPECIAL_NEEDS_DESCRIPTION,
    isWorking: payload.IS_WORKING,
    occupation: payload.OCCUPATION,
    availableShift: payload.AVAILABLE_SHIFT as 'NOCHE',
    siagieStatus: 'VALIDADO',
    createdAt: new Date().toISOString(),
  };

  enrollmentsStore = [newRecord, ...enrollmentsStore];

  return {
    success: true,
    data: newRecord,
    message: `Matrícula ${enrollmentCode} registrada y validada en SIAGIE 3.0 con éxito.`,
  };
};
