# GoToGym Developers Backend

Este es el primer módulo backend API-first para la plataforma GoToGym Developers.

## Scripts

- `npm install` — Instala dependencias
- `npm run dev` — Arranca el servidor en modo desarrollo (hot reload)
- `npm run build` — Compila TypeScript a JavaScript
- `npm start` — Ejecuta el servidor compilado

## Endpoints principales

- `GET /api/integrations` — Lista integraciones disponibles/conectadas
- `POST /api/integrations/:id/sync` — Ejecuta una sincronización simulada
- `GET /api/bodygraph/:integrationId` — Devuelve un payload normalizado tipo BodyGraph

## Arquitectura
- Express + TypeScript
- Arquitectura en capas (routes, controllers, services, models, data)
- Mock data y lógica desacoplada para fácil migración a base de datos real
- Preparado para OAuth2, webhooks, consentimientos y multi-tenant

---

GoToGym Developers — API-first, extensible y lista para escalar 🚀
