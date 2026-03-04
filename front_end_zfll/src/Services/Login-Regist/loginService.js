// ============================================================
// loginService.js
// Conectado al backend real: /api/auth/
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

// ── 1. Verificar si un correo existe ──────────────────────────
// Endpoint: POST /api/auth/check-user/
// Envía:    { correo, tipo }
// Recibe:   { exists: bool, email }
export async function checkUserExists({ correo, tipo }) {
  const res = await fetch(`${BASE_URL}/auth/check-user/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, tipo }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? 'Error al verificar el correo.');
  // Normaliza la respuesta: el backend devuelve { exists, email }
  return { found: data.exists, email: data.email };
}

// ── 2. Login de Aspirante ─────────────────────────────────────
// Endpoint: POST /api/auth/login/
// Envía:    { correo, contrasena }
// Recibe:   { user: { id, email, role }, tokens: { access, refresh } }
export async function loginAspirante({ correo, contrasena }) {
  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? 'Credenciales incorrectas.');
  return data; // { user: { id, email, role }, tokens: { access, refresh } }
}

// ── 3. Login de Empresa o Instituto (con subrole) ─────────────
// Endpoint: POST /api/auth/login-org/
// Envía:    { correo, contrasena, tipo, subrole }
// Recibe:   { user: { id, email, role }, tokens: { access, refresh } }
export async function loginOrg({ correo, contrasena, tipo, subrole }) {
  const res = await fetch(`${BASE_URL}/auth/login-org/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena, tipo, subrole }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? 'Credenciales incorrectas.');
  return data; // { user: { id, email, role }, tokens: { access, refresh } }
}

// ── 4. Login con Google (aspirante) ──────────────────────────
// Endpoint: POST /api/auth/google/
// Envía:    { credential } (token de Google)
// Recibe:   { user: { id, email, role }, tokens: { access, refresh } }
export async function loginConGoogle(credential) {
  const res = await fetch(`${BASE_URL}/auth/google/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential, tipo: 'aspirante' }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? 'Error al iniciar sesión con Google.');
  return data; // { user: { id, email, role }, tokens: { access, refresh } }
}

// ── 5. Refrescar access token ─────────────────────────────────
// Endpoint: POST /api/auth/token/refresh/
// Envía:    { refresh }
// Recibe:   { access }
export async function refreshAccessToken(refreshToken) {
  const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error('Sesión expirada. Inicia sesión de nuevo.');
  return data; // { access }
}