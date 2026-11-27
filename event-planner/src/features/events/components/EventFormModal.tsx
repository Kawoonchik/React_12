import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type EventFormData } from '../schemas/eventSchema';
import { useCreateEventMutation, useUpdateEventMutation } from '../hooks/useEventMutations';
import { useAppStore } from '../../../store/useAppStore';
import Modal from '../../../shared/components/Modal';
import type { EventItem } from '../types/event.types';

interface EventFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialEvent?: EventItem;
  onClose: () => void;
}

export default function EventFormModal({
  open,
  mode,
  initialEvent,
  onClose,
}: EventFormModalProps) {
  const showToast = useAppStore((state) => state.showToast);
  const createMutation = useCreateEventMutation();
  const updateMutation = useUpdateEventMutation();

  const isEditMode = mode === 'edit';
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'technology',
      date: '2027-05-15',
      location: 'Київ, UNIT.City',
      format: 'offline',
      price: 0,
      capacity: 50,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (isEditMode && initialEvent) {
      reset({
        title: initialEvent.title,
        description: initialEvent.description,
        category: initialEvent.category,
        date: initialEvent.date,
        location: initialEvent.location,
        format: initialEvent.format,
        price: initialEvent.price,
        capacity: initialEvent.capacity,
      });
    } else {
      reset({
        title: '',
        description: '',
        category: 'technology',
        date: '2027-05-15',
        location: 'Київ, UNIT.City',
        format: 'offline',
        price: 0,
        capacity: 50,
      });
    }

    const frame = requestAnimationFrame(() => {
      setFocus('title');
    });
    return () => cancelAnimationFrame(frame);
  }, [open, isEditMode, initialEvent, reset, setFocus]);

  const handleClose = () => {
    if (isPending) return;
    createMutation.reset();
    updateMutation.reset();
    onClose();
  };

  const onSubmit = async (data: EventFormData) => {
    if (isEditMode && initialEvent) {
      await updateMutation.mutateAsync({ id: initialEvent.id, data });
      showToast('Подію успішно оновлено');
    } else {
      await createMutation.mutateAsync(data);
      showToast('Нову подію створено');
    }
    handleClose();
  };

  return (
    <Modal
      open={open}
      title={isEditMode ? 'Редагувати подію' : 'Створити нову подію'}
      onClose={handleClose}
      disabled={isPending}
    >
      {mutationError && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-sm">
          {mutationError instanceof Error ? mutationError.message : 'Помилка збереження події'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="event-title"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Назва події
          </label>
          <input
            id="event-title"
            type="text"
            placeholder="React & TypeScript Meetup 2027"
            {...register('title')}
            className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 transition ${
              errors.title
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="event-description"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Опис події
          </label>
          <textarea
            id="event-description"
            rows={3}
            placeholder="Програма заходу, спікери та ключові теми..."
            {...register('description')}
            className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 transition ${
              errors.description
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="event-category-input"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Категорія
            </label>
            <input
              id="event-category-input"
              type="text"
              placeholder="technology, design, business"
              {...register('category')}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 transition ${
                errors.category
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {errors.category && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="event-date"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Дата проведення
            </label>
            <input
              id="event-date"
              type="date"
              {...register('date')}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 transition ${
                errors.date
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.date.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="event-format"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Формат
            </label>
            <select
              id="event-format"
              {...register('format')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="offline">Офлайн</option>
              <option value="online">Онлайн</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="event-location"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Локація або посилання
            </label>
            <input
              id="event-location"
              type="text"
              placeholder="Київ, UNIT.City або Zoom"
              {...register('location')}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 transition ${
                errors.location
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="event-price"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Ціна квитка (грн, 0 = безкоштовно)
            </label>
            <input
              id="event-price"
              type="number"
              min={0}
              {...register('price', { valueAsNumber: true })}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 transition ${
                errors.price
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="event-capacity"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Кількість місць
            </label>
            <input
              id="event-capacity"
              type="number"
              min={1}
              {...register('capacity', { valueAsNumber: true })}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 transition ${
                errors.capacity
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {errors.capacity && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.capacity.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition cursor-pointer"
          >
            Скасувати
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition cursor-pointer"
          >
            {isPending ? 'Збереження...' : isEditMode ? 'Зберегти зміни' : 'Створити подію'}
          </button>
        </div>
      </form>
    </Modal>
  );
}