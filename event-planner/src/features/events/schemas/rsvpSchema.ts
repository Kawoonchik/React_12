import { z } from 'zod';

export const rsvpSchema = z.object({
  attendeeName: z
    .string()
    .trim()
    .min(2, "Введіть ваше ім'я та прізвище (мінімум 2 символи)")
    .max(80, "Ім'я не повинно перевищувати 80 символів"),
  attendeeEmail: z
    .string()
    .trim()
    .min(1, 'Email є обов’язковим')
    .email('Введіть коректну адресу електронної пошти'),
  ticketsCount: z
    .number({ message: 'Вкажіть кількість квитків' })
    .int('Кількість квитків має бути цілим числом')
    .min(1, 'Потрібно забронювати щонайменше 1 квиток')
    .max(10, 'За один раз можна забронювати не більше 10 квитків'),
  comment: z
    .string()
    .trim()
    .max(300, 'Коментар не повинен перевищувати 300 символів')
    .optional(),
});

export type RsvpFormData = z.infer<typeof rsvpSchema>;