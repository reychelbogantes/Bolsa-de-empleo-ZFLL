import React, { useEffect, useMemo, useState } from "react";
import Modal from "../modal/Modal";
import "./VacantesEmpresas.css";

import {
  getVacantes,
  createVacante,
  updateVacante,
  deleteVacante,
} from "../../../Services/Empresa/vacantesService";

import { getEmpresaMeUnsafe } from "../../../Services/Empresa/empresaService";

import {
  getTiposContrato,
  getAreasTrabajo,
  getModalidades,
  getEstadosVacante,
} from "../../../Services/Empresa/catalogoEmpresaService";

export default function VacantesEmpresas() {
  // -----------------------------
  // States principales
  // -----------------------------
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // -----------------------------
  // Catálogos (BD)
  // -----------------------------
  const [tiposContrato, setTiposContrato] = useState([]);
  const [areasTrabajo, setAreasTrabajo] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [estadosVacante, setEstadosVacante] = useState([]);

  // Resolver IDs de estados “activa/pausada” de forma robusta
  const estadoActivaId = useMemo(() => {
    const found = estadosVacante.find((e) =>
      String(e?.nombre || "")
        .toLowerCase()
        .includes("activa")
    );
    return found?.id ?? null;
  }, [estadosVacante]);

  const estadoPausadaId = useMemo(() => {
    const found =
      estadosVacante.find((e) =>
        String(e?.nombre || "")
          .toLowerCase()
          .includes("paus")
      ) ||
      estadosVacante.find((e) =>
        String(e?.nombre || "")
          .toLowerCase()
          .includes("inact")
      );
    return found?.id ?? null;
  }, [estadosVacante]);

  // -----------------------------
  // Form (alineado a Vacante model)
  // -----------------------------
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo_contrato: "", // FK id
    area_trabajo: "", // FK id
    modalidad: "", // FK id
    estado_vacante: "", // FK id
    url_externa: "",
    fecha_cierre: "", // input date (YYYY-MM-DD)
  });

  const resetForm = () => {
    setForm({
      titulo: "",
      descripcion: "",
      tipo_contrato: "",
      area_trabajo: "",
      modalidad: "",
      estado_vacante: "",
      url_externa: "",
      fecha_cierre: "",
    });
    setEditing(null);
  };

  const openNew = () => {
    resetForm();
    // si existe estado "activa" por catálogo, lo preseleccionamos
    setForm((prev) => ({
      ...prev,
      estado_vacante: estadoActivaId ? String(estadoActivaId) : prev.estado_vacante,
    }));
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // -----------------------------
  // Normalización para UI
  // -----------------------------
  const normalizeVacante = (v) => ({
    ...v,
    titulo: v?.titulo ?? "",
    descripcion: v?.descripcion ?? "",
    empresa_nombre: v?.empresa_nombre ?? "",
    area_trabajo_nombre: v?.area_trabajo_nombre ?? "",
    fecha_publicacion: v?.fecha_publicacion ?? null,
    // FKs (pueden venir como number o null)
    tipo_contrato: v?.tipo_contrato ?? null,
    area_trabajo: v?.area_trabajo ?? null,
    modalidad: v?.modalidad ?? null,
    estado_vacante: v?.estado_vacante ?? null,
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      // 1) Cargar catálogos (axios response -> .data)
      const [tc, at, mo, ev] = await Promise.all([
        getTiposContrato(),
        getAreasTrabajo(),
        getModalidades(),
        getEstadosVacante(),
      ]);

      setTiposContrato(Array.isArray(tc.data) ? tc.data : tc.data?.results || []);
      setAreasTrabajo(Array.isArray(at.data) ? at.data : at.data?.results || []);
      setModalidades(Array.isArray(mo.data) ? mo.data : mo.data?.results || []);
      setEstadosVacante(Array.isArray(ev.data) ? ev.data : ev.data?.results || []);

      // 2) Vacantes (service ya devuelve array)
      const data = await getVacantes();
      const arr = Array.isArray(data) ? data : [];
      setVacantes(arr.map(normalizeVacante));
    } catch (err) {
      console.error("Error cargando datos:", err?.response?.data || err.message);
      setVacantes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // Helpers
  // -----------------------------
  const getEstadoNombre = (estadoId) => {
    const idNum = estadoId == null ? null : Number(estadoId);
    const found = estadosVacante.find((e) => Number(e.id) === idNum);
    return found?.nombre || "—";
  };

  const isActiva = (v) => {
    // si existe estadoActivaId, se compara con ese
    if (estadoActivaId) return Number(v?.estado_vacante) === Number(estadoActivaId);

    // fallback por nombre
    const nombre = getEstadoNombre(v?.estado_vacante).toLowerCase();
    return nombre.includes("activa");
  };

  const formatFecha = (iso) => {
    if (!iso) return "—";
    // iso puede venir con hora; mostramos solo fecha
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  // -----------------------------
  // Listado filtrado (seguro)
  // -----------------------------
  const filteredVacantes = useMemo(() => {
    const q = (search ?? "").toLowerCase().trim();
    if (!q) return vacantes;
    return (vacantes || []).filter((v) =>
      String(v?.titulo ?? "").toLowerCase().includes(q)
    );
  }, [vacantes, search]);

  // -----------------------------
  // Estadísticas (sin mocks)
  // -----------------------------
  const stats = useMemo(() => {
    const total = vacantes.length || 0;
    const activas = vacantes.filter((v) => isActiva(v)).length;
    const pausadas = total - activas;

    const totalEstado = total || 1;
    const pctActivas = Math.round((activas / totalEstado) * 100);
    const pctPausadas = 100 - pctActivas;

    // mantener tu donut “3 tonos” como estaba
    const pctOrange = pausadas > 0 ? Math.min(12, pctPausadas) : 0;
    const pctRed = Math.max(0, pctPausadas - pctOrange);

    return {
      total,
      activas,
      pausadas,
      pctActivas,
      pctOrange,
      pctRed,
    };
  }, [vacantes, estadoActivaId, estadosVacante]);

  // -----------------------------
  // Crear / Editar (BD real)
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const empresa = await getEmpresaMeUnsafe();
      if (!empresa?.id) {
        alert(
          "No se encontró la empresa del usuario. Revisa que exista la empresa asociada al usuario (companies/me/)."
        );
        return;
      }

      // payload alineado al backend (FKs como number o null)
      const payload = {
        empresa: empresa.id,
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        tipo_contrato: form.tipo_contrato ? Number(form.tipo_contrato) : null,
        area_trabajo: form.area_trabajo ? Number(form.area_trabajo) : null,
        modalidad: form.modalidad ? Number(form.modalidad) : null,
        estado_vacante: form.estado_vacante ? Number(form.estado_vacante) : null,
        url_externa: form.url_externa?.trim() || "",
        // el backend espera DateTime o string; enviamos YYYY-MM-DD si viene
        fecha_cierre: form.fecha_cierre ? form.fecha_cierre : null,
      };

      if (!payload.titulo) {
        alert("El título es obligatorio.");
        return;
      }
      if (!payload.descripcion) {
        alert("La descripción es obligatoria.");
        return;
      }

      let saved;
      if (editing?.id) {
        saved = await updateVacante(editing.id, payload);
        const norm = normalizeVacante(saved);
        setVacantes((prev) => prev.map((v) => (v.id === editing.id ? norm : v)));
      } else {
        saved = await createVacante(payload);
        const norm = normalizeVacante(saved);
        setVacantes((prev) => [norm, ...prev]);
      }

      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Error guardando vacante:", err?.response?.data || err.message);
      alert(
        JSON.stringify(err?.response?.data || { error: err.message }, null, 2)
      );
    }
  };

  const handleEdit = (v) => {
    setEditing(v);
    setForm({
      titulo: v?.titulo ?? "",
      descripcion: v?.descripcion ?? "",
      tipo_contrato: v?.tipo_contrato ? String(v.tipo_contrato) : "",
      area_trabajo: v?.area_trabajo ? String(v.area_trabajo) : "",
      modalidad: v?.modalidad ? String(v.modalidad) : "",
      estado_vacante: v?.estado_vacante ? String(v.estado_vacante) : "",
      url_externa: v?.url_externa ?? "",
      // si viene con hora, recortamos a YYYY-MM-DD
      fecha_cierre: v?.fecha_cierre ? String(v.fecha_cierre).slice(0, 10) : "",
    });
    setShowModal(true);
  };

  // -----------------------------
  // Eliminar (BD real)
  // -----------------------------
  const handleDelete = async (v) => {
    const ok = window.confirm(`¿Seguro que deseas eliminar "${v?.titulo || "la vacante"}"?`);
    if (!ok) return;

    try {
      await deleteVacante(v.id);
      setVacantes((prev) => prev.filter((x) => x.id !== v.id));
    } catch (err) {
      console.error("Error eliminando vacante:", err?.response?.data || err.message);
      alert(
        JSON.stringify(err?.response?.data || { error: err.message }, null, 2)
      );
    }
  };

  // -----------------------------
  // Toggle activa/pausada (BD real usando estado_vacante)
  // -----------------------------
  const handleToggle = async (v) => {
    // Si no hay estados configurados, no inventamos.
    if (!estadoActivaId || !estadoPausadaId) {
      alert(
        "No se puede alternar ACTIVA/PAUSADA porque el catálogo de estados no tiene valores 'activa' y 'pausada'."
      );
      return;
    }

    const nextId = isActiva(v) ? estadoPausadaId : estadoActivaId;

    try {
      const saved = await updateVacante(v.id, { estado_vacante: nextId });
      const norm = normalizeVacante(saved);
      setVacantes((prev) => prev.map((x) => (x.id === v.id ? norm : x)));
    } catch (err) {
      console.error("Error cambiando estado:", err?.response?.data || err.message);
      alert(
        JSON.stringify(err?.response?.data || { error: err.message }, null, 2)
      );
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="vacE-page">
      {/* HEADER */}
      <div className="vacE-header">
        <div>
          <h2>Gestión de Vacantes</h2>
          <p>Administra tus ofertas laborales y revisa su rendimiento.</p>
        </div>

        <button className="vacE-btnPrimary" onClick={openNew}>
          + Nueva Vacante
        </button>
      </div>

      {/* GRID */}
      <div className="vacE-grid">
        {/* LEFT */}
        <div className="vacE-panel">
          <div className="vacE-panelTop">
            <h3>Lista de Vacantes</h3>

            <div className="vacE-searchPill">
              <span className="vacE-searchIcon">🔍</span>
              <input
                placeholder="Buscar vacante..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="vacE-list">
            {loading ? (
              <div style={{ padding: 12 }}>Cargando...</div>
            ) : filteredVacantes.length === 0 ? (
              <div style={{ padding: 12 }}>No hay vacantes para mostrar.</div>
            ) : (
              filteredVacantes.map((v) => {
                const areaTag = v.area_trabajo_nombre || "—";
                const fecha = formatFecha(v.fecha_publicacion);
                const estadoNombre = getEstadoNombre(v.estado_vacante);
                const activa = isActiva(v);

                return (
                  <div key={v.id} className="vacE-card">
                    {/* icon */}
                    <div className="vacE-iconBox">🧳</div>

                    {/* info */}
                    <div className="vacE-info">
                      <div className="vacE-title">{v.titulo || "(Sin título)"}</div>
                      <div className="vacE-meta">
                        {areaTag} • PUBLICADA EL {fecha}
                      </div>
                    </div>

                    {/* badge */}
                    <span className={`vacE-badge ${activa ? "activa" : "pausada"}`}>
                      {estadoNombre?.toUpperCase?.() ? estadoNombre.toUpperCase() : estadoNombre}
                    </span>

                    {/* actions */}
                    <div className="vacE-actions">
                      <button
                        type="button"
                        className="vacE-icBtn"
                        onClick={() => handleToggle(v)}
                        title={activa ? "Pausar vacante" : "Activar vacante"}
                      >
                        {activa ? "👁️" : "🚫"}
                      </button>

                      <button
                        type="button"
                        className="vacE-icBtn"
                        onClick={() => handleEdit(v)}
                        title="Editar vacante"
                      >
                        ⚙️
                      </button>

                      <button
                        type="button"
                        className="vacE-icBtn"
                        onClick={() => handleDelete(v)}
                        title="Eliminar vacante"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="vacE-stats">
          <h3>Estadísticas de Vacantes</h3>

          <div
            className="vacE-donut"
            style={{
              background: `conic-gradient(
                #10b981 0 ${stats.pctActivas}%,
                #f59e0b ${stats.pctActivas}% ${stats.pctActivas + stats.pctOrange}%,
                #ef4444 ${stats.pctActivas + stats.pctOrange}% 100%
              )`,
            }}
          >
            <div className="vacE-donutCenter" />
          </div>

          <div className="vacE-miniGrid">
            <div className="vacE-miniCard blue">
              <div className="vacE-miniNum">{stats.total}</div>
              <div className="vacE-miniLbl">TOTAL VACANTES</div>
            </div>

            <div className="vacE-miniCard green">
              <div className="vacE-miniNum">{stats.activas}</div>
              <div className="vacE-miniLbl">VACANTES ACTIVAS</div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editing ? "Editar Vacante" : "Publicar Nueva Vacante"}
      >
        <form onSubmit={handleSubmit} className="vm-form">
          <div className="vm-section">
            <div className="vm-h">
              <span className="vm-step">1</span>
              <h4>Información General</h4>
            </div>

            <div className="vm-grid2">
              <div className="vm-field">
                <label>Título del Puesto *</label>
                <input
                  name="titulo"
                  placeholder="Ej: Ingeniero de Calidad"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="vm-field">
                <label>Tipo de Contrato</label>
                <select
                  name="tipo_contrato"
                  value={form.tipo_contrato}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar</option>
                  {tiposContrato.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="vm-field">
                <label>Área / Departamento</label>
                <select
                  name="area_trabajo"
                  value={form.area_trabajo}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar</option>
                  {areasTrabajo.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="vm-field">
                <label>Modalidad</label>
                <select
                  name="modalidad"
                  value={form.modalidad}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar</option>
                  {modalidades.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="vm-field">
                <label>Estado de la Vacante</label>
                <select
                  name="estado_vacante"
                  value={form.estado_vacante}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar</option>
                  {estadosVacante.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="vm-field">
                <label>URL Externa</label>
                <input
                  name="url_externa"
                  placeholder="https://..."
                  value={form.url_externa}
                  onChange={handleChange}
                />
              </div>

              <div className="vm-field">
                <label>Fecha de Cierre</label>
                <input
                  type="date"
                  name="fecha_cierre"
                  value={form.fecha_cierre}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="vm-section">
            <div className="vm-h">
              <span className="vm-step">2</span>
              <h4>Detalles</h4>
            </div>

            <div className="vm-field">
              <label>Descripción del Puesto *</label>
              <textarea
                name="descripcion"
                placeholder="Describe las responsabilidades y el día a día..."
                value={form.descripcion}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
          </div>

          <div className="vm-actions">
            <button
              type="button"
              className="vacE-btnSecondary"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancelar
            </button>

            <button type="submit" className="vacE-btnPrimary">
              {editing ? "Guardar Cambios" : "Publicar Vacante"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}