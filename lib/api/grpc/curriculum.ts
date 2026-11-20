import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { CurriculumServiceClient } from './gen/ltedu/academic/v1/curriculum';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const rpc =
  <Req, Res>(pick: (client: CurriculumServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(CurriculumServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// ltedu.academic.v1.CurriculumService (lt-edu-api/proto/ltedu/academic/v1/curriculum.proto)
export const curriculumRpc = {
  list: rpc((c) => c.listCurricula),
  get: rpc((c) => c.getCurriculum),
  create: rpc((c) => c.createCurriculum),
  duplicate: rpc((c) => c.duplicateCurriculum),
  update: rpc((c) => c.updateCurriculum),
  setStatus: rpc((c) => c.setCurriculumStatus),
  remove: rpc((c) => c.deleteCurriculum),
  createModule: rpc((c) => c.createModule),
  updateModule: rpc((c) => c.updateModule),
  deleteModule: rpc((c) => c.deleteModule),
  createSubject: rpc((c) => c.createSubject),
  updateSubject: rpc((c) => c.updateSubject),
  deleteSubject: rpc((c) => c.deleteSubject),
  reorderSubjects: rpc((c) => c.reorderSubjects),
  createCompetency: rpc((c) => c.createCompetency),
  updateCompetency: rpc((c) => c.updateCompetency),
  deleteCompetency: rpc((c) => c.deleteCompetency),
  reorderCompetencies: rpc((c) => c.reorderCompetencies),
};
