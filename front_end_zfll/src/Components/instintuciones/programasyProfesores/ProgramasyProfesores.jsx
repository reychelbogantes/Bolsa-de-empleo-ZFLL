import React, { useEffect, useState, useMemo } from "react";
import Modal from "../modal/Modal";
import "./ProgramasyProfesores.css";
import Swal from "sweetalert2";

// ✅ SERVICES (los dejamos importados pero NO obligatorios)
// Si quieres después conectarlo, solo cambias USE_MOCK a false
import {
  getProgramas,
  createPrograma,
  updatePrograma,
  deletePrograma,
} from "../../../Services/instintuciones/programasService";

// ✅ SWITCH
const USE_MOCK = true;

// 🔥 DATOS QUEMADOS
const MOCK_PROGRAMAS = [
  {
    id: 1,
    nombre: "Ingeniería en Computación",
    descripcion:
      "Programa enfocado en desarrollo de software, bases de datos y arquitectura de sistemas.",
    profesor: "Ing. Luis Diego Castro",
    egresados: 42,
    modalidad: "Presencial",
    duracion: "4 años",
    requisitos: "Bachillerato, prueba de admisión, entrevista.",
  },
  {
    id: 2,
    nombre: "Administración de Empresas",
    descripcion:
      "Formación integral en finanzas, contabilidad, mercadeo y gestión de proyectos.",
    profesor: "MSc. Andrea Salazar",
    egresados: 58,
    modalidad: "Híbrido",
    duracion: "4 años",
    requisitos: "Bachillerato, prueba de aptitud, documentación.",
  },
  {
    id: 3,
    nombre: "Electromecánica",
    descripcion:
      "Enfoque técnico en mantenimiento industrial, automatización y control eléctrico.",
    profesor: "Ing. Carlos Rojas",
    egresados: 31,
    modalidad: "Presencial",
    duracion: "3 años",
    requisitos: "Bachillerato, examen técnico básico.",
  },
  {
    id: 4,
    nombre: "Ciberseguridad",
    descripcion:
      "Redes, seguridad ofensiva/defensiva, gestión de riesgos y auditoría de sistemas.",
    profesor: "Dra. Elena Rodríguez",
    egresados: 19,
    modalidad: "Remoto",
    duracion: "2 años",
    requisitos: "Conocimientos básicos de redes, entrevista.",
  },
];

// ✅ mapper tolerante por si backend usa nombres distintos
const mapPrograma = (p) => ({
  id: p.id,
  nombre: p.nombre ?? p.name ?? "",
  descripcion: p.descripcion ?? p.description ?? "",
  profesor: p.profesor ?? p.teacher ?? "—",
  egresados: Number(p.egresados ?? p.egresados_registrados ?? 0),
  modalidad: p.modalidad ?? p.modality ?? "Presencial",
  duracion: p.duracion ?? p.duration ?? "",
  requisitos: p.requisitos ?? p.requirements ?? "",
  _raw: p,
});

