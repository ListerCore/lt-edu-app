import 'server-only';
import { grpcCall, type GrpcCallOptions, type GrpcResult } from './client';
import { AnnouncementServiceClient, type GetAnnouncementResponse, type GetPublicAnnouncementResponse, type ListAnnouncementsResponse, type ListFeaturedAnnouncementsResponse, type ListPublicAnnouncementsResponse } from './gen/joseph/announcements/v1/announcements';

export type { Announcement as GrpcAnnouncement, Attachment as GrpcAttachment } from './gen/joseph/announcements/v1/announcements';

// joseph.announcements.v1.AnnouncementService (joseph-api/proto/joseph/announcements/v1/announcements.proto)
export const announcementsRpc = {
  listPublic: (institutionSlug: string, options?: GrpcCallOptions): Promise<GrpcResult<ListPublicAnnouncementsResponse>> =>
    grpcCall(AnnouncementServiceClient, (client, md, opts, cb) => client.listPublicAnnouncements({ institutionSlug }, md, opts, cb), options),
  getPublic: (slug: string, options?: GrpcCallOptions): Promise<GrpcResult<GetPublicAnnouncementResponse>> =>
    grpcCall(AnnouncementServiceClient, (client, md, opts, cb) => client.getPublicAnnouncement({ slug }, md, opts, cb), options),
  list: (institutionSlug: string, options: GrpcCallOptions & { token: string }): Promise<GrpcResult<ListAnnouncementsResponse>> =>
    grpcCall(AnnouncementServiceClient, (client, md, opts, cb) => client.listAnnouncements({ institutionSlug }, md, opts, cb), options),
  get: (slug: string, institutionSlug: string, options: GrpcCallOptions & { token: string }): Promise<GrpcResult<GetAnnouncementResponse>> =>
    grpcCall(AnnouncementServiceClient, (client, md, opts, cb) => client.getAnnouncement({ slug, institutionSlug }, md, opts, cb), options),
  listFeatured: (institutionSlug: string, options?: GrpcCallOptions): Promise<GrpcResult<ListFeaturedAnnouncementsResponse>> =>
    grpcCall(AnnouncementServiceClient, (client, md, opts, cb) => client.listFeaturedAnnouncements({ institutionSlug }, md, opts, cb), options),
};
