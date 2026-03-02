import { useState } from "react";
import LoginAspirante from "../../Components/Login_regist/LoginAspirante";
import LoginOrganizacion from "../../Components/Login_regist/LoginOrganizacion";
import RegisterAspirante from "../../Components/Login_regist/LoginSelector";


import './Admin_regist.css'

function Admin_regist() {
  const [isActive, setIsActive] = useState(false);
  const [loginType, setLoginType] = useState("aspirante");

  return (
    <div>
      <div className="auth-wrapper">
      <div className={`container ${isActive ? "active" : ""}`}>
        
        {/* LOGIN */}
        <div className="form-container login-container">
          <h2>Iniciar Sesión</h2>

          <div className="type-selector">
            <button onClick={() => setLoginType("aspirante")}>
              Aspirante
            </button>
            <button onClick={() => setLoginType("org")}>
              Empresa / Institución
            </button>
          </div>

          {loginType === "aspirante" ? (
            <LoginAspirante />
          ) : (
            <LoginOrganizacion />
          )}
        </div>

        {/* REGISTER */}
        <div className="form-container register-container">
          <h2>Crear Cuenta</h2>
          <RegisterAspirante />
        </div>

        {/* OVERLAY */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2>¿Ya tienes cuenta?</h2>
              <p>Inicia sesión para continuar</p>
              <button
                className="ghost"
                onClick={() => setIsActive(false)}
              >
                Iniciar Sesión
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h2>¿No tienes cuenta?</h2>
              <p>Regístrate como aspirante</p>
              <button
                className="ghost"
                onClick={() => setIsActive(true)}
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>






    </div>
  )
}

export default Admin_regist

