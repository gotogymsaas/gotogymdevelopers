# Guia funcional del endpoint de Bienestar Corporativo

Este documento explica, en lenguaje funcional, que informacion entrega AppGotoGym para empresas desde el endpoint corporativo de bienestar.

## Endpoint fuente en AppGotoGym

`GET /api/business/wellbeing/corporate/`

## Endpoint consumidor en GoToGym Developers backend

`GET /api/v1/business/wellbeing/corporate`

El backend de Developers reenvia el JWT recibido en `Authorization: Bearer <token>` hacia AppGotoGym y conserva los parametros permitidos.

## Autenticacion y alcance

| Regla | Significado |
| --- | --- |
| JWT obligatorio | Solo usuarios autenticados pueden consultar el endpoint. |
| Membresia business valida | El usuario debe pertenecer a una organizacion business permitida por AppGotoGym. |
| Datos agregados | El contrato esta disenado para lectura empresarial, no para exponer metricas individuales. |
| Proteccion por cohorte | Si la muestra es menor al minimo permitido, el detalle sensible se oculta. |

## Query params

| Parametro | Tipo | Obligatorio | Regla | Significado |
| --- | --- | --- | --- | --- |
| `org` | string/number | No | Organizacion objetivo. | Permite solicitar una organizacion especifica cuando el usuario tiene acceso. |
| `days` | number | No | Default 30, minimo 7, maximo 180. | Ventana temporal usada para calcular actividad, adopcion, recurrencia y bienestar agregado. |

## Contrato raiz: `wellbeing_corporativo_business_v1`

| Campo | Significado | Tipo de dato | Privacidad |
| --- | --- | --- | --- |
| `success` | Indica si la consulta fue respondida correctamente por AppGotoGym. | boolean | Se comparte siempre. |
| `contract` | Nombre/version del contrato funcional. | string | Se comparte siempre. |
| `generated_at` | Fecha y hora en que se genero la fotografia corporativa. | string ISO | Se comparte siempre. |
| `workspace` | Identificacion funcional de la organizacion y permisos del miembro consultante. | object | No debe incluir datos personales de empleados. |
| `sharing_policy` | Reglas de privacidad aplicadas al payload. | object | Se comparte siempre para explicar limites de visibilidad. |
| `global_wellbeing` | Indicadores agregados de bienestar corporativo. | object | Agregado. |
| `if_variable_aggregate` | Resultados agregados de variables IF de bienestar. | object | Depende de cohorte minima. |
| `experience_intelligence` | Uso agregado de experiencias y servicios de bienestar. | object | Depende de cohorte minima para rankings sensibles. |
| `active_breaks_corporate` | Analitica corporativa de pausas activas y cumplimiento SG-SST. | object | Agregado con detalle legal operativo. |
| `risk_map` | Riesgos agregados: segmentos frios, brechas de planes y alertas. | object | Agregado. |
| `corporate_wellbeing_analysis` | Lectura ejecutiva del estado del programa y acciones recomendadas. | object | Agregado. |
| `insights` | Hallazgos priorizados para orientar decisiones de empresa. | array | Agregado. |
| `requested_window_days` | Ventana final usada por el calculo. | number | Se comparte siempre. |

## `workspace`

| Campo | Significado | Tipo | Se comparte |
| --- | --- | --- | --- |
| `organization_id` | Identificador interno de la organizacion. | number | Siempre. |
| `organization_name` | Nombre de la empresa o espacio corporativo. | string | Siempre. |
| `organization_slug` | Identificador legible de la organizacion. | string | Siempre. |
| `organization_plan` | Plan business contratado o configurado. | string | Siempre. |
| `membership_role` | Rol del usuario dentro de la organizacion. | string | Siempre. |
| `module_access` | Modulos business habilitados para ese miembro. | array | Siempre. |

## `sharing_policy`

