import 'server-only';
import type { CallOptions, ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { WellbeingServiceClient } from './gen/ltedu/wellbeing/v1/wellbeing';

type Unary<Req, Res> = (request: Req, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: Res) => void) => ClientUnaryCall;
type Call<Req, Res> = (request: Req, options: GrpcCallOptions & { token: string }) => Promise<GrpcResult<Res>>;

// Binds one WellbeingService method to the shared call helper (auth metadata, deadline, error mapping)
const wellbeing =
  <Req, Res>(pick: (client: WellbeingServiceClient) => Unary<Req, Res>): Call<Req, Res> =>
  (request, options) =>
    grpcCall(WellbeingServiceClient, (client, md, opts, cb) => pick(client).call(client, request, md, opts, cb), options);

// ltedu.wellbeing.v1 (lt-edu-api/proto/ltedu/wellbeing/v1/wellbeing.proto)
export const wellbeingRpc = {
  students: wellbeing((c) => c.listStudents),
  file: wellbeing((c) => c.getStudentFile),
  alerts: wellbeing((c) => c.getAlerts),
  tutoring: wellbeing((c) => c.getTutoring),
  saveInterview: wellbeing((c) => c.saveInterview),
  deleteInterview: wellbeing((c) => c.deleteInterview),
  saveCommitment: wellbeing((c) => c.saveCommitment),
  checkCommitment: wellbeing((c) => c.checkCommitment),
  deleteCommitment: wellbeing((c) => c.deleteCommitment),
  refer: wellbeing((c) => c.refer),
  psychology: wellbeing((c) => c.getPsychology),
  getCase: wellbeing((c) => c.getCase),
  updateCase: wellbeing((c) => c.updateCase),
  addSession: wellbeing((c) => c.addSession),
  deleteSession: wellbeing((c) => c.deleteSession),
  discipline: wellbeing((c) => c.getDiscipline),
  saveIncident: wellbeing((c) => c.saveIncident),
  deleteIncident: wellbeing((c) => c.deleteIncident),
  setIncidentStatus: wellbeing((c) => c.setIncidentStatus),
  measureContext: wellbeing((c) => c.getMeasureContext),
  addMeasure: wellbeing((c) => c.addMeasure),
  notifyMeasure: wellbeing((c) => c.notifyMeasure),
  requestReconsideration: wellbeing((c) => c.requestReconsideration),
  resolveReconsideration: wellbeing((c) => c.resolveReconsideration),
  deleteMeasure: wellbeing((c) => c.deleteMeasure),
  plans: wellbeing((c) => c.listPlans),
  plan: wellbeing((c) => c.getPlan),
  savePlan: wellbeing((c) => c.savePlan),
  setPlanStatus: wellbeing((c) => c.setPlanStatus),
  deletePlan: wellbeing((c) => c.deletePlan),
  therapies: wellbeing((c) => c.listTherapies),
  saveTherapy: wellbeing((c) => c.saveTherapy),
  deleteTherapy: wellbeing((c) => c.deleteTherapy),
};
