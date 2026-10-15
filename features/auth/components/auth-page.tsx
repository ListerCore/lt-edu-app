'use client';

import { useState, type FormEvent, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, AtSign, BookOpen, Building2, CheckCircle2, Eye, EyeOff, Fingerprint, FlaskConical, GraduationCap, KeyRound, LockKeyhole, ShieldCheck, UserRound, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/providers/theme';
import { AuthField } from './auth-field';
import { TurnstileChallenge } from './turnstile-challenge';
import type { AuthPageProps } from '../types';
import { AuthInfoPanel } from './auth-info-panel';

const roles = [
  { label: 'Promotor', icon: ShieldCheck },
  { label: 'Director', icon: Building2 },
  { label: 'Coord. Acad.', icon: BookOpen },
  { label: 'Docente', icon: GraduationCap },
  { label: 'Estudiante', icon: UserRound },
];

const roleOptions: Record<string, string[]> = {
  Promotor: ['Promotor General', 'Promotor Institucional'],
  Director: ['Director General', 'Director Académico'],
  'Coord. Acad.': ['Coordinador Académico', 'Coordinador de Ciclo'],
  Docente: ['Docente Tutor', 'Docente de Área'],
  Estudiante: ['Estudiante EBA', 'Estudiante con matrícula vigente'],
};

const AuthPage = ({ mode }: AuthPageProps): JSX.Element => {
  const router = useRouter();
  const isSignIn = mode === 'signin';
  const isSignUp = mode === 'signup';
  const isSetup = mode === 'setup-password';
  const isTwoFactor = mode === 'two-factor';
  const isForgot = mode === 'forgot-password';
  const [role, setRole] = useState('Promotor');
  const [roleOption, setRoleOption] = useState('Promotor General');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [remember, setRemember] = useState(true);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [notice, setNotice] = useState('');

  const title = isSignIn ? 'Acceso al Campus Virtual EBA' : isSignUp ? 'Registro de acceso académico' : isSetup ? 'Configura tu contraseña' : isTwoFactor ? 'Verificación en dos pasos' : 'Recupera tu acceso institucional';
  const description = isSignIn ? 'Plataforma oficial 100% virtual autorizada por DREA Ayacucho / MINEDU' : isSignUp ? 'Solicita tu cuenta para ingresar a los servicios académicos de Joseph Lister.' : isSetup ? 'Crea una clave personal para proteger tu acceso al sistema académico.' : isTwoFactor ? 'Confirma tu identidad con el código de seguridad asociado a tu cuenta.' : 'Indica el correo institucional para recibir instrucciones de recuperación.';

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isSignIn || isTwoFactor) {
      router.push('/dashboard');
      return;
    }
    if (isSignUp) {
      if (!turnstileToken) {
        setNotice('Completa la verificación de seguridad para enviar tu solicitud.');
        return;
      }
      setNotice('Solicitud de registro recibida. El equipo institucional validará tus datos.');
      return;
    }
    if (isForgot) {
      setNotice('Si el correo está registrado, recibirás las instrucciones de recuperación.');
      return;
    }
    setNotice('Contraseña actualizada. Ya puedes iniciar sesión.');
    window.setTimeout(() => router.push('/auth/signin'), 1300);
  };

  const updateRole = (value: string): void => {
    setRole(value);
    setRoleOption(roleOptions[value][0]);
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-between gap-5 bg-background px-3 py-4 sm:px-6 sm:py-6">
      <ThemeToggle className="fixed right-3 top-3 z-30 size-9 rounded-md border border-border bg-card text-muted-foreground sm:right-6 sm:top-5" />
      <div className="flex w-full flex-1 items-center justify-center pt-10 sm:pt-4">
        <div className="grid w-full max-w-370 overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-foreground/5 lg:min-h-[min(850px,calc(100svh-8rem))] lg:grid-cols-[1.2fr_.88fr]">
          <section className="flex min-w-0 flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10 xl:px-14">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <Link href="/" aria-label="SIGE-JL, sitio institucional" className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Image src="/logo.png" alt="" width={44} height={44} priority className="size-11 object-contain" />
                <span>
                  <span className="block font-heading text-sm font-extrabold leading-4 text-foreground">SIGE-JL</span>
                  <span className="mt-0.5 block text-[8px] font-bold tracking-[0.12em] text-secondary">CEBA JOSEPH LISTER</span>
                </span>
              </Link>
              <span aria-hidden="true" className="hidden h-9 w-px bg-border sm:block" />
              <div className="flex items-center gap-2">
                <span className="rounded bg-accent px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-primary">EBA Virtual</span>
                <span className="text-[10px] text-muted-foreground">Ayacucho, Perú</span>
              </div>
              <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-[9px] font-semibold text-secondary md:inline-flex">
                <span className="size-1.5 animate-pulse rounded-full bg-secondary" />
                Plataforma operativa 24/7
              </span>
            </div>

            <div className="mt-7 sm:mt-10">
              <p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-secondary">
                <GraduationCap aria-hidden="true" className="size-4" />
                Portal único de acceso académico
              </p>
              <h1 className="mt-3 max-w-2xl font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl xl:text-[34px]">{title}</h1>
              <p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm">{description}</p>
            </div>

            {(isSignIn || isSignUp) && (
              <section className="mt-5 rounded-lg bg-accent/60 p-3 sm:p-4" aria-label="Perfil de usuario">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="flex items-center gap-1.5 text-[10px] font-bold text-foreground">
                    <Users aria-hidden="true" className="size-3.5" />
                    Seleccione perfil de usuario
                  </h2>
                  <span className="rounded bg-secondary px-2 py-1 text-[8px] font-bold text-secondary-foreground">{role} activo</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {roles.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={(): void => updateRole(label)}
                      aria-pressed={role === label}
                      className={`flex min-h-15.5 flex-col items-center justify-center gap-1 rounded-md border px-1 py-2 text-center text-[8px] font-semibold transition-colors sm:min-h-17.5 sm:text-[9px] ${role === label ? 'border-primary bg-primary text-primary-foreground' : 'border-transparent bg-card text-muted-foreground hover:border-border hover:text-foreground'}`}
                    >
                      <Icon aria-hidden="true" className="size-4" />
                      {label}
                    </button>
                  ))}
                </div>
                <label className="mt-2 flex flex-col gap-1.5 border-t border-border/80 pt-2 text-[8px] font-medium text-muted-foreground sm:flex-row sm:items-center">
                  <span className="shrink-0">O seleccione otro rol:</span>
                  <select value={roleOption} onChange={(event): void => setRoleOption(event.target.value)} className="h-8 min-w-0 flex-1 rounded-md border border-border bg-card px-2 text-[9px] text-foreground">
                    {roleOptions[role].map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </section>
            )}

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
              {isSignUp && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <AuthField id="full-name" label="Nombres y apellidos" icon={UserRound} placeholder="Nombre completo" autoComplete="name" />
                  <AuthField id="identity" label="DNI" icon={Fingerprint} placeholder="8 dígitos" autoComplete="off" inputMode="numeric" maxLength={8} />
                </div>
              )}
              {(isSignIn || isSignUp || isForgot) && <AuthField id="email" label={isSignIn ? 'DNI, código modular o correo institucional' : 'Correo institucional'} icon={isSignIn ? UserRound : AtSign} type={isSignIn ? 'text' : 'email'} placeholder={isSignIn ? 'promotoria@cebajosephlister.edu.pe' : 'nombre@cebajosephlister.edu.pe'} autoComplete="username" value={email} onChange={(event): void => setEmail(event.currentTarget.value)} />}
              {(isSignIn || isSignUp || isSetup) && (
                <AuthField
                  id="password"
                  label={isSetup ? 'Nueva contraseña' : isSignUp ? 'Crea una contraseña' : 'Contraseña de acceso'}
                  icon={LockKeyhole}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isSignIn ? 'Ingresa tu contraseña' : 'Mínimo 8 caracteres'}
                  autoComplete={isSignIn ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(event): void => setPassword(event.currentTarget.value)}
                  trailingAction={
                    <button type="button" onClick={(): void => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="grid size-9 place-items-center rounded text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
                    </button>
                  }
                />
              )}
              {(isSignUp || isSetup) && <AuthField id="confirmation" label="Confirma tu contraseña" icon={KeyRound} type="password" placeholder="Repite la contraseña" autoComplete="new-password" />}
              {isSignUp && (
                <>
                  <TurnstileChallenge onTokenChange={setTurnstileToken} />
                  {turnstileToken && (
                    <p className="flex items-center gap-1.5 text-[9px] font-semibold text-secondary">
                      <CheckCircle2 aria-hidden="true" className="size-3.5" />
                      Verificación de seguridad completada
                    </p>
                  )}
                </>
              )}
              {isTwoFactor && (
                <>
                  <AuthField id="verification-code" label={useBackupCode ? 'Código de respaldo' : 'Código de verificación'} icon={KeyRound} placeholder={useBackupCode ? 'Ingresa tu código de respaldo' : 'Código de 6 dígitos'} autoComplete="one-time-code" inputMode={useBackupCode ? 'text' : 'numeric'} maxLength={useBackupCode ? 32 : 6} />
                  <button type="button" onClick={(): void => setUseBackupCode((current) => !current)} className="self-start text-[10px] font-semibold text-primary hover:underline">
                    {useBackupCode ? 'Usar código de autenticación' : 'Usar código de respaldo'}
                  </button>
                </>
              )}
              {isSignIn && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-[9px]">
                  <label className="inline-flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" checked={remember} onChange={(event): void => setRemember(event.currentTarget.checked)} className="size-3.5 accent-primary" />
                    Recordar sesión en este equipo
                  </label>
                  <Link href="/auth/password/forgot" className="font-medium text-primary hover:underline">
                    ¿Olvidó su contraseña?
                  </Link>
                </div>
              )}
              {(isSignIn || isSignUp) && (
                <label className="flex flex-col gap-1.5 text-[9px] font-medium text-muted-foreground sm:max-w-88">
                  Periodo lectivo
                  <select className="h-9 rounded-md border border-border bg-accent/50 px-3 text-[10px] font-semibold text-foreground">
                    <option>Periodo 2026-II (Vigente)</option>
                    <option>Periodo 2026-I (Consulta)</option>
                  </select>
                </label>
              )}
              {isSetup && <p className="rounded-md bg-accent/50 p-3 text-[9px] leading-4 text-muted-foreground">Usa al menos 8 caracteres e incluye una combinación segura de letras, números y símbolos.</p>}
              <button type="submit" className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
                {isSignIn ? 'Ingresar al Sistema SIGE-JL' : isSignUp ? 'Solicitar acceso institucional' : isSetup ? 'Guardar nueva contraseña' : isTwoFactor ? 'Verificar identidad' : 'Enviar instrucciones'}
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </form>

            {(isSignIn || isSignUp) && (
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center gap-3 text-[8px] text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">o continúa con</div>
                <button type="button" onClick={(): void => router.push('/dashboard')} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-card text-[9px] font-semibold text-foreground transition-colors hover:bg-muted">
                  <Image src="/icons/google.svg" alt="" width={16} height={16} className="size-4" />
                  {isSignUp ? 'Continuar con Google' : 'Iniciar sesión con Google'}
                </button>
              </div>
            )}

            {isSignIn && (
              <div className="mt-3 grid gap-2 border-t border-border pt-3 sm:grid-cols-2">
                <button type="button" onClick={(): void => router.push('/dashboard')} className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-accent px-3 text-[9px] font-medium text-foreground hover:bg-muted">
                  <Fingerprint aria-hidden="true" className="size-3.5 text-secondary" />
                  Acceso con DNI electrónico
                </button>
                <button
                  type="button"
                  onClick={(): void => {
                    setEmail('promotoria@cebajosephlister.edu.pe');
                    setPassword('Demo2026!');
                  }}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-accent px-3 text-[9px] font-medium text-foreground hover:bg-muted"
                >
                  <FlaskConical aria-hidden="true" className="size-3.5 text-primary" />
                  Cargar demo de prueba
                </button>
              </div>
            )}

            {notice && (
              <p role="status" className="mt-3 rounded-md border border-secondary/30 bg-secondary/10 p-3 text-[10px] leading-4 text-secondary">
                {notice}
              </p>
            )}
            {(isSignIn || isSignUp || isForgot) && (
              <p className="mt-4 text-center text-[10px] text-muted-foreground">
                {isSignIn ? '¿No tienes cuenta?' : isSignUp ? '¿Ya tienes una cuenta?' : '¿Recordaste tu contraseña?'}{' '}
                <Link href={isSignIn ? '/auth/signup' : '/auth/signin'} className="font-bold text-primary hover:underline">
                  {isSignIn ? 'Solicitar registro' : 'Iniciar sesión'}
                </Link>
              </p>
            )}
            <div className="mt-auto flex items-start gap-2 border-t border-border pt-4 text-[9px] leading-4 text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" />
              <p>Acceso cifrado con protocolo SSL/TLS. Las sesiones se registran conforme a la Ley N.° 29733 de Protección de Datos Personales del Estado Peruano.</p>
            </div>
          </section>

          <AuthInfoPanel />
        </div>
      </div>
      <footer className="flex w-full max-w-275 flex-col items-center gap-1 pb-1 text-center text-[8px] leading-4 text-muted-foreground">
        <p className="flex flex-wrap justify-center gap-x-3">
          <span>CEBA Privado Virtual “Joseph Lister”</span>
          <span>•</span>
          <span>SIGE-JL v4.8 Inteligente</span>
          <span>•</span>
          <span>DREA Ayacucho / UGEL Huamanga</span>
          <span>•</span>
          <Link href="/legal/terms" className="underline underline-offset-2">
            Términos del servicio
          </Link>
          <Link href="/legal/privacy" className="underline underline-offset-2">
            Privacidad
          </Link>
        </p>
        <p>© 2026 Todos los derechos reservados. Diseñado para la inclusión educativa y el fortalecimiento de competencias en jóvenes y adultos.</p>
        <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground">
          <ArrowLeft aria-hidden="true" className="size-3" />
          Volver al sitio institucional
        </Link>
      </footer>
    </main>
  );
};

export { AuthPage };
