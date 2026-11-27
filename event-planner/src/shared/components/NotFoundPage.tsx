import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto mt-12 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xs">
      <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">404</p>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Сторінку не знайдено</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Запитувана сторінка не існує або була переміщена.
      </p>
      <div className="pt-2">
        <Link
          to="/events"
          className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
        >
          Повернутися до каталогу
        </Link>
      </div>
    </div>
  );
}