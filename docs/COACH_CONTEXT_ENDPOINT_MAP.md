# Mapa tecnico del endpoint `/api/coach_context/`

Este documento explica que retorna el endpoint de bienestar usado por `gotogymdevelopers`, de donde sale cada dato en el backend de `appdesplegada` y como interpretar los campos que vienen en ingles.

Fuente revisada:

- `backend/api/urls.py`: registra `coach_context/`.
- `backend/api/views.py`: vista `coach_context` y builders del contrato `wellbeing_experience_value_v1`.
- `backend/api/if_questions.py`: catalogo de preguntas IF.
- `backend/api/models.py`: modelos `User`, `HappinessRecord`, `IFQuestion`, `IFAnswer`, `UserDocument`, `OrganizationMembership`.
- `backend/devices/models.py`: modelos `DeviceConnection` y `FitnessSync`.

## Resumen rapido

`GET /api/coach_context/` entrega un contexto del usuario autenticado para que otra app pueda consumir datos de bienestar sin pedirlos campo por campo.

El payload principal tiene esta forma:

```json
{
  "profile": {},
  "documents": {},
  "devices": {},
  "if_snapshot": {},
  "business": {},
  "wellbeing_experience_value_v1": {}
}
```

La seccion mas importante para las cards de APP GOTO GYM es:

```json
{
  "wellbeing_experience_value_v1": {
    "if_variable_payload": {
      "answered_questions": 16,
      "responses": [
        { "question_id": "s_steps", "score": 1 }
      ],
      "summary": {
        "top_scores": [],
        "low_scores": []
      }
    }
  }
}
```

## Seguridad y comportamiento

| Campo / regla | Descripcion |
| --- | --- |
| Ruta | `/api/coach_context/` |
| Metodo | `GET`, `OPTIONS` |
| Autenticacion | JWT obligatoria |
| Permiso | Usuario autenticado |
| `username` | Opcional. Si se envia, debe coincidir con el `username` autenticado. |
| `include_text` | Opcional booleano. Si es verdadero, incluye `extracted_text` de documentos. |
| Mismatch de usuario | Retorna `403 Forbidden`. |
| Error interno | Retorna `200 OK` con fallback resiliente. El contrato `wellbeing_experience_value_v1` sigue existiendo, pero con datos reducidos. |

## Origen de cada bloque

### `profile`

Sale principalmente del modelo `User`.

| Campo | Origen backend | Significado |
| --- | --- | --- |
| `username` | `user.username` | Usuario autenticado. |
| `plan` | `user.plan` | Plan del usuario, por ejemplo `Gratis` o `Premium`. |
| `account_type` | `user.account_type` | Tipo de cuenta: `consumer`, `business`, `internal`, `hybrid`. |
| `full_name` | `user.full_name` | Nombre completo guardado en perfil. |
| `email` | `user.email` | Email del usuario. |
| `timezone` | `user.timezone` | Zona horaria configurada. |
| `sex` | `user.sex` | Sexo registrado. |
| `age`, `weight`, `height` | `user.age`, `user.weight`, `user.height` | Datos corporales del perfil. |
| `profession` | `user.profession` | Profesion. |
| `favorite_exercise_time` | `user.favorite_exercise_time` | Hora preferida para entrenar. |
| `favorite_sport` | `user.favorite_sport` | Deporte favorito. |
| `goal_type` | `user.goal_type` | Objetivo nutricional: `deficit`, `maintenance`, `gain`. |
| `activity_level` | `user.activity_level` | Nivel de actividad: `low`, `moderate`, `high`. |
| `daily_target_kcal_override` | `user.daily_target_kcal_override` | Meta diaria de calorias definida manualmente. |
| `age_range`, `weight_range`, `height_range` | Calculados con `_range_bucket(...)` | Rangos anonimizados/agrupados del perfil. |
| `happiness_index` | `user.happiness_index` | Ultimo indice global de bienestar/felicidad guardado en el usuario. |
| `scores` | `user.scores` | Diccionario actual de scores IF por `question_id`. |
| `current_streak` | `user.current_streak` | Racha actual del usuario. |
| `badges` | `user.badges` | Insignias ganadas. |
| `coach_state` | `user.coach_state` | Estado JSON de experiencias del coach de corto plazo. |
| `coach_state_updated_at` | `user.coach_state_updated_at` | Ultima actualizacion de `coach_state`. |
| `coach_weekly_state` | `user.coach_weekly_state` | Estado JSON semanal del coach. |
| `coach_weekly_updated_at` | `user.coach_weekly_updated_at` | Ultima actualizacion del estado semanal. |
| `active_breaks_memory` | `user.coach_state.active_breaks_memory_v1` | Memoria especifica para pausas activas si existe. |

