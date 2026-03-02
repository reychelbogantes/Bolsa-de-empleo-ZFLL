import { useState } from "react";
import {
  validarCorreoOrganizacion,
  loginOrganizacion,
} from "../../Services/Servicios_login_regist";
import RoleSelector from "./RoleSelector";

const LoginOrganizacion = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [dataOrg, setDataOrg] = useState(null);
  const [password, setPassword] = useState("");

  const handleValidate = async () => {
    try {
      const data = await validarCorreoOrganizacion(email);
      setDataOrg(data);
      setStep(2);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async (organization_id, role) => {
    try {
      const data = await loginOrganizacion(
        email,
        password,
        organization_id,
        role
      );
      console.log(data);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="form fade-in">
      {step === 1 && (
        <>
          <div className="input-group">
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Correo corporativo</label>
          </div>

          <button className="primary-btn" onClick={handleValidate}>
            Validar
          </button>
        </>
      )}

      {step === 2 && (
        <RoleSelector
          dataOrg={dataOrg}
          password={password}
          setPassword={setPassword}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default LoginOrganizacion;