export interface SiteLink {
  label: string;
  href: string;
}

// Institution types the platform supports; each one enables its own set of modules
export interface InstitutionType {
  code: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  domain: string;
  tagline: string;
  description: string;
  emails: {
    sales: string;
    support: string;
    privacy: string;
  };
  navigation: SiteLink[];
  product: SiteLink[];
  institutions: InstitutionType[];
  legal: SiteLink[];
}
