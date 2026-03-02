import { useState } from "react";
import LoginAspirante from "./LoginAspirante";
import LoginOrganizacion from "./LoginOrganizacion";

const LoginSelector = () => {
  const [active, setActive] = useState("aspirante");

  return (
    <>
      <div className="tabs">
        <button
          className={active === "aspirante" ? "active" : ""}
          onClick={() => setActive("aspirante")}
        >
          Aspirante
        </button>
        <button
          className={active === "org" ? "active" : ""}
          onClick={() => setActive("org")}
        >
          Empresa / Institución
        </button>
      </div>

      {active === "aspirante" ? (
        <LoginAspirante />
      ) : (
        <LoginOrganizacion />
      )}
    </>
  );
};

export default LoginSelector;