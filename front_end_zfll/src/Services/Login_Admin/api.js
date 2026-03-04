// api.js — Instancia Axios con JWT automático y refresco de token
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/* ── Adjuntar token en cada request ── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ── Manejo de 401: intentar refresh, si falla → login ── */
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Solo intentar refresh si:
    // 1. Es un 401
    // 2. No lo hemos reintentado ya
    // 3. Había un token guardado
    const hadToken = !!localStorage.getItem('admin_access_token');
    if (error.response?.status === 401 && !original._retry && hadToken) {
      original._retry = true;
      const refresh = localStorage.getItem('admin_refresh_token');

      if (refresh) {
        try {
          const { data } = await axios.post(
            `${BASE_URL}/api/auth/token/refresh/`,
            { refresh }
          );
          const newAccess = data.access;
          localStorage.setItem('admin_access_token', newAccess);
          original.headers.Authorization = `Bearer ${newAccess}`;
          return api(original); // reintentar el request original
        } catch {
          // El refresh también falló → sesión expirada
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_refresh_token');
          // Forzar recarga para que AdminPanel muestre el login
          window.location.reload();
          return Promise.reject(error);
        }
      }

      // Había access pero no refresh → limpiar
      localStorage.removeItem('admin_access_token');
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default api;
