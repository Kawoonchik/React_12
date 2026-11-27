import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import AppLayout from './shared/layouts/AppLayout';
import NotFoundPage from './shared/components/NotFoundPage';
import EventsPage from './features/events/pages/EventsPage';
import EventDetailsPage from './features/events/pages/EventDetailsPage';
import FavoritesPage from './features/events/pages/FavoritesPage';
import MyEventsPage from './features/events/pages/MyEventsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />

        <Route element={<AppLayout />}>
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/my-events" element={<MyEventsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}