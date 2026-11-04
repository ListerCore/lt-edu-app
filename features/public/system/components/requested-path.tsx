'use client';

import { usePathname } from 'next/navigation';
import { Suspense, type JSX } from 'react';

// Single request/response line: method, path and the 404 status
const RequestLine = ({ path }: { path: string }): JSX.Element => (
  <p className="flex min-w-0 items-center gap-2 font-mono text-xs">
    <span className="font-semibold text-brand">GET</span>
    <span className="truncate text-foreground">{path}</span>
    <span aria-hidden="true" className="text-muted-foreground">
      →
    </span>
    <span className="shrink-0 rounded bg-destructive/10 px-1.5 py-0.5 font-semibold text-destructive">404</span>
  </p>
);

const CurrentPathLine = (): JSX.Element => <RequestLine path={usePathname()} />;

// The route the visitor asked for, shown as a request/response line; Suspense keeps dynamic 404 routes prerenderable
export const RequestedPath = (): JSX.Element => (
  <Suspense fallback={<RequestLine path="…" />}>
    <CurrentPathLine />
  </Suspense>
);
