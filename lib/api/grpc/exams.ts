import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { ExamsServiceClient } from './gen/ltedu/exams/v1/exams';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const exams =
  <Req, Res>(pick: (client: ExamsServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(ExamsServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// ltedu.exams.v1 (lt-edu-api/proto/ltedu/exams/v1/exams.proto)
export const examsRpc = {
  overview: exams((c) => c.getOverview),
  questions: exams((c) => c.listQuestions),
  saveQuestion: exams((c) => c.saveQuestion),
  deleteQuestion: exams((c) => c.deleteQuestion),
  mock: exams((c) => c.getMock),
  saveMock: exams((c) => c.saveMock),
  deleteMock: exams((c) => c.deleteMock),
  suggest: exams((c) => c.suggestStructure),
  setStructure: exams((c) => c.setStructure),
  fillFromBank: exams((c) => c.fillFromBank),
  saveKey: exams((c) => c.saveKey),
  publish: exams((c) => c.publishMock),
  booklet: exams((c) => c.getBooklet),
  loadSheets: exams((c) => c.loadSheets),
  loadFile: exams((c) => c.loadReaderFile),
  deleteSheet: exams((c) => c.deleteSheet),
  results: exams((c) => c.getResults),
  student: exams((c) => c.getStudentExams),
  mine: exams((c) => c.myExams),
  admissions: exams((c) => c.listAdmissions),
  saveAdmission: exams((c) => c.saveAdmission),
  deleteAdmission: exams((c) => c.deleteAdmission),
};
