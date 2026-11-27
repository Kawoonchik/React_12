import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rsvpSchema, type RsvpFormData } from '../schemas/rsvpSchema';
import { useAppStore } from '../../../store/useAppStore';
import type { EventItem } from '../types/event.types';

interface RsvpFormProps {
  event: EventItem;
}

export default function RsvpForm({ event }: RsvpFormProps) {
  const existingRegistration = useAppStore((state) =>
    state.registrations.find((item) => item.eventId === event.id)
  );
  const addRegistration = useAppStore((state) => state.addRegistration);
  const removeRegistration = useAppStore((state) => state.removeRegistration);
  const showToast = useAppStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      attendeeName: '',
      attendeeEmail: '',
      ticketsCount: 1,
      comment: '',
    },
  });

  const onSubmit = (data: RsvpFormData) => {
    addRegistration({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      attendeeName: data.attendeeName,
      attendeeEmail: data.attendeeEmail,
      ticketsCount: data.ticketsCount,
      comment: data.comment || undefined,
      registeredAt: new Date().toLocaleDateString('uk-UA'),
    });
    showToast('Ви успішно зареєструвалися на подію');
    reset();
  };

  const handleCancelRegistration = () => {
    removeRegistration(event.id);
    showToast('Реєстрацію скасовано');
  };

  if (existingRegistration) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Ви зареєстровані
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Ваш квиток підтверджено
            </h3>
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600 text-white">
            Квитків: {existingRegistration.ticketsCount}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900">
          <div>
            <p className="text-xs text-slate-400">Учасник</p>
            <p className="font-medium">{existingRegistration.attendeeName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Email</p>
            <p className="font-medium">{existingRegistration.attendeeEmail}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Дата оформлення</p>
            <p className="font-medium">{existingRegistration.registeredAt}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">До сплати</p>
            <p className="font-medium">
              {event.price === 0
                ? 'Безкоштовно'
                : `${event.price * existingRegistration.ticketsCount} грн`}
            </p>
          </div>
          {existingRegistration.comment && (
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-400">Коментар</p>
              <p className="font-medium">{existingRegistration.comment}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCancelRegistration}
            className="px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 rounded-xl transition cursor-pointer"
          >
            Скасувати реєстрацію
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Реєстрація на подію
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Заповніть форму нижче, щоб забронювати місце та зберегти квиток у розділі «Мої події».
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="attendee-name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Ім&apos;я та прізвище
            </label>
            <input
              id="attendee-name"
              type="text"
              placeholder="Анатолій Сидор"
              {...register('attendeeName')}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 transition ${
                errors.attendeeName
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {errors.attendeeName && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.attendeeName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="attendee-email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Email для квитка
            </label>
            <input
              id="attendee-email"
              type="email"
              placeholder="name@example.com"
              {...register('attendeeEmail')}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 transition ${
                errors.attendeeEmail
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {errors.attendeeEmail && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.attendeeEmail.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="tickets-count"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Кількість квитків
            </label>
            <input
              id="tickets-count"
              type="number"
              min={1}
              max={10}
              {...register('ticketsCount', { valueAsNumber: true })}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 transition ${
                errors.ticketsCount
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {errors.ticketsCount && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.ticketsCount.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="rsvp-comment"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Коментар або побажання (необов&apos;язково)
            </label>
            <input
              id="rsvp-comment"
              type="text"
              placeholder="Наприклад: потрібен електронний сертифікат"
              {...register('comment')}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 transition ${
                errors.comment
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {errors.comment && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.comment.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
          >
            Зареєструватися на подію
          </button>
        </div>
      </form>
    </div>
  );
}