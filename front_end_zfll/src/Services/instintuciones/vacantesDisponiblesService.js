import { getJobs } from "../jobsService";

export async function listVacantes(params = {}) {
  const res = await getJobs(params);
  const data = res.data;
  return Array.isArray(data) ? data : data?.results || [];
}