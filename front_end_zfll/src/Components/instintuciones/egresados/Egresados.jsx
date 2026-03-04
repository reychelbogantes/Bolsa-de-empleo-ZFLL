import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import "./Egresados.css";
import Modal from "../modal/Modal";

import { getEgresadosInstitucion } from "../../../Services/instintuciones/egresadosService";
import { uploadImportBatch, getImportBatchStatus } from "../../../Services/importsService";

// ─── Campos del machote ──────────────────────────────────────
const MACHOTE_CAMPOS = [
  { label: "Email", ejemplo: "juan.perez@tec.ac.cr" },
  { label: "Nombre", ejemplo: "Juan" },
  { label: "Apellido", ejemplo: "Pérez" },
  { label: "Username", ejemplo: "juan.perez" },
  { label: "Teléfono", ejemplo: "+506 8888 0000" },
  { label: "ID Institución", ejemplo: "1" },
  { label: "ID Programa", ejemplo: "2" },
  { label: "Fecha Inicio (YYYY-MM-DD)", ejemplo: "2024-01-15" },
  { label: "Fecha Fin (YYYY-MM-DD)", ejemplo: "2024-06-15" },
  { label: "Horas Requeridas", ejemplo: "480" },
];

const DEFAULT_PASSWORD = "estudiante123";

function generarMachote() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    MACHOTE_CAMPOS.map((c) => c.label),
    MACHOTE_CAMPOS.map((c) => c.ejemplo),
    [
      "maria.garcia@tec.ac.cr",
      "María",
      "García",
      "maria.garcia",
      "+506 7777 0000",
      "1",
      "2",
      "2024-01-15",
      "2024-06-15",
      "480",
    ],
  ]);
  ws["!cols"] = MACHOTE_CAMPOS.map((c) => ({ wch: Math.max(c.label.length, c.ejemplo.length) + 4 }));
  XLSX.utils.book_append_sheet(wb, ws, "Egresados");
  XLSX.writeFile(wb, "machote_egresados.xlsx");
}

