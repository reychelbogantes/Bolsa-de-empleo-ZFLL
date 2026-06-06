/**
 * mockAuth.js - MEJORADO PARA GITHUB PAGES
 * ✅ Login/Registro funcional
 * ✅ Todos los endpoints de aspiranteService
 * ✅ Datos realistas basados en perfil de Reychel
 */

const MOCK_USERS = [
  {
    email: 'reychel@demo.com',
    password: '123456',
    user: {
      id: '1',
      email: 'reychel@demo.com',
      role: 'aspirante',
      nombre: 'Reychel Fallas Bogantes',
      first_name: 'Reychel',
      last_name: 'Fallas Bogantes',
      phone: '+506 8765 4321',
      consent_given: true,
      is_aspirante: true,
    },
    tokens: {
      access: 'mock-token-reychel',
      refresh: 'mock-refresh-reychel',
    },
  },
  {
    email: 'aspirante@demo.com',
    password: '123456',
    user: {
      id: '2',
      email: 'aspirante@demo.com',
      role: 'aspirante',
      nombre: 'Juan Diego Castro',
      first_name: 'Juan Diego',
      last_name: 'Castro',
      phone: '+506 8765 4321',
      consent_given: true,
      is_aspirante: true,
    },
    tokens: {
      access: 'mock-token-aspirante',
      refresh: 'mock-refresh-aspirante',
    },
  },
  {
    email: 'empresa@demo.com',
    password: '123456',
    user: {
      id: '3',
      email: 'empresa@demo.com',
      role: 'empresa',
      nombre: 'Intel Costa Rica',
    },
    tokens: {
      access: 'mock-token-empresa',
      refresh: 'mock-refresh-empresa',
    },
  },
  {
    email: 'institucion@demo.com',
    password: '123456',
    user: {
      id: '4',
      email: 'institucion@demo.com',
      role: 'institucion',
      nombre: 'TEC',
    },
    tokens: {
      access: 'mock-token-institucion',
      refresh: 'mock-refresh-institucion',
    },
  },
  {
    email: 'admin@lalima.cr',
    password: '123456',
    user: {
      id: '5',
      email: 'admin@lalima.cr',
      role: 'admin',
      nombre: 'Admin Principal',
    },
    tokens: {
      access: 'mock-token-admin',
      refresh: 'mock-refresh-admin',
    },
  },
];

// ════════════════════════════════════════════════════════════════════════════════
// MOCK DATA - Perfil de Reychel
// ════════════════════════════════════════════════════════════════════════════════

const MOCK_PERFIL_ASPIRANTE = {
  id: 1,
  user: 1,
  nombre_completo: 'Reychel Fallas Bogantes',
  resumen_profesional:
    'Full Stack Developer con experiencia en React + Vite, Django REST Framework y PostgreSQL. Diseñadora UI/UX con dominio en Figma, Photoshop e Illustrator. Certificada en Azure Fundamentals (AZ-900) y Endpoint Security & Network Defense (Cisco/INA). Graduada de FWD Costa Rica con enfoque en desarrollo web moderno y diseño responsivo.',
  extra_data: {
    fecha_nacimiento: '1998-05-15',
    estado_civil: 'soltero/a',
    nacionalidad: 'Costarricense',
    provincia: 'Puntarenas',
    canton: 'Central',
    distrito: 'El Roble',
    direccion: 'El Roble, Puntarenas',
    carta_presentacion:
      'Soy una profesional en desarrollo web apasionada por crear soluciones innovadoras. Mi experiencia combina desarrollo backend robusto con interfaces frontend atractivas y funcionales. Me destaca la capacidad de adaptarme rápidamente a nuevas tecnologías y mi compromiso con la calidad del código.',
    soft_skills: ['Comunicación efectiva', 'Trabajo en equipo', 'Pensamiento crítico', 'Adaptabilidad', 'Gestión del tiempo'],
    power_skills: ['Resolución de problemas', 'Liderazgo técnico', 'Creatividad en diseño', 'Atención al detalle'],
    instituciones: ['FWD Costa Rica', 'Cisco Academy'],
    visible: true,
  },
};

