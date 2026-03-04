import React, { useEffect, useMemo, useState } from "react";
import Modal from "../modal/Modal";
import "./Pasantias.css";

export default function Pasantias() {
  const [tab, setTab] = useState("recibidas");
  const [loading, setLoading] = useState(true);

  // Modal 1: Solicitar Pasantes
  const [showSolicitar, setShowSolicitar] = useState(false);
  const [solForm, setSolForm] = useState({
    institucion: "todas",
    carrera: "",
    cantidad: "",
    duracion: "",
    correo: "",
    telefono: "",
    mensaje: "",
  });

  // Modal 2: Ver Postulación (detalle)
  const [showDetalle, setShowDetalle] = useState(false);
  const [selected, setSelected] = useState(null);

  const [recibidas, setRecibidas] = useState([]);
  const [enviadas, setEnviadas] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        /* datos quemados */
        const mockData = {
          recibidas: [
            {
              id: 1,
              sigla: "T",
              institucion: "TEC",
              cantidad: 5,
              area: "Ing. Electrónica",
              encargado: "Ing. Luis Diego",
              estado: "PENDIENTE",
              email: "ldiego@tec.ac.cr",
              mensaje:
                "“Postulamos a nuestros mejores estudiantes de último año para el área de diseño.”",
              archivo: "Expedientes_Estudiantes.pdf",
            },
            {
              id: 2,
              sigla: "C",
              institucion: "CUC",
              cantidad: 3,
              area: "Electrónica",
              encargado: "MSc. Jorge Castro",
              estado: "REVISADO",
              email: "jcastro@cuc.ac.cr",
              mensaje:
                "“Tenemos disponibilidad de estudiantes para prácticas supervisadas.”",
              archivo: "Lista_Estudiantes_CUC.pdf",
            },
          ],
          enviadas: [
            {
              id: 3,
              sigla: "U",
              institucion: "UAM",
              cantidad: 2,
              area: "Ing. Sistemas",
              encargado: "Lic. Ana Salas",
              estado: "PENDIENTE",
              email: "asalas@uam.ac.cr",
              mensaje:
                "“Solicitud enviada para estudiantes con base en desarrollo web.”",
              archivo: "Solicitud_UAM.pdf",
            },
          ],
        };

        setRecibidas(mockData.recibidas);
        setEnviadas(mockData.enviadas);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const current = useMemo(() => {
    return tab === "recibidas" ? recibidas : enviadas;
  }, [tab, recibidas, enviadas]);

  const handleSolChange = (e) => {
    setSolForm({ ...solForm, [e.target.name]: e.target.value });
  };

  const handleEnviarSolicitud = (e) => {
    e.preventDefault();

    // ✅ MOCK: aquí solo mostramos por consola (luego API)
    console.log("Solicitud enviada (mock):", solForm);

    // 🚀 API FUTURA (cuando exista):
    // await pasantiasService.enviarSolicitud(solForm);

    setShowSolicitar(false);
    setSolForm({
      institucion: "todas",
      carrera: "",
      cantidad: "",
      duracion: "",
      correo: "",
      telefono: "",
      mensaje: "",
    });
  };

  return (
    <div className="dash-wrap">
      {/* Header */}
      <div className="dash-head">
        <div>
          <h2>Gestión de Pasantías Institucionales</h2>
          <p>Administra las postulaciones de instituciones y solicitudes de pasantes.</p>
        </div>

        {/* ✅ ESTE abre "Solicitar Pasantes" */}
        <button
          className="dash-btn-primary"
          type="button"
          onClick={() => setShowSolicitar(true)}
        >
          <span className="dash-btn-icon">👤</span>
          Solicitar Pasantes
        </button>
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        <button
          type="button"
          className={`dash-tab ${tab === "recibidas" ? "active" : ""}`}
          onClick={() => setTab("recibidas")}
        >
          Postulaciones Recibidas
          <span className="dash-pill">{recibidas.length}</span>
        </button>

        <button
          type="button"
          className={`dash-tab ${tab === "enviadas" ? "active" : ""}`}
          onClick={() => setTab("enviadas")}
        >
          Mis Solicitudes Enviadas
          <span className="dash-pill">{enviadas.length}</span>
        </button>
      </div>

      {/* Content */}
      <div className="dash-card">
        {loading ? (
          <div className="dash-loading">Cargando...</div>
        ) : current.length === 0 ? (
          <div className="dash-empty">No hay registros todavía.</div>
        ) : (
          <div className="dash-list">
            {current.map((item) => (
              <div key={item.id} className="dash-item">
                <div className="dash-avatar">
                  <span className="dash-avatar-letter">{item.sigla}</span>
                </div>

                <div className="dash-info">
                  <div className="dash-title-row">
                    <h3 className="dash-title">{item.institucion}</h3>
                    <span className={`dash-badge ${String(item.estado).toLowerCase()}`}>
                      {item.estado}
                    </span>
                  </div>

                  <div className="dash-sub">
                    {item.cantidad} estudiantes para {item.area}
                  </div>

                  <div className="dash-meta">Encargado: {item.encargado}</div>
                </div>

                <div className="dash-actions">
                  {/* ✅ ESTE abre "Ver Postulación" */}
                  <button
                    className="dash-btn-dark"
                    type="button"
                    onClick={() => {
                      setSelected(item);
                      setShowDetalle(true);
                    }}
                  >
                    Ver Postulación
                  </button>

                  <button className="dash-btn-iconOnly" type="button" title="Mensaje">
                    ✉️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================
          MODAL 1: SOLICITAR PASANTES
         ========================= */}
      <Modal
        isOpen={showSolicitar}
        onClose={() => setShowSolicitar(false)}
        title="Solicitar Pasantes"
      >
        <form className="sol-form" onSubmit={handleEnviarSolicitud}>
          <div className="sol-group">
            <label>Institución Destino</label>
            <select name="institucion" value={solForm.institucion} onChange={handleSolChange}>
              <option value="todas">Todas las Instituciones</option>
              <option value="TEC">TEC</option>
              <option value="CUC">CUC</option>
              <option value="UAM">UAM</option>
            </select>
          </div>

          <div className="sol-group">
            <label>Carrera de Interés</label>
            <input
              name="carrera"
              placeholder="Ej: Ingeniería en Producción"
              value={solForm.carrera}
              onChange={handleSolChange}
              required
            />
          </div>

          <div className="sol-grid-2">
            <div className="sol-group">
              <label>Cantidad de Estudiantes</label>
              <input
                name="cantidad"
                placeholder="Ej: 2"
                value={solForm.cantidad}
                onChange={handleSolChange}
                required
              />
            </div>

            <div className="sol-group">
              <label>Duración Estimada</label>
              <input
                name="duracion"
                placeholder="Ej: 4 meses"
                value={solForm.duracion}
                onChange={handleSolChange}
                required
              />
            </div>
          </div>

          <div className="sol-grid-2">
            <div className="sol-group">
              <label>Correo del Profesional</label>
              <input
                name="correo"
                placeholder="profesional@empresa.com"
                value={solForm.correo}
                onChange={handleSolChange}
                required
              />
            </div>

            <div className="sol-group">
              <label>Teléfono del Profesional</label>
              <input
                name="telefono"
                placeholder="2222-3333"
                value={solForm.telefono}
                onChange={handleSolChange}
              />
            </div>
          </div>

          <div className="sol-group">
            <label>Mensaje / Requerimientos Especiales</label>
            <textarea
              name="mensaje"
              placeholder="Describe brevemente el proyecto o perfil buscado..."
              value={solForm.mensaje}
              onChange={handleSolChange}
              rows={4}
            />
          </div>

          <div className="sol-actions">
            <button type="button" className="sol-cancel" onClick={() => setShowSolicitar(false)}>
              Cancelar
            </button>
            <button type="submit" className="sol-submit">
              Enviar Solicitud
            </button>
          </div>
        </form>
      </Modal>

      {/* =========================
          MODAL 2: VER POSTULACIÓN
         ========================= */}
      <Modal
        isOpen={showDetalle}
        onClose={() => {
          setShowDetalle(false);
          setSelected(null);
        }}
        title="Detalles de Postulación"
      >
        {!selected ? (
          <div className="dash-empty">No hay postulación seleccionada.</div>
        ) : (
          <div className="detalle-wrap">
            <div className="detalle-head">
              <div className="detalle-avatar">{selected.sigla}</div>
              <div>
                <h3>{selected.institucion}</h3>
                <p>
                  {selected.area} • {selected.cantidad} estudiantes
                </p>
              </div>
            </div>

            <div className="detalle-card">
              <div className="detalle-row">
                <div>
                  <span className="detalle-label">Responsable de la Institución</span>
                  <strong>{selected.encargado}</strong>
                  <p>{selected.email}</p>
                </div>
                <button className="btn-outline" type="button">
                  Contactar Encargado
                </button>
              </div>

              <hr />

              <div>
                <span className="detalle-label">Mensaje de Presentación</span>
                <p className="detalle-msg">{selected.mensaje}</p>
              </div>
            </div>

            <div className="detalle-doc">
              <div className="doc-left">📄 {selected.archivo}</div>
              <button className="doc-download" type="button" title="Descargar">
                ⬇
              </button>
            </div>

            <button className="btn-primary-full" type="button">
              Aceptar Postulación
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}