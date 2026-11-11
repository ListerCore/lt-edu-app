'use server';

import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { examsRpc } from '@/lib/api/grpc/exams';
import { peopleRpc } from '@/lib/api/grpc/people';
import type { Admission, AdmissionValues, BookletItem, ExamsOverview, LoadReport, MockCourse, MockDetail, MockExam, MockResults, MockValues, MockWeight, Question, QuestionPage, QuestionValues, StudentExams } from '../types';

const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));
const decimal = (v: string): number => {
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : -1;
};

export const getExamsOverviewAction = async (slug: string, periodId: string): Promise<AcademicResult<ExamsOverview>> =>
  optional(periodId) ? runRpc(slug, (token) => examsRpc.overview({ institutionSlug: slug, periodId }, { token }), (d) => d) : notFound;

export const listQuestionsAction = async (slug: string, f: { courseCode: string; topic: string; difficulty: string; query: string; page: number }): Promise<AcademicResult<QuestionPage>> =>
  runRpc(
    slug,
    (token) => examsRpc.questions({ institutionSlug: slug, courseCode: f.courseCode, topic: f.topic, difficulty: f.difficulty, query: f.query.slice(0, 80), limit: 20, offset: Math.max(0, f.page - 1) * 20 }, { token }),
    (d) => ({ questions: d.questions, total: d.total }),
  );

export const saveQuestionAction = async (slug: string, id: string, v: QuestionValues): Promise<AcademicResult<Question>> =>
  optional(id)
    ? runRpc(
        slug,
        (token) =>
          examsRpc.saveQuestion(
            { institutionSlug: slug, question: { id, courseCode: v.courseCode, topic: v.topic.slice(0, 160), stem: v.stem.slice(0, 3000), options: v.options.map((o) => o.slice(0, 500)), answer: v.answer, difficulty: v.difficulty, explanation: v.explanation.slice(0, 3000), authorName: '', mine: false, uses: 0 } },
            { token },
          ),
        (d) => d.question,
        id ? 'Pregunta actualizada.' : 'Pregunta agregada al banco.',
      )
    : notFound;

export const deleteQuestionAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => examsRpc.deleteQuestion({ institutionSlug: slug, id }, { token }), () => null, 'Pregunta eliminada.') : notFound;

export const getMockAction = async (slug: string, id: string): Promise<AcademicResult<MockDetail>> => (validIds(id) ? runRpc(slug, (token) => examsRpc.mock({ institutionSlug: slug, id }, { token }), (d) => d) : notFound);

export const saveMockAction = async (slug: string, periodId: string, id: string, v: MockValues): Promise<AcademicResult<MockExam>> =>
  optional(periodId, id)
    ? runRpc(
        slug,
        (token) =>
          examsRpc.saveMock(
            {
              institutionSlug: slug,
              mock: {
                id,
                periodId,
                periodName: '',
                name: v.name.slice(0, 120),
                heldOn: DATE_PATTERN.test(v.heldOn) ? v.heldOn : '',
                durationMinutes: Number.parseInt(v.duration, 10) || 0,
                pointsRight: decimal(v.pointsRight),
                pointsWrong: decimal(v.pointsWrong),
                status: '',
                notes: v.notes.slice(0, 1000),
                courses: [],
                weights: [],
                questions: 0,
                keyed: 0,
                sheets: 0,
              },
            },
            { token },
          ),
        (d) => d.mock,
        id ? 'Simulacro actualizado.' : 'Simulacro creado.',
      )
    : notFound;

export const deleteMockAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => examsRpc.deleteMock({ institutionSlug: slug, id }, { token }), () => null, 'Simulacro eliminado.') : notFound;

export const suggestStructureAction = async (slug: string, levelIds: string[], total: number): Promise<AcademicResult<{ courses: MockCourse[]; weights: MockWeight[] }>> =>
  runRpc(slug, (token) => examsRpc.suggest({ institutionSlug: slug, levelIds: levelIds.filter((id) => validIds(id)), totalQuestions: total }, { token }), (d) => ({ courses: d.courses, weights: d.weights }));

export const setStructureAction = async (slug: string, id: string, courses: MockCourse[], weights: MockWeight[]): Promise<AcademicResult<MockDetail>> =>
  validIds(id) ? runRpc(slug, (token) => examsRpc.setStructure({ institutionSlug: slug, id, courses, weights }, { token }), (d) => d.mock, 'Estructura guardada.') : notFound;

export const fillFromBankAction = async (slug: string, id: string): Promise<AcademicResult<{ mock: MockDetail; filled: number }>> =>
  validIds(id) ? runRpc(slug, (token) => examsRpc.fillFromBank({ institutionSlug: slug, id }, { token }), (d) => (d.mock ? { mock: d.mock, filled: d.filled } : undefined)) : notFound;

