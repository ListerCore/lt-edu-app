import 'server-only';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { SystemServiceClient, type GetHealthRequest, type GetHealthResponse } from './gen/ltedu/system/v1/system';

export type { GetHealthResponse as GrpcHealth } from './gen/ltedu/system/v1/system';

// ltedu.system.v1.SystemService (lt-edu-api/proto/ltedu/system/v1/system.proto)
export const systemRpc = {
  getHealth: (request: Partial<GetHealthRequest> = {}, options?: GrpcCallOptions): Promise<GrpcResult<GetHealthResponse>> =>
    grpcCall(SystemServiceClient, (client, md, opts, cb) => client.getHealth({ includeDb: false, includeRedis: false, ...request }, md, opts, cb), options),
};
