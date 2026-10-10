export type CycleLevel = 'INICIAL' | 'INTERMEDIO' | 'AVANZADO_1' | 'AVANZADO_2' | 'AVANZADO_3' | 'AVANZADO_4';

export type ModalityType = 'PRESENCIAL' | 'SEMIPRESENCIAL' | 'A_DISTANCIA';

export interface EnrollmentFormData {
  docType: 'DNI' | 'CARNET_EXTRANJERIA' | 'PASAPORTE';
  docNumber: string;
  paternalSurname: string;
  maternalSurname: string;
  firstNames: string;
  birthDate: string;
  gender: 'MASCULINO' | 'FEMENINO';
  phone: string;
  email: string;
  address: string;
  cycleLevel: CycleLevel;
  modality: ModalityType;
  nativeLanguage: string;
  hasSpecialNeeds: boolean;
  specialNeedsDescription: string;
  isWorking: boolean;
  occupation: string;
  availableShift: 'MANANA' | 'TARDE' | 'NOCHE';
}

export interface EnrollmentRecord extends EnrollmentFormData {
  id: string;
  enrollmentCode: string;
  siagieStatus: 'VALIDADO' | 'PENDIENTE' | 'OBSERVADO';
  createdAt: string;
}

export interface SaveEnrollmentPayload {
  payload: {
    DOC_TYPE: string;
    DOC_NUMBER: string;
    PATERNAL_SURNAME: string;
    MATERNAL_SURNAME: string;
    FIRST_NAMES: string;
    BIRTH_DATE: string;
    GENDER: string;
    PHONE: string;
    EMAIL: string;
    ADDRESS: string;
    CYCLE_LEVEL: CycleLevel;
    MODALITY: ModalityType;
    NATIVE_LANGUAGE: string;
    HAS_SPECIAL_NEEDS: boolean;
    SPECIAL_NEEDS_DESCRIPTION: string;
    IS_WORKING: boolean;
    OCCUPATION: string;
    AVAILABLE_SHIFT: string;
  };
}

export interface SaveEnrollmentResponse {
  success: boolean;
  data: EnrollmentRecord;
  message: string;
}

export interface UseEnrollmentResult {
  formData: EnrollmentFormData;
  isSaving: boolean;
  notification: { type: 'success' | 'error'; message: string } | null;
  lastRecord: EnrollmentRecord | null;
  updateField: <K extends keyof EnrollmentFormData>(field: K, value: EnrollmentFormData[K]) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearNotification: () => void;
  resetForm: () => void;
}

export interface EnrollmentHeaderProps {
  title: string;
  subtitle: string;
}

export interface EnrollmentFormProps {
  formData: EnrollmentFormData;
  isSaving: boolean;
  updateField: <K extends keyof EnrollmentFormData>(field: K, value: EnrollmentFormData[K]) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export interface EnrollmentSummaryProps {
  lastRecord: EnrollmentRecord | null;
  onNewEnrollment: () => void;
}