const MOCK_CV_VERSIONS = [
  {
    id: 1,
    user: 1,
    nombre_etiqueta: 'CV Actual - Full Stack',
    es_predeterminado: true,
    archivo: 'cv_reychel_fullstack_2024.pdf',
    fecha_subida: '2024-12-15T10:30:00Z',
  },
  {
    id: 2,
    user: 1,
    nombre_etiqueta: 'CV - Enfoque Diseño UI/UX',
    es_predeterminado: false,
    archivo: 'cv_reychel_ux_2024.pdf',
    fecha_subida: '2024-12-10T14:20:00Z',
  },
  {
    id: 3,
    user: 1,
    nombre_etiqueta: 'CV - Versión Backend',
    es_predeterminado: false,
    archivo: 'cv_reychel_backend_2024.pdf',
    fecha_subida: '2024-12-01T09:00:00Z',
  },
];

const MOCK_DOCUMENTOS = [
  {
    id: 1,
    user: 1,
    tipo_documento: 'certificado',
    nombre_archivo: 'Azure-Fundamentals-AZ900.pdf',
    archivo: 'azure_az900_reychel.pdf',
    fecha_subida: '2024-11-20T09:15:00Z',
  },
  {
    id: 2,
    user: 1,
    tipo_documento: 'certificado',
    nombre_archivo: 'Cisco-Endpoint-Security-ENSA.pdf',
    archivo: 'cisco_ensa_reychel.pdf',
    fecha_subida: '2024-11-18T11:45:00Z',
  },
  {
    id: 3,
    user: 1,
    tipo_documento: 'titulo_academico',
    nombre_archivo: 'FWD-Costa-Rica-Full-Stack-Certificate.pdf',
    archivo: 'fwd_fullstack_reychel.pdf',
    fecha_subida: '2024-11-15T08:30:00Z',
  },
  {
    id: 4,
    user: 1,
    tipo_documento: 'certificado',
    nombre_archivo: 'React-Advanced-Course.pdf',
    archivo: 'react_advanced_reychel.pdf',
    fecha_subida: '2024-10-20T14:00:00Z',
  },
];

const MOCK_POSTULACIONES = [
  {
    id: 1,
    user: 1,
    vacante: 1,
    cv_version: 1,
    estado: 'revisada',
    fecha_postulacion: '2024-12-14T15:30:00Z',
    extra_data: {
      descripcion: 'Muy interesada en esta posición como Frontend Developer. Mi experiencia con React y Vite encaja perfectamente con los requerimientos.',
    },
    vacante_data: {
      id: 1,
      titulo: 'Frontend Developer - React',
      empresa: 'Alegra',
      descripcion: 'Buscamos un developer con experiencia en React...',
      ubicacion: 'Remoto',
    },
  },
  {
    id: 2,
    user: 1,
    vacante: 2,
    cv_version: 1,
    estado: 'enviada',
    fecha_postulacion: '2024-12-10T10:15:00Z',
    extra_data: {
      descripcion: 'Posición interesante para aplicar mis habilidades full stack con Node.js y Django.',
    },
    vacante_data: {
      id: 2,
      titulo: 'Full Stack Developer - Node.js + React',
      empresa: 'PAYNAU',
      descripcion: 'Posición remota para desarrollador fullstack...',
      ubicacion: 'Remoto',
    },
  },
];

