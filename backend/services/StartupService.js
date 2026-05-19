/**
 * services/StartupService.js — Lógica de negocio de startups
 *
 * Clase estática con operaciones CRUD sobre la tabla `startups`.
 * Incluye soporte de paginación, filtros y ordenamiento en `obtenerStartups`.
 *
 * Métodos:
 *
 * ── crearStartup(data) ───────────────────────────────────────────────────────
 * Crea una startup. El hook beforeValidate en Profiles.js verifica
 * que el user_id corresponda a un usuario con rol 'startup'.
 *
 * ── obtenerStartups(query) ───────────────────────────────────────────────────
 * Lista paginada con filtros opcionales:
 *   page, limit  → paginación (default: page=1, limit=10)
 *   sector_id    → filtra por sector económico
 *   fase         → filtra por etapa: Idea | Semilla | Serie A | Serie B | Escalamiento
 *   sortBy, order → ordenamiento (default: id DESC)
 * Retorna: { totalItems, totalPages, currentPage, startups }
 *
 * ── obtenerStartupPorId(id) ──────────────────────────────────────────────────
 * Busca por PK. Lanza Error 'Startup no encontrada' si no existe.
 *
 * ── editarStartup(id, data) ──────────────────────────────────────────────────
 * Actualiza campos de una startup. El hook de rol solo aplica en creación (beforeValidate),
 * no en actualizaciones.
 *
 * ── eliminarStartup(id) ──────────────────────────────────────────────────────
 * Elimina la startup. MetricaDashboard se elimina en cascada.
 */
const { Startup } = require('../models');

class StartupService {

  /**
   * Crea una nueva startup
   * @param {object} data - Campos del modelo Startup
   * @returns {Startup} Instancia creada
   * @throws {Error} Si el usuario no tiene rol 'startup' (hook en Profiles.js)
   */
  static async crearStartup(data) {
    return await Startup.create(data);
  }

  /**
   * Lista startups con paginación y filtros opcionales
   * @param {object} query - Parámetros de la query string
   * @param {number} [query.page=1]    - Página actual
   * @param {number} [query.limit=10]  - Resultados por página
   * @param {number} [query.sector_id] - Filtro por sector
   * @param {string} [query.fase]      - Filtro por etapa de desarrollo
   * @param {string} [query.sortBy='id']  - Campo de ordenamiento
   * @param {string} [query.order='DESC'] - Dirección: 'ASC' o 'DESC'
   * @returns {{ totalItems, totalPages, currentPage, startups }}
   */
  static async obtenerStartups(query) {
    const { page = 1, limit = 10, sector_id, fase, sortBy = 'id', order = 'DESC' } = query;
    const offset = (page - 1) * limit; // Calcula el offset para SQL LIMIT/OFFSET

    // Construye el objeto WHERE dinámicamente según los filtros presentes
    const where = {};
    if (sector_id) where.sector_id = sector_id;
    if (fase)      where.fase      = fase;

    // findAndCountAll retorna tanto los registros como el total sin paginación
    const startups = await Startup.findAndCountAll({
      where,
      limit:  parseInt(limit, 10),  // Asegura que sea entero
      offset: parseInt(offset, 10),
      order: [[sortBy, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']] // Sanitiza la dirección
    });

    return {
      totalItems:  startups.count,                       // Total de registros sin paginación
      totalPages:  Math.ceil(startups.count / limit),    // Total de páginas
      currentPage: parseInt(page, 10),
      startups:    startups.rows                         // Registros de la página actual
    };
  }

  /**
   * Busca una startup por su PK
   * @param {number} id
   * @returns {Startup}
   * @throws {Error} 'Startup no encontrada'
   */
  static async obtenerStartupPorId(id) {
    const startup = await Startup.findByPk(id);
    if (!startup) throw new Error('Startup no encontrada');
    return startup;
  }

  /**
   * Actualiza los campos de una startup
   * @param {number} id   - ID de la startup
   * @param {object} data - Campos a actualizar
   * @returns {Startup} Instancia actualizada
   */
  static async editarStartup(id, data) {
    const startup = await this.obtenerStartupPorId(id);
    return await startup.update(data);
  }

  /**
   * Elimina una startup (MetricaDashboard se elimina en cascada)
   * @param {number} id
   * @returns {true}
   */
  static async eliminarStartup(id) {
    const startup = await this.obtenerStartupPorId(id);
    await startup.destroy();
    return true;
  }
}

module.exports = StartupService;
