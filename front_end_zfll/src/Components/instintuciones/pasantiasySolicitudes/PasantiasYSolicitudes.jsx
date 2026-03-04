import React, { useEffect, useMemo, useState } from "react";
import "./pasantiasYSolicitudes.css";

import {
  getPasantiasDashboard,
  getSolicitudesRecibidas,
  getSolicitudesEnviadas,
} from "../../../Services/instintuciones/pasantiasDashboardService";

export default function PasantiasYSolicitudes() {
  const [tab, setTab] = useState("busqueda");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [pasantias, setPasantias] = useState([]);      // ✅ API
  const [solicitudes, setSolicitudes] = useState([]);  // ✅ API

  // mapper tolerante (backend -> UI)
  const mapPasantia = (p) => ({
    id: p.id,
    empresa: p.empresa ?? p.company ?? p.company_name ?? "Empresa",
    carrera: p.carrera ?? p.career ?? p.programa ?? "—",
    ubicacion: p.ubicacion ?? p.location ?? "—",
    duracion: p.duracion ?? p.duration ?? "—",
    descripcion: p.descripcion ?? p.description ?? "—",
    _raw: p,
  });

  const mapSolicitud = (s) => ({
    id: s.id,
    empresa: s.empresa ?? s.company ?? s.company_name ?? "Empresa",
    carrera: s.carrera ?? s.career ?? s.programa ?? "—",
    fecha: s.fecha ?? s.created_at ?? s.createdAt ?? "",
    estado: s.estado ?? s.status ?? "Pendiente",
    _raw: s,
  });

  // ✅ fetch inicial
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // opción A: endpoint dashboard ya trae todo
        const dash = await getPasantiasDashboard();

        // ✅ asumimos: enviadas = pasantías disponibles / recibidas = solicitudes de empresas
        const enviadas = Array.isArray(dash?.enviadas) ? dash.enviadas : [];
        const recibidas = Array.isArray(dash?.recibidas) ? dash.recibidas : [];

        setPasantias(enviadas.map(mapPasantia));
        setSolicitudes(recibidas.map(mapSolicitud));

        // opción B (fallback): si el dashboard no viene completo, usamos endpoints separados
        if (!enviadas.length) {
          const env = await getSolicitudesEnviadas();
          setPasantias((Array.isArray(env) ? env : []).map(mapPasantia));
        }
        if (!recibidas.length) {
          const rec = await getSolicitudesRecibidas();
          setSolicitudes((Array.isArray(rec) ? rec : []).map(mapSolicitud));
        }
      } catch (err) {
        console.error("Error pasantias-dashboard:", err);
        setPasantias([]);
        setSolicitudes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredPasantias = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pasantias;

    return pasantias.filter((p) => {
      return (
        (p.empresa || "").toLowerCase().includes(q) ||
        (p.carrera || "").toLowerCase().includes(q) ||
        (p.ubicacion || "").toLowerCase().includes(q)
      );
    });
  }, [search, pasantias]);

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

      {loading ? (
        <div style={{ padding: 12 }}>Cargando...</div>
      ) : tab === "busqueda" ? (
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
                  <div className="ps-avatar">{(p.empresa || "E").slice(0, 1)}</div>
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

            {!filteredPasantias.length ? (
              <div style={{ padding: 12 }}>No hay pasantías para mostrar.</div>
            ) : null}
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
              <div className="ps-td">{s.fecha ? String(s.fecha).slice(0, 10) : ""}</div>
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

          {!solicitudes.length ? (
            <div style={{ padding: 12 }}>No hay solicitudes por mostrar.</div>
          ) : null}
        </div>
      )}
    </div>
  );
}