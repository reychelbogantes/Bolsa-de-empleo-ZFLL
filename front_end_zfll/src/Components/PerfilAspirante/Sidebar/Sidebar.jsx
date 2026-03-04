/**
 * Sidebar.jsx
 * Menú lateral para el perfil Aspirante.
 */
import { Briefcase, Users, User, FileText, AlertCircle } from 'lucide-react';
import './Sidebar.css';

const MENU_ITEMS = [
  { id: 'dashboard',     label: 'Vacantes',           sub: 'Explorar',  icon: Briefcase },
  { id: 'personal',      label: 'Datos Personales',   sub: 'Mi Cuenta', icon: Users     },
  { id: 'perfil',        label: 'Perfil Profesional', sub: 'Editar',    icon: User      },
  { id: 'postulaciones', label: 'Mis Postulaciones',  sub: 'Historial', icon: FileText  },
];

const Sidebar = ({ activeView, onNavigate, perfilCompletado = 75 }) => (
  <aside className="sidebar">
    {/* Barra de completado de perfil */}
    {/* <div className="sidebar__profile-bar">
      <p className="sidebar__profile-bar-title">Completado del Perfil</p>
      <p className="sidebar__profile-bar-percent">{perfilCompletado}%</p>
      <div className="sidebar__profile-bar-track">
        <div
          className="sidebar__profile-bar-fill"
          style={{ width: `${perfilCompletado}%` }}
        />
      </div>
    </div> */}

    {/* Menú principal */}
    <nav className="sidebar__menu">
      {MENU_ITEMS.map(({ id, label, sub, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`sidebar__item${activeView === id ? ' sidebar__item--active' : ''}`}
        >
          <span className="sidebar__item-icon">
            <Icon size={20} />
          </span>
          <span className="sidebar__item-text">
            <span className="sidebar__item-label">{label}</span>
            <span className="sidebar__item-sub">{sub}</span>
          </span>
        </button>
      ))}
    </nav>

    {/* Footer soporte */}
    <div className="sidebar__footer">
      <div className="sidebar__help-box">
        <span className="sidebar__help-label">Soporte</span>
        <button className="sidebar__help-btn">
          <AlertCircle size={12} />
          Centro de Ayuda
        </button>
      </div>
    </div>
  </aside>
);

export default Sidebar;