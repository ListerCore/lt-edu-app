'use client';

import { usePathname } from 'next/navigation';
import { Suspense, type JSX } from 'react';

interface RequestLineProps {
  path: string;
  status: number;
}

// Single request/response line: method, path and the response status
const RequestLine = ({ path, status }: RequestLineProps): JSX.Element => (
  <p className="flex min-w-0 items-center gap-2 font-mono text-xs">
    <span className="font-semibold text-brand">GET</span>
    <span className="truncate text-foreground">{path}</span>
    <span aria-hidden="true" className="text-muted-foreground">
      →
    </span>
    <span className="shrink-0 rounded bg-destructive/10 px-1.5 py-0.5 font-semibold text-destructive">{status}</span>
  </p>
);

const CurrentPathLine = ({ status }: { status: number }): JSX.Element => <RequestLine path={usePathname()} status={status} />;

// The route the visitor asked for, shown as a request/response line; Suspense keeps dynamic 404 routes prerenderable
export const RequestedPath = ({ status = 404 }: { status?: number }): JSX.Element => (
  <Suspense fallback={<RequestLine path="…" status={status} />}>
    <CurrentPathLine status={status} />
  </Suspense>
);
