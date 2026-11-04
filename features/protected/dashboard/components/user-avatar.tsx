import type { JSX } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserAvatarProps } from '../types';

// First letters of the first two words, for users without a photo
const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

// Profile photo when there is one, initials otherwise
export const UserAvatar = ({ name, avatarUrl, className }: UserAvatarProps): JSX.Element => (
  <Avatar className={className}>
    {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
    <AvatarFallback className="bg-brand-soft text-xs font-semibold text-brand">{initialsOf(name)}</AvatarFallback>
  </Avatar>
);
