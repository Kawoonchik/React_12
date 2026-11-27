# EventPlanner

Вебзастосунок для пошуку, перегляду, організації та бронювання участі в подіях (онлайн та офлайн заходах).

## Предметна область

**Тема №6 — Event Planner:**
- Перегляд каталогу подій із пошуком, фільтрацією за категоріями, сортуванням та пагінацією (синхронізованими з URL query params).
- Детальна сторінка події з інформацією про захід, завантаженням профілю організатора та формою реєстрації учасника.
- Збереження обраних подій (`Favorites`).
- Управління власними створеними подіями (створення, редагування, видалення) та перегляд оформлених квитків (`My Events`).
- Підтримка світлої та темної теми інтерфейсу.

## Посилання на розгорнуту версію

- **Live Demo:** [https://event-planner.vercel.app](https://event-planner.vercel.app) *(заміни на своє посилання після деплою на Vercel)*

## Технологічний стек

- **Core:** React 19, TypeScript, Vite
- **Routing:** React Router (`BrowserRouter`, динамічні маршрути та `useSearchParams`)
- **Server State:** TanStack Query (кешування, dependent queries, optimistic updates, retry)
- **Client State:** Zustand (`persist` у `localStorage`)
- **Forms & Validation:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS

## Інструкція запуску локально

1. Клонуйте репозиторій:
   ```bash
   git clone <URL_вашого_репозиторію>
   cd event-planner