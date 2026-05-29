/**
 * StartupFeedController.js
 * Red social exclusiva para Startups: posts con imagen (Cloudinary) + comentarios.
 * Solo role_id === 2 puede acceder.
 */
const { StartupPost, StartupComentario, Startup, User, Sector } = require('../models');
const { uploadFile } = require('../services/UploadService');

const userPublicAttributes = [
  ['nombre_hacienda', 'nombre'],
  ['profile_picture', 'foto_perfil']
];

const ensureStartupProfile = async (userId) => {
  const user = await User.findByPk(userId, { attributes: ['id', 'nombre_hacienda'] });
  if (!user) return null;

  const [startup] = await Startup.findOrCreate({
    where: { user_id: userId },
    defaults: {
      nombre_comercial: user.nombre_hacienda || `Startup ${userId}`
    }
  });

  return startup;
};

// ── Listar feed completo (todos los posts de startups, ordenados por fecha) ──
const listarFeed = async (req, res) => {
  try {
    const posts = await StartupPost.findAll({
      include: [
        {
          model: Startup,
          attributes: ['id', 'nombre_comercial', 'logo_url'],
          include: [
            { model: User, attributes: userPublicAttributes },
            { model: Sector, attributes: ['nombre'] }
          ]
        },
        {
          model: StartupComentario,
          include: [
            {
              model: Startup,
              attributes: ['nombre_comercial', 'logo_url'],
              include: [{ model: User, attributes: userPublicAttributes }]
            }
          ],
          order: [['created_at', 'ASC']]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 50
    });
    return res.status(200).json({ data: posts });
  } catch (error) {
    return res.status(500).json({ message: 'Error al cargar el feed.', error: error.message });
  }
};

// ── Crear post (text + imagen opcional ya subida a Cloudinary por multer) ────
const crearPost = async (req, res) => {
  try {
    const startup = await ensureStartupProfile(req.user.id);
    if (!startup) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const { contenido } = req.body;
    if (!contenido || contenido.trim() === '') {
      return res.status(400).json({ message: 'El contenido del post es requerido.' });
    }

    let imagen_url = null;
    if (req.file) {
      imagen_url = await uploadFile(req.file);
    }

    const post = await StartupPost.create({
      startup_id: startup.id,
      contenido: contenido.trim(),
      imagen_url
    });

    // Recargar con asociaciones para devolverlo completo
    const postCompleto = await StartupPost.findByPk(post.id, {
      include: [
        {
          model: Startup,
          attributes: ['id', 'nombre_comercial', 'logo_url'],
          include: [
            { model: User, attributes: userPublicAttributes },
            { model: Sector, attributes: ['nombre'] }
          ]
        },
        { model: StartupComentario }
      ]
    });

    return res.status(201).json({ message: 'Post publicado.', data: postCompleto });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear post.', error: error.message });
  }
};

// ── Eliminar post propio ─────────────────────────────────────────────────────
const eliminarPost = async (req, res) => {
  try {
    const startup = await ensureStartupProfile(req.user.id);
    if (!startup) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const post = await StartupPost.findOne({ where: { id: req.params.id, startup_id: startup.id } });
    if (!post) return res.status(404).json({ message: 'Post no encontrado o no te pertenece.' });

    await post.destroy();
    return res.status(200).json({ message: 'Post eliminado.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar post.', error: error.message });
  }
};

// ── Agregar comentario a un post ─────────────────────────────────────────────
const comentar = async (req, res) => {
  try {
    const startup = await ensureStartupProfile(req.user.id);
    if (!startup) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const { contenido } = req.body;
    if (!contenido || contenido.trim() === '') {
      return res.status(400).json({ message: 'El comentario no puede estar vacío.' });
    }

    const post = await StartupPost.findByPk(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post no encontrado.' });

    const comentario = await StartupComentario.create({
      post_id: post.id,
      startup_id: startup.id,
      contenido: contenido.trim()
    });

    // Recargar con datos del autor
    const comentarioCompleto = await StartupComentario.findByPk(comentario.id, {
      include: [{
        model: Startup,
        attributes: ['nombre_comercial', 'logo_url'],
        include: [{ model: User, attributes: userPublicAttributes }]
      }]
    });

    return res.status(201).json({ message: 'Comentario añadido.', data: comentarioCompleto });
  } catch (error) {
    return res.status(500).json({ message: 'Error al comentar.', error: error.message });
  }
};

// ── Eliminar comentario propio ───────────────────────────────────────────────
const eliminarComentario = async (req, res) => {
  try {
    const startup = await ensureStartupProfile(req.user.id);
    if (!startup) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const comentario = await StartupComentario.findOne({
      where: { id: req.params.id, startup_id: startup.id }
    });
    if (!comentario) return res.status(404).json({ message: 'Comentario no encontrado.' });

    await comentario.destroy();
    return res.status(200).json({ message: 'Comentario eliminado.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar comentario.', error: error.message });
  }
};

module.exports = { listarFeed, crearPost, eliminarPost, comentar, eliminarComentario };
