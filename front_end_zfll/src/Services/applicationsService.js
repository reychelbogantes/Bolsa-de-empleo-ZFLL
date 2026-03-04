// ============================================================
// applicationsService.js
// Endpoints backend (apps/applications):
//   GET /api/applications/my/
// ============================================================

import api from "./apiClient";

export const getMyApplications = (params = {}) => api.get("/applications/my/", { params });