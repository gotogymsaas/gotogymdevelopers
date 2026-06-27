# Guia funcional del endpoint `/api/coach_context/`

Este documento explica, en lenguaje funcional, que informacion envia AppGotoGym cuando se consulta el endpoint `/api/coach_context/`.

La idea es que una persona que no conoce el codigo pueda responder estas preguntas:

- Que datos recibe otra app o pantalla desde AppGotoGym.
- Para que sirve cada bloque de informacion.
- Que campos son datos personales, datos de bienestar, documentos, dispositivos o informacion empresarial.
- Cuales datos se recomiendan para pintar las cards de APP GOTO GYM.

## Resumen ejecutivo

`GET /api/coach_context/` entrega una foto consolidada del usuario autenticado. Esa foto combina perfil, documentos, dispositivos conectados, respuestas de bienestar, contexto empresarial y un bloque especial llamado `wellbeing_experience_value_v1`.

En terminos simples, el endpoint envia:

| Bloque | Que contiene | Para que sirve |
| --- | --- | --- |
| `profile` | Datos generales del usuario y su perfil de bienestar. | Identificar al usuario y conocer su contexto basico: plan, edad, peso, objetivos, nivel de actividad, preferencias y estado del coach. |
| `documents` | Documentos cargados por el usuario. | Saber si existen planes o historias relacionadas con nutricion, entrenamiento o salud. |
| `devices` | Dispositivos o proveedores fitness conectados. | Saber si el usuario tiene fuentes como Google Fit, Fitbit, Garmin o Whoop, y cual fue la ultima sincronizacion. |
| `if_snapshot` | Respuestas y puntajes IF de bienestar. | Ver como esta el usuario en variables como sueno, enfoque, estres, actividad, proposito y vida social. |
| `business` | Relacion del usuario con empresas u organizaciones. | Saber si el usuario pertenece a un workspace empresarial y que permisos tiene. |
| `wellbeing_experience_value_v1` | Resumen funcional de bienestar listo para consumir. | Pintar cards, mostrar score global, detectar fortalezas y prioridades de mejora. |

## Forma general de la respuesta

El endpoint responde un objeto parecido a este:

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

No todos los usuarios tienen todos los datos. Por ejemplo, un usuario nuevo puede no tener documentos, dispositivos conectados o respuestas recientes.

## Datos personales y de perfil: `profile`

Este bloque describe quien es el usuario y cual es su contexto basico dentro de AppGotoGym.

| Dato enviado | Que significa funcionalmente |
| --- | --- |
| `username` | Identificador del usuario dentro de AppGotoGym. |
| `full_name` | Nombre completo registrado. Es dato personal. |
| `email` | Correo del usuario. Es dato personal. |
| `plan` | Plan del usuario, por ejemplo Gratis o Premium. |
| `account_type` | Tipo de cuenta: usuario individual, empresa, interno o mixto. |
| `timezone` | Zona horaria configurada por el usuario. |
| `sex` | Sexo registrado en el perfil, si existe. |
| `age`, `weight`, `height` | Edad, peso y estatura registrados. Son datos sensibles de salud/bienestar. |
| `age_range`, `weight_range`, `height_range` | Versiones agrupadas de edad, peso y estatura. Sirven cuando no se quiere mostrar el valor exacto. |
| `profession` | Profesion u ocupacion. |
| `favorite_exercise_time` | Momento preferido para entrenar. |
| `favorite_sport` | Deporte favorito. |
| `goal_type` | Objetivo principal: deficit, mantenimiento o ganancia. |
| `activity_level` | Nivel de actividad declarado: bajo, moderado o alto. |
| `daily_target_kcal_override` | Meta diaria de calorias configurada manualmente, si existe. |
| `happiness_index` | Indicador global actual de bienestar/felicidad. Normalmente se interpreta de 0 a 1. |
| `scores` | Puntajes actuales de las variables IF del usuario. |
| `current_streak` | Racha actual del usuario. |
| `badges` | Insignias o logros obtenidos. |
| `coach_state` | Memoria reciente del coach sobre experiencias o resultados del usuario. |
| `coach_weekly_state` | Memoria semanal del coach. |
| `active_breaks_memory` | Memoria especifica de pausas activas, si existe. |

