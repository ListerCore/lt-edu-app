'use client';

import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { ownerKindModules } from '../data/attachments-data';
import type { UseAttachmentsAccessParams } from '../types';

// Whether the person sees the files of an owner kind at all: the view permission of its module (or of the module
// the page passes). Owner kinds without a module are always shown and the API decides
export const useAttachmentsAccess = ({ ownerKind, module }: UseAttachmentsAccessParams): boolean => {
  const { can } = useWorkspace();
  const gate = module ?? ownerKindModules[ownerKind];
  return gate ? can(gate, 'view') : true;
};
