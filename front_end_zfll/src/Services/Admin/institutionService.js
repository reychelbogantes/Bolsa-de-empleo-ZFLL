// institutionService.js — CRUD de Instituciones
import api from './api.js';

const mapInstitucion = (i) => ({
  id:               i.id,
  name:             i.nombre            ?? i.name        ?? '',
  type:             i.tipo_nombre       ?? i.tipo_institucion ?? i.type ?? '',
  location:         i.ubicacion         ?? i.location     ?? '',
  email:            i.usuario_email     ?? i.email        ?? '',
  phone:            i.usuario_phone     ?? i.phone        ?? '',
  contactName:      i.contacto         ?? i.contactName  ?? '',
  description:      i.descripcion      ?? i.description  ?? '',
  status:           i.activa == null
                      ? 'pendiente'
                      : (i.activa ? 'aprobada' : 'desactivada'),
  registrationDate: i.fecha_creacion
                      ? new Date(i.fecha_creacion).toLocaleDateString('es-CR')
                      : '',
  activa:           i.activa,
  _raw:             i,
});

/** GET /api/institutions/ */
export const getInstitutions = async (params = {}) => {
  try {
    const { data } = await api.get('/api/institutions/', { params });
    const list = Array.isArray(data) ? data : data.results ?? [];
    return list.map(mapInstitucion);
  } catch {
    return []; // ← array vacío, nunca mezclar con mocks de empresas
  }
};

/** GET /api/institutions/?activa=false */
export const getPendingInstitutions = async () => {
  try {
    const { data } = await api.get('/api/institutions/', { params: { activa: false } });
    const list = Array.isArray(data) ? data : data.results ?? [];
    return list.map(mapInstitucion);
  } catch {
    return [];
  }
};

/** GET /api/institutions/{id}/ */
export const getInstitutionById = async (id) => {
  try {
    const { data } = await api.get(`/api/institutions/${id}/`);
    return mapInstitucion(data);
  } catch {
    return null;
  }
};

/** PATCH /api/institutions/{id}/ */
export const updateInstitution = async (id, payload) => {
  const { data } = await api.patch(`/api/institutions/${id}/`, payload);
  return mapInstitucion(data);
};

/**
 * PATCH /api/institutions/{id}/ — aprobar (activa=true) o desactivar (activa=false).
 * El backend también asigna rol_id=3 al usuario al aprobar.
 */
export const updateInstitutionStatus = async (id, activa) => {
  const { data } = await api.patch(`/api/institutions/${id}/`, { activa });
  return mapInstitucion(data);
};

/**
 * POST /api/auth/register/institucion/ — Crear nueva institución desde el admin.
 *
 * Campos del formulario admin  →  Campos esperados por el backend
 *   name          (nombre)         → nombre_institucion + nombre
 *   type          (tipo)           → tipo_institucion
 *   location      (cantón)         → ubicacion
 *   phone                          → phone
 *   email                          → email
 *   password                       → password
 *   contactName                    → contacto_admin
 *
 * @param {object} formData
 * @param {boolean} approve   Si true, aprueba inmediatamente
 */
export const createInstitution = async (formData, approve = false) => {
  const payload = {
    email:               formData.email       ?? '',
    password:            formData.password    ?? '',
    phone:               formData.phone       ?? '',
    nombre:              formData.name        ?? '',
    nombre_institucion:  formData.name        ?? '',
    tipo_institucion:    formData.type        ?? '',
    ubicacion:           formData.location    ?? '',
    contacto_admin:      formData.contactName ?? '',
  };

  const { data } = await api.post('/api/auth/register/institucion/', payload);

  if (approve && data.user_id) {
    try {
      await updateInstitutionStatus(data.user_id, true);
    } catch {
      // queda pendiente si falla la aprobación
    }
  }

  return data;
};

/** DELETE /api/institutions/{id}/ */
export const deleteInstitution = async (id) => {
  await api.delete(`/api/institutions/${id}/`);
};
