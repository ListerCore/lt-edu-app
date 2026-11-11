'use client';

import { useEffect, useRef, useState, useSyncExternalStore, useTransition, type FormEvent, type JSX } from 'react';
import { Camera, CameraOff, LoaderCircle, ScanLine, UserRound } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { isAttendanceEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getRecentScansAction, scanAction } from '../actions/attendance-actions';
import { formatClock, markLabels } from '../data/attendance-data';
import type { ScanResult } from '../types';
import { Empty, MarkPill } from './attendance-ui';

type Outcome = { kind: 'ok'; result: ScanResult; at: number } | { kind: 'error'; message: string; at: number };

// Minimal typing of the Shape Detection API (Chrome, Edge, Android); other browsers use the input with a USB reader
interface DetectedCode {
  rawValue: string;
}
interface BarcodeDetectorLike {
  detect: (source: CanvasImageSource) => Promise<DetectedCode[]>;
}
type BarcodeDetectorCtor = new (options: { formats: string[] }) => BarcodeDetectorLike;
const noSubscription = (): (() => void) => () => undefined;
const detectorCtor = (): BarcodeDetectorCtor | null => (typeof window !== 'undefined' && 'BarcodeDetector' in window ? (window as unknown as { BarcodeDetector: BarcodeDetectorCtor }).BarcodeDetector : null);

