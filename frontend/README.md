# GoToGym Developers Frontend

Este frontend está construido con React y TypeScript, preparado para integrarse con el backend de GoToGym Developers y consumir APIs de integraciones de salud/fitness.

## Scripts principales

- `npm install` — Instala dependencias
- `npm run dev` — Arranca el frontend en modo desarrollo (si tienes configurado Vite, Next.js, etc.)
- `npm run build` — Compila el frontend para producción
- `npm test` — Ejecuta pruebas automáticas con Jest y React Testing Library

## Pruebas automáticas

- Las pruebas están en `src/__tests__/`
- Usa React Testing Library y Jest
- Ejemplo de test básico incluido para el componente `App`

### Ejecutar pruebas

1. Instala dependencias:
   ```
   npm install
   ```
2. Ejecuta los tests:
   ```
   npm test
   ```

## Estructura recomendada

```
src/
  App.tsx           # Componente principal
  __tests__/
    App.test.tsx    # Pruebas automáticas
```

## Buenas prácticas
- Mantén los tests junto a los componentes o en `__tests__`.
- Usa tipado estricto de TypeScript.
- Integra el frontend con el backend usando fetch/axios y maneja errores de red.
- Usa componentes reutilizables y desacoplados.

---

GoToGym Developers — Plataforma API-first para salud y fitness 🚀
