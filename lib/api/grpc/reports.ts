import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { ReportsServiceClient } from './gen/joseph/reports/v1/reports';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

// Binds one ReportsService method to the shared call helper (auth metadata, deadline, error mapping)
const reports =
  <Req, Res>(pick: (client: ReportsServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(ReportsServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// joseph.reports.v1 (joseph-api/proto/joseph/reports/v1/reports.proto)
export const reportsRpc = {
  board: reports((c) => c.getBoard),
};
