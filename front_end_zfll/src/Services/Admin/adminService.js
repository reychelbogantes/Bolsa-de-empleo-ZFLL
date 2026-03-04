// adminService.js — Login y perfil de usuario admin
// Endpoint: POST /api/auth/token/  → obtiene access + refresh JWT
// Endpoint: GET  /api/accounts/me/ → perfil del usuario autenticado
import api from './api.js';

/**
 * Login con email y password.
 * Guarda los tokens en localStorage automáticamente.
 * @returns {{ access, refresh, user }}
 */
export const loginAdmin = async (email, password) => {
  const { data } = await api.post('/api/auth/token/', { username: email, password });
  localStorage.setItem('admin_access_token', data.access);
  localStorage.setItem('admin_refresh_token', data.refresh);
  return data;
};

/**
 * Logout: limpia tokens locales.
 */
export const logoutAdmin = () => {
  localStorage.removeItem('admin_access_token');
  localStorage.removeItem('admin_refresh_token');
};

/**
 * Perfil del usuario autenticado actualmente.
 * GET /api/accounts/me/
 */
export const getMyProfile = async () => {
  const { data } = await api.get('/api/accounts/me/');
  return data;
};

/**
 * GET /api/accounts/me/ — lista de admins del sistema.
 * Filtra usuarios con rol "admin" o "superadmin".
 */
export const getAdmins = async () => {
  try {
    const { data } = await api.get('/api/accounts/', { params: { rol: 'admin' } });
    return Array.isArray(data) ? data : data.results ?? [];
  } catch {
    return [];
  }
};

/**
 * POST /api/auth/register/ — crear nuevo admin.
 * Payload: { email, password, nombre, role }
 */
export const createAdmin = async (payload) => {
  const { data } = await api.post('/api/auth/register/', payload);
  return data;
};

/**
 * PATCH /api/accounts/{id}/ — actualizar datos de un admin.
 */
export const updateAdmin = async (id, payload) => {
  const { data } = await api.patch(`/api/accounts/${id}/`, payload);
  return data;
};

/**
 * DELETE /api/accounts/{id}/ — eliminar un admin.
 */
export const deleteAdmin = async (id) => {
  await api.delete(`/api/accounts/${id}/`);
};