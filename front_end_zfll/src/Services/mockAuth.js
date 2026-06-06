// ============================================================
// mockAuth.js — Login/Registro simulado para demo
// ============================================================

const MOCK_USERS = [
  {
    email: 'aspirante@demo.com',
    password: '123456',
    user: { id: '1', email: 'aspirante@demo.com', role: 'aspirante', nombre: 'Juan Diego Castro' },
    tokens: { access: 'mock-token-aspirante', refresh: 'mock-refresh-aspirante' }
  },
  {
    email: 'empresa@demo.com',
    password: '123456',
    user: { id: '2', email: 'empresa@demo.com', role: 'empresa', nombre: 'Intel Costa Rica' },
    tokens: { access: 'mock-token-empresa', refresh: 'mock-refresh-empresa' }
  },
  {
    email: 'institucion@demo.com',
    password: '123456',
    user: { id: '3', email: 'institucion@demo.com', role: 'institucion', nombre: 'TEC' },
    tokens: { access: 'mock-token-institucion', refresh: 'mock-refresh-institucion' }
  },
  {
    email: 'admin@lalima.cr',
    password: '123456',
    user: { id: '4', email: 'admin@lalima.cr', role: 'admin', nombre: 'Admin Principal' },
    tokens: { access: 'mock-token-admin', refresh: 'mock-refresh-admin' }
  },
];

export const IS_MOCK = true;

export async function mockLogin({ correo, contrasena }) {
  await new Promise(r => setTimeout(r, 500)); // simula delay
  const found = MOCK_USERS.find(u => u.email === correo && u.password === contrasena);
  if (!found) throw new Error('Credenciales incorrectas. Usá los usuarios de demo.');
  localStorage.setItem('accessToken', found.tokens.access);
  localStorage.setItem('refreshToken', found.tokens.refresh);
  localStorage.setItem('user', JSON.stringify(found.user));
  return { user: found.user, tokens: found.tokens };
}

export async function mockRegister({ email, password, role, nombre }) {
  await new Promise(r => setTimeout(r, 500));
  const user = { id: Date.now().toString(), email, role, nombre: nombre || email };
  const tokens = { access: `mock-token-${role}`, refresh: `mock-refresh-${role}` };
  localStorage.setItem('accessToken', tokens.access);
  localStorage.setItem('refreshToken', tokens.refresh);
  localStorage.setItem('user', JSON.stringify(user));
  return { user, tokens };
}

export async function mockCheckUser({ correo }) {
  const found = MOCK_USERS.find(u => u.email === correo);
  return { found: !!found, email: correo };
}