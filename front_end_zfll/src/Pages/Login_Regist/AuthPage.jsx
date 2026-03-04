// ============================================================
// AuthPage.jsx
// Página principal: orquesta el panel dividido Login ↔ Register
// ============================================================

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm        from '../../Components/Login_regist/LoginForm';
import RegisterForm     from '../../Components/Login_regist/RegisterForm';
import PendingApproval  from '../../Components/Login_regist/PendingApproval';
import './AuthPage.css';

export default function AuthPage({ onLoginSuccess = () => {}, onBack = () => {} }) {
  const location  = useLocation();
  const initialMode = location.state?.mode ?? 'login'; // 'login' por defecto si no viene state

  const [mode,    setMode]    = useState(initialMode); // 'login' | 'register'
  const [regType, setRegType] = useState('user');      // 'user' | 'company' | 'institute'
  const [pending, setPending] = useState(null);        // null | 'company' | 'institute'

  const isLogin = mode === 'login';

  if (pending) {
    return (
      <PendingApproval
        regType={pending}
        onBack={() => { setPending(null); setMode('login'); onBack?.(); }}
      />
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* ── Panel izquierdo ─────────────────────────────── */}
        <div
          className={`auth-panel ${isLogin ? 'auth-panel--blue auth-panel--curve-right' : 'auth-panel--white'}`}
        >
          {isLogin ? (
            /* Azul en login → invitación a registrarse */
            <div className="auth-side-content">
              <h2 className="auth-side-title">Crea tu cuenta</h2>
              <p className="auth-side-subtitle">¿No tienes cuenta? Regístrate según tu perfil:</p>
              <div className="auth-side-buttons">
                <button
                  onClick={() => { setRegType('user'); setMode('register'); }}
                  className="auth-side-btn-solid"
                >
                  Usuario (Aspirante)
                </button>
                <div className="auth-side-btn-grid">
                  <button onClick={() => { setRegType('company');   setMode('register'); }} className="auth-side-btn-outline">Empresa</button>
                  <button onClick={() => { setRegType('institute'); setMode('register'); }} className="auth-side-btn-outline">Instituto</button>
                </div>
              </div>
            </div>
          ) : (
            /* Blanco en register → formulario de registro */
            <RegisterForm
              regType={regType}
              onSuccess={onLoginSuccess}
              onPendingApproval={setPending}
            />
          )}
        </div>

        {/* ── Panel derecho ────────────────────────────────── */}
        <div
          className={`auth-panel ${!isLogin ? 'auth-panel--blue auth-panel--curve-left' : 'auth-panel--white'}`}
        >
          {!isLogin ? (
            /* Azul en register → invitación a iniciar sesión */
            <div className="auth-side-content">
              <h2 className="auth-side-title">¿Ya tienes cuenta?</h2>
              <p className="auth-side-subtitle">Inicia sesión para acceder a tu panel personalizado.</p>
              <div className="auth-side-buttons">
                <button onClick={() => setMode('login')} className="auth-side-btn-border">
                  Iniciar Sesión
                </button>
                <div className="auth-side-switch">
                  <p className="auth-side-switch-label">Cambiar tipo de registro:</p>
                  {regType !== 'user'      && <button onClick={() => setRegType('user')}      className="auth-side-switch-btn">Registro de Usuario</button>}
                  {regType !== 'company'   && <button onClick={() => setRegType('company')}   className="auth-side-switch-btn">Solicitud Empresa</button>}
                  {regType !== 'institute' && <button onClick={() => setRegType('institute')} className="auth-side-switch-btn">Solicitud Instituto</button>}
                </div>
              </div>
            </div>
          ) : (
            /* Blanco en login → formulario de login */
            <LoginForm onSuccess={onLoginSuccess} />
          )}
        </div>

      </div>
    </div>
  );
}