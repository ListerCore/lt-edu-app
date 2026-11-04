export interface SiteLink {
  label: string;
  href: string;
  // Alternative labels the navbar cycles through (the first one is `label`); the accessible name stays fixed
  rotatingLabels?: string[];
}

export interface SiteConfig {
  name: string;
  domain: string;
  tagline: string;
  description: string;
  emails: {
    info: string;
    support: string;
    privacy: string;
  };
  navigation: SiteLink[];
  access: SiteLink[];
  office: {
    city: string;
    latitude: number;
    longitude: number;
    mapsUrl: string;
  };
  legal: SiteLink[];
}
