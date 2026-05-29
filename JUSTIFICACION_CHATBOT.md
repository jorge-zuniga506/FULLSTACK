# Justificación del Chatbot J.A.R.V.I.S. — Asistente IA

## 1. Objetivo

Integrar un asistente virtual basado en inteligencia artificial generativa que sirva como guía y facilitador dentro del Ecosistema de Startups, permitiendo a los usuarios obtener información, realizar búsquedas en la plataforma y recibir recomendaciones personalizadas mediante lenguaje natural.

## 2. Problema que Resuelve

| Problema | Solución |
|----------|----------|
| Usuarios nuevos no saben navegar la plataforma | El chatbot responde preguntas sobre registro, roles y funcionalidades |
| Dificultad para encontrar startups, inversores o aceleradoras | Búsqueda en BD mediante tool calling con lenguaje natural |
| Proceso de clasificación de solicitudes lento | Clasificación automática IA (startup/aceleradora/inversor) |
| Falta de acceso rápido a información del ecosistema | Base de conocimiento con PDFs cargados desde Google Drive |
| Barrera de entrada tecnológica | Interfaz de chat con voz (Speech-to-Text y Text-to-Speech) |

## 3. Stack Tecnológico

| Componente | Tecnología | Propósito |
|------------|-----------|-----------|
| **Motor principal** | Google Gemini 2.5 Flash | Generación de respuestas y tool calling |
| **Respaldo** | Anthropic Claude | Fallback si Gemini no está disponible |
| **Fallback local** | Reglas basadas en palabras clave | Funcionamiento sin APIs externas |
| **Base de conocimiento** | Google Drive API + pdf-parse | Carga de documentos públicos PDF |
| **Frontend** | React + Web Speech API | Widget flotante con voz y chat |
| **Backend** | Node.js + Express | Endpoints REST /api/chatbot/* |
| **Herramientas BD** | Sequelize ORM | 5 tools para consultar BD |

## 4. Arquitectura del Chatbot

```
Usuario (Frontend React)
       │
       ▼
┌─────────────────────────┐
│  Widget J.A.R.V.I.S.    │
│  - Chat panel           │
│  - Speech-to-Text       │
│  - Text-to-Speech       │
│  - Modo Asesor/Clasif.  │
└────────┬────────────────┘
         │ POST /api/ai/*
         ▼
┌─────────────────────────┐
│  ChatbotController      │
│  - ask()                │
│  - classifyRequest()    │
└────────┬────────────────┘
         ▼
┌─────────────────────────────────────────────┐
│  ChatbotService                             │
│                                             │
│  1. ¿Comando especial? (/recargar-drive)    │
│  2. Cargar base de conocimiento (Drive)     │
│  3. Seleccionar modelo:                     │
│     ├─ Gemini 2.5 Flash (tool calling)      │
│     ├─ Anthropic Claude (respaldo)          │
│     └─ Reglas locales (fallback final)      │
│  4. Ejecutar tool calling si es necesario   │
│  5. Devolver respuesta + datos              │
└─────────────────────────────────────────────┘
```

## 5. Capacidades del Asistente

### Tool Calling (Gemini)
El asistente puede ejecutar 5 herramientas directamente sobre la base de datos:

| Herramienta | Descripción |
|-------------|-------------|
| `buscar_startups` | Busca startups por nombre, fase, sector o descripción |
| `buscar_aceleradoras` | Busca aceleradoras por nombre o programas |
| `buscar_inversores` | Busca inversores por nombre, presupuesto o sectores de interés |
| `buscar_solicitudes` | Consulta solicitudes de incorporación |
| `crear_solicitud` | Crea una nueva solicitud de incorporación |

### Clasificación Automática
El endpoint `/classify-request` analiza texto y determina automáticamente si una solicitud corresponde a una startup, aceleradora o inversor, con nivel de confianza y razón de la clasificación.

### Interfaz de Voz
- **Speech-to-Text**: Reconocimiento de voz nativo del navegador (Web Speech API)
- **Text-to-Speech**: Síntesis de voz con selección de género (femenino/masculino), detección de voz en español

## 6. Cumplimiento de Requerimientos (RF-07)

Este chatbot cumple con el requerimiento **RF-07 (Integración de IA)** del proyecto:

- ✅ **LLM**: Gemini 2.5 Flash con tool calling + Claude como respaldo
- ✅ **Agente**: J.A.R.V.I.S. responde consultas, busca en BD y clasifica solicitudes
- ✅ **Demostrable**: Widget visible en landing page y todos los dashboards
- ✅ **Base de conocimiento**: PDFs desde Google Drive integrados dinámicamente
- ✅ **Fallback**: Sin APIs externas, funciona con reglas locales

## 7. Posibles Mejoras Futuras

| Mejora | Descripción |
|--------|-------------|
| Historial de conversaciones | Persistir chats en la tabla `consultas_ia` |
| Streaming de respuestas | Enviar tokens en tiempo real vía SSE |
| Autenticación | Proteger endpoints según el usuario autenticado |
| Panel admin de IA | Dashboard para revisar conversaciones y gestionar knowledge base |
| Subida de documentos UI | Interfaz para cargar PDFs sin editar .env |
| Rate limiting | Control de uso para evitar abusos en endpoints públicos |

## 8. Conclusión

El chatbot J.A.R.V.I.S. representa una capa de inteligencia que humaniza la interacción con la plataforma, reduce la fricción en la incorporación de nuevos usuarios y democratiza el acceso a la información del ecosistema. Su diseño con múltiples proveedores de IA (Gemini + Claude + fallback local) garantiza resiliencia, mientras que el tool calling permite que el asistente no solo converse, sino que ejecute acciones reales en la base de datos.

---

*Documento generado para el Proyecto Final — Ecosistema de Startups*
