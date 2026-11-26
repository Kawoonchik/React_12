import { Link } from 'react-router';
import { useAppStore } from '../../../store/useAppStore';
import type { EventItem } from '../types/event.types';

interface EventCardProps {
  event: EventItem;
  onEdit?: (event: EventItem) => void;
  onDelete?: (id: number) => void;
}

export default function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const isFavorite = useAppStore((state) => state.favoriteIds.includes(event.id));
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const showToast = useAppStore((state) => state.showToast);

  const handleToggleFavorite = () => {
    toggleFavorite(event.id);
    showToast(isFavorite ? 'Видалено з обраного' : 'Додано в обране');
  };

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
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

          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? 'Прибрати з обраного' : 'Додати в обране'}
            title={isFavorite ? 'Прибрати з обраного' : 'Додати в обране'}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
            }`}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>

        <div>
          <Link
            to={`/events/${event.id}`}
            className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition line-clamp-2"
          >
            {event.title}
          </Link>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <p>📅 {event.date}</p>
          <p className="truncate">📍 {event.location}</p>
        </div>
      </div>


      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {event.price === 0 ? 'Безкоштовно' : `${event.price} грн`}
        </span>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(event)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Редагувати
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(event.id)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition cursor-pointer"
            >
              Видалити
            </button>
          )}
          <Link
            to={`/events/${event.id}`}
            className="px-3.5 py-1.5 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            Деталі
          </Link>
        </div>
      </div>
    </article>
  );
}