### `documents`

Sale del modelo `UserDocument`.

El endpoint busca documentos del usuario, ordena por `updated_at` descendente y toma el mas reciente por cada tipo (`doc_type`).

| Campo | Origen backend | Significado |
| --- | --- | --- |
| `summary` | Lista construida desde `UserDocument` | Documentos mas recientes por tipo. |
| `summary[].doc_type` | `doc.doc_type` | Tipo de documento: `nutrition_plan`, `training_plan`, `medical_history`. |
| `summary[].file_name` | `doc.file_name` | Nombre del archivo. |
| `summary[].updated_at` | `doc.updated_at` | Fecha de actualizacion. |
| `summary[].extracted_text` | `doc.extracted_text` | Texto extraido. Solo aparece si `include_text=true`. |
| `types` | Llaves de documentos encontrados | Tipos de documento disponibles. |
| `count` | Largo de `summary` | Cantidad de tipos de documento retornados. |

### `devices`

Sale de `devices.models.DeviceConnection` y `devices.models.FitnessSync`.

| Campo | Origen backend | Significado |
| --- | --- | --- |
| `connected_providers` | `DeviceConnection` con `status == "connected"` | Proveedores conectados, por ejemplo `google_fit`, `fitbit`, `garmin`, `whoop`. |
| `devices[]` | `DeviceConnection.objects.filter(user=user)` | Estado de conexiones del usuario. |
| `devices[].provider` | `d.provider` | Proveedor del dispositivo. |
| `devices[].status` | `d.status` | Estado: `connected`, `disconnected`, `pending`, `error`. |
| `devices[].last_sync_at` | `d.last_sync_at` | Ultima sincronizacion real. |
| `devices[].updated_at` | `d.updated_at` | Ultima actualizacion de la conexion. |
| `fitness` | Ultimos `FitnessSync` agrupados por proveedor | Ultima data fitness sincronizada por proveedor. |
| `fitness[provider].metrics` | `sync.metrics` | Metricas normalizadas del proveedor. |
| `fitness[provider].start_time` / `end_time` | `sync.start_time` / `sync.end_time` | Ventana de datos sincronizada. |
| `fitness[provider].created_at` | `sync.created_at` | Momento en que se guardo la sincronizacion. |

Nota: al abrir `coach_context`, el backend intenta encolar o ejecutar una sincronizacion invisible si el proveedor conectado lleva 3 horas o mas sin sincronizar.

### `if_snapshot`

Es una foto de las respuestas IF del usuario para la semana actual y del ultimo registro historico.

