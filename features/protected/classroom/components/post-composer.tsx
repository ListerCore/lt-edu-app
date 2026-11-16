'use client';

import { useState, type JSX } from 'react';
import { Send } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import type { PostComposerProps } from '../types';

// Box to write a thread or a reply; clears once the post is published
export const PostComposer = ({ placeholder, submitLabel, isPosting, compact, onSubmit }: PostComposerProps): JSX.Element => {
  const [text, setText] = useState('');
  const send = (): void => {
    void onSubmit(text).then((ok): void => {
      if (ok) setText('');
    });
  };
  return (
    <div className="space-y-2">
      <Textarea aria-label={placeholder} placeholder={placeholder} rows={compact ? 2 : 4} value={text} maxLength={5000} onChange={(e): void => setText(e.target.value)} />
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground tabular-nums">{text.length > 4500 ? `${5000 - text.length} caracteres disponibles` : ''}</span>
        <button type="button" className={compact ? 'btn-alt h-8 px-3 text-xs' : 'btn-brand'} disabled={isPosting || !text.trim()} onClick={send}>
          <MorphIcon icon={Send} size={compact ? 12 : 16} />
          {isPosting ? 'Publicando…' : submitLabel}
        </button>
      </div>
    </div>
  );
};
