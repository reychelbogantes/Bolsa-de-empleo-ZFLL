// aspirantService.js — Gestión de Aspirantes
// Usa GET /api/admin/users/?role=aspirante (endpoint admin que lista usuarios por rol)
import api from './api.js';

const mapAspirant = (u) => ({
  id:               u.id,
  name:             u.nombre_completo
                      ?? u.first_name
                      ?? (u.email?.split('@')[0] ?? ''),
  email:            u.email             ?? '',
  phone:            u.phone             ?? u.telefono ?? '',
  status:           u.is_active === false ? 'inactivo' : 'activo',
  registrationDate: u.created_at
                      ? new Date(u.created_at).toLocaleDateString('es-CR')
                      : u.fecha_creacion
                        ? new Date(u.fecha_creacion).toLocaleDateString('es-CR')
                        : '',
  location:         u.ubicacion         ?? '',
  _raw:             u,
});

/**
 * GET /api/admin/users/?role=aspirante
 * Lista todos los usuarios con rol_id=1 (aspirante).
 */
export const getAspirants = async (params = {}) => {
  try {
    const { data } = await api.get('/api/accounts/admin/users/', {
      params: { role: 'aspirante', ...params },
    });
    const list = Array.isArray(data) ? data : data.results ?? [];
    return list.map(mapAspirant);
  } catch {
    return [];
  }
};

/**
 * PATCH /api/admin/users/{id}/ — actualizar datos de un aspirante.
 */
export const updateAspirant = async (id, payload) => {
  const { data } = await api.patch(`/api/accounts/admin/users/${id}/`, payload);
  return mapAspirant(data);
};

/**
 * PATCH /api/admin/users/{id}/ — activar o desactivar un aspirante.
 */
export const updateAspirantStatus = async (id, isActive) => {
  const { data } = await api.patch(`/api/accounts/admin/users/${id}/`, { is_active: isActive });
  return mapAspirant(data);
};

/**
 * DELETE /api/admin/users/{id}/ — eliminar (soft delete) un aspirante.
 */
export const deleteAspirant = async (id) => {
  await api.delete(`/api/accounts/admin/users/${id}/`);
};
