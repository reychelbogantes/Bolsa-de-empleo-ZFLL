/**
 * AspirantePage.jsx
 * Layout raíz del perfil Aspirante.
 * Estructura: Navbar full-width arriba → Sidebar + Contenido abajo.
 */
import { useState } from 'react';
import Sidebar            from '../../Components/PerfilAspirante/Sidebar/Sidebar';
import Navbar             from '../../Components/PerfilAspirante/Navbar/Navbar';
import DashboardAspirante from '../../Components/PerfilAspirante/DashboardAspirante/DashboardAspirante';
import PersonalData       from '../../Components/PerfilAspirante/PersonalData/PersonalData';
import PerfilProfesional  from '../../Components/PerfilAspirante/PerfilProfesional/PerfilProfesional';
import Postulaciones      from '../../Components/PerfilAspirante/Postulaciones/Postulaciones';
import ApplyModal         from '../../Components/PerfilAspirante/ApplyModal/ApplyModal';
import './AspirantePage.css';

const AspirantePage = ({ usuario = null, onLogout }) => {
  const [activeView,  setActiveView]  = useState('dashboard');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApply,   setShowApply]   = useState(false);
  const [toast,       setToast]       = useState('');

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const renderView = () => {
    switch (activeView) {
      case 'personal':
        return <PersonalData usuario={usuario} onNotify={notify} />;
      case 'perfil':
        return <PerfilProfesional onNotify={notify} />;
      case 'postulaciones':
        return <Postulaciones />;
      default:
        return (
          <DashboardAspirante
            usuario={usuario}
            onApply={(job) => { setSelectedJob(job); setShowApply(true); }}
            onNotify={notify}
          />
        );
    }
  };

  return (
    <div className="ap-root">

      {/* ── Navbar: full width ── */}
      <Navbar usuario={usuario} onLogout={onLogout} />

      {/* ── Body: sidebar + main ── */}
      <div className="ap-body">
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
          perfilCompletado={90}
        />

        <main className="ap-main">
          {renderView()}
        </main>
      </div>

      {/* ── Apply Modal ── */}
      <ApplyModal
        job={selectedJob}
        isOpen={showApply}
        onClose={() => setShowApply(false)}
        onSubmit={() => { notify('¡Postulación enviada correctamente!'); setShowApply(false); }}
      />

      {/* ── Toast ── */}
      {toast && (
        <div className="ap-toast">
          <span className="ap-toast-dot" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default AspirantePage;