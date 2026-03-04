import React, { useMemo, useState } from "react";
import "./Egresados.css";
import Modal from "../modal/Modal";

export default function Egresados() {
    const [search, setSearch] = useState("");
    const [selectedInst, setSelectedInst] = useState("TEC");
    const [showPerfil, setShowPerfil] = useState(false);
    const [selected, setSelected] = useState(null);
    /* ==========================
       MOCK DATA
    ========================== */
    const instituciones = [
        { id: "TEC", nombre: "Tecnológico de Costa Rica (TEC)", provincia: "Cartago" },
        { id: "CUC", nombre: "CUC Cartago", provincia: "Cartago" },
        { id: "UCR", nombre: "Universidad de Costa Rica", provincia: "Paraíso" },
    ];

    const egresados = [
        {
            id: 1,
            nombre: "Juan Diego Castro",
            institucion: "TEC",
            sede: "Cartago Centro",
            carrera: "Bachillerato en Ingeniería en Computación - TEC",
            skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
            powerSkills: ["Comunicación Asertiva", "Trabajo en Equipo", "Resolución de Problemas"],
            resumen: "Desarrollador apasionado por crear soluciones web eficientes y escalables.",
            correo: "jd.castro@gmail.com",
            telefono: "8888-1111",
            profesor: "Ing. Luis Diego",
            referencia:
                "“Estudiante con alto desempeño académico y gran capacidad de adaptación en entornos tecnológicos.”",
        },
        {
            id: 2,
            nombre: "Jimena Alfaro",
            institucion: "TEC",
            carrera: "Ing. Electrónica - TEC",
            skills: ["Circuitos", "IoT"],
        },
        {
            id: 3,
            nombre: "Daniel Brenes",
            institucion: "TEC",
            carrera: "Ing. Producción - TEC",
            skills: ["Optimización", "Logística"],
        },
    ];

    /* ==========================
       FILTRO
    ========================== */
    // normaliza texto: minúsculas + sin tildes
const norm = (str = "") =>
  str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const q = norm(search);

// Sidebar: instituciones filtradas por búsqueda (nombre / provincia / id)
const filteredInstituciones = useMemo(() => {
  if (!q) return instituciones;

  return instituciones.filter((inst) => {
    const haystack = [
      inst.id,
      inst.nombre,
      inst.provincia,
    ]
      .map(norm)
      .join(" ");

    return haystack.includes(q);
  });
}, [q, instituciones]);

// Resultados: egresados filtrados por institución seleccionada + búsqueda global (nombre/carrera/skills/etc.)
const filtered = useMemo(() => {
  return egresados.filter((e) => {
    // Mantiene la institución seleccionada
    if (e.institucion !== selectedInst) return false;

    // Si no hay búsqueda, devuelve todos los de esa institución
    if (!q) return true;

    const haystack = [
      e.nombre,
      e.carrera,
      e.sede,
      e.institucion,
      ...(e.skills || []),
      ...(e.powerSkills || []),
    ]
      .map(norm)
      .join(" ");

    return haystack.includes(q);
  });
}, [q, selectedInst, egresados]);
    const today = new Date().toLocaleDateString("es-CR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="eg-wrap">
            {/* Header */}
            <div className="eg-header">
                <div>
                    <h2>Búsqueda De Instituciones</h2>
                </div>

                <div className="eg-date">
                    <span>FECHA ACTUAL</span>
                    <strong>{today}</strong>
                </div>
            </div>

            {/* Search */}
            <div className="eg-search-box">
                <span className="eg-search-icon">🔍</span>
                <input
                    placeholder="Buscar instituciones, carreras, pasantías o habilidades..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Layout */}
            <div className="eg-grid">
                {/* Sidebar instituciones */}
                <aside className="eg-sidebar">
                    <div className="eg-sidebar-title">INSTITUCIONES</div>

                    {filteredInstituciones.map((inst) => (
                        <button
                            key={inst.id}
                            className={`eg-inst ${selectedInst === inst.id ? "active" : ""
                                }`}
                            onClick={() => setSelectedInst(inst.id)}
                        >
                            <div className="eg-inst-name">{inst.nombre}</div>
                            <div className="eg-inst-prov">{inst.provincia}</div>
                        </button>
                    ))}
                </aside>

                {/* Resultados */}
                <main className="eg-results">
                    <div className="eg-results-header">
                        <h3>
                            Egresados de{" "}
                            {instituciones.find((i) => i.id === selectedInst)?.nombre}
                        </h3>

                        <span className="eg-count">
                            {filtered.length} RESULTADOS
                        </span>
                    </div>

                    <div className="eg-cards">
                        {filtered.map((e) => (<div
                            key={e.id}
                            className="eg-card"
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                                setSelected(e);
                                setShowPerfil(true);
                            }}
                            onKeyDown={(ev) => {
                                if (ev.key === "Enter") {
                                    setSelected(e);
                                    setShowPerfil(true);
                                }
                            }}
                        >
                            <div className="eg-avatar">
                                {e.nombre.slice(0, 1)}
                            </div>

                            <div className="eg-info">
                                <div className="eg-name">{e.nombre}</div>
                                <div className="eg-career">{e.carrera}</div>

                                <div className="eg-skills">
                                    {e.skills.map((s) => (
                                        <span key={s} className="eg-skill">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </main>
            </div>
            <Modal
                isOpen={showPerfil}
                onClose={() => {
                    setShowPerfil(false);
                    setSelected(null);
                }}
                title="Perfil del Estudiante"
            >
                {!selected ? (
                    <div className="eg-empty">No hay estudiante seleccionado.</div>
                ) : (
                    <div className="eg-wrap" id="egresados">
                        {/* Top */}
                        <div className="st-top">
                            <div className="st-left">
                                <div className="st-avatar">{selected.nombre?.slice(0, 1)}</div>

                                <div className="st-main">
                                    <h3 className="st-name">{selected.nombre}</h3>
                                    <div className="st-career">{selected.carrera}</div>
                                    <div className="st-meta">
                                        {selected.institucion} • {selected.sede || "—"}
                                    </div>
                                </div>
                            </div>

                            <div className="st-power">
                                <div className="st-sec-title">⚡ POWER SKILLS</div>
                                <div className="st-chips">
                                    {(selected.powerSkills || []).map((s) => (
                                        <span key={s} className="st-chip orange">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="st-grid">
                            <div className="st-col">
                                <div className="st-card">
                                    <div className="st-card-title">RESUMEN PROFESIONAL</div>
                                    <p className="st-text">{selected.resumen}</p>
                                </div>

                                <div className="st-card">
                                    <div className="st-card-title">INFORMACIÓN DE CONTACTO</div>
                                    <div className="st-contact">
                                        <div className="st-contact-row">
                                            <span className="st-ico">✉️</span>
                                            <span>{selected.correo}</span>
                                        </div>
                                        <div className="st-contact-row">
                                            <span className="st-ico">📞</span>
                                            <span>{selected.telefono}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="st-col">
                                <div className="st-card">
                                    <div className="st-sec-title">🛠️ HABILIDADES TÉCNICAS</div>
                                    <div className="st-chips">
                                        {(selected.skills || []).map((s) => (
                                            <span key={s} className="st-chip blue">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="st-card">
                                    <div className="st-sec-title">👨‍🏫 REFERENCIA DEL PROFESOR</div>
                                    <div className="st-prof">{selected.profesor}</div>
                                    <div className="st-quote">{selected.referencia}</div>
                                </div>

                                <button className="st-download" type="button">
                                    📄 Descargar CV Completo
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}