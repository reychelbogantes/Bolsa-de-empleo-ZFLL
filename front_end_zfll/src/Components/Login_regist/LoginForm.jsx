// ============================================================
// LoginForm.jsx — Conectado al backend real
// ============================================================

import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { User, Lock, ChevronRight } from 'lucide-react';
import { checkUserExists, loginAspirante, loginOrg, loginConGoogle } from '../../Services/Login-Regist/loginService.js';
import '../../Pages/Login_Regist/AuthPage.css';

const TABS = [
  { key: 'user',      label: 'Aspirante' },
  { key: 'company',   label: 'Empresa'   },
  { key: 'institute', label: 'Instituto' },
];

// Roles fijos por tipo de organización
const SUBROLES = {
  company:   ['Administrador', 'Reclutador'],
  institute: ['Administrador', 'Profesor'],
};

export default function LoginForm({ onSuccess }) {
  const [loginType,  setLoginType]  = useState('user');
  const [step,       setStep]       = useState(1);
  const [subrole,    setSubrole]    = useState('Administrador');
  const [correo,     setCorreo]     = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error,      setError]      = useState(null);
  const [loading,    setLoading]    = useState(false);

  const handleTypeChange = (type) => {
    setLoginType(type);
    setStep(1);
    setError(null);
    setCorreo('');
    setContrasena('');
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
      // ── Paso 1 empresa/instituto: verificar que el correo existe ──
      if (step === 1 && loginType !== 'user') {
        const result = await checkUserExists({ correo, tipo: loginType });

        if (!result.found) {
          setError('No se encontró ninguna cuenta con ese correo.');
          return;
        }
        // Correo válido → avanzar a selección de rol + contraseña
        setSubrole(SUBROLES[loginType][0]);
        setStep(2);
        return;
      }

      // ── Login aspirante ───────────────────────────────────────
      if (loginType === 'user') {
        const data = await loginAspirante({ correo, contrasena });
        handleAuthSuccess(data);
        return;
      }

      // ── Login empresa / instituto (paso 2) ────────────────────
      const data = await loginOrg({ correo, contrasena, tipo: loginType, subrole });
      handleAuthSuccess(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header">
        <h2 className="auth-title">Login</h2>
        <p className="auth-subtitle">Selecciona tu perfil para ingresar:</p>
      </div>

      {/* Tabs */}
      <div className="auth-tabs">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleTypeChange(key)}
            className={`auth-tab ${loginType === key ? 'auth-tab--active' : 'auth-tab--inactive'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="auth-fields">

        {/* ── Paso 1 ── */}
        {step === 1 && (
          <>
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" />
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Correo Electrónico"
                className="auth-input"
                required
              />
            </div>

            {/* Contraseña solo visible para aspirante en paso 1 */}
            {loginType === 'user' && (
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" />
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="Contraseña"
                  className="auth-input"
                  required
                />
              </div>
            )}

            <div className="auth-forgot">
              <button type="button" className="auth-link">¿Olvidaste tu contraseña?</button>
            </div>
          </>
        )}

        {/* ── Paso 2: selección de rol + contraseña ── */}
        {step === 2 && (
          <>
            <div className="user-found-banner">
              <p className="user-found-label">Usuario Encontrado</p>
              <p className="user-found-text">Selecciona tu rol de ingreso:</p>
              <div className="subrole-grid">
                {SUBROLES[loginType].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSubrole(r)}
                    className={`subrole-btn ${subrole === r ? 'subrole-btn--active' : 'subrole-btn--inactive'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" />
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Contraseña"
                className="auth-input"
                required
              />
            </div>

            <div className="auth-step2-actions">
              <button type="button" onClick={() => { setStep(1); setError(null); }} className="auth-link">
                ← Volver
              </button>
              <button type="button" className="auth-link">¿Olvidaste tu contraseña?</button>
            </div>
          </>
        )}

        {/* Error */}
        {error && <p className="auth-error">{error}</p>}

        {/* Submit */}
        <button type="submit" disabled={loading} className="auth-btn-primary">
          {loading
            ? <span className="auth-spinner" />
            : <>{loginType === 'user' || step === 2 ? 'Ingresar' : 'Continuar'} <ChevronRight size={16} /></>
          }
        </button>
      </form>

      {/* Google — solo aspirante */}
      {loginType === 'user' && (
        <div className="auth-social">
          <div className="auth-divider"><span>o inicia sesión con</span></div>
          <GoogleLogin
            onSuccess={async (response) => {
              try {
                const data = await loginConGoogle(response.credential);
                handleAuthSuccess(data);
              } catch (err) {
                setError(err.message);
              }
            }}
            onError={() => setError('Error al iniciar sesión con Google.')}
            width="350"
            text="signin_with"
            shape="rectangular"
            theme="outline"
          />
        </div>
      )}
    </div>
  );
}