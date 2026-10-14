'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, AtSign, FileText, KeyRound, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/providers/theme';
import { AuthField } from './auth-field';
import { TurnstileChallenge } from './turnstile-challenge';
import type { AuthPageProps } from '../types';

const AuthPage = ({ mode }: AuthPageProps): JSX.Element => {
  const isSignIn = mode === 'signin';
  const isSignUp = mode === 'signup';
  const isSetup = mode === 'setup-password';
  const isTwoFactor = mode === 'two-factor';
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const title = isSignIn ? 'Continúa tu aprendizaje' : isSignUp ? 'Crea tu cuenta' : isSetup ? 'Configura tu contraseña' : isTwoFactor ? 'Verificación en dos pasos' : 'Recupera tu acceso';
  const description = isSignIn ? 'Ingresa a tu aula virtual para continuar con tus clases y actividades.' : isSignUp ? 'Regístrate para acceder a tu espacio de aprendizaje.' : isSetup ? 'Es tu primer ingreso. Crea una contraseña personal para proteger tu cuenta.' : isTwoFactor ? 'Ingresa el código de tu aplicación de autenticación o usa uno de tus códigos de respaldo.' : 'Escribe el correo asociado a tu cuenta para recibir ayuda con el acceso.';

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_42%),radial-gradient(ellipse_at_85%_90%,color-mix(in_oklab,var(--secondary)_10%,transparent),transparent_38%)]" />
      <ThemeToggle className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6" />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-4">
        <Card className="w-full gap-6 border-border/80 bg-card/90 px-1 py-6 shadow-xl shadow-primary/5 backdrop-blur-md sm:px-2 sm:py-8">
          <CardHeader className="items-center gap-3 text-center">
            <Link href="/" aria-label="CEBA Joseph Lister, inicio" className="mb-1 inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
              <Image src="/logo.png" alt="CEBA Joseph Lister" width={80} height={80} priority className="size-18 object-contain" />
            </Link>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">Educación Básica Alternativa</p>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">{title}</CardTitle>
            <CardDescription className="max-w-xs text-[13px] leading-5">{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <form className="flex flex-col gap-4">
              {isSignUp && <AuthField id="name" label="Nombres y apellidos" icon={UserRound} placeholder="Tu nombre completo" autoComplete="name" />}
              {(isSignIn || isSignUp || mode === 'forgot-password') && <AuthField id="email" label="Correo electrónico" icon={AtSign} type="email" placeholder="nombre@correo.com" autoComplete="email" value={isSignIn ? email : undefined} onChange={isSignIn ? (event): void => setEmail(event.currentTarget.value) : undefined} />}
              {(isSignIn || isSignUp) && <AuthField id="password" label={isSignUp ? 'Crea una contraseña' : 'Contraseña'} icon={LockKeyhole} type="password" placeholder={isSignUp ? 'Mínimo 8 caracteres' : 'Ingresa tu contraseña'} autoComplete={isSignUp ? 'new-password' : 'current-password'} value={isSignIn ? password : undefined} onChange={isSignIn ? (event): void => setPassword(event.currentTarget.value) : undefined} />}
              {isSetup && <AuthField id="password" label="Nueva contraseña" icon={LockKeyhole} type="password" placeholder="Crea una contraseña segura" autoComplete="new-password" />}
              {(isSignUp || isSetup) && <AuthField id="confirmation" label="Confirma tu contraseña" icon={KeyRound} type="password" placeholder="Repite tu contraseña" autoComplete="new-password" />}
              {isTwoFactor && (
                <>
                  <AuthField id="verification-code" label={useBackupCode ? 'Código de respaldo' : 'Código de autenticación'} icon={KeyRound} placeholder={useBackupCode ? 'Ingresa un código de respaldo' : 'Código de 6 dígitos'} autoComplete="one-time-code" inputMode={useBackupCode ? 'text' : 'numeric'} maxLength={useBackupCode ? 32 : 6} />
                  <button type="button" onClick={(): void => setUseBackupCode((current) => !current)} className="self-start text-xs font-medium text-primary underline-offset-4 hover:underline">
                    {useBackupCode ? 'Usar código de autenticación' : 'Usar un código de respaldo'}
                  </button>
                </>
              )}
              {isSignIn && (
                <div className="-mt-1 flex justify-end">
                  <Link href="/auth/password/forgot" className="text-xs font-medium text-primary underline-offset-4 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              )}
              {(isSignIn || isSignUp) && (
                <>
                  <TurnstileChallenge onTokenChange={setTurnstileToken} />
                </>
              )}
              <Button type="button" size="lg" className="mt-1 h-11 w-full rounded-lg font-semibold" disabled={isSignIn && (!email.trim() || !password || !turnstileToken)}>
                {isSignIn ? 'Iniciar sesión' : isSignUp ? 'Crear cuenta' : isSetup ? 'Guardar contraseña' : isTwoFactor ? 'Verificar código' : 'Enviar instrucciones'}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
              {(isSignIn || isSignUp) && (
                <>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">o continúa con</div>
                  <Button type="button" variant="outline" size="lg" className="h-11 w-full rounded-lg font-semibold">
                    <Image src="/icons/google.svg" alt="" width={20} height={20} className="size-5" />
                    {isSignUp ? 'Continuar con Google' : 'Iniciar sesión con Google'}
                  </Button>
                </>
              )}
            </form>
            {(isSignIn || isSignUp || mode === 'forgot-password') && (
              <p className="text-center text-[13px] text-muted-foreground">
                {isSignIn ? '¿Aún no tienes cuenta?' : isSignUp ? '¿Ya tienes una cuenta?' : '¿Recordaste tu contraseña?'}{' '}
                <Link href={isSignIn ? '/auth/signup' : '/auth/signin'} className="font-semibold text-primary underline-offset-4 hover:underline">
                  {isSignIn ? 'Crear cuenta' : 'Inicia sesión'}
                </Link>
              </p>
            )}
            <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/70 px-3 py-3 text-[11px] leading-4 text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-secondary" />
              Tu información se utiliza para gestionar tu acceso educativo.
            </div>
            <div className="flex justify-center gap-4 text-[11px]">
              <Link href="/legal/terms" className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary">
                <FileText aria-hidden="true" className="size-3.5" />
                Términos
              </Link>
              <Link href="/legal/privacy" className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary">
                <ShieldCheck aria-hidden="true" className="size-3.5" />
                Privacidad
              </Link>
            </div>
          </CardContent>
        </Card>
        <a href="https://wa.me/51966845120?text=Hola%2C%20necesito%20ayuda%20con%20mi%20acceso%20al%20aula%20virtual" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
          <Image src="/icons/whatsapp-icon.svg" alt="" width={16} height={16} className="size-4" /> ¿Necesitas ayuda con tu acceso?
        </a>
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft aria-hidden="true" className="size-3.5" /> Volver al sitio institucional
        </Link>
      </div>
    </main>
  );
};

export { AuthPage };
