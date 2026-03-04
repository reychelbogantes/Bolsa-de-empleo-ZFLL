import React, { useEffect, useState } from "react";
import Modal from "../modal/Modal";
import "./InformacionInstitucional.css";
import Swal from "sweetalert2";

import { getMe } from "../../../Services/accountsService";
import { getInstitutions, updateInstitution } from "../../../Services/instintuciones/institutionsService";

export default function InformacionInstitucional() {
  const [showEditar, setShowEditar] = useState(false);
  const [loading, setLoading] = useState(true);

  const [institutionId, setInstitutionId] = useState(null);

  const [data, setData] = useState({
    nombre: "",
    cedula: "",
    ubicacion: "",
    telefono: "",
    descripcion: "",
    verificada: false,
    activa: false,
  });

  const [form, setForm] = useState(data);

  // mapper tolerante (por si backend usa otros nombres)
  const mapInst = (inst) => ({
    id: inst.id,
    nombre: inst.nombre ?? inst.name ?? "",
    cedula: inst.cedula_juridica ?? inst.cedula ?? inst.identificacion ?? "",
    ubicacion: inst.ubicacion ?? inst.location ?? inst.direccion ?? "",
    telefono: inst.telefono ?? inst.phone ?? "",
    descripcion: inst.descripcion ?? inst.description ?? "",
    verificada: !!(inst.verificada ?? inst.is_verified ?? inst.verified),
    activa: !!(inst.activa ?? inst.is_active ?? inst.active),
    _raw: inst,
  });

  const toPayload = (f) => ({
    // ajusta estos nombres si tu serializer usa otros campos
    nombre: f.nombre,
    cedula_juridica: f.cedula, // si en tu backend el campo se llama "cedula_juridica"
    ubicacion: f.ubicacion,
    telefono: f.telefono,
    descripcion: f.descripcion,
  });

  const loadInstitution = async () => {
    const me = await getMe();
    const email = me?.data?.email;

    const list = await getInstitutions();

    // en tu backend InstitucionSerializer suele traer usuario_email (según lo que venías usando)
    const inst = list.find((x) => x.usuario_email === email) || list[0];

    if (!inst?.id) {
      setInstitutionId(null);
      setData({
        nombre: "",
        cedula: "",
        ubicacion: "",
        telefono: "",
        descripcion: "",
        verificada: false,
        activa: false,
      });
      return;
    }

    setInstitutionId(inst.id);
    const mapped = mapInst(inst);
    setData(mapped);
    setForm(mapped);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await loadInstitution();
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "No se pudo cargar la institución",
          text: err?.response?.data?.detail || "Revisa backend / token.",
          confirmButtonColor: "#2563eb",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const saveChanges = async (e) => {
    e.preventDefault();

    if (!institutionId) {
      Swal.fire({
        icon: "error",
        title: "Sin institución",
        text: "No se pudo detectar tu institución.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    try {
      await updateInstitution(institutionId, toPayload(form));
      await loadInstitution(); // recarga desde API

      setShowEditar(false);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Cambios guardados",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: err?.response?.data?.detail || "Error actualizando institución.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  return (
    <div className="ii-wrap">
      <div className="ii-head">
        <div>
          <h2>Información Institucional</h2>
          <p>Gestiona los datos de tu institución y los usuarios administrativos.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 12 }}>Cargando...</div>
      ) : (
        <div className="ii-grid">
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
                disabled={!institutionId}
                title={!institutionId ? "No se detectó institución" : ""}
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
      )}

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