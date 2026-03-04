import React, { useEffect, useState } from "react";
import "./PerfilEmpresa.css";
import Swal from "sweetalert2";
import { getEmpresaMe, updateEmpresaMe } from "../../../Services/Empresa/empresaService";
import { getSectoresIndustriales, getTamanosEmpresa } from "../../../Services/Admin/catalogsService";

export default function PerfilEmpresa() {
  const [loading, setLoading] = useState(true);
  const [catalogs, setCatalogs] = useState({ sectores: [], tamanos: [] });
  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    descripcion: "",
    proceso_contratacion: "",
    contacto_interesados: "",
    contacto_admin: "",
    tiene_url_externa: false,
    url_externa: "",
    sector: "",
    tamano_empresa: "",
    telefono: "",
    correo: "",
    tagline: "",
  });
  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const load = async () => {
    setLoading(true);
    try {
      const [me, sectores, tamanos] = await Promise.all([
        getEmpresaMe(),
        getSectoresIndustriales(),
        getTamanosEmpresa(),
      ]);

      const data = me?.data || {};
      const extra = data?.extra_data || {};

      setCatalogs({
        sectores: sectores?.data?.results ?? sectores?.data ?? [],
        tamanos: tamanos?.data?.results ?? tamanos?.data ?? [],
      });

      setForm({
        nombre: data?.nombre || "",
        ubicacion: data?.ubicacion || "",
        descripcion: data?.descripcion || "",
        proceso_contratacion: data?.proceso_contratacion || "",
        contacto_interesados: data?.contacto_interesados || "",
        contacto_admin: data?.contacto_admin || "",
        tiene_url_externa: !!data?.tiene_url_externa,
        url_externa: data?.url_externa || "",
        sector: data?.sector ? String(data.sector) : "",
        tamano_empresa: data?.tamano_empresa ? String(data.tamano_empresa) : "",
        telefono: extra?.telefono || "",
        correo: extra?.correo || "",
        tagline: extra?.tagline || "",
      });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo cargar tu perfil de empresa." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: form.nombre,
      ubicacion: form.ubicacion,
      descripcion: form.descripcion,
      proceso_contratacion: form.proceso_contratacion,
      contacto_interesados: form.contacto_interesados,
      contacto_admin: form.contacto_admin,
      tiene_url_externa: !!form.tiene_url_externa,
      url_externa: form.url_externa || "",
      sector: form.sector ? Number(form.sector) : null,
      tamano_empresa: form.tamano_empresa ? Number(form.tamano_empresa) : null,
      extra_data: {
        telefono: form.telefono,
        correo: form.correo,
        tagline: form.tagline,
      },
    };

    try {
      await updateEmpresaMe(payload);
      Swal.fire({ icon: "success", title: "Guardado", text: "Perfil actualizado." });
      load();
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : "Revisa el backend.";
      Swal.fire({ icon: "error", title: "No se pudo guardar", text: msg });
    }
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
            <textarea value={form.proceso_contratacion} onChange={onChange("proceso_contratacion")} rows={4} />
          </div>
        </div>

        <div className="pe-grid3">
          <div className="pe-field">
            <label>SECTOR</label>
            <select value={form.sector} onChange={onChange("sector")}>
              <option value="">—</option>
              {catalogs.sectores.map((x) => (
                <option key={x.id} value={x.id}>{x.nombre}</option>
              ))}
            </select>
          </div>

          <div className="pe-field">
            <label>TAMAÑO</label>
            <select value={form.tamano_empresa} onChange={onChange("tamano_empresa")}>
              <option value="">—</option>
              {catalogs.tamanos.map((x) => (
                <option key={x.id} value={x.id}>{x.nombre}</option>
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