import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EventItem, EventRegistration } from '../features/events/types/event.types';

export type ThemeMode = 'light' | 'dark';

interface AppStoreState {

  favoriteIds: number[];
  toggleFavorite: (eventId: number) => void;


  registrations: EventRegistration[];
  addRegistration: (registration: EventRegistration) => void;
  removeRegistration: (eventId: number) => void;


  customEvents: EventItem[];
  addCustomEvent: (event: EventItem) => void;
  updateCustomEvent: (id: number, updates: Partial<EventItem>) => void;
  removeCustomEvent: (id: number) => void;


  theme: ThemeMode;
  toggleTheme: () => void;


  toastMessage: string | null;
  showToast: (message: string) => void;
}

function applyThemeClass(theme: ThemeMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      toggleFavorite: (eventId) =>
        set((state) => {
          const exists = state.favoriteIds.includes(eventId);
          return {
            favoriteIds: exists
              ? state.favoriteIds.filter((id) => id !== eventId)
              : [...state.favoriteIds, eventId],
          };
        }),

      registrations: [],
      addRegistration: (registration) =>
        set((state) => ({
          registrations: [
            registration,
            ...state.registrations.filter((item) => item.eventId !== registration.eventId),
          ],
        })),
      removeRegistration: (eventId) =>
        set((state) => ({
          registrations: state.registrations.filter((item) => item.eventId !== eventId),
        })),

      customEvents: [],
      addCustomEvent: (event) =>
        set((state) => ({
          customEvents: [event, ...state.customEvents],
        })),
      updateCustomEvent: (id, updates) =>
        set((state) => ({
          customEvents: state.customEvents.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        })),
      removeCustomEvent: (id) =>
        set((state) => ({
          customEvents: state.customEvents.filter((event) => event.id !== id),
        })),

      theme: 'light',
      toggleTheme: () =>
        set((state) => {
          const nextTheme: ThemeMode = state.theme === 'light' ? 'dark' : 'light';
          applyThemeClass(nextTheme);
          return { theme: nextTheme };
        }),

      toastMessage: null,
      showToast: (message) => {
        if (toastTimer) clearTimeout(toastTimer);
        set({ toastMessage: message });
        toastTimer = setTimeout(() => {
          set({ toastMessage: null });
        }, 3000);
      },
    }),
    {
      name: 'event-planner-storage',
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
        registrations: state.registrations,
        customEvents: state.customEvents,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeClass(state.theme);
        }
      },
    }
  )
);