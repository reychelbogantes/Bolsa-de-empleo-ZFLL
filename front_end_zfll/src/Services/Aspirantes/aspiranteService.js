/**
 * aspiranteService.js
 * Capa de acceso a la API REST del backend Django (ZFLL).
 * Usa apiClient (Axios) para consistencia con el resto de services.
 *
 * ── Endpoints mapeados ────────────────────────────────
 *  POST   /api/auth/token/                       login
 *  POST   /api/auth/token/refresh/               refresh JWT
 *  POST   /api/auth/logout/                      logout
 *  GET    /api/accounts/me/                      datos usuario
 *  PATCH  /api/accounts/me/                      actualizar usuario
 *  GET    /api/accounts/profile/aspirante/       perfil aspirante
 *  PATCH  /api/accounts/profile/aspirante/       actualizar perfil
 *  GET    /api/cv/                               listar versiones CV
 *  POST   /api/cv/                               subir CV
 *  PATCH  /api/cv/<id>/                          editar CV
 *  DELETE /api/cv/<id>/                          eliminar CV
 *  GET    /api/cv/preview/                       preview datos CV
 *  GET    /api/cv/documents/                     documentos (títulos)
 *  POST   /api/cv/documents/                     subir documento
 *  DELETE /api/cv/documents/<id>/                eliminar documento
 *  GET    /api/applications/my/                  mis postulaciones
 *  POST   /api/applications/my/                  crear postulación
 *  GET    /api/jobs/                             listar vacantes
 *  GET    /api/jobs/<id>/                        detalle vacante
 */

import api from '../apiClient';

// ─── Auth ──────────────────────────────────────────────────────────────────────

