// ============================================================
// registerService.js
// Conectado al backend real: /api/auth/
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

// ── 1. Registro de Aspirante ──────────────────────────────────
// Endpoint: POST /api/auth/register/aspirante/
// Envía:    { nombre, email, password, phone? }
// Recibe:   { user_id, email, tokens: { access, refresh } }
export async function registerAspirante({ nombre, email, password, phone }) {
  const res = await fetch(`${BASE_URL}/auth/register/aspirante/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      email,
      password,
      ...(phone && { phone }),
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? Object.values(data).flat().join(' '));
  // Normaliza: backend devuelve { user_id, email, tokens }
  // Adaptamos a { user: { id, email }, tokens } para consistencia con login
  return {
    user: { id: data.user_id, email: data.email, role: 'aspirante' },
    tokens: data.tokens,
  };
}

// ── 2. Registro de Empresa ────────────────────────────────────
// Endpoint: POST /api/auth/register/empresa/
// Envía:    { nombre, email, password, phone?, nombre_empresa?, cedula_juridica?, ubicacion? }
// Recibe:   { user_id, email, tokens: { access, refresh } }
export async function registerEmpresa({
  nombre,
  email,
  password,
  phone,
  nombre_empresa,
  cedula_juridica,
  ubicacion,
}) {
  const res = await fetch(`${BASE_URL}/auth/register/empresa/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      email,
      password,
      ...(phone            && { phone }),
      ...(nombre_empresa   && { nombre_empresa }),
      ...(cedula_juridica  && { cedula_juridica }),
      ...(ubicacion        && { ubicacion }),
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? Object.values(data).flat().join(' '));
  return {
    user: { id: data.user_id, email: data.email, role: 'empresa' },
    tokens: data.tokens,
    requires_approval: true, // empresas siempre requieren aprobación
  };
}

// ── 3. Registro de Institución ────────────────────────────────
// Endpoint: POST /api/auth/register/institucion/
// Envía:    { nombre, email, password, phone?, nombre_institucion?, cedula_juridica?, ubicacion? }
// Recibe:   { user_id, email, tokens: { access, refresh } }
export async function registerInstitucion({
  nombre,
  email,
  password,
  phone,
  nombre_institucion,
  cedula_juridica,
  ubicacion,
}) {
  const res = await fetch(`${BASE_URL}/auth/register/institucion/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      email,
      password,
      ...(phone               && { phone }),
      ...(nombre_institucion  && { nombre_institucion }),
      ...(cedula_juridica     && { cedula_juridica }),
      ...(ubicacion           && { ubicacion }),
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? Object.values(data).flat().join(' '));
  return {
    user: { id: data.user_id, email: data.email, role: 'institucion' },
    tokens: data.tokens,
    requires_approval: true, // institutos siempre requieren aprobación
  };
}

// ── 4. Google register (aspirante) ───────────────────────────
// Endpoint: POST /api/auth/google/
// Envía:    { credential, tipo: 'aspirante' }
// Recibe:   { user: { id, email, role }, tokens }
// NOTA: el mismo endpoint de loginConGoogle en loginService.js
//       si el correo no existe, Google lo crea automáticamente
export { loginConGoogle as registerConGoogle } from '../Login-Regist/loginService.js';