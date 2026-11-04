import type { SiteConfig } from './types';

// Single source for brand, navigation and contact data shared by navbar, footer and metadata
export const siteConfig: SiteConfig = {
  name: 'Joseph',
  domain: 'joseph.pe',
  tagline: 'Comunidad educativa',
  description: 'Sitio oficial de la institución: oferta educativa, admisión, comunicados y acceso a tu cuenta para estudiantes, familias y docentes.',
  emails: {
    info: 'informes@joseph.pe',
    support: 'soporte@joseph.pe',
    privacy: 'privacidad@joseph.pe',
  },
  // Public site of the institution: sections every institution type has, whatever it calls its levels or programs
  navigation: [
    { label: 'Nosotros', href: '/#about' },
    { label: 'Oferta educativa', href: '/#programs' },
    { label: 'Admisión', href: '/#admissions' },
    { label: 'Comunicados', href: '/news', rotatingLabels: ['Comunicados', 'Anuncios', 'Avisos'] },
    { label: 'Contacto', href: '/contact' },
  ],
  // Platform entry points for each kind of user, listed in the footer
  access: [
    { label: 'Estudiantes y apoderados', href: '/auth/signin' },
    { label: 'Docentes y personal', href: '/auth/signin' },
    { label: 'Crear cuenta', href: '/auth/signup' },
    { label: 'Recuperar cuenta', href: '/auth/recovery-account' },
  ],
  // Office pin, resolved from the shared Google Maps link
  office: {
    city: 'Lima, Perú',
    latitude: -11.88142,
    longitude: -77.03128,
    mapsUrl: 'https://maps.app.goo.gl/cqrbv9NeWJAPxUw38',
  },
  legal: [
    { label: 'Política de privacidad', href: '/legal/privacy' },
    { label: 'Términos y condiciones', href: '/legal/terms' },
    { label: 'Libro de Reclamaciones', href: '/legal/complaints' },
  ],
};
