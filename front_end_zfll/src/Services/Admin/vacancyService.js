// vacancyService.js — CRUD de Vacantes
// Modelo: Vacante (tabla: vacantes)
// Campos respuesta: id, empresa, titulo, descripcion, tipo_puesto, tipo_contrato,
//   tipo_vacante, area_trabajo, modalidad, estado_vacante, url_externa,
//   fecha_publicacion, fecha_cierre
// Filtros disponibles (via VacanteFilter): empresa, area_trabajo, tipo_contrato, estado_vacante
import api from './api.js';
import { MOCK_VACANCIES } from '../../constants.js';

/**
 * GET /api/jobs/ — lista vacantes con filtros opcionales.
 * Params útiles: estado_vacante, empresa, search, ordering
 */
export const getVacancies = async (params = {}) => {
  try {
    const { data } = await api.get('/api/jobs/', { params });
    return data;
  } catch {
    return MOCK_VACANCIES;
  }
};

/**
 * GET /api/jobs/?estado_vacante=pendiente — vacantes pendientes de aprobación.
 * (El nombre exacto del estado depende de los datos en catalogs.EstadoVacante)
 */
export const getPendingVacancies = async () => {
  try {
    const { data } = await api.get('/api/jobs/', { params: { estado_vacante__nombre: 'pendiente' } });
    return Array.isArray(data) ? data : data.results ?? [];
  } catch {
    return MOCK_VACANCIES.filter((v) => v.status === 'pendiente');
  }
};

/**
 * GET /api/jobs/{id}/ — detalle de una vacante.
 */
export const getVacancyById = async (id) => {
  try {
    const { data } = await api.get(`/api/jobs/${id}/`);
    return data;
  } catch {
    return MOCK_VACANCIES.find((v) => v.id === String(id)) || null;
  }
};

/**
 * PATCH /api/jobs/{id}/ — aprobar vacante.
 * Cambia estado_vacante al ID correspondiente a "aprobada".
 * @param {number|string} id
 * @param {number} estadoAprobadaId — ID del catálogo EstadoVacante con nombre "aprobada"
 */
export const approveVacancy = async (id, estadoAprobadaId) => {
  const { data } = await api.patch(`/api/jobs/${id}/`, { estado_vacante: estadoAprobadaId });
  return data;
};

/**
 * PATCH /api/jobs/{id}/ — rechazar vacante.
 * @param {number|string} id
 * @param {number} estadoRechazadaId — ID del catálogo EstadoVacante con nombre "rechazada"
 */
export const rejectVacancy = async (id, estadoRechazadaId) => {
  const { data } = await api.patch(`/api/jobs/${id}/`, { estado_vacante: estadoRechazadaId });
  return data;
};

/**
 * POST /api/jobs/ — crear nueva vacante.
 */
export const createVacancy = async (payload) => {
  const { data } = await api.post('/jobs/', payload);
  return data;
};