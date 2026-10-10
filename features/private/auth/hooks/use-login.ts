'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '../actions/login';
import type { LoginFormData, UseLoginResult } from '../types';

export const useLogin = (): UseLoginResult => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    role: 'DIRECTIVO',
    docNumber: '',
    password: '',
    rememberMe: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const updateField = <K extends keyof LoginFormData>(field: K, value: LoginFormData[K]): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const clearNotification = (): void => {
    setNotification(null);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      const res = await loginAction(formData);
      if (res.success) {
        setNotification({ type: 'success', message: res.message });
        setTimeout(() => {
          router.push('/dashboard');
        }, 600);
      } else {
        setNotification({ type: 'error', message: res.message });
      }
    } catch {
      setNotification({ type: 'error', message: 'Error de conexión con el servidor.' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    notification,
    updateField,
    handleSubmit,
    clearNotification,
  };
};
