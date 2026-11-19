import type { SiteConfig } from './types';

// Single source for brand, navigation and contact data shared by navbar, footer and metadata
export const siteConfig: SiteConfig = {
  name: 'ListerCore Edu',
  domain: 'joseph.pe',
  institutionType: 'EBR',
  tagline: 'Gestión educativa',
  description: 'Sistema de gestión educativa: matrícula, asistencia con carnet QR, notas, pensiones y comunicados para colegios, CEBA, CEBE, academias e institutos.',
  emails: {
    info: 'informes@joseph.pe',
    support: 'soporte@joseph.pe',
    privacy: 'privacidad@joseph.pe',
  },
  // Home sections presenting the platform, then the public pages
  navigation: [
    { label: 'Módulos', href: '/#modules' },
    { label: 'Para quién', href: '/#roles' },
    { label: 'Instituciones', href: '/#institutions' },
    { label: 'Seguridad', href: '/#security' },
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
  // Floating chat button; digits only with country code (51 + 9 digits). Empty hides the button
  whatsapp: {
    number: '51929525631',
    message: 'Hola, vengo de la web de ListerCore Edu y quisiera más información.',
  },
  // Office pin, resolved from the shared Google Maps link
  phone: '(01) 555 0123',
  office: {
    address: 'Av. Los Educadores 123, Comas',
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
