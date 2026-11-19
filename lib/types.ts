import type { InstitutionType } from '@/features/protected/dashboard/types';

export interface SiteLink {
  label: string;
  href: string;
  // Alternative labels the navbar cycles through (the first one is `label`); the accessible name stays fixed
  rotatingLabels?: string[];
}

export interface SiteConfig {
  name: string;
  domain: string;
  // Kind of institution this site belongs to; the landing adapts its offer, admission steps and wording to it
  institutionType: InstitutionType;
  tagline: string;
  description: string;
  emails: {
    info: string;
    support: string;
    privacy: string;
  };
  navigation: SiteLink[];
  access: SiteLink[];
  // Main phone, printed on the back of the ID cards
  phone: string;
  // WhatsApp chat opened by the floating button; number is digits only with country code
  whatsapp: {
    number: string;
    message: string;
  };
  office: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    mapsUrl: string;
  };
  legal: SiteLink[];
}
