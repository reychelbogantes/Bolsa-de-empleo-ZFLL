import React, { useState } from "react";
import Modal from "../modal/Modal";
import "./InformacionInstitucional.css";
import Swal from "sweetalert2";

// ✅ DATOS QUEMADOS (MOCK)
const MOCK_INSTITUCION_INFO = {
  nombre: "Instituto Tecnológico de Costa Rica",
  cedula: "4-000-042134",
  ubicacion: "Cartago, Costa Rica",
  telefono: "2550-2111",
  descripcion:
    "Institución autónoma de educación superior universitaria, dedicada a la docencia, la investigación y la extensión de la tecnología y las ciencias conexas.",
  verificada: true,
  activa: true,
};

export default function InformacionInstitucional() {
  const [showEditar, setShowEditar] = useState(false);

  // ✅ En mock no ocupamos loading
  const [data, setData] = useState(MOCK_INSTITUCION_INFO);
  const [form, setForm] = useState(MOCK_INSTITUCION_INFO);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const saveChanges = async (e) => {
    e.preventDefault();

    // ✅ MOCK: guardar local (luego aquí iría service)
    setData(form);
    setShowEditar(false);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Cambios guardados (mock)",
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    });
  };

  return (
    <div className="ii-wrap">
      <div className="ii-head">
        <div>
          <h2>Información Institucional</h2>
          <p>Gestiona los datos de tu institución y los usuarios administrativos.</p>
        </div>
      </div>

      <div className="ii-grid">
        {/* Card principal */}
        <div className="ii-card">
          <div className="ii-cardTop">
            <div className="ii-title">
              <span className="ii-icon">🏢</span>
              Datos Generales
            </div>

            <button
              className="ii-btn-edit"
              onClick={() => {
                setForm(data);
                setShowEditar(true);
              }}
            >
              Editar Información
            </button>
          </div>

          <div className="ii-grid2">
            <div className="ii-field">
              <label>NOMBRE DE LA INSTITUCIÓN</label>
              <div className="ii-input">{data.nombre || "—"}</div>
            </div>

            <div className="ii-field">
              <label>CÉDULA JURÍDICA</label>
              <div className="ii-input">{data.cedula || "—"}</div>
            </div>

            <div className="ii-field">
              <label>UBICACIÓN</label>
              <div className="ii-input">{data.ubicacion || "—"}</div>
            </div>

            <div className="ii-field">
              <label>TELÉFONO</label>
              <div className="ii-input">{data.telefono || "—"}</div>
            </div>
          </div>

          <div className="ii-field full">
            <label>DESCRIPCIÓN INSTITUCIONAL</label>
            <div className="ii-textarea">{data.descripcion || "—"}</div>
          </div>
        </div>

        {/* Estado cuenta */}
        <div className="ii-status">
          <div className="ii-statusTitle">Estado de la Cuenta</div>

          <div className="ii-statusRow">
            <span>Verificación</span>
            <span className={`ii-badge ${data.verificada ? "verified" : ""}`}>
              {data.verificada ? "VERIFICADA" : "PENDIENTE"}
            </span>
          </div>

          <div className="ii-statusRow">
            <span>Estado</span>
            <span className="ii-active">{data.activa ? "Activo" : "Inactivo"}</span>
          </div>

          <div className="ii-divider" />

          <p className="ii-statusText">
            {data.verificada
              ? "Tu cuenta ha sido verificada por el equipo administrativo de ZFLL. Tienes acceso completo a las funciones institucionales."
              : "Tu cuenta aún está en proceso de verificación. Algunas funciones podrían estar limitadas."}
          </p>
        </div>
      </div>

      {/* MODAL EDITAR */}
      <Modal
        isOpen={showEditar}
        onClose={() => setShowEditar(false)}
        title="Editar Información Institucional"
      >
        <form className="ii-form" onSubmit={saveChanges}>
          <div className="ii-grid2">
            <div className="ii-field">
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} />
            </div>

            <div className="ii-field">
              <label>Cédula Jurídica</label>
              <input name="cedula" value={form.cedula} onChange={handleChange} />
            </div>

            <div className="ii-field">
              <label>Ubicación</label>
              <input name="ubicacion" value={form.ubicacion} onChange={handleChange} />
            </div>

            <div className="ii-field">
              <label>Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} />
            </div>
          </div>

          <div className="ii-field full">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="ii-actions">
            <button type="button" className="ii-cancel" onClick={() => setShowEditar(false)}>
              Cancelar
            </button>
            <button type="submit" className="ii-save">
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}