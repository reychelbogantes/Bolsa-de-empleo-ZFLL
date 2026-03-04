// UsuariosInsti.jsx
import React, { useMemo, useState } from "react";
import "./UsuariosInsti.css";
import Modal from "../modal/Modal"; // ajusta la ruta si tu Modal está en otro lado

export default function UsuariosInsti() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);

  // 🔥 DATOS QUEMADOS (MOCK)
  const usuarios = [
    {
      id: 1,
      nombre: "María",
      apellido: "González",
      username: "maria.gonzalez",
      email: "maria.gonzalez@tec.ac.cr",
      telefono: "+506 8888 1001",
      rol: "ADMIN_INSTITUCION",
      institucion: { id: 1, nombre: "TEC" },
      estado: "ACTIVO",
      creado_en: "2025-10-12",
      ultimo_acceso: "2026-03-02 08:21",
    },
    {
      id: 2,
      nombre: "Juan",
      apellido: "Pérez",
      username: "juan.perez",
      email: "juan.perez@tec.ac.cr",
      telefono: "+506 8888 1002",
      rol: "GESTOR_CARRERAS",
      institucion: { id: 1, nombre: "TEC" },
      estado: "ACTIVO",
      creado_en: "2025-11-05",
      ultimo_acceso: "2026-03-01 19:10",
    },
    {
      id: 3,
      nombre: "Karla",
      apellido: "Rojas",
      username: "karla.rojas",
      email: "karla.rojas@uam.ac.cr",
      telefono: "+506 8888 2003",
      rol: "COORDINADOR_PRACTICA",
      institucion: { id: 2, nombre: "UAM" },
      estado: "SUSPENDIDO",
      creado_en: "2025-09-22",
      ultimo_acceso: "2026-02-20 14:02",
    },
    {
      id: 4,
      nombre: "Esteban",
      apellido: "Araya",
      username: "esteban.araya",
      email: "esteban.araya@ina.ac.cr",
      telefono: "+506 8888 3004",
      rol: "LECTOR",
      institucion: { id: 3, nombre: "INA" },
      estado: "ACTIVO",
      creado_en: "2026-01-10",
      ultimo_acceso: "2026-03-03 09:45",
    },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return usuarios;

    return usuarios.filter((u) => {
      const full = `${u.nombre} ${u.apellido}`.toLowerCase();
      return (
        full.includes(q) ||
        (u.username || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.rol || "").toLowerCase().includes(q) ||
        (u.institucion?.nombre || "").toLowerCase().includes(q) ||
        (u.estado || "").toLowerCase().includes(q)
      );
    });
  }, [search]);

  const openDetalle = (u) => {
    setSelected(u);
    setShowDetalle(true);
  };

  const closeDetalle = () => {
    setShowDetalle(false);
    setSelected(null);
  };

  return (
    <div className="ui-container">
      <div className="ui-header">
        <div>
          <h2 className="ui-title">Usuarios de Institución</h2>
          <p className="ui-subtitle">
            Lista de usuarios vinculados a instituciones (datos quemados).
          </p>
        </div>

        <div className="ui-actions">
          <input
            className="ui-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email, rol, institución..."
          />
        </div>
      </div>

      <div className="ui-card">
        <div className="ui-tableWrap">
          <table className="ui-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Institución</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Último acceso</th>
                <th className="ui-thActions">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="ui-empty">
                    No hay resultados con ese filtro.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>
                      <div className="ui-userCell">
                        <div className="ui-userName">
                          {u.nombre} {u.apellido}
                        </div>
                        <div className="ui-userMeta">@{u.username}</div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      {u.institucion?.nombre}{" "}
                      <span className="ui-muted">#{u.institucion?.id}</span>
                    </td>
                    <td>
                      <span className="ui-badge">{u.rol}</span>
                    </td>
                    <td>
                      <span
                        className={
                          "ui-pill " +
                          (u.estado === "ACTIVO" ? "ui-pillOk" : "ui-pillWarn")
                        }
                      >
                        {u.estado}
                      </span>
                    </td>
                    <td>{u.ultimo_acceso || "-"}</td>
                    <td className="ui-tdActions">
                      <button
                        className="ui-btn ui-btnGhost"
                        onClick={() => openDetalle(u)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="ui-footer">
          <span className="ui-muted">
            Mostrando <b>{filtered.length}</b> de <b>{usuarios.length}</b>
          </span>
        </div>
      </div>

      {/* ===== MODAL DETALLE ===== */}
      <Modal
        isOpen={showDetalle}
        onClose={closeDetalle}
        title="Detalle del usuario"
      >
        {!selected ? null : (
          <div className="ui-modalGrid">
            <div className="ui-field">
              <div className="ui-label">Nombre completo</div>
              <div className="ui-value">
                {selected.nombre} {selected.apellido}
              </div>
            </div>

            <div className="ui-field">
              <div className="ui-label">Username</div>
              <div className="ui-value">@{selected.username}</div>
            </div>

            <div className="ui-field">
              <div className="ui-label">Email</div>
              <div className="ui-value">{selected.email}</div>
            </div>

            <div className="ui-field">
              <div className="ui-label">Teléfono</div>
              <div className="ui-value">{selected.telefono}</div>
            </div>

            <div className="ui-field">
              <div className="ui-label">Institución</div>
              <div className="ui-value">
                {selected.institucion?.nombre} (ID: {selected.institucion?.id})
              </div>
            </div>

            <div className="ui-field">
              <div className="ui-label">Rol</div>
              <div className="ui-value">{selected.rol}</div>
            </div>

            <div className="ui-field">
              <div className="ui-label">Estado</div>
              <div className="ui-value">{selected.estado}</div>
            </div>

            <div className="ui-field">
              <div className="ui-label">Creado en</div>
              <div className="ui-value">{selected.creado_en}</div>
            </div>

            <div className="ui-field">
              <div className="ui-label">Último acceso</div>
              <div className="ui-value">{selected.ultimo_acceso || "-"}</div>
            </div>

            <div className="ui-modalActions">
              <button className="ui-btn" onClick={closeDetalle}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}