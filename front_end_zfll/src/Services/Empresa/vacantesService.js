import api from "../apiClient";

// GET /api/jobs/
export async function getVacantes(params = {}) {
  const res = await api.get("/jobs/", { params });
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

// GET /api/jobs/<id>/
export async function getVacanteById(id) {
  if (!id) throw new Error("getVacanteById: id requerido");
  const res = await api.get(`/jobs/${id}/`);
  return res.data;
}

// POST /api/jobs/
export async function createVacante(payload) {
  const res = await api.post("/jobs/", payload);
  return res.data;
}

// PATCH /api/jobs/<id>/
export async function updateVacante(id, payload) {
  if (!id) throw new Error("updateVacante: id requerido");
  const res = await api.patch(`/jobs/${id}/`, payload);
  return res.data;
}

// DELETE /api/jobs/<id>/  (solo si backend lo permite)
export async function deleteVacante(id) {
  if (!id) throw new Error("deleteVacante: id requerido");
  const res = await api.delete(`/jobs/${id}/`);
  return res.data;
}