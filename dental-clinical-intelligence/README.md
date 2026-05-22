# 🦷 Dental Clinical Intelligence Platform

Plataforma web full-stack para inteligencia clínica dental con IA integrada usando Context Studio MCP.

## 🌟 Características

- 📊 Dashboard para dentistas con métricas en tiempo real
- 👥 Gestión completa de pacientes con búsqueda avanzada
- 🔍 Historial dental detallado con análisis de radiografías
- 🤖 Asistente de IA para consultas clínicas
- 💊 Recomendaciones de tratamiento automatizadas
- 📄 Generación de reportes clínicos
- 🎨 UI profesional médica (azul y blanco)

## 🏗️ Arquitectura

```
dental-platform/
├── frontend/          # React Application
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas principales
│   │   ├── services/     # Servicios API
│   │   └── styles/       # Estilos CSS
│   └── package.json
├── backend/           # Node.js + Express API
│   ├── routes/          # Rutas API
│   ├── controllers/     # Controladores
│   ├── services/        # Lógica de negocio
│   └── config/          # Configuración
└── README.md
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18.x
- npm >= 9.x
- Context Studio MCP configurado

### Instalación

#### 1. Clonar el repositorio

```bash
cd dental-platform
```

#### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:

```env
PORT=5000
NODE_ENV=development

# Context Studio MCP
CONTEXT_ID=ctx_80f2c51f45e3
MCP_GATEWAY_URL=https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/8ccdd203bdee4014b08e82eedb6046e2/mcp
MCP_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaHJhZGRoYS5wYXJpa2gxQGlibS5jb20iLCJqdGkiOiJlMDM3NDhhOC1lYmFhLTQyMjgtYTJlNS1lZDlhNTE2ODA5M2QiLCJ0b2tlbl91c2UiOiJhcGkiLCJpYXQiOjE3NzkzODk0NDIsImlzcyI6Im1jcGdhdGV3YXkiLCJhdWQiOiJtY3BnYXRld2F5LWFwaSIsInVzZXIiOnsiZW1haWwiOiJzaHJhZGRoYS5wYXJpa2gxQGlibS5jb20iLCJmdWxsX25hbWUiOiJBUEkgVG9rZW4gVXNlciIsImlzX2FkbWluIjp0cnVlLCJhdXRoX3Byb3ZpZGVyIjoiYXBpX3Rva2VuIn0sInRlYW1zIjpudWxsLCJzY29wZXMiOnsic2VydmVyX2lkIjoiOGNjZGQyMDNiZGVlNDAxNGIwOGU4MmVlZGI2MDQ2ZTIiLCJwZXJtaXNzaW9ucyI6W10sImlwX3Jlc3RyaWN0aW9ucyI6W10sInRpbWVfcmVzdHJpY3Rpb25zIjp7fX0sImV4cCI6MTc4NzE2NTQ0Mn0.IFHTrUUY6L96pWxiN4C5mPCNXgZfaFdrezl5iSk1IJA
MCP_API_KEY=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbEFkZHJlc3MiOiJjaHJpc3RpYW4uanVhcmV6QGlibS5jb20iLCJ0ZWFtSWQiOiI2YTBjZjNiMTMxMzAwZWU0ZTVjNDJiNGMiLCJjb250ZXh0SWQiOiJjdHhfODBmMmM1MWY0NWUzIiwiaWF0IjoxNzc5Mzg5NDQxLCJleHAiOjE3ODcxNjU0NDEsImlzcyI6ImNvbnRleHQtYnJva2VyIiwidG9rZW5faWQiOiI2MzE4YTVmNi04ZTA4LTQyNDItYjA2OS04ZGEyMDFhY2Q3MjQifQ.CNJv9NBW0olKAquFR-b_HUzNJV0o1zGgKTD5Bt9FqqKn9zu_hyg3l3J9IS1dDOFaupZYk7MoABhezPllfRkaPQ

# CORS
CORS_ORIGIN=http://localhost:3000
```

Iniciar servidor:

```bash
npm run dev
```

El backend estará disponible en: `http://localhost:5000`

#### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Dental Clinical Intelligence
```

Iniciar aplicación:

```bash
npm start
```

El frontend estará disponible en: `http://localhost:3000`

## 📡 API Endpoints

### Pacientes

- `GET /api/patients` - Listar todos los pacientes
- `GET /api/patients/search?q=query` - Buscar pacientes
- `GET /api/patients/:id` - Obtener detalles de paciente
- `POST /api/patients` - Crear nuevo paciente
- `PUT /api/patients/:id` - Actualizar paciente
- `DELETE /api/patients/:id` - Eliminar paciente

### Registros Dentales

- `GET /api/dental-records/:patientId` - Obtener historial dental
- `POST /api/dental-records` - Crear registro dental
- `GET /api/dental-records/:id/xrays` - Obtener radiografías
- `POST /api/dental-records/:id/analysis` - Analizar radiografía

### Asistente IA

- `POST /api/ai/chat` - Enviar pregunta al asistente
- `POST /api/ai/recommendations` - Obtener recomendaciones
- `POST /api/ai/analyze-case` - Analizar caso clínico

### Reportes

- `GET /api/reports/:patientId` - Obtener reportes de paciente
- `POST /api/reports/generate` - Generar nuevo reporte
- `GET /api/reports/:id/download` - Descargar reporte

### Dashboard

- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/recent-patients` - Pacientes recientes
- `GET /api/dashboard/pending-cases` - Casos pendientes

## 🎨 Componentes Frontend

### Páginas

- **Dashboard** - Vista principal con métricas
- **PatientList** - Lista de pacientes con búsqueda
- **PatientDetail** - Detalles y historial del paciente
- **AIAssistant** - Chat con asistente de IA
- **TreatmentPlans** - Planes de tratamiento

### Componentes

- **Navbar** - Barra de navegación
- **Sidebar** - Menú lateral
- **PatientCard** - Tarjeta de paciente
- **DentalChart** - Gráfico dental interactivo
- **ChatInterface** - Interfaz de chat
- **RecommendationPanel** - Panel de recomendaciones
- **XRayViewer** - Visor de radiografías

## 🔐 Seguridad

- Autenticación con JWT (próximamente)
- Validación de datos en backend
- Sanitización de inputs
- CORS configurado
- Rate limiting en API
- Tokens MCP seguros

## 🧪 Testing

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend (Node.js)

```bash
cd backend
npm run build
npm start
```

### Frontend (React)

```bash
cd frontend
npm run build
```

Los archivos estáticos estarán en `frontend/build/`

## 🛠️ Tecnologías

### Frontend
- React 18
- React Router v6
- Axios
- Material-UI / Tailwind CSS
- Chart.js
- React Query

### Backend
- Node.js 18+
- Express.js
- Axios (para MCP)
- CORS
- dotenv
- Morgan (logging)

## 📊 Integración con Context Studio

La aplicación se integra con Context Studio MCP para:

- Consultar información de pacientes
- Buscar casos similares (búsqueda vectorial)
- Obtener recomendaciones de tratamiento
- Validar datos clínicos
- Generar reportes automáticos

## 🐛 Troubleshooting

### Error: "Cannot connect to backend"
- Verificar que el backend esté corriendo en puerto 5000
- Verificar CORS_ORIGIN en .env del backend

### Error: "MCP authentication failed"
- Verificar tokens en .env
- Verificar que Context ID sea correcto
- Verificar que los tokens no hayan expirado

### Error: "Patient not found"
- Verificar que Context Studio tenga datos
- Verificar conexión a MCP Gateway

## 📝 Licencia

MIT License - Ver LICENSE file

## 👥 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📞 Soporte

Para problemas o preguntas:
- Crear un issue en GitHub
- Email: soporte@dental-platform.com

## 🎯 Roadmap

- [ ] Autenticación de usuarios
- [ ] Roles y permisos
- [ ] Notificaciones en tiempo real
- [ ] Integración con PACS
- [ ] App móvil
- [ ] Análisis predictivo con ML
- [ ] Telemedicina

---

**Versión:** 1.0.0  
**Última actualización:** 2026-05-22  
**Autor:** Dental Platform Team