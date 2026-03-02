import { useState } from "react";
import { loginAspirante } from "../../Services/Servicios_login_regist";
import GoogleButton from "./GoogleButton";

const LoginAspirante = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginAspirante(email, password);
      console.log(data);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Correo electrónico</label>
      </div>

      <div className="input-group">
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Contraseña</label>
      </div>

      <button className="primary-btn">Iniciar Sesión</button>

      <div className="divider">o</div>

      <GoogleButton />
    </form>
  );
};

export default LoginAspirante;