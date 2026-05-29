const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Anthropic } = require('@anthropic-ai/sdk');
const { Startup, Inversor, Aceleradora, Solicitud, Sector, User } = require('../models');
const { Op } = require('sequelize');
const GoogleDriveService = require('./GoogleDriveService');

class ChatbotService {

  constructor() {
    this.documents = [];
    this.isDocsLoading = false;
    this.lastDocsLoadTime = null;

    // 1. Inicializar Google Gemini (Motor Principal)
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
      this.geminiModel = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        tools: this.getGeminiToolDefinitions(),
        systemInstruction: this.getBaseSystemInstruction()
      });
      console.log("[ChatbotService] Gemini inicializado correctamente como Motor Principal.");
    } else {
      console.warn("[ChatbotService] Falta la variable de entorno GEMINI_API_KEY.");
    }

    // 2. Inicializar Anthropic / Claude (Soporte Secundario)
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY.trim()
      });
      console.log(`[ChatbotService] Anthropic Claude inicializado como soporte secundario.`);
    } else {
      console.warn("[ChatbotService] Falta la variable de entorno ANTHROPIC_API_KEY.");
    }

    // 3. Pre-cargar los documentos en caliente de forma asíncrona al arrancar el servidor
    this.ensureDocumentsLoaded(false).catch(err => {
      console.error("[ChatbotService] Error al precargar documentos en inicio:", err.message);
    });
  }

  /**
   * Asegura que los documentos de Google Drive estén cargados en memoria.
   * Si no se han cargado, o ha pasado más de 10 minutos, los recarga de forma asíncrona.
   */
  async ensureDocumentsLoaded(force = false) {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const rawFileIds = process.env.GOOGLE_DRIVE_FILE_IDS;
    
    if (!folderId && !rawFileIds) {
      return;
    }

    const tenMinutes = 10 * 60 * 1000;
    const now = Date.now();
    const shouldReload = force || !this.lastDocsLoadTime || (now - this.lastDocsLoadTime > tenMinutes);

    if (shouldReload && !this.isDocsLoading) {
      this.isDocsLoading = true;
      console.log("[ChatbotService] Iniciando carga de documentos desde Google Drive...");
      
      const directFileIds = rawFileIds 
        ? rawFileIds.split(',').map(id => id.trim()).filter(id => id.length > 0)
        : [];

      try {
        const loadedDocs = await GoogleDriveService.loadDocuments(folderId, directFileIds);
        this.documents = loadedDocs;
        this.lastDocsLoadTime = Date.now();
        console.log(`[ChatbotService] Éxito al cargar ${this.documents.length} documentos de Google Drive.`);
      } catch (err) {
        console.error("[ChatbotService] Error al cargar base de conocimiento de Google Drive:", err.message);
      } finally {
        this.isDocsLoading = false;
      }
    }
  }

  /**
   * Retorna las instrucciones del sistema base para el asistente virtual JARVIS
   */
  getBaseSystemInstruction() {
    return "Eres J.A.R.V.I.S., el asistente virtual de la plataforma del Ecosistema de Startups. Tu objetivo es ser extremadamente servicial, formal, analítico y profesional. Ayuda a los usuarios con consultas sobre startups, programas de aceleradoras, inversores en acciones/equity y solicitudes de registro. Utiliza las herramientas disponibles para consultar la base de datos cuando sea necesario. Explica los resultados en español de manera clara, educada y concisa.";
  }

  /**
   * Construye el prompt del sistema combinado con los PDFs cargados de Google Drive
   */
  getSystemInstructionWithKnowledge() {
    let instruction = this.getBaseSystemInstruction();

    if (this.documents && this.documents.length > 0) {
      instruction += "\n\n======================================================\n";
      instruction += "BASE DE CONOCIMIENTO ADICIONAL (PDFs PÚBLICOS DE GOOGLE DRIVE):\n";
      instruction += "Tienes acceso a los siguientes documentos que debes utilizar para responder preguntas de los usuarios. Si te preguntan sobre el contenido de estos PDFs, responde citando el nombre del documento.\n";
      
      this.documents.forEach(doc => {
        instruction += `\n--- INICIO DOCUMENTO: ${doc.name} (ID: ${doc.id}) ---\n`;
        instruction += doc.text;
        instruction += `\n--- FIN DOCUMENTO: ${doc.name} ---\n`;
      });
      
      instruction += "\n======================================================\n";
    }

    return instruction;
  }

  /**
   * Retorna las definiciones de las herramientas para Gemini
   */
  getGeminiToolDefinitions() {
    return [
      {
        functionDeclarations: [
          {
            name: "buscar_startups",
            description: "Busca o recomienda startups en el ecosistema por nombre, fase, sector o palabras clave en su descripción.",
            parameters: {
              type: "OBJECT",
              properties: {
                nombre: { type: "STRING", description: "Nombre comercial de la startup a buscar." },
                fase: {
                  type: "STRING",
                  description: "Fase de la startup ('Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento')."
                },
                sector: { type: "STRING", description: "Nombre del sector de actividad (ej: Fintech, Healthtech, Agritech, Edtech)." },
                descripcion: { type: "STRING", description: "Palabras clave o temas de interés de la descripción de la startup." }
              }
            }
          },
          {
            name: "buscar_aceleradoras",
            description: "Busca o recomienda aceleradoras de startups en el ecosistema por nombre o palabras clave de sus programas.",
            parameters: {
              type: "OBJECT",
              properties: {
                nombre: { type: "STRING", description: "Nombre de la aceleradora a buscar." },
                programa: { type: "STRING", description: "Palabras clave en los programas activos de la aceleradora." }
              }
            }
          },
          {
            name: "buscar_inversores",
            description: "Busca o recomienda inversionistas en el ecosistema, especialmente inversores de acciones/equity, por nombre, presupuesto o sectores de interés.",
            parameters: {
              type: "OBJECT",
              properties: {
                nombre: { type: "STRING", description: "Nombre del inversor a buscar." },
                presupuesto: { type: "NUMBER", description: "Monto de presupuesto de inversión que se busca (debe estar entre el presupuesto mínimo y máximo del inversor)." },
                sector: { type: "STRING", description: "Sector de interés del inversor para invertir (ej: Fintech, Healthtech, Logística)." }
              }
            }
          },
          {
            name: "buscar_solicitudes",
            description: "Busca solicitudes de incorporación al ecosistema realizadas por los usuarios, por ID de usuario, tipo de rol solicitado o estado actual.",
            parameters: {
              type: "OBJECT",
              properties: {
                user_id: { type: "INTEGER", description: "ID del usuario que creó la solicitud." },
                tipo: {
                  type: "STRING",
                  description: "Tipo de incorporación solicitada ('startup', 'aceleradora', 'inversor')."
                },
                estado: {
                  type: "STRING",
                  description: "Estado de la solicitud ('Pendiente', 'Aprobada', 'Rechazada')."
                }
              }
            }
          },
          {
            name: "crear_solicitud",
            description: "Crea una nueva solicitud de incorporación al ecosistema para un usuario.",
            parameters: {
              type: "OBJECT",
              properties: {
                user_id: { type: "INTEGER", description: "ID del usuario que realiza la solicitud." },
                tipo: {
                  type: "STRING",
                  description: "Tipo de incorporación solicitada ('startup', 'aceleradora', 'inversor')."
                },
                comentarios_admin: { type: "STRING", description: "Comentarios o justificación del usuario para la solicitud." }
              },
              required: ["user_id", "tipo"]
            }
          }
        ]
      }
    ];
  }

  /**
   * Retorna las definiciones de las herramientas para Anthropic Claude
   */
  getAnthropicTools() {
    return [
      {
        name: "buscar_startups",
        description: "Busca o recomienda startups en el ecosistema por nombre, fase, sector o palabras clave en su descripción.",
        input_schema: {
          type: "object",
          properties: {
            nombre: { type: "string", description: "Nombre comercial de la startup a buscar." },
            fase: {
              type: "string",
              description: "Fase de la startup ('Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento')."
            },
            sector: { type: "string", description: "Nombre del sector de actividad (ej: Fintech, Healthtech, Agritech, Edtech)." },
            descripcion: { type: "string", description: "Palabras clave o temas de interés de la descripción de la startup." }
          }
        }
      },
      {
        name: "buscar_aceleradoras",
        description: "Busca o recomienda aceleradoras de startups en el ecosistema por nombre o palabras clave de sus programas.",
        input_schema: {
          type: "object",
          properties: {
            nombre: { type: "string", description: "Nombre de la aceleradora a buscar." },
            programa: { type: "string", description: "Palabras clave en los programas activos de la aceleradora." }
          }
        }
      },
      {
        name: "buscar_inversores",
        description: "Busca o recomienda inversionistas en el ecosistema, especialmente inversores de acciones/equity, por nombre, presupuesto o sectores de interés.",
        input_schema: {
          type: "object",
          properties: {
            nombre: { type: "string", description: "Nombre del inversor a buscar." },
            presupuesto: { type: "number", description: "Monto de presupuesto de inversión que se busca (debe estar entre el presupuesto mínimo y máximo del inversor)." },
            sector: { type: "string", description: "Sector de interés del inversor para invertir (ej: Fintech, Healthtech, Logística)." }
          }
        }
      },
      {
        name: "buscar_solicitudes",
        description: "Busca solicitudes de incorporación al ecosistema realizadas por los usuarios, por ID de usuario, tipo de rol solicitado o estado actual.",
        input_schema: {
          type: "object",
          properties: {
            user_id: { type: "integer", description: "ID del usuario que creó la solicitud." },
            tipo: {
              type: "string",
              description: "Tipo de incorporación solicitada ('startup', 'aceleradora', 'inversor')."
            },
            estado: {
              type: "string",
              description: "Estado de la solicitud ('Pendiente', 'Aprobada', 'Rechazada')."
            }
          }
        }
      },
      {
        name: "crear_solicitud",
        description: "Crea una nueva solicitud de incorporación al ecosistema para un usuario.",
        input_schema: {
          type: "object",
          properties: {
            user_id: { type: "integer", description: "ID del usuario que realiza la solicitud." },
            tipo: {
              type: "string",
              description: "Tipo de incorporación solicitada ('startup', 'aceleradora', 'inversor')."
            },
            comentarios_admin: { type: "string", description: "Comentarios o justificación del usuario para la solicitud." }
          },
          required: ["user_id", "tipo"]
        }
      }
    ];
  }

  /**
   * Ejecuta la herramienta de base de datos recomendada por la IA
   */
  async executeTool(name, args) {
    try {
      switch (name) {
        case "buscar_startups":
          return await this.localBuscarStartups(args);
        case "buscar_aceleradoras":
          return await this.localBuscarAceleradoras(args);
        case "buscar_inversores":
          return await this.localBuscarInversores(args);
        case "buscar_solicitudes":
          return await this.localBuscarSolicitudes(args);
        case "crear_solicitud":
          return await this.localCrearSolicitud(args);
        default:
          console.warn(`Tool desconocida: ${name}`);
          return null;
      }
    } catch (error) {
      console.error(`Error ejecutando tool ${name}:`, error);
      return null;
    }
  }

  // ─── Métodos locales de base de datos ───────────────────────────────────────

  async localBuscarStartups({ nombre, fase, sector, descripcion }) {
    const where = {};
    if (nombre) {
      where.nombre_comercial = { [Op.like]: `%${nombre}%` };
    }
    if (fase) {
      where.fase = fase;
    }
    if (descripcion) {
      where.descripcion = { [Op.like]: `%${descripcion}%` };
    }

    const include = [{
      model: Sector,
      required: false
    }];

    if (sector) {
      include[0].where = {
        nombre: { [Op.like]: `%${sector}%` }
      };
      include[0].required = true;
    }

    const startups = await Startup.findAll({ where, include });
    return startups.map(s => ({
      id: s.id,
      nombre_comercial: s.nombre_comercial,
      descripcion: s.descripcion,
      fase: s.fase,
      logo_url: s.logo_url,
      sector: s.Sector ? s.Sector.nombre : 'No especificado'
    }));
  }

  async localBuscarAceleradoras({ nombre, programa }) {
    const where = {};
    if (nombre) {
      where.nombre = { [Op.like]: `%${nombre}%` };
    }
    if (programa) {
      where.programas_activos = { [Op.like]: `%${programa}%` };
    }

    const aceleradoras = await Aceleradora.findAll({ where });
    return aceleradoras.map(a => ({
      id: a.id,
      nombre: a.nombre,
      programas_activos: a.programas_activos,
      sitio_web: a.sitio_web
    }));
  }

  async localBuscarInversores({ nombre, presupuesto, sector }) {
    const inversores = await Inversor.findAll();
    let results = inversores;

    if (nombre) {
      results = results.filter(i => i.nombre.toLowerCase().includes(nombre.toLowerCase()));
    }
    if (presupuesto) {
      results = results.filter(i => {
        const min = i.presupuesto_min ? parseFloat(i.presupuesto_min) : 0;
        const max = i.presupuesto_max ? parseFloat(i.presupuesto_max) : Infinity;
        return presupuesto >= min && presupuesto <= max;
      });
    }
    if (sector) {
      results = results.filter(i => {
        if (!i.sectores_interes) return false;
        let sectorsArray = [];
        try {
          sectorsArray = typeof i.sectores_interes === 'string'
            ? JSON.parse(i.sectores_interes)
            : i.sectores_interes;
        } catch (e) {
          sectorsArray = [];
        }
        if (!Array.isArray(sectorsArray)) return false;
        return sectorsArray.some(s => s.toLowerCase().includes(sector.toLowerCase()));
      });
    }

    return results.map(i => ({
      id: i.id,
      nombre: i.nombre,
      presupuesto_min: i.presupuesto_min,
      presupuesto_max: i.presupuesto_max,
      sectores_interes: i.sectores_interes
    }));
  }

  async localBuscarSolicitudes({ user_id, tipo, estado }) {
    const where = {};
    if (user_id) where.user_id = user_id;
    if (tipo) where.tipo = tipo;
    if (estado) where.estado = estado;

    const solicitudes = await Solicitud.findAll({
      where,
      include: [{ model: User, required: false }]
    });

    return solicitudes.map(s => ({
      id: s.id,
      user_id: s.user_id,
      usuario_nombre: s.User ? s.User.nombre_hacienda : 'Desconocido',
      tipo: s.tipo,
      estado: s.estado,
      comentarios_admin: s.comentarios_admin
    }));
  }

  async localCrearSolicitud({ user_id, tipo, comentarios_admin }) {
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error(`El usuario con ID ${user_id} no existe.`);
    }

    const newSolicitud = await Solicitud.create({
      user_id,
      tipo,
      estado: 'Pendiente',
      comentarios_admin: comentarios_admin || 'Creado vía asistente virtual JARVIS'
    });

    return {
      id: newSolicitud.id,
      user_id: newSolicitud.user_id,
      usuario_nombre: user.nombre_hacienda,
      tipo: newSolicitud.tipo,
      estado: newSolicitud.estado,
      comentarios_admin: newSolicitud.comentarios_admin,
      mensaje: "Solicitud creada exitosamente"
    };
  }

  normalizeTipo(value) {
    if (!value) return null;

    const normalized = String(value).toLowerCase();
    if (normalized.includes('aceler')) return 'aceleradora';
    if (normalized.includes('invers')) return 'inversor';
    if (normalized.includes('startup') || normalized.includes('emprend')) return 'startup';

    return null;
  }

  classifyRequestLocally(text) {
    const normalized = text.toLowerCase();
    const scores = {
      startup: 0,
      aceleradora: 0,
      inversor: 0
    };

    const keywords = {
      startup: ['startup', 'emprendimiento', 'producto', 'mvp', 'fundador', 'fundadora', 'clientes', 'traccion', 'idea'],
      aceleradora: ['aceleradora', 'programa', 'mentoria', 'incubadora', 'cohorte', 'acompanamiento', 'demo day'],
      inversor: ['inversor', 'inversionista', 'capital', 'equity', 'fondo', 'ticket', 'portafolio', 'invertir']
    };

    Object.entries(keywords).forEach(([tipo, words]) => {
      words.forEach(word => {
        if (normalized.includes(word)) scores[tipo] += 1;
      });
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [tipo, score] = sorted[0];
    const total = Object.values(scores).reduce((sum, current) => sum + current, 0);

    return {
      tipo: score > 0 ? tipo : 'startup',
      confianza: total > 0 ? Number((score / total).toFixed(2)) : 0.34,
      razon: score > 0
        ? `La solicitud contiene señales asociadas con ${tipo}.`
        : 'No hay suficientes señales; se sugiere revision manual.',
      requiere_revision: score === 0 || score === sorted[1][1],
      proveedor: 'local-rules'
    };
  }

  parseClassificationResponse(text) {
    try {
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      const tipo = this.normalizeTipo(parsed.tipo);

      if (!tipo) {
        return null;
      }

      return {
        tipo,
        confianza: Number(parsed.confianza || parsed.confidence || 0.7),
        razon: parsed.razon || parsed.reason || 'Clasificacion generada por IA.',
        requiere_revision: Boolean(parsed.requiere_revision),
        proveedor: 'gemini'
      };
    } catch (error) {
      return null;
    }
  }

  async classifyRequest(text) {
    const localResult = this.classifyRequestLocally(text);

    if (!this.geminiModel) {
      return localResult;
    }

    try {
      const prompt = [
        'Clasifica la siguiente solicitud de incorporacion al ecosistema.',
        'Responde solo JSON valido con las claves tipo, confianza, razon y requiere_revision.',
        'tipo debe ser exactamente uno de: startup, aceleradora, inversor.',
        `Solicitud: ${text}`
      ].join('\n');

      const result = await this.geminiModel.generateContent(prompt);
      const responseText = result.response.text();
      return this.parseClassificationResponse(responseText) || localResult;
    } catch (error) {
      console.error('Error clasificando solicitud con IA:', error);
      return localResult;
    }
  }

  async processMessageLocally(message) {
    const normalized = message.toLowerCase();

    // 1. Respuestas de navegación local (iniciar sesión / login)
    if (normalized.includes('iniciar ses') || normalized.includes('iniciar sés') || normalized.includes('sesion') || normalized.includes('sesión') || normalized.includes('login') || normalized.includes('entrar') || normalized.includes('loguear')) {
      return {
        mensaje: "Saludos, señor. Es sumamente fácil. En la página principal, arriba a la derecha sale un botón de acceso. Al tocar ahí, se abrirá nuestro portal donde podrá iniciar sesión ingresando su Cédula y contraseña, o directamente con su cuenta de Google/Gmail en un solo clic.",
        data: []
      };
    }

    // 2. Respuestas de registro local
    if (normalized.includes('registr') || normalized.includes('cuenta') || normalized.includes('crear usuario')) {
      return {
        mensaje: "Para registrarse en la plataforma, haga clic en 'Regístrate ahora' en la pantalla de inicio de sesión, ingrese su Cédula y pulse 'Validar Cédula' para autocompletar su nombre oficial desde el Ministerio de Hacienda, elija su rol, cree una contraseña y guarde su código 2FA. Si prefiere Google, elija su rol en el popup flotante para registrarse de inmediato omitiendo el 2FA.",
        data: []
      };
    }

    // 3. Respuestas de roles del ecosistema
    if (normalized.includes('rol') || normalized.includes('roles')) {
      return {
        mensaje: "La plataforma cuenta con 4 roles principales:\n\n1. 🚀 Emprendedor / Startup: Para fundadores que publican su modelo de negocio y métricas de tracción.\n2. ⚡ Aceleradora: Para incubadoras que lanzan convocatorias y reclutan startups.\n3. 💼 Inversionista: Para mentores y Venture Capital que exploran startups y adquieren acciones/equity según su rango de presupuesto.\n4. 👑 Administrador: Control y moderación de solicitudes de incorporación.",
        data: []
      };
    }

    if (normalized.includes('startup')) {
      const startups = await this.localBuscarStartups({});
      return {
        mensaje: startups.length
          ? `Puedo ayudarle con el ecosistema. En este momento encontre ${startups.length} startups registradas.`
          : 'Puedo ayudarle con consultas sobre startups, aunque todavia no encontre registros para listar.',
        data: startups.slice(0, 5)
      };
    }

    if (normalized.includes('aceleradora')) {
      const aceleradoras = await this.localBuscarAceleradoras({});
      return {
        mensaje: aceleradoras.length
          ? `Encontre ${aceleradoras.length} aceleradoras registradas en el ecosistema.`
          : 'Puedo orientar consultas sobre aceleradoras, aunque todavia no encontre registros para listar.',
        data: aceleradoras.slice(0, 5)
      };
    }

    if (normalized.includes('inversor') || normalized.includes('inversion')) {
      const inversores = await this.localBuscarInversores({});
      return {
        mensaje: inversores.length
          ? `Encontre ${inversores.length} inversores registrados en el ecosistema.`
          : 'Puedo orientar consultas sobre inversores, aunque todavia no encontre registros para listar.',
        data: inversores.slice(0, 5)
      };
    }

    if (normalized.includes('solicitud')) {
      const solicitudes = await this.localBuscarSolicitudes({});
      return {
        mensaje: solicitudes.length
          ? `Encontre ${solicitudes.length} solicitudes registradas. Puede pedirme filtrarlas por estado o tipo.`
          : 'No encontre solicitudes registradas por ahora, pero puedo ayudarle a clasificarlas o crearlas.',
        data: solicitudes.slice(0, 5)
      };
    }

    return {
      mensaje: 'Estoy listo para ayudarle con startups, aceleradoras, inversores y solicitudes del ecosistema. También puedo clasificar solicitudes desde el modo Clasificador y responder preguntas sobre la navegación.',
      data: []
    };
  }

  /**
   * Procesa el mensaje con Anthropic Claude
   */
  async processMessageWithClaude(message) {
    try {
      const systemInstruction = this.getSystemInstructionWithKnowledge();
      const modelName = process.env.CLAUDE_MODEL || "claude-3-5-haiku-20241022";

      console.log(`[ChatbotService] Procesando mensaje con Claude (${modelName})...`);

      const response = await this.anthropic.messages.create({
        model: modelName,
        max_tokens: 4000,
        system: systemInstruction,
        messages: [{ role: "user", content: message }],
        tools: this.getAnthropicTools()
      });

      // Si Claude decide invocar una herramienta
      if (response.stop_reason === "tool_use") {
        const toolUseBlock = response.content.find(block => block.type === "tool_use");
        if (toolUseBlock) {
          const toolName = toolUseBlock.name;
          const toolInput = toolUseBlock.input;
          const toolId = toolUseBlock.id;

          console.log(`[ChatbotService] Claude invocó la tool "${toolName}" con argumentos:`, toolInput);
          const toolResult = await this.executeTool(toolName, toolInput);

          console.log(`[ChatbotService] Enviando respuesta de tool "${toolName}" de vuelta a Claude...`);
          const secondResponse = await this.anthropic.messages.create({
            model: modelName,
            max_tokens: 4000,
            system: systemInstruction,
            messages: [
              { role: "user", content: message },
              { role: "assistant", content: response.content },
              {
                role: "user",
                content: [
                  {
                    type: "tool_result",
                    tool_use_id: toolId,
                    content: JSON.stringify(toolResult || { status: "no_data" })
                  }
                ]
              }
            ],
            tools: this.getAnthropicTools()
          });

          const finalMessage = secondResponse.content.find(block => block.type === "text")?.text || "";
          return {
            mensaje: finalMessage,
            data: Array.isArray(toolResult) ? toolResult : (toolResult ? [toolResult] : [])
          };
        }
      }

      // Si no invocó herramientas, retornar el texto directamente
      const textMessage = response.content.find(block => block.type === "text")?.text || "";
      return {
        mensaje: textMessage,
        data: []
      };

    } catch (error) {
      console.error("[ChatbotService] Error al llamar a Anthropic Claude:", error.message);
      // Fallback a Gemini si Claude falla (ej: sin saldo o problemas de red)
      if (this.geminiModel) {
        console.log("[ChatbotService] Iniciando fallback a Gemini...");
        return await this.processMessageWithGemini(message);
      }
      return await this.processMessageLocally(message);
    }
  }

  async processMessageWithGemini(message) {
    try {
      // 1. Si hay documentos de la base de conocimiento cargados, configuramos el modelo con ellos antes de iniciar el chat
      if (this.documents && this.documents.length > 0) {
        const systemInstruction = this.getSystemInstructionWithKnowledge();
        this.geminiModel = this.genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          tools: this.getGeminiToolDefinitions(),
          systemInstruction: systemInstruction
        });
      } else {
        // Aseguramos que al menos use la instrucción del sistema base
        this.geminiModel = this.genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          tools: this.getGeminiToolDefinitions(),
          systemInstruction: this.getBaseSystemInstruction()
        });
      }

      // 2. Iniciamos el chat DESPUÉS de haber actualizado el modelo con el conocimiento de los PDFs
      const chat = this.geminiModel.startChat();

      let result = await chat.sendMessage(message);
      let response = result.response;

      let functionCalls = [];
      if (typeof response.functionCalls === 'function') {
        functionCalls = response.functionCalls() || [];
      } else if (Array.isArray(response.functionCalls)) {
        functionCalls = response.functionCalls;
      }

      if (functionCalls.length === 0) {
        return {
          mensaje: response.text(),
          data: []
        };
      }

      const call = functionCalls[0];
      console.log(`[ChatbotService] Gemini invocó la tool "${call.name}" con argumentos:`, call.args);
      const data = await this.executeTool(call.name, call.args);

      if (!data) {
        return {
          mensaje: "Disculpe. Ocurrió un problema al consultar la información en el sistema.",
          data: []
        };
      }

      const responseParts = [
        {
          functionResponse: {
            name: call.name,
            response: { result: data }
          }
        }
      ];

      result = await chat.sendMessage(responseParts);
      response = result.response;

      return {
        mensaje: response.text(),
        data: Array.isArray(data) ? data : [data]
      };
    } catch (error) {
      console.error("[ChatbotService] Error en Gemini:", error.message);
      return await this.processMessageLocally(message);
    }
  }

  /**
   * Procesa el mensaje del usuario y maneja el flujo de function calling
   */
  async processMessage(message) {
    // 1. Comando especial para recargar documentos manualmente en caliente
    const normalized = message.toLowerCase();
    if (normalized.includes('/recargar-drive') || normalized.includes('/reload-drive') || normalized.includes('jarvis recarga documentos')) {
      await this.ensureDocumentsLoaded(true);
      return {
        mensaje: `¡A sus órdenes! He recargado la base de conocimiento desde Google Drive. Documentos cargados: ${this.documents.length}.`,
        data: this.documents.map(d => ({ id: d.id, name: d.name }))
      };
    }

    // 2. Asegurar que los documentos estén cargados
    await this.ensureDocumentsLoaded(false);

    // 3. Decidir qué modelo utilizar: Priorizar Google Gemini como motor principal
    if (this.geminiModel) {
      return await this.processMessageWithGemini(message);
    } else if (this.anthropic) {
      return await this.processMessageWithClaude(message);
    } else {
      return await this.processMessageLocally(message);
    }
  }
}

module.exports = new ChatbotService();