Lectura funcional:

- Este bloque sirve para entender el contexto general del usuario.
- Puede contener datos personales y datos sensibles.
- No es el bloque recomendado para compartir externamente si solo se necesitan cards de bienestar.

## Documentos del usuario: `documents`

Este bloque informa si el usuario tiene documentos cargados en AppGotoGym.

| Dato enviado | Que significa funcionalmente |
| --- | --- |
| `summary` | Lista de documentos disponibles, tomando el mas reciente por tipo. |
| `summary[].doc_type` | Tipo de documento, por ejemplo plan de nutricion, plan de entrenamiento o historia clinica. |
| `summary[].file_name` | Nombre del archivo cargado. |
| `summary[].updated_at` | Fecha de ultima actualizacion. |
| `summary[].extracted_text` | Texto extraido del documento. Solo debe usarse si realmente se necesita. |
| `types` | Tipos de documentos encontrados. |
| `count` | Cantidad de tipos de documento disponibles. |

Lectura funcional:

- Permite saber que documentos tiene el usuario.
- Si `include_text=true`, el endpoint puede incluir texto extraido de documentos.
- Ese texto puede contener informacion sensible. Se debe mostrar o compartir solo cuando sea necesario.

## Dispositivos y fuentes fitness: `devices`

Este bloque describe las conexiones del usuario con proveedores de datos fitness o smartwatch.

| Dato enviado | Que significa funcionalmente |
| --- | --- |
| `connected_providers` | Lista de proveedores conectados, como `google_fit`, `fitbit`, `garmin` o `whoop`. |
| `devices[]` | Lista de conexiones configuradas por el usuario. |
| `devices[].provider` | Nombre del proveedor. |
| `devices[].status` | Estado de conexion: conectado, desconectado, pendiente o error. |
| `devices[].last_sync_at` | Ultima sincronizacion exitosa. |
| `devices[].updated_at` | Ultima actualizacion de esa conexion. |
| `fitness` | Ultima informacion fitness sincronizada por proveedor. |
| `fitness[provider].metrics` | Metricas normalizadas recibidas desde ese proveedor. |
| `fitness[provider].start_time` / `end_time` | Periodo que cubren las metricas. |
| `fitness[provider].created_at` | Momento en que AppGotoGym guardo esa sincronizacion. |

Lectura funcional:

- Sirve para saber si el usuario tiene datos externos de actividad, sueno, recuperacion u otras metricas.
- Si no hay dispositivos conectados, este bloque puede venir vacio.
- Al consultar el endpoint, AppGotoGym puede intentar refrescar la sincronizacion si una conexion lleva varias horas sin actualizarse.

## Foto de bienestar IF: `if_snapshot`

Este bloque muestra una foto de las respuestas de bienestar del usuario.

| Dato enviado | Que significa funcionalmente |
| --- | --- |
| `week_id` | Semana a la que pertenecen las respuestas. |
| `scores` | Puntajes actuales por variable IF. |
| `qualitative_interpretation` | Resumen estructurado de las variables IF. |
| `latest_record.value` | Ultimo valor historico de bienestar/felicidad. |
| `latest_record.scores` | Puntajes guardados en ese ultimo registro historico. |
| `latest_record.date` | Fecha del ultimo registro historico. |
| `answers[]` | Respuestas detalladas de la semana actual. |
| `answers[].question_id` | Identificador de la variable respondida. |
| `answers[].question_label` | Nombre legible de la pregunta. |
| `answers[].value` | Valor respondido por el usuario. |
| `answers[].slot` | Momento del dia: manana, tarde o noche. |
| `answers[].answered_at` | Fecha y hora en que se respondio o actualizo. |
| `answers[].answered_date` | Dia al que pertenece la respuesta. |
| `answers[].source` | Origen de la respuesta, normalmente la app. |

Lectura funcional:

