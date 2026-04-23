# Commit history

Generated on: 2026-04-23 21:54:33 UTC

## aa39e8aeff6b5a8b38ee9e5c9704f4a808bb788d
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-23 18:13:54 +0000
Message: fix(deploy): include staticwebapp config in SWA upload


---

## e41800fc027bd37e760893534a2e773f753090ee
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-23 17:03:30 +0000
Message: chore(deploy): trigger swa workflow

Ajuste jueves 23 de abril, Prompt — Navegación desde Gráficos + Leyenda de Sueño en GoToGym Developers

---

## 136c2855053e97de847fee4bedea1648e10654d1
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-23 16:58:13 +0000
Message: feat(frontend): navegacion charts->cards y leyenda de sueno

Ajuste jueves 23 de abril, Prompt — Navegación desde Gráficos + Leyenda de Sueño en GoToGym Developers

---

## d2dfc2321921b5fbfdbe8bf5bdbda126f05072eb
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-21 22:45:37 +0000
Message: feat(frontend): agregar resumen smartwatch con charts en dashboard user


---

## 6b8ed3448f5a54f0baad57295aa60c709a3f7b03
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-21 22:32:47 +0000
Message: feat: route user smartwatch cards to /cards and clean dashboard


---

## 2ab8566576f9acfc943742f2404ba56c12ac438c
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-21 22:20:25 +0000
Message: feat: add interactive expandable smartwatch health cards


---

## 0e79da189d95b4f41ddae0a57caddedc0bce9800
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-21 21:40:26 +0000
Message: feat: keep sidebar for user and gym with dashboard only


---

## 8bac4da39b80e29f36a3abba77804c365bd3eee8
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-21 21:24:51 +0000
Message: ci: harden swa deploy workflow with prebuild and token validation


---

## 20baa682ae730ee9bc6a7af502131a880ca3bd1b
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-21 21:06:22 +0000
Message: feat: add JWT auth and versioned smartwatch integration


---

## a19973ac7dcc25b3f0600ae1dbe9fd3d62d1dcb0
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-21 14:55:51 +0000
Message: ci(frontend): add automatic deploy workflow for Azure Static Web Apps


---

## b8149b3a862c69b947dbc2d13e3c0e636f150b86
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-21 14:04:32 +0000
Message: feat(auth): add logout button and redirect to home


---

## d09eed733c8dd59795452f1daae5360dbe27d1d2
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-21 13:41:33 +0000
Message: feat(frontend): add routed app structure with home login and protected dashboard


---

## 6f47915bb1bc34f815b00222eff3855af5efb27b
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-08 03:52:15 +0000
Message: feat: dashboard operativo — Sync dinámico con estados aleatorios y notificaciones reactivas

Cambios:
- types: IntegrationStatus ampliado con syncing_error, timeout, pending_review, failed, unauthorized
- useDeveloperDashboard: syncIntegration(id) simula Sync → estado aleatorio no-connected (900ms spinner), expone syncingId
- useNotifications: filtra status !== 'connected' (no solo disconnected), mensajes dinámicos por estado
- IntegrationsTable: prop onSyncRow+syncingId, spinner por fila individual, Sync habilitado para todos los estados, toolbar muestra contador de alertas (≠ connected)
- GoToGymDeveloperConsole: wiring syncIntegration+syncingId → IntegrationsTable
- CSS: badges y status-dots para syncing_error, timeout, pending_review, failed, unauthorized

---

## 18d16ebd77a841758e8d14a280efb3564ff6a2cf
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-08 03:38:07 +0000
Message: feat: refinamiento premium del dashboard — polish visual v2

CSS:
- radius/shadow escalados (--radius 14px, 4 capas shadow-xl)
- Sidebar: gradient lineal, active con glow azul/índigo en ::before
- Header: backdrop-filter blur, box-shadow en capa, breadcrumb refinado
- Metric cards: layout label-left/icon-right canónico SaaS, font 1.9rem
- Stat cards: icon-wrap con box-shadow de color, icon scale en hover
- Table: gradiente en thead, transición rowHover azul, integration-logo refinado
- Badges: font-weight 800, uppercase, letter-spacing
- Buttons: box-shadow en primary, ring en secondary/danger focus
- Action cards: hover elevación, connect-row ring
- Results: terminal-bar con gradiente
- Tokens: --ring, --transition-fast, --shadow-xl, --radius-xs

DashboardSection: fix metric card layout → gtg-metric-header (label+icon)

---

## 2bebeda9b759dcecba12280c9dbc06710faa8f15
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-08 02:54:45 +0000
Message: feat: rediseño premium del sistema de notificaciones

- NotificationBell: SVG icons (sans emojis), borde acento izquierdo,
  badge tipo-pill por integración, CTA con slide-in en hover,
  estado vacío con ícono SVG en círculo verde, botón trigger dedicado
- CSS: panel 360px con flecha decorativa ::before, gradientes en
  header/footer, notifItemIn animation, scrollbar fina, badgePop mejorado
- Fix tsconfig.json: agrega 'vite/client' en types (import.meta.env)

---

## bd4e08b0dd4402aeda71edaa9a5e3efd0338d48c
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-08 02:47:24 +0000
Message: feat: sistema de notificaciones automáticas basado en estado de integraciones


