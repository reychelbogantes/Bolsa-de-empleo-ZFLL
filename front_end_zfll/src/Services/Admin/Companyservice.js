// companyService.js — CRUD de Empresas
import api from './api.js';

const mapEmpresa = (e) => ({
  id:               e.id,
  name:             e.nombre            ?? e.name            ?? '',
  legalId:          e.cedula_juridica   ?? e.legalId         ?? '',
  location:         e.ubicacion         ?? e.location        ?? '',
  email:            e.usuario_email     ?? e.email           ?? '',
  phone:            e.usuario_phone     ?? e.phone           ?? '',
  // contacto_admin es el campo que guarda el admin al crear; contacto_interesados es para empresas que se registran solas
  contactName:      e.contacto_admin    ?? e.contacto_interesados ?? e.contactName ?? '',
  description:      e.descripcion       ?? e.description     ?? '',
  status:           e.activa == null
                      ? 'pendiente'
                      : (e.activa ? 'aprobada' : 'desactivada'),
  registrationDate: e.fecha_creacion
                      ? new Date(e.fecha_creacion).toLocaleDateString('es-CR')
                      : '',
  activa:           e.activa,
  sector:           e.sector_nombre     ?? '',
  size:             e.tamano_nombre     ?? '',
  foto:             e.foto_perfil       ?? '',
  _raw:             e,
});

/** GET /api/companies/ */
export const getCompanies = async (params = {}) => {
  try {
    const { data } = await api.get('/api/companies/', { params });
    const list = Array.isArray(data) ? data : data.results ?? [];
    return list.map(mapEmpresa);
  } catch {
    return [];
  }
};

/** GET /api/companies/?activa=false */
export const getPendingCompanies = async () => {
  try {
    const { data } = await api.get('/api/companies/', { params: { activa: false } });
    const list = Array.isArray(data) ? data : data.results ?? [];
    return list.map(mapEmpresa);
  } catch {
    return [];
  }
};

/** GET /api/companies/{id}/ */
export const getCompanyById = async (id) => {
  try {
    const { data } = await api.get(`/api/companies/${id}/`);
    return mapEmpresa(data);
  } catch {
    return null;
  }
};

/** PATCH /api/companies/{id}/ */
export const updateCompany = async (id, payload) => {
  const { data } = await api.patch(`/api/companies/${id}/`, payload);
  return mapEmpresa(data);
};

export const updateCompanyStatus = async (id, activa) => {
  const { data } = await api.patch(`/api/companies/${id}/`, { activa });
  return mapEmpresa(data);
};

export const createCompany = async (formData, approve = false) => {
  const payload = {
    email:           formData.email        ?? '',
    password:        formData.password     ?? '',
    phone:           formData.phone        ?? '',
    nombre:          formData.name         ?? '',
    nombre_empresa:  formData.name         ?? '',
    cedula_juridica: formData.legalId      ?? '',
    ubicacion:       formData.location     ?? '',
    contacto_admin:  formData.contactName  ?? '',
  };

  const { data } = await api.post('/api/auth/register/empresa/', payload);
  const empresa = data.empresa ?? data;

  if (approve && empresa?.id) {
    await updateCompanyStatus(empresa.id, true);
  }

  return empresa;
};

export const deleteCompany = async (id) => {
  await api.delete(`/api/companies/${id}/`);
};
