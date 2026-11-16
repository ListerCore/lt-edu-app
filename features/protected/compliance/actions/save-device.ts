'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { complianceRpc } from '@/lib/api/grpc/compliance';
import type { Device } from '../types';

// Creates or edits a device of the inventory (ComplianceService.SaveDevice)
export const saveDeviceAction = async (slug: string, device: Device): Promise<AcademicResult<Device>> =>
  device.id === '' || validIds(device.id) ? runRpc(slug, (token) => complianceRpc.saveDevice({ institutionSlug: slug, device }, { token }), (d) => d.device, 'Equipo guardado.') : notFound;
