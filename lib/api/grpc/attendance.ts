import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { AttendanceServiceClient } from './gen/joseph/attendance/v1/attendance';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const attendance =
  <Req, Res>(pick: (client: AttendanceServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(AttendanceServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// joseph.attendance.v1 (joseph-api/proto/joseph/attendance/v1/attendance.proto)
export const attendanceRpc = {
  overview: attendance((c) => c.getOverview),
  scan: attendance((c) => c.scan),
  recentScans: attendance((c) => c.recentScans),
  roster: attendance((c) => c.getRoster),
  markStudents: attendance((c) => c.markStudents),
  closeDay: attendance((c) => c.closeDay),
  staffDay: attendance((c) => c.getStaffDay),
  markStaff: attendance((c) => c.markStaff),
  closeStaffDay: attendance((c) => c.closeStaffDay),
  classes: attendance((c) => c.listClasses),
  getClass: attendance((c) => c.getClass),
  saveClass: attendance((c) => c.saveClass),
  justifications: attendance((c) => c.listJustifications),
  submitJustification: attendance((c) => c.submitJustification),
  reviewJustification: attendance((c) => c.reviewJustification),
  report: attendance((c) => c.getReport),
  student: attendance((c) => c.getStudent),
  mine: attendance((c) => c.myAttendance),
  cardCodes: attendance((c) => c.cardCodes),
  renewCard: attendance((c) => c.renewCard),
};
