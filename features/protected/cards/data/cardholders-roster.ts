import type { InstitutionType, Role } from '@/features/protected/dashboard/types';
import type { Cardholder } from '../types';

const firstNames = ['Valeria', 'José', 'Lucía', 'Mateo', 'Camila', 'Diego', 'Sofía', 'Sebastián', 'Ariana', 'Thiago', 'Valentina', 'Gael', 'Mariana', 'Santiago', 'Isabella', 'Joaquín', 'Daniela', 'Adrián', 'Renata', 'Leonardo'];
const surnames = ['Ccori', 'Huamán', 'Quispe', 'Mamani', 'Paredes', 'Rojas', 'Flores', 'Torres', 'Condori', 'Mendoza', 'Chávez', 'Ramos', 'Apaza', 'Vargas', 'Huanca', 'Cárdenas', 'Ríos', 'Gutiérrez', 'Choque', 'Salazar'];

// 47 students: enough for several pages at any page size
const studentNames = Array.from({ length: 47 }, (_, index) => `${firstNames[index % firstNames.length]} ${surnames[(index * 7) % surnames.length]} ${surnames[(index * 3 + 5) % surnames.length]}`);

const staffMembers: Array<{ name: string; detail: string }> = [
  { name: 'Rosa Huamán Pérez', detail: 'Dirección' },
  { name: 'Jorge Mendoza Silva', detail: 'Docente de Matemática' },
  { name: 'Ana Torres Salazar', detail: 'Docente tutora' },
  { name: 'Carmen Flores Díaz', detail: 'Secretaría' },
  { name: 'Lucía Paredes Ruiz', detail: 'Psicología' },
  { name: 'Luis Quispe Tito', detail: 'Coordinación académica' },
  { name: 'Pedro Rojas Calle', detail: 'Auxiliar de educación' },
  { name: 'Miguel Salazar Ore', detail: 'Tesorería' },
  { name: 'Elena Choque Vilca', detail: 'Docente de Comunicación' },
  { name: 'Raúl Apaza Mena', detail: 'Docente de Ciencias' },
  { name: 'Gloria Vargas Luna', detail: 'Docente de Inglés' },
  { name: 'Hugo Cárdenas Paz', detail: 'Docente de Educación Física' },
];

// What a student card says under the name, per institution type
const studentDetails: Record<InstitutionType, string[]> = {
  EBR: ['3.° de secundaria · B', '1.° de secundaria · A', '5.° de primaria · A', '2.° de primaria · B', 'Inicial 4 años · Girasoles', '4.° de secundaria · A'],
  EBA: ['Ciclo avanzado · 2.° grado', 'Ciclo avanzado · 4.° grado', 'Ciclo intermedio · 3.° grado', 'Ciclo inicial · 1.° grado'],
  EBE: ['Primaria · Aula Girasoles', 'Inicial · Aula Estrellas', 'PRITE · Grupo mañana'],
  CEPRE: ['Ciclo intensivo · Área A', 'Ciclo regular · Área B', 'Ciclo de verano · Área C', 'Ciclo regular · Área D'],
  IEST: ['Enfermería técnica · III semestre', 'Desarrollo de sistemas · I semestre', 'Contabilidad · V semestre'],
};

// Stable 8-digit DNI per person so previews and exports never change between renders
const documentFor = (seed: number): string => String(40_000_000 + ((seed * 7_919_311) % 29_999_999)).slice(0, 8);

// Stable mobile number for the emergency contact
const phoneFor = (seed: number): string => {
  const digits = String(900_000_000 + ((seed * 48_271) % 99_999_999)).slice(0, 9);
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

const relatives = ['Carmen', 'Julio', 'Rosa', 'Óscar', 'Elena', 'Víctor', 'Marta', 'Raúl'];

// Simulated roster of the institution; joseph-api will return the real one with photos
export const demoCardholders = (institutionType: InstitutionType): Cardholder[] => {
  const details = studentDetails[institutionType];
  const students: Cardholder[] = studentNames.map((name, index) => ({ id: `st-${index}`, group: 'students', name, detail: details[index % details.length], code: `2026-${String(412 + index * 37).padStart(4, '0')}`, documentNumber: documentFor(index + 3), photoUrl: null, emergencyName: `${relatives[index % relatives.length]} ${name.split(' ')[1]} (apoderado)`, emergencyPhone: phoneFor(index + 11) }));
  const staff: Cardholder[] = staffMembers.map(({ name, detail }, index) => ({ id: `sf-${index}`, group: 'staff', name, detail, code: `P-${String(101 + index).padStart(4, '0')}`, documentNumber: documentFor(index + 97), photoUrl: null, emergencyName: `${relatives[(index + 3) % relatives.length]} ${name.split(' ')[1]}`, emergencyPhone: phoneFor(index + 211) }));
  return [...students, ...staff];
};

// Which roster entry is the signed-in person (simulated until the session carries it; joseph-app only): students and guardians
// map to a student card (the guardian's child), staff roles to their own staff card
export const ownCardholderFor = (institutionType: InstitutionType, role: Role): Cardholder | null => {
  const roster = demoCardholders(institutionType);
  const students = roster.filter(({ group }) => group === 'students');
  const staff = roster.filter(({ group }) => group === 'staff');
  const own = role === 'student' || role === 'guardian' ? students[0] : role === 'teacher' ? staff[1] : role === 'tutor' ? staff[2] : role === 'secretary' ? staff[3] : role === 'psychologist' ? staff[4] : role === 'coordinator' ? staff[5] : role === 'assistant' ? staff[6] : role === 'treasurer' ? staff[7] : staff[0];
  return own ?? null;
};
