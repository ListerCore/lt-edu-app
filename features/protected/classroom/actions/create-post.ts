'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, Post } from '../types';

// A new thread (empty parent) or a reply (ClassroomService.CreatePost)
export const createPostAction = async (slug: string, itemId: string, parentId: string, body: string): Promise<AcademicResult<Post>> =>
  validIds(itemId) && (!parentId || validIds(parentId))
    ? runRpc(slug, (token) => classroomRpc.createPost({ institutionSlug: slug, itemId, parentId, body }, { token }), (d) => d.post)
    : notFound;
