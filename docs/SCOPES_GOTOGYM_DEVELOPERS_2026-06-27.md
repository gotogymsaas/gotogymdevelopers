# Sistema de scopes para GoToGym Developers

## Scopes iniciales

Los scopes publicos de GoToGym Developers usan formato `dominio.accion`. La primera version define permisos de lectura para integraciones de terceros:

| Scope | Dominio | Sensibilidad | Requiere consentimiento | Requiere auditoria |
| --- | --- | --- | --- | --- |
| `profile.read` | Identidad | Baja | Si | No |
| `wellbeing.read` | Bienestar | Alta | Si | Si |
| `metrics.read` | Metricas | Alta | Si | Si |
| `analytics.read` | Analitica | Media | Si | Si |
| `organization.read` | Organizacion | Media | No | Si |
| `devices.read` | Dispositivos | Media | Si | No |
| `documents.read` | Documentos | Alta | Si | Si |

## Jerarquias

La jerarquia expande scopes de alto nivel hacia sus dependencias minimas:

| Scope solicitado | Incluye implicitamente |
| --- | --- |
| `profile.read` | Ninguno |
| `devices.read` | `profile.read` |
| `documents.read` | `profile.read` |
| `wellbeing.read` | `profile.read` |
| `metrics.read` | `profile.read`, `wellbeing.read`, `devices.read` |
| `organization.read` | Ninguno |
| `analytics.read` | `profile.read`, `wellbeing.read`, `metrics.read`, `organization.read` |

## Restricciones por rol

| Rol | Scopes permitidos |
| --- | --- |
| `end_user` | `profile.read`, `wellbeing.read`, `metrics.read`, `devices.read`, `documents.read` |
| `company_owner` | `profile.read`, `wellbeing.read`, `metrics.read`, `analytics.read`, `organization.read`, `devices.read` |
| `company_manager` | `profile.read`, `wellbeing.read`, `metrics.read`, `analytics.read`, `organization.read`, `devices.read` |
| `gotogym_admin` | Todos |
| `integrator` | `profile.read`, `wellbeing.read`, `metrics.read`, `analytics.read`, `organization.read`, `devices.read` |

`documents.read` queda restringido a usuarios finales y administradores porque expone informacion personal de alta sensibilidad.

## Validaciones

El backend centraliza las validaciones en `backend/src/types/developer-scopes.ts`:

```ts
export type DeveloperScope =
  | 'profile.read'
  | 'wellbeing.read'
  | 'metrics.read'
  | 'analytics.read'
  | 'organization.read'
  | 'devices.read'
  | 'documents.read';

export interface DeveloperScopeDefinition {
  key: DeveloperScope;
  domain: DeveloperScopeDomain;
  description: string;
  parent?: DeveloperScope;
  includes: DeveloperScope[];
  allowedRoles: AppRole[];
  internalScopes: Scope[];
  requiresConsent: boolean;
  requiresAudit: boolean;
  sensitivity: DeveloperScopeSensitivity;
}
```

Reglas:

- Rechazar scopes no incluidos en el catalogo.
- Expandir jerarquias antes de guardar una aplicacion.
- Rechazar scopes restringidos para el rol activo.
- Exigir al menos un scope valido.
- Mapear scopes publicos a permisos internos `resource:action:level` para interoperar con RBAC.
- Auditar scopes sensibles o de organizacion.
- Requerir consentimiento explicito para scopes que exponen datos personales o de salud.

## Middlewares

Los middlewares viven en `backend/src/api/middlewares/auth.middleware.ts`:

```ts
requireDeveloperScope('metrics.read')
validateRequestedDeveloperScopes(req => req.body.authorizedScopes)
```

Uso esperado:

- `requireDeveloperScope(scope)`: protege endpoints que consumen scopes publicos.
- `validateRequestedDeveloperScopes(getScopes)`: valida y normaliza scopes solicitados al crear o editar aplicaciones.
- `requireScope(scopeInterno)`: se mantiene para rutas internas RBAC ya existentes.

## Flujo Mermaid

```mermaid
flowchart TD
  A[App solicita scopes] --> B{Scopes existen?}
  B -- No --> X[400 INVALID_SCOPES]
  B -- Si --> C[Expandir jerarquia]
  C --> D{Rol puede solicitar todos?}
  D -- No --> Y[400 restrictedScopes]
  D -- Si --> E[Guardar scopes normalizados]
  E --> F{Requiere consentimiento?}
  F -- Si --> G[Crear solicitud de consentimiento]
  F -- No --> H[Scope operativo]
  G --> I[Usuario autoriza/rechaza]
  I --> J[Audit event]
  H --> K[Middleware valida acceso]
  J --> K
```

## Secuencia de autorizacion

```mermaid
sequenceDiagram
  actor Dev as Developer
  actor User as Usuario
  participant API as GoToGym Developers API
  participant Scope as Scope Validator
  participant Consent as Consent Service
  participant Audit as Audit Service

  Dev->>API: POST /api/v1/applications { authorizedScopes }
  API->>Scope: validateRequestedDeveloperScopes
  Scope-->>API: scopes normalizados
  API-->>Dev: App creada

  Dev->>API: Solicita datos con scope
  API->>Scope: requireDeveloperScope(scope)
  Scope->>Consent: Verificar consentimiento si aplica
  Consent-->>Scope: autorizado
  Scope-->>API: acceso permitido
  API->>Audit: Registrar uso si requiere auditoria
  API-->>Dev: Datos permitidos

  User->>Consent: Revoca scope
  Consent->>Audit: consent.revoked
```