- Sirve para ver respuestas con mas detalle, incluyendo fechas.
- Es util cuando se necesita saber cuando respondio el usuario una variable.
- Para pintar cards simples, suele ser mejor usar `wellbeing_experience_value_v1.if_variable_payload.responses`.

## Contexto empresarial: `business`

Este bloque indica si el usuario pertenece a una empresa u organizacion dentro de AppGotoGym.

| Dato enviado | Que significa funcionalmente |
| --- | --- |
| `has_business_workspace` | Indica si el usuario tiene al menos un workspace empresarial activo. |
| `active_workspace` | Workspace principal del usuario. |
| `workspaces[]` | Lista de empresas u organizaciones donde participa. |
| `workspaces[].organization_id` | Identificador de la organizacion. |
| `workspaces[].organization_name` | Nombre de la empresa u organizacion. |
| `workspaces[].organization_slug` | Identificador legible de la organizacion. |
| `workspaces[].organization_status` | Estado de la organizacion. |
| `workspaces[].organization_plan` | Plan empresarial contratado. |
| `workspaces[].role` | Rol del usuario dentro de la organizacion. |
| `workspaces[].permission_scope` | Alcance de permisos. |
| `workspaces[].module_access` | Modulos habilitados para el usuario. |

Lectura funcional:

- Permite adaptar la experiencia si el usuario viene de una empresa.
- Tambien sirve para controlar permisos y modulos visibles.

## Bloque recomendado para APP GOTO GYM cards: `wellbeing_experience_value_v1`

Este es el bloque mas importante si el objetivo es mostrar datos de bienestar en una interfaz simple.

Tiene una estructura parecida a esta:

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

Indica la version del formato de datos. Actualmente es:

```json
"wellbeing_experience_value_v1"
```

Lectura funcional:

- Sirve para saber que version del contrato se esta usando.
- Si en el futuro cambia el formato, esta version deberia cambiar.

### `generated_at`

Fecha y hora en que AppGotoGym genero la respuesta del endpoint.

Importante:

- No siempre es la fecha en que el usuario respondio.
- Es la fecha en que se consulto o construyo el payload.

### `global_wellbeing`

Resume el bienestar global del usuario.

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

| Dato enviado | Que significa funcionalmente |
| --- | --- |
| `happiness_index` | Bienestar actual del usuario. Si viene `0.66`, puede leerse como 66%. |
| `avg_7d` | Promedio de bienestar de los ultimos 7 dias. |
| `avg_prev_7d` | Promedio de la semana anterior. Puede venir vacio si no hay datos suficientes. |
| `delta_7d` | Diferencia entre esta semana y la anterior. Positivo indica mejora; negativo indica caida. |
| `records_14d` | Cantidad de registros usados en los ultimos 14 dias. |

Lectura funcional:

- Sirve para mostrar una tarjeta de estado general.
- Si faltan promedios, no significa error; puede significar que el usuario aun no tiene historial suficiente.

### `if_variable_payload`

Este bloque convierte las respuestas IF en datos faciles de consumir por cards.

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

| Dato enviado | Que significa funcionalmente |
| --- | --- |
| `answered_questions` | Cuantas variables IF tienen respuesta valida. |
| `responses[]` | Lista de variables con su puntaje. |
| `responses[].question_id` | Identificador de la variable. |
| `responses[].score` | Puntaje del usuario, normalmente de 1 a 10. |
| `summary.top_scores` | Variables mejor calificadas del usuario. Son fortalezas. |
| `summary.low_scores` | Variables con menor puntaje. Son prioridades de mejora. |

Como mostrar una card:

```json
{
  "question_id": "s_focus",
  "score": 5
}
```

Se puede mostrar como:

- Variable: Capacidad de enfoque
- Puntaje: 5/10
- Lectura: nivel medio, con margen de mejora.

### Diccionario de variables IF

