'use client';

import type { JSX } from 'react';
import { useLogin } from '../hooks/use-login';
import { LoginCard } from './login-card';

export const LoginBody = (): JSX.Element => {
  const { formData, isLoading, notification, updateField, handleSubmit, clearNotification } = useLogin();

  return (
    <main className="min-h-screen bg-[#070E1D] flex items-center justify-center p-4">
      <LoginCard formData={formData} isLoading={isLoading} notification={notification} updateField={updateField} onSubmit={handleSubmit} onClearNotification={clearNotification} />
    </main>
  );
};