const MOCK_VACANTES = [
  {
    id: 1,
    titulo: 'Frontend Developer - React',
    empresa: 'Alegra',
    descripcion: 'Buscamos un developer con experiencia en React y Vite para unirse a nuestro equipo...',
    ubicacion: 'Remoto',
    salario_min: 1800000,
    salario_max: 2800000,
    es_pasantia: false,
    fecha_publicacion: '2024-12-01T09:00:00Z',
    requerimientos: ['React', 'JavaScript', 'CSS', 'Git', 'Vite'],
    beneficios: ['100% remoto', 'Flexible hours', 'Health insurance'],
  },
  {
    id: 2,
    titulo: 'Full Stack Developer - Node.js + React',
    empresa: 'PAYNAU',
    descripcion: 'Buscamos desarrollador fullstack con Node.js y React. Posición completamente remota...',
    ubicacion: 'Remoto',
    salario_min: 2200000,
    salario_max: 3500000,
    es_pasantia: false,
    fecha_publicacion: '2024-12-05T10:30:00Z',
    requerimientos: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'REST API'],
    beneficios: ['100% remoto', 'Bono de desempeño', 'Plan de estudios'],
  },
  {
    id: 3,
    titulo: 'UI/UX Designer',
    empresa: 'Creative Studio',
    descripcion: 'Diseñador con experiencia en Figma y Adobe Creative Suite...',
    ubicacion: 'San José, Presencial',
    salario_min: 1500000,
    salario_max: 2300000,
    es_pasantia: false,
    fecha_publicacion: '2024-12-08T14:00:00Z',
    requerimientos: ['Figma', 'Photoshop', 'UI/UX Design', 'Prototipado'],
    beneficios: ['Presencial', 'Equipos modernos', 'Proyectos creativos'],
  },
  {
    id: 4,
    titulo: 'Backend Developer - Django + PostgreSQL',
    empresa: 'TechCorp',
    descripcion: 'Buscamos desarrollador backend con experiencia en Django...',
    ubicacion: 'Remoto',
    salario_min: 2000000,
    salario_max: 3200000,
    es_pasantia: false,
    fecha_publicacion: '2024-12-12T08:00:00Z',
    requerimientos: ['Django', 'PostgreSQL', 'REST API', 'Docker', 'Git'],
    beneficios: ['100% remoto', 'Flexible', 'Educación'],
  },
  {
    id: 5,
    titulo: 'Pasantía - Desarrollo Web Full Stack',
    empresa: 'Digital Solutions',
    descripcion: 'Oportunidad de pasantía para estudiantes de desarrollo web...',
    ubicacion: 'Remoto',
    salario_min: 0,
    salario_max: 600000,
    es_pasantia: true,
    fecha_publicacion: '2024-12-10T08:00:00Z',
    requerimientos: ['HTML', 'CSS', 'JavaScript', 'Motivación', 'Disposición para aprender'],
    beneficios: ['Experiencia profesional', 'Mentoría personalizada', 'Certificado'],
  },
  {
    id: 6,
    titulo: 'Frontend Developer - Vue.js',
    empresa: 'Startup Innovation',
    descripcion: 'Posición para frontend developer con Vue.js...',
    ubicacion: 'Remoto',
    salario_min: 1700000,
    salario_max: 2600000,
    es_pasantia: false,
    fecha_publicacion: '2024-12-09T11:00:00Z',
    requerimientos: ['Vue.js', 'JavaScript', 'CSS', 'Git'],
    beneficios: ['100% remoto', 'Work-life balance', 'Training budget'],
  },
];

// ════════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════════════════════════

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

function isAuthenticated() {
  return !!localStorage.getItem('accessToken');
}

function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS - Las funciones que usa tu app
// ════════════════════════════════════════════════════════════════════════════════

export const IS_MOCK = true;

// ─── Auth (Tu versión original) ─────────────────────────────────────────────────

export async function mockLogin({ correo, contrasena }) {
  await delay();
  const found = MOCK_USERS.find((u) => u.email === correo && u.password === contrasena);
  if (!found) throw new Error('Credenciales incorrectas. Usá los usuarios de demo.');

  localStorage.setItem('accessToken', found.tokens.access);
  localStorage.setItem('refreshToken', found.tokens.refresh);
  localStorage.setItem('user', JSON.stringify(found.user));

  return { user: found.user, tokens: found.tokens };
}