export const saveKeyAction = async (slug: string, id: string, items: Array<{ number: number; answer: string }>): Promise<AcademicResult<MockDetail>> =>
  validIds(id) ? runRpc(slug, (token) => examsRpc.saveKey({ institutionSlug: slug, id, items: items.map((i) => ({ ...i, courseCode: '', questionId: '' })) }, { token }), (d) => d.mock, 'Clave guardada.') : notFound;

export const publishMockAction = async (slug: string, id: string, published: boolean): Promise<AcademicResult<MockDetail>> =>
  validIds(id) ? runRpc(slug, (token) => examsRpc.publish({ institutionSlug: slug, id, published }, { token }), (d) => d.mock, published ? 'Resultados publicados para alumnos y familias.' : 'Publicación retirada.') : notFound;

export const getBookletAction = async (slug: string, id: string): Promise<AcademicResult<{ mock: MockExam; items: BookletItem[] }>> =>
  validIds(id) ? runRpc(slug, (token) => examsRpc.booklet({ institutionSlug: slug, id }, { token }), (d) => (d.mock ? { mock: d.mock, items: d.items } : undefined)) : notFound;

export const loadSheetsAction = async (slug: string, id: string, entries: Array<{ studentId: string; answers: string }>): Promise<AcademicResult<LoadReport>> =>
  validIds(id) ? runRpc(slug, (token) => examsRpc.loadSheets({ institutionSlug: slug, id, entries: entries.filter((e) => validIds(e.studentId)).map((e) => ({ ...e, code: '', answers: e.answers.slice(0, 400) })) }, { token }), (d) => d.report) : notFound;

export const loadFileAction = async (slug: string, id: string, text: string): Promise<AcademicResult<LoadReport>> =>
  validIds(id) ? runRpc(slug, (token) => examsRpc.loadFile({ institutionSlug: slug, id, text: text.slice(0, 2_000_000) }, { token }), (d) => d.report) : notFound;

export const deleteSheetAction = async (slug: string, id: string, studentId: string): Promise<AcademicResult<null>> =>
  validIds(id, studentId) ? runRpc(slug, (token) => examsRpc.deleteSheet({ institutionSlug: slug, id, studentId }, { token }), () => null, 'Hoja eliminada.') : notFound;

export const getResultsAction = async (slug: string, id: string): Promise<AcademicResult<MockResults>> => (validIds(id) ? runRpc(slug, (token) => examsRpc.results({ institutionSlug: slug, id }, { token }), (d) => d) : notFound);

export const getStudentExamsAction = async (slug: string, studentId: string): Promise<AcademicResult<StudentExams>> =>
  validIds(studentId) ? runRpc(slug, (token) => examsRpc.student({ institutionSlug: slug, studentId }, { token }), (d) => d.exams) : notFound;

export const getMyExamsAction = async (slug: string): Promise<AcademicResult<StudentExams[]>> => runRpc(slug, (token) => examsRpc.mine({ institutionSlug: slug }, { token }), (d) => d.students);

export const listAdmissionsAction = async (slug: string): Promise<AcademicResult<{ admissions: Admission[]; canManage: boolean }>> =>
  runRpc(slug, (token) => examsRpc.admissions({ institutionSlug: slug }, { token }), (d) => ({ admissions: d.admissions, canManage: d.canManage }));

export const saveAdmissionAction = async (slug: string, id: string, v: AdmissionValues): Promise<AcademicResult<Admission>> => {
  if (!optional(id, v.studentId)) return notFound;
  const place = /^\d{1,6}$/.test(v.place.trim()) ? Number(v.place) : undefined;
  const score = v.score.trim() ? decimal(v.score) : undefined;
  return runRpc(
    slug,
    (token) =>
      examsRpc.saveAdmission(
        { institutionSlug: slug, admission: { id, studentId: v.studentId, studentName: '', studentCode: '', university: v.university.slice(0, 120), career: v.career.slice(0, 160), exam: v.exam.slice(0, 120), admittedOn: DATE_PATTERN.test(v.admittedOn) ? v.admittedOn : '', place, score } },
        { token },
      ),
    (d) => d.admission,
    id ? 'Ingresante actualizado.' : 'Ingresante registrado.',
  );
};

export const deleteAdmissionAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => examsRpc.deleteAdmission({ institutionSlug: slug, id }, { token }), () => null, 'Registro eliminado.') : notFound;

// Any student of the academy (current or former) for the admissions picker
export const findStudentsAction = async (slug: string, query: string): Promise<AcademicResult<Array<{ id: string; name: string; code: string; status: string }>>> =>
  runRpc(
    slug,
    (token) => peopleRpc.listStudents({ institutionSlug: slug, query: query.slice(0, 80), status: '', periodId: '', levelId: '', gradeId: '', sectionId: '', notEnrolled: false, limit: 10, offset: 0 }, { token }),
    (d) => d.students.map((s) => ({ id: s.id, name: [s.givenNames, s.paternalSurname, s.maternalSurname].filter(Boolean).join(' '), code: s.code, status: s.status })),
  );
