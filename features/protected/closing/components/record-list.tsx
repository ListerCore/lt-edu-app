import type { JSX } from 'react';
import { FileText } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { recordKindLabels } from '../data/closing-data';
import type { RecordInfo } from '../types';

// Issued actas: code, kind, section, who issued them and when
export const RecordList = ({ records, onOpen }: { records: RecordInfo[]; onOpen: (id: string) => void }): JSX.Element => (
  <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
    {records.map((r) => (
      <li key={r.id}>
        <button type="button" onClick={(): void => onOpen(r.id)} className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left text-sm hover:bg-surface">
          <MorphIcon icon={FileText} size={16} className="text-brand" />
          <span className="w-32 font-semibold text-foreground tabular-nums">{r.code}</span>
          <span className="min-w-0 flex-1 truncate text-foreground">
            {recordKindLabels[r.kind]} · {r.sectionLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            {r.issuedName} · {formatDay(r.issuedAt.slice(0, 10))}
          </span>
          {r.status === 'replaced' && <span className="pill bg-secondary text-muted-foreground">Reemplazada</span>}
        </button>
      </li>
    ))}
  </ul>
);
