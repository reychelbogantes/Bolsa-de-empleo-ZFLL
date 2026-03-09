# :luggage: Bolsa de Empleo ZFLL

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Django%20REST-092e20?logo=django&logoColor=white)
![BD](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20Google%20OAuth-blue)
![Storage](https://img.shields.io/badge/Media-Cloudinary-3448c5?logo=cloudinary&logoColor=white)

Plataforma de **bolsa de empleo multiperfil** para la **Zona Franca La Lima (ZFLL)**.
Conecta **aspirantes**, **empresas** e **instituciones educativas** a través de vacantes, postulaciones, pasantías y analítica centralizada. Incluye un **panel de administración** avanzado para el equipo de ZFLL.

---

## :rocket: Características

### :bust_in_silhouette: Aspirantes
- Creación de perfil profesional completo (datos personales, formación, experiencia, CV).
- Exploración de vacantes y postulaciones en línea.
- Panel de control con resumen de estado de perfil y postulaciones.
- Modal de postulación con confirmación y notificaciones visuales.

### :office: Empresas
- Perfil de empresa y gestión de información corporativa.
- Creación y administración de vacantes.
- Visualización básica de candidatos y postulaciones asociadas.

### :mortar_board: Instituciones
- Gestión de programas, egresados y demanda laboral.
- Módulos específicos para pasantías, vacantes disponibles y gestión de usuarios institucionales.

### :hammer_and_wrench: Administradores (ZFLL)
- **Panel Admin** con sidebar, topbar y secciones animadas:
  - `Dashboard`: visión general de la plataforma.
  - `Empresas`: gestión de empresas registradas.
  - `Instituciones`: gestión de instituciones educativas.
  - `Aspirantes`: administración de perfiles de aspirantes.
  - `Vacantes Pendientes`: aprobación/rechazo de vacantes.
  - `Formularios de Registro`: revisión de solicitudes de nuevas cuentas (empresas/instituciones).
  - `Administradores`: gestión de usuarios del panel.
- Conteo dinámico de pendientes (vacantes, formularios).
- Vista responsiva con overlay para dispositivos móviles.

### :bell: Notificaciones
- Módulo de preferencias de notificación para usuarios.
- Endpoints de notificaciones en backend con soporte para tareas asíncronas (Celery).

---

## :pushpin: Estado del Proyecto

- :white_check_mark: Autenticación multiperfil (aspirante, empresa, institución, admin) con redirección según rol.
- :white_check_mark: Frontend público (homepage, carrusel de empresas, vacantes destacadas).
- :white_check_mark: Panel de aspirante con sidebar, dashboard, datos personales, perfil profesional y postulaciones.
- :white_check_mark: Panel de empresa e institución con componentes dedicados.
- :white_check_mark: Panel de administración con secciones principales operativas.
- :white_check_mark: Backend Django REST con JWT, Google OAuth y base de datos PostgreSQL.
- :white_check_mark: Integración con **Cloudinary** para manejo de archivos e imágenes.
- :white_check_mark: Estructura para tareas asíncronas con **Celery + Redis**.

:warning: Pendiente:
- Documentación detallada de todos los endpoints API (Swagger / Redoc o similar).
- Pruebas automatizadas completas (unitarias e integración).
- Ajustes finales de UX y accesibilidad.

---

## :open_file_folder: Estructura del Proyecto

```bash
Bolsa-de-empleo-ZFLL-main/
├── front_end_zfll/           # Frontend React + Vite
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Home/
│   │   │   ├── Admin/
│   │   │   ├── empresa/
│   │   │   ├── instintuciones/
│   │   │   ├── PerfilAspirante/
│   │   │   └── notifications/
│   │   ├── Pages/
│   │   │   ├── Homepage/
│   │   │   ├── Login_Regist/
│   │   │   ├── Login_Admin/
│   │   │   ├── Empresa/
│   │   │   ├── Instintucion/
│   │   │   └── PerfilAspirante/
│   │   ├── Routes/
│   │   │   └── Routing.jsx
│   │   ├── Services/         # Clientes HTTP hacia el backend (accounts, jobs, applications, etc.)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── ...
│
└── back_end_zfll/            # Backend Django REST
    ├── config/               # settings, urls, wsgi/asgi, celery
    ├── apps/
    │   ├── accounts/         # Usuarios, roles y auth
    │   ├── companies/        # Empresas
    │   ├── institutions/     # Instituciones educativas
    │   ├── jobs/             # Vacantes
    │   ├── applications/     # Postulaciones
    │   ├── catalogs/         # Catálogos (áreas, puestos, etc.)
    │   ├── cv/               # Gestión/generación de CV
    │   ├── imports/          # Importación de datos (por ejemplo, desde Excel)
    │   ├── notifications/    # Notificaciones y tareas asociadas
    │   ├── analytics/        # Analítica de uso
    │   ├── audit/            # Auditoría
    │   ├── auth_api/         # Endpoints de autenticación API
    │   └── pasantias/        # Módulo de pasantías
    ├── templates/
    │   ├── emails/
    │   └── cv/
    ├── requirements/         # base.txt, dev.txt, prod.txt
    └── manage.py
```

---

## :busts_in_silhouette: Roles Principales

- **Aspirante**: crea perfil, explora vacantes, se postula y gestiona su historial.
- **Empresa**: administra perfil, publica vacantes y gestiona candidatos.
- **Institución**: gestiona programas, egresados y pasantías/relaciones con empresas.
- **Administrador ZFLL**: supervisa toda la plataforma, gestiona entidades y valida solicitudes.

---

## :wrench: Tecnologías y Librerías Utilizadas

### :atom_symbol: Frontend
- **React + Vite** → framework y bundler para una UI rápida y moderna.
- **react-router-dom** → enrutamiento entre páginas (`/`, `/login`, `/perfil-aspirante`, `/perfil-empresa`, `/perfil-institucion`, `/PanelAdmin`, etc.).
- **motion (motion/react)** → animaciones para transiciones suaves en el panel de administración.

### :snake: Backend
- **Django** → framework backend principal.
- **Django REST Framework (DRF)** → creación de API REST para todos los módulos.
- **SimpleJWT** → autenticación basada en tokens JWT.
- **django-filter** → filtros avanzados para listados.

### :key: Autenticación y Seguridad
- **AUTH_USER_MODEL personalizado (`accounts.User`)** con soporte multirol.
- **dj-rest-auth + django-allauth + Google provider** → registro/login con email y Google OAuth 2.0.
- Políticas de CORS configuradas para permitir el frontend (`http://localhost:5173`, `http://localhost:3000`).

### :floppy_disk: Base de Datos y Almacenamiento
- **PostgreSQL** → base de datos principal.
- **Cloudinary + cloudinary_storage** → almacenamiento de archivos y recursos multimedia.

### :incoming_envelope: Tareas Asíncronas
- **Celery + Redis** → procesamiento en segundo plano para notificaciones, importaciones, etc.

---

## :globe_with_meridians: Endpoints / Módulos del Backend (visión general)

> Los paths exactos se definen en `config/urls.py` y los `urls.py` de cada app, pero a alto nivel se exponen módulos como:

- **/api/accounts/** → gestión de usuarios y autenticación.
- **/api/companies/** → empresas (registro, actualización, aprobación, etc.).
- **/api/institutions/** → instituciones y sus programas.
- **/api/jobs/** → vacantes.
- **/api/applications/** → postulaciones a vacantes.
- **/api/catalogs/** → catálogos (tipos de puestos, áreas, etc.).
- **/api/cv/** → generación/gestión de CV.
- **/api/imports/** → importación de datos (ej. archivos Excel).
- **/api/notifications/** → notificaciones y preferencias.
- **/api/analytics/** → analítica y métricas.
- **/api/audit/** → auditoría de acciones.
- **/api/auth/** → endpoints de autenticación específica (tokens, refresh, etc.).
- **/api/pasantias/** → pasantías y programas relacionados.

---

## :arrow_forward: Puesta en Marcha (resumen)

### Backend (Django)

1. Crear y activar entorno virtual.
2. Instalar dependencias:

   ```bash
   pip install -r requirements/base.txt
   # o dev/prod según el entorno
   ```

3. Configurar variables de entorno (`.env` o similares):
   - `SECRET_KEY`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`,
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`,
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
   - `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`, etc.

4. Aplicar migraciones y levantar servidor:

   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend (React + Vite)

1. Entrar a `front_end_zfll/`.
2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Crear archivo `.env` para la URL del backend (por ejemplo `VITE_API_BASE_URL`).
4. Levantar proyecto:

   ```bash
   npm run dev
   ```
