import { z } from 'zod';

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Назва події має містити щонайменше 3 символи')
    .max(100, 'Назва не повинна перевищувати 100 символів'),
  description: z
    .string()
    .trim()
    .min(10, 'Опис має містити щонайменше 10 символів')
    .max(1000, 'Опис не повинен перевищувати 1000 символів'),
  category: z
    .string()
    .trim()
    .min(1, 'Оберіть або вкажіть категорію події'),
  date: z
    .string()
    .min(1, 'Вкажіть дату проведення події'),
  location: z
    .string()
    .trim()
    .min(2, 'Вкажіть місце проведення або платформу')
    .max(120, 'Локація не повинна перевищувати 120 символів'),
  format: z.enum(['online', 'offline']),
  price: z
    .number({ message: 'Вкажіть коректну ціну числом' })
    .min(0, 'Ціна не може бути від’ємною')
    .max(100000, 'Занадто велика сума'),
  capacity: z
    .number({ message: 'Вкажіть кількість місць числом' })
    .int('Кількість місць має бути цілим числом')
    .min(1, 'Мінімум 1 місце')
    .max(10000, 'Максимум 10 000 місць'),
});

export type EventFormData = z.infer<typeof eventSchema>;