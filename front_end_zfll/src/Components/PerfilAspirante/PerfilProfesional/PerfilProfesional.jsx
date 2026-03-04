/**
 * PerfilProfesional.jsx
 * Gestión del perfil profesional del aspirante:
 * descripción, carta de presentación, soft/power skills,
 * instituciones, títulos académicos y CV.
 */
import { useState, useRef } from 'react';
import {
  User, Globe, Shield, FileText, Award, Plus, X, Zap,
  Download, Trash2, Upload, CheckCircle, Eye, EyeOff,
} from 'lucide-react';
import './PerfilProfesional.css';

/* ─── Helpers ─────────────────────────────────────── */
const Tag = ({ label, color = 'blue', onRemove, icon }) => (
  <span className={`pp-tag pp-tag--${color}`}>
    {icon && <span className="pp-tag-icon">{icon}</span>}
    {label}
    {onRemove && (
      <button className="pp-tag-remove" onClick={onRemove} aria-label="Eliminar">
        <X size={11} />
      </button>
    )}
  </span>
);

const REGISTERED_INSTITUTIONS = ['TEC', 'INA', 'UCR', 'ULACIT', 'CUC', 'Centro Cultural'];

/* ─── Main Component ──────────────────────────────── */
const PerfilProfesional = ({ perfil = {}, cvVersions = [], titulos = [], onSave, onUploadCV, onDeleteTitulo, onNotify }) => {
  const [isPublic, setIsPublic]     = useState(perfil.visible ?? true);
  const [bio, setBio]               = useState(perfil.resumen_profesional || '');
  const [carta, setCarta]           = useState(perfil.carta_presentacion  || '');
  const [softSkills, setSoftSkills] = useState(perfil.soft_skills || ['Trabajo en equipo', 'Comunicación asertiva', 'Liderazgo']);
  const [powerSkills, setPowerSkills] = useState(perfil.power_skills || ['Pensamiento Crítico', 'Resolución de Problemas', 'Inteligencia Emocional']);
  const [newSoft, setNewSoft]       = useState('');
  const [newPower, setNewPower]     = useState('');
  const [institutions, setInstitutions] = useState(perfil.instituciones || []);
  const [instSearch, setInstSearch]   = useState('');
  const [showInstDrop, setShowInstDrop] = useState(false);
  const cvInputRef = useRef(null);
  const tituloInputRef = useRef(null);

  /* Skills helpers */
  const addSoft  = () => { if (newSoft.trim())  { setSoftSkills([...softSkills, newSoft.trim()]);  setNewSoft(''); } };
  const addPower = () => { if (newPower.trim()) { setPowerSkills([...powerSkills, newPower.trim()]); setNewPower(''); } };

  const addInstitution = (name) => {
    if (!institutions.includes(name)) setInstitutions([...institutions, name]);
    setInstSearch(''); setShowInstDrop(false);
  };

  const filteredInstitutions = REGISTERED_INSTITUTIONS.filter(
    i => i.toLowerCase().includes(instSearch.toLowerCase()) && !institutions.includes(i)
  );

  const handleSave = () => {
    onSave && onSave({ bio, carta, softSkills, powerSkills, institutions, isPublic });
    onNotify && onNotify('¡Perfil profesional actualizado correctamente!');
  };

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file) { onUploadCV && onUploadCV(file); onNotify && onNotify('CV subido exitosamente.'); }
  };

  const handleTituloUpload = (e) => {
    const file = e.target.files[0];
    if (file) { onNotify && onNotify(`Título "${file.name}" cargado.`); }
  };

  return (
    <div className="pp-wrapper">

      {/* ── Hero Banner ── */}
      <div className="pp-hero">
        <div className="pp-hero-content">
          <span className="pp-hero-badge">Talento ZFLL</span>
          <h2 className="pp-hero-title">Perfil Profesional</h2>
          <p className="pp-hero-sub">
            Gestiona tu identidad profesional y haz que las empresas líderes de Cartago te encuentren.
          </p>
        </div>
        <User className="pp-hero-icon" />
      </div>

      {/* ── Main Grid ── */}
      <div className="pp-layout">

        {/* Left column */}
        <div className="pp-main">

          {/* Biography */}
          <div className="pp-card">
            <div className="pp-card-head">
              <h3 className="pp-card-title"><User size={18} /> Biografía Profesional</h3>
              {/* Visibility toggle */}
              <div className="pp-vis-toggle">
                <button
                  className={`pp-vis-btn ${isPublic ? 'active' : ''}`}
                  onClick={() => setIsPublic(true)}
                >
                  <Globe size={13} /> Público
                </button>
                <button
                  className={`pp-vis-btn ${!isPublic ? 'active' : ''}`}
                  onClick={() => setIsPublic(false)}
                >
                  <Shield size={13} /> Privado
                </button>
              </div>
            </div>

            <div className="pp-field">
              <label className="pp-label">Descripción Profesional</label>
              <textarea
                className="pp-textarea"
                rows={4}
                placeholder="Cuéntanos sobre tus intereses, metas y lo que te apasiona de tu carrera..."
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
            </div>

            <div className="pp-field">
              <label className="pp-label">Carta de Presentación</label>
              <textarea
                className="pp-textarea"
                rows={6}
                placeholder="Escribe una carta de presentación para las empresas..."
                value={carta}
                onChange={e => setCarta(e.target.value)}
              />
            </div>

            {/* Soft Skills */}
            <div className="pp-field">
              <div className="pp-field-head">
                <label className="pp-label">Habilidades Blandas (Soft Skills)</label>
              </div>
              <div className="pp-tags-row">
                {softSkills.map(s => (
                  <Tag key={s} label={s} color="blue" onRemove={() => setSoftSkills(softSkills.filter(x => x !== s))} />
                ))}
              </div>
              <div className="pp-add-row">
                <input
                  className="pp-input"
                  placeholder="Nueva habilidad blanda..."
                  value={newSoft}
                  onChange={e => setNewSoft(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSoft()}
                />
                <button className="pp-add-btn" onClick={addSoft}><Plus size={15} /></button>
              </div>
            </div>

            {/* Power Skills */}
            <div className="pp-field">
              <div className="pp-field-head">
                <label className="pp-label">Habilidades de Poder (Power Skills)</label>
              </div>
              <div className="pp-tags-row">
                {powerSkills.map(s => (
                  <Tag key={s} label={s} color="indigo" icon={<Zap size={11} />} onRemove={() => setPowerSkills(powerSkills.filter(x => x !== s))} />
                ))}
              </div>
              <div className="pp-add-row">
                <input
                  className="pp-input"
                  placeholder="Nueva power skill..."
                  value={newPower}
                  onChange={e => setNewPower(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addPower()}
                />
                <button className="pp-add-btn pp-add-btn--indigo" onClick={addPower}><Plus size={15} /></button>
              </div>
            </div>

            {/* Institutions */}
            <div className="pp-field">
              <label className="pp-label">Instituciones Relacionadas</label>
              <div className="pp-inst-box">
                {institutions.map(inst => (
                  <Tag key={inst} label={inst} color="navy" onRemove={() => setInstitutions(institutions.filter(i => i !== inst))} />
                ))}
                <input
                  className="pp-inst-input"
                  placeholder="Busca o agrega una institución..."
                  value={instSearch}
                  onChange={e => { setInstSearch(e.target.value); setShowInstDrop(true); }}
                  onFocus={() => setShowInstDrop(true)}
                  onBlur={() => setTimeout(() => setShowInstDrop(false), 180)}
                  onKeyDown={e => { if (e.key === 'Enter' && instSearch) addInstitution(instSearch); }}
                />
              </div>
              {showInstDrop && instSearch && (
                <div className="pp-dropdown">
                  {filteredInstitutions.map(i => (
                    <button key={i} className="pp-dropdown-item" onMouseDown={() => addInstitution(i)}>
                      {i} <span className="pp-dropdown-badge">Registrada</span>
                    </button>
                  ))}
                  <button className="pp-dropdown-add" onMouseDown={() => addInstitution(instSearch)}>
                    <Plus size={13} /> Agregar "{instSearch}"
                  </button>
                </div>
              )}
            </div>

            <div className="pp-save-row">
              <button className="pp-btn-save" onClick={handleSave}>
                <CheckCircle size={16} /> Guardar Perfil
              </button>
            </div>
          </div>

          {/* Academic Titles */}
          <div className="pp-card">
            <div className="pp-card-head">
              <h3 className="pp-card-title"><Award size={18} /> Títulos Académicos</h3>
            </div>

            <div className="pp-titles-list">
              {titulos.length === 0 ? (
                [
                  { title: 'Bachillerato en Ingeniería en Producción Industrial', institution: 'TEC', year: '2024', file: 'Titulo_Ingenieria.pdf' },
                  { title: 'Técnico en Control de Calidad', institution: 'INA', year: '2021', file: 'Certificado_INA.pdf' },
                ].map((edu, i) => (
                  <div key={i} className="pp-title-item">
                    <div className="pp-title-icon"><Award size={22} /></div>
                    <div className="pp-title-info">
                      <p className="pp-title-name">{edu.title}</p>
                      <p className="pp-title-meta">{edu.institution} · {edu.year}</p>
                      <div className="pp-title-file"><FileText size={11} /> {edu.file}</div>
                    </div>
                    <div className="pp-title-actions">
                      <button className="pp-icon-btn" title="Descargar"><Download size={16} /></button>
                      <button className="pp-icon-btn pp-icon-btn--del" onClick={() => onDeleteTitulo && onDeleteTitulo(i)} title="Eliminar"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))
              ) : titulos.map((edu, i) => (
                <div key={i} className="pp-title-item">
                  <div className="pp-title-icon"><Award size={22} /></div>
                  <div className="pp-title-info">
                    <p className="pp-title-name">{edu.titulo || edu.title}</p>
                    <p className="pp-title-meta">{edu.institution} · {edu.year}</p>
                  </div>
                  <div className="pp-title-actions">
                    <button className="pp-icon-btn pp-icon-btn--del" onClick={() => onDeleteTitulo && onDeleteTitulo(edu.id || i)}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>

            <input ref={tituloInputRef} type="file" accept=".pdf,.jpg,.png" hidden onChange={handleTituloUpload} />
            <button className="pp-dashed-btn" onClick={() => tituloInputRef.current?.click()}>
              <Plus size={16} /> Agregar Título o Certificación (PDF)
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="pp-sidebar">

          {/* Visibility status card */}
          <div className={`pp-vis-card ${isPublic ? 'pp-vis-card--public' : 'pp-vis-card--private'}`}>
            <div className="pp-vis-icon">
              {isPublic ? <Eye size={22} /> : <EyeOff size={22} />}
            </div>
            <div>
              <p className="pp-vis-label">{isPublic ? 'Perfil Público' : 'Perfil Privado'}</p>
              <p className="pp-vis-desc">
                {isPublic
                  ? 'Todas las empresas de ZFLL pueden ver tu perfil completo.'
                  : 'Solo las empresas a las que te postules verán tu información.'}
              </p>
            </div>
          </div>

          {/* CV Management */}
          <div className="pp-card">
            <div className="pp-card-head">
              <h3 className="pp-card-title"><FileText size={18} /> Currículum Vitae</h3>
            </div>
            <div className="pp-cv-list">
              {cvVersions.length === 0 ? (
                <div className="pp-cv-item pp-cv-item--active">
                  <div className="pp-cv-icon"><FileText size={18} /></div>
                  <div className="pp-cv-info">
                    <p className="pp-cv-name">CV_Principal.pdf</p>
                    <p className="pp-cv-meta">Versión predeterminada · Actualizado hace 2 días</p>
                  </div>
                  <CheckCircle size={16} className="pp-cv-check" />
                </div>
              ) : cvVersions.map((cv, i) => (
                <div key={i} className={`pp-cv-item ${cv.es_predeterminado ? 'pp-cv-item--active' : ''}`}>
                  <div className="pp-cv-icon"><FileText size={18} /></div>
                  <div className="pp-cv-info">
                    <p className="pp-cv-name">{cv.nombre_etiqueta || cv.archivo}</p>
                    <p className="pp-cv-meta">{cv.es_predeterminado ? 'Versión predeterminada' : 'Versión alternativa'}</p>
                  </div>
                  {cv.es_predeterminado && <CheckCircle size={16} className="pp-cv-check" />}
                </div>
              ))}
            </div>
            <input ref={cvInputRef} type="file" accept=".pdf" hidden onChange={handleCVUpload} />
            <button className="pp-dashed-btn" onClick={() => cvInputRef.current?.click()}>
              <Upload size={15} /> Subir nueva versión de CV
            </button>
          </div>

          {/* Profile completion hint */}
          <div className="pp-tip-card">
            <p className="pp-tip-title">💡 Consejo</p>
            <p className="pp-tip-text">
              Un perfil completo aumenta en un <strong>60%</strong> las probabilidades de que una empresa te contacte directamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilProfesional;
