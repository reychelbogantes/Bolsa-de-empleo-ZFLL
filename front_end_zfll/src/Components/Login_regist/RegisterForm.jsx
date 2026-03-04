// ============================================================
// RegisterForm.jsx — Conectado al backend real
// ============================================================

import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { registerAspirante, registerEmpresa, registerInstitucion } from '../../Services/Login-Regist/registerService.js';
import { loginConGoogle } from '../../Services/Login-Regist/loginService.js';
import '../../Pages/Login_Regist/AuthPage.css';

export default function RegisterForm({ regType, onSuccess, onPendingApproval }) {
  const [form, setForm] = useState({
    // Aspirante
    nombre: '', apellidos: '', email: '', phone: '',
    password: '', consentimiento: false,
    // Empresa
    nombre_empresa: '', cedula_juridica: '', ubicacion: '',
    // Instituto
    nombre_institucion: '',
  });
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ── Guarda tokens y llama onSuccess ──────────────────────────
  const handleAuthSuccess = (data) => {
    localStorage.setItem('access_token',  data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
    localStorage.setItem('user',          JSON.stringify(data.user));
    onSuccess(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (regType === 'user') {
        // Envía: { nombre, email, password, phone? }
        const data = await registerAspirante({
          nombre:   `${form.nombre} ${form.apellidos}`.trim(),
          email:    form.email,
          password: form.password,
          phone:    form.phone || undefined,
        });
        handleAuthSuccess(data);

      } else if (regType === 'company') {
        // Envía: { nombre, email, password, phone?, nombre_empresa?, cedula_juridica?, ubicacion? }
        const data = await registerEmpresa({
          nombre:          form.nombre,
          email:           form.email,
          password:        form.password,
          phone:           form.phone   || undefined,
          nombre_empresa:  form.nombre_empresa  || undefined,
          cedula_juridica: form.cedula_juridica || undefined,
          ubicacion:       form.ubicacion       || undefined,
        });
        if (data.requires_approval) onPendingApproval('company');

      } else {
        // Envía: { nombre, email, password, phone?, nombre_institucion?, cedula_juridica?, ubicacion? }
        const data = await registerInstitucion({
          nombre:             form.nombre,
          email:              form.email,
          password:           form.password,
          phone:              form.phone    || undefined,
          nombre_institucion: form.nombre_institucion || undefined,
          cedula_juridica:    form.cedula_juridica    || undefined,
          ubicacion:          form.ubicacion          || undefined,
        });
        if (data.requires_approval) onPendingApproval('institute');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header">
        <h2 className="auth-title">Registro</h2>
        <p className="auth-subtitle">
          {regType === 'user'    ? 'Crea tu perfil de aspirante'  :
           regType === 'company' ? 'Solicitud para Empresas'       :
                                  'Solicitud para Institutos'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-fields">

        {/* ── Aspirante ── */}
        {regType === 'user' && (
          <>
            <div className="auth-grid-2">
              <input type="text"  placeholder="Nombre"    value={form.nombre}    onChange={set('nombre')}    className="auth-input auth-input--sm" required />
              <input type="text"  placeholder="Apellidos" value={form.apellidos} onChange={set('apellidos')} className="auth-input auth-input--sm" required />
            </div>
            <input type="email" placeholder="Correo Electrónico"   value={form.email} onChange={set('email')} className="auth-input auth-input--sm" required />
            <input type="tel"   placeholder="Teléfono (opcional)"  value={form.phone} onChange={set('phone')} className="auth-input auth-input--sm" />
          </>
        )}

        {/* ── Empresa ── */}
        {regType === 'company' && (
          <>
            <input type="text"  placeholder="Nombre del Responsable" value={form.nombre}         onChange={set('nombre')}         className="auth-input auth-input--sm" required />
            <input type="text"  placeholder="Razón Social"           value={form.nombre_empresa} onChange={set('nombre_empresa')} className="auth-input auth-input--sm" />
            <input type="text"  placeholder="Cédula Jurídica"        value={form.cedula_juridica}onChange={set('cedula_juridica')}className="auth-input auth-input--sm" />
            <input type="email" placeholder="Correo Electrónico"     value={form.email}          onChange={set('email')}          className="auth-input auth-input--sm" required />
            <input type="tel"   placeholder="Teléfono"               value={form.phone}          onChange={set('phone')}          className="auth-input auth-input--sm" />
            <input type="text"  placeholder="Ubicación"              value={form.ubicacion}      onChange={set('ubicacion')}      className="auth-input auth-input--sm" />
          </>
        )}

        {/* ── Instituto ── */}
        {regType === 'institute' && (
          <>
            <input type="text"  placeholder="Nombre del Responsable"  value={form.nombre}             onChange={set('nombre')}             className="auth-input auth-input--sm" required />
            <input type="text"  placeholder="Nombre del Instituto"     value={form.nombre_institucion} onChange={set('nombre_institucion')}  className="auth-input auth-input--sm" />
            <input type="text"  placeholder="Cédula Jurídica"          value={form.cedula_juridica}    onChange={set('cedula_juridica')}     className="auth-input auth-input--sm" />
            <input type="email" placeholder="Correo Electrónico"       value={form.email}              onChange={set('email')}               className="auth-input auth-input--sm" required />
            <input type="tel"   placeholder="Teléfono"                 value={form.phone}              onChange={set('phone')}               className="auth-input auth-input--sm" />
            <input type="text"  placeholder="Ubicación"                value={form.ubicacion}          onChange={set('ubicacion')}           className="auth-input auth-input--sm" />
          </>
        )}

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={set('password')}
          className="auth-input auth-input--sm"
          required
          minLength={8}
        />

        {/* Consentimiento — solo aspirante */}
        {regType === 'user' && (
          <label className="auth-consent">
            <input type="checkbox" checked={form.consentimiento} onChange={set('consentimiento')} required />
            <span>Acepto el tratamiento de mis datos personales según la política de privacidad</span>
          </label>
        )}

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading} className="auth-btn-primary">
          {loading
            ? <span className="auth-spinner" />
            : regType === 'user' ? 'Registrarse' : 'Enviar Solicitud'
          }
        </button>
      </form>

      {/* Google — solo aspirante */}
      {regType === 'user' && (
        <div className="auth-social">
          <div className="auth-divider"><span>o regístrate con</span></div>
          <GoogleLogin
            onSuccess={async (response) => {
              try {
                const data = await loginConGoogle(response.credential);
                handleAuthSuccess(data);
              } catch (err) {
                setError(err.message);
              }
            }}
            onError={() => setError('Error al registrarse con Google.')}
            width="350"
            text="signup_with"
            shape="rectangular"
            theme="outline"
          />
        </div>
      )}
    </div>
  );
}