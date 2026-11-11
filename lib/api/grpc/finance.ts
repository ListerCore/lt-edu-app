import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { FinanceServiceClient } from './gen/joseph/finance/v1/finance';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

// Binds one FinanceService method to the shared call helper (auth metadata, deadline, error mapping)
const finance =
  <Req, Res>(pick: (client: FinanceServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(FinanceServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// joseph.finance.v1 (joseph-api/proto/joseph/finance/v1/finance.proto)
export const financeRpc = {
  summary: finance((c) => c.getSummary),
  plans: finance((c) => c.listPlans),
  savePlan: finance((c) => c.savePlan),
  deletePlan: finance((c) => c.deletePlan),
  generate: finance((c) => c.generateCharges),
  statement: finance((c) => c.getStatement),
  mine: finance((c) => c.myStatements),
  pay: finance((c) => c.registerPayment),
  annul: finance((c) => c.annulPayment),
  payment: finance((c) => c.getPayment),
  cash: finance((c) => c.getCash),
  saveDiscount: finance((c) => c.saveDiscount),
  deleteDiscount: finance((c) => c.deleteDiscount),
  voidCharge: finance((c) => c.voidCharge),
  addCharge: finance((c) => c.addCharge),
  remind: finance((c) => c.sendReminders),
};
