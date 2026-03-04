import api from "../apiClient";

export const CATALOG_ENDPOINTS = {
  tiposContrato: "tipos-contrato",
  areasTrabajo: "areas-trabajo",
  modalidades: "modalidades",
  estadosVacante: "estados-vacante",
  sectoresIndustriales: "sectores-industriales",
  tamanosEmpresa: "tamanos-empresa",
  estadosPostulacion: "estados-postulacion",
};

export const getCatalog = (resource, params = {}) =>
  api.get(`/catalogs/${resource}/`, { params });

export const getTiposContrato = () => getCatalog(CATALOG_ENDPOINTS.tiposContrato);
export const getAreasTrabajo = () => getCatalog(CATALOG_ENDPOINTS.areasTrabajo);
export const getModalidades = () => getCatalog(CATALOG_ENDPOINTS.modalidades);
export const getEstadosVacante = () => getCatalog(CATALOG_ENDPOINTS.estadosVacante);

export const getSectoresIndustriales = () => getCatalog(CATALOG_ENDPOINTS.sectoresIndustriales);
export const getTamanosEmpresa = () => getCatalog(CATALOG_ENDPOINTS.tamanosEmpresa);

export const getEstadosPostulacion = () => getCatalog(CATALOG_ENDPOINTS.estadosPostulacion);