import React, { useMemo, useState } from "react";
import "./TalentoIndependiente.css";
import Modal from "../modal/Modal"; // ajusta ruta si aplica

export default function TalentoIndependiente() {
    const [search, setSearch] = useState("");
    const [showPerfil, setShowPerfil] = useState(false);
    const [selected, setSelected] = useState(null);

    const perfiles = [
        {
            id: 1,
            nombre: "Roberto Méndez",
            subtitulo: "Ingeniería Civil • UCR",
            inicial: "R",
            color: "mint",
            habilidades: ["Liderazgo", "Comunicación", "Resolución de conflictos"],
            sector: "Construcción",
            correo: "roberto.mendez@gmail.com",
            telefono: "8888-1111",
            resumen:
                "Profesional con experiencia en coordinación de equipos y supervisión de obra. Enfocado en resultados y mejora continua.",
        },
        {
            id: 2,
            nombre: "Valeria Solano",
            subtitulo: "Marketing Digital • ULACIT",
            inicial: "V",
            color: "green",
            habilidades: ["Trabajo en equipo", "Adaptabilidad", "Pensamiento crítico"],
            sector: "Publicidad",
            correo: "valeria.solano@gmail.com",
            telefono: "8777-2222",
            resumen:
                "Especialista en estrategias digitales, creación de contenido y análisis de campañas. Orientada a crecimiento y performance.",
        },
        {
            id: 3,
            nombre: "Andrés Castro",
            subtitulo: "Recursos Humanos • UNED",
            inicial: "A",
            color: "aqua",
            habilidades: ["Empatía", "Escucha activa", "Paciencia"],
            sector: "Servicios",
            correo: "andres.castro@gmail.com",
            telefono: "8666-3333",
            resumen:
                "Perfil orientado a gestión humana, cultura organizacional y acompañamiento de talento. Comunicación clara y enfoque humano.",
        },
    ];

    const norm = (s = "") =>
        s
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    const q = norm(search);

    const filtered = useMemo(() => {
        if (!q) return perfiles;

        return perfiles.filter((p) => {
            const haystack = [
                p.nombre,
                p.subtitulo,
                p.sector,
                ...(p.habilidades || []),
            ]
                .map(norm)
                .join(" ");

            return haystack.includes(q);
        });
    }, [q]);

    return (
        <div className="ti-wrap">
            <div className="ti-head">
                <div>
                    <h2>Búsqueda de Talento Independiente</h2>
                    <p>
                        Encuentra aspirantes registrados de forma independiente por institución,
                        habilidades o especialidad.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="ti-search">
                <span className="ti-ico">🔎</span>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por institución, habilidades blandas o especialidad..."
                />
            </div>

            {/* Cards */}
            <div className="ti-grid">
                {filtered.map((p) => (
                    <div key={p.id} className="ti-card">
                        <div className="ti-top">
                            <div className={`ti-avatar ${p.color}`}>{p.inicial}</div>

                            <div className="ti-meta">
                                <div className="ti-name">{p.nombre}</div>
                                <div className="ti-sub">{p.subtitulo}</div>
                            </div>
                        </div>

                        <div className="ti-chips">
                            {(p.habilidades || []).map((h) => (
                                <span key={h} className="ti-chip">
                                    {h}
                                </span>
                            ))}
                        </div>

                        <div className="ti-sec">
                            <div className="ti-sec-title">SECTOR DE INTERÉS</div>
                            <div className="ti-sec-box">{p.sector}</div>
                        </div>

                        <div className="ti-actions">
                            <button
                                type="button"
                                className="ti-btn primary"
                                onClick={() => {
                                    setSelected(p);
                                    setShowPerfil(true);
                                }}
                            >
                                Ver Perfil Completo
                            </button>

                            <button
                                type="button"
                                className="ti-btn ghost"
                                onClick={() => {
                                    setSelected(p);
                                    setShowPerfil(true);
                                }}
                            >
                                Contactar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Perfil */}
            <Modal
                isOpen={showPerfil}
                onClose={() => {
                    setShowPerfil(false);
                    setSelected(null);
                }}
                title="Perfil del Talento"
            >
                {!selected ? null : (
                    <div className="asp-modal">
                        {/* Header */}
                        <div className="asp-top">
                            <div className={`asp-avatar ${selected.color}`}>
                                {selected.inicial}
                            </div>

                            <div>
                                <div className="asp-name">{selected.nombre}</div>
                                <div className="asp-sub">{selected.subtitulo}</div>

                                <div className="asp-tags">
                                    <span className="asp-tag green">ASPIRANTE LIBRE</span>
                                    <span className="asp-tag gray">{selected.sector}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact + Skills */}
                        <div className="asp-grid">
                            <div>
                                <div className="asp-section">CONTACTO</div>
                                <div className="asp-contact">
                                    <div>✉️ {selected.correo}</div>
                                    <div>📞 {selected.telefono}</div>
                                </div>
                            </div>

                            <div>
                                <div className="asp-section">HABILIDADES BLANDAS</div>
                                <div className="asp-chips">
                                    {selected.habilidades.map((h) => (
                                        <span key={h} className="asp-chip">
                                            {h}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="asp-bio">
                            <div className="asp-section">BIOGRAFÍA PROFESIONAL</div>
                            <p>{selected.resumen}</p>
                        </div>

                        {/* CV */}
                        <div className="asp-cv">
                            <div className="asp-section">Curriculum Vitae</div>

                            <div className="asp-cv-box">
                                📄 CV_Aspirante.pdf
                                <span className="asp-download">Descargar PDF</span>
                            </div>
                        </div>

                        {/* Bottom Button */}
                        <button
                            className="asp-contact-btn"
                            type="button"
                            onClick={() => {
                                window.location.href = `mailto:${selected.correo}`;
                            }}
                        >
                            Contactar Aspirante
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
}