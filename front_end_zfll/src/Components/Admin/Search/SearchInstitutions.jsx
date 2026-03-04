import { useState, useEffect } from 'react';
import { Search, X, GraduationCap, MapPin, Mail, Phone, Eye } from 'lucide-react';
import Card from '../Card/Card';
import Modal from '../Modal/Modal';
import StatusBadge from '../StatusBadge/StatusBadge';
import { getInstitutions } from '../../../Services/Admin/institutionService';
import styles from './Search.module.css';

const CANTONES = [
  'San José','Escazú','Desamparados','Puriscal','Tarrazú','Aserrí','Mora','Goicoechea',
  'Santa Ana','Alajuelita','Vásquez de Coronado','Acosta','Tibás','Moravia','Montes de Oca',
  'Turrubares','Dota','Curridabat','Pérez Zeledón','León Cortés Castro','Alajuela','San Ramón',
  'Grecia','San Mateo','Atenas','Naranjo','Palmares','Poás','Orotina','San Carlos',
  'Cartago','Paraíso','La Unión','Jiménez','Turrialba','El Guarco',
  'Heredia','Barva','Santo Domingo','Santa Bárbara','San Rafael','San Isidro','Belén','Flores',
  'Liberia','Nicoya','Santa Cruz','Bagaces','Carrillo','Cañas',
  'Puntarenas','Esparza','Buenos Aires','Osa','Quepos','Golfito','Corredores',
  'Limón','Pococí','Siquirres','Talamanca','Matina','Guácimo',
];

const TIPOS = [
  { value: '',              label: 'Todos los tipos' },
  { value: 'universidad',   label: 'Universidad' },
  { value: 'centro_tecnico',label: 'Centro Técnico' },
  { value: 'colegio',       label: 'Colegio' },
  { value: 'instituto',     label: 'Instituto' },
  { value: 'otro',          label: 'Otro' },
];

const STATUS_OPTIONS = [
  { value: '',           label: 'Todos los estados' },
  { value: 'aprobada',   label: 'Aprobada' },
  { value: 'pendiente',  label: 'Pendiente' },
  { value: 'desactivada',label: 'Desactivada' },
];

const typeLabel = (type) =>
  TIPOS.find(t => t.value === type)?.label ?? type?.replace('_', ' ') ?? '';

const SearchInstitutions = () => {
  const [all, setAll]           = useState([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState('');
  const [canton, setCanton]     = useState('');
  const [tipo, setTipo]         = useState('');
  const [status, setStatus]     = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    getInstitutions()
      .then(data => setAll(data))
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  const results = all.filter(i => {
    const q = query.toLowerCase();
    const matchQ = !q ||
      i.name.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      i.contactName?.toLowerCase().includes(q);
    const matchC = !canton || i.location === canton;
    const matchT = !tipo   || i.type === tipo;
    const matchS = !status || i.status === status;
    return matchQ && matchC && matchT && matchS;
  });

  const clearFilters = () => { setQuery(''); setCanton(''); setTipo(''); setStatus(''); };
  const hasFilters = query || canton || tipo || status;

  return (
    <>
      <Card>
        <div className={styles.heroSearch}>
          <div className={styles.heroIcon}><GraduationCap size={20} /></div>
          <input
            className={styles.heroInput}
            placeholder="Buscar por nombre, correo o persona de contacto…"
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
            <label className={styles.filterLabel}>Cantón</label>
            <select className={styles.filterSelect} value={canton} onChange={e => setCanton(e.target.value)}>
              <option value="">Todos los cantones</option>
              {CANTONES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Tipo</label>
            <select className={styles.filterSelect} value={tipo} onChange={e => setTipo(e.target.value)}>
              {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
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
            {loading ? 'Cargando…' : `${results.length} resultado${results.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        <div className={styles.grid}>
          {loading ? (
            <p className={styles.empty}>Cargando instituciones…</p>
          ) : results.length === 0 ? (
            <p className={styles.empty}>No se encontraron instituciones con esos criterios.</p>
          ) : results.map(i => (
            <div key={i.id} className={styles.card} onClick={() => setSelected(i)}>
              <div className={styles.cardHeader}>
                <div className={styles.cardAvatar} style={{ background: '#ede9fe', color: '#7c3aed' }}>
                  {i.name?.[0]?.toUpperCase() ?? 'I'}
                </div>
                <div className={styles.cardTitles}>
                  <span className={styles.cardName}>{i.name}</span>
                  <span className={styles.cardSub}>{typeLabel(i.type) || 'Institución'}</span>
                </div>
                <StatusBadge status={i.status} />
              </div>
              <div className={styles.cardBody}>
                {i.location && <span className={styles.cardMeta}><MapPin size={13} /> {i.location}</span>}
                {i.email && <span className={styles.cardMeta}><Mail size={13} /> {i.email}</span>}
                {i.phone && <span className={styles.cardMeta}><Phone size={13} /> {i.phone}</span>}
              </div>
              <button className={styles.viewBtn}><Eye size={14} /> Ver detalles</button>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Detalle de Institución">
        {selected && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              ['Nombre',           selected.name],
              ['Tipo',             typeLabel(selected.type)],
              ['Cantón',           selected.location],
              ['Teléfono',         selected.phone],
              ['Correo',           selected.email],
              ['Persona Contacto', selected.contactName],
              ['Registro',         selected.registrationDate],
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

export default SearchInstitutions;
