/**
 * Postulaciones.jsx
 * Historial de postulaciones del aspirante con estado,
 * compatibilidad y seguimiento de contacto.
 * Carga postulaciones desde la API.
 */
import { useState, useEffect } from 'react';
import { FileText, Clock, Percent, MessageSquare, CheckCircle2, Loader } from 'lucide-react';
import { getPostulaciones } from '../../../Services/Aspirantes/aspiranteService';
import './Postulaciones.css';

/* ─── Helpers ─────────────────────────────────────── */
const STATUS_MAP = {
  'pendiente': 'Pendiente',
  'en_revision': 'En Revisión',
  'en_revisión': 'En Revisión',
  'visto': 'Visto',
  'rechazado': 'Rechazado',
  'aceptado': 'Aceptado',
};

const STATUS_CONFIG = {
  'Pendiente': { cls: 'status--pending', label: 'Pendiente' },
  'Visto': { cls: 'status--viewed', label: 'Visto' },
  'En Revisión': { cls: 'status--review', label: 'En Revisión' },
  'Rechazado': { cls: 'status--rejected', label: 'Rechazado' },
  'Aceptado': { cls: 'status--accepted', label: 'Aceptado' },
};

const matchColor = (pct) => pct >= 85 ? 'match--high' : pct >= 70 ? 'match--mid' : 'match--low';

const mapPostulacion = (p) => ({
  id: p.id,
  company: p.empresa_nombre || p.vacante_empresa || 'Empresa',
  role: p.vacante_titulo || p.puesto || 'Puesto',
  date: p.fecha_postulacion
    ? new Date(p.fecha_postulacion).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '',
  status: STATUS_MAP[p.estado_nombre?.toLowerCase()] || STATUS_MAP[p.estado_actual?.toLowerCase()] || p.estado_nombre || p.estado_actual || 'Pendiente',
  match: p.compatibilidad ?? p.match ?? 0,
  contacted: p.contactado ?? p.visto ?? false,
});

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
const Postulaciones = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Todas');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getPostulaciones();
        const list = Array.isArray(result) ? result : result?.results || [];
        setApps(list.map(mapPostulacion));
      } catch (err) {
        console.error('Error cargando postulaciones:', err);
        setError('No se pudieron cargar las postulaciones.');
        setApps([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const FILTERS = ['Todas', 'Pendiente', 'En Revisión', 'Visto', 'Rechazado'];
  const filtered = filter === 'Todas' ? apps : apps.filter(a => a.status === filter);

  const stats = {
    total: apps.length,
    revision: apps.filter(a => a.status === 'En Revisión').length,
    avgMatch: apps.length ? Math.round(apps.reduce((s, a) => s + a.match, 0) / apps.length) : 0,
    contact: apps.filter(a => a.contacted).length,
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
        <StatCard label="Total Postulaciones" value={stats.total} Icon={FileText} colorClass="c-blue" bgClass="bg-blue" />
        <StatCard label="En Revisión" value={stats.revision} Icon={Clock} colorClass="c-orange" bgClass="bg-orange" />
        <StatCard label="Compatibilidad Promedio" value={`${stats.avgMatch}%`} Icon={Percent} colorClass="c-emerald" bgClass="bg-emerald" />
        <StatCard label="Empresas Contactadas" value={stats.contact} Icon={MessageSquare} colorClass="c-purple" bgClass="bg-purple" />
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

        {loading ? (
          <div className="post-empty">
            <Loader size={40} className="post-spinner" />
            <p>Cargando postulaciones...</p>
          </div>
        ) : error ? (
          <div className="post-empty">
            <FileText size={40} />
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="post-empty">
            <FileText size={40} />
            <p>No hay postulaciones{filter !== 'Todas' ? <> con el estado <strong>"{filter}"</strong></> : ''}.</p>
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