| Campo | Origen backend | Significado |
| --- | --- | --- |
| `week_id` | `_week_id()` | Semana ISO actual, formato `YYYY-W##`. |
| `scores` | `user.scores` | Diccionario vigente de scores por pregunta IF. |
| `qualitative_interpretation` | `_build_if_variable_sharing_payload(user.scores)` | Resumen variable basado en `user.scores`. Aunque el nombre dice "qualitative", actualmente retorna estructura variable con scores, no narrativa larga. |
| `latest_record.value` | `HappinessRecord.value` mas reciente | Ultimo valor historico de bienestar/felicidad. |
| `latest_record.scores` | `HappinessRecord.scores` mas reciente | Scores IF guardados en ese registro historico. |
| `latest_record.date` | `HappinessRecord.date` | Fecha del registro historico. |
| `answers[]` | `IFAnswer` de la semana actual | Respuestas capturadas por pregunta, dia y slot. |
| `answers[].question_id` | `IFAnswer.question.key` | ID tecnico de la pregunta. |
| `answers[].question_label` | `IFAnswer.question.label` | Label humano de la pregunta. |
| `answers[].value` | `IFAnswer.value` | Valor respondido por el usuario. |
| `answers[].slot` | `IFAnswer.slot` | Franja: `morning`, `afternoon`, `night`. |
| `answers[].answered_at` | `IFAnswer.answered_at` | Ultima actualizacion de esa respuesta. |
| `answers[].answered_date` | `IFAnswer.answered_date` | Dia al que pertenece la respuesta. |
| `answers[].source` | `IFAnswer.source` | Origen, normalmente `app`. |

### `business`

Sale del modelo `OrganizationMembership` y su relacion con `Organization`.

| Campo | Origen backend | Significado |
| --- | --- | --- |
| `workspaces` | Membresias activas del usuario | Empresas/organizaciones donde participa el usuario. |
| `has_business_workspace` | `bool(workspaces)` | Indica si tiene workspace empresarial activo. |
| `active_workspace` | Primer workspace ordenado por default/nombre | Workspace principal. |
| `workspaces[].organization_id` | `m.organization_id` | ID de la organizacion. |
| `workspaces[].organization_name` | `m.organization.name` | Nombre de la organizacion. |
| `workspaces[].organization_slug` | `m.organization.slug` | Slug. |
| `workspaces[].organization_status` | `m.organization.status` | Estado de organizacion: `active`, `trial`, etc. |
| `workspaces[].organization_plan` | `m.organization.plan` | Plan B2B. |
| `workspaces[].role` | `m.role` | Rol del usuario en la organizacion. |
| `workspaces[].permission_scope` | `m.permission_scope` | Alcance de permisos. |
| `workspaces[].module_access` | `m.module_access` | Modulos habilitados para ese usuario. |

## Contrato `wellbeing_experience_value_v1`

Este es el contrato de bienestar pensado para compartir datos variables del usuario con otras experiencias.

```json
{
  "contract": "wellbeing_experience_value_v1",
  "generated_at": "2026-05-27T22:30:17.646Z",
  "global_wellbeing": {},
  "if_variable_payload": {},
  "experience_value_pack": [],
  "portfolio_summary": {},
  "guardrails": {}
}
```

### `contract`

Valor fijo: `wellbeing_experience_value_v1`.

Sirve para versionar el contrato. Si en el futuro cambia la estructura, se deberia crear otra version.

### `generated_at`

Sale de `timezone.now().isoformat()` cuando se construye el payload.

Significa: momento en que el endpoint genero la respuesta, no necesariamente la fecha en que el usuario respondio el formulario.

### `global_wellbeing`

Se construye con `_build_wellbeing_global_payload(user, latest_record)`.

Ejemplo:

```json
{
  "happiness_index": 0.66,
  "avg_7d": 0.555,
  "avg_prev_7d": null,
  "delta_7d": null,
  "records_14d": 4
}
```

| Campo | Origen backend | Interpretacion |
| --- | --- | --- |
| `happiness_index` | `user.happiness_index`; fallback a `latest_record.value`; fallback al registro mas reciente de 14 dias | Indice global actual de bienestar/felicidad normalizado. Usualmente se expresa en escala `0.0` a `1.0`. |
| `avg_7d` | Promedio de `HappinessRecord.value` normalizados de los ultimos 7 dias | Promedio reciente de bienestar. |
| `avg_prev_7d` | Promedio de registros entre hace 8 y 14 dias | Promedio de la semana anterior. Puede ser `null` si no hay datos suficientes. |
| `delta_7d` | `avg_7d - avg_prev_7d` | Cambio entre la semana actual y la anterior. Positivo mejora, negativo empeora. `null` si falta una de las dos semanas. |
| `records_14d` | Conteo de `HappinessRecord` de los ultimos 14 dias | Cuantos registros historicos alimentan el calculo. |

