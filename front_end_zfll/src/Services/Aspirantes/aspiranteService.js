import { IS_MOCK } from '../mockAuth.js';
import * as mock from '../mockAuth.js';
import api from '../apiClient';

const saveTokens = ({ access, refresh }) => {
  if (access)  localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
};

const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export async function login(email, password) {
  if (IS_MOCK) return mock.login(email, password);
  const { data } = await api.post('/auth/token/', { email, password });
  saveTokens(data);
  return data;
}

export async function refreshToken() {
  if (IS_MOCK) return mock.refreshToken();
  const refresh = localStorage.getItem('refresh_token');
  const { data } = await api.post('/auth/token/refresh/', { refresh });
  saveTokens({ access: data.access });
  return data.access;
}

export async function logout() {
  if (IS_MOCK) return mock.logout();
  const refresh = localStorage.getItem('refresh_token');
  if (refresh) await api.post('/auth/logout/', { refresh }).catch(() => {});
  clearTokens();
}

export async function getUsuario() {
  if (IS_MOCK) return mock.getUsuario();
  const { data } = await api.get('/accounts/me/');
  return data;
}

export async function updateUsuario(payload) {
  if (IS_MOCK) return mock.updateUsuario(payload);
  const { data } = await api.patch('/accounts/me/', payload);
  return data;
}

export async function getPerfilAspirante() {
  if (IS_MOCK) return mock.getPerfilAspirante();
  const { data } = await api.get('/accounts/profile/aspirante/');
  return data;
}

export async function updatePerfilAspirante(payload) {
  if (IS_MOCK) return mock.updatePerfilAspirante(payload);
  const { data } = await api.patch('/accounts/profile/aspirante/', payload);
  return data;
}

export async function guardarDatosPersonales(params) {
  if (IS_MOCK) return mock.guardarDatosPersonales(params);
  const [usuario, perfil] = await Promise.all([
    updateUsuario({ phone: params.phone, consent_given: params.consent_given }),
    updatePerfilAspirante({ nombre_completo: params.nombre_completo, extra_data: params }),
  ]);
  return { usuario, perfil };
}

export async function uploadAvatar(file) {
  if (IS_MOCK) return mock.uploadAvatar(file);
  const formData = new FormData();
  formData.append('archivo', file);
  formData.append('tipo_documento', 'avatar');
  const { data } = await api.post('/cv/documents/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
}

export async function getCvVersions() {
  if (IS_MOCK) return mock.getCvVersions();
  const { data } = await api.get('/cv/');
  return data;
}

export async function uploadCvVersion(file, etiqueta, esPredeterminado = false) {
  if (IS_MOCK) return mock.uploadCvVersion(file, etiqueta, esPredeterminado);
  const formData = new FormData();
  formData.append('archivo', file);
  formData.append('nombre_etiqueta', etiqueta || file.name);
  formData.append('es_predeterminado', String(esPredeterminado));
  const { data } = await api.post('/cv/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
}

export async function updateCvVersion(cvId, payload) {
  if (IS_MOCK) return mock.updateCvVersion(cvId, payload);
  const { data } = await api.patch(`/cv/${cvId}/`, payload);
  return data;
}

export async function deleteCvVersion(cvId) {
  if (IS_MOCK) return mock.deleteCvVersion(cvId);
  await api.delete(`/cv/${cvId}/`);
}

export async function getCvPreview() {
  if (IS_MOCK) return mock.getCvPreview();
  const { data } = await api.get('/cv/preview/');
  return data;
}

export async function getDocumentos(tipo) {
  if (IS_MOCK) return mock.getDocumentos(tipo);
  const params = tipo ? { tipo_documento: tipo } : {};
  const { data } = await api.get('/cv/documents/', { params });
  return data;
}

export async function uploadDocumento(file, tipo = 'certificado') {
  if (IS_MOCK) return mock.uploadDocumento(file, tipo);
  const formData = new FormData();
  formData.append('archivo', file);
  formData.append('tipo_documento', tipo);
  const { data } = await api.post('/cv/documents/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
}

export async function deleteDocumento(docId) {
  if (IS_MOCK) return mock.deleteDocumento(docId);
  await api.delete(`/cv/documents/${docId}/`);
}

export async function getPostulaciones() {
  if (IS_MOCK) return mock.getPostulaciones();
  const { data } = await api.get('/applications/my/');
  return data;
}

export async function crearPostulacion({ vacanteId, cvVersionId, descripcion }) {
  if (IS_MOCK) return mock.crearPostulacion({ vacanteId, cvVersionId, descripcion });
  const body = { vacante: vacanteId, cv_version: cvVersionId };
  if (descripcion) body.extra_data = { descripcion };
  const { data } = await api.post('/applications/my/', body);
  return data;
}

export async function getVacantes(params = {}) {
  if (IS_MOCK) return mock.getVacantes(params);
  const { data } = await api.get('/jobs/', { params });
  return data;
}

export async function getVacanteDetalle(vacanteId) {
  if (IS_MOCK) return mock.getVacanteDetalle(vacanteId);
  const { data } = await api.get(`/jobs/${vacanteId}/`);
  return data;
}

export async function guardarPerfilProfesional(params) {
  if (IS_MOCK) return mock.guardarPerfilProfesional(params);
  return updatePerfilAspirante({ resumen_profesional: params.resumen_profesional, extra_data: params });
}