| `question_id` | Nombre funcional | Que representa |
| --- | --- | --- |
| `s_steps` | Actividad fisica / pasos | Movimiento diario. |
| `s_sleep` | Horas de sueno | Duracion del descanso. |
| `s_stress_inv` | Manejo del estres | Capacidad de regular el estres. Mientras mas alto, mejor manejo. |
| `s_intensity` | Intensidad de entrenamiento | Nivel de exigencia fisica percibida. |
| `s_emotional` | Estabilidad emocional | Balance emocional percibido. |
| `s_social` | Vida social y conexiones | Calidad de las conexiones sociales. |
| `s_hrv` | Recuperacion / variabilidad cardiaca | Sensacion de recuperacion fisica. |
| `s_bio_age` | Vitalidad percibida | Energia o edad biologica percibida. |
| `s_sleep_quality` | Calidad del sueno | Que tan reparador fue el descanso. |
| `s_circadian` | Rutina circadiana | Regularidad de horarios y ritmo diario. |
| `s_focus` | Capacidad de enfoque | Concentracion y atencion sostenida. |
| `s_mood_sust` | Estado de animo sostenido | Estabilidad del animo en el tiempo. |
| `s_flow` | Estado de flow | Frecuencia de momentos de concentracion profunda. |
| `s_purpose` | Sentido de proposito | Claridad de sentido, motivacion o direccion personal. |
| `s_hobbies` | Tiempo para hobbies | Tiempo dedicado a ocio saludable o restaurativo. |
| `s_prosocial` | Ayuda a otros | Conductas prosociales o de apoyo. |

### Interpretacion simple de puntajes IF

| Puntaje | Lectura funcional |
| --- | --- |
| Sin dato | No hay informacion suficiente. |
| 1 a 3 | Bajo. Prioridad alta de mejora. |
| 4 a 6 | Medio. Hay margen claro de mejora. |
| 7 a 10 | Favorable. Conviene mantener consistencia. |

Importante:

- `low_scores` no significa necesariamente que el usuario este mal.
- Significa que esas variables son las mas bajas frente a sus demas respuestas.
- Un score `5` puede aparecer en `low_scores` si las otras variables estan mas altas.

### `experience_value_pack`

Este bloque resume resultados ya calculados por experiencias del coach.

Cada item puede verse asi:

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

| Dato enviado | Que significa funcionalmente |
| --- | --- |
| `experience_id` | Identificador de la experiencia o analisis. |
| `label` | Nombre legible de la experiencia. |
| `decision` | Resultado del motor, por ejemplo `accepted`. |
| `decision_reason` | Motivo del resultado. |
| `confidence` | Nivel de confianza del resultado. |
| `value_metrics` | Metricas resumidas de esa experiencia. |
| `updated_at` | Fecha de actualizacion del resultado. |

Experiencias que puede enviar:

| Experiencia | Que resume |
| --- | --- |
| `exp-002_goal_coherence` | Coherencia de comida con el objetivo del usuario. |
| `exp-003_metabolic_profile` | Perfil metabolico semanal. |
| `exp-007_lifestyle_intelligence` | Inteligencia de estilo de vida. |
| `exp-008_motivation` | Dinamica motivacional. |
| `exp-009_progression` | Progresion de entrenamiento o habitos. |
| `exp-005_body_trend` | Proyeccion de tendencia corporal. |

### `portfolio_summary`

Resume cuantas experiencias tienen datos y que tan confiables son.

| Dato enviado | Que significa funcionalmente |
| --- | --- |
| `experiences_tracked` | Cantidad de experiencias con informacion disponible. |
| `accepted_experiences` | Cantidad de experiencias aceptadas/listas por el motor. |
| `average_confidence` | Confianza promedio de las experiencias disponibles. |
| `analysis_summary` | Texto resumido del estado de bienestar y experiencias. |

Lectura funcional:

- Sirve para mostrar un resumen general de todo el paquete de experiencias.
- Si no hay suficientes datos, puede venir vacio o con un mensaje resiliente.

### `guardrails`

Declara reglas sobre privacidad y alcance de datos dentro del bloque `wellbeing_experience_value_v1`.

