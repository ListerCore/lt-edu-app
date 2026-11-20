import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { ParticipationServiceClient } from './gen/ltedu/participation/v1/participation';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const participation =
  <Req, Res>(pick: (client: ParticipationServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(ParticipationServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// ltedu.participation.v1 (lt-edu-api/proto/ltedu/participation/v1/participation.proto)
export const participationRpc = {
  board: participation((c) => c.getPermanenceBoard),
  saveRule: participation((c) => c.savePermanenceRule),
  section: participation((c) => c.getSectionPermanence),
  adjust: participation((c) => c.adjustPermanence),
  room: participation((c) => c.getRoomParticipation),
};
