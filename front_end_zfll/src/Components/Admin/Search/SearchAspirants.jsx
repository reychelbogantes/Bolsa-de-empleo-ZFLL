import { useState, useEffect } from 'react';
import { Search, X, Users, MapPin, Mail, Phone, Eye, Calendar } from 'lucide-react';
import Card from '../Card/Card';
import Modal from '../Modal/Modal';
import StatusBadge from '../StatusBadge/StatusBadge';
/* import { getAspirants } from '../../../Services/Admin/aspirantService'; */
import styles from './Search.module.css';
import { mockAspirants } from './mockData';

export const getAspirants = () => Promise.resolve(mockAspirants);


const STATUS_OPTIONS = [
  { value: '',       label: 'Todos los estados' },
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo',label: 'Inactivo' },
];

const SearchAspirants = () => {
  const [all, setAll]           = useState([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState('');
  const [status, setStatus]     = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAspirants()
      .then(data => setAll(data))
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  const results = all.filter(a => {
    const q = query.toLowerCase();
    const matchQ = !q ||
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.phone?.toLowerCase().includes(q);
    const matchS = !status || a.status === status;
    return matchQ && matchS;
  });

  const clearFilters = () => { setQuery(''); setStatus(''); };
  const hasFilters = query || status;

  return (
    <>
      <Card>
        <div className={styles.heroSearch}>
          <div className={styles.heroIcon} style={{ color: '#059669' }}><Users size={20} /></div>
          <input
            className={styles.heroInput}
            placeholder="Buscar por nombre, correo o teléfono…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Estado</label>
            <select className={styles.filterSelect} value={status} onChange={e => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button className={styles.clearAllBtn} onClick={clearFilters}>
              <X size={14} /> Limpiar filtros
            </button>
          )}
          <span className={styles.resultCount}>
            {loading ? 'Cargando…' : `${results.length} aspirante${results.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {loading ? (
            <p className={styles.empty}>Cargando aspirantes…</p>
          ) : results.length === 0 ? (
            <p className={styles.empty}>No se encontraron aspirantes con esos criterios.</p>
          ) : results.map(a => (
            <div key={a.id} className={styles.card} onClick={() => setSelected(a)}>
              <div className={styles.cardHeader}>
                <div
                  className={styles.cardAvatar}
                  style={{ background: '#dcfce7', color: '#166534' }}
                >
                  {a.name?.[0]?.toUpperCase() ?? 'A'}
                </div>
                <div className={styles.cardTitles}>
                  <span className={styles.cardName}>{a.name}</span>
                  <span className={styles.cardSub}>Aspirante</span>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <div className={styles.cardBody}>
                {a.email && <span className={styles.cardMeta}><Mail size={13} /> {a.email}</span>}
                {a.phone && <span className={styles.cardMeta}><Phone size={13} /> {a.phone}</span>}
                {a.registrationDate && (
                  <span className={styles.cardMeta}>
                    <Calendar size={13} /> Registro: {a.registrationDate}
                  </span>
                )}
              </div>
              <button className={styles.viewBtn} style={{ color: '#059669', borderColor: '#bbf7d0' }}>
                <Eye size={14} /> Ver perfil
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Perfil de Aspirante">
        {selected && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              ['Nombre',       selected.name],
              ['Correo',       selected.email],
              ['Teléfono',     selected.phone],
              ['Ubicación',    selected.location],
              ['Registro',     selected.registrationDate],
            ].map(([label, val]) => val ? (
              <div key={label}>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>{label}</p>
                <p style={{ fontWeight: 500, color: '#0f172a', wordBreak: 'break-all' }}>{val}</p>
              </div>
            ) : null)}
            <div style={{ gridColumn: '1/-1' }}>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Estado</p>
              <StatusBadge status={selected.status} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default SearchAspirants;
