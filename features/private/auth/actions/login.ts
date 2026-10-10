import type { LoginFormData, LoginResponse } from '../types';

export const loginAction = async (data: LoginFormData): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const doc = data.docNumber.trim();
  const pass = data.password.trim();

  if (!doc || !pass) {
    return {
      success: false,
      message: 'Ingresa tu DNI o Código Modular y tu contraseña.',
    };
  }

  return {
    success: true,
    user: {
      name: data.role === 'DIRECTIVO' ? 'Mg. Roberto Zevallos Ramos' : 'Prof. Carlos Mejía',
      role: data.role,
      dni: doc,
    },
    message: 'Acceso autorizado. Redirigiendo al panel institucional...',
  };
};
