import React, { useMemo } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ setActiveView }) {
  const navigate = useNavigate();
  // ==========================
  // MOCK DATA (TEMPORAL)
  // ==========================
  const kpis = {
    vacantesActivas: 8,
    postulacionesHoy: 24,
    enRevision: 156,
    contratadosMes: 12,
  };

  // gráfico: actividad por día (2 series)
  const chart = {
    labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
    programacion: [12, 19, 15, 22, 30, 8, 6],
    analisisDatos: [8, 12, 10, 17, 25, 4, 2],
  };

  const rendimiento = {
    mas: {
      titulo: "Ingeniero de Software Senior",
      detalle: "45 postulaciones esta semana",
    },
    menos: {
      titulo: "Técnico en Electromecánica",
      detalle: "Solo 3 postulaciones recibidas",
    },
  };

  const topInstituciones = [
    { id: 1, sigla: "TEC", area: "INGENIERÍA", perfiles: 120 },
    { id: 2, sigla: "INA", area: "TÉCNICO", perfiles: 85 },
    { id: 3, sigla: "UCR", area: "CIENCIAS", perfiles: 64 },
  ];

  // ==========================
  // CHART CALC
  // ==========================
  const maxVal = useMemo(() => {
    const all = [...chart.programacion, ...chart.analisisDatos];
    return Math.max(...all, 1);
  }, [chart]);

  return (
    <div className="db-wrap">
      {/* HEADER */}
      <div className="db-head">
        <div>
          <h2>Dashboard Corporativo</h2>
          <p>Medtronic • Cartago, Costa Rica</p>
        </div>

        <button
  className="db-btn"
  type="button"
  onClick={() => setActiveView("egresados")}
>
  🎓 Buscar Egresados
</button>
      </div>
      {/*bueno/}, 
      {/* KPI CARDS */}
      <div className="db-kpis">
        <div className="db-kpi">
          <div className="db-kpi-icon">🧳</div>
          <div className="db-kpi-label">Vacantes Activas</div>
          <div className="db-kpi-value">{kpis.vacantesActivas}</div>
        </div>

        <div className="db-kpi">
          <div className="db-kpi-icon">👥</div>
          <div className="db-kpi-label">Postulaciones Hoy</div>
          <div className="db-kpi-value">{kpis.postulacionesHoy}</div>
        </div>

        <div className="db-kpi">
          <div className="db-kpi-icon orange">⏱️</div>
          <div className="db-kpi-label">En Revisión</div>
          <div className="db-kpi-value">{kpis.enRevision}</div>
        </div>

        <div className="db-kpi">
          <div className="db-kpi-icon purple">✅</div>
          <div className="db-kpi-label">Contratados Mes</div>
          <div className="db-kpi-value">{kpis.contratadosMes}</div>
        </div>
      </div>

      {/* GRID */}
      <div className="db-grid">
        {/* CHART CARD */}
        <div className="db-card">
          <div className="db-card-top">
            <h3>Actividad de Postulantes por Carrera</h3>
            <div className="db-pills">
              <span className="pill blue">PROGRAMACIÓN</span>
              <span className="pill green">ANÁLISIS DE DATOS</span>
            </div>
          </div>

          <div className="chart">
            {/* Y axis (solo líneas guía visuales) */}
            <div className="chart-grid">
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="chart-bars">
              {chart.labels.map((day, idx) => {
                const p = chart.programacion[idx];
                const a = chart.analisisDatos[idx];

                const pH = Math.round((p / maxVal) * 160);
                const aH = Math.round((a / maxVal) * 160);

                return (
                  <div key={day} className="bar-col">
                    <div className="bar-pair">
                      <div className="bar blue" style={{ height: pH }} title={`Programación: ${p}`} />
                      <div className="bar green" style={{ height: aH }} title={`Análisis: ${a}`} />
                    </div>
                    <div className="bar-label">{day}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="db-right">
          {/* Rendimiento */}
          <div className="db-card small">
            <h3>Rendimiento de Vacantes</h3>

            <div className="perf perf-good">
              <div className="perf-tag">MÁS POSTULACIONES</div>
              <div className="perf-title">{rendimiento.mas.titulo}</div>
              <div className="perf-sub">{rendimiento.mas.detalle}</div>
            </div>

            <div className="perf perf-bad">
              <div className="perf-tag">MENOS POSTULACIONES</div>
              <div className="perf-title">{rendimiento.menos.titulo}</div>
              <div className="perf-sub">{rendimiento.menos.detalle}</div>
            </div>
          </div>

          {/* Top Instituciones */}
          <div className="db-dark">
            <div className="db-dark-title">🏛️ Top Instituciones</div>

            <div className="db-dark-list">
              {topInstituciones.map((t) => (
                <div key={t.id} className="top-row">
                  <div>
                    <div className="top-sigla">{t.sigla}</div>
                    <div className="top-area">{t.area}</div>
                  </div>

                  <div className="top-right">
                    <div className="top-num">{t.perfiles}</div>
                    <div className="top-lbl">PERFILES</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}