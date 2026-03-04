import { useState, useEffect } from 'react';
import { Search, Plus, Edit3, CheckCircle, Clock } from 'lucide-react';
import Card from '../Card/Card';
import Modal from '../Modal/Modal';
import StatusBadge from '../StatusBadge/StatusBadge';
import styles from './Institutions.module.css';
import {
  getInstitutions,
  createInstitution,
  updateInstitution,
  updateInstitutionStatus,
} from '../../../Services/Admin/institutionService';

const CANTONES = [
  'San José','Escazú','Desamparados','Puriscal','Tarrazú','Aserrí','Mora','Goicoechea',
  'Santa Ana','Alajuelita','Vásquez de Coronado','Acosta','Tibás','Moravia','Montes de Oca',
  'Turrubares','Dota','Curridabat','Pérez Zeledón','León Cortés Castro','Alajuela','San Ramón',
  'Grecia','San Mateo','Atenas','Naranjo','Palmares','Poás','Orotina','San Carlos','Zarcero',
  'Sarchí','Upala','Los Chiles','Guatuso','Río Cuarto','Cartago','Paraíso','La Unión',
  'Jiménez','Turrialba','Alvarado','Oreamuno','El Guarco','Heredia','Barva','Santo Domingo',
  'Santa Bárbara','San Rafael','San Isidro','Belén','Flores','San Pablo','Sarapiquí',
  'Liberia','Nicoya','Santa Cruz','Bagaces','Carrillo','Cañas','Abangares','Tilarán',
  'Nandayure','La Cruz','Hojancha','Puntarenas','Esparza','Buenos Aires','Montes de Oro',
  'Osa','Quepos','Golfito','Coto Brus','Parrita','Corredores','Garabito','Puerto Viejo',
  'Limón','Pococí','Siquirres','Talamanca','Matina','Guácimo',
];

const TIPOS = [
  { value: 'universidad',    label: 'Universidad' },
  { value: 'centro_tecnico', label: 'Centro Técnico' },
  { value: 'colegio',        label: 'Colegio' },
  { value: 'instituto',      label: 'Instituto' },
  { value: 'otro',           label: 'Otro' },
];

