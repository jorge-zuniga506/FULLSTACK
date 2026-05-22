# Justificación de la Skill: J.A.R.V.I.S. (Chatbot con IA)

El desarrollo del asistente virtual J.A.R.V.I.S. para la plataforma del ecosistema de startups ha sido implementado bajo el concepto de una **Skill de Inteligencia Artificial**. A continuación se detalla la justificación de su uso en la página y por qué esta integración cumple con la definición de "Skill".

## 1. Justificación del uso del Chatbot en la Plataforma

La inclusión del asistente conversacional en la aplicación web no es simplemente una funcionalidad estética, sino una herramienta fundamental para mejorar la experiencia de usuario (UX) y optimizar la gestión del ecosistema:

* **Navegación Intuitiva de Datos Complejos:** El ecosistema de startups cuenta con múltiples entidades con grandes volúmenes de datos (inversores, aceleradoras, emprendedores). El chatbot permite a los usuarios consultar esta vasta base de datos en lenguaje natural, facilitando búsquedas que de otro modo requerirían sistemas de filtros avanzados.
* **Asesoría y Recomendaciones Dinámicas:** Actúa como un consultor virtual capaz de procesar requerimientos y realizar emparejamientos lógicos (matchmaking). Por ejemplo, puede recomendar programas de aceleración específicos para una startup según su fase o sector, o buscar startups atractivas para el presupuesto de un inversor.
* **Automatización y Clasificación:** El asistente asiste en la automatización de flujos de trabajo. Mediante su servicio de clasificación de solicitudes, logra leer lo que el usuario envía y predecir de qué tipo de rol se trata (inversor, startup, aceleradora), ahorrando tiempo en evaluación manual.
* **Interactividad y Accesibilidad:** Reduce la curva de aprendizaje de la interfaz. Cualquier persona que sepa conversar o chatear puede explotar todo el potencial de la base de datos relacional de la aplicación sin conocimientos técnicos previos.

## 2. ¿Por qué se considera una "Skill" de IA?

En el contexto del desarrollo de software moderno con Inteligencia Artificial, una "Skill" (habilidad) se refiere a una capacidad modular, específica y accionable otorgada a un agente o sistema para interactuar con su entorno y cumplir tareas. El sistema J.A.R.V.I.S. es formalmente una Skill debido a lo siguiente:

### A. IA Generativa y Agentes Inteligentes
No estamos ante un simple chatbot basado en reglas estáticas (if/else o árboles de decisión). Está impulsado por el modelo **Gemini 2.5 Flash** (`@google/generative-ai`), lo que le permite tener un razonamiento semántico, retener el contexto conversacional y generar respuestas coherentes y adaptativas.

### B. Uso de Herramientas (Tool Calling / Function Calling)
El rasgo principal que convierte esto en una **Skill Avanzada** es el `Tool Calling`. El modelo no solo conversa basado en lo que sabe de la internet, sino que la Skill le enseña a utilizar herramientas propias de nuestro backend:
- `buscar_startups`
- `buscar_aceleradoras`
- `buscar_inversores`
- `buscar_solicitudes`
- `crear_solicitud`

El modelo es capaz de entender de forma **autónoma** cuándo la intención del usuario requiere de información en tiempo real, decidiendo qué función llamar y con qué parámetros, para luego interpretar los datos de la base de datos local y responderle al usuario humano. Esto es la esencia de una "Agentic AI".

### C. System Prompt Definido y Delimitado
El agente tiene un comportamiento predeterminado, parametrizado como una directiva de sistema (System Instruction). Su "Skill" está definida con una personalidad ("*Eres J.A.R.V.I.S...*") y unos límites estandarizados para que funcione únicamente dentro del dominio del ecosistema de negocios, garantizando respuestas precisas, profesionales y analíticas.

### D. Escalabilidad Modular
Al estar diseñado dentro del `ChatbotService.js`, la "Skill" actual es completamente modular. Si el día de mañana se necesita que el agente envíe correos o genere PDFs de los inversores, simplemente se le inyectaría un nuevo bloque de herramienta (`tool`) en su definición.

---

**Conclusión:** 
La implementación de J.A.R.V.I.S. no es solo una interfaz de texto; es una **Skill de IA Orquestada**. Combina capacidades de comprensión de lenguaje natural de última generación, toma autónoma de decisiones (Tool Calling) y acceso programático a la lógica de negocio subyacente, transformando un sistema de base de datos tradicional en una plataforma conectada, proactiva y altamente eficiente.
