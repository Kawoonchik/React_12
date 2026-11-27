import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useAppStore } from '../../../store/useAppStore';
import { useDeleteEventMutation } from '../hooks/useEventMutations';
import EventCard from '../components/EventCard';
import EventFormModal from '../components/EventFormModal';
import { EmptyState } from '../../../shared/components/StateFeedback';
import type { EventItem } from '../types/event.types';

export default function MyEventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isQueryCreateOpen = searchParams.get('create') === '1';

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const customEvents = useAppStore((state) => state.customEvents);
  const registrations = useAppStore((state) => state.registrations);
  const removeRegistration = useAppStore((state) => state.removeRegistration);
  const showToast = useAppStore((state) => state.showToast);

  const deleteMutation = useDeleteEventMutation();

  const isModalOpen = Boolean(editingEvent) || isCreateOpen || isQueryCreateOpen;
  const modalMode = editingEvent ? 'edit' : 'create';

  const handleCloseModal = () => {
    setEditingEvent(null);
    setIsCreateOpen(false);
    if (isQueryCreateOpen) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('create');
        return next;
      });
    }
  };

  const handleDeleteCustomEvent = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast('Подію видалено');
      },
      onError: (err) => {
        showToast(err instanceof Error ? err.message : 'Не вдалося видалити подію');
      },
    });
  };

  const handleCancelTicket = (eventId: number) => {
    removeRegistration(eventId);
    showToast('Реєстрацію скасовано');
  };

  return (
    <div className="space-y-10">
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Мої події
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Створені вами заходи: {customEvents.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
          >
            + Створити подію
          </button>
        </div>

        {customEvents.length === 0 ? (
          <EmptyState
            title="Ви ще не створили жодної події"
            description="Натисніть кнопку «+ Створити подію», щоб організувати власний захід і додати його до каталогу."
            action={
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition cursor-pointer"
              >
                Створити першу подію
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {customEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={(item) => setEditingEvent(item)}
                onDelete={handleDeleteCustomEvent}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Мої квитки та реєстрації
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Активних заявок на участь: {registrations.length}
          </p>
        </div>

        {registrations.length === 0 ? (
          <EmptyState
            title="У вас поки немає оформлених квитків"
            description="Відкрийте будь-яку подію в каталозі та заповніть форму реєстрації учасника."
            action={
              <Link
                to="/events"
                className="inline-block px-4 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
              >
                Обрати подію
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrations.map((reg) => (
              <div
                key={reg.eventId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/events/${reg.eventId}`}
                      className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                      {reg.eventTitle}
                    </Link>
                    <span className="shrink-0 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Квитків: {reg.ticketsCount}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    📅 Дата події: {reg.eventDate} • Оформлено: {reg.registeredAt}
                  </p>

                  <div className="text-sm text-slate-700 dark:text-slate-300 pt-1 space-y-0.5">
                    <p>
                      <span className="text-slate-400">Учасник:</span> {reg.attendeeName}
                    </p>
                    <p>
                      <span className="text-slate-400">Email:</span> {reg.attendeeEmail}
                    </p>
                    {reg.comment && (
                      <p>
                        <span className="text-slate-400">Коментар:</span> {reg.comment}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <Link
                    to={`/events/${reg.eventId}`}
                    className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    Сторінка події
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleCancelTicket(reg.eventId)}
                    className="px-3 py-1.5 text-xs font-medium rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition cursor-pointer"
                  >
                    Скасувати квиток
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <EventFormModal
        open={isModalOpen}
        mode={modalMode}
        initialEvent={editingEvent ?? undefined}
        onClose={handleCloseModal}
      />
    </div>
  );
}