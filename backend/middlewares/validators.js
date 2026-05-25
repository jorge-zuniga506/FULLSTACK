/**
 * middlewares/validators.js — Validadores de input con express-validator
 *
 * Cada validador es un array de middlewares que se pasa directamente a una ruta.
 * El array funciona como una cadena:
 *   1. Los `body(campo)...` acumulan errores sin detener la petición
 *   2. `handleValidationErrors` al final revisa si hay errores y responde 400 si los hay
 *
 * Uso en rutas:
 *   router.post('/ruta', validarStartup, controller)
 *
 * Exporta:
 *   validarAceleradora       — campos requeridos para crear una aceleradora
 *   validarStartup           — campos requeridos para crear una startup
 *   validarInversor          — campos requeridos para crear un inversor
 *   validarUsuario           — campos requeridos para registro de usuario
 *   validarActualizacionUsuario — campos opcionales para actualizar usuario (PATCH)
 */
const { body, validationResult } = require('express-validator');

/**
 * handleValidationErrors — Middleware que cierra la cadena de validación
 *
 * Si hay errores acumulados por los `body()` anteriores, responde con 400
 * y el array de errores detallados (campo, mensaje, valor recibido).
 * Si no hay errores, llama a next() para continuar al controller.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Devuelve todos los errores de validación encontrados (no solo el primero)
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * validarAceleradora — Validación para POST /api/aceleradoras
 * Campos:
 *   user_id          — requerido, entero (FK a users)
 *   nombre           — requerido, string
 *   programas_activos — opcional, string (lista de programas activos)
 *   sitio_web        — opcional, URL válida
 */
const validarAceleradora = [
  body('user_id').notEmpty().withMessage('El user_id es requerido').isInt().withMessage('Debe ser un entero'),
  body('nombre').notEmpty().withMessage('El nombre es requerido').isString(),
  body('programas_activos').optional().isString(),
  body('sitio_web').optional().isURL().withMessage('Debe ser una URL válida'),
  handleValidationErrors
];

/**
 * validarStartup — Validación para POST /api/startups
 * Campos:
 *   user_id          — requerido, entero
 *   nombre_comercial — requerido, string
 *   descripcion      — opcional, string
 *   fase             — opcional, uno de ['Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento']
 *   logo_url         — opcional, string (URL del logo)
 *   sector_id        — opcional, entero (FK a sectores)
 */
const validarStartup = [
  body('user_id').notEmpty().isInt(),
  body('nombre_comercial').notEmpty().isString(),
  body('descripcion').optional().isString(),
  body('fase').optional().isIn(['Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento']),
  body('logo_url').optional().isString(),
  body('sector_id').optional().isInt(),
  handleValidationErrors
];

/**
 * validarInversor — Validación para POST /api/inversores
 * Campos:
 *   user_id          — requerido, entero
 *   nombre           — requerido, string
 *   presupuesto_min  — opcional, numérico (en USD)
 *   presupuesto_max  — opcional, numérico (en USD)
 *   sectores_interes — opcional (string JSON o array)
 */
const validarInversor = [
  body('user_id').notEmpty().isInt(),
  body('nombre').notEmpty().isString(),
  body('presupuesto_min').optional().isNumeric(),
  body('presupuesto_max').optional().isNumeric(),
  body('sectores_interes').optional(),
  handleValidationErrors
];

/**
 * validarUsuario — Validación para POST /api/usuarios (registro)
 * Campos:
 *   cedula           — requerido, string (número de identificación)
 *   nombre_hacienda  — requerido, string (nombre completo)
 *   email            — requerido, formato de email válido
 *   password_hash    — requerido, mínimo 6 caracteres (se hashea en el service)
 *   role_id          — requerido, entero (FK a roles)
 */
const validarUsuario = [
  body('cedula')
    .notEmpty().withMessage('La cédula es requerida')
    .isString().withMessage('La cédula debe ser texto')
    .matches(/^\d{9,12}$/).withMessage('La cédula debe contener entre 9 y 12 dígitos numéricos'),
  body('nombre_hacienda').notEmpty().withMessage('El nombre es requerido').isString(),
  body('email').isEmail().withMessage('Correo inválido'),
  body('password_hash').isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
  body('role_id')
    .notEmpty().withMessage('El rol es requerido')
    .isInt({ min: 1, max: 4 }).withMessage('Debe seleccionar un rol válido (1-4)'),
  handleValidationErrors
];

/**
 * validarActualizacionUsuario — Validación para PUT /api/usuarios/:id
 * Todos los campos son opcionales (PATCH semántico con PUT):
 *   cedula          — string opcional
 *   nombre_hacienda — string opcional
 *   email           — email válido opcional
 *   password_hash   — mínimo 6 caracteres opcional
 *
 * Nota: role_id NO está incluido — el cambio de rol está prohibido
 * tanto en este validador como en UserService.actualizarUsuario()
 */
const validarActualizacionUsuario = [
  body('cedula').optional().isString(),
  body('nombre_hacienda').optional().isString(),
  body('email').optional().isEmail().withMessage('Correo inválido'),
  body('password_hash').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
  body('profile_picture').optional().isString(),
  handleValidationErrors
];

module.exports = {
  validarAceleradora,
  validarStartup,
  validarInversor,
  validarUsuario,
  validarActualizacionUsuario
};