// Puerta: the auxiliar scans each ID card (USB reader, camera or the code typed by hand); the family is told at once
export const GateView = ({ slug }: { slug: string }): JSX.Element => {
  const [input, setInput] = useState('');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [isPending, startTransition] = useTransition();
  const [camera, setCamera] = useState(false);
  const field = useRef<HTMLInputElement>(null);
  const busy = useRef(false);
  const lastRead = useRef<{ value: string; at: number }>({ value: '', at: 0 });
  const { data: recent, reload } = useAcademicData(`att-scans:${slug}`, () => getRecentScansAction(slug), isAttendanceEvent);
  // Known only in the browser; the server render has no camera button
  const hasDetector = useSyncExternalStore(noSubscription, () => Boolean(detectorCtor()), () => false);

  const submit = (value: string): void => {
    const code = value.trim();
    if (!code || busy.current) return;
    busy.current = true;
    startTransition(async () => {
      const result = await scanAction(slug, code);
      busy.current = false;
      setInput('');
      setOutcome(result.ok ? { kind: 'ok', result: result.data, at: Date.now() } : { kind: 'error', message: result.message, at: Date.now() });
      reload();
      field.current?.focus();
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit(input);
  };

  // A camera read of the same card within 4 s is the same person still in front of it
  const onDetected = (value: string): void => {
    const now = Date.now();
    if (value === lastRead.current.value && now - lastRead.current.at < 4000) return;
    lastRead.current = { value, at: now };
    submit(value);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-background p-5 md:p-6">
          <label htmlFor="gate-input" className="text-sm font-medium text-foreground">
            Carnet
          </label>
          <p id="gate-hint" className="mt-1 text-xs text-muted-foreground">
            Con el lector USB basta acercar el carnet: escribe el código y pulsa Enter solo. También puedes escribir el código o el DNI.
          </p>
          <div className="mt-3 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <MorphIcon icon={ScanLine} size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={field}
                id="gate-input"
                aria-describedby="gate-hint"
                autoFocus
                autoComplete="off"
                spellCheck={false}
                value={input}
                maxLength={80}
                onChange={(e): void => setInput(e.target.value)}
                placeholder="Esperando carnet…"
                className="h-12 w-full rounded-xl border border-border bg-background pr-3 pl-10 font-mono text-base text-foreground tabular-nums focus-visible:outline-2 focus-visible:outline-brand"
              />
            </div>
            <button type="submit" className="btn-brand h-12" disabled={isPending || !input.trim()}>
              {isPending ? <MorphIcon icon={LoaderCircle} size={16} className="animate-spin" /> : 'Registrar'}
            </button>
          </div>
          {hasDetector && (
            <button type="button" className="btn-alt mt-3" onClick={(): void => setCamera((c) => !c)}>
              <MorphIcon icon={camera ? CameraOff : Camera} size={16} />
              {camera ? 'Apagar cámara' : 'Leer con la cámara'}
            </button>
          )}
          {camera && <CameraReader onCode={onDetected} onFail={(message): void => { setCamera(false); setOutcome({ kind: 'error', message, at: Date.now() }); }} />}
        </form>
        <Arrival outcome={outcome} />
      </div>

      <section aria-labelledby="gate-recent" className="rounded-2xl border border-border bg-background">
        <h2 id="gate-recent" className="border-b border-border px-5 py-4 text-sm font-semibold text-foreground">
          Últimas lecturas de hoy
        </h2>
        {!recent ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">Cargando…</p>
        ) : recent.length === 0 ? (
          <div className="p-5">
            <Empty>Aún nadie pasó por la puerta hoy.</Empty>
          </div>
        ) : (
          <ol className="max-h-[32rem] divide-y divide-border overflow-y-auto" aria-live="polite">
            {recent.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-5 py-3">
                <span className="w-12 shrink-0 text-sm text-muted-foreground tabular-nums">{formatClock(s.scannedAt)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{s.holder?.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {s.holder?.kind === 'staff' ? s.holder.detail || 'Personal' : s.holder?.code}
                    {s.source === 'manual' && ' · escrito a mano'}
                  </span>
                </span>
                <MarkPill status={s.status} />
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
};

// The big card the person at the gate (and the student) sees after each read
const Arrival = ({ outcome }: { outcome: Outcome | null }): JSX.Element => {
  if (!outcome)
    return (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Aquí aparecerá cada persona al pasar su carnet.
      </div>
    );
  if (outcome.kind === 'error')
    return (
      <div key={outcome.at} role="alert" className="gate-arrival flex min-h-48 flex-col justify-center rounded-2xl border border-destructive/40 bg-destructive/8 p-6">
        <p className="text-lg font-semibold text-destructive">No registrado</p>
        <p className="mt-1 text-sm text-foreground">{outcome.message}</p>
      </div>
    );
  const { result } = outcome;
  const late = result.status === 'late';
  return (
    <div
      key={outcome.at}
      role="status"
      className={cn(
        'gate-arrival flex min-h-48 items-center gap-5 rounded-2xl border p-6',
        result.repeated ? 'border-border bg-secondary' : late ? 'border-warning/40 bg-warning/10' : 'border-success/40 bg-success/10',
      )}
    >
      <span aria-hidden="true" className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-background text-muted-foreground">
        <MorphIcon icon={UserRound} size={36} />
      </span>
      <div className="min-w-0">
        <p className={cn('text-sm font-semibold', result.repeated ? 'text-muted-foreground' : late ? 'text-warning' : 'text-success')}>
          {result.repeated ? `Ya registrado hoy a las ${formatClock(result.arrivedAt)}` : `${markLabels[result.status]} · ${formatClock(result.arrivedAt)}`}
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-balance text-foreground">{result.holder?.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.holder?.kind === 'staff' ? result.holder.detail || 'Personal' : `${result.holder?.detail} · ${result.holder?.code}`}
        </p>
      </div>
    </div>
  );
};

// Reads QR codes from the camera a few times per second while mounted
const CameraReader = ({ onCode, onFail }: { onCode: (value: string) => void; onFail: (message: string) => void }): JSX.Element => {
  const video = useRef<HTMLVideoElement>(null);
  const handlers = useRef({ onCode, onFail });
  useEffect(() => {
    handlers.current = { onCode, onFail };
  }, [onCode, onFail]);

  useEffect(() => {
    const Ctor = detectorCtor();
    if (!Ctor) return;
    const detector = new Ctor({ formats: ['qr_code'] });
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setInterval> | undefined;
    let stopped = false;
    void navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(async (s) => {
        if (stopped) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        if (!video.current) return;
        video.current.srcObject = s;
        await video.current.play();
        timer = setInterval(() => {
          if (!video.current || video.current.readyState < 2) return;
          void detector
            .detect(video.current)
            .then((codes) => {
              const value = codes[0]?.rawValue;
              if (value) handlers.current.onCode(value);
            })
            .catch(() => undefined);
        }, 300);
      })
      .catch(() => handlers.current.onFail('No pudimos usar la cámara. Revisa el permiso del navegador o usa el lector USB.'));
    return () => {
      stopped = true;
      clearInterval(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return <video ref={video} muted playsInline aria-label="Vista de la cámara" className="mt-3 aspect-video w-full rounded-xl bg-black object-cover" />;
};
