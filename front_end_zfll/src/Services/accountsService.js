// ============================================================
// accountsService.js
// Endpoints backend (apps/accounts):
//   GET   /api/accounts/me/
//   GET   /api/accounts/profile/aspirante/
//   PATCH /api/accounts/profile/aspirante/
//   GET   /api/accounts/profile/practicante/
//   PATCH /api/accounts/profile/practicante/
//   POST  /api/accounts/profile/switch-rol/
// ============================================================

import api from "./apiClient";

export const getMe = () => api.get("/accounts/me/");

export const getPerfilAspirante = () => api.get("/accounts/profile/aspirante/");
export const updatePerfilAspirante = (data) => api.patch("/accounts/profile/aspirante/", data);

export const getPerfilPracticante = () => api.get("/accounts/profile/practicante/");
export const updatePerfilPracticante = (data) => api.patch("/accounts/profile/practicante/", data);

// target_type: "aspirante" | "practicante"  | confirm: true
export const switchRol = ({ target_type, confirm = true }) =>
  api.post("/accounts/profile/switch-rol/", { target_type, confirm });