export async function mockRegister({ email, password, role, nombre }) {
  await delay();
  const user = {
    id: Date.now().toString(),
    email,
    role,
    nombre: nombre || email,
    first_name: nombre?.split(' ')[0] || '',
    last_name: nombre?.split(' ').slice(1).join(' ') || '',
    is_aspirante: role === 'aspirante',
  };
  const tokens = {
    access: `mock-token-${role}`,
    refresh: `mock-refresh-${role}`,
  };

  localStorage.setItem('accessToken', tokens.access);
  localStorage.setItem('refreshToken', tokens.refresh);
  localStorage.setItem('user', JSON.stringify(user));

  return { user, tokens };
}

export async function mockCheckUser({ correo }) {
  const found = MOCK_USERS.find((u) => u.email === correo);
  return { found: !!found, email: correo };
}

// ─── aspiranteService functions ─────────────────────────────────────────────────

export async function login(email, password) {
  return mockLogin({ correo: email, contrasena: password });
}

export async function refreshToken() {
  await delay(200);
  if (!isAuthenticated()) throw new Error('No autorizado');
  const user = getCurrentUser();
  const newToken = `mock-token-${user.role}-${Date.now()}`;
  localStorage.setItem('accessToken', newToken);
  return newToken;
}

export async function logout() {
  await delay(200);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('mockPerfilAspirante');
  localStorage.removeItem('mockCvVersions');
  localStorage.removeItem('mockDocumentos');
  localStorage.removeItem('mockPostulaciones');
}

export async function getUsuario() {
  await delay();
  if (!isAuthenticated()) throw new Error('No autorizado');
  let user = getCurrentUser();
  if (!user) throw new Error('Usuario no encontrado');
  const userData = localStorage.getItem('mockUserData');
  if (userData) {
    user = { ...user, ...JSON.parse(userData) };
  }
  return user;
}

export async function updateUsuario(payload) {
  await delay();
  if (!isAuthenticated()) throw new Error('No autorizado');
  let user = getCurrentUser();
  const updated = { ...user, ...payload };
  localStorage.setItem('user', JSON.stringify(updated));
  localStorage.setItem('mockUserData', JSON.stringify(payload));
  return updated;
}

export async function getPerfilAspirante() {
  await delay();
  if (!isAuthenticated()) throw new Error('No autorizado');
  const cached = localStorage.getItem('mockPerfilAspirante');
  if (cached) return JSON.parse(cached);
  const perfil = { ...MOCK_PERFIL_ASPIRANTE, user: getCurrentUser().id };
  localStorage.setItem('mockPerfilAspirante', JSON.stringify(perfil));
  return perfil;
}

export async function updatePerfilAspirante(payload) {
  await delay();
  if (!isAuthenticated()) throw new Error('No autorizado');
  const perfil = JSON.parse(
    localStorage.getItem('mockPerfilAspirante') || JSON.stringify(MOCK_PERFIL_ASPIRANTE)
  );
  if (payload.extra_data) {
    perfil.extra_data = { ...perfil.extra_data, ...payload.extra_data };
    delete payload.extra_data;
  }
  const updated = { ...perfil, ...payload };
  localStorage.setItem('mockPerfilAspirante', JSON.stringify(updated));
  return updated;
}

export async function guardarDatosPersonales({
  phone,
  consent_given,
  nombre_completo,
  fecha_nacimiento,
  estado_civil,
  nacionalidad,
  provincia,
  canton,
  distrito,
  direccion,
}) {
  const usuario = await updateUsuario({ phone, consent_given });
  const perfil = await updatePerfilAspirante({
    nombre_completo,
    extra_data: {
      fecha_nacimiento,
      estado_civil,
      nacionalidad,
      provincia,
      canton,
      distrito,
      direccion,
    },
  });
  return { usuario, perfil };
}

