const API_URL = "http://localhost:8000/api";

export const loginAspirante = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Credenciales inválidas");
  return await response.json();
};

export const validarCorreoOrganizacion = async (email) => {
  const response = await fetch(`${API_URL}/auth/validate-email/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) throw new Error("Correo no registrado");
  return await response.json();
};

export const loginOrganizacion = async (
  email,
  password,
  organization_id,
  role
) => {
  const response = await fetch(`${API_URL}/auth/login-org/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      organization_id,
      role,
    }),
  });

  if (!response.ok) throw new Error("Error al iniciar sesión");
  return await response.json();
};