import api from "../apiClient";

// GET /api/institutions/
export async function getInstitutions(params = {}) {
  const res = await api.get("/institutions/", { params });
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

// GET /api/institutions/:id/
export async function getInstitutionById(id) {
  const res = await api.get(`/institutions/${id}/`);
  return res.data;
}

// PATCH /api/institutions/:id/
export async function updateInstitution(id, payload) {
  const res = await api.patch(`/institutions/${id}/`, payload);
  return res.data;
}

// GET /api/accounts/me/ (si ya existe en tu backend)
export async function getMe() {
  const res = await api.get("/accounts/me/");
  return res.data;
}

// “Mi institución” (sin endpoint /me/): cruzamos con usuario_email
export async function getMyInstitution() {
  const me = await getMe();
  const list = await getInstitutions();
  const email = (me?.email || "").toLowerCase();
  return list.find((i) => (i?.usuario_email || "").toLowerCase() === email) || null;
}