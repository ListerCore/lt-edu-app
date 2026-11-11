import type { Admission, AnswerSheet, BookletItem, Course, CourseStat, ExamStudent, GetMockResponse, GetOverviewResponse, GetResultsResponse, KeyItem, Level, LoadReport, MockCourse, MockExam, MockWeight, Question, StudentExams, StudentMock } from '@/lib/api/grpc/gen/joseph/exams/v1/exams';

export type {
  Admission,
  AnswerSheet,
  BookletItem,
  Course,
  CourseStat,
  ExamStudent,
  GetMockResponse as MockDetail,
  GetOverviewResponse as ExamsOverview,
  GetResultsResponse as MockResults,
  KeyItem,
  Level,
  LoadReport,
  MockCourse,
  MockExam,
  MockWeight,
  Question,
  StudentExams,
  StudentMock,
};

export interface QuestionValues {
  courseCode: string;
  topic: string;
  stem: string;
  options: string[];
  answer: string;
  difficulty: string;
  explanation: string;
}

export interface MockValues {
  name: string;
  heldOn: string;
  duration: string;
  pointsRight: string;
  pointsWrong: string;
  notes: string;
}

export interface AdmissionValues {
  studentId: string;
  university: string;
  career: string;
  exam: string;
  admittedOn: string;
  place: string;
  score: string;
}

export interface QuestionPage {
  questions: Question[];
  total: number;
}
