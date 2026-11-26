interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
  isFetching?: boolean;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  isFetching = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <button
        type="button"
        disabled={page <= 1 || isFetching}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
      >
        ← Назад
      </button>

      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Сторінка {page} з {totalPages}
      </span>

      <button
        type="button"
        disabled={page >= totalPages || isFetching}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
      >
        Вперед →
      </button>
    </div>
  );
}