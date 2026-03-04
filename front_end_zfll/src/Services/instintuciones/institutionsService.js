import api from "../apiClient";

/** GET /api/institutions/ */
export async function getInstitutions(params = {}) {
  const res = await api.get("/institutions/", { params });
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

/** GET /api/institutions/<id>/ */
export async function getInstitutionById(id) {
  if (!id) throw new Error("getInstitutionById: id requerido");
  const res = await api.get(`/institutions/${id}/`);
  return res.data;
}

/** PATCH /api/institutions/<id>/ */
export async function updateInstitution(id, payload) {
  if (!id) throw new Error("updateInstitution: id requerido");
  const res = await api.patch(`/institutions/${id}/`, payload);
  return res.data;
}