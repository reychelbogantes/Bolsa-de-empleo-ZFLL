import api from "./apiClient";

export async function getMe() {
  const res = await api.get("/accounts/me/");
  return res.data;
}