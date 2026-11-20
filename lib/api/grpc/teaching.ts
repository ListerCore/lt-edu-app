import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { StaffServiceClient, TeachingServiceClient } from './gen/ltedu/teaching/v1/teaching';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const staff =
  <Req, Res>(pick: (client: StaffServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(StaffServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

const teaching =
  <Req, Res>(pick: (client: TeachingServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(TeachingServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// ltedu.teaching.v1 (lt-edu-api/proto/ltedu/teaching/v1/teaching.proto)
export const staffRpc = {
  list: staff((c) => c.listStaff),
  get: staff((c) => c.getStaff),
  create: staff((c) => c.createStaff),
  update: staff((c) => c.updateStaff),
  remove: staff((c) => c.deleteStaff),
  grantRole: staff((c) => c.grantRole),
};

export const teachingRpc = {
  planner: teaching((c) => c.getPlanner),
  prepareLoad: teaching((c) => c.prepareLoad),
  updateAssignment: teaching((c) => c.updateAssignment),
  deleteAssignment: teaching((c) => c.deleteAssignment),
  setTutor: teaching((c) => c.setTutor),
  setTimeBlocks: teaching((c) => c.setTimeBlocks),
  placeClass: teaching((c) => c.placeClass),
  removeClass: teaching((c) => c.removeClass),
  clearSection: teaching((c) => c.clearSection),
  autoFill: teaching((c) => c.autoFill),
  mySchedule: teaching((c) => c.mySchedule),
};
