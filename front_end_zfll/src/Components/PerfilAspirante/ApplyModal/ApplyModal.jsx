/**
 * ApplyModal.jsx
 * Modal de confirmación de postulación.
 * Props:
 *  - job: objeto con { title, companyName, description, requirements[] }
 *  - cvVersions: array de { id, nombre_etiqueta, es_predeterminado }
 *  - isOpen: boolean
 *  - onClose: fn()
 *  - onSubmit: fn({ cvId, newCvFile, descripcion })
 */
import { useState, useEffect, useRef } from 'react';
import { X, FileText, CheckCircle, Send, MapPin, Briefcase, Upload, Plus } from 'lucide-react';
import './ApplyModal.css';

const SAMPLE_CVS = [
  { id: 1, nombre_etiqueta: 'CV_Principal.pdf',   es_predeterminado: true  }
  
];

const MAX_DESC = 500;

const ApplyModal = ({
  job        = null,
  cvVersions = null,
  isOpen     = false,
  onClose    = () => {},
  onSubmit   = () => {},
}) => {
  const cvs        = cvVersions ?? SAMPLE_CVS;
  const defaultCV  = cvs.find(c => c.es_predeterminado) || cvs[0];

  const [selectedCV,  setSelectedCV]  = useState(defaultCV?.id ?? null);
  const [newCvFile,   setNewCvFile]   = useState(null);       // archivo subido localmente
  const [descripcion, setDescripcion] = useState('');
  const [submitted,   setSubmitted]   = useState(false);
  const fileInputRef = useRef(null);

  /* Reset on open */
  useEffect(() => {
    if (isOpen) {
      setSelectedCV(defaultCV?.id ?? null);
      setNewCvFile(null);
      setDescripcion('');
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen || !job) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewCvFile(file);
    setSelectedCV(null); // deseleccionar CV guardado al subir uno nuevo
  };

  const handleSelectSaved = (id) => {
    setSelectedCV(id);
    setNewCvFile(null); // limpiar archivo nuevo si elige uno guardado
  };

  const canSubmit = selectedCV !== null || newCvFile !== null;

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit({ cvId: selectedCV, newCvFile, descripcion });
    setTimeout(() => onClose(), 1800);
  };

  return (
    <div className="am-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="am-panel" role="dialog" aria-modal="true" aria-label="Postulación">

        {/* ── Header ── */}
        <div className="am-header">
          <div className="am-job-meta">
            <div className="am-company-avatar">{job.companyName?.[0] ?? '?'}</div>
            <div>
              <h3 className="am-job-title">{job.title}</h3>
              <p className="am-company-name">{job.companyName}</p>
              {job.location && (
                <p className="am-location"><MapPin size={11} /> {job.location}</p>
              )}
            </div>
          </div>
          <button className="am-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        </div>

        {/* ── Body ── */}
        {submitted ? (
          <div className="am-success">
            <div className="am-success-icon"><CheckCircle size={42} /></div>
            <p className="am-success-title">¡Postulación enviada!</p>
            <p className="am-success-sub">
              Tu solicitud fue enviada a <strong>{job.companyName}</strong>.<br />
              Te notificaremos cuando haya novedades.
            </p>
          </div>
        ) : (
          <>
            <div className="am-body">

              {/* Job description */}
              {job.description && (
                <div className="am-section">
                  <h4 className="am-section-title"><Briefcase size={14} /> Descripción del puesto</h4>
                  <p className="am-desc">{job.description}</p>
                </div>
              )}

              {/* Requirements */}
              {job.requirements?.length > 0 && (
                <div className="am-section">
                  <h4 className="am-section-title">Requisitos clave</h4>
                  <div className="am-req-row">
                    {job.requirements.map(r => (
                      <span key={r} className="am-req-tag">{r}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Descripción personal ── */}
              <div className="am-desc-section">
                <h4 className="am-desc-title">
                  Preséntate brevemente
                  <span className="am-desc-optional">Opcional</span>
                </h4>
                <p className="am-desc-hint">
                  Escribe 2–3 oraciones sobre por qué eres el candidato ideal para este puesto.
                </p>
                <div className="am-textarea-wrap">
                  <textarea
                    className="am-textarea"
                    rows={3}
                    maxLength={MAX_DESC}
                    placeholder="Ej: Soy estudiante de último año de Ingeniería Industrial con experiencia en control de calidad. Me apasiona la mejora continua y tengo disponibilidad inmediata..."
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                  />
                  <span className={`am-char-count ${descripcion.length >= MAX_DESC * 0.9 ? 'am-char-count--warn' : ''}`}>
                    {descripcion.length}/{MAX_DESC}
                  </span>
                </div>
              </div>

              {/* ── CV Selection ── */}
              <div className="am-cv-section">
                <h4 className="am-cv-title"><FileText size={15} /> Selecciona tu CV</h4>

                {/* Saved CVs */}
                <div className="am-cv-list">
                  {cvs.map(cv => (
                    <label
                      key={cv.id}
                      className={`am-cv-option ${selectedCV === cv.id ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="cv-select"
                        checked={selectedCV === cv.id}
                        onChange={() => handleSelectSaved(cv.id)}
                      />
                      <div className="am-cv-icon"><FileText size={16} /></div>
                      <div className="am-cv-info">
                        <p className="am-cv-name">{cv.nombre_etiqueta}</p>
                        <p className="am-cv-meta">
                          {cv.es_predeterminado ? 'Versión predeterminada' : 'Versión alternativa'}
                        </p>
                      </div>
                      {selectedCV === cv.id && <CheckCircle size={16} className="am-cv-check" />}
                    </label>
                  ))}
                </div>

                {/* Divider */}
                <div className="am-cv-divider">
                  <span>o</span>
                </div>

                {/* Upload new CV */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={handleFileChange}
                />

                {newCvFile ? (
                  <div className="am-cv-new-preview">
                    <div className="am-cv-new-file">
                      <div className="am-cv-icon am-cv-icon--new"><FileText size={16} /></div>
                      <div className="am-cv-info">
                        <p className="am-cv-name">{newCvFile.name}</p>
                        <p className="am-cv-meta">
                          {(newCvFile.size / 1024).toFixed(0)} KB · Nuevo archivo
                        </p>
                      </div>
                      <CheckCircle size={16} className="am-cv-check" />
                    </div>
                    <button
                      className="am-cv-change-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Cambiar archivo
                    </button>
                  </div>
                ) : (
                  <button
                    className="am-cv-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={15} />
                    Subir un CV diferente
                    <span className="am-cv-upload-formats">PDF, DOC, DOCX</span>
                  </button>
                )}
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="am-footer">
              <button className="am-btn am-btn--cancel" onClick={onClose}>Cancelar</button>
              <button className="am-btn am-btn--submit" onClick={handleSubmit} disabled={!canSubmit}>
                <Send size={15} /> Confirmar Postulación
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;