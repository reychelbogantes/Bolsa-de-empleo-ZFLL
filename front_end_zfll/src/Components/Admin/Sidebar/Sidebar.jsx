import {
  LayoutDashboard, Building2, GraduationCap, Users,
  FileText, Briefcase, Shield, Search, LogOut,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const MENU_ITEMS = [
  { id: 'dashboard',            label: 'Dashboard',                icon: LayoutDashboard },
  { id: 'companies',            label: 'Empresas',                 icon: Building2 },
  { id: 'institutions',         label: 'Instituciones',            icon: GraduationCap },
  { id: 'aspirants',            label: 'Aspirantes',               icon: Users },
  { id: 'vacancies',            label: 'Vacantes',                 icon: Briefcase,     badgeKey: 'vacancies' },
  { id: 'forms',                label: 'Formularios',              icon: FileText,      badgeKey: 'forms' },
  { id: 'admins',               label: 'Administradores',          icon: Shield },
  { id: 'search_companies',     label: 'Búsqueda Empresas',        icon: Search },
  { id: 'search_institutions',  label: 'Búsqueda Instituciones',   icon: GraduationCap },
  { id: 'search_aspirants',     label: 'Búsqueda Aspirantes',      icon: Users },
];

/**
 * @param {{ activeTab, onTabChange, isOpen, currentUser, pendingCounts }} props
 * pendingCounts = { vacancies: number, forms: number }
 */
const Sidebar = ({ activeTab, onTabChange, isOpen, currentUser, pendingCounts = {} }) => {
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  const handleLogout = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/login';
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>ZF</div>
        <span className={styles.logoText}>ZFLL Admin</span>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {MENU_ITEMS.map(({ id, label, icon: Icon, badgeKey }) => {
          const isActive = activeTab === id;
          const count = badgeKey ? (pendingCounts[badgeKey] ?? 0) : 0;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <div className={styles.navItemContent}>
                <Icon size={20} />
                <span className={styles.navLabel}>{label}</span>
              </div>
              {count > 0 && (
                <span className={`${styles.badge} ${isActive ? styles.badgeActive : ''}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className={styles.userName}>{currentUser?.name || 'Admin'}</p>
            <p className={styles.userEmail}>{currentUser?.email || ''}</p>
          </div>
        </div>
        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
