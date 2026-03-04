import api from "../apiClient";

// GET/POST /api/institutions/users/
export async function getInstitutionUsers() {
  const res = await api.get("/institutions/users/");
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

export async function createInstitutionUser(payload) {
  // payload: { correo/email, password, nombre_completo, rol }
  const res = await api.post("/institutions/users/", payload);
  return res.data;
}

// GET/PATCH/DELETE /api/institutions/users/:id/
export async function updateInstitutionUser(id, payload) {
  const res = await api.patch(`/institutions/users/${id}/`, payload);
  return res.data;
}

export async function deleteInstitutionUser(id) {
  const res = await api.delete(`/institutions/users/${id}/`);
  return res.data;
}