import React, { useMemo, useState, useEffect } from "react";
import "./UsuariosInsti.css";
import Modal from "../modal/Modal";
import Swal from "sweetalert2";

import {
  getUsuariosInstitucion,
  createUsuarioInstitucion,
  updateUsuarioInstitucion,
  deleteUsuarioInstitucion,
} from "../../../Services/instintuciones/usuariosInstitucionesService";

export default function UsuariosInsti() {
  const [showNuevo, setShowNuevo] = useState(false);
  const [showEditar, setShowEditar] = useState(false);

  const [usuarios, setUsuarios] = useState([]); // ✅ sin quemados
  const [loading, setLoading] = useState(true);

  const [formNuevo, setFormNuevo] = useState({
    nombre: "",
    correo: "",
    rol: "Profesor",
    passTemp: "",
  });

  const [formEditar, setFormEditar] = useState({
    id: null,
    nombre: "",
    correo: "",
    rol: "Profesor",
  });

  // Solo para UI (ya no lo usamos para crear IDs, pero lo dejo por si lo ocupás)
  const nextId = useMemo(() => {
    return (usuarios.reduce((max, u) => Math.max(max, u.id), 0) || 0) + 1;
  }, [usuarios]);

  const emailOk = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const normalizeRol = (rol) => {
    const r = (rol || "").toLowerCase();
    if (r.includes("admin")) return "ADMINISTRADOR";
    if (r.includes("staff")) return "STAFF";
    return "PROFESOR";
  };

  const rolToUi = (rolDB) => {
    if (rolDB === "ADMINISTRADOR") return "Administrador";
    if (rolDB === "STAFF") return "Staff";
    return "Profesor";
  };

  const fmtFecha = (value) => {
    if (!value) return "";
    try {
      return new Date(value).toLocaleDateString("es-CR");
    } catch {
      return String(value);
    }
  };

  const mapUser = (u) => {
    const nombre = u.nombre ?? u.full_name ?? u.name ?? "";
    const correo = u.correo ?? u.email ?? "";
    const rol = normalizeRol(u.rol ?? u.role ?? u.institucion_rol ?? "PROFESOR");
    const fecha = fmtFecha(u.fecha ?? u.created_at ?? u.createdAt ?? "");
    const locked = !!u.locked;

    return { id: u.id, nombre, correo, rol, fecha, locked, _raw: u };
  };

  const reloadUsuarios = async () => {
    const data = await getUsuariosInstitucion();
    const list = Array.isArray(data) ? data : [];
    setUsuarios(list.map(mapUser));
  };

  // ✅ LISTAR al cargar
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await reloadUsuarios();
      } catch (err) {
        setUsuarios([]);
        Swal.fire({
          icon: "error",
          title: "No se pudieron cargar usuarios",
          text: err?.response?.data?.detail || "Revisa el backend o tu token.",
          confirmButtonColor: "#2563eb",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ===== NUEVO =====
  const onChangeNuevo = (key) => (e) =>
    setFormNuevo((p) => ({ ...p, [key]: e.target.value }));

  const closeNuevo = () => {
    setShowNuevo(false);
    setFormNuevo({ nombre: "", correo: "", rol: "Profesor", passTemp: "" });
  };

  const submitNuevo = async (e) => {
    e.preventDefault();

    const nombre = formNuevo.nombre.trim();
    const correo = formNuevo.correo.trim();
    const passTemp = formNuevo.passTemp.trim();

    if (!nombre || !correo || !passTemp) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Completa nombre, correo y contraseña temporal.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    if (!emailOk(correo)) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Revisa el formato del correo.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    const exists = usuarios.some(
      (u) => (u.correo || "").toLowerCase() === correo.toLowerCase()
    );
    if (exists) {
      Swal.fire({
        icon: "error",
        title: "Correo duplicado",
        text: "Ya existe un usuario con ese correo.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    try {
      // ✅ POST backend
      await createUsuarioInstitucion({
        full_name: nombre,
        email: correo,
        password: passTemp,
        rol: formNuevo.rol, // "Profesor" | "Staff" | "Administrador"
      });

      await reloadUsuarios();
      closeNuevo();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Usuario creado",
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo crear",
        text: err?.response?.data?.detail || "Error creando usuario.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  // ===== EDITAR =====
  const openEditar = (u) => {
    setFormEditar({
      id: u.id,
      nombre: u.nombre,
      correo: u.correo,
      rol: rolToUi(u.rol),
    });
    setShowEditar(true);
  };

  const onChangeEditar = (key) => (e) =>
    setFormEditar((p) => ({ ...p, [key]: e.target.value }));

  const closeEditar = () => {
    setShowEditar(false);
    setFormEditar({ id: null, nombre: "", correo: "", rol: "Profesor" });
  };

  const submitEditar = async (e) => {
    e.preventDefault();

    const nombre = formEditar.nombre.trim();
    const correo = formEditar.correo.trim();

    if (!nombre || !correo) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Completa nombre y correo.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (!emailOk(correo)) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Revisa el formato del correo.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    const exists = usuarios.some(
      (u) =>
        u.id !== formEditar.id &&
        (u.correo || "").toLowerCase() === correo.toLowerCase()
    );
    if (exists) {
      Swal.fire({
        icon: "error",
        title: "Correo duplicado",
        text: "Ya existe otro usuario con ese correo.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    try {
      // ✅ PATCH backend
      await updateUsuarioInstitucion(formEditar.id, {
        full_name: nombre,
        email: correo,
        rol: formEditar.rol, // "Profesor" | "Staff" | "Administrador"
      });

      await reloadUsuarios();
      closeEditar();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Cambios guardados",
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: err?.response?.data?.detail || "Error guardando cambios.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  // ===== ELIMINAR =====
  const eliminar = (u) => {
    if (u.locked) return;

    Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${u.nombre}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        await deleteUsuarioInstitucion(u.id);
        await reloadUsuarios();

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Usuario eliminado",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "No se pudo eliminar",
          text: err?.response?.data?.detail || "Error eliminando usuario.",
          confirmButtonColor: "#2563eb",
        });
      }
    });
  };

  return (
    <div className="gui-wrap">
      <div className="gui-head">
        <div>
          <h2>Gestión de Usuarios Institucionales</h2>
          <p>Administra los accesos de profesores y personal administrativo.</p>
        </div>

        <button
          className="gui-btn"
          type="button"
          onClick={() => setShowNuevo(true)}
          disabled={loading}
        >
          ➕ Nuevo Profesor/Staff
        </button>
      </div>

      <div className="gui-card">
        <div className="gui-th">
          <span>USUARIO</span>
          <span>ROL</span>
          <span>FECHA DE CREACIÓN</span>
          <span>ACCIONES</span>
        </div>

        {loading ? (
          <div style={{ padding: 14 }}>Cargando...</div>
        ) : usuarios.length === 0 ? (
          <div style={{ padding: 14 }}>Sin usuarios por mostrar.</div>
        ) : (
          usuarios.map((u) => (
            <div key={u.id} className="gui-tr">
              <div className="gui-user">
                <div className="gui-avatar">{(u.nombre || "U").slice(0, 1)}</div>
                <div className="gui-userText">
                  <div className="gui-name">
                    {u.nombre}
                    {u.locked ? <span className="gui-dot">●</span> : null}
                  </div>
                  <div className="gui-mail">{u.correo}</div>
                </div>
              </div>

              <div className="gui-role">
                <span className={`gui-pill ${u.rol === "ADMINISTRADOR" ? "admin" : ""}`}>
                  {u.rol}
                </span>
              </div>

              <div className="gui-date">{u.fecha}</div>

              <div className="gui-actions">
                {!u.locked ? (
                  <>
                    <button
                      type="button"
                      className="gui-act"
                      title="Editar"
                      onClick={() => openEditar(u)}
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="gui-act"
                      title="Eliminar"
                      onClick={() => eliminar(u)}
                    >
                      🗑️
                    </button>
                  </>
                ) : (
                  <span className="gui-lock">—</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL NUEVO */}
      <Modal isOpen={showNuevo} onClose={closeNuevo} title="Nuevo Profesor/Staff">
        <form className="gui-form" onSubmit={submitNuevo}>
          <div className="gui-field">
            <label>NOMBRE COMPLETO</label>
            <input
              value={formNuevo.nombre}
              onChange={onChangeNuevo("nombre")}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="gui-field">
            <label>CORREO ELECTRÓNICO</label>
            <input
              type="email"
              value={formNuevo.correo}
              onChange={onChangeNuevo("correo")}
              placeholder="usuario@institucion.ac.cr"
            />
          </div>

          <div className="gui-field">
            <label>ROL</label>
            <div className="gui-select">
              <select value={formNuevo.rol} onChange={onChangeNuevo("rol")}>
                <option>Profesor</option>
                <option>Staff</option>
                <option>Administrador</option>
              </select>
              <span className="gui-caret">▾</span>
            </div>
          </div>

          <div className="gui-field">
            <label>CONTRASEÑA TEMPORAL</label>
            <input
              type="password"
              value={formNuevo.passTemp}
              onChange={onChangeNuevo("passTemp")}
              placeholder="••••••••"
            />
          </div>

          <div className="gui-actionsRow">
            <button type="button" className="gui-cancel" onClick={closeNuevo}>
              Cancelar
            </button>
            <button type="submit" className="gui-save">
              Crear Usuario
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL EDITAR */}
      <Modal isOpen={showEditar} onClose={closeEditar} title="Editar Usuario">
        <form className="gui-form" onSubmit={submitEditar}>
          <div className="gui-field">
            <label>NOMBRE COMPLETO</label>
            <input value={formEditar.nombre} onChange={onChangeEditar("nombre")} />
          </div>

          <div className="gui-field">
            <label>CORREO ELECTRÓNICO</label>
            <input type="email" value={formEditar.correo} onChange={onChangeEditar("correo")} />
          </div>

          <div className="gui-field">
            <label>ROL</label>
            <div className="gui-select">
              <select value={formEditar.rol} onChange={onChangeEditar("rol")}>
                <option>Profesor</option>
                <option>Staff</option>
                <option>Administrador</option>
              </select>
              <span className="gui-caret">▾</span>
            </div>
          </div>

          <div className="gui-actionsRow">
            <button type="button" className="gui-cancel" onClick={closeEditar}>
              Cancelar
            </button>
            <button type="submit" className="gui-save">
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}