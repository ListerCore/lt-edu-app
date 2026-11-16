import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { PeopleServiceClient } from './gen/joseph/people/v1/people';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const rpc =
  <Req, Res>(pick: (client: PeopleServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(PeopleServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// joseph.people.v1.PeopleService (joseph-api/proto/joseph/people/v1/people.proto)
export const peopleRpc = {
  context: rpc((c) => c.getPeopleContext),
  listStudents: rpc((c) => c.listStudents),
  getStudent: rpc((c) => c.getStudent),
  createStudent: rpc((c) => c.createStudent),
  updateStudent: rpc((c) => c.updateStudent),
  deleteStudent: rpc((c) => c.deleteStudent),
  findGuardian: rpc((c) => c.findGuardian),
  addGuardian: rpc((c) => c.addGuardian),
  updateGuardian: rpc((c) => c.updateGuardian),
  removeGuardian: rpc((c) => c.removeGuardian),
  grantAccess: rpc((c) => c.grantAccess),
  board: rpc((c) => c.getEnrollmentBoard),
  enroll: rpc((c) => c.enroll),
  updateEnrollment: rpc((c) => c.updateEnrollment),
  endEnrollment: rpc((c) => c.endEnrollment),
  deleteEnrollment: rpc((c) => c.deleteEnrollment),
  ratify: rpc((c) => c.ratifyEnrollments),
  listPlacements: rpc((c) => c.listPlacements),
  createPlacement: rpc((c) => c.createPlacement),
  deletePlacement: rpc((c) => c.deletePlacement),
  proposePlacement: rpc((c) => c.proposePlacement),
  enrollmentFile: rpc((c) => c.getEnrollmentFile),
  saveEnrollmentFile: rpc((c) => c.saveEnrollmentFile),
  setReligionExemption: rpc((c) => c.setReligionExemption),
  roll: rpc((c) => c.listRoll),
  setSiagieStatus: rpc((c) => c.setSiagieStatus),
  importRoll: rpc((c) => c.importRoll),
};
