import React, { useMemo, useState } from "react";
import "./GestionUsuario.css";
import Modal from "../modal/Modal"; // ajusta ruta si aplica

export default function GestionUsuarios() {
  const [showNuevo, setShowNuevo] = useState(false);
  const [showEditar, setShowEditar] = useState(false);

  // ELIMINAR (modal confirmación)
  const [showEliminar, setShowEliminar] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Admin Principal",
      correo: "admin@zfi.com",
      rol: "ADMINISTRADOR",
      fecha: "01/01/2024",
    },
    {
      id: 2,
      nombre: "Laura Reclutadora",
      correo: "laura@zfi.com",
      rol: "RECLUTADOR",
      fecha: "15/02/2024",
    },
    {
      id: 3,
      nombre: "Pedro RRHH",
      correo: "pedro@zfi.com",
      rol: "RECLUTADOR",
      fecha: "10/03/2024",
    },
  ]);

  const [formNuevo, setFormNuevo] = useState({
    nombre: "",
    correo: "",
    rol: "Reclutador",
    passTemp: "",
  });

  const [formEditar, setFormEditar] = useState({
    id: null,
    nombre: "",
    correo: "",
    rol: "Reclutador",
  });

  const [errorNuevo, setErrorNuevo] = useState("");
  const [errorEditar, setErrorEditar] = useState("");

  const nextId = useMemo(() => {
    return (usuarios.reduce((max, u) => Math.max(max, u.id), 0) || 0) + 1;
  }, [usuarios]);

  const normalizeRol = (rol) => {
    const r = (rol || "").toLowerCase();
    if (r.includes("admin")) return "ADMINISTRADOR";
    if (r.includes("rrhh")) return "RRHH";
    return "RECLUTADOR";
  };

  const rolToUi = (rolDB) => {
    if (rolDB === "ADMINISTRADOR") return "Administrador";
    if (rolDB === "RRHH") return "RRHH";
    return "Reclutador";
  };

  const emailOk = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  // --------------------------
  // NUEVO USUARIO
  // --------------------------
  const onChangeNuevo = (key) => (e) => {
    setErrorNuevo("");
    setFormNuevo((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const closeNuevo = () => {
    setShowNuevo(false);
    setErrorNuevo("");
    setFormNuevo({ nombre: "", correo: "", rol: "Reclutador", passTemp: "" });
  };

  const submitNuevo = (e) => {
    e.preventDefault();

    const nombre = formNuevo.nombre.trim();
    const correo = formNuevo.correo.trim();
    const passTemp = formNuevo.passTemp.trim();

    if (!nombre || !correo || !passTemp) {
      setErrorNuevo("Completa nombre, correo y contraseña temporal.");
      return;
    }
    if (!emailOk(correo)) {
      setErrorNuevo("El correo no tiene un formato válido.");
      return;
    }

    const exists = usuarios.some((u) => u.correo.toLowerCase() === correo.toLowerCase());
    if (exists) {
      setErrorNuevo("Ya existe un usuario con ese correo.");
      return;
    }

    const fechaHoy = new Date().toLocaleDateString("es-CR");

    const nuevo = {
      id: nextId,
      nombre,
      correo,
      rol: normalizeRol(formNuevo.rol),
      fecha: fechaHoy,
    };

    setUsuarios((prev) => [nuevo, ...prev]);
    closeNuevo();
  };

  // --------------------------
  // EDITAR USUARIO
  // --------------------------
  const openEditar = (u) => {
    setErrorEditar("");
    setFormEditar({
      id: u.id,
      nombre: u.nombre,
      correo: u.correo,
      rol: rolToUi(u.rol),
    });
    setShowEditar(true);
  };

  const onChangeEditar = (key) => (e) => {
    setErrorEditar("");
    setFormEditar((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const closeEditar = () => {
    setShowEditar(false);
    setErrorEditar("");
    setFormEditar({ id: null, nombre: "", correo: "", rol: "Reclutador" });
  };

  const submitEditar = (e) => {
    e.preventDefault();

    const nombre = formEditar.nombre.trim();
    const correo = formEditar.correo.trim();

    if (!nombre || !correo) {
      setErrorEditar("Completa nombre y correo.");
      return;
    }
    if (!emailOk(correo)) {
      setErrorEditar("El correo no tiene un formato válido.");
      return;
    }

    const exists = usuarios.some(
      (u) => u.id !== formEditar.id && u.correo.toLowerCase() === correo.toLowerCase()
    );
    if (exists) {
      setErrorEditar("Ya existe otro usuario con ese correo.");
      return;
    }

    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === formEditar.id
          ? { ...u, nombre, correo, rol: normalizeRol(formEditar.rol) }
          : u
      )
    );

    closeEditar();
  };

  // --------------------------
  // ELIMINAR USUARIO (FUERA DE submitEditar ✅)
  // --------------------------
  const openEliminar = (u) => {
    setToDelete(u);
    setShowEliminar(true);
  };

  const closeEliminar = () => {
    setShowEliminar(false);
    setToDelete(null);
  };

  const confirmEliminar = () => {
    if (!toDelete) return;

    setUsuarios((prev) => prev.filter((u) => u.id !== toDelete.id));
    closeEliminar();
  };

  return (
    <div className="gu-wrap">
      <div className="gu-header">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p>Administra los accesos y roles de tu equipo en la plataforma.</p>
        </div>

        <button className="gu-btn" type="button" onClick={() => setShowNuevo(true)}>
          ➕ Nuevo Usuario
        </button>
      </div>

      <div className="gu-card">
        <div className="gu-table-head">
          <span>USUARIO</span>
          <span>ROL</span>
          <span>FECHA DE CREACIÓN</span>
          <span>ACCIONES</span>
        </div>

        {usuarios.map((u) => (
          <div key={u.id} className="gu-row">
            <div className="gu-user">
              <div className="gu-avatar">{u.nombre.charAt(0)}</div>
              <div>
                <div className="gu-name">{u.nombre}</div>
                <div className="gu-mail">{u.correo}</div>
              </div>
            </div>

            <div className={`gu-role ${u.rol === "ADMINISTRADOR" ? "admin" : ""}`}>
              {u.rol}
            </div>

            <div className="gu-date">{u.fecha}</div>

            {/* ✅ BOTONES JUNTOS (como pediste) */}
            <div className="gu-actions">
              <button type="button" title="Editar" onClick={() => openEditar(u)}>
                ✏️
              </button>
              <button type="button" title="Eliminar" onClick={() => openEliminar(u)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL NUEVO USUARIO */}
      <Modal isOpen={showNuevo} onClose={closeNuevo} title="Nuevo Usuario">
        <form className="nu-form" onSubmit={submitNuevo}>
          <div className="nu-field">
            <label>NOMBRE COMPLETO</label>
            <input
              value={formNuevo.nombre}
              onChange={onChangeNuevo("nombre")}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="nu-field">
            <label>CORREO ELECTRÓNICO</label>
            <input
              value={formNuevo.correo}
              onChange={onChangeNuevo("correo")}
              placeholder="usuario@empresa.com"
              type="email"
            />
          </div>

          <div className="nu-field">
            <label>ROL DE USUARIO</label>
            <div className="nu-select">
              <select value={formNuevo.rol} onChange={onChangeNuevo("rol")}>
                <option>Administrador</option>
                <option>Reclutador</option>
                <option>RRHH</option>
              </select>
              <span className="nu-caret">▾</span>
            </div>
          </div>

          <div className="nu-field">
            <label>CONTRASEÑA TEMPORAL</label>
            <div className="nu-pass">
              <span className="nu-lock">🔒</span>
              <input
                value={formNuevo.passTemp}
                onChange={onChangeNuevo("passTemp")}
                placeholder="••••••••"
                type="password"
              />
            </div>
          </div>

          {errorNuevo ? <div className="nu-error">{errorNuevo}</div> : null}

          <div className="nu-actions">
            <button type="button" className="nu-cancel" onClick={closeNuevo}>
              Cancelar
            </button>
            <button type="submit" className="nu-submit">
              Crear Usuario
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL EDITAR USUARIO */}
      <Modal isOpen={showEditar} onClose={closeEditar} title="Editar Usuario">
        <form className="nu-form" onSubmit={submitEditar}>
          <div className="nu-field">
            <label>NOMBRE COMPLETO</label>
            <input
              value={formEditar.nombre}
              onChange={onChangeEditar("nombre")}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="nu-field">
            <label>CORREO ELECTRÓNICO</label>
            <input
              value={formEditar.correo}
              onChange={onChangeEditar("correo")}
              placeholder="usuario@empresa.com"
              type="email"
            />
          </div>

          <div className="nu-field">
            <label>ROL DE USUARIO</label>
            <div className="nu-select">
              <select value={formEditar.rol} onChange={onChangeEditar("rol")}>
                <option>Administrador</option>
                <option>Reclutador</option>
                <option>RRHH</option>
              </select>
              <span className="nu-caret">▾</span>
            </div>
          </div>

          {errorEditar ? <div className="nu-error">{errorEditar}</div> : null}

          <div className="nu-actions">
            <button type="button" className="nu-cancel" onClick={closeEditar}>
              Cancelar
            </button>
            <button type="submit" className="nu-submit">
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL CONFIRMAR ELIMINAR */}
      <Modal isOpen={showEliminar} onClose={closeEliminar} title="Eliminar Usuario">
        {!toDelete ? null : (
          <div className="del-wrap">
            <p className="del-text">
              ¿Seguro que deseas eliminar a <strong>{toDelete.nombre}</strong>?
              <br />
              <span className="del-sub">Esta acción no se puede deshacer.</span>
            </p>

            <div className="del-actions">
              <button type="button" className="nu-cancel" onClick={closeEliminar}>
                Cancelar
              </button>
              <button type="button" className="del-danger" onClick={confirmEliminar}>
                Eliminar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}