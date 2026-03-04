/**
 * Navbar.jsx
 * Barra de navegación superior para el perfil Aspirante.
 */
import { Bell, Globe, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ usuario, onLogout, onToggleLang, lang }) => {
  const initials = usuario?.nombre_completo
    ? usuario.nombre_completo.charAt(0).toUpperCase()
    : usuario?.email?.charAt(0).toUpperCase() || 'A';

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Brand */}
        <a className="navbar__brand" href="/">
          <div className="navbar__logo-box-wrap">
            <div className="navbar__logo-box">
              ZF
              <span className="navbar__logo-accent" />
            </div>
          </div>
          <div className="navbar__brand-text">
            <p className="navbar__brand-title">Zona Franca</p>
            <p className="navbar__brand-sub">La Lima · Empleo</p>
          </div>
        </a>

        {/* Right actions */}
        <div className="navbar__actions">
          {/* Language toggle */}
          <button className="navbar__lang-btn" onClick={onToggleLang} title="Cambiar idioma">
            <Globe size={14} />
            {lang || 'ES'}
          </button>

          {/* Notifications */}
          <button className="navbar__bell-btn" title="Notificaciones">
            <Bell size={18} />
            <span className="navbar__bell-badge" />
          </button>

          <div className="navbar__divider" />

          {/* User info + avatar */}
          <div className="navbar__user">
            <div className="navbar__user-info">
              <p className="navbar__user-name">{usuario?.nombre_completo || 'Aspirante'}</p>
              <p className="navbar__user-role">Aspirante</p>
            </div>
            <div className="navbar__avatar">{initials}</div>
          </div>

          {/* Logout */}
          <button className="navbar__logout-btn" onClick={onLogout} title="Cerrar sesión">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
