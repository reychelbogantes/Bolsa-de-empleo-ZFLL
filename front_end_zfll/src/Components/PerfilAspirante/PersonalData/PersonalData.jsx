/**
 * PersonalData.jsx — estilos fieles al mockup
 */
import { useState } from 'react';
import { User, MapPin, Lock, Upload, Shield } from 'lucide-react';
import './PersonalData.css';

const PROVINCIAS = ['San José','Alajuela','Cartago','Heredia','Guanacaste','Puntarenas','Limón'];

const PersonalData = ({ usuario, onSave, onNotify }) => {
  const [data, setData] = useState({
    idNumber:      usuario?.cedula                              || '',
    firstName:     usuario?.nombre_completo?.split(' ')[0]     || '',
    lastName:      usuario?.nombre_completo?.split(' ').slice(1).join(' ') || '',
    email:         usuario?.email                              || '',
    birthDate:     usuario?.fecha_nacimiento                   || '',
    maritalStatus: usuario?.estado_civil                       || 'Soltero(a)',
    nationality:   usuario?.nacionalidad                       || 'Costarricense',
    phone:         usuario?.telefono                           || '',
    province:      usuario?.provincia                          || 'Cartago',
    canton:        usuario?.canton                             || '',
    district:      usuario?.distrito                           || '',
    address:       usuario?.direccion                          || '',
  });

  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [photoPreview, setPhotoPreview] = useState(null);

  const set = (field) => (e) => setData({ ...data, [field]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave && onSave(data);
    onNotify && onNotify('¡Datos guardados correctamente!');
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.next) {
      onNotify && onNotify('Completa ambos campos de contraseña.');
      return;
    }
    onNotify && onNotify('Solicitud de cambio de contraseña enviada.');
    setPasswords({ current: '', next: '' });
  };

  return (
    <div className="pd-page">

      {/* ── Header ── */}
      <header className="pd-page__header">
        <h2>Datos Personales</h2>
        <p>Mantén tu información actualizada para que las empresas puedan contactarte.</p>
      </header>

      {/* ── Layout ── */}
      <div className="pd-layout">

        {/* ── Columna principal ── */}
        <div className="pd-col-main">

          {/* Información Básica */}
          <div className="pd-card">
            <h3 className="pd-card-title">
              <User size={20} className="pd-card-icon" />
              Información Básica
            </h3>

            <div className="pd-grid">
              <div className="pd-field pd-field--readonly">
                <label>Número de Identificación</label>
                <input type="text" value={data.idNumber} readOnly />
                <span className="pd-hint">No editable</span>
              </div>

              <div className="pd-field pd-field--readonly">
                <label>Correo Electrónico</label>
                <input type="email" value={data.email} readOnly />
                <span className="pd-hint">No editable</span>
              </div>

              <div className="pd-field">
                <label>Nombre(s)</label>
                <input type="text" value={data.firstName} onChange={set('firstName')} />
              </div>

              <div className="pd-field">
                <label>Apellido(s)</label>
                <input type="text" value={data.lastName} onChange={set('lastName')} />
              </div>

              <div className="pd-field">
                <label>Fecha de Nacimiento</label>
                <input type="date" value={data.birthDate} onChange={set('birthDate')} />
              </div>

              <div className="pd-field">
                <label>Estado Civil</label>
                <select value={data.maritalStatus} onChange={set('maritalStatus')}>
                  {['Soltero(a)','Casado(a)','Divorciado(a)','Viudo(a)','Unión Libre'].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="pd-field">
                <label>Nacionalidad</label>
                <input type="text" value={data.nationality} onChange={set('nationality')} />
              </div>

              <div className="pd-field">
                <label>Teléfono</label>
                <input type="tel" value={data.phone} onChange={set('phone')} placeholder="+506 8888-8888" />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="pd-card">
            <h3 className="pd-card-title">
              <MapPin size={20} className="pd-card-icon" />
              Ubicación
            </h3>

            <div className="pd-grid pd-grid--3">
              <div className="pd-field">
                <label>Provincia</label>
                <select value={data.province} onChange={set('province')}>
                  {PROVINCIAS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="pd-field">
                <label>Cantón</label>
                <input type="text" value={data.canton} onChange={set('canton')} />
              </div>
              <div className="pd-field">
                <label>Distrito</label>
                <input type="text" value={data.district} onChange={set('district')} />
              </div>
            </div>

            <div className="pd-field">
              <label>Dirección Exacta</label>
              <textarea
                rows={3}
                value={data.address}
                onChange={set('address')}
                placeholder="Ej: 100m sur de la Basílica de los Ángeles"
              />
            </div>
          </div>
        </div>

        {/* ── Columna aside ── */}
        <div className="pd-col-aside">

          {/* Foto de perfil */}
          <div className="pd-card">
            <h3 className="pd-card-title">
              <User size={20} className="pd-card-icon" />
              Imagen de Foto de Perfil
            </h3>

            <label className="pd-photo-upload">
              {photoPreview ? (
                <img src={photoPreview} alt="Foto de perfil" className="pd-photo-preview" />
              ) : (
                <div className="pd-photo-placeholder">
                  <Upload size={28} />
                  <span>Subir foto</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handlePhoto} hidden />
            </label>

            <div className="pd-info-box">
              <Shield size={12} style={{ flexShrink: 0, marginTop: 1 }} />
              Tu foto de perfil ayuda a las empresas a identificarte mejor durante el proceso de selección.
            </div>
          </div>

          {/* Cambiar contraseña */}
          <div className="pd-card">
            <h3 className="pd-card-title">
              <Lock size={20} className="pd-card-icon" />
              Cambiar Contraseña
            </h3>

            <div className="pd-field">
              <label>Contraseña Actual</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.current}
                onChange={e => setPasswords({ ...passwords, current: e.target.value })}
              />
            </div>

            <div className="pd-field">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.next}
                onChange={e => setPasswords({ ...passwords, next: e.target.value })}
              />
            </div>

            <button className="pd-btn pd-btn--dark" onClick={handlePasswordChange}>
              Actualizar Contraseña
            </button>
          </div>

          {/* Guardar */}
          <button className="pd-btn pd-btn--primary" onClick={handleSave}>
            Guardar Cambios
          </button>

        </div>
      </div>
    </div>
  );
};

export default PersonalData;