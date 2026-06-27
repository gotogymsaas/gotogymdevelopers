const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'docs');
const baseName = 'Quantum_Coach_Replicacion_GoToGym_Developers_2026-06-09';
const mdPath = path.join(outDir, `${baseName}.md`);
const pdfPath = path.join(outDir, `${baseName}.pdf`);

const report = [
  { type: 'title', text: 'Informe tecnico: replicacion de GoToGym Quantum Coach en GoToGym Developers' },
  { type: 'meta', text: 'Fecha: 2026-06-09' },
  { type: 'meta', text: 'Repos revisados: appdesplegada-inspect y gotogymdevelopers' },
  { type: 'meta', text: 'Objetivo: determinar si el chat GoToGym Quantum Coach puede replicarse aqui y bajo que alcance.' },

  { type: 'h1', text: 'Conclusion ejecutiva' },
  {
    type: 'p',
    text: 'Si, el Quantum Coach se puede replicar en gotogymdevelopers, pero no como copia directa. La app de referencia esta construida sobre Django REST + JavaScript vanilla, mientras que gotogymdevelopers usa Express/TypeScript + React/Vite. La estrategia correcta es portar el producto por capas: contrato de API, motor conversacional, memoria, experiencias QAF, interfaz React y observabilidad.'
  },
  {
    type: 'p',
    text: 'La opcion recomendada es una replicacion progresiva. Primero un MVP conversacional con /api/chat, Azure/OpenAI, contexto de coach ya disponible y quick actions basicas. Despues se migran experiencias QAF, memoria persistente, adjuntos, voz y analitica. Esto reduce riesgo y permite probar valor antes de traer todo el sistema.'
  },
  {
    type: 'callout',
    text: 'Dictamen: viable con adaptacion media-alta. No es un "copiar y pegar"; es una migracion funcional hacia la arquitectura actual.'
  },

  { type: 'h1', text: 'Que existe en appdesplegada' },
  {
    type: 'p',
    text: 'En appdesplegada el Quantum Coach es un sistema completo, no solo una ventana de chat. Esta compuesto por frontend, backend, motor QAF, memoria, runtime IA, experiencias especializadas, adjuntos, voz y trazabilidad.'
  },
  { type: 'bullet', text: 'Frontend: frontend/js/chat.js inyecta el widget GoToGym Quantum Coach, maneja historial, drawer de memoria, quick actions, adjuntos, microfono, voz y flujos guiados.' },
  { type: 'bullet', text: 'Endpoint principal: backend/api/urls.py registra path("chat/", views.chat), equivalente a POST /api/chat/.' },
  { type: 'bullet', text: 'Motor de decision: backend/api/chat_gateway.py decide CONTINUE, CONFIRM, START, EXPERIENCE_STEP o ATTACHMENT_ANALYSIS.' },
  { type: 'bullet', text: 'Motor QAF: backend/api/qaf_cognition/* contiene decision layer, router cognitivo, emotional engine, memory engine, response policy, language governance y generadores.' },
  { type: 'bullet', text: 'Experiencias QAF: calorias, meal planner, perfil metabolico, postura, lifestyle, motivacion, progresion, medicion muscular, skin health, shape presence y posture proportion.' },
  { type: 'bullet', text: 'IA: backend/api/llm/azure_client.py integra Azure OpenAI Chat con deployment gpt-4.1-mini, API key o Managed Identity.' },
  { type: 'bullet', text: 'Arquitectura: ARCHITECTURE.md documenta Azure OpenAI por Managed Identity, backend Django, PostgreSQL, Blob Storage, Front Door, Key Vault y Application Insights.' },
  { type: 'bullet', text: 'n8n: aparece como legado/descomisionado; el runtime actual documentado es backend-first.' },

  { type: 'h1', text: 'Que existe hoy en gotogymdevelopers' },
  {
    type: 'p',
    text: 'El repo actual ya tiene una base util, pero no contiene el Quantum Coach conversacional completo. Hay un frontend React/Vite, un backend Express/TypeScript y servicios de contexto/bienestar.'
  },
  { type: 'bullet', text: 'Backend actual: backend/src/app.ts registra /api/integrations, /api/bodygraph, /api/v1/auth, /api/v1/smartwatch y /api/v1/business/wellbeing.' },
  { type: 'bullet', text: 'No se encontro /api/chat ni un controlador conversacional equivalente al Quantum Coach.' },
  { type: 'bullet', text: 'Si existe consumo de /api/coach_context/ desde frontend/src/services/wellbeingService.ts, pero es un cliente hacia el API de GoToGym, no el motor local del coach.' },
  { type: 'bullet', text: 'docs/COACH_CONTEXT_ENDPOINT_MAP.md documenta un contrato fuerte de contexto de usuario: profile, documents, devices, if_snapshot, business y wellbeing_experience_value_v1.' },
  { type: 'bullet', text: 'La consola frontend usa useCoachContext y componentes de cards para mostrar bienestar, lo cual sirve como insumo para personalizacion del chat.' },
  { type: 'bullet', text: 'El package raiz ya incluye openai, pero backend/package.json no lo incluye. Si el chat vive en backend, conviene agregar el SDK alli o usar fetch contra el proveedor.' },

  { type: 'h1', text: 'Brecha tecnica' },
  { type: 'table', rows: [
    ['Area', 'appdesplegada', 'gotogymdevelopers', 'Brecha'],
    ['Chat UI', 'Widget JS completo', 'React sin chat equivalente', 'Alta'],
    ['Endpoint chat', 'POST /api/chat/', 'No existe', 'Alta'],
    ['IA', 'Azure OpenAI backend-first', 'openai en raiz, no integrado al backend', 'Media'],
    ['Contexto usuario', '/api/coach_context/ completo', 'Cliente y documentacion existentes', 'Baja-media'],
    ['QAF experiencias', '13 experiencias y motores', 'Solo lectura/visualizacion de bienestar', 'Alta'],
    ['Memoria', 'Conversational memory y share preview', 'No encontrada localmente', 'Alta'],
    ['Adjuntos/OCR', 'Upload + OCR + Blob + vision', 'No encontrado', 'Alta'],
    ['Voz', 'Preferencias, recomendacion y telemetria', 'No encontrado', 'Media-alta'],
    ['Observabilidad', 'Headers X-Chat-* y scripts de pruebas', 'Basico', 'Media']
  ] },

  { type: 'h1', text: 'Arquitectura recomendada para replicarlo aqui' },
  {
    type: 'p',
    text: 'La replicacion debe respetar la arquitectura de gotogymdevelopers. En lugar de traer Django, se recomienda crear un modulo Coach en Express/TypeScript y componentes React nativos.'
  },
  { type: 'bullet', text: 'Backend: crear /api/v1/coach/chat con controller, service, router y tipos TypeScript.' },
  { type: 'bullet', text: 'Contexto: reutilizar el contrato /api/coach_context/ como fuente inicial para perfil, IF, devices y wellbeing_experience_value_v1.' },
  { type: 'bullet', text: 'IA: encapsular un CoachLLMService con proveedor configurable: OpenAI directo o Azure OpenAI. Variables sugeridas: OPENAI_API_KEY o AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT, AZURE_OPENAI_API_VERSION.' },
  { type: 'bullet', text: 'Gateway: portar la logica esencial de chat_gateway.py a TypeScript: deteccion de intencion explicita, guardrails de tercera persona/informacional, decision START/CONFIRM/CONTINUE y score.' },
  { type: 'bullet', text: 'Frontend: construir un componente React QuantumCoachPanel con mensajes, input, quick actions, estado de carga, reset y consumo del endpoint local.' },
  { type: 'bullet', text: 'Persistencia: iniciar con memoria de sesion/localStorage y luego mover a base de datos si el producto necesita continuidad real entre sesiones.' },
  { type: 'bullet', text: 'Observabilidad: devolver metadata en JSON y headers equivalentes: gateway_decision, route, mode, runtime_source y fallback_reason.' },

  { type: 'h1', text: 'Fases sugeridas' },
  { type: 'h2', text: 'Fase 1 - MVP conversacional' },
  { type: 'bullet', text: 'Crear /api/v1/coach/chat en Express.' },
  { type: 'bullet', text: 'Agregar servicio LLM con prompts basados en build_quantum_coach_messages.' },
  { type: 'bullet', text: 'Usar coach_context como contexto de entrada cuando el usuario este autenticado.' },
  { type: 'bullet', text: 'Crear UI React con saludo, mensajes, quick actions y boton "Ver experiencias QAF".' },
  { type: 'bullet', text: 'Alcance: conversacion y coaching general, sin activar experiencias complejas todavia.' },
  { type: 'h2', text: 'Fase 2 - Gateway QAF y experiencias basicas' },
  { type: 'bullet', text: 'Portar chat_gateway.py y compute_intervention_score a TypeScript.' },
  { type: 'bullet', text: 'Implementar catalogo de experiencias y contratos de quick actions.' },
  { type: 'bullet', text: 'Conectar 2 o 3 experiencias iniciales: lifestyle, progression y motivation, porque dependen menos de OCR o vision.' },
  { type: 'h2', text: 'Fase 3 - Memoria y continuidad' },
  { type: 'bullet', text: 'Guardar conversaciones por usuario/conversation_id.' },
  { type: 'bullet', text: 'Implementar resumen de sesion y memoria selectiva.' },
  { type: 'bullet', text: 'Agregar controles de privacidad: listar, borrar y no guardar.' },
  { type: 'h2', text: 'Fase 4 - Adjuntos, vision y voz' },
  { type: 'bullet', text: 'Agregar upload de imagen/PDF, validaciones, limites, OCR o extraccion de texto.' },
  { type: 'bullet', text: 'Agregar speech-to-text/text-to-speech si el producto lo requiere.' },
  { type: 'bullet', text: 'Replicar headers/trazas para QA y monitoreo.' },

  { type: 'h1', text: 'Riesgos y cuidados' },
  { type: 'bullet', text: 'Datos sensibles: coach_context puede contener salud, documentos, dispositivos, empresa y datos personales. La UI debe usar el bloque seguro wellbeing_experience_value_v1 siempre que sea suficiente.' },
  { type: 'bullet', text: 'Costos IA: definir limites de tokens, timeouts, reintentos, fallback y telemetria antes de abrirlo a usuarios.' },
  { type: 'bullet', text: 'No diagnosticar: el prompt debe mantener tono educativo y no sustituir atencion medica.' },
  { type: 'bullet', text: 'Migracion parcial: copiar todo views.py de Django seria riesgoso. Lo sano es portar algoritmos pequenos y contratos.' },
  { type: 'bullet', text: 'Compatibilidad: los nombres de endpoints deben alinearse con el prefijo actual /api/v1 para no romper la app.' },

  { type: 'h1', text: 'Estimacion de esfuerzo' },
  { type: 'table', rows: [
    ['Alcance', 'Tiempo estimado', 'Resultado'],
    ['MVP chat + UI React', '3 a 5 dias', 'Coach conversacional funcional con contexto basico'],
    ['Gateway QAF + 3 experiencias', '1 a 2 semanas', 'Activacion controlada y quick actions utiles'],
    ['Memoria persistente', '1 semana', 'Continuidad entre sesiones y privacidad basica'],
    ['Adjuntos + voz + vision', '2 a 4 semanas', 'Paridad alta con appdesplegada'],
    ['Paridad casi completa', '4 a 8 semanas', 'Replica robusta con pruebas y observabilidad']
  ] },

  { type: 'h1', text: 'Decision recomendada' },
  {
    type: 'p',
    text: 'Recomiendo replicar el Quantum Coach en gotogymdevelopers mediante un MVP backend-first en TypeScript, usando la identidad visual y UX de la captura, pero sin intentar migrar todo el legado de Django en un solo bloque. La prioridad debe ser demostrar una conversacion util, personalizada y segura; luego se incorporan QAF, memoria y adjuntos.'
  },
  {
    type: 'p',
    text: 'El primer entregable tecnico deberia ser: endpoint /api/v1/coach/chat, componente React QuantumCoachPanel, servicio LLM, gateway basico START/CONFIRM/CONTINUE, uso de coach_context y pruebas unitarias del router conversacional.'
  },

  { type: 'h1', text: 'Referencias locales revisadas' },
  { type: 'bullet', text: 'appdesplegada-inspect/ARCHITECTURE.md' },
  { type: 'bullet', text: 'appdesplegada-inspect/STACK.md' },
  { type: 'bullet', text: 'appdesplegada-inspect/docs/FLUJO_FUNCIONAMIENTO_IA_CHAT.md' },
  { type: 'bullet', text: 'appdesplegada-inspect/docs/executive/acta_cierre_quantum_coach_v1.md' },
  { type: 'bullet', text: 'appdesplegada-inspect/backend/api/urls.py' },
  { type: 'bullet', text: 'appdesplegada-inspect/backend/api/chat_gateway.py' },
  { type: 'bullet', text: 'appdesplegada-inspect/backend/api/llm/azure_client.py' },
  { type: 'bullet', text: 'appdesplegada-inspect/frontend/js/chat.js' },
  { type: 'bullet', text: 'backend/src/app.ts' },
  { type: 'bullet', text: 'backend/src/services/corporate-wellbeing.service.ts' },
  { type: 'bullet', text: 'frontend/src/services/wellbeingService.ts' },
  { type: 'bullet', text: 'docs/COACH_CONTEXT_ENDPOINT_MAP.md' },
];

