// Login.jsx — Pantalla de autenticación del panel admin
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../Services/Login_Admin/adminService';
import styles from './Login.module.css';

/* ── Iconos inline (sin dependencia extra) ── */
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconAlertCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ══════════════════════════════════════════════════ */
const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await loginAdmin(email.trim(), password);
      const user = result.user ?? result;

      // Guardar usuario en localStorage para uso en AdminPanel
      localStorage.setItem('admin_user', JSON.stringify(user));

      // Llamar onLogin si el padre lo proporcionó (opcional)
      if (typeof onLogin === 'function') {
        try { onLogin(user); } catch (_) { /* ignorar errores del callback */ }
      }

      // Navegar al panel siempre
      navigate('/PanelAdmin');

    } catch (err) {
      const isNetworkError = !err?.response;
      const msg = isNetworkError
        ? 'No se puede conectar al servidor. Verifica que el backend esté corriendo en localhost:8000.'
        : (err?.response?.data?.detail
            || err?.response?.data?.non_field_errors?.[0]
            || 'Credenciales incorrectas. Verifica tu correo y contraseña.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoWrap}>
            <IconShield className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>Panel Administrativo</h1>
          <p className={styles.subtitle}>Ingresa tus credenciales para continuar</p>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="admin-email">
              Correo electrónico
            </label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}><IconMail /></span>
              <input
                id="admin-email"
                type="email"
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                placeholder="admin@ejemplo.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                autoComplete="email"
                autoFocus
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="admin-password">
              Contraseña
            </label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}><IconLock /></span>
              <input
                id="admin-password"
                type={showPwd ? 'text' : 'password'}
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPwd(v => !v)}
                tabIndex={-1}
                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPwd ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <IconAlertCircle />
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className={styles.btn} disabled={loading}>
            <span className={styles.btnInner}>
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Verificando...
                </>
              ) : (
                <>
                  Ingresar al panel
                  <IconArrowRight />
                </>
              )}
            </span>
          </button>
        </form>

        <p className={styles.note}>
          Acceso restringido · Solo personal autorizado
        </p>
      </div>
    </div>
  );
};

export default Login;