const saveTokens = ({ access, refresh }) => {
  if (access)  localStorage.setItem('access_token',  access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
};

const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

/**
 * Inicia sesión y guarda los tokens en localStorage.
 */
export async function login(email, password) {
  const { data } = await api.post('/auth/token/', { email, password });
  saveTokens(data);
  return data;
}

/** Renueva el access token. */
export async function refreshToken() {
  const refresh = localStorage.getItem('refresh_token');
  const { data } = await api.post('/auth/token/refresh/', { refresh });
  saveTokens({ access: data.access });
  return data.access;
}

/** Cierra sesión. */
export async function logout() {
  const refresh = localStorage.getItem('refresh_token');
  if (refresh) {
    await api.post('/auth/logout/', { refresh }).catch(() => {});
  }
  clearTokens();
}

// ─── Usuario ───────────────────────────────────────────────────────────────────

/** Datos del usuario autenticado. */
export async function getUsuario() {
  const { data } = await api.get('/accounts/me/');
  return data;
}

/** Actualiza datos del usuario (phone, consent_given). */
export async function updateUsuario(payload) {
  const { data } = await api.patch('/accounts/me/', payload);
  return data;
}

// ─── Perfil Aspirante ──────────────────────────────────────────────────────────

/** Obtiene el perfil aspirante del usuario autenticado. */
export async function getPerfilAspirante() {
  const { data } = await api.get('/accounts/profile/aspirante/');
  return data;
}

/** Actualiza el perfil aspirante. */
export async function updatePerfilAspirante(payload) {
  const { data } = await api.patch('/accounts/profile/aspirante/', payload);
  return data;
}

/**
 * Guarda datos personales completos (combina usuario + extra_data del perfil).
 */
export async function guardarDatosPersonales({
  phone,
  consent_given,
  nombre_completo,
  fecha_nacimiento,
  estado_civil,
  nacionalidad,
  provincia,
  canton,
  distrito,
  direccion,
}) {
  const [usuario, perfil] = await Promise.all([
    updateUsuario({ phone, consent_given }),
    updatePerfilAspirante({
      nombre_completo,
      extra_data: { fecha_nacimiento, estado_civil, nacionalidad, provincia, canton, distrito, direccion },
    }),
  ]);
  return { usuario, perfil };
}

/** Sube foto de perfil (avatar). */
export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('archivo', file);
  formData.append('tipo_documento', 'avatar');

  const { data } = await api.post('/cv/documents/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// ─── CV Versions ───────────────────────────────────────────────────────────────

/** Lista todos los CVs del usuario autenticado. */
export async function getCvVersions() {
  const { data } = await api.get('/cv/');
  return data;
}

/** Sube una nueva versión de CV. */
export async function uploadCvVersion(file, etiqueta, esPredeterminado = false) {
  const formData = new FormData();
  formData.append('archivo', file);
  formData.append('nombre_etiqueta', etiqueta || file.name);
  formData.append('es_predeterminado', String(esPredeterminado));

  const { data } = await api.post('/cv/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/** Actualiza etiqueta o marca un CV como predeterminado. */
export async function updateCvVersion(cvId, payload) {
  const { data } = await api.patch(`/cv/${cvId}/`, payload);
  return data;
}

/** Elimina una versión de CV. */
export async function deleteCvVersion(cvId) {
  await api.delete(`/cv/${cvId}/`);
}

/** Obtiene datos agregados para previsualizar el CV. */
export async function getCvPreview() {
  const { data } = await api.get('/cv/preview/');
  return data;
}

// ─── Documentos (Títulos / Certificados) ──────────────────────────────────────

/** Lista documentos del usuario (títulos, cartas, etc.). */
export async function getDocumentos(tipo) {
  const params = tipo ? { tipo_documento: tipo } : {};
  const { data } = await api.get('/cv/documents/', { params });
  return data;
}

/** Sube un documento (título académico, certificado, etc.). */
export async function uploadDocumento(file, tipo = 'certificado') {
  const formData = new FormData();
  formData.append('archivo', file);
  formData.append('tipo_documento', tipo);

  const { data } = await api.post('/cv/documents/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/** Elimina un documento por su ID. */
export async function deleteDocumento(docId) {
  await api.delete(`/cv/documents/${docId}/`);
}

// ─── Postulaciones ─────────────────────────────────────────────────────────────

/** Lista las postulaciones del usuario autenticado. */
export async function getPostulaciones() {
  const { data } = await api.get('/applications/my/');
  return data;
}

/** Crea una nueva postulación. */
export async function crearPostulacion({ vacanteId, cvVersionId, descripcion }) {
  const body = {
    vacante: vacanteId,
    cv_version: cvVersionId,
  };
  if (descripcion) body.extra_data = { descripcion };

  const { data } = await api.post('/applications/my/', body);
  return data;
}

// ─── Vacantes ──────────────────────────────────────────────────────────────────

/** Lista vacantes públicas con filtros opcionales. */
export async function getVacantes(params = {}) {
  const query = {};
  if (params.search)      query.search      = params.search;
  if (params.canton)      query.canton       = params.canton;
  if (params.es_pasantia) query.es_pasantia  = 'true';
  if (params.ordering)    query.ordering     = params.ordering;
  if (params.page)        query.page         = params.page;

  const { data } = await api.get('/jobs/', { params: query });
  return data;
}

/** Obtiene el detalle de una vacante específica. */
export async function getVacanteDetalle(vacanteId) {
  const { data } = await api.get(`/jobs/${vacanteId}/`);
  return data;
}

// ─── Perfil Profesional (helper compuesto) ─────────────────────────────────────

/**
 * Guarda todos los datos del Perfil Profesional de una sola llamada.
 */
export async function guardarPerfilProfesional({
  resumen_profesional,
  carta_presentacion,
  soft_skills,
  power_skills,
  instituciones,
  visible,
}) {
  return updatePerfilAspirante({
    resumen_profesional,
    extra_data: {
      carta_presentacion,
      soft_skills,
      power_skills,
      instituciones,
      visible,
    },
  });
}