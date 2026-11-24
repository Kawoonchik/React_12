import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { eventRepository } from '../api/eventRepository';
import { organizerRepository } from '../api/organizerRepository';
import { useAppStore } from '../../../store/useAppStore';
import type { EventsQueryParams } from '../types/event.types';

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params: EventsQueryParams) => [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
  categories: () => [...eventKeys.all, 'categories'] as const,
  organizer: (organizerId?: number) => ['organizers', organizerId] as const,
};

export function useEventsQuery(params: EventsQueryParams) {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventRepository.getAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: eventKeys.categories(),
    queryFn: () => eventRepository.getCategories(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useEventDetailsQuery(eventId: number) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: async () => {
      const customEvent = useAppStore
        .getState()
        .customEvents.find((item) => item.id === eventId);

      if (customEvent) {
        return customEvent;
      }

      return eventRepository.getById(eventId);
    },
    enabled: Number.isFinite(eventId) && eventId > 0,
  });
}



export function useOrganizerQuery(organizerId?: number) {
  return useQuery({
    queryKey: eventKeys.organizer(organizerId),
    queryFn: () => organizerRepository.getById(organizerId!),
    enabled: Boolean(organizerId && organizerId > 0),
  });
}