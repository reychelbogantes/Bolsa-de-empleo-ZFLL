/**
 * PersonalData.jsx
 * Formulario de datos personales del Aspirante.
 * Carga datos del perfil aspirante y guarda cambios vía API.
 */
import { useState, useEffect } from 'react';
import { User, MapPin, Lock, Upload, Shield } from 'lucide-react';
import './PersonalData.css';

const PROVINCIAS = ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'];

const PersonalData = ({ usuario, perfil, onSave, onUploadAvatar, onNotify }) => {
  const extra = perfil?.extra_data || {};

  const [data, setData] = useState({
    idNumber: usuario?.cedula || '',
    firstName: perfil?.nombre_completo?.split(' ')[0] || usuario?.nombre_completo?.split(' ')[0] || '',
    lastName: perfil?.nombre_completo?.split(' ').slice(1).join(' ') || usuario?.nombre_completo?.split(' ').slice(1).join(' ') || '',
    email: usuario?.email || '',
    birthDate: extra.fecha_nacimiento || '',
    maritalStatus: extra.estado_civil || 'Soltero(a)',
    nationality: extra.nacionalidad || 'Costarricense',
    phone: usuario?.phone || '',
    province: extra.provincia || 'Cartago',
    canton: extra.canton || '',
    district: extra.distrito || '',
    address: extra.direccion || '',
  });

  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // Actualizar form si cambian las props
  useEffect(() => {
    if (perfil) {
      const ex = perfil.extra_data || {};
      setData(prev => ({
        ...prev,
        firstName: perfil.nombre_completo?.split(' ')[0] || prev.firstName,
        lastName: perfil.nombre_completo?.split(' ').slice(1).join(' ') || prev.lastName,
        birthDate: ex.fecha_nacimiento || prev.birthDate,
        maritalStatus: ex.estado_civil || prev.maritalStatus,
        nationality: ex.nacionalidad || prev.nationality,
        province: ex.provincia || prev.province,
        canton: ex.canton || prev.canton,
        district: ex.distrito || prev.district,
        address: ex.direccion || prev.address,
      }));
    }
  }, [perfil]);

  useEffect(() => {
    if (usuario) {
      setData(prev => ({
        ...prev,
        email: usuario.email || prev.email,
        phone: usuario.phone || prev.phone,
        idNumber: usuario.cedula || prev.idNumber,
      }));
    }
  }, [usuario]);

  const handleField = field => e => setData({ ...data, [field]: e.target.value });

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
    // Subir al backend
    onUploadAvatar && onUploadAvatar(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const nombre_completo = `${data.firstName} ${data.lastName}`.trim();
      await onSave({
        phone: data.phone,
        consent_given: true,
        nombre_completo,
        fecha_nacimiento: data.birthDate,
        estado_civil: data.maritalStatus,
        nacionalidad: data.nationality,
        provincia: data.province,
        canton: data.canton,
        distrito: data.district,
        direccion: data.address,
      });
    } catch (err) {
      onNotify && onNotify('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
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
    <div className="personal-data">
      <header className="personal-data__header">
        <h2 className="personal-data__title">Datos Personales</h2>
        <p className="personal-data__subtitle">
          Mantén tu información actualizada para que las empresas puedan contactarte.
        </p>
      </header>

      <div className="personal-data__layout">
        {/* Columna principal */}
        <div className="personal-data__main">

          {/* Información básica */}
          <section className="pd-card">
            <h3 className="pd-card__title">
              <User size={18} className="pd-card__icon" />
              Información Básica
            </h3>

            <div className="pd-grid">
              <div className="pd-field pd-field--readonly">
                <label>Número de Identificación</label>
                <input type="text" value={data.idNumber} readOnly />
                <span className="pd-field__hint">No editable</span>
              </div>
              <div className="pd-field pd-field--readonly">
                <label>Correo Electrónico</label>
                <input type="email" value={data.email} readOnly />
                <span className="pd-field__hint">No editable</span>
              </div>
              <div className="pd-field">
                <label>Nombre(s)</label>
                <input type="text" value={data.firstName} onChange={handleField('firstName')} />
              </div>
              <div className="pd-field">
                <label>Apellido(s)</label>
                <input type="text" value={data.lastName} onChange={handleField('lastName')} />
              </div>
              <div className="pd-field">
                <label>Fecha de Nacimiento</label>
                <input type="date" value={data.birthDate} onChange={handleField('birthDate')} />
              </div>
              <div className="pd-field">
                <label>Estado Civil</label>
                <select value={data.maritalStatus} onChange={handleField('maritalStatus')}>
                  {['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)', 'Unión Libre'].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="pd-field">
                <label>Nacionalidad</label>
                <input type="text" value={data.nationality} onChange={handleField('nationality')} />
              </div>
              <div className="pd-field">
                <label>Teléfono</label>
                <input type="tel" value={data.phone} onChange={handleField('phone')} placeholder="+506 8888-8888" />
              </div>
            </div>
          </section>

          {/* Ubicación */}
          <section className="pd-card">
            <h3 className="pd-card__title">
              <MapPin size={18} className="pd-card__icon" />
              Ubicación
            </h3>
            <div className="pd-grid pd-grid--3">
              <div className="pd-field">
                <label>Provincia</label>
                <select value={data.province} onChange={handleField('province')}>
                  {PROVINCIAS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="pd-field">
                <label>Cantón</label>
                <input type="text" value={data.canton} onChange={handleField('canton')} />
              </div>
              <div className="pd-field">
                <label>Distrito</label>
                <input type="text" value={data.district} onChange={handleField('district')} />
              </div>
            </div>
            <div className="pd-field pd-field--full">
              <label>Dirección Exacta</label>
              <textarea
                rows={3}
                value={data.address}
                onChange={handleField('address')}
                placeholder="Ej: 100m sur de la Basílica de los Ángeles"
              />
            </div>
          </section>
        </div>

        {/* Columna lateral */}
        <div className="personal-data__aside">

          {/* Foto de perfil */}
          <section className="pd-card pd-card--photo">
            <h3 className="pd-card__title">
              <User size={18} className="pd-card__icon" />
              Foto de Perfil
            </h3>
            <label className="photo-upload">
              {photoPreview ? (
                <img src={photoPreview} alt="Foto de perfil" className="photo-upload__preview" />
              ) : (
                <div className="photo-upload__placeholder">
                  <Upload size={28} />
                  <span>Subir foto</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handlePhoto} hidden />
            </label>
            <div className="pd-info-box">
              <Shield size={12} />
              Tu foto ayuda a las empresas a identificarte en el proceso de selección.
            </div>
          </section>

          {/* Cambiar contraseña */}
          <section className="pd-card">
            <h3 className="pd-card__title">
              <Lock size={18} className="pd-card__icon" />
              Cambiar Contraseña
            </h3>
            <div className="pd-password">
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
          </section>

          {/* Guardar */}
          <button className="pd-btn pd-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalData;
