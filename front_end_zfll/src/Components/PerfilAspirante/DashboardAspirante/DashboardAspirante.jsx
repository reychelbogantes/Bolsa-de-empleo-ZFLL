/**
 * DashboardAspirante.jsx
 * Vista principal del Aspirante: búsqueda y listado de vacantes recomendadas.
 * Carga vacantes desde la API en lugar de datos mock.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, Briefcase, CheckCircle2, ExternalLink,
  MapPin, Clock, ChevronRight, Loader,
} from 'lucide-react';
import { getVacantes } from '../../../Services/Aspirantes/aspiranteService';
import './DashboardAspirante.css';

const CANTONES = [
  'Todos los Cantones', 'Cartago', 'Paraíso', 'La Unión',
  'Jiménez', 'Turrialba', 'Alvarado', 'Oreamuno', 'El Guarco',
];

const DashboardAspirante = ({ usuario, perfilCompletado = 0, onApply, onSelectJob }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [canton, setCanton] = useState('');
  const [soloPassantias, setSoloPassantias] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nombre = usuario?.nombre_completo?.split(' ')[0] || 'Aspirante';

  // ── Cargar vacantes desde API ──
  const loadVacantes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (canton && canton !== 'Todos los Cantones') params.canton = canton;
      if (soloPassantias) params.es_pasantia = true;

      const result = await getVacantes(params);
      // La API puede devolver { results: [] } (paginado) o un array directo
      setJobs(Array.isArray(result) ? result : result?.results || []);
    } catch (err) {
      console.error('Error cargando vacantes:', err);
      setError('No se pudieron cargar las vacantes. Intenta de nuevo.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, canton, soloPassantias]);

  useEffect(() => {
    const debounce = setTimeout(() => loadVacantes(), 400);
    return () => clearTimeout(debounce);
  }, [loadVacantes]);

  // ── Map API fields to component fields ──
  const mapJob = (j) => ({
    id: j.id,
    title: j.titulo || j.title || 'Sin título',
    companyName: j.empresa_nombre || j.companyName || j.empresa || 'Empresa',
    location: j.canton || j.location || '',
    contract: j.tipo_contrato || j.contract || '',
    modality: j.modalidad || j.modality || '',
    requirements: j.requisitos_clave || j.requirements || [],
    externalUrl: j.url_externa || j.externalUrl || null,
    description: j.descripcion || j.description || '',
  });

  const mapped = jobs.map(mapJob);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard__header">
        <div>
          <h2 className="dashboard__title">Hola, {nombre} 👋</h2>
          <p className="dashboard__subtitle">
            {loading
              ? 'Buscando vacantes...'
              : <>Hay <strong>{mapped.length}</strong> vacantes que coinciden con tu perfil.</>}
          </p>
        </div>
        <div className="dashboard__badge">
          <CheckCircle2 size={16} />
          Perfil Completo ({perfilCompletado}%)
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

        {loading ? (
          <div className="dashboard__empty">
            <Loader size={36} className="dashboard__spinner" />
            <p>Buscando vacantes...</p>
          </div>
        ) : error ? (
          <div className="dashboard__empty">
            <Briefcase size={36} />
            <p>{error}</p>
            <button className="dashboard__retry-btn" onClick={loadVacantes}>Reintentar</button>
          </div>
        ) : mapped.length === 0 ? (
          <div className="dashboard__empty">
            <Briefcase size={36} />
            <p>No se encontraron vacantes con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="dashboard__grid">
            {mapped.map(job => (
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
                    {job.contract && <span className="job-card__tag">{job.contract}</span>}
                    {job.modality && <span className="job-card__tag">{job.modality}</span>}
                  </div>
                  <div className="job-card__requirements">
                    {(Array.isArray(job.requirements) ? job.requirements : []).slice(0, 2).map(r => (
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
