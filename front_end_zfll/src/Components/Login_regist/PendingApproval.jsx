// ============================================================
// PendingApproval.jsx
// ============================================================

import { Clock } from 'lucide-react';
import '../../Pages/Login_Regist/AuthPage.css';

export default function PendingApproval({ regType, onBack }) {
  return (
    <div className="pending-wrapper">
      <div className="pending-card">
        <div className="pending-icon">
          <Clock size={40} />
        </div>
        <h2 className="pending-title">Solicitud Enviada</h2>
        <p className="pending-text">
          Tu solicitud para registrar {regType === 'company' ? 'la empresa' : 'el instituto'} ha
          sido recibida. Un administrador revisará la información y activará tu cuenta pronto.
          Recibirás un correo de confirmación.
        </p>
        <button onClick={onBack} className="pending-btn">
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}