| Campo | Significado | Tipo | Regla |
| --- | --- | --- | --- |
| `aggregate_only` | Confirma que el payload esta pensado para decisiones agregadas, no individuales. | boolean | Debe ser `true`. |
| `minimum_cohort_size` | Minimo de miembros activos requerido para abrir detalles por variable. | number | Se comparte siempre. |
| `member_sample_size` | Cantidad de miembros activos considerados. | number | Se comparte siempre. |
| `cohort_protected` | Indica si el detalle fue ocultado por muestra pequena. | boolean | Se comparte siempre. |
| `excluded_categories` | Categorias que no deben exponerse en el contrato corporativo. | array | Se comparte siempre. |

Categorias excluidas por diseno: `email`, `full_name`, `phone`, `documents_text`, `raw_conversation_text`, `user_level_metrics`.

## `global_wellbeing`

| Campo | Significado | Tipo | Uso recomendado |
| --- | --- | --- | --- |
| `wellbeing_index_0_100` | Indice general de bienestar corporativo en escala 0 a 100. | number | Widget ejecutivo principal. |
| `avg_score_0_10` | Promedio agregado de bienestar en escala 0 a 10. | number/null | Semaforo de salud organizacional. |
| `samples` | Numero de muestras usadas para calcular el promedio. | number | Confianza del indicador. |
| `window_days` | Ventana temporal del calculo. | number | Contexto del dato. |
| `activation_rate_pct` | Porcentaje de activacion del programa. | number | Seguimiento de adopcion. |
| `recurrent_rate_pct` | Porcentaje de recurrencia de uso semanal. | number | Medir continuidad del habito. |
| `scope` | Alcance o modo de calculo aplicado. | string | Explicar origen del dato. |

## `if_variable_aggregate`

| Campo | Significado | Tipo | Regla |
| --- | --- | --- | --- |
| `sample_size` | Miembros activos incluidos en el analisis IF. | number | Siempre. |
| `coverage_pct` | Porcentaje de respuestas disponibles frente al universo posible. | number | Siempre. |
| `cohort_protected` | Si es `true`, los detalles por dimension se ocultan. | boolean | Siempre. |
| `min_cohort_size` | Minimo requerido para mostrar detalle. | number | Siempre. |
| `dimensions` | Promedio, muestra y distribucion por pregunta IF. | array | Solo si la cohorte cumple el minimo. |
| `risk_dimensions` | Dimensiones IF con menor puntuacion promedio. | array | Solo si la cohorte cumple el minimo. |
| `strength_dimensions` | Dimensiones IF con mayor puntuacion promedio. | array | Solo si la cohorte cumple el minimo. |
| `message` | Explicacion cuando no hay datos suficientes o hay proteccion. | string | Siempre que aplique. |

### Campos dentro de `dimensions`

| Campo | Significado |
| --- | --- |
| `question_id` | Identificador interno de la variable IF. |
| `question_label` | Nombre funcional de la variable IF. |
| `avg_score_0_10` | Promedio de la variable en escala 0 a 10. |
| `sample_size` | Numero de respuestas validas para esa variable. |
| `low_share_pct` | Porcentaje de respuestas en zona baja. |
| `high_share_pct` | Porcentaje de respuestas en zona alta. |

## `experience_intelligence`

| Campo | Significado | Tipo |
| --- | --- | --- |
| `total_events` | Total de eventos o usos de experiencias de bienestar. | number |
| `active_users` | Usuarios activos en experiencias durante la ventana. | number |
| `avg_events_per_active` | Promedio de eventos por usuario activo. | number/null |
| `window_days` | Ventana temporal analizada. | number |
| `granularity` | Granularidad usada para agrupar la serie. | string |
| `top_experiences` | Experiencias mas usadas o relevantes. | array |

Si la cohorte esta protegida y la muestra activa no cumple el minimo, `top_experiences` puede venir vacio.

## `active_breaks_corporate`

Este bloque concentra pausas activas corporativas y cumplimiento operativo/legal.

