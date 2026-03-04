// api.js — configuración base para Django REST Framework + JWT
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});  

// Adjuntar access token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Solo redirigir a login si había un token y el refresh también falló.
// Si no hay token, simplemente rechazar sin redirigir (los services tienen fallback a mock).
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const hadToken = !!localStorage.getItem('admin_access_token');

    if (error.response?.status === 401 && !original._retry && hadToken) {
      original._retry = true;
      const refresh = localStorage.getItem('admin_refresh_token');

      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, { refresh });
          localStorage.setItem('admin_access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          // Refresh falló → limpiar tokens y redirigir
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_refresh_token');
          window.location.href = '/login';
        }
      } else {
        // Tenía access token pero no refresh → limpiar y redirigir
        localStorage.removeItem('admin_access_token');
        window.location.href = '/login';
      }
    }

    // Sin token: simplemente lanzar el error (el service lo captura y usa mock)
    return Promise.reject(error);
  }
);

export default api;