import type { SiteConfig } from './types';

// Single source for brand, navigation and contact data shared by navbar, footer and metadata
export const siteConfig: SiteConfig = {
  name: 'Joseph',
  domain: 'joseph.pe',
  tagline: 'Gestión educativa',
  description: 'Plataforma SaaS para la gestión académica y administrativa de colegios, CEBA, CEBE, centros pre-universitarios e institutos: asistencia, notas, periodos, carnets, tutoría y psicología en una sola aplicación.',
  emails: {
    sales: 'ventas@joseph.pe',
    support: 'soporte@joseph.pe',
    privacy: 'privacidad@joseph.pe',
  },
  navigation: [
    { label: 'Módulos', href: '/#modules' },
    { label: 'Instituciones', href: '/#institutions' },
    { label: 'Roles', href: '/#roles' },
    { label: 'Carnets', href: '/#cards' },
    { label: 'Contacto', href: '/contact' },
  ],
  product: [
    { label: 'Asistencia', href: '/#modules' },
    { label: 'Notas y evaluación', href: '/#modules' },
    { label: 'Periodos y cursos', href: '/#modules' },
    { label: 'Carnets y fotochecks', href: '/#cards' },
    { label: 'Tutoría y psicología', href: '/#modules' },
  ],
  institutions: [
    { code: 'EBR', label: 'Colegios y escuelas' },
    { code: 'EBA', label: 'CEBA' },
    { code: 'EBE', label: 'CEBE y PRITE' },
    { code: 'CEPRE', label: 'Pre-universitarios' },
    { code: 'IEST', label: 'Institutos' },
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
