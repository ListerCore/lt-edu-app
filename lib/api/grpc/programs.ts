import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { ProgramsServiceClient } from './gen/ltedu/programs/v1/programs';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const programs =
  <Req, Res>(pick: (client: ProgramsServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(ProgramsServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// ltedu.programs.v1 (lt-edu-api/proto/ltedu/programs/v1/programs.proto)
export const programsRpc = {
  programs: programs((c) => c.getPrograms),
  setCoordinator: programs((c) => c.setCoordinator),
  students: programs((c) => c.listStudents),
  record: programs((c) => c.getRecord),
  mine: programs((c) => c.myRecords),
  internships: programs((c) => c.listInternships),
  internship: programs((c) => c.getInternship),
  saveInternship: programs((c) => c.saveInternship),
  deleteInternship: programs((c) => c.deleteInternship),
  addLog: programs((c) => c.addLog),
  deleteLog: programs((c) => c.deleteLog),
  evaluate: programs((c) => c.evaluateInternship),
  issueModular: programs((c) => c.issueModular),
  issueDegree: programs((c) => c.issueDegree),
  setRequirement: programs((c) => c.setRequirement),
  certificates: programs((c) => c.listCertificates),
  certificate: programs((c) => c.getCertificate),
  annul: programs((c) => c.annulCertificate),
};
