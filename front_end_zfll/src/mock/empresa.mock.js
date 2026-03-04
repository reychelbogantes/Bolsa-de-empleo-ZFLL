// src/mock/empresa.mock.js

export const MOCK_EMPRESA_INFO = {
  id: 10,
  nombre: "Intel Costa Rica",
  razon_social: "Intel Corporation CR S.A.",
  cedula: "3-101-999999",
  ubicacion: "Heredia, Costa Rica",
  telefono: "+506 2200-0000",
  correo: "rrhh@intel.com",
  descripcion:
    "Empresa líder en tecnología enfocada en innovación, manufactura avanzada y desarrollo de software.",
  verificada: true,
  activa: true,
};

export const MOCK_VACANTES_EMPRESA = [
  {
    id: 5001,
    puesto: "Frontend React Developer",
    area: "TI",
    fecha: "2026-02-20",
    postulantes: 12,
    estado: "ACTIVA",
    modalidad: "Híbrido",
    ubicacion: "Heredia",
    correo: "rrhh@intel.com",
    descripcion:
      "Desarrollo de interfaces en React, consumo de APIs, buenas prácticas y pruebas.",
    requisitos: ["React", "REST", "Git", "Inglés B1+"],
  },
  {
    id: 5002,
    puesto: "QA Tester Jr",
    area: "Calidad",
    fecha: "2026-02-25",
    postulantes: 8,
    estado: "PAUSADA",
    modalidad: "Presencial",
    ubicacion: "Heredia",
    correo: "talento@intel.com",
    descripcion:
      "Ejecución de casos de prueba, reporte de bugs, coordinación con desarrollo.",
    requisitos: ["Testing", "Jira", "Comunicación"],
  },
  {
    id: 5003,
    puesto: "Data Analyst Internship",
    area: "BI",
    fecha: "2026-03-01",
    postulantes: 22,
    estado: "ACTIVA",
    modalidad: "Remoto",
    ubicacion: "Costa Rica",
    correo: "jobs@intel.com",
    descripcion:
      "Apoyo en análisis de datos y dashboards. SQL, Excel y PowerBI deseable.",
    requisitos: ["SQL", "Excel", "Power BI", "Pensamiento analítico"],
  },
];

export const MOCK_POSTULANTES = [
  {
    id: 9001,
    nombre: "Dylan Sánchez Chávez",
    carrera: "Ingeniería en Sistemas",
    institucion: "TEC",
    correo: "dylansanchez09@gmail.com",
    estado: "EN REVISION",
  },
  {
    id: 9002,
    nombre: "Sofía Méndez",
    carrera: "Ing. Computación",
    institucion: "TEC",
    correo: "sofia.mendez@tec.ac.cr",
    estado: "PRESELECCIONADO",
  },
  {
    id: 9003,
    nombre: "Daniel Brenes",
    carrera: "Ing. Producción",
    institucion: "TEC",
    correo: "daniel.brenes@tec.ac.cr",
    estado: "DESCARTADO",
  },
];