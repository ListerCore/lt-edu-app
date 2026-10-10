export type UserRole = 'DIRECTIVO' | 'DOCENTE' | 'ESTUDIANTE';

export interface LoginFormData {
  role: UserRole;
  docNumber: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    name: string;
    role: UserRole;
    dni: string;
  };
  message: string;
}

export interface UseLoginResult {
  formData: LoginFormData;
  isLoading: boolean;
  notification: { type: 'success' | 'error'; message: string } | null;
  updateField: <K extends keyof LoginFormData>(field: K, value: LoginFormData[K]) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearNotification: () => void;
}

export interface LoginCardProps {
  formData: LoginFormData;
  isLoading: boolean;
  notification: { type: 'success' | 'error'; message: string } | null;
  updateField: <K extends keyof LoginFormData>(field: K, value: LoginFormData[K]) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClearNotification: () => void;
}
