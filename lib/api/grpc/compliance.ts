import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { ComplianceServiceClient } from './gen/joseph/compliance/v1/compliance';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const compliance =
  <Req, Res>(pick: (client: ComplianceServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(ComplianceServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// joseph.compliance.v1 (joseph-api/proto/joseph/compliance/v1/compliance.proto)
export const complianceRpc = {
  board: compliance((c) => c.getBoard),
  saveRoom: compliance((c) => c.saveRoom),
  deleteRoom: compliance((c) => c.deleteRoom),
  saveDevice: compliance((c) => c.saveDevice),
  deleteDevice: compliance((c) => c.deleteDevice),
  addCheck: compliance((c) => c.addCheck),
  deleteCheck: compliance((c) => c.deleteCheck),
  saveItem: compliance((c) => c.saveItem),
  itemStatus: compliance((c) => c.setItemStatus),
  saveReport: compliance((c) => c.saveReport),
  checkUptime: compliance((c) => c.checkUptime),
  platformPdf: compliance((c) => c.platformReportPdf),
  equipmentPdf: compliance((c) => c.equipmentReportPdf),
};