export default function Egresados() {
  // ── filtros ──
  const [search, setSearch] = useState("");
  const [carrera, setCarrera] = useState("Todas las Carreras");

  // ✅ SIN datos quemados
  const [egresados, setEgresados] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");

  // ── modales ──
  const [showPerfil, setShowPerfil] = useState(false);
  const [selected, setSelected] = useState(null);

  const [showManual, setShowManual] = useState(false);
  const [formManual, setFormManual] = useState({
    nombre: "",
    correo: "",
    carrera: "Ing. Producción",
    anio: "",
    habilidades: "",
    powerSkills: "",
  });

  // ── Importación ──
  const fileInputRef = useRef();
  const [showImport, setShowImport] = useState(false);
  const [importFase, setImportFase] = useState("idle"); // idle | procesando | resultado
  const [importResults, setImportResults] = useState([]);
  const [importError, setImportError] = useState("");
  const [importProgreso, setImportProgreso] = useState({ actual: 0, total: 0 });

  // ✅ Cargar egresados desde backend al montar (sin quemados)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingList(true);
        setListError("");
        const data = await getEgresadosInstitucion();

        if (!mounted) return;

        // Mapear a tu formato de UI
        setEgresados(
          data.map((e) => ({
            id: e.id,
            nombre: e.nombre,
            correo: e.correo,
            carrera: e.carrera || "Pendiente",
            blandas: e.blandas || [],
            power: e.power || [],
            estado: e.estado || "DISPONIBLE",
          }))
        );
      } catch (err) {
        if (!mounted) return;
        setListError(
          err?.response?.status === 401
            ? "401 No autorizado: inicia sesión."
            : err?.message || "Error cargando egresados"
        );
      } finally {
        if (mounted) setLoadingList(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ── Importación: abrir picker ──
  const handleCargarClick = () => {
    setImportFase("idle");
    setImportResults([]);
    setImportError("");
    setImportProgreso({ actual: 0, total: 0 });
    setShowImport(true);
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  // ── Importación: subir excel + polling status ──
  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!["xlsx", "xls"].includes(file.name.split(".").pop().toLowerCase())) {
      setImportError("Solo se aceptan archivos .xlsx o .xls");
      setImportFase("idle");
      return;
    }

    try {
      setImportError("");
      setImportFase("procesando");
      setImportProgreso({ actual: 0, total: 0 });

      // 1) subir (backend procesa)
      const lote = await uploadImportBatch(file);

      // 2) polling estado
      let statusData = lote;
      for (let i = 0; i < 25; i++) {
        statusData = await getImportBatchStatus(lote.id);

        const done =
          (statusData.creados || 0) +
          (statusData.actualizados || 0) +
          (statusData.con_error || 0);

        setImportProgreso({
          actual: done,
          total: statusData.total_registros || done || 0,
        });

        if (statusData.estado === "completed" || statusData.estado === "completed_with_errors") break;
        await new Promise((r) => setTimeout(r, 700));
      }

      const results = Array.isArray(statusData.log_errores) ? statusData.log_errores : [];
      setImportResults(results);
      setImportFase("resultado");

      // ✅ Al terminar, refrescar lista desde backend (cero “agregar local”)
      try {
        setLoadingList(true);
        const refreshed = await getEgresadosInstitucion();
        setEgresados(
          refreshed.map((e) => ({
            id: e.id,
            nombre: e.nombre,
            correo: e.correo,
            carrera: e.carrera || "Pendiente",
            blandas: e.blandas || [],
            power: e.power || [],
            estado: e.estado || "DISPONIBLE",
          }))
        );
      } catch (err) {
        // si falla el refresh, al menos no se queda cargando
        setListError(
          err?.response?.status
            ? `${err.response.status} ${JSON.stringify(err.response.data || {})}`
            : err?.message || "Error refrescando egresados"
        );
      } finally {
        setLoadingList(false);
      }

    } catch (err) {
      setImportFase("idle");
      setImportError(err?.response?.data?.error || err?.message || "Error al subir/procesar");
    }
  }, []);

  const cerrarImport = () => {
    setShowImport(false);
    setImportFase("idle");
    setImportResults([]);
    setImportError("");
    setImportProgreso({ actual: 0, total: 0 });
  };

  const exitosos = importResults.filter((r) => r.estado === "ok");
  const fallidos = importResults.filter((r) => r.estado === "error");
  const actual = Number(importProgreso?.actual || 0);
  const total = Number(importProgreso?.total || 0);
  const pct = total > 0 ? Math.round((actual / total) * 100) : 0;

  // ── Manual (queda local; si luego quieres backend, lo conectamos) ──
  const onChangeManual = (key) => (e) => setFormManual((p) => ({ ...p, [key]: e.target.value }));
  const closeManual = () => {
    setShowManual(false);
    setFormManual({ nombre: "", correo: "", carrera: "Ing. Producción", anio: "", habilidades: "", powerSkills: "" });
  };
  const submitManual = (e) => {
    e.preventDefault();
    if (!formManual.nombre.trim() || !formManual.correo.trim()) return;

    // Si quieres, luego lo conectamos a backend (POST).
    setEgresados((prev) => [
      {
        id: Date.now(),
        nombre: formManual.nombre.trim(),
        correo: formManual.correo.trim(),
        carrera: formManual.carrera,
        blandas: formManual.habilidades ? formManual.habilidades.split(",").map((x) => x.trim()).filter(Boolean) : [],
        power: formManual.powerSkills ? formManual.powerSkills.split(",").map((x) => x.trim()).filter(Boolean) : [],
        estado: "DISPONIBLE",
      },
      ...prev,
    ]);
    closeManual();
  };

  // ── filtros tabla ──
  const carreras = useMemo(() => {
    const s = new Set(egresados.map((e) => e.carrera));
    return ["Todas las Carreras", ...Array.from(s)];
  }, [egresados]);

  const norm = (s = "") => s.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const q = norm(search);

  const filtered = useMemo(
    () =>
      egresados.filter((e) => {
        if (carrera !== "Todas las Carreras" && e.carrera !== carrera) return false;
        if (!q) return true;
        return [e.nombre, e.correo, e.carrera, ...(e.blandas || []), ...(e.power || []), e.estado]
          .map(norm)
          .join(" ")
          .includes(q);
      }),
    [q, carrera, egresados]
  );

  // ────────────────────────────────────────────
  return (
    <div className="ige-wrap">
      <div className="ige-head">
        <div>
          <h2>Gestión de Egresados</h2>
          <p>Administra el talento graduado y facilita el contacto con empresas.</p>
        </div>

        <div className="ige-head-actions">
          <button className="ige-btn light" type="button" onClick={generarMachote}>
            ⬇️ Descargar Machote
          </button>

          <button className="ige-btn blue" type="button" onClick={handleCargarClick}>
            ⬆️ Cargar Egresados
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="ige-card">
        <div className="ige-toprow">
          <div className="ige-leftTitle">Base de Datos</div>
          <div className="ige-filters">
            <div className="ige-select">
              <select value={carrera} onChange={(e) => setCarrera(e.target.value)}>
                {carreras.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <span className="ige-caret">▾</span>
            </div>

            <button className="ige-iconBtn" type="button" title="Descargar">
              ⬇️
            </button>

            <div className="ige-search">
              <span className="ige-searchIco">🔎</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre..." />
            </div>

            <button className="ige-pill" type="button" onClick={() => setShowManual(true)}>
              Manual
            </button>
          </div>
        </div>

        {loadingList ? <div style={{ padding: 12 }}>Cargando egresados…</div> : null}
        {!loadingList && listError ? <div style={{ padding: 12, color: "crimson" }}>{listError}</div> : null}

        <div className="ige-table">
          <div className="ige-th">
            <span>EGRESADO</span>
            <span>PROGRAMA / CARRERA</span>
            <span>HABILIDADES BLANDAS</span>
            <span>POWER SKILLS</span>
            <span>ESTADO</span>
            <span>ACCIONES</span>
          </div>

          {filtered.map((e) => (
            <div key={e.id} className="ige-tr">
              <div className="ige-user">
                <div className="ige-avatar">{e.nombre.slice(0, 1)}</div>
                <div className="ige-userText">
                  <button
                    type="button"
                    className="ige-nameBtn"
                    onClick={() => {
                      setSelected(e);
                      setShowPerfil(true);
                    }}
                  >
                    {e.nombre}
                  </button>
                  <div className="ige-mail" title={e.correo}>
                    {e.correo}
                  </div>
                </div>
              </div>

              <div className="ige-career">{e.carrera}</div>

              <div className="ige-chips">
                {(e.blandas || []).map((x) => (
                  <span key={x} className="ige-chip soft">
                    {x}
                  </span>
                ))}
              </div>

              <div className="ige-chips">
                {(e.power || []).map((x) => (
                  <span key={x} className="ige-chip hard">
                    {x}
                  </span>
                ))}
              </div>

              <div className="ige-status">
                <span className={`ige-badge ${e.estado === "DISPONIBLE" ? "ok" : e.estado === "EN PASANTÍA" ? "mid" : "off"}`}>
                  {e.estado}
                </span>
              </div>

              <div className="ige-actions">
                <button
                  type="button"
                  className="ige-act"
                  title="Ver"
                  onClick={() => {
                    setSelected(e);
                    setShowPerfil(true);
                  }}
                >
                  👁️
                </button>
                <button type="button" className="ige-act" title="Contacto">
                  ✉️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL IMPORT */}
      <Modal isOpen={showImport} onClose={cerrarImport} title="Cargar Egresados desde Excel">
        {importFase === "idle" && (
          <div className="imp-idle">
            {importError ? <div className="imp-alert-err">⚠ {importError}</div> : <p className="imp-hint">Selecciona un archivo .xlsx para continuar.</p>}
            <button className="imp-btn-sec" onClick={cerrarImport}>
              Cerrar
            </button>
          </div>
        )}

        {importFase === "procesando" && (
          <div className="imp-proc">
            <div className="imp-spinner" />
            <p className="imp-proc-title">Procesando Excel en el servidor…</p>
            <p className="imp-proc-sub">
              {actual} de {total}
            </p>
            <div className="imp-prog-bar">
              <div className="imp-prog-fill" style={{ width: pct + "%" }} />
            </div>
            <p className="imp-proc-pwd">
              Contraseña inicial: <code>{DEFAULT_PASSWORD}</code>
            </p>
          </div>
        )}

        {importFase === "resultado" && (
          <>
            <div className="imp-result-summary">
              <div className="imp-result-box ok">
                <div className="imp-result-num">{exitosos.length}</div>
                <div>OK</div>
              </div>
              <div className="imp-result-box err">
                <div className="imp-result-num">{fallidos.length}</div>
                <div>Errores</div>
              </div>
            </div>

            <div className="imp-tbl-wrap" style={{ marginTop: 12 }}>
              <table className="imp-tbl">
                <thead>
                  <tr>
                    <th>Fila</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Estado</th>
                    <th>Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  {importResults.map((r, i) => (
                    <tr key={i} className={r.estado === "error" ? "imp-row-err" : ""}>
                      <td>{r.fila ?? "—"}</td>
                      <td>{r.email ?? "—"}</td>
                      <td>{r.username ?? "—"}</td>
                      <td>{r.estado}</td>
                      <td>{r.msg ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="imp-result-actions">
              <button className="imp-btn-sec" onClick={cerrarImport}>
                Cerrar
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* MODAL MANUAL */}
      <Modal isOpen={showManual} onClose={closeManual} title="Registro Manual de Egresado">
        <form className="manual-form" onSubmit={submitManual}>
          <div className="manual-grid">
            <div className="manual-field">
              <label>NOMBRE COMPLETO</label>
              <input value={formManual.nombre} onChange={onChangeManual("nombre")} />
            </div>
            <div className="manual-field">
              <label>CORREO ELECTRÓNICO</label>
              <input type="email" value={formManual.correo} onChange={onChangeManual("correo")} />
            </div>
            <div className="manual-field">
              <label>CARRERA</label>
              <select value={formManual.carrera} onChange={onChangeManual("carrera")}>
                <option>Ing. Producción</option>
                <option>Ing. Computación</option>
                <option>Ing. Electrónica</option>
                <option>Ing. Mecatrónica</option>
              </select>
            </div>
            <div className="manual-field">
              <label>AÑO FINALIZACIÓN</label>
              <input type="number" value={formManual.anio} onChange={onChangeManual("anio")} />
            </div>
          </div>

          <div className="manual-field full">
            <label>HABILIDADES Y LOGROS</label>
            <textarea rows="4" value={formManual.habilidades} onChange={onChangeManual("habilidades")} placeholder="Ej: Liderazgo, Comunicación" />
          </div>
          <div className="manual-field full">
            <label>POWER SKILLS</label>
            <textarea rows="3" value={formManual.powerSkills} onChange={onChangeManual("powerSkills")} placeholder="Ej: React, Python" />
          </div>

          <div className="manual-actions">
            <button type="button" className="manual-cancel" onClick={closeManual}>
              Cancelar
            </button>
            <button type="submit" className="manual-submit">
              Guardar Egresado
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL PERFIL */}
      <Modal isOpen={showPerfil} onClose={() => { setShowPerfil(false); setSelected(null); }} title="Perfil del Egresado">
        {selected && (
          <div className="egp-wrap">
            <div className="egp-top">
              <div className="egp-avatar">{selected.nombre.slice(0, 1)}</div>
              <div>
                <div className="egp-name">{selected.nombre}</div>
                <div className="egp-sub">{selected.carrera}</div>
                <div className="egp-meta">{selected.estado}</div>
              </div>
            </div>
            <div className="egp-grid">
              <div className="egp-box">
                <div className="egp-title">Contacto</div>
                <div className="egp-line">✉️ {selected.correo}</div>
              </div>
              <div className="egp-box">
                <div className="egp-title">Habilidades Blandas</div>
                <div className="egp-chips">
                  {(selected.blandas || []).map((x) => (
                    <span key={x} className="egp-chip soft">{x}</span>
                  ))}
                </div>
              </div>
              <div className="egp-box">
                <div className="egp-title">Power Skills</div>
                <div className="egp-chips">
                  {(selected.power || []).map((x) => (
                    <span key={x} className="egp-chip hard">{x}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}