Traduccion del ejemplo:

- `happiness_index: 0.66`: bienestar actual medio, cerca de 66%.
- `avg_7d: 0.555`: promedio de los ultimos 7 dias cerca de 55.5%.
- `avg_prev_7d: null`: no hay suficientes registros de la semana anterior.
- `delta_7d: null`: no se puede calcular cambio porque falta `avg_prev_7d`.
- `records_14d: 4`: se encontraron 4 registros en los ultimos 14 dias.

### `if_variable_payload`

Se construye con `_build_if_variable_sharing_payload(user.scores)`.

Este bloque toma el diccionario `user.scores` y lo convierte en una lista ordenada de preguntas IF, mas resumen de mejores y peores scores.

Ejemplo:

```json
{
  "answered_questions": 16,
  "responses": [
    { "question_id": "s_steps", "score": 1 },
    { "question_id": "s_focus", "score": 5 }
  ],
  "summary": {
    "top_scores": [
      { "question_id": "s_social", "score": 10 }
    ],
    "low_scores": [
      { "question_id": "s_steps", "score": 1 }
    ]
  }
}
```

| Campo | Origen backend | Interpretacion |
| --- | --- | --- |
| `answered_questions` | Cantidad de items con `score` numerico | Numero de preguntas IF que tienen respuesta valida. |
| `responses` | Lista construida desde el catalogo `IF_QUESTIONS` + `user.scores` | Cada pregunta IF con su score actual. |
| `responses[].question_id` | ID del catalogo IF | Llave tecnica de la variable. |
| `responses[].score` | `user.scores[question_id]` convertido a entero | Score de 1 a 10 si fue respondido; puede ser `null`. |
| `summary.top_scores` | Top 3 de `responses` ordenado por score descendente | Las tres variables mas fuertes. |
| `summary.low_scores` | Top 3 de `responses` ordenado por score ascendente | Las tres variables con menor valor, es decir prioridades de mejora. |

Ejemplo consultado:

```json
"low_scores": [
  { "question_id": "s_focus", "score": 5 }
]
```

Significa: `s_focus` pertenece a "Capacidad de enfoque". Si aparece en `low_scores`, el sistema detecto que esta entre las variables mas bajas del usuario. Un `score: 5` no necesariamente es critico; solo puede ser bajo relativo frente a las demas respuestas.

## Diccionario de `question_id`

Estos IDs vienen de `backend/api/if_questions.py`.

| `question_id` | Label en espanol | Que representa |
| --- | --- | --- |
| `s_steps` | Nivel de actividad fisica (Pasos) | Movimiento diario / pasos. |
| `s_sleep` | Horas de sueno promedio | Duracion del sueno. |
| `s_stress_inv` | Manejo del estres (10 = Excelente, 1 = Pesimo) | Regulacion del estres. Es inversa: mayor score significa mejor manejo. |
| `s_intensity` | Intensidad de entrenamientos | Carga o estimulo de entrenamiento percibido. |
| `s_emotional` | Estabilidad emocional | Estabilidad emocional percibida. |
| `s_social` | Vida social y conexiones | Calidad/cantidad de conexiones sociales. |
| `s_hrv` | Variabilidad cardiaca (Sensacion de recuperacion) | Recuperacion fisiologica percibida. |
| `s_bio_age` | Edad Biologica (Percepcion de vitalidad) | Vitalidad o energia percibida. |
| `s_sleep_quality` | Calidad del sueno | Calidad subjetiva del descanso. |
| `s_circadian` | Sincronizacion ritmo circadiano (Rutina) | Regularidad de horarios de dormir/despertar. |
| `s_focus` | Capacidad de enfoque | Capacidad para concentrarse y sostener atencion. |
| `s_mood_sust` | Estado de animo sostenido | Estabilidad del animo a lo largo del tiempo. |
| `s_flow` | Frecuencia de estado de Flow | Frecuencia de momentos de concentracion profunda/flujo. |
| `s_purpose` | Sentido de proposito | Claridad de proposito o sentido personal. |
| `s_hobbies` | Tiempo dedicado a hobbies | Tiempo de ocio restaurativo. |
| `s_prosocial` | Actitudes prosociales (Ayudar a otros) | Conductas de apoyo a otras personas. |

