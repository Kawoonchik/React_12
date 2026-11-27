import { Link, useParams } from 'react-router';
import { useEventDetailsQuery, useOrganizerQuery } from '../hooks/useEventsQueries';
import { useAppStore } from '../../../store/useAppStore';
import RsvpForm from '../components/RsvpForm';
import { ErrorState, LoadingState } from '../../../shared/components/StateFeedback';

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const numericId = Number(eventId);
  const isValidId = Boolean(eventId) && !Number.isNaN(numericId) && numericId > 0;

  const {
    data: event,
    isLoading,
    isError,
    error,
    refetch,
  } = useEventDetailsQuery(isValidId ? numericId : -1);

  const {
    data: organizer,
    isLoading: isOrganizerLoading,
    isError: isOrganizerError,
  } = useOrganizerQuery(event?.organizerId);

  const isFavorite = useAppStore((state) =>
    event ? state.favoriteIds.includes(event.id) : false
  );
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const showToast = useAppStore((state) => state.showToast);

  if (!isValidId) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600"
        >
          ← Повернутися до каталогу
        </Link>
        <ErrorState message="Некоректний ідентифікатор події в адресі" />
      </div>
    );
  }

  const handleToggleFavorite = () => {
    if (!event) return;
    toggleFavorite(event.id);
    showToast(isFavorite ? 'Видалено з обраного' : 'Додано в обране');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <span>←</span>
          <span>Назад до каталогу подій</span>
        </Link>
      </div>

      {isLoading ? (
        <LoadingState message="Завантажуємо інформацію про подію..." />
      ) : isError || !event ? (
        <ErrorState
          message={error instanceof Error ? error.message : 'Не вдалося завантажити подію'}
          onRetry={() => refetch()}
        />
      ) : (
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 capitalize">
                    {event.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-medium rounded-lg ${
                      event.format === 'online'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {event.format === 'online' ? 'Онлайн' : 'Офлайн'}
                  </span>
                  {event.isCustom && (
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      Власна подія
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {event.title}
                </h1>
              </div>

              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition cursor-pointer flex items-center gap-2 ${
                  isFavorite
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{isFavorite ? '♥' : '♡'}</span>
                <span>{isFavorite ? 'В обраному' : 'В обране'}</span>
              </button>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Опис заходу
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-400">Дата проведення</p>
                <p className="text-sm font-semibold mt-0.5">📅 {event.date}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Локація</p>
                <p className="text-sm font-semibold mt-0.5">📍 {event.location}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Вартість участі</p>
                <p className="text-sm font-semibold mt-0.5">
                  {event.price === 0 ? 'Безкоштовно' : `${event.price} грн`}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Учасники</p>
                <p className="text-sm font-semibold mt-0.5">
                  {event.attendeesCount} / {event.capacity} місць
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Організатор події
              </h2>

              {isOrganizerLoading ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Завантаження профілю організатора...
                </p>
              ) : isOrganizerError || !organizer ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Організатор #{event.organizerId} • Команда EventPlanner
                </p>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={organizer.avatarUrl}
                      alt={organizer.fullName}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-white"
                    />
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {organizer.fullName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {organizer.role} • {organizer.organization} ({organizer.city})
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                    <p>✉️ {organizer.email}</p>
                    <p>📞 {organizer.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <RsvpForm event={event} />
        </div>
      )}
    </div>
  );
}