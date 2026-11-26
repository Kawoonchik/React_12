import { NavLink, Outlet } from 'react-router';
import { useAppStore } from '../../store/useAppStore';

export default function AppLayout() {
  const favoritesCount = useAppStore((state) => state.favoriteIds.length);
  const myItemsCount = useAppStore(
    (state) => state.customEvents.length + state.registrations.length
  );
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const toastMessage = useAppStore((state) => state.toastMessage);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <NavLink
            to="/events"
            className="text-xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400"
          >
            EventPlanner
          </NavLink>

          <nav className="flex items-center gap-1.5 sm:gap-2">
            <NavLink to="/events" className={navLinkClass}>
              <span>Каталог</span>
            </NavLink>

            <NavLink to="/favorites" className={navLinkClass}>
              <span>Обране</span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-rose-500 text-white leading-none">
                  {favoritesCount}
                </span>
              )}
            </NavLink>

            <NavLink to="/my-events" className={navLinkClass}>
              <span>Мої події</span>
              {myItemsCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-emerald-600 text-white leading-none">
                  {myItemsCount}
                </span>
              )}
            </NavLink>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Перемкнути тему"
              title={theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
              className="ml-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        EventPlanner SPA • React 19, TanStack Query, Zustand & React Router
      </footer>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
          {toastMessage}
        </div>
      )}
    </div>
  );
}