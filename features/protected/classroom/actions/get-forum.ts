'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, ForumData } from '../types';

// A forum with its threads; opening it marks it read (ClassroomService.GetForum)
export const getForumAction = async (slug: string, itemId: string): Promise<AcademicResult<ForumData>> =>
  validIds(itemId)
    ? runRpc(
        slug,
        (token) => classroomRpc.forum({ institutionSlug: slug, itemId }, { token }),
        (d) => (d.forum ? { forum: d.forum, threads: d.threads, canPost: d.canPost, canModerate: d.canModerate, myUserId: d.myUserId, newPosts: d.newPosts, participation: d.participation } : undefined),
      )
    : notFound;
