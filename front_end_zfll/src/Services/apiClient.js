import axios from "axios";

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

export default api;