| Campo | Significado |
| --- | --- |
| `coverage` | Cobertura de miembros, alcance legal y actividad reciente. |
| `legal_framework` | Reglas SG-SST aplicadas a pausas activas laborales. |
| `status_counts` | Conteo de miembros por estado de membresia. |
| `kpis` | Indicadores agregados de adherencia, asistencia, duracion y completitud. |
| `routines_distribution` | Distribucion agregada por rutina mas frecuente. |
| `event_taxonomy_aggregate` | Conteos por estado, fuente, modalidad y rutina. |
| `monthly_calendar_aggregate` | Calendario mensual agregado con pausas completadas y omitidas. |
| `members_legal_detail` | Detalle operativo legal por membresia. No debe usarse para mostrar datos personales sensibles. |

### `coverage`

| Campo | Significado |
| --- | --- |
| `members_total` | Total de miembros registrados en la organizacion. |
| `members_in_scope_legal` | Miembros activos sujetos al seguimiento de pausas activas. |
| `members_with_activity_7d` | Miembros con actividad en los ultimos 7 dias. |
| `members_with_activity_month` | Miembros con actividad en el mes calendario actual. |
| `members_with_memory_payload` | Miembros con memoria/payload util para el calculo legal. |

### `legal_framework`

| Campo | Significado |
| --- | --- |
| `scope` | Alcance legal del seguimiento, por ejemplo SG-SST en jornada laboral. |
| `compliance_scope_statuses` | Estados de membresia que entran al calculo de cumplimiento. |
| `monthly_tracking` | Reglas mensuales: modo, pausas requeridas por dia y rango de duracion. |
| `minimum_event_record` | Campos minimos esperados en cada evento de pausa activa. |

### `kpis`

| Campo | Significado |
| --- | --- |
| `members_legal_complete` | Miembros que cumplen estado legal activo. |
| `avg_adherence_7d` | Adherencia promedio de los ultimos 7 dias. |
| `avg_attendance_month_pct` | Asistencia promedio del mes actual. |
| `month_done_total` | Total de pausas completadas en el mes. |
| `month_skipped_total` | Total de pausas omitidas en el mes. |
| `month_days_with_two_or_more_done_total` | Dias con dos o mas pausas completadas. |
| `total_duration_seconds_7d` | Duracion total acumulada en segundos en los ultimos 7 dias. |
| `completed_pauses_7d_total` | Pausas completadas en los ultimos 7 dias. |
| `avg_duration_seconds_7d` | Duracion promedio por pausa completada. |
| `avg_legal_event_completeness_pct` | Completitud promedio del registro legal del evento. |
| `avg_month_duration_in_range_pct` | Porcentaje promedio de pausas dentro del rango legal de duracion. |

## `risk_map`

| Campo | Significado |
| --- | --- |
| `cold_segments` | Segmentos frios por rol o grupo con baja activacion/recurrencia. |
| `plan_gaps.training_missing` | Miembros activos sin plan de entrenamiento definido. |
| `plan_gaps.nutrition_missing` | Miembros activos sin plan de nutricion definido. |
| `plan_gaps.wearables_connected` | Miembros activos con wearables conectados. |
| `watchlist` | Alertas priorizadas con codigo, severidad y mensaje. |

## `corporate_wellbeing_analysis`

| Campo | Significado |
| --- | --- |
| `status_program` | Estado general del programa corporativo. |
| `analysis_summary` | Resumen ejecutivo del estado actual. |
| `impact_perspective.business_risk_level` | Nivel de riesgo de negocio: bajo, medio o alto. |
| `impact_perspective.engagement_rate_pct` | Porcentaje de engagement o recurrencia agregada. |
| `impact_perspective.activation_rate_pct` | Porcentaje de activacion del programa. |
| `impact_perspective.wellbeing_index_0_100` | Indice agregado de bienestar usado para lectura ejecutiva. |
| `recommended_actions` | Acciones sugeridas para RRHH, lideres o administradores del programa. |

## Reglas de visualizacion futura

- Mostrar solo campos presentes y con informacion util.
- No mostrar categorias excluidas por `sharing_policy.excluded_categories`.
- Si `cohort_protected` es `true`, mostrar el mensaje de proteccion y ocultar detalle por dimension.
- Priorizar widgets agregados: bienestar global, activacion, recurrencia, pausas activas, riesgos y acciones recomendadas.
- Tratar `members_legal_detail` como informacion operativa restringida; no usarla como directorio de personas.
