import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { AcademicServiceClient } from './gen/joseph/academic/v1/academic';

export type * from './gen/joseph/academic/v1/academic';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

// One typed function per RPC: the request and response types come from the generated client method
const rpc =
  <Req, Res>(pick: (client: AcademicServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(AcademicServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// joseph.academic.v1.AcademicService (joseph-api/proto/joseph/academic/v1/academic.proto)
export const academicRpc = {
  getContext: rpc((c) => c.getContext),
  updateSettings: rpc((c) => c.updateSettings),
  getStructure: rpc((c) => c.getStructure),
  createLevel: rpc((c) => c.createLevel),
  updateLevel: rpc((c) => c.updateLevel),
  deleteLevel: rpc((c) => c.deleteLevel),
  reorderLevels: rpc((c) => c.reorderLevels),
  createGrade: rpc((c) => c.createGrade),
  updateGrade: rpc((c) => c.updateGrade),
  deleteGrade: rpc((c) => c.deleteGrade),
  reorderGrades: rpc((c) => c.reorderGrades),
  applyTemplate: rpc((c) => c.applyTemplate),
  listPeriods: rpc((c) => c.listPeriods),
  getPeriod: rpc((c) => c.getPeriod),
  createPeriod: rpc((c) => c.createPeriod),
  updatePeriod: rpc((c) => c.updatePeriod),
  setPeriodStatus: rpc((c) => c.setPeriodStatus),
  deletePeriod: rpc((c) => c.deletePeriod),
  updateTerm: rpc((c) => c.updateTerm),
  createSections: rpc((c) => c.createSections),
  updateSection: rpc((c) => c.updateSection),
  deleteSection: rpc((c) => c.deleteSection),
  copySections: rpc((c) => c.copySections),
};
