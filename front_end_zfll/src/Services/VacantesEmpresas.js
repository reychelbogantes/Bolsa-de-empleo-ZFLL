const API_URL = "http://localhost:8000/api/vacantes";

/* =======================
   CREAR VACANTE
======================= */
const createVacante = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error al crear vacante");
  }

  return res.json();
};

/* =======================
   OBTENER VACANTES
======================= */
const getVacantes = async () => {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Error al obtener vacantes");
  }

  return res.json();
};

/* =======================
   ACTUALIZAR VACANTE
======================= */
const updateVacante = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error al actualizar vacante");
  }

  return res.json();
};

/* =======================
   ELIMINAR VACANTE
======================= */
const deleteVacante = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar vacante");
  }

  return true;
};

/* =======================
   CAMBIAR ESTADO
======================= */
const toggleVacante = async (id, activa) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activa }),
  });

  if (!res.ok) {
    throw new Error("Error al cambiar estado");
  }

  return res.json();
};

/* =======================
   EXPORT DEFAULT
======================= */
export default {
  createVacante,
  getVacantes,
  updateVacante,
  deleteVacante,
  toggleVacante,
};