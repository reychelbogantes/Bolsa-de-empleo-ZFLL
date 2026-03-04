import React, { useState } from "react";
import "./PrincipalInstintuciones.css";

// Vistas (mock / crea después)
import InstEgresados from "../egresados/Egresados";
import InstUsuarios from "../gestionUsuarios/UsuariosInsti";
import VacantesDisponibles from "../vacantesDisponibles/VacantesDisponibles"
import InstProgramas from "../programasyProfesores/ProgramasyProfesores";
import InstPasantias from "../pasantiasySolicitudes/PasantiasYSolicitudes"; 
import InstInfo from "../informacionInstintucional/InformacionInstintucional";
import NotificationBell from "../../notifications/NotificationBell";
import InstDemanda from "../demandaLaboral/DemandaLaboral";

export default function PrincipalInstituciones() {
  const [activeView, setActiveView] = useState("egresados");

  const renderView = () => {
    switch (activeView) {
      case "egresados":
        return <InstEgresados />;

      case "usuarios":
        return <InstUsuarios />;

      case "vacantesDisponibles":
        return <VacantesDisponibles />;

      case "programasProfesores":
        return <InstProgramas />;

      case "pasantiasSolicitudes":
        return <InstPasantias />;

      case "infoInstitucional":
        return <InstInfo />;

      case "demandaLaboral":
        return <InstDemanda />;

      default:
        return <div className="mock-card">Vista mock</div>;
    }
  };

  const items = [
    { key: "egresados", label: "Egresados", sub: "ACCEDER", icon: "🎓" },
    { key: "usuarios", label: "Gestión de Usuarios", sub: "ACCEDER", icon: "⚙️" },
    { key: "vacantesDisponibles", label: "Vacantes Disponibles", sub: "ACCEDER", icon: "🧳" },
    { key: "programasProfesores", label: "Programas y Profesores", sub: "ACCEDER", icon: "📚" },
    { key: "pasantiasSolicitudes", label: "Pasantías y Solicitudes", sub: "ACCEDER", icon: "👥" },
    { key: "infoInstitucional", label: "Información Institucional", sub: "ACCEDER", icon: "🏛️" },
    { key: "demandaLaboral", label: "Demanda Laboral", sub: "ACCEDER", icon: "📈" },
  ];

  return (
    <div className="inst-shell">
      <div className="inst-frame">
        <aside className="sb">
          <div className="sb__inner">
            <div className="sb__brand">
              <div className="sb__logo">ZF</div>
              <div className="sb__brandText">
                <div className="sb__brandTitle">Zona Franca</div>
                <div className="sb__brandSub">INSTITUCIÓN</div>
              </div>
               <NotificationBell />
            </div>

            <nav className="sb__nav">
              {items.map((it) => (
                <button
                  key={it.key}
                  type="button"
                  className={`sb__item ${activeView === it.key ? "is-active" : ""}`}
                  onClick={() => setActiveView(it.key)}
                >
                  <span className="sb__icon">{it.icon}</span>
                  <span className="sb__text">
                    <span className="sb__label">{it.label}</span>
                    <span className="sb__sub">{it.sub}</span>
                  </span>
                  <span className="sb__chev">›</span>
                </button>
              ))}
            </nav>

            <div className="sb__footer">
              <div className="sb__footerDot" />
              <span className="sb__footerText">Centro de Ayuda</span>
            </div>
          </div>
        </aside>

        <main className="inst-main">{renderView()}</main>
      </div>
    </div>
  );
}