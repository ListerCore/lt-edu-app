import type { CreateEventPayload, CreateEventResponse, EventItem } from '../types';
import { addStoredEvent, getStoredEvents } from './mock-events';

export const createEventAction = async (payloadData: CreateEventPayload): Promise<CreateEventResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const { payload } = payloadData;
  const currentCount = getStoredEvents().length + 1;
  const formattedIndex = currentCount.toString().padStart(3, '0');

  const newEvent: EventItem = {
    id: `evt-${Date.now()}`,
    code: `CEBA-2026-${formattedIndex}`,
    name: payload.NAME,
    category: payload.CATEGORY,
    date: payload.DATE,
    location: payload.LOCATION,
    attendeesCount: 0,
    maxCapacity: payload.MAX_CAPACITY,
    status: payload.STATUS || 'ACTIVO',
    organizer: payload.ORGANIZER,
    createdAt: new Date().toISOString(),
  };

  addStoredEvent(newEvent);

  return {
    success: true,
    data: newEvent,
    message: 'Actividad académica registrada exitosamente en el sistema CEBA Lister',
  };
};
