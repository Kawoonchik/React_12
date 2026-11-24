import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Не вдалося виконати запит до сервера';

    return Promise.reject(new Error(message));
  }
);