export default function ProgramasyProfesores() {
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [showNuevo, setShowNuevo] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showIngresar, setShowIngresar] = useState(false);
  const [selected, setSelected] = useState(null);

  const [showEditar, setShowEditar] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: "",
    modalidad: "Presencial",
    duracion: "",
    profesor: "",
    descripcion: "",
    requisitos: "",
  });

  // Form nuevo programa
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    profesor: "",
    egresados: "",
  });

  const resetForm = () =>
    setForm({ nombre: "", descripcion: "", profesor: "", egresados: "" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ====== LOAD ======
  const reloadProgramas = async () => {
    if (USE_MOCK) {
      // 🔥 load mock
      setProgramas(MOCK_PROGRAMAS.map(mapPrograma));
      return;
    }

    const data = await getProgramas();
    setProgramas((Array.isArray(data) ? data : []).map(mapPrograma));
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await reloadProgramas();
      } catch (err) {
        console.error(err);

        // ✅ fallback a mock si backend falla
        setProgramas(MOCK_PROGRAMAS.map(mapPrograma));

        Swal.fire({
          icon: "warning",
          title: "Backend no disponible",
          text: "Se cargaron datos quemados (mock) para que puedas seguir.",
          confirmButtonColor: "#2563eb",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ====== CREATE ======
  const crearPrograma = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      profesor: form.profesor.trim() || "—",
      egresados: Number(form.egresados || 0),
      modalidad: "Presencial",
      duracion: "",
      requisitos: "",
    };

    if (!payload.nombre) {
      Swal.fire({
        icon: "error",
        title: "Nombre requerido",
        text: "Debes escribir el nombre del programa.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    try {
      if (USE_MOCK) {
        // ✅ CREATE EN MEMORIA
        setProgramas((prev) => {
          const nextId = prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1;
          return [{ ...payload, id: nextId }, ...prev];
        });
      } else {
        await createPrograma(payload);
        await reloadProgramas();
      }

      setShowNuevo(false);
      resetForm();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Programa creado",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo crear",
        text: err?.response?.data?.detail || "Error creando programa.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  const abrirInfo = (p) => {
    setSelected(p);
    setShowInfo(true);
  };

  const abrirIngresar = (p) => {
    setSelected(p);
    setShowIngresar(true);
  };

  const openEditar = (p) => {
    setSelected(p);
    setEditForm({
      nombre: p.nombre || "",
      modalidad: p.modalidad || "Presencial",
      duracion: p.duracion || "",
      profesor: p.profesor || "",
      descripcion: p.descripcion || "",
      requisitos: p.requisitos || "",
    });
    setShowEditar(true);
  };

  const closeEditar = () => {
    setShowEditar(false);
    setSelected(null);
  };

  const onEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ====== UPDATE ======
  const saveEditar = async (e) => {
    e.preventDefault();
    if (!selected?.id) return;

    const payload = {
      nombre: editForm.nombre.trim(),
      modalidad: editForm.modalidad,
      duracion: editForm.duracion,
      profesor: editForm.profesor,
      descripcion: editForm.descripcion,
      requisitos: editForm.requisitos,
    };

    try {
      if (USE_MOCK) {
        // ✅ UPDATE EN MEMORIA
        setProgramas((prev) =>
          prev.map((p) => (p.id === selected.id ? { ...p, ...payload } : p))
        );
        closeEditar();
      } else {
        await updatePrograma(selected.id, payload);
        await reloadProgramas();
        closeEditar();
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Programa actualizado",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo actualizar",
        text: err?.response?.data?.detail || "Error guardando cambios.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  // ====== DELETE ======
  const eliminarPrograma = (p) => {
    Swal.fire({
      title: "¿Eliminar programa?",
      text: `Se eliminará "${p.nombre}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        if (USE_MOCK) {
          // ✅ DELETE EN MEMORIA
          setProgramas((prev) => prev.filter((x) => x.id !== p.id));
        } else {
          await deletePrograma(p.id);
          await reloadProgramas();
        }

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Programa eliminado",
          showConfirmButton: false,
          timer: 1600,
          timerProgressBar: true,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "No se pudo eliminar",
          text: err?.response?.data?.detail || "Error eliminando programa.",
          confirmButtonColor: "#2563eb",
        });
      }
    });
  };

  return (
    <div className="pp-wrap">
      {/* Header */}
      <div className="pp-head">
        <div>
          <h2>Programas y Profesores</h2>
          <p>Administra las carreras y los profesores encargados de los egresados.</p>
        </div>

        <button
          className="pp-btn-primary"
          type="button"
          onClick={() => setShowNuevo(true)}
          disabled={loading}
        >
          + Nuevo Programa
        </button>
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ padding: 12 }}>Cargando...</div>
      ) : (
        <div className="pp-grid">
          {programas.map((p) => (
            <div key={p.id} className="pp-card">
              <div className="pp-cardTop">
                <div className="pp-ico">🎓</div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="pp-gear"
                    type="button"
                    title="Editar"
                    onClick={() => openEditar(p)}
                  >
                    ⚙️
                  </button>
                  <button
                    className="pp-gear"
                    type="button"
                    title="Eliminar"
                    onClick={() => eliminarPrograma(p)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="pp-title">{p.nombre}</div>
              <div className="pp-desc">{p.descripcion}</div>

              <div className="pp-profBox">
                <div className="pp-profLeft">
                  <div className="pp-profIco">👤</div>
                  <div>
                    <div className="pp-profLabel">PROFESOR ASIGNADO</div>
                    <div className="pp-profName">{p.profesor}</div>
                  </div>
                </div>
              </div>

              <div className="pp-bottomRow">
                <div className="pp-egLabel">Egresados Registrados</div>
                <div className="pp-egNum">{p.egresados}</div>
              </div>

              <div className="pp-actions">
                <button type="button" className="pp-btn-dark" onClick={() => abrirIngresar(p)}>
                  Ingresar Egresado
                </button>
                <button type="button" className="pp-btn-light" onClick={() => abrirInfo(p)}>
                  Info Profesor
                </button>
              </div>
            </div>
          ))}

          {!programas.length ? (
            <div style={{ padding: 12 }}>No hay programas registrados.</div>
          ) : null}
        </div>
      )}

      {/* MODAL: Nuevo Programa */}
      <Modal
        isOpen={showNuevo}
        onClose={() => {
          setShowNuevo(false);
          resetForm();
        }}
        title="Nuevo Programa"
      >
        <form className="ppm-form" onSubmit={crearPrograma}>
          <div className="ppm-field">
            <label>NOMBRE DEL PROGRAMA *</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Ingeniería en Computación"
              required
            />
          </div>

          <div className="ppm-field">
            <label>DESCRIPCIÓN</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe brevemente el enfoque del programa..."
              rows={4}
            />
          </div>

          <div className="ppm-grid2">
            <div className="ppm-field">
              <label>PROFESOR ASIGNADO</label>
              <input
                name="profesor"
                value={form.profesor}
                onChange={handleChange}
                placeholder="Ej: Ing. Luis Diego"
              />
            </div>

            <div className="ppm-field">
              <label>EGRESADOS REGISTRADOS</label>
              <input
                name="egresados"
                value={form.egresados}
                onChange={handleChange}
                placeholder="Ej: 0"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="ppm-actions">
            <button
              type="button"
              className="ppm-cancel"
              onClick={() => {
                setShowNuevo(false);
                resetForm();
              }}
            >
              Cancelar
            </button>

            <button type="submit" className="ppm-submit">
              Guardar
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Info Profesor */}
      <Modal
        isOpen={showInfo}
        onClose={() => {
          setShowInfo(false);
          setSelected(null);
        }}
        title="Información del Profesor"
      >
        {!selected ? null : (
          <div className="ppi-wrap">
            <div className="ppi-head">
              <div className="ppi-avatar">👤</div>
              <div>
                <div className="ppi-name">{selected.profesor}</div>
                <div className="ppi-sub">{selected.nombre}</div>
              </div>
            </div>

            <div className="ppi-card">
              <div className="ppi-label">CONTACTO (MOCK)</div>
              <div className="ppi-line">✉️ profesor@institucion.ac.cr</div>
              <div className="ppi-line">📞 2222-3333</div>
            </div>

            <div className="ppi-card">
              <div className="ppi-label">EGRESADOS ASIGNADOS</div>
              <div className="ppi-big">{selected.egresados}</div>
            </div>

            <button className="ppi-btn" type="button">
              Contactar Profesor
            </button>
          </div>
        )}
      </Modal>

      {/* MODAL: Ingresar Egresado (mock) */}
      <Modal
        isOpen={showIngresar}
        onClose={() => {
          setShowIngresar(false);
          setSelected(null);
        }}
        title="Ingresar Egresado"
      >
        {!selected ? null : (
          <div className="ppx-wrap">
            <div className="ppx-top">
              <div className="ppx-tag">Programa</div>
              <div className="ppx-prog">{selected.nombre}</div>
            </div>

            <div className="ppx-note">
              ✅ Por ahora es mock. Luego aquí conectamos con tu “Cargar Egresados (Excel)” o registro manual.
            </div>

            <button className="ppx-btn" type="button">
              Abrir Cargar Egresados (Excel)
            </button>
          </div>
        )}
      </Modal>

      {/* MODAL: Editar Programa */}
      <Modal isOpen={showEditar} onClose={closeEditar} title="Editar Programa">
        <form className="pe-form" onSubmit={saveEditar}>
          <div className="pe-grid2">
            <div className="pe-field">
              <label>NOMBRE DEL PROGRAMA</label>
              <input
                name="nombre"
                value={editForm.nombre}
                onChange={onEditChange}
                placeholder="Ej: Ingeniería en Computación"
                required
              />
            </div>

            <div className="pe-field">
              <label>MODALIDAD</label>
              <select name="modalidad" value={editForm.modalidad} onChange={onEditChange}>
                <option value="Presencial">Presencial</option>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>

            <div className="pe-field">
              <label>DURACIÓN</label>
              <input
                name="duracion"
                value={editForm.duracion}
                onChange={onEditChange}
                placeholder="Ej: 4 años"
              />
            </div>

            <div className="pe-field">
              <label>PROFESOR ENCARGADO</label>
              <input
                name="profesor"
                value={editForm.profesor}
                onChange={onEditChange}
                placeholder="Ej: Dra. Elena Rodríguez"
              />
            </div>
          </div>

          <div className="pe-field">
            <label>DESCRIPCIÓN</label>
            <textarea
              name="descripcion"
              value={editForm.descripcion}
              onChange={onEditChange}
              rows={3}
              placeholder="Describe el programa..."
            />
          </div>

          <div className="pe-field">
            <label>REQUISITOS DE INGRESO</label>
            <textarea
              name="requisitos"
              value={editForm.requisitos}
              onChange={onEditChange}
              rows={3}
              placeholder="Ej: Bachillerato en Educación Media, PAA..."
            />
          </div>

          <div className="pe-actions">
            <button type="button" className="pe-cancel" onClick={closeEditar}>
              Cancelar
            </button>
            <button type="submit" className="pe-save">
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}