import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { AssessmentServiceClient } from './gen/ltedu/assessment/v1/assessment';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const assessment =
  <Req, Res>(pick: (client: AssessmentServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(AssessmentServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// ltedu.assessment.v1 (lt-edu-api/proto/ltedu/assessment/v1/assessment.proto)
export const assessmentRpc = {
  gradebook: assessment((c) => c.getGradebook),
  sheet: assessment((c) => c.getSheet),
  saveLevels: assessment((c) => c.saveLevels),
  saveEvaluation: assessment((c) => c.saveEvaluation),
  deleteEvaluation: assessment((c) => c.deleteEvaluation),
  saveScores: assessment((c) => c.saveScores),
  tutorSheet: assessment((c) => c.getTutorSheet),
  saveTutorSheet: assessment((c) => c.saveTutorSheet),
  submit: assessment((c) => c.submit),
  reportCard: assessment((c) => c.getReportCard),
  sectionCards: assessment((c) => c.getSectionCards),
  myCards: assessment((c) => c.myReportCards),
};
