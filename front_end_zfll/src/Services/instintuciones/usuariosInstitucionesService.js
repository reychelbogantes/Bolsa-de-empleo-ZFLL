import api from "../apiClient";

const BASE = "/institutions/users";

/** GET /api/institutions/users/ */
export async function getUsuariosInstitucion(params = {}) {
  const res = await api.get(`${BASE}/`, { params });
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

/** POST /api/institutions/users/ */
export async function createUsuarioInstitucion(payload) {
  const res = await api.post(`${BASE}/`, payload);
  return res.data;
}

/** PATCH /api/institutions/users/<id>/ */
export async function updateUsuarioInstitucion(id, payload) {
  if (!id) throw new Error("updateUsuarioInstitucion: id requerido");
  const res = await api.patch(`${BASE}/${id}/`, payload);
  return res.data;
}

/** DELETE /api/institutions/users/<id>/ */
export async function deleteUsuarioInstitucion(id) {
  if (!id) throw new Error("deleteUsuarioInstitucion: id requerido");
  const res = await api.delete(`${BASE}/${id}/`);
  return res.data;
}