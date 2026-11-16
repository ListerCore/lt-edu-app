import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { TutoringServiceClient } from './gen/joseph/wellbeing/v1/tutoring';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const tutoring =
  <Req, Res>(pick: (client: TutoringServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(TutoringServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// joseph.wellbeing.v1.TutoringService (joseph-api/proto/joseph/wellbeing/v1/tutoring.proto)
export const tutoringRpc = {
  board: tutoring((c) => c.getTutorBoard),
  assignments: tutoring((c) => c.getTutorAssignments),
  assign: tutoring((c) => c.assignTutor),
  sessions: tutoring((c) => c.listTutoringSessions),
  saveSession: tutoring((c) => c.saveTutoringSession),
  holdSession: tutoring((c) => c.holdTutoringSession),
  sessionStatus: tutoring((c) => c.setTutoringSessionStatus),
  threads: tutoring((c) => c.listThreads),
  openThread: tutoring((c) => c.openThread),
  thread: tutoring((c) => c.getThread),
  send: tutoring((c) => c.sendMessage),
  mine: tutoring((c) => c.getMyTutoring),
  referSaanee: tutoring((c) => c.referSaanee),
  updateSaanee: tutoring((c) => c.updateSaanee),
};
