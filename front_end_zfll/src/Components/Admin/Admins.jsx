import { useState, useEffect } from 'react';
import { Plus, Trash2, Shield } from 'lucide-react';
import Card from './Card/Card';
import Modal from './Modal/Modal';
import styles from './Admins.module.css';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../Services/Admin/adminService';
import { MOCK_ADMINS } from '../../constants'; // Reemplazar con datos reales al integrar API

const Admins = () => {
  const [admins, setAdmins]           = useState(MOCK_ADMINS);
  const [selected, setSelected]       = useState(null);
  const [isNewOpen, setIsNewOpen]     = useState(false);
  const [isEditOpen, setIsEditOpen]   = useState(false);
  const [form, setForm]               = useState({});
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    getAdmins()
      .then(data => setAdmins(data.items || data))
      .catch(() => {});
  }, []);

  const field = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleCreate = async () => {
    setLoading(true);
    try {
      const created = await createAdmin(form);
      setAdmins(prev => [...prev, created]);
      setIsNewOpen(false);
      setForm({});
    } catch {} finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updated = await updateAdmin(selected.id, form);
      setAdmins(prev => prev.map(a => a.id === updated.id ? updated : a));
      setIsEditOpen(false);
    } catch {} finally { setLoading(false); }
  };

  const handleDelete = async (admin) => {
    if (!confirm(`¿Eliminar a ${admin.name}?`)) return;
    try {
      await deleteAdmin(admin.id);
      setAdmins(prev => prev.filter(a => a.id !== admin.id));
    } catch {}
  };

  return (
    <div>
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>Administradores del Sistema</h3>
        <button className={styles.btnPrimary} onClick={() => { setForm({}); setIsNewOpen(true); }}>
          <Plus size={16} /> Nuevo Administrador
        </button>
      </div>

      <div className={styles.grid}>
        {admins.map(admin => (
          <Card key={admin.id}>
            <div className={styles.adminCard}>
              <div className={styles.adminHead}>
                <div className={styles.avatar}>
                  {admin.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className={styles.adminName}>{admin.name}</p>
                  <p className={styles.adminEmail}>{admin.email}</p>
                </div>
              </div>

              <div className={styles.adminMeta}>
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Rol</span>
                  <span className={styles.roleBadge}>{admin.role}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Último Acceso</span>
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>{admin.lastLogin}</span>
                </div>
              </div>

              <div className={styles.adminActions}>
                {admin.role === 'admin' ? (
                  <button
                    className={styles.btnEdit}
                    onClick={() => { setSelected(admin); setForm({ ...admin }); setIsEditOpen(true); }}
                  >
                    Editar
                  </button>
                ) : (
                  <div className={styles.btnDisabled}>No Editable</div>
                )}
                <button className={styles.btnDelete} onClick={() => handleDelete(admin)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}

        <Card dashed>
          <div className={styles.secCard}>
            <div className={styles.secIconWrap}>
              <Shield size={24} color="#cbd5e1" />
            </div>
            <p className={styles.secTitle}>Gestión de Seguridad</p>
            <p className={styles.secSub}>Solo Superadmins pueden crear nuevos usuarios.</p>
          </div>
        </Card>
      </div>

      {/* Modal: Nuevo Admin */}
      <Modal isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} title="Nuevo Administrador" footer={
        <>
          <button className={styles.btnCancel} onClick={() => setIsNewOpen(false)}>Cancelar</button>
          <button className={styles.btnSave} onClick={handleCreate} disabled={loading}>{loading ? 'Creando...' : 'Crear Usuario'}</button>
        </>
      }>
        <div className={styles.formGroup}><label className={styles.label}>Nombre Completo</label><input className={styles.input} onChange={field('name')} /></div>
        <div className={styles.formGroup}><label className={styles.label}>Correo Electrónico</label><input type="email" className={styles.input} onChange={field('email')} /></div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Rol</label>
          <select className={styles.inputSelect} onChange={field('role')}>
            <option value="admin">Administrador</option>
            <option value="superadmin">Superadministrador</option>
          </select>
        </div>
        <div className={styles.formGroup}><label className={styles.label}>Contraseña Temporal</label><input type="password" className={styles.input} placeholder="••••••••" onChange={field('password')} /></div>
      </Modal>

      {/* Modal: Editar Admin */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar Administrador" footer={
        <>
          <button className={styles.btnCancel} onClick={() => setIsEditOpen(false)}>Cancelar</button>
          <button className={styles.btnSave} onClick={handleUpdate} disabled={loading}>{loading ? 'Guardando...' : 'Guardar Cambios'}</button>
        </>
      }>
        {selected && (
          <>
            <div className={styles.formGroup}><label className={styles.label}>Nombre Completo</label><input className={styles.input} defaultValue={selected.name} onChange={field('name')} /></div>
            <div className={styles.formGroup}><label className={styles.label}>Correo</label><input type="email" className={styles.input} defaultValue={selected.email} onChange={field('email')} /></div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Rol</label>
              <select className={styles.inputSelect} defaultValue={selected.role} onChange={field('role')}>
                <option value="admin">Administrador</option>
                <option value="superadmin">Superadministrador</option>
              </select>
            </div>
            <div className={styles.formGroup}><label className={styles.label}>Nueva Contraseña (opcional)</label><input type="password" className={styles.input} placeholder="••••••••" onChange={field('password')} /></div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Admins;
