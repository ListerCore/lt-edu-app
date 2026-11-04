'use client';

import type { JSX } from 'react';
import { School, UserRound } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { institutionTypeLabels, roleLabel } from '../data/permissions';
import { useWorkspace } from '../hooks/use-workspace';
import type { InstitutionType, Role } from '../types';

const institutionTypes = Object.keys(institutionTypeLabels) as InstitutionType[];
const typeItems = institutionTypes.map((type) => ({ value: type, label: institutionTypeLabels[type] }));

// Primary outline with a translucent primary fill; every icon (chevron included) follows the text color
const triggerClassName = 'h-8 max-w-48 gap-2 rounded-sm border-primary/60 bg-primary/10 text-[13px] font-medium text-primary shadow-none hover:bg-primary/15 dark:bg-primary/15 dark:hover:bg-primary/20 [&_svg]:text-primary!';

// Demo selectors in the header: institution type first, then a role among the ones that type has
export const DashboardWorkspaceSelects = (): JSX.Element => {
  const { institutionType, role, availableRoles, setInstitutionType, setRole } = useWorkspace();
  const roleItems = availableRoles.map((item) => ({ value: item, label: roleLabel(item, institutionType) }));

  return (
    <div className="flex items-center gap-2">
      <Select items={typeItems} value={institutionType} onValueChange={(value): void => setInstitutionType(value as InstitutionType)}>
        <SelectTrigger size="sm" aria-label="Tipo de institución" className={triggerClassName}>
          <MorphIcon icon={School} size={14} />
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end" alignItemWithTrigger={false}>
          {typeItems.map((item): JSX.Element => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select items={roleItems} value={role} onValueChange={(value): void => setRole(value as Role)}>
        <SelectTrigger size="sm" aria-label="Rol" className={triggerClassName}>
          <MorphIcon icon={UserRound} size={14} />
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end" alignItemWithTrigger={false}>
          {roleItems.map((item): JSX.Element => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
