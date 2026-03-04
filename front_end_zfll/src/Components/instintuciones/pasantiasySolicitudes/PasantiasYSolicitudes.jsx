import React, { useState } from "react";
import "./pasantiasYSolicitudes.css";

export default function PasantiasYSolicitudes() {
  const [tab, setTab] = useState("busqueda");
  const [search, setSearch] = useState("");

  // MOCK - luego lo conectamos a API
  const pasantias = [
    {
      id: 1,
      empresa: "Intel",
      carrera: "Ing. Electrónica",
      ubicacion: "Heredia",
      duracion: "6 meses",
      descripcion: "Pasantía en diseño de circuitos integrados.",
    },
    {
      id: 2,
      empresa: "Boston Scientific",
      carrera: "Ing. Producción",
      ubicacion: "Alajuela",
      duracion: "4 meses",
      descripcion: "Optimización de líneas de manufactura médica.",
    },
    {
      id: 3,
      empresa: "Microsoft",
      carrera: "Computación",
      ubicacion: "San José",
      duracion: "3 meses",
      descripcion: "Desarrollo de herramientas internas con Azure.",
    },
  ];

  const solicitudes = [
    { id: 101, empresa: "HP", carrera: "Computación", fecha: "2026-03-01", estado: "Pendiente" },
    { id: 102, empresa: "Accenture", carrera: "Administración", fecha: "2026-03-02", estado: "Pendiente" },
  ];

  const filteredPasantias = pasantias.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.empresa.toLowerCase().includes(q) ||
      p.carrera.toLowerCase().includes(q) ||
      p.ubicacion.toLowerCase().includes(q)
    );
  });

  const countSolicitudes = solicitudes.length;

  return (
    <div className="ps-wrap">
      <div className="ps-head">
        <h2>Pasantías y Solicitudes</h2>
        <p>Busca oportunidades para tus estudiantes o gestiona las solicitudes de las empresas.</p>
      </div>

      <div className="ps-tabs">
        <button
          type="button"
          className={`ps-tab ${tab === "busqueda" ? "active" : ""}`}
          onClick={() => setTab("busqueda")}
        >
          Búsqueda de Pasantías
        </button>

        <button
          type="button"
          className={`ps-tab ${tab === "solicitudes" ? "active" : ""}`}
          onClick={() => setTab("solicitudes")}
        >
          Solicitudes de Empresas <span className="ps-badge">{countSolicitudes}</span>
        </button>
      </div>

      {tab === "busqueda" ? (
        <>
          <div className="ps-searchCard">
            <div className="ps-searchBox">
              <span className="ps-searchIcon">🔎</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por empresa o carrera..."
              />
            </div>
          </div>

          <div className="ps-grid">
            {filteredPasantias.map((p) => (
              <div key={p.id} className="ps-card">
                <div className="ps-cardTop">
                  <div className="ps-avatar">{p.empresa.slice(0, 1)}</div>
                  <div className="ps-cardTitle">
                    <div className="ps-company">{p.empresa}</div>
                    <div className="ps-career">{p.carrera}</div>
                  </div>
                </div>

                <div className="ps-meta">
                  <div className="ps-metaRow">
                    <span className="ps-pin">📍</span>
                    <span>{p.ubicacion}</span>
                  </div>
                  <div className="ps-metaRow">
                    <span className="ps-clock">🕒</span>
                    <span>Duración: {p.duracion}</span>
                  </div>
                </div>

                <div className="ps-desc">{p.descripcion}</div>

                <button type="button" className="ps-btn">
                  Postular Estudiantes
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="ps-solicitudesCard">
          <div className="ps-tableHead">
            <span>Empresa</span>
            <span>Carrera</span>
            <span>Fecha</span>
            <span>Estado</span>
            <span>Acción</span>
          </div>

          {solicitudes.map((s) => (
            <div key={s.id} className="ps-tableRow">
              <div className="ps-td">{s.empresa}</div>
              <div className="ps-td">{s.carrera}</div>
              <div className="ps-td">{s.fecha}</div>
              <div className="ps-td">
                <span className="ps-chip">{s.estado}</span>
              </div>
              <div className="ps-td">
                <button type="button" className="ps-miniBtn">
                  Ver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}