| Dato enviado | Que significa funcionalmente |
| --- | --- |
| `share_only_variable_data` | Indica que este contrato busca compartir datos variables del usuario, no catalogos completos. |
| `static_catalog_excluded` | Indica que no se incluye todo el catalogo estatico de preguntas. |
| `contains_personal_identifiers` | Indica si este bloque contiene identificadores personales. En este contrato deberia venir `false`. |
| `excluded_categories` | Categorias que no deberian incluirse dentro de este contrato, como email, nombre, telefono, texto de documentos o conversaciones crudas. |

Importante:

- `wellbeing_experience_value_v1` esta pensado para ser mas seguro y funcional.
- El payload completo de `/api/coach_context/` si puede incluir datos personales en `profile`.

## Que debe usar APP GOTO GYM para pintar cards

Fuente recomendada:

```text
wellbeing_experience_value_v1.if_variable_payload.responses
```

Pasos funcionales:

1. Leer la lista `responses`.
2. Tomar cada `question_id`.
3. Buscar su nombre en el diccionario de variables IF.
4. Mostrar el `score` como `x/10`.
5. Usar `summary.top_scores` para destacar fortalezas.
6. Usar `summary.low_scores` para destacar prioridades de mejora.
7. Usar `generated_at` como fecha de generacion del endpoint.
8. Si se necesita la fecha exacta de respuesta, buscarla en `if_snapshot.answers[]`.

Ejemplo de transformacion:

```json
{ "question_id": "s_sleep_quality", "score": 8 }
```

Puede convertirse en:

```text
Calidad del sueno
8/10
Lectura: favorable; mantener consistencia.
```

## Datos que requieren cuidado

| Tipo de dato | Donde aparece | Cuidado recomendado |
| --- | --- | --- |
| Nombre y correo | `profile.full_name`, `profile.email` | No mostrar ni compartir si solo se necesitan indicadores de bienestar. |
| Datos corporales | `profile.age`, `profile.weight`, `profile.height` | Tratar como datos sensibles. Preferir rangos si aplica. |
| Documentos | `documents.summary` | Evitar exponer texto extraido salvo necesidad clara. |
| Dispositivos fitness | `devices`, `fitness` | Pueden revelar habitos, actividad, descanso o recuperacion. |
| Respuestas IF | `if_snapshot`, `if_variable_payload` | Son datos de bienestar; mostrar con contexto y sin juicios absolutos. |
| Empresa/organizacion | `business` | Usar solo para permisos, segmentacion o experiencia B2B. |

## Casos donde pueden faltar datos

El endpoint puede responder con bloques vacios cuando:

- El usuario es nuevo.
- El usuario no ha respondido preguntas IF.
- No hay documentos cargados.
- No hay smartwatch o proveedor conectado.
- No hay historial suficiente para calcular promedios.
- Ocurrio un error interno y AppGotoGym respondio en modo resiliente.

La interfaz debe tolerar:

```text
null
{}
[]
```

## Modo resiliente

Si algo falla internamente, AppGotoGym intenta responder de todas formas con un payload reducido.

En ese caso puede pasar que:

- `documents.summary` venga vacio.
- `devices.connected_providers` venga vacio.
- `if_snapshot.answers` venga vacio.
- `wellbeing_experience_value_v1` siga existiendo.
- `portfolio_summary.analysis_summary` indique que el contexto esta disponible en modo resiliente.

Lectura funcional:

- No se debe tratar como error visual inmediato.
- Se puede mostrar un estado como "Datos parcialmente disponibles".

## Glosario rapido

| Termino | Significado |
| --- | --- |
| Endpoint | Direccion que entrega datos desde AppGotoGym. |
| Payload | Paquete de datos que responde el endpoint. |
| IF | Conjunto de variables de bienestar usadas por AppGotoGym. |
| Score | Puntaje de una variable, normalmente de 1 a 10. |
| Snapshot | Foto del estado en un momento especifico. |
| Provider | Fuente externa de datos, como Google Fit, Fitbit, Garmin o Whoop. |
| Workspace | Espacio empresarial al que pertenece el usuario. |
| Guardrails | Reglas de proteccion sobre que datos se comparten. |


