import 'server-only';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { SystemServiceClient, type GetHealthRequest, type GetHealthResponse } from './gen/joseph/system/v1/system';

export type { GetHealthResponse as GrpcHealth } from './gen/joseph/system/v1/system';

// joseph.system.v1.SystemService (joseph-api/proto/joseph/system/v1/system.proto)
export const systemRpc = {
  getHealth: (request: Partial<GetHealthRequest> = {}, options?: GrpcCallOptions): Promise<GrpcResult<GetHealthResponse>> =>
    grpcCall(SystemServiceClient, (client, md, opts, cb) => client.getHealth({ includeDb: false, includeRedis: false, ...request }, md, opts, cb), options),
};
