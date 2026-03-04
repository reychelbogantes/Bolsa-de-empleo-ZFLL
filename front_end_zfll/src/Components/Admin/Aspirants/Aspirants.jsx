import { useState, useEffect } from 'react';
import { Search, Edit3, Trash2, UserCheck, UserX } from 'lucide-react';
import Card from '../Card/Card';
import Modal from '../Modal/Modal';
import StatusBadge from '../StatusBadge/StatusBadge';
import styles from './Aspirants.module.css';
import {
  getAspirants,
  updateAspirant,
  updateAspirantStatus,
  deleteAspirant,
} from '../../../Services/Admin/aspirantService';

const Aspirants = () => {
  const [aspirants, setAspirants] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm]           = useState({});
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    setLoading(true);
    getAspirants()
      .then(data => setAspirants(data))
      .catch(() => setAspirants([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = aspirants.filter(a =>
    !search ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const field = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const updated = await updateAspirant(selected.id, {
        first_name: form.name,
        phone: form.phone,
      });
      setAspirants(prev => prev.map(a => a.id === updated.id ? updated : a));
      setIsEditOpen(false);
    } catch {} finally { setSaving(false); }
  };

  const handleToggleStatus = async (asp) => {
    const newActive = asp.status !== 'activo';
    try {
      const updated = await updateAspirantStatus(asp.id, newActive);
      setAspirants(prev => prev.map(a => a.id === (updated.id ?? asp.id)
        ? { ...a, status: newActive ? 'activo' : 'inactivo' }
        : a
      ));
    } catch {}
  };

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar a ${selected.name}?`)) return;
    try {
      await deleteAspirant(selected.id);
      setAspirants(prev => prev.filter(a => a.id !== selected.id));
      setIsEditOpen(false);
    } catch {}
  };

  return (
    <>
      <Card>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              className={styles.searchInput}
              placeholder="Buscar aspirante..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {filtered.length} aspirante{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className={styles.tableWrap}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              Cargando aspirantes...
            </p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Aspirante</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                      No se encontraron aspirantes.
                    </td>
                  </tr>
                ) : filtered.map(asp => (
                  <tr key={asp.id}>
                    <td>
                      <div className={styles.tdName}>{asp.name}</div>
                      <div className={styles.tdSub}>{asp.email}</div>
                    </td>
                    <td className={styles.tdMuted}>{asp.phone || '—'}</td>
                    <td><StatusBadge status={asp.status} /></td>
                    <td className={styles.tdDate}>{asp.registrationDate}</td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          className={styles.iconBtn}
                          title={asp.status === 'activo' ? 'Desactivar' : 'Activar'}
                          onClick={() => handleToggleStatus(asp)}
                        >
                          {asp.status === 'activo'
                            ? <UserX size={17} />
                            : <UserCheck size={17} />
                          }
                        </button>
                        <button
                          className={styles.iconBtn}
                          onClick={() => {
                            setSelected(asp);
                            setForm({ ...asp });
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit3 size={17} />
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

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Gestionar Aspirante"
        footer={
          <div className={styles.modalFooter}>
            <button className={styles.btnDanger} onClick={handleDelete}>
              <Trash2 size={16} /> Eliminar Usuario
            </button>
            <div className={styles.footerRight}>
              <button className={styles.btnCancel} onClick={() => setIsEditOpen(false)}>Cancelar</button>
              <button className={styles.btnSave} onClick={handleUpdate} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        }
      >
        {selected && (
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre</label>
              <input className={styles.input} defaultValue={selected.name} onChange={field('name')} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Correo</label>
              <input type="email" className={styles.input} defaultValue={selected.email} readOnly
                style={{ background: '#f8fafc', cursor: 'not-allowed' }} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Teléfono</label>
              <input className={styles.input} defaultValue={selected.phone} onChange={field('phone')} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Fecha de Registro</label>
              <input className={styles.input} value={selected.registrationDate} readOnly
                style={{ background: '#f8fafc', cursor: 'not-allowed' }} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Aspirants;
