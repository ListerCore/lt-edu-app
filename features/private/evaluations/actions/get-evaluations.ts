import type { EvaluationRecord, EvaluationsFilterParams } from '../types';

const INITIAL_EVALUATIONS: EvaluationRecord[] = [
  {
    id: 'eval-01',
    studentDni: '48392019',
    studentName: 'Mamani Quispe, Juan Carlos',
    cycleGrade: 'Avanzado 4°',
    competency1: 'AD',
    competency2: 'A',
    competency3: 'AD',
    finalScore: 'AD',
    descriptiveConclusion: 'Argumenta con solvencia y produce textos argumentativos coherentes.',
    isPedagogicalRisk: false,
  },
  {
    id: 'eval-02',
    studentDni: '72940182',
    studentName: 'Ramos Huamán, Rosa Elvira',
    cycleGrade: 'Avanzado 4°',
    competency1: 'A',
    competency2: 'A',
    competency3: 'B',
    finalScore: 'A',
    descriptiveConclusion: 'Comprensión lectora destacada; reforzar conectores en redacción.',
    isPedagogicalRisk: false,
  },
  {
    id: 'eval-03',
    studentDni: '10928374',
    studentName: 'Flores Condori, Pedro Pablo',
    cycleGrade: 'Avanzado 3°',
    competency1: 'B',
    competency2: 'C',
    competency3: 'C',
    finalScore: 'C',
    descriptiveConclusion: 'Requiere acompañamiento en comprensión de textos e inferencias.',
    isPedagogicalRisk: true,
  },
  {
    id: 'eval-04',
    studentDni: '45920183',
    studentName: 'Gutiérrez Paucar, Ana María',
    cycleGrade: 'Avanzado 2°',
    competency1: 'AD',
    competency2: 'AD',
    competency3: 'A',
    finalScore: 'AD',
    descriptiveConclusion: 'Excelente desenvolvimiento oral y expresión en lengua materna.',
    isPedagogicalRisk: false,
  },
  {
    id: 'eval-05',
    studentDni: '70291823',
    studentName: 'Zevallos Medina, Jorge Luis',
    cycleGrade: 'Avanzado 1°',
    competency1: 'C',
    competency2: 'B',
    competency3: 'C',
    finalScore: 'C',
    descriptiveConclusion: 'Dificultad en producción escrita. Incorporar a taller de nivelación.',
    isPedagogicalRisk: true,
  },
];

export const getEvaluationsAction = async (params: EvaluationsFilterParams): Promise<{ success: boolean; data: EvaluationRecord[] }> => {
  await new Promise((resolve) => setTimeout(resolve, 80));

  let items = [...INITIAL_EVALUATIONS];

  if (params.filter) {
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter((e) => e.studentName.toLowerCase().includes(q) || e.studentDni.includes(q));
    }
    if (params.grade && params.grade !== 'TODOS') {
      items = items.filter((e) => e.cycleGrade === params.grade);
    }
  }

  return {
    success: true,
    data: items,
  };
};
