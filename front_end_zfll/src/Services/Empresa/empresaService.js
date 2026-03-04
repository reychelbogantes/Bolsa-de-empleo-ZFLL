// ============================================================
// empresaService.js
// Alineado a backend: /api/companies/, /api/companies/me/, /api/companies/<id>/
// Usa el apiClient del proyecto (maneja empresa_access_token / admin_access_token)
// ============================================================

import api from "../apiClient";

function toFormData(payload = {}) {
  const form = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined) return;

    // null -> mandar vacío o no mandar (aquí lo mandamos como string vacío)
    if (value === null) {
      form.append(key, "");
      return;
    }

    // File / Blob
    if (value instanceof File || value instanceof Blob) {
      form.append(key, value);
      return;
    }

    // Objetos (ej: extra_data)
    if (typeof value === "object") {
      form.append(key, JSON.stringify(value));
      return;
    }

    form.append(key, String(value));
  });

  return form;
}

/** GET /api/companies/me/ (devuelve respuesta axios) */
export async function getEmpresaMe() {
  return api.get("/companies/me/");
}

/**
 * GET /api/companies/me/ (devuelve data directo)
 * Usado por VacantesEmpresas.jsx para sacar empresa.id sin pelearse con axios
 */
export async function getEmpresaMeUnsafe() {
  try {
    const res = await api.get("/companies/me/");
    return res.data;
  } catch (e) {
    return null;
  }
}

/** PATCH /api/companies/me/ (devuelve respuesta axios) */
export async function updateEmpresaMe(payload = {}) {
  const hasFile = Object.values(payload).some(
    (v) => v instanceof File || v instanceof Blob
  );

  if (hasFile) {
    const form = toFormData(payload);
    return api.patch("/companies/me/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  return api.patch("/companies/me/", payload);
}

/** (Opcional) GET /api/companies/ */
export async function getCompanies(params = {}) {
  return api.get("/companies/", { params });
}

/** (Opcional) PATCH /api/companies/<id>/ */
export async function updateEmpresa(id, payload = {}) {
  if (!id) throw new Error("updateEmpresa: id requerido");
  return api.patch(`/companies/${id}/`, payload);
}