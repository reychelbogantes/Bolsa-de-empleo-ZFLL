import React, { useEffect, useMemo, useState } from "react";
import Modal from "../modal/Modal";
import "./Candidatos.css";

import {
  getVacantes,
  getPostulacionesEmpresa,
  updatePostulacion,
  getCvUrl
} from "../../../Services/Empresa/candidatosService";

export default function Candidatos() {
  const [vacantes, setVacantes] = useState([]);
  const [candidatos, setCandidatos] = useState([]); // aquí guardamos "postulaciones" normalizadas para tu UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterVacante, setFilterVacante] = useState("todas");
  const [search, setSearch] = useState("");
  const [showPerfil, setShowPerfil] = useState(false);
  const [selected, setSelected] = useState(null);


  const getVacanteTitulo = (id) =>
    vacantes.find((v) => String(v.id) === String(id))?.titulo ||
    vacantes.find((v) => String(v.id) === String(id))?.title ||
    "—";

  const mapPostulacionToUI = (p) => {
    return {
      id: p?.id,
      nombre: p?.aspirante_nombre || p?.usuario_email || "—",
      institucion: "—",
      cuando: p?.fecha_postulacion || "—",
      vacanteId: p?.vacante || null,
      match: 0,
      estado: p?.estado_nombre || "NUEVO",
      correo: p?.usuario_email || "—",
      telefono: "—",
      experiencia: "—",
      postulacionTipo: "POSTULACIÓN",
      skillsTecnicas: [],
      skillsBlandas: [],
      cvNombre: "CV.pdf",
      cvUrl: null,
    };
  };


  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [vac, post] = await Promise.all([getVacantes(), getPostulacionesEmpresa()]);
        setVacantes(vac || []);
        setCandidatos((post || []).map(mapPostulacionToUI));
      } catch (e) {
        setError("No se pudieron cargar los candidatos. Revisa el backend o tu token.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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

  const marcarRevisado = async () => {
    if (!selected?.id) return;
    try {
      // aquí deberías mandar estado_actual (ID de catálogo). Por ahora manda texto si tu backend lo permite.
      const updated = await updatePostulacion(selected.id, { estado_actual: null });

      setCandidatos((prev) =>
        prev.map((c) => (c.id === selected.id ? { ...c, estado: updated?.estado_nombre || "EN REVISIÓN" } : c))
      );
      setSelected((prev) => ({ ...prev, estado: updated?.estado_nombre || "EN REVISIÓN" }));
      setShowPerfil(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el estado. Revisa PATCH /api/applications/<id>/." });
    }
  };

  const invitarAEntrevista = async () => {
    if (!selected?.id) return;
    try {
      await updatePostulacion(selected.id, { estado_actual: null });
      Swal.fire({ icon: "success", title: "Listo", text: "Marcado como ENTREVISTA (ajusta estado_actual con ID real)." });
      setShowPerfil(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo cambiar el estado a ENTREVISTA." });
    }
  };

  const descargarCV = async () => {
    if (!selected) return;

    try {
      const url = await getCvUrl(selected.id);
      if (!url) {
        Swal.fire({ icon: "info", title: "Sin CV", text: "No hay CV disponible para este candidato." });
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo obtener el CV. Revisa GET /api/applications/<id>/cv/." });
    }
  };
  return (
    <div className="cand-wrap">
      <div className="cand-head">
        <div>
          <h2>Gestión de Candidatos</h2>
          <p>Revisa las postulaciones y selecciona el mejor talento para tu empresa.</p>
          {error ? <p style={{ marginTop: 8, color: "#c0392b" }}>{error}</p> : null}
        </div>


        <button className="cand-btn-primary" type="button">
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
                  {v.titulo || v.title}
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
                  <span className="perfil-pill blue">{selected.postulacionTipo || "POSTULACIÓN DIRECTA"}</span>
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
                  {(selected.skillsTecnicas || []).map((s) => (
                    <span key={s} className="skill-chip">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="perfil-skill-title" style={{ marginTop: 12 }}>
                  ⚡ POWER SKILLS
                </div>
                <div className="perfil-skill-list">
                  {(selected.skillsBlandas || []).map((s) => (
                    <span key={s} className="skill-chip soft">
                      {s}
                    </span>
                  ))}
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