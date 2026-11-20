import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { ClosingServiceClient } from './gen/ltedu/assessment/v1/closing';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const closing =
  <Req, Res>(pick: (client: ClosingServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(ClosingServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// ltedu.assessment.v1.ClosingService (lt-edu-api/proto/ltedu/assessment/v1/closing.proto)
export const closingRpc = {
  overview: closing((c) => c.getClosing),
  section: closing((c) => c.getSectionClosing),
  decide: closing((c) => c.decideSituation),
  confirm: closing((c) => c.confirmSection),
  saveRecovery: closing((c) => c.saveRecovery),
  unit: closing((c) => c.getUnitClosing),
  confirmUnit: closing((c) => c.confirmUnit),
  saveUnitRecovery: closing((c) => c.saveUnitRecovery),
  issue: closing((c) => c.issueRecord),
  record: closing((c) => c.getRecord),
  export: closing((c) => c.exportResults),
  // EBA (phase E7)
  promotionRules: closing((c) => c.getPromotionRules),
  savePromotionRule: closing((c) => c.savePromotionRule),
  resetPromotionRule: closing((c) => c.resetPromotionRule),
  setSiagieGrades: closing((c) => c.setSiagieGrades),
};
