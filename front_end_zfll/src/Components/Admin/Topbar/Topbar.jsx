import { Menu, Search, Bell, ChevronRight } from 'lucide-react';
import styles from './Topbar.module.css';

const TAB_LABELS = {
  dashboard: 'Dashboard',
  companies: 'Empresas',
  institutions: 'Instituciones',
  aspirants: 'Aspirantes',
  vacancies: 'Vacantes',
  forms: 'Formularios',
  admins: 'Administradores',
  search_companies: 'Búsqueda de Empresas',
  search_institutions: 'Búsqueda de Instituciones',
  search_aspirants: 'Búsqueda de Aspirantes',
};

const Topbar = ({ activeTab, onMenuToggle }) => (
  <header className={styles.topbar}>
    <div className={styles.left}>
      <button type="button" onClick={onMenuToggle} className={styles.menuBtn}>
        <Menu size={20} />
      </button>
      <div className={styles.breadcrumb}>
        <span>Panel</span>
        <ChevronRight size={14} />
        <span className={styles.breadcrumbActive}>{TAB_LABELS[activeTab] || activeTab}</span>
      </div>
    </div>

    <div className={styles.right}>
      <div className={styles.searchBox}>
        <Search size={16} />
        <input type="text" placeholder="Buscar..." className={styles.searchInput} />
      </div>
      <button type="button" className={styles.iconBtn}>
        <Bell size={20} />
        <span className={styles.notifDot} />
      </button>
    </div>
  </header>
);

export default Topbar;