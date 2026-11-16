'use client';

import Link from 'next/link';
import { useState, type JSX } from 'react';
import { ArrowLeft, Lock, LockOpen } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { cn } from '@/lib/utils';
import { forumKindHints, forumKindLabels, roomPath } from '../data/classroom-data';
import { useForumPage } from '../hooks/use-forum-page';
import type { ForumPageProps, Post, PostCardProps } from '../types';
import { HidePostDialog } from './hide-post-dialog';
import { PostCard } from './post-card';
import { PostComposer } from './post-composer';

// A forum of the classroom: the teacher's prompt, new threads, replies and, for the room's teachers, moderation and
// who has not taken part yet
export const ForumPage = ({ roomId, itemId }: ForumPageProps): JSX.Element => {
  const page = useForumPage(itemId);
  const [hiding, setHiding] = useState<Post | null>(null);
  const [showParticipation, setShowParticipation] = useState(false);
  const data = page.data;

  const back = (
    <Link href={roomPath(roomId)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand">
      <MorphIcon icon={ArrowLeft} size={14} />
      Volver al aula
    </Link>
  );
  const cardProps = (p: Post): Omit<PostCardProps, 'post' | 'reply'> => ({
    isMine: p.authorUserId !== '' && p.authorUserId === data?.myUserId,
    canModerate: data?.canModerate ?? false,
    busy: page.busyId === p.id,
    onEdit: (body: string): Promise<boolean> => page.edit(p.id, body),
    onDelete: (): void => page.remove(p.id),
    onPin: (): void => page.togglePin(p),
    onHide: (): void => setHiding(p),
    onShow: (): void => page.show(p),
  });

  return (
    <AcademicPage titleId="forum-title" title={data?.forum.title ?? 'Foro'} description={data ? `${forumKindLabels[data.forum.kind] ?? 'Foro'}${data.newPosts > 0 ? ` · ${data.newPosts} ${data.newPosts === 1 ? 'mensaje nuevo' : 'mensajes nuevos'} desde tu última visita` : ''}` : ''} context={null} back={back}>
      {page.error ? (
        <LoadError message={page.error} onRetry={page.reload} />
      ) : page.isLoading || !data ? (
        <PageSkeleton />
      ) : (
        <div className="space-y-6">
          {data.forum.prompt && <p className="rounded-2xl border border-border bg-surface p-4 text-sm leading-7 whitespace-pre-line text-foreground">{data.forum.prompt}</p>}

          {data.canModerate && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-background p-3">
              <div className="w-full sm:w-56">
                <SelectField id="forum-kind" value={data.forum.kind} options={Object.entries(forumKindLabels).map(([value, label]) => ({ value, label }))} onChange={page.setKind} />
              </div>
              <p className="min-w-0 flex-1 text-xs text-muted-foreground">{forumKindHints[data.forum.kind]}</p>
              <button type="button" className="btn-alt h-9 text-sm" onClick={(): void => page.setClosed(!data.forum.closed)}>
                <MorphIcon icon={data.forum.closed ? LockOpen : Lock} size={14} />
                {data.forum.closed ? 'Reabrir el foro' : 'Cerrar el foro'}
              </button>
              <button type="button" className="btn-alt h-9 text-sm" onClick={(): void => setShowParticipation(!showParticipation)}>
                Participación{page.silent > 0 ? ` · ${page.silent} sin escribir` : ''}
              </button>
            </div>
          )}

          {showParticipation && data.canModerate && (
            <ul className="grid gap-1 rounded-2xl border border-border bg-background p-3 text-sm sm:grid-cols-2">
              {data.participation.map((p) => (
                <li key={p.studentId} className={cn('flex items-center justify-between gap-2 rounded px-2 py-1', p.threads + p.replies === 0 && 'text-muted-foreground')}>
                  <span className="truncate">{p.studentName}</span>
                  <span className="shrink-0 text-xs tabular-nums">{p.threads + p.replies === 0 ? 'Sin escribir' : `${p.threads} temas · ${p.replies} respuestas`}</span>
                </li>
              ))}
            </ul>
          )}

          {data.forum.closed && (
            <p className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
              <MorphIcon icon={Lock} size={14} />
              El foro está cerrado{data.forum.closedByName && ` por ${data.forum.closedByName}`}: se puede leer, pero ya no recibe mensajes.
            </p>
          )}

          {data.canPost && (!data.forum.closed || data.canModerate) && (
            <section aria-label="Nuevo tema" className="rounded-2xl border border-border bg-background p-4">
              <PostComposer placeholder={data.forum.kind === 'questions' ? 'Escribe tu consulta' : data.forum.kind === 'intro' ? 'Preséntate: quién eres, a qué te dedicas y qué esperas del curso' : 'Escribe tu aporte'} submitLabel="Publicar" isPosting={page.isPosting} onSubmit={(body): Promise<boolean> => page.post(body, '')} />
            </section>
          )}

          {data.threads.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">Aún no hay mensajes. ¡Sé el primero en escribir!</p>
          ) : (
            <ul className="space-y-3">
              {data.threads.map((t) => {
                const thread = t.post;
                if (!thread) return null;
                return (
                  <li key={thread.id} className={cn('overflow-hidden rounded-2xl border bg-background', thread.pinned ? 'border-brand/40' : 'border-border')}>
                    <PostCard post={thread} {...cardProps(thread)} />
                    {(t.replies.length > 0 || (data.canPost && !data.forum.closed)) && (
                      <div className="border-t border-border bg-surface/50 pr-4 pb-3 pl-14">
                        <div className="divide-y divide-border">
                          {t.replies.map((r) => (
                            <PostCard key={r.id} post={r} reply {...cardProps(r)} />
                          ))}
                        </div>
                        {data.canPost && (!data.forum.closed || data.canModerate) && (
                          <div className="pt-3">
                            <PostComposer compact placeholder="Responder" submitLabel="Responder" isPosting={page.isPosting} onSubmit={(body): Promise<boolean> => page.post(body, thread.id)} />
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
      {hiding && <HidePostDialog post={hiding} onClose={(): void => setHiding(null)} onHidden={page.reload} />}
    </AcademicPage>
  );
};
