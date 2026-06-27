# Integraciones reales en GoToGym Developers

Fecha: 2026-06-27

## Estado funcional

La plataforma ya puede ejecutar un flujo realista de integracion:

1. Un administrador registra una aplicacion con `redirectUris`, scopes y secreto.
2. El usuario inicia OAuth Authorization Code + PKCE.
3. Si falta consentimiento, `/oauth/authorize` devuelve `consentRequired` y crea un consentimiento pendiente.
4. El usuario autoriza o rechaza desde `/api/v1/consents`.
5. Al repetir `/oauth/authorize`, se emite un authorization code.
6. La app cambia el code por access token, refresh token e id token.
7. Las APIs de Quantum Coach validan token, scopes, consentimiento, tenant y redaccion.
8. Tokens, refresh tokens, llaves, revocaciones, aplicaciones, consentimientos y auditoria persisten en JSON.

## Variables minimas de produccion

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=...
OAUTH_ISSUER=https://api.developers.gotogym.store
OAUTH_REQUIRE_CLIENT_SECRET=true
CORS_ORIGINS=https://developers.gotogym.store,https://chat.openai.com
GTG_DATA_FILE=/data/gotogym-developers-store.json
```

## Backend publico

El backend incluye `backend/Dockerfile` y endpoint:

```http
GET /health
```

Respuesta:

```json
{
  "success": true,
  "service": "gotogym-developers-api",
  "status": "ok"
}
```

## Flujo para integrar una app externa

```mermaid
sequenceDiagram
  participant U as Usuario
  participant T as App externa
  participant O as OAuth GoToGym
  participant C as Consentimientos
  participant Q as Quantum Coach API

  T->>O: GET /oauth/authorize + client_id + redirect_uri + PKCE
  O->>O: Validar app, redirect URI y scopes
  O->>C: Buscar consentimiento autorizado
  alt falta consentimiento
    O->>C: Crear consentimiento pendiente
    O-->>T: consentRequired + consentId
    U->>C: Autorizar consentimiento
  else consentimiento valido
    O-->>T: redirectUrl con code
  end
  T->>O: POST /oauth/token + code + PKCE + client_secret
  O-->>T: access_token + refresh_token + id_token
  T->>Q: POST /api/v1/coach-integrations/context
  Q->>Q: Validar token, scopes, consentimiento y tenant
  Q-->>T: Contexto seguro y redactado
```

## Limitaciones restantes

Esta version queda lista para un piloto real con backend desplegado y volumen persistente. Para escala empresarial alta conviene reemplazar el store JSON por Postgres, Redis o un managed database con migraciones, backups y bloqueo transaccional.
