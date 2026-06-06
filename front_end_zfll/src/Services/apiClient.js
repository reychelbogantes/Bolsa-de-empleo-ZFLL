import axios from "axios";
import { IS_MOCK } from "./mockAuth.js";
import { MOCK_ASPIRANTS, MOCK_VACANCIES } from "../constants.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

// Adjuntar token JWT
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("admin_access_token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Mock interceptor ──────────────────────────────────────────
if (IS_MOCK) {
  api.interceptors.request.use((config) => {
    const url = config.url || "";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const aspirante = MOCK_ASPIRANTS[0];

    const mockResponses = {
      "/accounts/me/": { id: user.id, email: user.email, nombre: user.nombre, role: user.role },
      "/accounts/profile/aspirante/": {
        id: "1", nombre_completo: aspirante.name, resumen_profesional: aspirante.summary,
        soft_skills: aspirante.softSkills, hard_skills: aspirante.hardSkills,
        educacion: aspirante.education, experiencia: aspirante.experience,
        visible: true, canton: aspirante.location,
      },
      "/cv/": [],
      "/cv/preview/": { nombre: aspirante.name, resumen: aspirante.summary },
      "/cv/documents/": [],
      "/applications/my/": [],
      "/jobs/": { results: MOCK_VACANCIES, count: MOCK_VACANCIES.length },
    };

    // Buscar si la URL tiene un mock
    const matchedKey = Object.keys(mockResponses).find(k => url.includes(k));

    if (matchedKey) {
      // Cancelar la petición real y devolver mock
      const mockData = mockResponses[matchedKey];
      config.adapter = () =>
        Promise.resolve({
          data: mockData,
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        });
    }

    return config;
  });
}

export default api;
/* import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

// Adjuntar token JWT (ajusta keys si usas otras)
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("admin_access_token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api; */