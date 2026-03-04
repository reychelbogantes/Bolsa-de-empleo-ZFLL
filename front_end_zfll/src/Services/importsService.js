import api from "./apiClient";

export async function uploadImportBatch(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post("/imports/upload/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // lote
}

export async function getImportBatchStatus(id) {
  const res = await api.get(`/imports/${id}/status/`);
  return res.data;
}