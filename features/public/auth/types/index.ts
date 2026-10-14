export type AuthPageMode = 'signin' | 'signup' | 'forgot-password' | 'setup-password' | 'two-factor';

export interface AuthPageProps {
  mode: AuthPageMode;
}

export interface AuthFieldProps {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type?: string;
  placeholder: string;
  autoComplete: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
}

export interface TurnstileAPI {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
      theme: 'auto' | 'light' | 'dark';
    },
  ) => string;
  remove: (widgetId: string) => void;
}

export interface TurnstileChallengeProps {
  onTokenChange: (token: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}
