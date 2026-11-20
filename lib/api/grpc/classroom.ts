import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { ClassroomServiceClient } from './gen/ltedu/classroom/v1/classroom';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

const classroom =
  <Req, Res>(pick: (client: ClassroomServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(ClassroomServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// ltedu.classroom.v1 (lt-edu-api/proto/ltedu/classroom/v1/classroom.proto)
export const classroomRpc = {
  rooms: classroom((c) => c.listRooms),
  generateRooms: classroom((c) => c.generateRooms),
  room: classroom((c) => c.getRoom),
  updateRoom: classroom((c) => c.updateRoom),
  copyRoom: classroom((c) => c.copyRoom),
  saveUnit: classroom((c) => c.saveUnit),
  deleteUnit: classroom((c) => c.deleteUnit),
  reorderUnits: classroom((c) => c.reorderUnits),
  saveItem: classroom((c) => c.saveItem),
  deleteItem: classroom((c) => c.deleteItem),
  reorderItems: classroom((c) => c.reorderItems),
  recordView: classroom((c) => c.recordView),
  library: classroom((c) => c.listLibrary),
  saveLibraryItem: classroom((c) => c.saveLibraryItem),
  deleteLibraryItem: classroom((c) => c.deleteLibraryItem),
  deliveries: classroom((c) => c.listDeliveries),
  saveDelivery: classroom((c) => c.saveDelivery),
  assessment: classroom((c) => c.getAssessment),
  saveAssessment: classroom((c) => c.saveAssessment),
  startAttempt: classroom((c) => c.startAttempt),
  saveAnswers: classroom((c) => c.saveAnswers),
  handIn: classroom((c) => c.handIn),
  gradeSubmission: classroom((c) => c.gradeSubmission),
  setExtension: classroom((c) => c.setExtension),
  recordLevels: classroom((c) => c.recordLevels),
  forum: classroom((c) => c.getForum),
  saveForum: classroom((c) => c.saveForum),
  createPost: classroom((c) => c.createPost),
  editPost: classroom((c) => c.editPost),
  deletePost: classroom((c) => c.deletePost),
  moderatePost: classroom((c) => c.moderatePost),
};
