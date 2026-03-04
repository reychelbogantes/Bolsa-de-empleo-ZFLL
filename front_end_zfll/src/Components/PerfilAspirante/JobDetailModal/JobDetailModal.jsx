/**
 * JobDetailModal.jsx
 * Modal de detalle de vacante para el Aspirante.
 *
 * Props:
 *  - job      : objeto vacante { title, companyName, area, contract, modality,
 *               location, email, description, requirements[], applications, status }
 *  - isOpen   : boolean
 *  - onClose  : fn()
 *  - onApply  : fn(job) — abre el ApplyModal
 */
import { X, MapPin, Briefcase, Clock, Users, ExternalLink, CheckCircle2 } from 'lucide-react';
import './JobDetailModal.css';

const META_ITEMS = (job) => [
  { label: 'Contrato',  value: job.contract  },
  { label: 'Modalidad', value: job.modality  },
  { label: 'Ubicación', value: job.location  },
  { label: 'Área',      value: job.area      },
].filter(m => m.value);

const JobDetailModal = ({
  job     = null,
  isOpen  = false,
  onClose = () => {},
  onApply = () => {},
}) => {
  if (!isOpen || !job) return null;

  const initial = job.companyName?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="jd-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="jd-panel" role="dialog" aria-modal="true">

        {/* ── Header ── */}
        <div className="jd-header">
          <h3 className="jd-header__title">Detalles de la Vacante</h3>
          <button className="jd-close" onClick={onClose} aria-label="Cerrar">
            <X size={22} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="jd-body">

          {/* Company + título */}
          <div className="jd-company">
            <div className="jd-company__avatar">{initial}</div>
            <div className="jd-company__info">
              <h4 className="jd-company__title">{job.title}</h4>
              <p className="jd-company__name">
                {job.companyName}
                {job.area && <> · {job.area}</>}
              </p>
              {job.email && (
                <p className="jd-company__email">{job.email}</p>
              )}
              {job.externalUrl && (
                <a
                  href={job.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jd-ext-link"
                >
                  <ExternalLink size={11} /> Ver en sitio de la empresa
                </a>
              )}
            </div>
          </div>

          {/* Meta grid */}
          <div className="jd-meta-grid">
            {META_ITEMS(job).map(({ label, value }) => (
              <div key={label} className="jd-meta-item">
                <p className="jd-meta-label">{label}</p>
                <p className="jd-meta-value">{value}</p>
              </div>
            ))}
          </div>

          {/* Descripción */}
          {job.description && (
            <div className="jd-section">
              <p className="jd-section__label">Descripción</p>
              <p className="jd-section__text">{job.description}</p>
            </div>
          )}

          {/* Requisitos */}
          {job.requirements?.length > 0 && (
            <div className="jd-section">
              <p className="jd-section__label">Requisitos</p>
              <div className="jd-req-row">
                {job.requirements.map((r) => (
                  <span key={r} className="jd-req-tag">
                    <CheckCircle2 size={11} /> {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {(job.applications != null || job.status) && (
            <div className="jd-stats">
              {job.applications != null && (
                <div className="jd-stat">
                  <Users size={16} className="jd-stat__icon" />
                  <p className="jd-stat__label">Postulantes</p>
                  <p className="jd-stat__value">{job.applications}</p>
                </div>
              )}
              {job.status && (
                <div className="jd-stat">
                  <Clock size={16} className="jd-stat__icon" />
                  <p className="jd-stat__label">Estado</p>
                  <p className="jd-stat__value jd-stat__value--green">{job.status}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="jd-footer">
          <button className="jd-btn jd-btn--cancel" onClick={onClose}>
            Cerrar
          </button>
          <button
            className="jd-btn jd-btn--apply"
            onClick={() => { onClose(); onApply(job); }}
          >
            <Briefcase size={15} />
            Postularme
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
