import api from "../apiClient";

// ✅ Ajusta esto a tu backend real
// Ejemplos comunes:
// const EGRESADOS_BASE = "/egresados";
// const EGRESADOS_BASE = "/instituciones/egresados";  (si está agrupado)
const EGRESADOS_BASE = "/egresados";

// Helpers para normalizar respuestas DRF
function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function buildQuery(params = {}) {
  const clean = {};
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") clean[k] = v;
  });
  return clean;
}

// ─────────────────────────────────────────────
// LISTAR (general)  GET /egresados/?search=&carrera=
// ─────────────────────────────────────────────
export async function getEgresados(params = {}) {
  const res = await api.get(`${EGRESADOS_BASE}/`, { params: buildQuery(params) });
  return normalizeList(res.data);
}

// ─────────────────────────────────────────────
// LISTAR POR INSTITUCIÓN (si tu API lo soporta)
// Opción A: /egresados/?institucion_id=1
// ─────────────────────────────────────────────
export async function getEgresadosInstitucion(institucionId, params = {}) {
  const finalParams = buildQuery({ ...params, institucion_id: institucionId });
  const res = await api.get(`${EGRESADOS_BASE}/`, { params: finalParams });
  return normalizeList(res.data);
}

// ─────────────────────────────────────────────
// DETALLE  GET /egresados/:id/
// ─────────────────────────────────────────────
export async function getEgresadoById(id) {
  if (!id) throw new Error("getEgresadoById: id requerido");
  const res = await api.get(`${EGRESADOS_BASE}/${id}/`);
  return res.data;
}

// ─────────────────────────────────────────────
// CREAR  POST /egresados/
// payload ejemplo:
// {
//   email, nombre, apellido, username, telefono,
//   institucion_id, programa_id,
//   fecha_inicio, fecha_fin, horas_requeridas,
//   blandas:[], power:[]
// }
// ─────────────────────────────────────────────
export async function createEgresado(payload) {
  if (!payload) throw new Error("createEgresado: payload requerido");
  const res = await api.post(`${EGRESADOS_BASE}/`, payload);
  return res.data;
}

// ─────────────────────────────────────────────
// EDITAR (PATCH)  PATCH /egresados/:id/
// ─────────────────────────────────────────────
export async function updateEgresado(id, payload) {
  if (!id) throw new Error("updateEgresado: id requerido");
  if (!payload) throw new Error("updateEgresado: payload requerido");
  const res = await api.patch(`${EGRESADOS_BASE}/${id}/`, payload);
  return res.data;
}

// ─────────────────────────────────────────────
// REEMPLAZAR (PUT)  PUT /egresados/:id/
// ─────────────────────────────────────────────
export async function replaceEgresado(id, payload) {
  if (!id) throw new Error("replaceEgresado: id requerido");
  if (!payload) throw new Error("replaceEgresado: payload requerido");
  const res = await api.put(`${EGRESADOS_BASE}/${id}/`, payload);
  return res.data;
}

// ─────────────────────────────────────────────
// ELIMINAR  DELETE /egresados/:id/
// ─────────────────────────────────────────────
export async function deleteEgresado(id) {
  if (!id) throw new Error("deleteEgresado: id requerido");
  const res = await api.delete(`${EGRESADOS_BASE}/${id}/`);
  return res.data; // a veces viene vacío, está bien
}