const Institutions = () => {
  const [institutions, setInstitutions]   = useState([]);   // ← inicia vacío, solo datos reales
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [selected, setSelected]           = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen]       = useState(false);
  const [isNewOpen, setIsNewOpen]         = useState(false);
  const [form, setForm]                   = useState({});
  const [approveOnCreate, setApproveOnCreate] = useState(false);
  const [saving, setSaving]               = useState(false);
  const [error, setError]                 = useState('');

  useEffect(() => {
    setLoading(true);
    getInstitutions()
      .then(data => setInstitutions(data))
      .catch(() => setInstitutions([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = institutions.filter(i =>
    !search ||
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.location.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  const field = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleCreate = async () => {
    if (!form.email || !form.password || !form.name) {
      setError('Nombre, Correo y Contraseña son obligatorios.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await createInstitution(form, approveOnCreate);
      const updated = await getInstitutions();
      setInstitutions(updated);
      setIsNewOpen(false);
      setForm({});
      setApproveOnCreate(false);
    } catch (e) {
      const msg = e?.response?.data?.detail
        || e?.response?.data?.email?.[0]
        || 'Error al crear la institución.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const updated = await updateInstitution(selected.id, {
        nombre:   form.name,
        ubicacion: form.location,
      });
      setInstitutions(prev => prev.map(i => i.id === updated.id ? updated : i));
      setIsEditOpen(false);
    } catch {} finally { setSaving(false); }
  };

  const handleStatusChange = async (activa) => {
    try {
      const updated = await updateInstitutionStatus(selected.id, activa);
      setInstitutions(prev => prev.map(i => i.id === updated.id ? updated : i));
      setSelected(updated);
    } catch {}
  };

  const typeLabel = (type) =>
    TIPOS.find(t => t.value === type)?.label ?? type?.replace('_', ' ') ?? '';

  return (
    <>
      <Card>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              className={styles.searchInput}
              placeholder="Buscar institución..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className={styles.btnPrimary}
            onClick={() => { setForm({}); setError(''); setApproveOnCreate(false); setIsNewOpen(true); }}
          >
            <Plus size={16} /> Nueva Institución
          </button>
        </div>

        <div className={styles.tableWrap}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              Cargando instituciones...
            </p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Institución</th>
                  <th>Tipo</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                      No se encontraron instituciones.
                    </td>
                  </tr>
                ) : filtered.map(inst => (
                  <tr key={inst.id} onClick={() => { setSelected(inst); setIsDetailsOpen(true); }}>
                    <td>
                      <div className={styles.tdName}>{inst.name}</div>
                      <div className={styles.tdSub}>{inst.email}</div>
                    </td>
                    <td className={styles.tdCapitalize}>{typeLabel(inst.type)}</td>
                    <td className={styles.tdMuted}>{inst.location}</td>
                    <td><StatusBadge status={inst.status} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className={styles.rowActions}>
                        <button
                          className={styles.iconBtn}
                          onClick={() => { setSelected(inst); setForm({ ...inst }); setIsEditOpen(true); }}
                        >
                          <Edit3 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* ── Modal: Nueva Institución ── */}
      <Modal
        isOpen={isNewOpen}
        onClose={() => { setIsNewOpen(false); setError(''); }}
        title="Nueva Institución"
        footer={
          <>
            <button className={styles.btnCancel} onClick={() => { setIsNewOpen(false); setError(''); }}>
              Cancelar
            </button>
            <button className={styles.btnSave} onClick={handleCreate} disabled={saving}>
              {saving ? 'Creando...' : 'Crear Institución'}
            </button>
          </>
        }
      >
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nombre *</label>
            <input className={styles.input} placeholder="Nombre de la institución" onChange={field('name')} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tipo</label>
            <select className={styles.inputSelect} onChange={field('type')}>
              <option value="">Seleccionar tipo</option>
              {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Ubicación</label>
            <select className={styles.inputSelect} onChange={field('location')}>
              <option value="">Seleccionar Cantón</option>
              {CANTONES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Teléfono</label>
            <input className={styles.input} placeholder="2222-2222" onChange={field('phone')} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Correo *</label>
            <input type="email" className={styles.input} placeholder="inst@correo.com" onChange={field('email')} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Contraseña *</label>
            <input type="password" className={styles.input} placeholder="••••••••" onChange={field('password')} />
          </div>
          <div className={`${styles.formGroup} ${styles.formColSpan}`}>
            <label className={styles.label}>Persona de Contacto</label>
            <input className={styles.input} placeholder="Nombre del contacto" onChange={field('contactName')} />
          </div>

          {/* ── Opción de aprobación ── */}
          <div className={styles.formColSpan} style={{ marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Estado al crear
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setApproveOnCreate(false)}
                style={{
                  flex: 1, padding: '0.6rem', borderRadius: '8px',
                  border: `2px solid ${!approveOnCreate ? '#f59e0b' : '#e2e8f0'}`,
                  background: !approveOnCreate ? '#fffbeb' : '#fff',
                  color: !approveOnCreate ? '#b45309' : '#64748b',
                  fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.4rem', transition: 'all 0.15s',
                }}
              >
                <Clock size={15} /> Dejar Pendiente
              </button>
              <button
                type="button"
                onClick={() => setApproveOnCreate(true)}
                style={{
                  flex: 1, padding: '0.6rem', borderRadius: '8px',
                  border: `2px solid ${approveOnCreate ? '#22c55e' : '#e2e8f0'}`,
                  background: approveOnCreate ? '#f0fdf4' : '#fff',
                  color: approveOnCreate ? '#166534' : '#64748b',
                  fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.4rem', transition: 'all 0.15s',
                }}
              >
                <CheckCircle size={15} /> Aprobar de una vez
              </button>
            </div>
          </div>

          {error && (
            <div
              className={styles.formColSpan}
              style={{
                marginTop: '0.25rem', padding: '0.6rem 0.8rem',
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: '6px', color: '#dc2626', fontSize: '0.8rem',
              }}
            >
              {error}
            </div>
          )}
        </div>
      </Modal>

      {/* ── Modal: Detalles ── */}
      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Detalles de la Institución">
        {selected && (
          <div className={styles.detailGrid}>
            <div><p className={styles.detailLabel}>Nombre</p><p className={styles.detailValue}>{selected.name}</p></div>
            <div><p className={styles.detailLabel}>Tipo</p><p className={styles.detailValue}>{typeLabel(selected.type)}</p></div>
            <div><p className={styles.detailLabel}>Ubicación</p><p className={styles.detailValue}>{selected.location}</p></div>
            <div><p className={styles.detailLabel}>Teléfono</p><p className={styles.detailValue}>{selected.phone}</p></div>
            <div><p className={styles.detailLabel}>Correo</p><p className={styles.detailValue}>{selected.email}</p></div>
            <div><p className={styles.detailLabel}>Registro</p><p className={styles.detailValue}>{selected.registrationDate}</p></div>
            <div style={{ gridColumn: '1/-1' }}>
              <p className={styles.detailLabel}>Estado</p>
              <div style={{ marginTop: '0.25rem' }}><StatusBadge status={selected.status} /></div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Modal: Editar ── */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Institución"
        footer={
          <>
            <button className={styles.btnCancel} onClick={() => setIsEditOpen(false)}>Cancelar</button>
            <button className={styles.btnSave} onClick={handleUpdate} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </>
        }
      >
        {selected && (
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre</label>
              <input className={styles.input} defaultValue={selected.name} onChange={field('name')} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo</label>
              <select className={styles.inputSelect} defaultValue={selected.type} onChange={field('type')}>
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ubicación</label>
              <select className={styles.inputSelect} defaultValue={selected.location} onChange={field('location')}>
                {CANTONES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Teléfono</label>
              <input className={styles.input} defaultValue={selected.phone} onChange={field('phone')} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Correo</label>
              <input type="email" className={styles.input} defaultValue={selected.email} onChange={field('email')} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Persona de Contacto</label>
              <input className={styles.input} defaultValue={selected.contactName} onChange={field('contactName')} />
            </div>
            <div className={`${styles.statusRow} ${styles.formColSpan}`}>
              <span className={styles.statusLabel}>Estado de la cuenta</span>
              <div className={styles.statusBtns}>
                <button className={styles.btnActivate} onClick={() => handleStatusChange(true)}>
                  ✓ Aprobar
                </button>
                <button className={styles.btnDeactivate} onClick={() => handleStatusChange(false)}>
                  ✗ Desactivar
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Institutions;
