import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { ApafaServiceClient } from './gen/ltedu/apafa/v1/apafa';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const apafa =
  <Req, Res>(pick: (client: ApafaServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(ApafaServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// ltedu.apafa.v1 (lt-edu-api/proto/ltedu/apafa/v1/apafa.proto)
export const apafaRpc = {
  overview: apafa((c) => c.getApafa),
  meeting: apafa((c) => c.getMeeting),
  saveMeeting: apafa((c) => c.saveMeeting),
  convene: apafa((c) => c.conveneMeeting),
  reschedule: apafa((c) => c.rescheduleMeeting),
  cancel: apafa((c) => c.cancelMeeting),
  recordMinutes: apafa((c) => c.recordMinutes),
  deleteMeeting: apafa((c) => c.deleteMeeting),
  saveBoardMember: apafa((c) => c.saveBoardMember),
  deleteBoardMember: apafa((c) => c.deleteBoardMember),
};
