import React, { useEffect, useState } from "react";
import "./DemandaLaboral.css";
import { getDemandaLaboral } from "../../../Services/instintuciones/demandaLaboralServices"; 
// ^ ajusta el ../../../ según tu estructura

function Pill({ children, variant = "blue" }) {
  return <span className={`dl-pill ${variant}`}>{children}</span>;
}

function Card({ title, right, children, className = "" }) {
  return (
    <div className={`dl-card ${className}`}>
      <div className="dl-cardHead">
        <h3 className="dl-cardTitle">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function StatBox({ leftTitle, value, rightTitle, rightValue }) {
  return (
    <div className="dl-statBox">
      <div>
        <div className="dl-statK">{leftTitle}</div>
        <div className="dl-statV">{value}</div>
      </div>
      <div className="dl-statRight">
        <div className="dl-statDelta">{rightTitle}</div>
        <div className="dl-statSub">{rightValue}</div>
      </div>
    </div>
  );
}

function ProgressRow({ label, percent, note, accent = "blue" }) {
  return (
    <div className="dl-pr">
      <div className="dl-prTop">
        <div className="dl-prLabel">{label}</div>
        <div className={`dl-prPct ${accent}`}>{percent}%</div>
      </div>
      <div className="dl-prTrack">
        <div className={`dl-prFill ${accent}`} style={{ width: `${percent}%` }} />
      </div>
      {note ? <div className="dl-prNote">{note}</div> : null}
    </div>
  );
}

export default function DemandaLaboral() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    carreras_mayor_demanda: [],
    habilidades_mas_solicitadas: [],
    interaccion: [],
    perfil_buscado: {
      habilidades_blandas: 0,
      idiomas: 0,
      excelencia_academica: 0,
      certificaciones: 0,
    },
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getDemandaLaboral();

        if (!mounted) return;

        setData({
          carreras_mayor_demanda: Array.isArray(res?.carreras_mayor_demanda) ? res.carreras_mayor_demanda : [],
          habilidades_mas_solicitadas: Array.isArray(res?.habilidades_mas_solicitadas) ? res.habilidades_mas_solicitadas : [],
          interaccion: Array.isArray(res?.interaccion) ? res.interaccion : [],
          perfil_buscado: res?.perfil_buscado || {
            habilidades_blandas: 0,
            idiomas: 0,
            excelencia_academica: 0,
            certificaciones: 0,
          },
          total_contactos_mes: res?.total_contactos_mes ?? null, // si luego lo agregas en backend
        });
      } catch (err) {
        if (!mounted) return;
        const msg =
          err?.response?.status === 401
            ? "401 No autorizado: revisa que estés logueado y que el token se envíe."
            : err?.response?.data
            ? JSON.stringify(err.response.data)
            : err?.message || "Error cargando demanda laboral";

        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ---- Normalización para UI ----
  const demanda = data.carreras_mayor_demanda.map((x) => ({
    name: x.nombre ?? x.name ?? "Sin nombre",
    value: Number(x.total ?? x.value ?? 0),
  }));

  // Si backend te da totales (no %), los convertimos a % para el donut
  const habilidadesRaw = data.habilidades_mas_solicitadas.map((x, idx) => ({
    name: x.nombre ?? x.name ?? "General",
    total: Number(x.total ?? x.value ?? 0),
    color: ["blue", "green", "purple", "orange"][idx % 4],
  }));

  let habilidadesSum = 0;
  for (let i = 0; i < habilidadesRaw.length; i++) habilidadesSum += habilidadesRaw[i].total;

  const habilidades = habilidadesRaw.map((h) => ({
    name: h.name,
    value: habilidadesSum > 0 ? Math.round((h.total / habilidadesSum) * 100) : 0,
    color: h.color,
  }));

  // Ajuste de redondeo a 100%
  let totalPct = 0;
  for (let i = 0; i < habilidades.length; i++) totalPct += habilidades[i].value;
  if (habilidades.length && totalPct !== 100) {
    habilidades[0].value = Math.max(0, habilidades[0].value + (100 - totalPct));
  }

  const interaccion = data.interaccion.map((x) => ({
    m: x.m ?? x.mes ?? "",
    empresas: Number(x.empresas ?? 0),
    instituciones: Number(x.instituciones ?? 0),
  }));

  const totalMes =
    data.total_contactos_mes !== null
      ? Number(data.total_contactos_mes)
      : interaccion.reduce((acc, x) => acc + (x.empresas || 0), 0);

  // ---- Donut con conic-gradient (suma 100) ----
  let acc = 0;
  const stops = habilidades.map((h) => {
    const start = acc;
    acc += h.value;
    return `${`var(--dl-${h.color})`} ${start}% ${acc}%`;
  });
  const donutBg = `conic-gradient(${stops.join(", ")})`;

  let maxDemanda = 1;
  for (let i = 0; i < demanda.length; i++) if (demanda[i].value > maxDemanda) maxDemanda = demanda[i].value;

  let maxInter = 1;
  for (let i = 0; i < interaccion.length; i++) if (interaccion[i].empresas > maxInter) maxInter = interaccion[i].empresas;

  const perfil = data.perfil_buscado || {};

  return (
    <div className="dl-wrap">
      <div className="dl-top">
        <h2 className="dl-title">Demanda Laboral y Análisis de Talento</h2>
        <p className="dl-subtitle">
          Análisis detallado de las necesidades de las empresas y el desempeño de los egresados.
        </p>
      </div>

      {loading ? <div style={{ padding: 12 }}>Cargando…</div> : null}
      {!loading && error ? (
        <div style={{ padding: 12, color: "crimson", whiteSpace: "pre-wrap" }}>{error}</div>
      ) : null}

      <div className="dl-gridTop">
        <Card title="Carreras con Mayor Demanda" right={<Pill>ÚLTIMOS 6 MESES</Pill>} className="dl-cardPad">
          <div className="dl-bars">
            {demanda.map((d) => (
              <div key={d.name} className="dl-barRow">
                <div className="dl-barLabel">{d.name}</div>
                <div className="dl-barTrack">
                  <div className="dl-barFill" style={{ width: `${(d.value / maxDemanda) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="dl-footNote">* Basado en vacantes publicadas y búsquedas directas de empresas.</div>
        </Card>

        <Card title="Habilidades más Solicitadas" right={<Pill variant="green">TENDENCIA</Pill>} className="dl-cardPad">
          <div className="dl-donutWrap">
            <div className="dl-donut" style={{ background: donutBg }} />
            <div className="dl-legend">
              {habilidades.map((h) => (
                <div key={h.name} className="dl-legItem">
                  <span className={`dl-dot ${h.color}`} />
                  <span className="dl-legText">
                    {h.name} ({h.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="dl-gridBottom">
        <Card title="Interacción Empresa-Institución" className="dl-cardPad">
          <div className="dl-monthBars">
            {interaccion.map((x, idx) => (
              <div key={`${x.m}-${idx}`} className="dl-monthCol">
                <div className="dl-monthStack">
                  <div
                    className="dl-monthBar empresas"
                    style={{ height: `${(x.empresas / maxInter) * 140}px` }}
                    title={`Empresas: ${x.empresas}`}
                  />
                  <div
                    className="dl-monthBar instituciones"
                    style={{ height: `${(x.instituciones / maxInter) * 140}px` }}
                    title={`Instituciones: ${x.instituciones}`}
                  />
                </div>
                <div className="dl-monthLabel">{x.m}</div>
              </div>
            ))}
          </div>

          <StatBox
            leftTitle="TOTAL CONTACTOS MES"
            value={totalMes}
            rightTitle="+15% vs mes anterior"
            rightValue="Crecimiento en vinculación"
          />
        </Card>

        <div className="dl-profile">
          <div className="dl-profileHead">
            <span className="dl-star">★</span>
            <div className="dl-profileTitle">Perfil Buscado</div>
          </div>

          <div className="dl-profileBody">
            <ProgressRow
              label="HABILIDADES BLANDAS"
              percent={Number(perfil.habilidades_blandas || 0)}
              note="Liderazgo, comunicación y trabajo en equipo."
              accent="blue"
            />
            <ProgressRow
              label="DOMINIO DE IDIOMAS"
              percent={Number(perfil.idiomas || 0)}
              note="Inglés técnico indispensable para industria."
              accent="green"
            />
            <ProgressRow
              label="EXCELENCIA ACADÉMICA"
              percent={Number(perfil.excelencia_academica || 0)}
              note="Promedio ponderado y participación en proyectos."
              accent="purple"
            />
            <ProgressRow
              label="CERTIFICACIONES EXTRA"
              percent={Number(perfil.certificaciones || 0)}
              note="Lean Six Sigma, SolidWorks, ISO, etc."
              accent="orange"
            />

            <div className="dl-profileDivider" />
            <p className="dl-profileNote">
              Las empresas en ZFLL priorizan candidatos con un balance entre rigor técnico y habilidades de comunicación efectiva.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}