// adminService.js — Auth del administrador
// Intenta /api/auth/login/ (custom) y si falla cae a /api/auth/token/ (SimpleJWT)
import api from './api.js';

/**
 * Login con email + password.
 * 1) Prueba POST /api/auth/login/ → { user, tokens: { access, refresh } }
 * 2) Si falla, prueba POST /api/auth/token/ → { access, refresh }
 * Guarda los tokens y devuelve { user, tokens }.
 */
export const loginAdmin = async (email, password) => {
  // ── Intento 1: endpoint personalizado ────────────────────────
  try {
    const { data } = await api.post('/api/auth/login/', { email, password });

    const access  = data.tokens?.access  ?? data.access;
    const refresh = data.tokens?.refresh ?? data.refresh;

    if (!access) throw new Error('No se recibió token.');

    localStorage.setItem('admin_access_token',  access);
    localStorage.setItem('admin_refresh_token', refresh ?? '');

    // Normaliza la respuesta para el componente Login
    return {
      user:   data.user   ?? { email },
      tokens: { access, refresh },
    };
  } catch (err1) {
    // Si es un 401/403 del backend, re-lanzar directamente (credenciales malas)
    const status = err1?.response?.status;
    if (status === 401 || status === 403) throw err1;

    // ── Intento 2: endpoint SimpleJWT (/api/auth/token/) ─────────
    try {
      const { data } = await api.post('/api/auth/token/', {
        username: email,
        password,
      });

      const access  = data.access;
      const refresh = data.refresh;

      if (!access) throw new Error('No se recibió token.');

      localStorage.setItem('admin_access_token',  access);
      localStorage.setItem('admin_refresh_token', refresh ?? '');

      return {
        user:   { email },
        tokens: { access, refresh },
      };
    } catch (err2) {
      // Propagar el error más descriptivo
      throw err2?.response?.status ? err2 : err1;
    }
  }
};

/** Logout: limpia tokens locales. */
export const logoutAdmin = () => {
  localStorage.removeItem('admin_access_token');
  localStorage.removeItem('admin_refresh_token');
};

/** Perfil del usuario autenticado. GET /api/accounts/me/ */
export const getMyProfile = async () => {
  const { data } = await api.get('/api/accounts/me/');
  return data;
};

/** Lista de administradores. */
export const getAdmins = async () => {
  try {
    const { data } = await api.get('/api/accounts/admin/users/', { params: { rol: 'admin' } });
    return Array.isArray(data) ? data : data.results ?? [];
  } catch {
    return [];
  }
};

/** Crear nuevo admin. */
export const createAdmin = async (payload) => {
  const { data } = await api.post('/api/auth/register/', payload);
  return data;
};

/** Actualizar datos de un admin. */
export const updateAdmin = async (id, payload) => {
  const { data } = await api.patch(`/api/accounts/${id}/`, payload);
  return data;
};

/** Eliminar un admin. */
export const deleteAdmin = async (id) => {
  await api.delete(`/api/accounts/${id}/`);
};
