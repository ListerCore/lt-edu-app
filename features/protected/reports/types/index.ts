import type { AttendanceDay, GetBoardResponse, GroupAttendance, PeriodKpi, ResultMix, StatusCount } from '@/lib/api/grpc/gen/joseph/reports/v1/reports';

export type { AttendanceDay, GetBoardResponse as Board, GroupAttendance, PeriodKpi, ResultMix, StatusCount };

// What the board is asked for; empty strings take the API defaults
export type BoardQuery = { periodId: string; levelId: string; subject: string; from: string; to: string };