## Bandas internas para interpretar scores IF

La funcion `_if_band_for_score` clasifica asi:

| Score | Banda | Lectura |
| --- | --- | --- |
| Sin numero | `unknown` | No hay dato suficiente. |
| `1` a `3` | `low` | Bajo / prioridad alta de mejora. |
| `4` a `6` | `medium` | Medio / hay margen de mejora. |
| `7` a `10` | `high` | Favorable / mantener consistencia. |

Aunque `if_variable_payload` solo comparte `question_id` y `score`, el backend tambien tiene una funcion cualitativa interna (`_build_if_qualitative_interpretation`) que genera `band`, `insight`, `priority` y `recommended_action` para cada variable.

## `experience_value_pack`

Se construye con `_build_wellbeing_experience_value_pack(user)`.

Este bloque no viene directamente del formulario IF. Sale de resultados ya guardados en `user.coach_state` y `user.coach_weekly_state`.

Cada item tiene esta forma:

```json
{
  "experience_id": "exp-002_goal_coherence",
  "label": "Goal-Coherence Meal",
  "decision": "accepted",
  "decision_reason": "...",
  "confidence": 0.82,
  "value_metrics": {},
  "updated_at": "2026-05-27T..."
}
```

| Campo | Origen backend | Interpretacion |
| --- | --- | --- |
| `experience_id` | ID fijo definido por el builder | Experiencia/analisis que produjo el resultado. |
| `label` | Label fijo definido por el builder | Nombre legible de la experiencia. |
| `decision` | `result_payload.decision` | Decision del motor de experiencia, por ejemplo `accepted`. |
| `decision_reason` | `result_payload.decision_reason` | Razon de la decision si existe. |
| `confidence` | `result_payload.confidence` | Confianza del resultado, normalizada/redondeada. |
| `value_metrics` | Metricas extraidas por experiencia | Campos resumidos que cambian segun la experiencia. |
| `updated_at` | `state_value.updated_at`, `as_of` o `date` | Fecha de actualizacion del resultado. |

Experiencias que puede incluir:

| `experience_id` | Fuente | Que resume |
| --- | --- | --- |
| `exp-002_goal_coherence` | `user.coach_state.meal_coherence_last` | Coherencia de comida con objetivo. |
| `exp-003_metabolic_profile` | `user.coach_weekly_state.metabolic_last` | Perfil metabolico semanal. |
| `exp-007_lifestyle_intelligence` | `user.coach_state.lifestyle_last` | Inteligencia de estilo de vida. |
| `exp-008_motivation` | `user.coach_state.motivation_last` | Dinamica motivacional. |
| `exp-009_progression` | `user.coach_state.progression_last` | Progresion de entrenamiento/habitos. |
| `exp-005_body_trend` | `user.coach_weekly_state.body_trend_last` | Proyeccion de tendencia corporal. |

### `value_metrics` por experiencia

| Experiencia | Campos posibles |
| --- | --- |
| `exp-002_goal_coherence` | `coherence_score`, `classification` |
| `exp-003_metabolic_profile` | `kcal_day`, `weekly_adjustment_kcal_day` |
| `exp-007_lifestyle_intelligence` | `dhss_score`, `dhss_band`, `first_microhabit_id` |
| `exp-008_motivation` | `dominant_driver`, `mood`, `intervention_level` |
| `exp-009_progression` | `readiness_score`, `action`, `action_label` |
| `exp-005_body_trend` | `projected_weight_kg`, `horizon_weeks` |

