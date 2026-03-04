import api from "./apiClient";

export async function getPasantiasDashboard() {
  const res = await api.get("/pasantias-dashboard/");
  return res.data; // { recibidas: [], enviadas: [] }
}

export async function getSolicitudesRecibidas() {
  const res = await api.get("/pasantias-dashboard/recibidas/");
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

export async function getSolicitudesEnviadas() {
  const res = await api.get("/pasantias-dashboard/enviadas/");
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}