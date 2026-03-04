// ============================================================
// jobsService.js
// Endpoints backend (apps/jobs):
//   GET    /api/jobs/           (list + filtros/search/ordering)
//   POST   /api/jobs/           (crear vacante)
//   GET    /api/jobs/<id>/
//   PATCH  /api/jobs/<id>/
// ============================================================

import api from "./apiClient";

export const getJobs = (params = {}) => api.get("/jobs/", { params });
export const createJob = (data) => api.post("/jobs/", data);
export const getJobById = (id) => api.get(`/jobs/${id}/`);
export const updateJob = (id, data) => api.patch(`/jobs/${id}/`, data);