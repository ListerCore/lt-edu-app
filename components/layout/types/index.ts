import type { SiteLink } from '@/lib/types';

export interface BrandMarkProps {
  className?: string;
}

export interface BrandWatermarkProps {
  className?: string;
}

export interface NavLabelProps {
  link: SiteLink;
}

export interface WhatsAppButtonProps {
  number: string;
  message: string;
}
