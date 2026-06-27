# Consentimientos

## Objetivo

La pantalla Consentimientos permite que un usuario autorice, rechace o revoque el intercambio de informacion con integraciones de terceros. Cada decision queda trazada en historial operativo y eventos de auditoria.

## Modelo de datos

```ts
type ConsentStatus = 'pending' | 'authorized' | 'rejected' | 'revoked';

interface IntegrationConsent {
  id: string;
  userId: string;
  integrationId: string;
  integrationName: string;
  ownerCompany: string;
  requestedScopes: Scope[];
  status: ConsentStatus;
  requestedAt: string;
  authorizedAt?: string;
  rejectedAt?: string;
  revokedAt?: string;
  updatedAt: string;
}

interface ConsentHistoryEvent {
  id: string;
  consentId: string;
  action:
    | 'consent.requested'
    | 'consent.authorized'
    | 'consent.rejected'
    | 'consent.revoked';
  actorUserId: string;
  status: ConsentStatus;
  createdAt: string;
  metadata?: Record<string, unknown>;
}
```

## API REST

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/v1/consents` | Lista consentimientos del usuario autenticado. |
| GET | `/api/v1/consents/:id/history` | Devuelve el consentimiento con historial. |
| POST | `/api/v1/consents/:id/authorize` | Autoriza compartir los scopes solicitados. |
| POST | `/api/v1/consents/:id/reject` | Rechaza una solicitud pendiente. |
| POST | `/api/v1/consents/:id/revoke` | Revoca un consentimiento autorizado. |

Todas las rutas requieren `Authorization: Bearer <token>`.

## Eventos de auditoria

| Evento | Cuando se emite | Metadata principal |
| --- | --- | --- |
| `consent.requested` | Se crea una solicitud de consentimiento. | `integrationId`, `integrationName`, `scopes` |
| `consent.authorized` | El usuario autoriza compartir informacion. | `integrationId`, `integrationName`, `scopes` |
| `consent.rejected` | El usuario rechaza una solicitud pendiente. | `integrationId`, `integrationName`, `scopes` |
| `consent.revoked` | El usuario revoca un permiso previamente autorizado. | `integrationId`, `integrationName`, `scopes` |

## Diagrama Mermaid

```mermaid
sequenceDiagram
  actor Usuario
  participant UI as Pantalla Consentimientos
  participant API as Consent REST API
  participant Service as ConsentService
  participant Audit as AuditService
  participant Store as ConsentRepository

  Usuario->>UI: Revisa integracion y scopes
  UI->>API: GET /api/v1/consents
  API->>Service: listConsents(actor)
  Service->>Store: findByUser(actor.id)
  Store-->>Service: consentimientos
  Service-->>API: lista
  API-->>UI: 200 OK

  alt Autorizar
    Usuario->>UI: Autorizar
    UI->>API: POST /api/v1/consents/:id/authorize
    API->>Service: authorizeConsent(actor, id)
    Service->>Store: update(status=authorized)
    Service->>Store: addHistory(consent.authorized)
    Service->>Audit: recordAuditEvent(consent.authorized)
    API-->>UI: ConsentWithHistory
  else Rechazar
    Usuario->>UI: Rechazar
    UI->>API: POST /api/v1/consents/:id/reject
    API->>Service: rejectConsent(actor, id)
    Service->>Store: update(status=rejected)
    Service->>Audit: recordAuditEvent(consent.rejected)
    API-->>UI: ConsentWithHistory
  else Revocar
    Usuario->>UI: Revocar
    UI->>API: POST /api/v1/consents/:id/revoke
    API->>Service: revokeConsent(actor, id)
    Service->>Store: update(status=revoked)
    Service->>Audit: recordAuditEvent(consent.revoked)
    API-->>UI: ConsentWithHistory
  end

  Usuario->>UI: Consultar historial
  UI->>API: GET /api/v1/consents/:id/history
  API->>Service: getConsentHistory(actor, id)
  Service->>Store: findHistory(id)
  API-->>UI: historial
```
