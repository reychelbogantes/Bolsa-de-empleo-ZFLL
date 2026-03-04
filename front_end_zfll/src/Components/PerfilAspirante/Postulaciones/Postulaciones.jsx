/**
 * Postulaciones.jsx
 * Historial de postulaciones del aspirante con estado,
 * compatibilidad y seguimiento de contacto.
 */
import { useState } from 'react';
import { FileText, Clock, Percent, MessageSquare, CheckCircle2 } from 'lucide-react';
import './Postulaciones.css';

/* ─── Helpers ─────────────────────────────────────── */
const SAMPLE_APPS = [
  { id: 1, company: 'Medtronic', role: 'Ing. Calidad Jr.', date: '24 Feb, 2024', status: 'En Revisión', match: 92, contacted: true },
  { id: 2, company: 'Intel',     role: 'Pasantía Sistemas', date: '20 Feb, 2024', status: 'Pendiente',   match: 78, contacted: false },
  { id: 3, company: 'Bayer',     role: 'Operario Producción', date: '15 Feb, 2024', status: 'Visto',     match: 85, contacted: true },
  { id: 4, company: 'Edwards',   role: 'Técnico Logística', date: '10 Feb, 2024', status: 'En Revisión', match: 65, contacted: false },
  { id: 5, company: 'B.Braun',   role: 'Control de Calidad', date: '5 Feb, 2024',  status: 'Rechazado',  match: 54, contacted: false },
];

const STATUS_CONFIG = {
  'Pendiente':   { cls: 'status--pending',   label: 'Pendiente'   },
  'Visto':       { cls: 'status--viewed',    label: 'Visto'       },
  'En Revisión': { cls: 'status--review',    label: 'En Revisión' },
  'Rechazado':   { cls: 'status--rejected',  label: 'Rechazado'   },
  'Aceptado':    { cls: 'status--accepted',  label: 'Aceptado'    },
};

const matchColor = (pct) => pct >= 85 ? 'match--high' : pct >= 70 ? 'match--mid' : 'match--low';

/* ─── Stat Card ───────────────────────────────────── */
const StatCard = ({ label, value, Icon, colorClass, bgClass }) => (
  <div className="post-stat">
    <div className={`post-stat-icon ${bgClass}`}>
      <Icon size={22} className={colorClass} />
    </div>
    <p className="post-stat-label">{label}</p>
    <p className="post-stat-value">{value}</p>
  </div>
);

/* ─── Main Component ──────────────────────────────── */
const Postulaciones = ({ postulaciones = null }) => {
  const apps = postulaciones ?? SAMPLE_APPS;
  const [filter, setFilter] = useState('Todas');

  const FILTERS = ['Todas', 'Pendiente', 'En Revisión', 'Visto', 'Rechazado'];
  const filtered = filter === 'Todas' ? apps : apps.filter(a => a.status === filter);

  const stats = {
    total:    apps.length,
    revision: apps.filter(a => a.status === 'En Revisión').length,
    avgMatch: apps.length ? Math.round(apps.reduce((s, a) => s + a.match, 0) / apps.length) : 0,
    contact:  apps.filter(a => a.contacted).length,
  };

  return (
    <div className="post-wrapper">
      {/* ── Header ── */}
      <div className="post-header">
        <div>
          <h2 className="post-title">Mis Postulaciones</h2>
          <p className="post-sub">Seguimiento de tus aplicaciones y compatibilidad con las empresas.</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="post-stats">
        <StatCard label="Total Postulaciones"   value={stats.total}           Icon={FileText}     colorClass="c-blue"    bgClass="bg-blue" />
        <StatCard label="En Revisión"           value={stats.revision}        Icon={Clock}        colorClass="c-orange"  bgClass="bg-orange" />
        <StatCard label="Compatibilidad Promedio" value={`${stats.avgMatch}%`} Icon={Percent}      colorClass="c-emerald" bgClass="bg-emerald" />
        <StatCard label="Empresas Contactadas"  value={stats.contact}         Icon={MessageSquare} colorClass="c-purple"  bgClass="bg-purple" />
      </div>

      {/* ── Filter pills ── */}
      <div className="post-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`post-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="post-table-wrap">
        <div className="post-table-head-row">
          <h3 className="post-table-title">Historial de Aplicaciones</h3>
          <span className="post-count">{filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="post-empty">
            <FileText size={40} />
            <p>No hay postulaciones con el estado <strong>"{filter}"</strong>.</p>
          </div>
        ) : (
          <div className="post-table-scroll">
            <table className="post-table">
              <thead>
                <tr>
                  <th>Empresa / Puesto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Compatibilidad</th>
                  <th>Contacto</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.id} className="post-row">
                    <td>
                      <div className="post-company-cell">
                        <div className="post-avatar">{app.company[0]}</div>
                        <div>
                          <p className="post-company-name">{app.company}</p>
                          <p className="post-company-role">{app.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="post-date">{app.date}</td>
                    <td>
                      <span className={`post-status ${STATUS_CONFIG[app.status]?.cls || ''}`}>
                        {STATUS_CONFIG[app.status]?.label || app.status}
                      </span>
                    </td>
                    <td>
                      <div className="post-match-cell">
                        <div className="post-match-bar-bg">
                          <div
                            className={`post-match-bar-fill ${matchColor(app.match)}`}
                            style={{ width: `${app.match}%` }}
                          />
                        </div>
                        <span className="post-match-pct">{app.match}%</span>
                      </div>
                    </td>
                    <td>
                      {app.contacted
                        ? <span className="post-contacted"><CheckCircle2 size={13} /> Contactado</span>
                        : <span className="post-no-contact">Sin contacto</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Postulaciones;
