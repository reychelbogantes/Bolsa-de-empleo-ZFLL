import React, { useEffect, useMemo, useState } from "react";
import "./VacantesDisponibles.css";
import Modal from "../modal/Modal";

import { listVacantes } from "../../../Services/instintuciones/vacantesDisponiblesService";

export default function VacantesDisponibles() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [vacantes, setVacantes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);

  // ===== MODAL RECOMENDAR =====
  const [showRecomendar, setShowRecomendar] = useState(false);
  const [recomText, setRecomText] = useState("");
  const [searchStd, setSearchStd] = useState("");
  const [selectedStdIds, setSelectedStdIds] = useState([]);

  // ✅ MOCK estudiantes (como antes)
  const estudiantes = [
    { id: 1, nombre: "Jimena Alfaro", carrera: "ING. ELECTRÓNICA" },
    { id: 2, nombre: "Daniel Brenes", carrera: "ING. PRODUCCIÓN" },
    { id: 3, nombre: "Sofía Méndez", carrera: "ING. COMPUTACIÓN" },
    { id: 4, nombre: "Ricardo Mora", carrera: "ING. MECATRÓNICA" },
    { id: 5, nombre: "Elena Rojas", carrera: "ING. COMPUTACIÓN", badge: "Ver Perfil" },
    { id: 6, nombre: "Marco Vargas", carrera: "ING. ELECTRÓNICA" },
  ];

  // ✅ MOCK vacantes (como antes)
  const MOCK_VACANTES = [
    {
      id: 1,
      puesto: "Ingeniero de Software Senior",
      empresa: "INTEL",
      area: "TI",
      correo: "jobs@intel.com",
      tipo: "Tiempo Completo",
      modalidad: "Híbrido",
      ubicacion: "Heredia, Costa Rica",
      descripcion:
        "Buscamos un Ingeniero de Software Senior con experiencia en React y Node.js para liderar proyectos críticos.",
      requisitos: ["5+ años de experiencia", "React/Next.js", "Node.js/Express", "Inglés B2+"],
    },
    {
      id: 2,
      puesto: "Técnico en Electromecánica",
      empresa: "BOSTON SCIENTIFIC",
      area: "Mantenimiento",
      correo: "talento@bostonscientific.com",
      tipo: "Tiempo Completo",
      modalidad: "Presencial",
      ubicacion: "Cartago, Costa Rica",
      descripcion:
        "Responsable de mantenimiento preventivo y correctivo en equipos industriales, siguiendo procedimientos y reportes.",
      requisitos: ["Electromecánica", "PLC básico", "Turnos", "Trabajo bajo presión"],
    },
    {
      id: 3,
      puesto: "Analista de Datos Jr",
      empresa: "MICROSOFT",
      area: "BI",
      correo: "jobs@microsoft.com",
      tipo: "Medio Tiempo",
      modalidad: "Remoto",
      ubicacion: "Remoto",
      descripcion:
        "Apoyo en reportes, dashboards y análisis de datos. Limpieza y generación de insights para negocio.",
      requisitos: ["SQL básico", "Excel", "Power BI/Tableau", "Comunicación"],
    },
  ];

  const norm = (s = "") =>
    s
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  // ✅ mapper tolerante por si backend usa otros nombres
  const mapVacante = (v) => {
    const puesto = v.puesto ?? v.title ?? v.titulo ?? v.position ?? "Vacante";
    const empresa =
      v.empresa ??
      v.company ??
      v.company_name ??
      v.empresa_nombre ??
      "Empresa";
    const area = v.area ?? v.category ?? v.departamento ?? "—";
    const correo = v.correo ?? v.email ?? v.contact_email ?? "";
    const tipo = v.tipo ?? v.contract_type ?? v.type ?? "—";
    const modalidad = v.modalidad ?? v.work_mode ?? v.modality ?? "—";
    const ubicacion = v.ubicacion ?? v.location ?? "—";
    const descripcion = v.descripcion ?? v.description ?? "Sin descripción disponible.";

    const reqRaw = v.requisitos ?? v.requirements ?? v.skills ?? [];
    const requisitos = Array.isArray(reqRaw)
      ? reqRaw
      : typeof reqRaw === "string"
        ? reqRaw.split(",").map((x) => x.trim()).filter(Boolean)
        : [];

    return {
      id: v.id ?? Math.random(),
      puesto,
      empresa,
      area,
      correo,
      tipo,
      modalidad,
      ubicacion,
      descripcion,
      requisitos,
      _raw: v,
    };
  };

  // ✅ FETCH real + fallback a mock (como antes)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const data = await listVacantes();
        const list = Array.isArray(data) ? data : [];

        if (list.length) {
          setVacantes(list.map(mapVacante));
        } else {
          setVacantes(MOCK_VACANTES);
        }
      } catch (err) {
        console.error("Error cargando vacantes (fallback mock):", err);
        setVacantes(MOCK_VACANTES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return vacantes;
    const q = norm(search);

    return vacantes.filter((v) =>
      [v.puesto, v.empresa, v.area, v.tipo, v.modalidad, v.ubicacion]
        .map(norm)
        .join(" ")
        .includes(q)
    );
  }, [search, vacantes]);

  const filteredEstudiantes = useMemo(() => {
    const q = norm(searchStd);
    if (!q) return estudiantes;
    return estudiantes.filter((s) =>
      [s.nombre, s.carrera].map(norm).join(" ").includes(q)
    );
  }, [searchStd]);

  const openDetalle = (v) => {
    setSelected(v);
    setShowDetalle(true);
  };

  const closeDetalle = () => {
    setShowDetalle(false);
    setSelected(null);
  };

  const openRecomendar = () => setShowRecomendar(true);

  const closeRecomendar = () => {
    setShowRecomendar(false);
    setRecomText("");
    setSearchStd("");
    setSelectedStdIds([]);
  };

  const toggleStd = (id) => {
    setSelectedStdIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const enviarRecomendacion = () => {
    console.log("Vacante:", selected?._raw || selected);
    console.log("Recomendación:", recomText);
    console.log("Estudiantes:", selectedStdIds);

    closeRecomendar();
    setShowDetalle(false);
    setSelected(null);
  };

  return (
    <div className="vd-wrap">
      <div className="vd-head">
        <h2>Vacantes Disponibles</h2>
        <p>Explora las oportunidades laborales publicadas por las empresas para tus estudiantes.</p>
      </div>

      <div className="vd-card">
        <div className="vd-search">
          <span className="vd-ico">🔎</span>
          <input
            placeholder="Buscar por puesto o empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="vd-loading">Cargando vacantes...</div>
        ) : (
          <div className="vd-grid">
            {filtered.map((v) => (
              <div key={v.id} className="vd-job">
                <div className="vd-top">
                  <div className="vd-avatar">{(v.empresa || "E").slice(0, 1)}</div>

                  <div className="vd-main">
                    <div className="vd-title">{v.puesto}</div>
                    <div className="vd-company">{v.empresa}</div>
                  </div>
                </div>

                <div className="vd-meta">
                  <div className="vd-row">🧾 {v.area} • {v.tipo}</div>
                  <div className="vd-row">📍 {v.modalidad}</div>
                </div>

                <button className="vd-btn" type="button" onClick={() => openDetalle(v)}>
                  Ver Detalles
                </button>
              </div>
            ))}

            {!filtered.length ? (
              <div style={{ padding: 12 }}>No hay vacantes que coincidan con tu búsqueda.</div>
            ) : null}
          </div>
        )}
      </div>

      {/* MODAL DETALLES */}
      <Modal isOpen={showDetalle} onClose={closeDetalle} title="Detalles de la Vacante">
        {!selected ? null : (
          <div className="vdd-wrap">
            <div className="vdd-top">
              <div className="vdd-avatar">{selected.empresa?.slice(0, 1) || "V"}</div>

              <div className="vdd-main">
                <div className="vdd-title">{selected.puesto}</div>
                <div className="vdd-sub">
                  {selected.empresa} • <span className="vdd-dot">{selected.area || "—"}</span>
                </div>

                <a className="vdd-link" href={`mailto:${selected.correo || "rrhh@empresa.com"}`}>
                  {selected.correo || "rrhh@empresa.com"}
                </a>
              </div>
            </div>

            <div className="vdd-meta">
              <div className="vdd-metaItem">
                <div className="vdd-metaLbl">CONTRATO</div>
                <div className="vdd-metaVal">{selected.tipo || "—"}</div>
              </div>

              <div className="vdd-metaItem">
                <div className="vdd-metaLbl">MODALIDAD</div>
                <div className="vdd-metaVal">{selected.modalidad || "—"}</div>
              </div>
            </div>

            <div className="vdd-sec">
              <div className="vdd-secLbl">DESCRIPCIÓN</div>
              <div className="vdd-descBox">{selected.descripcion || "Sin descripción disponible."}</div>
            </div>

            <div className="vdd-sec">
              <div className="vdd-secLbl">REQUISITOS</div>
              <div className="vdd-chips">
                {(selected.requisitos || []).length ? (
                  (selected.requisitos || []).map((r) => (
                    <span key={r} className="vdd-chip">{r}</span>
                  ))
                ) : (
                  <span className="vdd-chip">No especificados</span>
                )}
              </div>
            </div>

            <button className="vdd-cta" type="button" onClick={openRecomendar}>
              Recomendar Estudiantes para esta Vacante
            </button>
          </div>
        )}
      </Modal>

      {/* MODAL RECOMENDAR */}
      <Modal isOpen={showRecomendar} onClose={closeRecomendar} title="Recomendar Estudiantes">
        {!selected ? null : (
          <div className="rec-wrap">
            <div className="rec-subtitle">
              Para la vacante: <strong>{selected.puesto}</strong> en{" "}
              <strong>{selected.empresa}</strong>
            </div>

            <p className="rec-help">
              Selecciona los perfiles de los estudiantes que deseas recomendar y escribe una breve recomendación.
              Se enviará su información de perfil y CV a la empresa.
            </p>

            <div className="rec-label">RECOMENDACIÓN INSTITUCIONAL</div>
            <textarea
              className="rec-textarea"
              value={recomText}
              onChange={(e) => setRecomText(e.target.value)}
              placeholder="Escribe aquí por qué recomiendas a estos estudiantes para esta vacante..."
              rows={4}
            />

            <div className="rec-rowHead">
              <div className="rec-label">SELECCIONAR ESTUDIANTES</div>

              <div className="rec-search">
                <span className="rec-searchIco">🔎</span>
                <input
                  value={searchStd}
                  onChange={(e) => setSearchStd(e.target.value)}
                  placeholder="Buscar por nombre o carrera..."
                />
              </div>
            </div>

            <div className="rec-list">
              {filteredEstudiantes.map((s) => {
                const checked = selectedStdIds.includes(s.id);

                return (
                  <div key={s.id} className="rec-item">
                    <label className="rec-left">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleStd(s.id)}
                      />
                      <div className="rec-info">
                        <div className="rec-name">{s.nombre}</div>
                        <div className="rec-career">{s.carrera}</div>
                      </div>
                    </label>

                    <div className="rec-actions">
                      <button type="button" className="rec-eye" title="Ver">👁️</button>
                      {s.badge ? (
                        <button type="button" className="rec-pill">{s.badge}</button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rec-footer">
              <button type="button" className="rec-cancel" onClick={closeRecomendar}>
                Cancelar
              </button>

              <button
                type="button"
                className={`rec-send ${selectedStdIds.length ? "on" : ""}`}
                disabled={!selectedStdIds.length}
                onClick={enviarRecomendacion}
              >
                Enviar Recomendación
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}