import { Link } from 'react-router';
import { useQueries } from '@tanstack/react-query';
import { useAppStore } from '../../../store/useAppStore';
import { eventRepository } from '../api/eventRepository';
import { eventKeys } from '../hooks/useEventsQueries';
import EventCard from '../components/EventCard';
import { EmptyState, ErrorState, LoadingState } from '../../../shared/components/StateFeedback';
import type { EventItem } from '../types/event.types';

export default function FavoritesPage() {
  const favoriteIds = useAppStore((state) => state.favoriteIds);

  const favoriteQueries = useQueries({
    queries: favoriteIds.map((id) => ({
      queryKey: eventKeys.detail(id),
      queryFn: async () => {
        const customEvent = useAppStore
          .getState()
          .customEvents.find((item) => item.id === id);
        if (customEvent) return customEvent;
        return eventRepository.getById(id);
      },
    })),
  });

  const isLoading = favoriteQueries.some((query) => query.isLoading);
  const hasError = favoriteQueries.some((query) => query.isError);
  const favoriteEvents = favoriteQueries
    .map((query) => query.data)
    .filter((item): item is EventItem => Boolean(item));

  const handleRetryAll = () => {
    favoriteQueries.forEach((query) => {
      if (query.isError) {
        query.refetch();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Обрані події
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Збережені заходи: {favoriteIds.length}
        </p>
      </div>

      {favoriteIds.length === 0 ? (
        <EmptyState
          title="Список обраного порожній"
          description="Натискайте на сердечко на картках подій у каталозі, щоб зберегти цікаві заходи тут."
          action={
            <Link
              to="/events"
              className="inline-block px-4 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
            >
              Перейти до каталогу
            </Link>
          }
        />
      ) : isLoading && favoriteEvents.length === 0 ? (
        <LoadingState message="Завантажуємо обрані події..." />
      ) : hasError && favoriteEvents.length === 0 ? (
        <ErrorState
          message="Не вдалося завантажити збережені події"
          onRetry={handleRetryAll}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}