export async function uploadAvatar(file) {
  await delay(800);
  if (!isAuthenticated()) throw new Error('No autorizado');
  return {
    id: Math.floor(Math.random() * 1000),
    user: getCurrentUser().id,
    tipo_documento: 'avatar',
    nombre_archivo: file.name,
    archivo: `avatar_${Date.now()}.jpg`,
    fecha_subida: new Date().toISOString(),
  };
}

export async function getCvVersions() {
  await delay();
  if (!isAuthenticated()) throw new Error('No autorizado');
  const cached = localStorage.getItem('mockCvVersions');
  if (cached) return JSON.parse(cached);
  localStorage.setItem('mockCvVersions', JSON.stringify(MOCK_CV_VERSIONS));
  return MOCK_CV_VERSIONS;
}

export async function uploadCvVersion(file, etiqueta, esPredeterminado = false) {
  await delay(1000);
  if (!isAuthenticated()) throw new Error('No autorizado');
  const cvVersions = JSON.parse(
    localStorage.getItem('mockCvVersions') || JSON.stringify(MOCK_CV_VERSIONS)
  );
  if (esPredeterminado) {
    cvVersions.forEach((cv) => (cv.es_predeterminado = false));
  }
  const newVersion = {
    id: Math.max(...cvVersions.map((c) => c.id), 0) + 1,
    user: getCurrentUser().id,
    nombre_etiqueta: etiqueta || file.name,
    es_predeterminado: esPredeterminado,
    archivo: `cv_${Date.now()}.pdf`,
    fecha_subida: new Date().toISOString(),
  };
  cvVersions.push(newVersion);
  localStorage.setItem('mockCvVersions', JSON.stringify(cvVersions));
  return newVersion;
}

export async function updateCvVersion(cvId, payload) {
  await delay();
  if (!isAuthenticated()) throw new Error('No autorizado');
  const cvVersions = JSON.parse(
    localStorage.getItem('mockCvVersions') || JSON.stringify(MOCK_CV_VERSIONS)
  );
  const cv = cvVersions.find((c) => c.id === cvId);
  if (!cv) throw new Error('CV no encontrado');
  if (payload.es_predeterminado) {
    cvVersions.forEach((c) => (c.es_predeterminado = false));
  }
  Object.assign(cv, payload);
  localStorage.setItem('mockCvVersions', JSON.stringify(cvVersions));
  return cv;
}

export async function deleteCvVersion(cvId) {
  await delay();
  if (!isAuthenticated()) throw new Error('No autorizado');
  let cvVersions = JSON.parse(
    localStorage.getItem('mockCvVersions') || JSON.stringify(MOCK_CV_VERSIONS)
  );
  cvVersions = cvVersions.filter((c) => c.id !== cvId);
  localStorage.setItem('mockCvVersions', JSON.stringify(cvVersions));
}

export async function getCvPreview() {
  await delay();
  if (!isAuthenticated()) throw new Error('No autorizado');
  return {
    usuario: await getUsuario(),
    perfil_aspirante: await getPerfilAspirante(),
    cv_versions: await getCvVersions(),
    documentos: await getDocumentos(),
  };
}

export async function getDocumentos(tipo) {
  await delay();
  if (!isAuthenticated()) throw new Error('No autorizado');
  const cached = localStorage.getItem('mockDocumentos');
  let docs = cached ? JSON.parse(cached) : MOCK_DOCUMENTOS;
  if (tipo) {
    docs = docs.filter((d) => d.tipo_documento === tipo);
  }
  return docs;
}

