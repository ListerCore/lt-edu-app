'use client';

import { useState } from 'react';
import type { ForumPageState, Post } from '../types';
import { useCreatePost } from './use-create-post';
import { useDeletePost } from './use-delete-post';
import { useEditPost } from './use-edit-post';
import { useGetForum } from './use-get-forum';
import { useModeratePost } from './use-moderate-post';
import { useSaveForum } from './use-save-forum';

// Forum page: the forum plus writing, editing, deleting and moderating, each reloading it; busyId marks the post an
// action is running on
export const useForumPage = (itemId: string): ForumPageState => {
  const remote = useGetForum(itemId);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { post, isPosting } = useCreatePost(itemId, remote.reload);
  const edit = useEditPost(remote.reload);
  const del = useDeletePost(remote.reload);
  const mod = useModeratePost(remote.reload);
  const save = useSaveForum(itemId, remote.reload);
  const busy = (id: string, task: () => Promise<unknown>): void => {
    setBusyId(id);
    void task().finally((): void => setBusyId(null));
  };
  const forum = remote.data?.forum;

  return {
    ...remote,
    silent: (remote.data?.participation ?? []).filter((p) => p.threads + p.replies === 0).length,
    post,
    isPosting,
    edit,
    remove: (postId: string): void => busy(postId, () => del(postId)),
    togglePin: (p: Post): void => busy(p.id, () => mod.pin(p)),
    show: (p: Post): void => busy(p.id, () => mod.show(p)),
    setClosed: (closed: boolean): void => {
      if (forum) void save(forum.kind, closed);
    },
    setKind: (kind: string): void => {
      if (forum) void save(kind, forum.closed);
    },
    busyId,
  };
};
