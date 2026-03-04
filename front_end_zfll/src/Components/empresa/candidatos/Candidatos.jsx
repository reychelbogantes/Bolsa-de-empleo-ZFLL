import React, { useEffect, useMemo, useState } from "react";
import Modal from "../modal/Modal";
import "./Candidatos.css";

/**
 * ✅ Version MOCK (sin services)
 * - Datos quemados
 * - Stats calculadas
 * - Modal perfil listo
 * - Botón Buscar Egresados soporta prop opcional: onBuscarEgresados()
 */
export default function Candidatos({ onBuscarEgresados }) {
  const [vacantes, setVacantes] = useState([]);
  const [candidatos, setCandidatos] = useState([]); // "postulaciones" normalizadas para UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterVacante, setFilterVacante] = useState("todas");
  const [search, setSearch] = useState("");

  const [showPerfil, setShowPerfil] = useState(false);
  const [selected, setSelected] = useState(null);

  // ✅ Helpers
  const badgeClass = (estado = "") => {
    const e = String(estado || "").toLowerCase();
    if (e.includes("entrevista")) return "badge entrevista";
    if (e.includes("revisi")) return "badge revision";
    if (e.includes("pend")) return "badge pendiente";
    if (e.includes("nuevo")) return "badge nuevo";
    return "badge nuevo";
  };

  const getVacanteTitulo = (id) =>
    vacantes.find((v) => String(v.id) === String(id))?.titulo || "—";

  // ✅ Cargar MOCK al montar
  useEffect(() => {
    const loadMock = async () => {
      try {
        setLoading(true);
        setError("");

        // ====== VACANTES MOCK (como tus screenshots) ======
        const mockVacantes = [
          { id: 101, titulo: "Ingeniero de Software Senior" },
          { id: 102, titulo: "Técnico en Electromecánica" },
          { id: 103, titulo: "Analista de Datos Jr" },
          { id: 104, titulo: "Pasantía en Logística" },
        ];

        // ====== POSTULACIONES MOCK ======
        const mockPostulaciones = [
          {
            id: 1,
            nombre: "Ana García",
            institucion: "TEC",
            cuando: "Hoy",
            vacanteId: 101,
            match: 95,
            estado: "NUEVO",
            correo: "ana.garcia@email.com",
            telefono: "+506 8888-1111",
            experiencia: "3 años en desarrollo fullstack",
            postulacionTipo: "POSTULACIÓN DIRECTA",
            skillsTecnicas: ["React", "TypeScript", "Node.js", "AWS"],
            skillsBlandas: ["Pensamiento Crítico", "Liderazgo"],
            cvNombre: "CV_Ana_Garcia.pdf",
            cvUrl: null,
          },
          {
            id: 2,
            nombre: "Carlos Ruiz",
            institucion: "INA",
            cuando: "Hoy",
            vacanteId: 102,
            match: 82,
            estado: "NUEVO",
            correo: "carlos.ruiz@email.com",
            telefono: "+506 8777-2211",
            experiencia: "2 años en mantenimiento industrial",
            postulacionTipo: "POSTULACIÓN",
            skillsTecnicas: ["Electromecánica", "Mantenimiento", "Seguridad"],
            skillsBlandas: ["Trabajo en equipo"],
            cvNombre: "CV_Carlos_Ruiz.pdf",
            cvUrl: null,
          },
          {
            id: 3,
            nombre: "Elena Solís",
            institucion: "UCR",
            cuando: "Ayer",
            vacanteId: 103,
            match: 88,
            estado: "EN REVISIÓN",
            correo: "elena.solis@email.com",
            telefono: "+506 8999-0001",
            experiencia: "1 año en BI / SQL",
            postulacionTipo: "POSTULACIÓN",
            skillsTecnicas: ["SQL", "Power BI", "Excel"],
            skillsBlandas: ["Comunicación", "Responsabilidad"],
            cvNombre: "CV_Elena_Solis.pdf",
            cvUrl: null,
          },
          {
            id: 4,
            nombre: "Marco Vargas",
            institucion: "TEC",
            cuando: "Ayer",
            vacanteId: 101,
            match: 75,
            estado: "NUEVO",
            correo: "marco.vargas@email.com",
            telefono: "+506 8444-1010",
            experiencia: "2 años en frontend",
            postulacionTipo: "POSTULACIÓN",
            skillsTecnicas: ["React", "CSS", "APIs"],
            skillsBlandas: ["Adaptabilidad"],
            cvNombre: "CV_Marco_Vargas.pdf",
            cvUrl: null,
          },
          {
            id: 5,
            nombre: "Lucía Rojas",
            institucion: "ULACIT",
            cuando: "Hace 2 días",
            vacanteId: 104,
            match: 91,
            estado: "ENTREVISTA",
            correo: "lucia.rojas@email.com",
            telefono: "+506 8333-3434",
            experiencia: "Práctica previa en operaciones",
            postulacionTipo: "POSTULACIÓN",
            skillsTecnicas: ["Logística", "Inventario", "Excel"],
            skillsBlandas: ["Orden", "Comunicación"],
            cvNombre: "CV_Lucia_Rojas.pdf",
            cvUrl: null,
          },
          {
            id: 6,
            nombre: "Roberto Méndez",
            institucion: "Independiente",
            cuando: "Hoy",
            vacanteId: 101,
            match: 85,
            estado: "NUEVO",
            correo: "roberto.mendez@email.com",
            telefono: "+506 8222-5656",
            experiencia: "3 años en Node/React",
            postulacionTipo: "POSTULACIÓN",
            skillsTecnicas: ["Node.js", "React", "PostgreSQL"],
            skillsBlandas: ["Proactividad"],
            cvNombre: "CV_Roberto_Mendez.pdf",
            cvUrl: null,
          },
        ];

        setVacantes(mockVacantes);
        setCandidatos(mockPostulaciones);
      } catch (e) {
        setError("No se pudieron cargar los candidatos (mock).");
      } finally {
        setLoading(false);
      }
    };

    loadMock();
  }, []);

  // ✅ Stats calculadas (para cards + panel derecho)
  const stats = useMemo(() => {
    const totalVacantes = vacantes.length;
    const totalPostulantes = candidatos.length;

    const enRevision = candidatos.filter((c) =>
      String(c.estado || "").toLowerCase().includes("revisi")
    ).length;

    const entrevista = candidatos.filter((c) =>
      String(c.estado || "").toLowerCase().includes("entrevista")
    ).length;

    const pendientes = candidatos.filter((c) => {
      const e = String(c.estado || "").toLowerCase();
      return e.includes("pend") || e.includes("nuevo");
    }).length;

    const avg =
      totalPostulantes > 0
        ? Math.round(
            candidatos.reduce((acc, c) => acc + (Number(c.match) || 0), 0) /
              totalPostulantes
          )
        : 0;

    // Distribución por institución
    const counts = candidatos.reduce((acc, c) => {
      const key = c.institucion || "—";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const distArr = Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        pct: totalPostulantes ? Math.round((count / totalPostulantes) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalVacantes,
      totalPostulantes,
      enRevision,
      pendientes,
      entrevista,
      matchPromedio: avg,
      distArr,
    };
  }, [vacantes, candidatos]);

  // ✅ Filtros
  const filtered = useMemo(() => {
    const byVacante =
      filterVacante === "todas"
        ? candidatos
        : candidatos.filter((c) => String(c.vacanteId) === String(filterVacante));

    const bySearch = byVacante.filter((c) =>
      (c.nombre || "").toLowerCase().includes(search.toLowerCase())
    );

    return bySearch;
  }, [candidatos, filterVacante, search]);

  // ✅ Acciones MOCK
  const marcarRevisado = () => {
    if (!selected?.id) return;

    setCandidatos((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, estado: "EN REVISIÓN" } : c))
    );
    setSelected((prev) => ({ ...prev, estado: "EN REVISIÓN" }));
    setShowPerfil(false);
  };

  const invitarAEntrevista = () => {
    if (!selected?.id) return;

    setCandidatos((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, estado: "ENTREVISTA" } : c))
    );
    setSelected((prev) => ({ ...prev, estado: "ENTREVISTA" }));
    setShowPerfil(false);
  };

  const descargarCV = () => {
    // mock: como no hay url real, solo mostramos info
    alert("Mock: aquí abrirías el PDF del CV (cuando conectes backend).");
  };

  return (
    <div className="cand-wrap">
      <div className="cand-head">
        <div>
          <h2>Gestión de Candidatos</h2>
          <p>Revisa las postulaciones y selecciona el mejor talento para tu empresa.</p>
          {error ? <p style={{ marginTop: 8, color: "#c0392b" }}>{error}</p> : null}
        </div>

        <button
          className="cand-btn-primary"
          type="button"
          onClick={() => {
            // ✅ si tu PrincipalEmpresa quiere cambiar vista:
            // <Candidatos onBuscarEgresados={() => setActiveView("egresados")} />
            if (typeof onBuscarEgresados === "function") onBuscarEgresados();
          }}
        >
          🎓 Buscar Egresados
        </button>
      </div>

      {/* Cards resumen */}
      <div className="cand-cards">
        <div className="kpi">
          <div className="kpi-icon">🧳</div>
          <div className="kpi-num">{loading ? "—" : stats.totalVacantes}</div>
          <div className="kpi-lbl">VACANTES</div>
        </div>

        <div className="kpi">
          <div className="kpi-icon">👥</div>
          <div className="kpi-num">{loading ? "—" : stats.totalPostulantes}</div>
          <div className="kpi-lbl">POSTULANTES</div>
        </div>

        <div className="kpi">
          <div className="kpi-icon">👁️</div>
          <div className="kpi-num">{loading ? "—" : stats.enRevision}</div>
          <div className="kpi-lbl">EN REVISIÓN</div>
        </div>

        <div className="kpi">
          <div className="kpi-icon">⏱️</div>
          <div className="kpi-num">{loading ? "—" : stats.pendientes}</div>
          <div className="kpi-lbl">PENDIENTES</div>
        </div>

        <div className="kpi">
          <div className="kpi-icon">📅</div>
          <div className="kpi-num">{loading ? "—" : stats.entrevista}</div>
          <div className="kpi-lbl">EN ENTREVISTA</div>
        </div>
      </div>

      {/* Layout 2 columnas */}
      <div className="cand-grid">
        {/* Tabla */}
        <div className="cand-panel">
          <div className="cand-panel-top">
            <h3>Postulantes</h3>

            <select
              className="cand-select"
              value={filterVacante}
              onChange={(e) => setFilterVacante(e.target.value)}
              disabled={loading}
            >
              <option value="todas">Todas las Vacantes</option>
              {vacantes.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.titulo}
                </option>
              ))}
            </select>

            <div className="cand-search">
              <span>🔎</span>
              <input
                placeholder="Buscar candidato..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="cand-table">
            <div className="cand-row cand-headrow">
              <div>CANDIDATO</div>
              <div>VACANTE</div>
              <div>MATCH</div>
              <div>ESTADO</div>
              <div style={{ textAlign: "right" }}>ACCIONES</div>
            </div>

            {loading ? (
              <div className="cand-empty" style={{ padding: 16 }}>
                Cargando candidatos...
              </div>
            ) : filtered.length === 0 ? (
              <div className="cand-empty" style={{ padding: 16 }}>
                No hay candidatos para mostrar.
              </div>
            ) : (
              filtered.map((c) => (
                <div key={c.id} className="cand-row">
                  {/* Candidato */}
                  <div className="cand-person">
                    <div className="avatar">{(c.nombre || "—").slice(0, 1).toUpperCase()}</div>
                    <div className="person-text">
                      <div className="person-name">{c.nombre}</div>
                      <div className="person-sub">
                        {c.institucion} • {c.cuando}
                      </div>
                    </div>
                  </div>

                  {/* Vacante */}
                  <div className="cand-vacante">{getVacanteTitulo(c.vacanteId)}</div>

                  {/* Match */}
                  <div className="cand-match">
                    <div className="match-num">{Number(c.match) || 0}%</div>
                    <div className="match-bar">
                      <div className="match-fill" style={{ width: `${Number(c.match) || 0}%` }} />
                    </div>
                  </div>

                  {/* Estado */}
                  <div>
                    <span className={badgeClass(c.estado)}>{c.estado}</span>
                  </div>

                  {/* Acciones */}
                  <div style={{ textAlign: "right" }}>
                    <button
                      className="btn-more"
                      type="button"
                      onClick={() => {
                        setSelected(c);
                        setShowPerfil(true);
                      }}
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats derecha */}
        <aside className="cand-stats">
          <h3>Estadísticas de Candidatos</h3>

          <div className="stats-box">
            <div className="stats-mini">
              <div className="mini-title">MATCH PROMEDIO</div>
              <div className="mini-value">{loading ? "—" : `${stats.matchPromedio}%`}</div>
              <div className="mini-sub">Calidad de talento</div>
            </div>
          </div>

          <div className="stats-subtitle">DISTRIBUCIÓN POR INSTITUCIÓN</div>

          <div className="dist">
            {(loading ? [] : stats.distArr).map((d) => (
              <div key={d.name} className="dist-row">
                <div className="dist-top">
                  <span className="dist-name">{d.name}</span>
                  <span className="dist-pct">{d.pct}%</span>
                </div>
                <div className="dist-bar">
                  <div className="dist-fill" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}

            {!loading && stats.distArr.length === 0 ? (
              <div className="cand-empty" style={{ padding: 12 }}>
                Sin datos.
              </div>
            ) : null}
          </div>
        </aside>
      </div>

      {/* MODAL PERFIL */}
      <Modal
        isOpen={showPerfil}
        onClose={() => {
          setShowPerfil(false);
          setSelected(null);
        }}
        title="Perfil del Candidato"
      >
        {!selected ? (
          <div className="cand-empty">No hay candidato seleccionado.</div>
        ) : (
          <div className="perfil-wrap">
            {/* Header */}
            <div className="perfil-head">
              <div className="perfil-avatar">{selected.nombre.slice(0, 1).toUpperCase()}</div>

              <div className="perfil-main">
                <h3 className="perfil-name">{selected.nombre}</h3>
                <p className="perfil-sub">
                  {selected.institucion} • {selected.experiencia || "—"}
                </p>

                <div className="perfil-badges">
                  <span className="perfil-pill green">MATCH {Number(selected.match) || 0}%</span>
                  <span className="perfil-pill blue">
                    {selected.postulacionTipo || "POSTULACIÓN DIRECTA"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact + Skills */}
            <div className="perfil-grid">
              <div className="perfil-card">
                <div className="perfil-card-title">INFORMACIÓN DE CONTACTO</div>

                <div className="perfil-contact">
                  <div className="perfil-contact-row">
                    <span className="perfil-ico">✉️</span>
                    <span>{selected.correo || "—"}</span>
                  </div>

                  <div className="perfil-contact-row">
                    <span className="perfil-ico">📞</span>
                    <span>{selected.telefono || "—"}</span>
                  </div>
                </div>
              </div>

              <div className="perfil-card">
                <div className="perfil-card-title">HABILIDADES CLAVE</div>

                <div className="perfil-skill-title">TÉCNICAS / BLANDAS</div>
                <div className="perfil-skill-list">
                  {(selected.skillsTecnicas || []).length ? (
                    selected.skillsTecnicas.map((s) => (
                      <span key={s} className="skill-chip">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="skill-chip soft">—</span>
                  )}
                </div>

                <div className="perfil-skill-title" style={{ marginTop: 12 }}>
                  ⚡ POWER SKILLS
                </div>
                <div className="perfil-skill-list">
                  {(selected.skillsBlandas || []).length ? (
                    selected.skillsBlandas.map((s) => (
                      <span key={s} className="skill-chip soft">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="skill-chip soft">—</span>
                  )}
                </div>
              </div>
            </div>

            {/* CV */}
            <div className="perfil-cv">
              <div className="perfil-cv-title">📄 Currículum Vitae (Vista Previa)</div>

              <div className="perfil-cv-box">
                <div className="perfil-cv-icon">📄</div>
                <div className="perfil-cv-text">{selected.cvNombre || "CV.pdf"}</div>

                <button className="perfil-cv-download" type="button" onClick={descargarCV}>
                  Descargar PDF
                </button>
              </div>
            </div>

            {/* Footer actions */}
            <div className="perfil-actions">
              <button type="button" className="perfil-btn-gray" onClick={marcarRevisado}>
                Marcar como Revisado
              </button>

              <button type="button" className="perfil-btn-primary" onClick={invitarAEntrevista}>
                Invitar a Entrevista
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}