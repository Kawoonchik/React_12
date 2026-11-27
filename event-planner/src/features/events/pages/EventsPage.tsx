import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useCategoriesQuery, useEventsQuery } from '../hooks/useEventsQueries';
import { useAppStore } from '../../../store/useAppStore';
import EventCard from '../components/EventCard';
import Pagination from '../../../shared/components/Pagination';
import { EmptyState, ErrorState, LoadingState } from '../../../shared/components/StateFeedback';
import type { EventSortOption } from '../types/event.types';

const PAGE_LIMIT = 6;

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortParam = (searchParams.get('sort') as EventSortOption) || 'default';
  const pageParam = Math.max(1, Number(searchParams.get('page')) || 1);

  const [searchInput, setSearchInput] = useState(searchParam);

  const customEvents = useAppStore((state) => state.customEvents);

  const { data: categories = [] } = useCategoriesQuery();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useEventsQuery({
    page: pageParam,
    limit: PAGE_LIMIT,
    search: searchParam,
    category: categoryParam,
    sort: sortParam,
  });

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === searchParam) return;

    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (trimmed) {
          next.set('search', trimmed);
        } else {
          next.delete('search');
        }
        next.delete('page');
        return next;
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, searchParam, setSearchParams]);

  const updateParam = (key: 'category' | 'sort', value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === 'default') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      next.delete('page');
      return next;
    });
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(nextPage));
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const matchingCustomEvents =
    pageParam === 1
      ? customEvents.filter((event) => {
          const matchesCategory =
            !categoryParam || event.category.toLowerCase() === categoryParam.toLowerCase();
          const lowerSearch = searchParam.toLowerCase();
          const matchesSearch =
            !lowerSearch ||
            event.title.toLowerCase().includes(lowerSearch) ||
            event.description.toLowerCase().includes(lowerSearch);
          return matchesCategory && matchesSearch;
        })
      : [];

  const combinedEvents = [...matchingCustomEvents, ...(data?.events ?? [])];
  const totalItems = (data?.total ?? 0) + matchingCustomEvents.length;
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_LIMIT));
  const hasActiveFilters = Boolean(searchParam || categoryParam || sortParam !== 'default');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Каталог подій
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Знайдено подій: {totalItems}
            {isFetching && !isLoading ? ' • Оновлення...' : ''}
          </p>
        </div>

        <Link
          to="/my-events?create=1"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-xs"
        >
          + Створити подію
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5">
          <label htmlFor="event-search" className="sr-only">
            Пошук подій
          </label>
          <input
            id="event-search"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Пошук за назвою або описом..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-3">
          <label htmlFor="event-category" className="sr-only">
            Категорія
          </label>
          <select
            id="event-category"
            value={categoryParam}
            onChange={(e) => updateParam('category', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
          >
            <option value="">Усі категорії</option>
            {categories.map((category) => (
              <option key={category} value={category} className="capitalize">
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <label htmlFor="event-sort" className="sr-only">
            Сортування
          </label>
          <select
            id="event-sort"
            value={sortParam}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="default">За замовчуванням</option>
            <option value="title-asc">Назва: А → Я</option>
            <option value="title-desc">Назва: Я → А</option>
            <option value="popular">За популярністю</option>
          </select>
        </div>

        <div className="md:col-span-1 flex">
          <button
            type="button"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters && !searchInput}
            title="Скинути фільтри"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
          >
            Скинути
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Завантажуємо каталог подій..." />
      ) : isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : 'Помилка завантаження каталогу'}
          onRetry={() => refetch()}
        />
      ) : combinedEvents.length === 0 ? (
        <EmptyState
          title="Подій не знайдено"
          description="За вашим запитом або обраними фільтрами немає доступних заходів."
          action={
            hasActiveFilters ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition cursor-pointer"
              >
                Очистити фільтри
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {combinedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <Pagination
            page={pageParam}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isFetching={isFetching}
          />
        </>
      )}
    </div>
  );
}