# GoToGym Developers Backend

Backend API-first profesional y escalable para la plataforma GoToGym Developers.

## Arquitectura y buenas prácticas

- **Node.js + TypeScript**
- **Separación por capas:**
	- `api/routes`: Definición de rutas
	- `controllers`: Lógica de entrada/salida y validación
	- `services`: Lógica de negocio
	- `repositories`: Acceso a datos (mock o persistencia futura)
	- `models`: Tipos y entidades de dominio
	- `types`: Tipos de respuesta y utilidades
	- `middlewares`: Manejo de errores, autenticación, etc.
	- `config`: Configuración de base de datos, OAuth2, Azure
	- `utils`: Utilidades y logger
- **Manejo de errores centralizado**
- **Responses JSON consistentes:**
	```json
	{
		"success": true,
		"data": { ... }
	}
	```
	o en caso de error:
	```json
	{
		"success": false,
		"error": { "code": "NOT_FOUND", "message": "..." }
	}
	```
- **Preparado para:**
	- Autenticación OAuth2
	- Persistencia real (DB)
	- Integración con Azure

## Scripts

- `npm install` — Instala dependencias
- `npm run dev` — Arranca el servidor en modo desarrollo (hot reload)
- `npm run build` — Compila TypeScript a JavaScript
- `npm start` — Ejecuta el servidor compilado
- `npm test` — Ejecuta pruebas automáticas

## Pruebas automatizadas

Las pruebas están en la carpeta `tests/` y cubren:
- Listado de integraciones
- Simulación de sincronización
- Respuesta BodyGraph

### Ejecutar pruebas

1. Instala dependencias:
	 ```
	 npm install
	 ```
2. Ejecuta los tests:
	 ```
	 npm test
	 ```

## Endpoints principales

- `GET /api/integrations` — Lista integraciones disponibles/conectadas
- `POST /api/integrations/:id/sync` — Ejecuta una sincronización simulada
- `GET /api/bodygraph/:integrationId` — Devuelve un payload normalizado tipo BodyGraph

---

GoToGym Developers — API-first, extensible y lista para escalar 🚀
