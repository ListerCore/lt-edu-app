import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { InstitutionServiceClient } from './gen/ltedu/institution/v1/institution';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const institution =
  <Req, Res>(pick: (client: InstitutionServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(InstitutionServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// ltedu.institution.v1 (lt-edu-api/proto/ltedu/institution/v1/institution.proto)
export const institutionRpc = {
  file: institution((c) => c.getInstitutionFile),
  saveAuthorization: institution((c) => c.saveAuthorization),
  deleteAuthorization: institution((c) => c.deleteAuthorization),
  savePlatformSheet: institution((c) => c.savePlatformSheet),
  auditEvents: institution((c) => c.listAuditEvents),
  members: institution((c) => c.listMembers),
  grantMember: institution((c) => c.grantMember),
  revokeMember: institution((c) => c.revokeMember),
  modules: institution((c) => c.listModules),
  setModule: institution((c) => c.setModule),
};
