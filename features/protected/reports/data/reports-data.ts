export interface ReportRow {
  level: string;
  cycle: string;
  grade: string;
  track: string;
  sections: string;
  students: number;
  attendance: number;
  hours: number;
  achievement: number;
  developing: number;
  atRisk: number;
  coordinator: string;
  area: string;
  siagie: 'Cerrado' | 'En proceso';
}

export const reportRows: ReportRow[] = [
  { level: 'Ciclo Avanzado', cycle: 'Avanzado', grade: '4° Grado', track: 'Promoción EBA 2026-II', sections: 'A, B, C', students: 245, attendance: 93.8, hours: 5.1, achievement: 84.2, developing: 15.8, atRisk: 4, coordinator: 'Lic. Maritza Quispe C.', area: 'Matemática / EPT', siagie: 'Cerrado' },
  { level: 'Ciclo Avanzado', cycle: 'Avanzado', grade: '3° Grado', track: 'Regular continuidad', sections: 'A, B', students: 190, attendance: 92.1, hours: 4.7, achievement: 79.5, developing: 20.5, atRisk: 6, coordinator: 'Mg. Raúl Mendoza O.', area: 'Humanidades y DPC', siagie: 'Cerrado' },
  { level: 'Ciclo Avanzado', cycle: 'Avanzado', grade: '2° Grado', track: 'Virtualizado Huamanga', sections: 'A, B', students: 175, attendance: 89.6, hours: 4.3, achievement: 76, developing: 24, atRisk: 8, coordinator: 'Lic. Gladys Sulca V.', area: 'Ciencia y Tecnología', siagie: 'Cerrado' },
  { level: 'Ciclo Avanzado', cycle: 'Avanzado', grade: '1° Grado', track: 'Ingresantes EBA', sections: 'A, B', students: 130, attendance: 88.5, hours: 4.1, achievement: 73.8, developing: 26.2, atRisk: 5, coordinator: 'Lic. Carlos Alarcón T.', area: 'Tutoría y Convivencia', siagie: 'Cerrado' },
  { level: 'Ciclo Intermedio', cycle: 'Intermedio', grade: '1° a 3°', track: 'Nivelación primaria adultos', sections: 'Única', students: 75, attendance: 91, hours: 4.5, achievement: 78.7, developing: 21.3, atRisk: 3, coordinator: 'Prof. Bertha Gómez R.', area: 'Intermedio integral', siagie: 'Cerrado' },
  { level: 'Ciclo Inicial', cycle: 'Inicial', grade: 'Alfabetización', track: 'Soporte fonético virtual', sections: 'Única', students: 35, attendance: 86.2, hours: 3.9, achievement: 65.7, developing: 34.3, atRisk: 1, coordinator: 'Lic. Sonia Paucar H.', area: 'Alfabetización digital', siagie: 'En proceso' },
];

export const competencyData = [
  { id: 'matematica', area: 'Ciencias y Matemática', detail: 'Resuelve problemas, regularidad y forma', achieved: 74.2, developing: 20.8, beginning: 5 },
  { id: 'humanidades', area: 'Humanidades y Comunicación Integral', detail: 'Lectura crítica y redacción', achieved: 82.5, developing: 14.1, beginning: 3.4 },
  { id: 'dpc', area: 'Desarrollo Personal y Ciudadanía', detail: 'Convivencia democrática', achieved: 85, developing: 12, beginning: 3 },
  { id: 'cts', area: 'Ciencia, Tecnología y Salud', detail: 'Indagación ambiental Ayacucho', achieved: 76.8, developing: 18.2, beginning: 5 },
  { id: 'ept', area: 'Educación para el Trabajo', detail: 'Emprendimiento y herramientas digitales', achieved: 88.4, developing: 9.6, beginning: 2 },
];

export const ageGroups = [
  { label: '15–19 años', percent: 38, students: 323 },
  { label: '20–29 años', percent: 41, students: 348 },
  { label: '30–39 años', percent: 14, students: 119 },
  { label: '40–54 años', percent: 7, students: 60 },
];

export const reportTabs = [
  { id: 'consolidated', label: 'Consolidado general y SIAGIE' },
  { id: 'demography', label: 'Matrícula y caracterización' },
  { id: 'attendance', label: 'Asistencia y permanencia' },
  { id: 'competencies', label: 'Rendimiento CNEB' },
  { id: 'teachers', label: 'Desempeño docente' },
] as const;

export type ReportTab = typeof reportTabs[number]['id'];
