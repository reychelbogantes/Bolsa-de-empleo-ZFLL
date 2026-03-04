/**
 * PerfilProfesional.jsx
 * Gestión del perfil profesional del aspirante:
 * descripción, carta de presentación, soft/power skills,
 * instituciones, títulos académicos y CV.
 * Conectado con la API — sin datos mock.
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
const PerfilProfesional = ({ perfil = {}, cvVersions = [], titulos = [], onSave, onUploadCV, onUploadTitulo, onDeleteTitulo, onNotify }) => {
  const extra = perfil?.extra_data || {};

  const [isPublic, setIsPublic] = useState(extra.visible ?? true);
  const [bio, setBio] = useState(perfil.resumen_profesional || '');
  const [carta, setCarta] = useState(extra.carta_presentacion || '');
  const [softSkills, setSoftSkills] = useState(extra.soft_skills || []);
  const [powerSkills, setPowerSkills] = useState(extra.power_skills || []);
  const [newSoft, setNewSoft] = useState('');
  const [newPower, setNewPower] = useState('');
  const [institutions, setInstitutions] = useState(extra.instituciones || []);
  const [instSearch, setInstSearch] = useState('');
  const [showInstDrop, setShowInstDrop] = useState(false);
  const [saving, setSaving] = useState(false);
  const cvInputRef = useRef(null);
  const tituloInputRef = useRef(null);

  /* Skills helpers */
  const addSoft = () => { if (newSoft.trim()) { setSoftSkills([...softSkills, newSoft.trim()]); setNewSoft(''); } };
  const addPower = () => { if (newPower.trim()) { setPowerSkills([...powerSkills, newPower.trim()]); setNewPower(''); } };

  const addInstitution = (name) => {
    if (!institutions.includes(name)) setInstitutions([...institutions, name]);
    setInstSearch(''); setShowInstDrop(false);
  };

  const filteredInstitutions = REGISTERED_INSTITUTIONS.filter(
    i => i.toLowerCase().includes(instSearch.toLowerCase()) && !institutions.includes(i)
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ bio, carta, softSkills, powerSkills, institutions, isPublic });
    } catch (err) {
      onNotify && onNotify('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file && onUploadCV) onUploadCV(file);
    e.target.value = ''; // reset para permitir subir el mismo archivo
  };

  const handleTituloUpload = (e) => {
    const file = e.target.files[0];
    if (file && onUploadTitulo) onUploadTitulo(file);
    e.target.value = '';
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
              <button className="pp-btn-save" onClick={handleSave} disabled={saving}>
                <CheckCircle size={16} /> {saving ? 'Guardando...' : 'Guardar Perfil'}
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
                <div className="pp-empty-titles">
                  <Award size={32} />
                  <p>No tienes títulos académicos registrados.</p>
                  <p className="pp-empty-hint">Sube tus títulos o certificaciones para fortalecer tu perfil.</p>
                </div>
              ) : titulos.map((edu) => (
                <div key={edu.id} className="pp-title-item">
                  <div className="pp-title-icon"><Award size={22} /></div>
                  <div className="pp-title-info">
                    <p className="pp-title-name">{edu.nombre_original || edu.archivo || 'Documento'}</p>
                    <p className="pp-title-meta">{edu.tipo_documento || 'Certificado'} · {edu.fecha_creacion ? new Date(edu.fecha_creacion).toLocaleDateString() : ''}</p>
                  </div>
                  <div className="pp-title-actions">
                    {edu.archivo && (
                      <a href={edu.archivo} target="_blank" rel="noopener noreferrer" className="pp-icon-btn" title="Descargar">
                        <Download size={16} />
                      </a>
                    )}
                    <button className="pp-icon-btn pp-icon-btn--del" onClick={() => onDeleteTitulo && onDeleteTitulo(edu.id)} title="Eliminar"><Trash2 size={16} /></button>
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
                <div className="pp-empty-titles" style={{ padding: '1rem' }}>
                  <FileText size={28} />
                  <p>No tienes CVs registrados. Sube tu primer CV.</p>
                </div>
              ) : cvVersions.map((cv) => (
                <div key={cv.id} className={`pp-cv-item ${cv.es_predeterminado ? 'pp-cv-item--active' : ''}`}>
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
