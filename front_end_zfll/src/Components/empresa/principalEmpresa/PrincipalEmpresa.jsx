import React, { useState } from "react";
import Vacantes from "../vacantesEmpresa/VacantesEmpresas";
import Pasantias from "../pasantias/Pasantias";
import Egresados from "../busquedaEgresados/Egresados"
import PerfilEmpresa from "../perfil/PerfilEmpresa";
import Candidatos from "../candidatos/Candidatos";
import GestionUsuarios from "../gestionUsuarios/GestionUsuarios";
import NotificationBell from "../../notifications/NotificationBell";
import Dashboard from "../dashboard/Dashboard";
import TalentoIndependiente from "../talentoIndepediente/TalentoIndependiente";
import "./PrincipalEmpresa.css";

export default function PrincipalEmpresa() {
  const [activeView, setActiveView] = useState("vacantes");

  const renderView = () => {
    switch (activeView) {
      case "pasantias":
        return <Pasantias />;

      case "vacantes":
        return <Vacantes />;

      case "candidatos":
        return <Candidatos />;

      case "egresados":
        return <Egresados />;

      case "talento":
        return <TalentoIndependiente />;

      case "usuarios":
        return <GestionUsuarios />;

      case "perfil":
        return <PerfilEmpresa />;

      case "dashboard":
        return <Dashboard setActiveView={setActiveView} />;
      default:
        return <div className="mock-card">Vista mock</div>;
    }
  };

  const items = [
    { key: "dashboard", label: "Dashboard", sub: "ACCEDER", icon: "📊" },
    { key: "vacantes", label: "Mis Vacantes", sub: "ACCEDER", icon: "🧳" },
    { key: "candidatos", label: "Candidatos", sub: "ACCEDER", icon: "🎓" },
    { key: "pasantias", label: "Pasantias", sub: "ACCEDER", icon: "👥" },
    { key: "egresados", label: "Búsqueda de Egresados", sub: "ACCEDER", icon: "🔎" },
    { key: "talento", label: "Talento Independiente", sub: "ACCEDER", icon: "🧑‍💻" },
    { key: "usuarios", label: "Gestión de Usuarios", sub: "ACCEDER", icon: "⚙️" },
    { key: "perfil", label: "Perfil Empresa", sub: "ACCEDER", icon: "🏢" },
  ];

  return (
    <div className="empresa-shell">
      <div className="empresa-frame">
        <aside className="sb">
          <div className="sb__inner">
            <div className="sb__brand">
              <div className="sb__logo">ZF</div>
              <div className="sb__brandText">
                <div className="sb__brandTitle">Zona Franca</div>
                <div className="sb__brandSub">EMPRESA</div>
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

        <main className="empresa-main">{renderView()}</main>
      </div>
    </div>
  );
}