export async function uploadDocumento(file, tipo = 'certificado') {
  await delay(800);
  if (!isAuthenticated()) throw new Error('No autorizado');
  let docs = JSON.parse(
    localStorage.getItem('mockDocumentos') || JSON.stringify(MOCK_DOCUMENTOS)
  );
  const newDoc = {
    id: Math.max(...docs.map((d) => d.id), 0) + 1,
    user: getCurrentUser().id,
    tipo_documento: tipo,
    nombre_archivo: file.name,
    archivo: `doc_${Date.now()}.pdf`,
    fecha_subida: new Date().toISOString(),
  };
  docs.push(newDoc);
  localStorage.setItem('mockDocumentos', JSON.stringify(docs));
  return newDoc;
}

export async function deleteDocumento(docId) {
  await delay();
  if (!isAuthenticated()) throw new Error('No autorizado');
  let docs = JSON.parse(
    localStorage.getItem('mockDocumentos') || JSON.stringify(MOCK_DOCUMENTOS)
  );
  docs = docs.filter((d) => d.id !== docId);
  localStorage.setItem('mockDocumentos', JSON.stringify(docs));
}

export async function getPostulaciones() {
  await delay();
  if (!isAuthenticated()) throw new Error('No autorizado');
  const cached = localStorage.getItem('mockPostulaciones');
  if (cached) return JSON.parse(cached);
  localStorage.setItem('mockPostulaciones', JSON.stringify(MOCK_POSTULACIONES));
  return MOCK_POSTULACIONES;
}

export async function crearPostulacion({ vacanteId, cvVersionId, descripcion }) {
  await delay(800);
  if (!isAuthenticated()) throw new Error('No autorizado');
  let postulaciones = JSON.parse(
    localStorage.getItem('mockPostulaciones') || JSON.stringify(MOCK_POSTULACIONES)
  );
  const newPostulacion = {
    id: Math.max(...postulaciones.map((p) => p.id), 0) + 1,
    user: getCurrentUser().id,
    vacante: vacanteId,
    cv_version: cvVersionId,
    estado: 'enviada',
    fecha_postulacion: new Date().toISOString(),
    extra_data: { descripcion: descripcion || '' },
  };
  postulaciones.push(newPostulacion);
  localStorage.setItem('mockPostulaciones', JSON.stringify(postulaciones));
  return newPostulacion;
}

export async function getVacantes(params = {}) {
  await delay();
  let vacantes = [...MOCK_VACANTES];
  if (params.search) {
    const search = params.search.toLowerCase();
    vacantes = vacantes.filter(
      (v) =>
        v.titulo.toLowerCase().includes(search) ||
        v.empresa.toLowerCase().includes(search) ||
        v.descripcion.toLowerCase().includes(search)
    );
  }
  if (params.canton) {
    vacantes = vacantes.filter((v) => v.ubicacion.toLowerCase().includes(params.canton.toLowerCase()));
  }
  if (params.es_pasantia) {
    vacantes = vacantes.filter((v) => v.es_pasantia === true);
  }
  if (params.ordering === '-fecha_publicacion') {
    vacantes.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));
  }
  return {
    count: vacantes.length,
    next: null,
    previous: null,
    results: vacantes,
  };
}

export async function getVacanteDetalle(vacanteId) {
  await delay();
  const vacante = MOCK_VACANTES.find((v) => v.id === parseInt(vacanteId));
  if (!vacante) throw new Error('Vacante no encontrada');
  return vacante;
}

export async function guardarPerfilProfesional({
  resumen_profesional,
  carta_presentacion,
  soft_skills,
  power_skills,
  instituciones,
  visible,
}) {
  await delay();
  return updatePerfilAspirante({
    resumen_profesional,
    extra_data: {
      carta_presentacion,
      soft_skills,
      power_skills,
      instituciones,
      visible,
    },
  });
}

// ─── Status Helpers ─────────────────────────────────────────────────────────────

export function isLoggedIn() {
  return isAuthenticated();
}

export function getCurrentUserRole() {
  const user = getCurrentUser();
  return user?.role || null;
}

export function isAspirante() {
  return getCurrentUserRole() === 'aspirante' || isAuthenticated();
}