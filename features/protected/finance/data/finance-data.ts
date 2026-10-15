export type PaymentStatus = 'Al día' | 'Convenio / Beca' | 'Por vencer' | 'En mora' | 'Fraccionado';

export interface FamilyAccount {
  id: string;
  initials: string;
  name: string;
  dni: string;
  grade: string;
  cycle: 'Avanzado' | 'Intermedio' | 'Inicial';
  section: string;
  status: PaymentStatus;
  note: string;
  amount: number;
  receipt: string;
  guardian: string;
  guardianRelation: string;
  attendance: number;
  paid: number;
}

export const familyAccounts: FamilyAccount[] = [
  { id: 'juan', initials: 'JP', name: 'Juan Pérez Huamán', dni: '47829103', grade: '2.° Avanzado B', cycle: 'Avanzado', section: 'B', status: 'Al día', note: 'Cuota 2 (octubre) cancelada', amount: 0, receipt: 'B004-0012948 · BCP', guardian: 'Elena Huamán Rojas', guardianRelation: 'Madre', attendance: 92.4, paid: 400 },
  { id: 'roxana', initials: 'RQ', name: 'Roxana Quispe Sulca', dni: '71203948', grade: '4.° Avanzado', cycle: 'Avanzado', section: 'A', status: 'Convenio / Beca', note: 'Asociación Artesanos Huamanga', amount: 30, receipt: 'B004-0012980', guardian: 'Martha Sulca Paredes', guardianRelation: 'Madre', attendance: 89.7, paid: 370 },
  { id: 'edwin', initials: 'EM', name: 'Edwin Mendoza Alarcón', dni: '42918274', grade: '3.° Avanzado A', cycle: 'Avanzado', section: 'A', status: 'Por vencer', note: 'Vencimiento: 05 nov · Yape enviado', amount: 150, receipt: 'Sin comprobante', guardian: 'José Mendoza Rojas', guardianRelation: 'Padre', attendance: 88.1, paid: 250 },
  { id: 'silvia', initials: 'SC', name: 'Silvia Cárdenas Palomino', dni: '74819203', grade: '2.° Avanzado B', cycle: 'Avanzado', section: 'B', status: 'En mora', note: 'Cuota 2 (octubre) vencida · 15 días', amount: 150, receipt: 'Sin comprobante aún', guardian: 'Herminia Palomino', guardianRelation: 'Madre', attendance: 84.2, paid: 250 },
  { id: 'brayan', initials: 'BQ', name: 'Brayan Quispe Sulca', dni: '70349182', grade: '1.° Avanzado C', cycle: 'Avanzado', section: 'C', status: 'Fraccionado', note: 'Abonó S/ 80 · resta S/ 70', amount: 70, receipt: 'Vence 15 nov · cosecha', guardian: 'Luz Sulca Huamán', guardianRelation: 'Madre', attendance: 91.5, paid: 330 },
  { id: 'sonia', initials: 'SP', name: 'Sonia Paucar Huamán', dni: '62830911', grade: 'Ciclo Inicial', cycle: 'Inicial', section: 'Única', status: 'Al día', note: 'Cuota 2 cancelada', amount: 0, receipt: 'B004-0013018 · BCP', guardian: 'Nicolás Paucar Rojas', guardianRelation: 'Padre', attendance: 86.2, paid: 400 },
];

export const feeSchedule = [
  { id: 'enrollment', title: 'Matrícula institucional', due: '15 ago 2026', amount: 100, status: 'paid', receipt: 'B004-001102' },
  { id: 'september', title: 'Cuota 1 · Septiembre', due: '05 sep 2026', amount: 150, status: 'paid', receipt: 'B004-001189' },
  { id: 'october', title: 'Cuota 2 · Octubre', due: '05 oct 2026', amount: 150, status: 'overdue', receipt: '' },
  { id: 'november', title: 'Cuota 3 · Noviembre', due: '05 nov 2026', amount: 150, status: 'upcoming', receipt: '' },
  { id: 'december', title: 'Cuota 4 · Diciembre', due: '05 dic 2026', amount: 150, status: 'scheduled', receipt: '' },
] as const;

export const recentReceipts = [
  { code: 'B004-0012984', name: 'Yulisa Huaccachi L.', time: 'Hoy, 11:20 a. m.', amount: 150 },
  { code: 'B004-0012983', name: 'Carlos Ccoicca T.', time: 'Hoy, 10:48 a. m.', amount: 150 },
  { code: 'B004-0012982', name: 'Mariluz Prado R.', time: 'Hoy, 09:15 a. m.', amount: 100 },
  { code: 'B004-0012981', name: 'Wilber Cancho P.', time: 'Ayer, 18:32 p. m.', amount: 150 },
];
