import api from "../apiClient";

export async function getProgramas() {
  const res = await api.get("/institutions/programas/");
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

export async function createPrograma(payload) {
  const res = await api.post("/institutions/programas/", payload);
  return res.data;
}

export async function updatePrograma(id, payload) {
  const res = await api.patch(`/institutions/programas/${id}/`, payload);
  return res.data;
}

export async function deletePrograma(id) {
  const res = await api.delete(`/institutions/programas/${id}/`);
  return res.data;
}