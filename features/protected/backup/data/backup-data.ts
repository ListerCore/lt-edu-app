export interface BackupSnapshot {
  id: string;
  date: string;
  type: string;
  scope: string;
  size: string;
  hash: string;
  status: 'Verificado' | 'Sellado';
}

export const backupSnapshots: BackupSnapshot[] = [
  { id: 'SNP-20261024-0300', date: '24 oct 2026 · 03:00:14', type: 'Automático nocturno', scope: 'Completo (BD + documentos + logs)', size: '4.82 GB', hash: 'e3b0c44…89b142d', status: 'Verificado' },
  { id: 'SNP-20261023-0300', date: '23 oct 2026 · 03:00:08', type: 'Automático nocturno', scope: 'Incremental (BD + logs)', size: '1.24 GB', hash: '4a89fb2…901ef23', status: 'Verificado' },
  { id: 'SNP-20261021-1745', date: '21 oct 2026 · 17:45:22', type: 'Manual pre-SIAGIE', scope: 'Base de datos + calificaciones', size: '2.15 GB', hash: '8102a90…df5610a', status: 'Verificado' },
  { id: 'SNP-20260930-2359', date: '30 set 2026 · 23:59:59', type: 'Cierre bimestre 2026-I', scope: 'Inmutable WORM total', size: '14.60 GB', hash: 'bc77123…483fa99', status: 'Sellado' },
];

export const backupModules = [
  { id: 'database', name: 'Base de datos PostgreSQL', detail: 'Matrículas EBA, actas de notas, finanzas y tesorería' },
  { id: 'documents', name: 'Expedientes y documentos digitales', detail: 'FUM, DNI, certificados y resoluciones' },
  { id: 'classrooms', name: 'Evidencias y aulas virtuales', detail: 'Tareas, foros y enlaces de sesiones' },
  { id: 'audit', name: 'Logs de auditoría y trazabilidad', detail: 'Accesos, cambios de notas y operaciones' },
];
