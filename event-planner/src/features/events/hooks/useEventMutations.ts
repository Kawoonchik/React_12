import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventRepository } from '../api/eventRepository';
import { eventKeys } from './useEventsQueries';
import { useAppStore } from '../../../store/useAppStore';
import type { EventFormData } from '../schemas/eventSchema';
import type { EventItem, EventsPageResult } from '../types/event.types';

export function useCreateEventMutation() {
  const queryClient = useQueryClient();
  const addCustomEvent = useAppStore((state) => state.addCustomEvent);

  return useMutation({
    mutationFn: (data: EventFormData) => eventRepository.create(data),
    onSuccess: (created) => {
      const uniqueEvent: EventItem = {
        ...created,
        id: Date.now(),
        isCustom: true,
      };

      addCustomEvent(uniqueEvent);
      queryClient.setQueryData(eventKeys.detail(uniqueEvent.id), uniqueEvent);
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient();
  const updateCustomEvent = useAppStore((state) => state.updateCustomEvent);

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EventItem> }) =>
      eventRepository.update(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: eventKeys.all });

      const previousDetail = queryClient.getQueryData<EventItem>(eventKeys.detail(id));
      const previousLists = queryClient.getQueriesData<EventsPageResult>({
        queryKey: eventKeys.lists(),
      });

      if (previousDetail) {
        queryClient.setQueryData<EventItem>(eventKeys.detail(id), {
          ...previousDetail,
          ...data,
        });
      }

      queryClient.setQueriesData<EventsPageResult>(
        { queryKey: eventKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            events: old.events.map((event) =>
              event.id === id ? { ...event, ...data } : event
            ),
          };
        }
      );

      updateCustomEvent(id, data);

      return { previousDetail, previousLists };
    },

    onError: (_error, { id }, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(eventKeys.detail(id), context.previousDetail);
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, snapshot]) => {
          queryClient.setQueryData(queryKey, snapshot);
        });
      }
    },
  });
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient();
  const removeCustomEvent = useAppStore((state) => state.removeCustomEvent);

  return useMutation({
    mutationFn: (id: number) => eventRepository.delete(id),


    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: eventKeys.lists() });

      const previousLists = queryClient.getQueriesData<EventsPageResult>({
        queryKey: eventKeys.lists(),
      });

      queryClient.setQueriesData<EventsPageResult>(
        { queryKey: eventKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            events: old.events.filter((event) => event.id !== id),
            total: Math.max(0, old.total - 1),
          };
        }
      );
      
      removeCustomEvent(id);

      return { previousLists };
    },

    onError: (_error, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, snapshot]) => {
          queryClient.setQueryData(queryKey, snapshot);
        });
      }
    },

    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: eventKeys.detail(id) });
    },
  });
}