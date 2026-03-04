import { useState, useEffect } from 'react';
import { Building2, GraduationCap, Users, FileText } from 'lucide-react';
import Card from '../Card/Card';
import styles from './Dashboard.module.css';
import { getDashboardStats, getPendingRegistrations, getAuditLogs } from '../../../Services/Admin/auditService.js';
import { MOCK_COMPANIES, MOCK_INSTITUTIONS, MOCK_ASPIRANTS, MOCK_VACANCIES, MOCK_AUDIT } from './constants';

 

const STATS_CONFIG = [
  { key: 'companies',    label: 'Empresas',         icon: Building2,    cls: styles.blue   },
  { key: 'institutions', label: 'Instituciones',     icon: GraduationCap, cls: styles.indigo },
  { key: 'aspirants',    label: 'Aspirantes',        icon: Users,        cls: styles.green  },
  { key: 'vacancies',    label: 'Vacantes Activas',  icon: FileText,     cls: styles.amber  },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    companies: MOCK_COMPANIES.length,
    institutions: MOCK_INSTITUTIONS.length,
    aspirants: MOCK_ASPIRANTS.length,
    vacancies: MOCK_VACANCIES.length,
  });
  const [pending, setPending] = useState(
    [...MOCK_COMPANIES, ...MOCK_INSTITUTIONS].filter(i => i.status === 'pendiente')
  );
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT);

 /*  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {}); // usa fallback mock

    getPendingRegistrations()
      .then(setPending)
      .catch(() => {});

    getAuditLogs({ limit: 4 })
      .then(data => setAuditLogs(data.items || data))
      .catch(() => {});
  }, []); */

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Stats */}
      <div className={styles.grid4}>
        {STATS_CONFIG.map(({ key, label, icon: Icon, cls }) => (
          <Card key={key}>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${cls}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className={styles.statLabel}>{label}</p>
                <p className={styles.statValue}>{stats[key] ?? '—'}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pendientes + Auditoría */}
      <div className={styles.gridMain}>
        <Card>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Registros Pendientes</h3>
            <button className={styles.seeAll}>Ver todos</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((item, i) => (
                <tr key={item.id || i}>
                  <td className={styles.tdName}>{item.name}</td>
                  <td>{'legalId' in item ? 'Empresa' : 'Institución'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className={styles.reviewBtn}>Revisar</button>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>Sin pendientes</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        <Card>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Últimos Cambios</h3>
          </div>
          <div className={styles.auditList}>
            {auditLogs.map((log) => (
              <div key={log.id} className={styles.auditItem}>
                <div className={`${styles.auditDot} ${log.type === 'cambio' ? styles.dotBlue : styles.dotAmber}`} />
                <div>
                  <p className={styles.auditAction}>{log.action}</p>
                  <p className={styles.auditMeta}>
                    <strong>{log.userName}</strong> ({log.userRole})
                  </p>
                  <p className={styles.auditTime}>{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;