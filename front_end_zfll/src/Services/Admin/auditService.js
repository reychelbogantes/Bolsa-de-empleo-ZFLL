// auditService.js — Auditoría y estadísticas del dashboard
// Endpoints reales del backend:
//   GET /api/audit/events/   → AuditoriaEvento (requiere IsPlatformAdmin)
//   GET /api/admin/stats/    → DashboardStatsView (requiere IsPlatformAdmin)
//
// Campos de AuditoriaEvento:
//   id, realizado_por_usuario, entidad_tipo, entidad_id, accion, fecha, detalles
import api from './api.js';
import { MOCK_AUDIT, MOCK_COMPANIES, MOCK_INSTITUTIONS, MOCK_ASPIRANTS, MOCK_VACANCIES } from '../../constants.js';

/**
 * GET /api/audit/events/ — lista de eventos de auditoría.
 * Filtros disponibles: entidad_tipo, entidad_id, accion, realizado_por_usuario
 * Search: email del usuario, nombre de acción, nombre de entidad
 * Ordering: fecha (desc por defecto)
 */
export const getAuditLogs = async (params = {}) => {
  try {
    const { data } = await api.get('/api/audit/events/', { params });
    return Array.isArray(data) ? data : data.results ?? [];
  } catch {
    return MOCK_AUDIT;
  }
};

/**
 * GET /api/admin/stats/ — estadísticas del dashboard.
 * Respuesta: { usuarios_total, usuarios_por_rol, vacantes_activas, postulaciones_total }
 */
export const getDashboardStats = async () => {
  try {
    const { data } = await api.get('/api/admin/stats/');
    // Adaptar formato de la API al formato que espera el Dashboard
    return {
      companies:    data.usuarios_por_rol?.find(r => r.rol__nombre === 'empresa')?.total ?? MOCK_COMPANIES.length,
      institutions: data.usuarios_por_rol?.find(r => r.rol__nombre === 'institucion')?.total ?? MOCK_INSTITUTIONS.length,
      aspirants:    data.usuarios_por_rol?.find(r => r.rol__nombre === 'aspirante')?.total ?? MOCK_ASPIRANTS.length,
      vacancies:    data.vacantes_activas ?? MOCK_VACANCIES.length,
      totalUsers:   data.usuarios_total ?? 0,
      totalApplications: data.postulaciones_total ?? 0,
    };
  } catch {
    return {
      companies:    MOCK_COMPANIES.length,
      institutions: MOCK_INSTITUTIONS.length,
      aspirants:    MOCK_ASPIRANTS.length,
      vacancies:    MOCK_VACANCIES.length,
    };
  }
};

/**
 * Pendientes de aprobación: empresas e instituciones con activa=false.
 * Combina GET /api/companies/ y GET /api/institutions/ filtrando inactivos.
 */
export const getPendingRegistrations = async () => {
  try {
    const [companiesRes, institutionsRes] = await Promise.all([
      api.get('/api/companies/').catch(() => ({ data: [] })),
      api.get('/api/institutions/').catch(() => ({ data: [] })),
    ]);
    const companies    = Array.isArray(companiesRes.data)    ? companiesRes.data    : companiesRes.data.results    ?? [];
    const institutions = Array.isArray(institutionsRes.data) ? institutionsRes.data : institutionsRes.data.results ?? [];
    return [...companies, ...institutions].filter((i) => i.activa === false);
  } catch {
    return [...MOCK_COMPANIES, ...MOCK_INSTITUTIONS].filter((i) => i.status === 'pendiente');
  }
};