function mdEscape(text) {
  return String(text).replace(/\|/g, '\\|');
}

function toMarkdown(blocks) {
  const lines = [];
  for (const block of blocks) {
    if (block.type === 'title') lines.push(`# ${block.text}`, '');
    else if (block.type === 'meta') lines.push(`**${block.text}**  `);
    else if (block.type === 'h1') lines.push('', `## ${block.text}`, '');
    else if (block.type === 'h2') lines.push('', `### ${block.text}`, '');
    else if (block.type === 'p') lines.push(block.text, '');
    else if (block.type === 'callout') lines.push(`> ${block.text}`, '');
    else if (block.type === 'bullet') lines.push(`- ${block.text}`);
    else if (block.type === 'table') {
      const [head, ...rows] = block.rows;
      lines.push(`| ${head.map(mdEscape).join(' | ')} |`);
      lines.push(`| ${head.map(() => '---').join(' | ')} |`);
      for (const row of rows) lines.push(`| ${row.map(mdEscape).join(' | ')} |`);
      lines.push('');
    }
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

function normalize(text) {
  return String(text)
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function wrapText(text, maxChars) {
  const words = normalize(text).split(' ').filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (!line) {
      line = word;
    } else if ((line + ' ' + word).length <= maxChars) {
      line += ' ' + word;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function escapePdf(text) {
  return normalize(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function buildPdf(blocks) {
  const pages = [];
  let current = [];
  let y = 760;
  const marginX = 54;

  function newPage() {
    if (current.length) pages.push(current);
    current = [];
    y = 760;
  }

  function addLine(text, size = 10, x = marginX, leading = 14, gapAfter = 0) {
    if (y < 64) newPage();
    current.push({ text: escapePdf(text), size, x, y });
    y -= leading + gapAfter;
  }

  function addWrapped(text, size = 10, x = marginX, maxChars = 92, leading = 14, gapAfter = 6, prefixFirst = '') {
    const lines = wrapText(text, maxChars);
    lines.forEach((line, index) => addLine(`${index === 0 ? prefixFirst : ''}${line}`, size, x, leading, 0));
    y -= gapAfter;
  }

  for (const block of blocks) {
    if (block.type === 'title') {
      addWrapped(block.text, 18, marginX, 54, 23, 10);
    } else if (block.type === 'meta') {
      addWrapped(block.text, 9, marginX, 100, 12, 1);
    } else if (block.type === 'h1') {
      y -= 6;
      addWrapped(block.text, 14, marginX, 70, 18, 4);
    } else if (block.type === 'h2') {
      y -= 3;
      addWrapped(block.text, 12, marginX, 80, 16, 2);
    } else if (block.type === 'p') {
      addWrapped(block.text, 10, marginX, 92, 14, 7);
    } else if (block.type === 'callout') {
      addWrapped(`DICTAMEN: ${block.text}`, 10, marginX, 88, 14, 8);
    } else if (block.type === 'bullet') {
      addWrapped(block.text, 10, marginX + 12, 88, 14, 3, '- ');
    } else if (block.type === 'table') {
      const rows = block.rows;
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        const label = i === 0 ? 'Tabla: ' : '';
        addWrapped(`${label}${row.join(' | ')}`, i === 0 ? 9 : 8, marginX, i === 0 ? 92 : 110, 12, 2);
      }
      y -= 4;
    }
  }
  if (current.length) pages.push(current);

  const objects = [];
  function addObject(body) {
    objects.push(body);
    return objects.length;
  }

  const fontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const pageIds = [];
  for (const page of pages) {
    const content = page.map((line) => `BT /F1 ${line.size} Tf 1 0 0 1 ${line.x} ${line.y} Tm (${line.text}) Tj ET`).join('\n');
    const contentId = addObject(`<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`);
    const pageId = addObject(`<< /Type /Page /Parent 0 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  }

  const pagesId = addObject(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`);
  for (const pageId of pageIds) {
    objects[pageId - 1] = objects[pageId - 1].replace('/Parent 0 0 R', `/Parent ${pagesId} 0 R`);
  }
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf, 'latin1');
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(mdPath, toMarkdown(report), 'utf8');
fs.writeFileSync(pdfPath, buildPdf(report));

console.log(`Markdown: ${mdPath}`);
console.log(`PDF: ${pdfPath}`);
