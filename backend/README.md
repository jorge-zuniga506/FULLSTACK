# Backend - Skill de IA JARVIS

Este backend incluye la skill de IA **JARVIS**, un asistente para el ecosistema de startups. La skill combina un LLM externo con herramientas locales de consulta y un clasificador automatico de solicitudes.

## Skill elegida

**JARVIS: asistente LLM + agente clasificador.**

Se eligio esta skill porque el proyecto necesita una integracion de IA demostrable y alineada con el dominio del sistema. En lugar de agregar una automatizacion aislada, JARVIS ayuda directamente a usuarios del ecosistema a consultar informacion de startups, aceleradoras, inversores y solicitudes usando lenguaje natural.

## Skills determinadas

Las skills reales de JARVIS se definen en `services/ChatbotService.js` mediante `getToolDefinitions()` y se exponen como metadata con `getSkillDefinitions()`.

| Skill | Proposito |
| --- | --- |
| `buscar_startups` | Buscar o recomendar startups por nombre, fase, sector o descripcion. |
| `buscar_aceleradoras` | Buscar aceleradoras por nombre o programas activos. |
| `buscar_inversores` | Buscar inversores por nombre, presupuesto o sectores de interes. |
| `buscar_solicitudes` | Consultar solicitudes por usuario, tipo o estado. |
| `crear_solicitud` | Crear una solicitud de incorporacion al ecosistema para un usuario. |

## Justificacion

La skill cumple el requerimiento de IA porque:

- Usa un proveedor LLM configurable por variable de entorno.
- Expone endpoints REST consumibles por frontend.
- Consulta datos reales del ecosistema mediante tools locales.
- Clasifica solicitudes automaticamente como `startup`, `aceleradora` o `inversor`.
- Incluye fallback local para que la demo no dependa completamente del proveedor externo.

## Proveedor LLM

El proveedor elegido es **Gemini** mediante el paquete `@google/generative-ai`.

Variable requerida en `.env`:

```env
GEMINI_API_KEY=tu_gemini_api_key
```

Si `GEMINI_API_KEY` no existe o Gemini falla, el backend responde con reglas locales para mantener la funcionalidad disponible durante la demo.

## Endpoints de IA

### Metadata de skills

```http
GET /api/ai/skills
```

Alias disponible:

```http
GET /api/chatbot/skills
```

Respuesta:

```json
{
  "assistant": "J.A.R.V.I.S.",
  "skills": [
    {
      "id": "buscar_startups",
      "name": "buscar_startups",
      "description": "Busca o recomienda startups en el ecosistema...",
      "parameters": {}
    }
  ]
}
```

### Chat asesor

```http
POST /api/ai/chat
```

Body:

```json
{
  "message": "Recomendame startups fintech"
}
```

Respuesta:

```json
{
  "response": "Respuesta de JARVIS",
  "data": []
}
```

### Clasificador automatico

```http
POST /api/ai/classify-request
```

Body:

```json
{
  "text": "Somos un fondo con capital para invertir en startups fintech."
}
```

Respuesta:

```json
{
  "tipo": "inversor",
  "confianza": 0.75,
  "razon": "La solicitud contiene senales asociadas con inversor.",
  "requiere_revision": false,
  "proveedor": "local-rules"
}
```

## Archivos principales

- `routes/ChatbotRoutes.js`: define `/skills`, `/chat`, `/ask` y `/classify-request`.
- `controllers/ChatbotController.js`: recibe las peticiones HTTP y valida entradas.
- `services/ChatbotService.js`: contiene la integracion con Gemini, definicion de skills/tools, fallback y clasificador.
- `tests/chatbot.test.js`: cubre chat, alias `/api/ai/chat`, metadata de skills y clasificacion.

## Demo frontend

La skill esta conectada al componente flotante J.A.R.V.I.S. del frontend. Desde la interfaz se puede alternar entre:

- **Chat asesor**
- **Clasificador**

Para que el navegador pueda conectarse al backend durante desarrollo:

```env
CORS_ORIGIN=http://localhost:5173
```

## Comando de verificacion

```powershell
cd C:\Users\HP78D\Videos\FULLSTACK\backend
.\node_modules\.bin\jest.cmd tests/chatbot.test.js --runInBand
```
