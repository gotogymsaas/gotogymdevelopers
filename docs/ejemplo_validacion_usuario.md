# Ejemplo de request/response para validación de usuario

## Request
POST /api/user/validate

```
{
  "document": "12345678",
  "birthdate": "1990-01-01"
}
```

## Response (éxito)
```
{
  "valid": true,
  "userId": 1,
  "name": "Juan Pérez"
}
```

## Response (error)
```
{
  "error": "Usuario no encontrado o datos inválidos"
}
```
