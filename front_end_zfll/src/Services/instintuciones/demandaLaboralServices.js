import api from "../apiClient";

// GET /api/institutions/demanda-laboral/
export async function getDemandaLaboral() {
  const res = await api.get("/institutions/demanda-laboral/");
  return res.data;
}