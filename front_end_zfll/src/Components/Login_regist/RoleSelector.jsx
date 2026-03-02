import { useState } from "react";

const RoleSelector = ({ dataOrg, password, setPassword, onLogin }) => {
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <>
      <select
        className="select"
        onChange={(e) => setSelectedOrg(e.target.value)}
      >
        <option>Selecciona organización</option>
        {dataOrg.organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>

      <select
        className="select"
        onChange={(e) => setSelectedRole(e.target.value)}
      >
        <option>Selecciona rol</option>
        {dataOrg.organizations
          .find((o) => o.id == selectedOrg)
          ?.roles.map((role) => (
            <option key={role}>{role}</option>
          ))}
      </select>

      <div className="input-group">
        <input
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Contraseña</label>
      </div>

      <button
        className="primary-btn"
        onClick={() => onLogin(selectedOrg, selectedRole)}
      >
        Ingresar
      </button>
    </>
  );
};

export default RoleSelector;