## `portfolio_summary`

Se calcula sobre `experience_value_pack`.

| Campo | Origen backend | Interpretacion |
| --- | --- | --- |
| `experiences_tracked` | `len(experience_pack)` | Cantidad de experiencias con datos disponibles. |
| `accepted_experiences` | Conteo de items con `decision == "accepted"` | Experiencias listas/aceptadas por el motor. |
| `average_confidence` | Promedio de `confidence` de las experiencias | Confianza promedio de las experiencias disponibles. |
| `analysis_summary` | `_build_wellbeing_analysis_summary(...)` | Texto resumido generado desde `global_wellbeing`, `low_scores` y experiencias aceptadas. |

## `guardrails`

Reglas declaradas por el backend sobre que se comparte en el contrato.

| Campo | Significado |
| --- | --- |
| `share_only_variable_data` | El contrato intenta compartir solo datos variables del usuario. |
| `static_catalog_excluded` | El catalogo estatico completo no se incluye dentro del contrato variable. |
| `contains_personal_identifiers` | Indica si el contrato incluye identificadores personales. En este contrato viene `false`. |
| `excluded_categories` | Categorias excluidas: `email`, `full_name`, `phone`, `documents_text`, `raw_conversation_text`. |

Importante: aunque `guardrails.contains_personal_identifiers` es `false` para `wellbeing_experience_value_v1`, el payload completo de `/api/coach_context/` si incluye datos personales en `profile`, como `email` y `full_name`.

## Relacion entre campos parecidos

| Campo | Diferencia practica |
| --- | --- |
| `profile.scores` | Diccionario crudo actual guardado en `User.scores`. |
| `if_snapshot.scores` | El mismo diccionario crudo actual, expuesto dentro de la foto IF. |
| `if_snapshot.answers` | Respuestas semanales detalladas desde `IFAnswer`; incluye fecha, slot y source. |
| `if_snapshot.latest_record.scores` | Scores guardados dentro del ultimo `HappinessRecord`; puede representar una foto historica anterior. |
| `wellbeing_experience_value_v1.if_variable_payload.responses` | Lista normalizada para compartir: `question_id` + `score`. Esta es la fuente recomendada para cards IF. |
| `wellbeing_experience_value_v1.if_variable_payload.summary.low_scores` | Top 3 scores mas bajos de `responses`; util para priorizar oportunidades de mejora. |
| `wellbeing_experience_value_v1.global_wellbeing` | Indicadores agregados del historial de bienestar, no una pregunta individual. |

## Fuente recomendada para APP GOTO GYM cards

Para pintar cards por pregunta IF:

1. Usar primero `wellbeing_experience_value_v1.if_variable_payload.responses`.
2. Mapear cada `question_id` contra el diccionario de preguntas de este documento.
3. Mostrar `score` como escala `x/10`.
4. Usar `wellbeing_experience_value_v1.generated_at` como fecha de generacion del endpoint.
5. Si se necesita fecha real de respuesta por pregunta, usar `if_snapshot.answers[].answered_at` cuando exista la pregunta correspondiente.

Ejemplo:

```json
{
  "question_id": "s_focus",
  "score": 5
}
```

Se debe mostrar como:

- Variable: Capacidad de enfoque
- Score: `5/10`
- Lectura: nivel medio; hay margen claro de mejora.

## Modo fallback/resiliente

Si ocurre un error interno, el endpoint responde `200 OK` con un payload reducido.

En ese caso:

- `documents.summary` viene vacio.
- `devices.connected_providers` viene vacio.
- `if_snapshot.answers` viene vacio.
- `wellbeing_experience_value_v1` sigue existiendo.
- `portfolio_summary.analysis_summary` puede decir `Contexto de bienestar disponible en modo resiliente.`

Para frontend, esto significa que no se debe asumir que todos los arrays traen datos. Cada seccion debe tolerar `null`, `{}` o `[]`.