---

## b15b617f98737b94679943af09f147fd7399c6bf
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-08 02:39:53 +0000
Message: fix: actualizar moduleResolution a node16 en backend


---

## 72da9adefcb476efeb80ed14590251af32fe5302
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-08 02:35:10 +0000
Message: feat: integrar backend Express con frontend - Azure App Service B1


---

## 41571fc7a2a3499ec745f9b7602f47b384b38615
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-08 01:48:35 +0000
Message: fix: corregir errores TypeScript en frontend y backend


---

## 2eb89a5675391eff93a89e37a7d5442e4fa9ebbf
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-08 01:35:16 +0000
Message: Rediseño SaaS: Header + Sidebar + 5 secciones (Dashboard, Cards, Integraciones, Acciones, Resultados)


---

## aac05ed4bc790bfac1618e06d83dc5ad2ac1cea2
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-08 01:08:06 +0000
Message: Agregar icono de prohibido al titulo del Developer Console


---

## 04ddcd97f69faa29b7327f29b8fbc167a5d05b03
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-08 01:01:46 +0000
Message: Agregar .gitignore y remover node_modules/dist del tracking


---

## 165666e78d2700445c9b147f9e1d6d8182353c2b
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-04-08 00:57:37 +0000
Message: Creacion del front


---

## 346c1598847d383b05d632886d36a46c939aa907
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-27 21:07:54 +0000
Message: refactor: renombrada carpeta templates a frontend y actualizado README


---

## fecb62af4af7f3838705ef422a23f60bf0fe8808
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-27 20:59:52 +0000
Message: test: pruebas automáticas backend y frontend, ajustes arquitectura, compatibilidad y documentación


---

## dcf494942943c0f43318593e22dc71baec08593a
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-27 20:13:57 +0000
Message: feat: primer módulo backend GoToGym Developers (API, mock, estructura escalable)


---

## efa3e20d33ac84d9b7e42d46190376d6596cdf75
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-27 17:20:10 +0000
Message: 2026-03-27 16:50 - Rediseño SaaS moderno y responsive para GoToGymDeveloperConsole (frontend)


---

## 86936ac63cd2020ef12c80b081d41a8cf277fc11
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-27 17:00:54 +0000
Message: 2026-03-27 16:45 - Agregado global.d.ts para soporte de imports de CSS en TypeScript


---

## a9af5179eb13fc21ff0a76a98ef35e2a8c29d31b
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-27 16:55:37 +0000
Message: 2026-03-27 16:40 - Agregados README.md descriptivos en subcarpetas para evitar errores de estructura y mejorar claridad del frontend


---

## 0bfc09302425bef6e669e75061e6599aa7770ce3
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-27 16:52:29 +0000
Message: 2026-03-27 16:35 - Inicialización de Node, instalación de dependencias, tsconfig y archivos mínimos para frontend React+TS


---

## 3ed3c2ad61669b84bb2843b6374394a33e15e4aa
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-27 16:47:05 +0000
Message: 2026-03-27 16:30 - Corrección de tipado explícito en funciones del componente principal frontend GoToGym Developer Console (React+TS)


---

## 49678c13a0600d5754f85d8f5af4b9ceb4c0d36a
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-27 16:44:00 +0000
Message: 2026-03-27 16:25 - Estructura y código base del componente principal frontend GoToGym Developer Console (React+TS)


---

## 058a0b4e651a6a5cc1ce4d56751d0cb43b447982
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-27 16:20:18 +0000
Message: Estructura base del repositorio y README inicial


---

## f4061db66384f58bd1311df218fe9d1177f5566c
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-27 16:13:58 +0000
Message: Limpieza total del proyecto: eliminado todo el contenido para reinicio.


---

## 4beef5a0da577e8b061bc97d607134f4f77d96f8
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-25 01:59:30 +0000
Message: 2026-03-25 feat: integración validación frontend con backend y soporte de entorno


---

## 61a0a45c3dcd102cc429fca9a5785535399775ee
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-25 01:47:48 +0000
Message: 2026-03-25  Refactor: modularización, config, middlewares, CI base


---

## 4073ecbd05cf07db5cc2d857cba66d6cb3e2d5d7
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-25 01:40:31 +0000
Message: 2026-03-25  Docs: OpenAPI endpoint validación usuario


---

## 34057fcb16c5baa2fa0099990e9e4b45bcb8c07e
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-25 01:39:14 +0000
Message: 2026-03-25  Test: unitarios Jest para validación usuario (80%+)


---

## 139e90b7305362d9cb6a49c061c4abc1689c938b
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-25 01:37:48 +0000
Message: 2026-03-25  Fix: DTOs JS puro con JSDoc


---

## c295738d98802bdf7d455b7b5a6e6675558ef176
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-25 01:34:14 +0000
Message: 2026-03-25  Validación usuario: endpoint REST, capas y ejemplo


---

## f5c8b5e72d0440874d604ecfb4c331d1f8559cd7
Author: carlos <carlosmario@margaritagoenagaalgmail.onmicrosoft.com>
Date: 2026-03-25 01:26:22 +0000
Message: Estructura inicial del proyecto GoToGym Developers


---
