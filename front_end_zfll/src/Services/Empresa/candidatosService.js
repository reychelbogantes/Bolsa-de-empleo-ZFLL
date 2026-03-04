import api from "../apiClient";

/**
 * Vacantes (jobs)
 * GET /api/jobs/
 */
export async function getVacantes(params = {}) {
  const res = await api.get("/jobs/", { params });
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

/**
 * Postulaciones
 * GET /api/applications/
 */
export async function getPostulacionesEmpresa(params = {}) {
  const res = await api.get("/applications/", { params });
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

/**
 * Actualizar postulación
 * PATCH /api/applications/<id>/
 */
export async function updatePostulacion(id, payload) {
  if (!id) throw new Error("updatePostulacion: id requerido");
  const res = await api.patch(`/applications/${id}/`, payload);
  return res.data;
}

/**
 * Obtener URL del CV
 * GET /api/cv/<id>/
 */
export async function getCvUrl(id) {
  if (!id) throw new Error("getCvUrl: id requerido");
  const res = await api.get(`/cv/${id}/`);
  return res.data?.archivo || res.data?.url || null;
}