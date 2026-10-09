'use client';

import { useState } from 'react';
import { createEventAction } from '../actions/create-event';
import type { CreateEventPayload, CreateEventRawData, EventCategory, UseCreateEventResult } from '../types';

export const useCreateEvent = (): UseCreateEventResult => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const clearNotification = (): void => {
    setNotification(null);
  };

  const createEvent = async (rawData: CreateEventRawData): Promise<boolean> => {
    setIsCreating(true);
    setError(null);
    setNotification(null);

    try {
      // 1. Clean & validate data
      const cleanedName = rawData.name.trim();
      const cleanedOrganizer = rawData.organizer.trim();
      const cleanedLocation = rawData.location.trim();
      const cleanedCategory = rawData.category.trim();

      if (!cleanedName || !cleanedOrganizer || !cleanedLocation) {
        throw new Error('Por favor, completa todos los campos requeridos.');
      }

      const parsedCapacity = Number(rawData.maxCapacity);
      if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
        throw new Error('La capacidad máxima debe ser un número entero mayor a 0.');
      }

      // 2. Transform values to uppercase as per Architecture specification
      const upperName = cleanedName.toUpperCase();
      const upperOrganizer = cleanedOrganizer.toUpperCase();
      const upperLocation = cleanedLocation.toUpperCase();
      const upperCategory = (cleanedCategory.toUpperCase() || 'CONFERENCIA') as EventCategory;

      // 3. Build payload for action
      const payload: CreateEventPayload = {
        payload: {
          NAME: upperName,
          ORGANIZER: upperOrganizer,
          LOCATION: upperLocation,
          CATEGORY: upperCategory,
          DATE: rawData.date || new Date().toISOString(),
          MAX_CAPACITY: parsedCapacity,
          STATUS: 'ACTIVO',
        },
      };

      // 4. Call action
      const response = await createEventAction(payload);

      if (response.success) {
        setNotification({
          type: 'success',
          message: `Evento "${response.data.name}" creado con éxito.`,
        });
        return true;
      } else {
        throw new Error(response.message || 'No se pudo crear el evento.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido al intentar registrar el evento.';
      setError(errorMsg);
      setNotification({
        type: 'error',
        message: errorMsg,
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    createEvent,
    error,
    notification,
    clearNotification,
  };
};
