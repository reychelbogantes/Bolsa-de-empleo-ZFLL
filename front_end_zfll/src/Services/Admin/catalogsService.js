// ============================================================
// catalogsService.js
// Endpoints backend (apps/catalogs) - router DRF:
//   GET /api/catalogs/<recurso>/
// Recursos disponibles:
//   estados-laborales, estados-practica, niveles-academicos,
//   sectores-industriales, tamanos-empresa, tipos-puesto,
//   tipos-contrato, tipos-vacante, areas-trabajo, modalidades,
//   estados-vacante, estados-postulacion, tipos-evento,
//   medios-notificacion
// ============================================================

import api from "./api";

export const CATALOG_ENDPOINTS = {
  estadosLaborales: "estados-laborales",
  estadosPractica: "estados-practica",
  nivelesAcademicos: "niveles-academicos",
  sectoresIndustriales: "sectores-industriales",
  tamanosEmpresa: "tamanos-empresa",
  tiposPuesto: "tipos-puesto",
  tiposContrato: "tipos-contrato",
  tiposVacante: "tipos-vacante",
  areasTrabajo: "areas-trabajo",
  modalidades: "modalidades",
  estadosVacante: "estados-vacante",
  estadosPostulacion: "estados-postulacion",
  tiposEvento: "tipos-evento",
  mediosNotificacion: "medios-notificacion",
};

// GET genérico
export const getCatalog = (resource, params = {}) =>
  api.get(`/catalogs/${resource}/`, { params });

// Helpers explícitos
export const getEstadosLaborales = () => getCatalog(CATALOG_ENDPOINTS.estadosLaborales);
export const getEstadosPractica = () => getCatalog(CATALOG_ENDPOINTS.estadosPractica);
export const getNivelesAcademicos = () => getCatalog(CATALOG_ENDPOINTS.nivelesAcademicos);
export const getSectoresIndustriales = () => getCatalog(CATALOG_ENDPOINTS.sectoresIndustriales);
export const getTamanosEmpresa = () => getCatalog(CATALOG_ENDPOINTS.tamanosEmpresa);
export const getTiposPuesto = () => getCatalog(CATALOG_ENDPOINTS.tiposPuesto);
export const getTiposContrato = () => getCatalog(CATALOG_ENDPOINTS.tiposContrato);
export const getTiposVacante = () => getCatalog(CATALOG_ENDPOINTS.tiposVacante);
export const getAreasTrabajo = () => getCatalog(CATALOG_ENDPOINTS.areasTrabajo);
export const getModalidades = () => getCatalog(CATALOG_ENDPOINTS.modalidades);
export const getEstadosVacante = () => getCatalog(CATALOG_ENDPOINTS.estadosVacante);
export const getEstadosPostulacion = () => getCatalog(CATALOG_ENDPOINTS.estadosPostulacion);
export const getTiposEvento = () => getCatalog(CATALOG_ENDPOINTS.tiposEvento);
export const getMediosNotificacion = () => getCatalog(CATALOG_ENDPOINTS.mediosNotificacion);