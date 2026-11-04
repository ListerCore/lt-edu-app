import type { TurnstileInstance } from '@marsidev/react-turnstile';
import type { ReactNode, RefObject } from 'react';

// Result shared by every simulated auth action; `code` lets the hooks react to specific failures
export interface AuthActionResult {
  ok: boolean;
  message: string;
  code?: 'invalid_credentials' | 'email_taken' | 'invalid_code' | 'expired_link';
}

export interface SignInPayload {
  email: string;
  password: string;
  captchaToken: string;
}

export interface SignUpPayload {
  nombre: string;
  email: string;
  password: string;
  captchaToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
  captchaToken: string;
}

export interface PasswordSetupPayload {
  token: string;
  password: string;
}

export interface TwoFactorPayload {
  email: string;
  code: string;
}

export type FieldErrors<F extends string> = Partial<Record<F | 'captcha', string>>;

// Turnstile wiring shared by the forms that sit in front of a public endpoint
export interface CaptchaState {
  turnstileRef: RefObject<TurnstileInstance | null>;
  setCaptchaToken: (token: string | null) => void;
}

export interface SignInValues {
  email: string;
  password: string;
}

export interface UseSignInResult extends CaptchaState {
  values: SignInValues;
  errors: FieldErrors<keyof SignInValues>;
  isPending: boolean;
  setField: (field: keyof SignInValues, value: string) => void;
  submit: () => void;
}

export interface SignUpValues {
  fullName: string;
  email: string;
  password: string;
  confirm: string;
  terms: boolean;
}

export interface UseSignUpResult extends CaptchaState {
  values: SignUpValues;
  errors: FieldErrors<keyof SignUpValues>;
  isPending: boolean;
  setField: <K extends keyof SignUpValues>(field: K, value: SignUpValues[K]) => void;
  submit: () => void;
}

export interface UseForgotPasswordResult extends CaptchaState {
  email: string;
  error?: string;
  captchaError?: string;
  isPending: boolean;
  sentTo: string | null;
  setEmail: (value: string) => void;
  submit: () => void;
  reset: () => void;
}

export interface UsePasswordSetupResult {
  password: string;
  confirm: string;
  errors: FieldErrors<'password' | 'confirm'>;
  isPending: boolean;
  setPassword: (value: string) => void;
  setConfirm: (value: string) => void;
  submit: () => void;
}

export interface UseTwoFactorResult {
  digits: string[];
  error?: string;
  isPending: boolean;
  resendIn: number;
  setDigits: (digits: string[]) => void;
  submit: () => void;
  resend: () => void;
}

export interface PasswordRule {
  label: string;
  test: (password: string) => boolean;
}

export interface AuthCardProps {
  id: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export interface PasswordChecklistProps {
  password: string;
}

export interface OtpInputProps {
  digits: string[];
  invalid: boolean;
  disabled: boolean;
  onChange: (digits: string[]) => void;
  onComplete: () => void;
}

export interface GoogleIconProps {
  className?: string;
}

export interface UseCaptchaResult extends CaptchaState {
  captchaToken: string | null;
  consume: () => string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
}

export interface ChangePasswordValues {
  current: string;
  password: string;
  confirm: string;
}

export interface UseChangePasswordResult {
  values: ChangePasswordValues;
  errors: FieldErrors<keyof ChangePasswordValues>;
  isPending: boolean;
  setField: (field: keyof ChangePasswordValues, value: string) => void;
  submit: () => void;
}
