export interface InstitutionalAccount {
  initials: string;
  name: string;
  identity: string;
  role: string;
  email: string;
  lastAccess: string;
  location: string;
  twoFactor: 'Activo' | 'Opcional';
  status: 'Activo' | 'Pendiente';
  tone: string;
}

export const institutionalAccounts: InstitutionalAccount[] = [
  { initials: 'FP', name: 'Lic. Fernando Prado M.', identity: 'DNI: 20248192 · Promotoría', role: 'Promotor General', email: 'fprado@cebalister.edu.pe', lastAccess: 'Hoy, 09:42 a. m.', location: '190.237.89.14 · (Ayacucho)', twoFactor: 'Activo', status: 'Activo', tone: 'bg-primary text-primary-foreground' },
  { initials: 'MQ', name: 'Mg. Miriam Quispe Huamán', identity: 'DNI: 41829811 · Gestión Pedagógica', role: 'Coord. Académico', email: 'mquispe@cebalister.edu.pe', lastAccess: 'Hoy, 08:15 a. m.', location: '190.237.92.40 · (Ayacucho)', twoFactor: 'Activo', status: 'Activo', tone: 'bg-secondary text-secondary-foreground' },
  { initials: 'JA', name: 'Prof. Jorge Alarcón Soto', identity: 'DNI: 10928374 · Mat. y Ciencia', role: 'Docente EBA', email: 'jalarcon@cebalister.edu.pe', lastAccess: 'Ayer, 21:05', location: '190.237.89.18 · (Huamanga)', twoFactor: 'Activo', status: 'Activo', tone: 'bg-accent text-accent-foreground' },
  { initials: 'CR', name: 'Psic. Claudia Rivas Cancho', identity: 'DNI: 72819200 · Bienestar Integral', role: 'Tutor / Bienestar', email: 'crivas@cebalister.edu.pe', lastAccess: 'Hoy, 10:11 a. m.', location: '190.237.89.14 · (Ayacucho)', twoFactor: 'Activo', status: 'Activo', tone: 'bg-chart-3/20 text-chart-3' },
  { initials: 'VG', name: 'CPC. Víctor Gamboa Sulca', identity: 'DNI: 28391444 · Tesorería', role: 'Tesorería / Caja', email: 'vgamboa@cebalister.edu.pe', lastAccess: 'Hoy, 07:58 a. m.', location: '190.237.91.22 · (Ayacucho)', twoFactor: 'Activo', status: 'Activo', tone: 'bg-chart-2/15 text-chart-2' },
  { initials: 'EM', name: 'Elena Mendoza Cárdenas', identity: 'DNI: 44129309 · Ciclo Avanzado 3.°', role: 'Estudiante EBA', email: 'emendoza@cebalister.edu.pe', lastAccess: 'Hoy, 09:12 a. m.', location: '190.237.92.20 · (Móvil)', twoFactor: 'Opcional', status: 'Activo', tone: 'bg-muted text-muted-foreground' },
];

export const permissionRoles = ['Promotor', 'Coord.', 'Docente', 'Tutor', 'Caja', 'Estudiante'];

export const criticalPermissions = [
  { action: 'Matrícula y homologación SIAGIE', access: [true, true, false, false, false, false] },
  { action: 'Carga de calificaciones CNEB (AD-C)', access: [true, true, true, false, false, false] },
  { action: 'Emisión de boletas SUNAT / OSE', access: [true, false, false, false, true, false] },
  { action: 'Fichas psicológicas y casos de riesgo', access: [true, true, false, true, false, false] },
  { action: 'Respaldos críticos y base de datos', access: [true, false, false, false, false, false] },
  { action: 'Exportación de padrón y DNI', access: [true, true, false, false, true, false] },
];
