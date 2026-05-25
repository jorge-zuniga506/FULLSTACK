this.tools = [
  {
    name: "buscar_usuarios",
    description: "Busca usuarios por nombre o cédula",
    parameters: {
      type: "object",
      properties: {
        nombre: { type: "string" },
        cedula: { type: "string" }
      }
    }
  },
  {
    name: "listar_por_rol",
    description: "Lista usuarios por rol (startup, inversor, aceleradora, admin)",
    parameters: {
      type: "object",
      properties: {
        role: { type: "string" }
      },
      required: ["role"]
    }
  },
  {
    name: "crear_usuario",
    description: "Crea un nuevo usuario",
    parameters: {
      type: "object",
      properties: {
        nombre_hacienda: { type: "string" },
        email: { type: "string" },
        cedula: { type: "string" },
        role: { type: "string" },
        password_hash: { type: "string" }
      },
      required: ["email", "role"]
    }
  },
  {
    name: "eliminar_usuario",
    description: "Elimina un usuario por ID",
    parameters: {
      type: "object",
      properties: {
        id: { type: "number" }
      },
      required: ["id"]
    }
  }
];


module.exports = [
  {
    name: "crear_startup",
    description: "Crea una nueva startup",
    parameters: {
      type: "object",
      properties: {
        nombre: { type: "string" },
        categoria: { type: "string" }
      },
      required: ["nombre"]
    }
  }
];