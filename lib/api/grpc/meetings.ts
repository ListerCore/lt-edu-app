import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { MeetingsServiceClient } from './gen/ltedu/meetings/v1/meetings';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const meetings =
  <Req, Res>(pick: (client: MeetingsServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(MeetingsServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// ltedu.meetings.v1.MeetingsService (lt-edu-api/proto/ltedu/meetings/v1/meetings.proto)
export const meetingsRpc = {
  config: meetings((c) => c.getLiveConfig),
  agenda: meetings((c) => c.getAgenda),
  join: meetings((c) => c.joinSession),
  attendance: meetings((c) => c.getAttendance),
  appointments: meetings((c) => c.listAppointments),
  saveAppointment: meetings((c) => c.saveAppointment),
  appointmentStatus: meetings((c) => c.setAppointmentStatus),
};
