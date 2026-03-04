/**
 * DashboardAspirante.jsx
 * Vista principal del Aspirante: búsqueda y listado de vacantes recomendadas.
 */
import { useState } from 'react';
import {
  Search, Filter, Briefcase, CheckCircle2, ExternalLink,
  MapPin, Clock, ChevronRight,
} from 'lucide-react';
import './DashboardAspirante.css';

const CANTONES = [
  'Todos los Cantones', 'Cartago', 'Paraíso', 'La Unión',
  'Jiménez', 'Turrialba', 'Alvarado', 'Oreamuno', 'El Guarco',
];

const MOCK_JOBS = [
  {
    id: 1,
    title: 'Ingeniero de Calidad Jr.',
    companyName: 'Medtronic',
    location: 'Cartago',
    contract: 'Tiempo Completo',
    modality: 'Presencial',
    requirements: ['Ingeniería Industrial', 'Inglés B2', 'ISO 13485'],
    externalUrl: null,
  },
  {
    id: 2,
    title: 'Pasantía en Sistemas',
    companyName: 'Intel',
    location: 'La Unión',
    contract: 'Pasantía',
    modality: 'Híbrido',
    requirements: ['Python', 'Redes Básicas', 'Último año'],
    externalUrl: 'https://intel.com/careers',
  },
  {
    id: 3,
    title: 'Técnico Electromecánico',
    companyName: 'Bayer',
    location: 'Cartago',
    contract: 'Tiempo Completo',
    modality: 'Presencial',
    requirements: ['Electromecánica', 'PLC', 'Disponibilidad de turnos'],
    externalUrl: null,
  },
  {
    id: 4,
    title: 'Analista de Datos Jr.',
    companyName: 'Edwards',
    location: 'Oreamuno',
    contract: 'Medio Tiempo',
    modality: 'Remoto',
    requirements: ['Excel Avanzado', 'Power BI', 'Estadística'],
    externalUrl: null,
  },
];

const DashboardAspirante = ({ usuario, onApply, onSelectJob }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [canton, setCanton] = useState('');
  const [soloPassantias, setSoloPassantias] = useState(false);

  const nombre = usuario?.nombre_completo?.split(' ')[0] || 'Aspirante';

  const filtered = MOCK_JOBS.filter(j => {
    const matchSearch =
      !searchQuery ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCanton =
      !canton || canton === 'Todos los Cantones' || j.location === canton;
    const matchPasantia =
      !soloPassantias || j.contract === 'Pasantía';
    return matchSearch && matchCanton && matchPasantia;
  });

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard__header">
        <div>
          <h2 className="dashboard__title">Hola, {nombre} 👋</h2>
          <p className="dashboard__subtitle">
            Hay <strong>{filtered.length}</strong> vacantes que coinciden con tu perfil.
          </p>
        </div>
        <div className="dashboard__badge">
          <CheckCircle2 size={16} />
          Perfil Completo (90%)
        </div>
      </header>

      {/* Buscador */}
      <div className="dashboard__search-box">
        <div className="dashboard__search-input-wrap">
          <Search className="dashboard__search-icon" size={18} />
          <input
            type="text"
            placeholder="Buscar por puesto, empresa o palabra clave..."
            className="dashboard__search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="dashboard__search-filters">
          <select
            className="dashboard__select"
            value={canton}
            onChange={e => setCanton(e.target.value)}
          >
            {CANTONES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            className={`dashboard__filter-btn${soloPassantias ? ' dashboard__filter-btn--active' : ''}`}
            onClick={() => setSoloPassantias(!soloPassantias)}
          >
            <Filter size={14} />
            Pasantías
          </button>
        </div>
      </div>

      {/* Listado */}
      <section className="dashboard__vacantes">
        <div className="dashboard__section-head">
          <h3 className="dashboard__section-title">
            <Briefcase size={18} className="dashboard__section-icon" />
            Vacantes Recomendadas
          </h3>
          <button className="dashboard__ver-todas">Ver todas <ChevronRight size={14} /></button>
        </div>

        {filtered.length === 0 ? (
          <div className="dashboard__empty">
            <Briefcase size={36} />
            <p>No se encontraron vacantes con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="dashboard__grid">
            {filtered.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-card__avatar">{job.companyName[0]}</div>
                <div className="job-card__body">
                  <div className="job-card__top">
                    <h4 className="job-card__title">{job.title}</h4>
                    {job.externalUrl && (
                      <span className="job-card__ext-badge">
                        <ExternalLink size={10} /> Externo
                      </span>
                    )}
                  </div>
                  <p className="job-card__company">
                    {job.companyName}
                    <span className="job-card__dot">·</span>
                    <MapPin size={11} /> {job.location}
                  </p>
                  <div className="job-card__meta">
                    <span className="job-card__tag">{job.contract}</span>
                    <span className="job-card__tag">{job.modality}</span>
                  </div>
                  <div className="job-card__requirements">
                    {job.requirements.slice(0, 2).map(r => (
                      <span key={r} className="job-card__req">{r}</span>
                    ))}
                  </div>
                </div>
                <div className="job-card__actions">
                  <button
                    className="job-card__btn-detail"
                    onClick={() => onSelectJob && onSelectJob(job)}
                  >
                    Detalles
                  </button>
                  <button
                    className="job-card__btn-apply"
                    onClick={() => onApply && onApply(job)}
                  >
                    Postularme
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardAspirante;
