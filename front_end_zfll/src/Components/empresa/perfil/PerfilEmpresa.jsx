import React, { useState } from "react";
import "./PerfilEmpresa.css";
import Swal from "sweetalert2";

export default function PerfilEmpresa() {
  const [loading] = useState(false);

  // ✅ CATALOGOS QUEMADOS
  const [catalogs] = useState({
    sectores: [
      { id: 1, nombre: "Dispositivos Médicos" },
      { id: 2, nombre: "Tecnología" },
      { id: 3, nombre: "Manufactura" },
      { id: 4, nombre: "Servicios" },
    ],
    tamanos: [
      { id: 1, nombre: "1-10" },
      { id: 2, nombre: "11-50" },
      { id: 3, nombre: "51-200" },
      { id: 4, nombre: "201-500" },
      { id: 5, nombre: "500+" },
    ],
  });

  // ✅ DATOS QUEMADOS (como si vinieran del backend)
  const [form, setForm] = useState({
    nombre: "Medtronic",
    ubicacion: "Cartago, Costa Rica",
    descripcion:
      "Empresa líder en innovación y fabricación de dispositivos médicos, comprometida con la calidad y el talento humano.",
    proceso_contratacion:
      "1) Revisión de CV  2) Entrevista HR  3) Entrevista técnica  4) Oferta y onboarding.",
    contacto_interesados: "talento@medtronic.com",
    contacto_admin: "admin@medtronic.com",
    tiene_url_externa: true,
    url_externa: "https://www.medtronic.com",
    sector: "1",
    tamano_empresa: "5",
    telefono: "+506 2550-2111",
    correo: "talento@medtronic.com",
    tagline: "Dispositivos Médicos • Cartago, CR",
  });

  const onChange = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  // ✅ GUARDAR MOCK (sin backend)
  const save = async (e) => {
    e.preventDefault();

    // Aquí solo mostramos lo que se “guardaría”
    console.log("✅ Guardado (mock):", form);

    Swal.fire({
      icon: "success",
      title: "Guardado",
      text: "Perfil actualizado (mock).",
      confirmButtonColor: "#2563eb",
    });
  };

  return (
    <div className="pe-wrap">
      <div className="pe-head">
        <div>
          <h2>Perfil de Empresa</h2>
          <p>Configura la identidad de tu empresa en ZFLL.</p>
        </div>
      </div>

      <form className="pe-card" onSubmit={save}>
        <div className="pe-top">
          <div className="pe-logoBox">
            <div className="pe-logo">{form.nombre?.slice(0, 1) || "E"}</div>
          </div>

          <div className="pe-topInfo">
            <div className="pe-name">{loading ? "Cargando..." : form.nombre || "—"}</div>

            <div className="pe-sub">
              <input
                value={form.tagline}
                onChange={onChange("tagline")}
                placeholder="Tagline (ej: Dispositivos Médicos • Cartago, CR)"
                style={{ width: "100%", border: "none", background: "transparent" }}
              />
            </div>
          </div>
        </div>

        <div className="pe-divider" />

        <div className="pe-grid3">
          <div className="pe-field">
            <label>TELÉFONO</label>
            <input value={form.telefono} onChange={onChange("telefono")} />
          </div>

          <div className="pe-field">
            <label>CORREO</label>
            <input value={form.correo} onChange={onChange("correo")} type="email" />
          </div>

          <div className="pe-field">
            <label>UBICACIÓN</label>
            <input value={form.ubicacion} onChange={onChange("ubicacion")} />
          </div>
        </div>

        <div className="pe-grid2">
          <div className="pe-field">
            <label>DESCRIPCIÓN</label>
            <textarea value={form.descripcion} onChange={onChange("descripcion")} rows={4} />
          </div>

          <div className="pe-field">
            <label>PROCESO CONTRATACIÓN</label>
            <textarea
              value={form.proceso_contratacion}
              onChange={onChange("proceso_contratacion")}
              rows={4}
            />
          </div>
        </div>

        <div className="pe-grid3">
          <div className="pe-field">
            <label>SECTOR</label>
            <select value={form.sector} onChange={onChange("sector")}>
              <option value="">—</option>
              {catalogs.sectores.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="pe-field">
            <label>TAMAÑO</label>
            <select value={form.tamano_empresa} onChange={onChange("tamano_empresa")}>
              <option value="">—</option>
              {catalogs.tamanos.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="pe-field">
            <label>URL EXTERNA</label>
            <input value={form.url_externa} onChange={onChange("url_externa")} />
          </div>
        </div>

        <div className="pe-actions">
          <button className="pe-btnPrimary" type="submit" disabled={loading}>
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}