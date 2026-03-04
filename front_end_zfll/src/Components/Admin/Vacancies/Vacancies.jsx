import { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, Building2 } from 'lucide-react';
import Card from '../Card/Card';
import styles from './Vacancies.module.css';
/* import { getPendingVacancies, approveVacancy, rejectVacancy } from '../../../Services/Admin/vacancyService';
 */import { MOCK_VACANCIES } from './constants';// Reemplazar con datos reales al integrar API

const Vacancies = () => {
  const [vacancies, setVacancies] = useState(MOCK_VACANCIES.filter(v => v.status === 'pendiente'));
  const [selected, setSelected]   = useState(null);
  const [loading, setLoading]     = useState(false);

 /*  useEffect(() => {
    getPendingVacancies()
      .then(data => setVacancies(data.items || data))
      .catch(() => {});
  }, []);
 */
const handleApprove = () => {
  setVacancies(prev => prev.filter(v => v.id !== selected.id));
  setSelected(null);
};

const handleReject = () => {
  setVacancies(prev => prev.filter(v => v.id !== selected.id));
  setSelected(null);
};

  return (
    <div className={styles.grid}>
      {/* Lista */}
      <Card>
        <div className={styles.listHeader}>
          <h3 className={styles.listTitle}>Vacantes Pendientes</h3>
        </div>
        {vacancies.map(v => (
          <div
            key={v.id}
            className={`${styles.listItem} ${selected?.id === v.id ? styles.listItemActive : ''}`}
            onClick={() => setSelected(v)}
          >
            <div className={styles.listItemTop}>
              <div className={`${styles.typeIcon} ${v.type === 'pasantia' ? styles.typeIconPasantia : styles.typeIconEmpleo}`}>
                {v.type === 'pasantia' ? <GraduationCap size={16} /> : <Briefcase size={16} />}
              </div>
              <span className={styles.typeLabel}>{v.type}</span>
            </div>
            <p className={styles.itemTitle}>{v.title}</p>
            <p className={styles.itemCompany}>{v.companyName}</p>
          </div>
        ))}
        {vacancies.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
            No hay vacantes pendientes
          </div>
        )}
      </Card>

      {/* Detalle */}
      <Card>
        {selected ? (
          <div className={styles.detailContent}>
            {/* Header */}
            <div className={styles.detailHead}>
              <div>
                <div className={styles.detailMeta}>
                  <span className={`${styles.typePill} ${selected.type === 'pasantia' ? styles.pillPasantia : styles.pillEmpleo}`}>
                    {selected.type}
                  </span>
                  <span className={styles.requestedBy}>Solicitado por: {selected.requestedBy}</span>
                </div>
                <h3 className={styles.detailTitle}>{selected.title}</h3>
                <div className={styles.detailSubLine}>
                  <Building2 size={16} />
                  {selected.companyName}
                </div>
              </div>
              <div className={styles.detailActions}>
                <button className={styles.btnReject} onClick={handleReject} disabled={loading}>Rechazar</button>
                <button className={styles.btnApprove} onClick={handleApprove} disabled={loading}>
                  {loading ? 'Procesando...' : 'Aprobar Vacante'}
                </button>
              </div>
            </div>

            {/* Body */}
            <div className={styles.detailBody}>
              <div>
                <p className={styles.sectionLabel}>Descripción del Puesto</p>
                <div className={styles.descBox}>{selected.description}</div>

                <p className={styles.sectionLabel} style={{ marginTop: '1.5rem' }}>Requisitos</p>
                <ul className={styles.reqList}>
                  {selected.requirements.map((r, i) => (
                    <li key={i} className={styles.reqItem}>
                      <span className={styles.reqDot} /> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className={styles.sectionLabel}>Detalles</p>
                <div className={styles.infoGrid}>
                  <div className={styles.infoBox}>
                    <p className={styles.infoBoxLabel}>Horario</p>
                    <p className={styles.infoBoxValue}>{selected.schedule}</p>
                    <p className={styles.infoBoxSub}>{selected.time}</p>
                  </div>
                  <div className={styles.infoBox}>
                    <p className={styles.infoBoxLabel}>Jornada</p>
                    <p className={styles.infoBoxValue}>{selected.isFullTime ? 'Tiempo Completo' : 'Medio Tiempo'}</p>
                  </div>
                  <div className={styles.infoBox}>
                    <p className={styles.infoBoxLabel}>Ubicación</p>
                    <p className={styles.infoBoxValue}>{selected.location}</p>
                  </div>
                  <div className={styles.infoBox}>
                    <p className={styles.infoBoxLabel}>Postulantes</p>
                    <p className={styles.infoBoxBlue}>{selected.applicantsCount} personas</p>
                  </div>
                </div>

                <p className={styles.sectionLabel} style={{ marginTop: '1.25rem' }}>Información Adicional</p>
                <p className={styles.additionalInfo}>{selected.positionInfo}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.detailEmpty}>
            <Briefcase size={48} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>Revisión de Vacantes</h3>
            <p className={styles.emptyText}>Selecciona una vacante pendiente para revisar y gestionar su aprobación.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Vacancies;
