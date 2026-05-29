/**
 * InversorFeedController.js
 * Red social exclusiva para Inversores: posts con imagen + comentarios.
 * Solo role_id === 4 puede acceder.
 */
const { InversorPost, InversorComentario, Inversor, User } = require('../models');
const { uploadFile } = require('../services/UploadService');

const userPublicAttributes = [
  ['nombre_hacienda', 'nombre'],
  ['profile_picture', 'foto_perfil']
];

const inversorInclude = () => ({
  model: Inversor,
  attributes: ['id', 'nombre'],
  include: [{ model: User, attributes: userPublicAttributes }]
});

const ensureInversorProfile = async (userId) => {
  const user = await User.findByPk(userId, { attributes: ['id', 'nombre_hacienda'] });
  if (!user) return null;

  const [inversor] = await Inversor.findOrCreate({
    where: { user_id: userId },
    defaults: {
      nombre: user.nombre_hacienda || `Inversor ${userId}`
    }
  });

  return inversor;
};

const listarFeed = async (req, res) => {
  try {
    const posts = await InversorPost.findAll({
      include: [
        inversorInclude(),
        {
          model: InversorComentario,
          include: [inversorInclude()],
          order: [['created_at', 'ASC']]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    return res.status(200).json({ data: posts });
  } catch (error) {
    return res.status(500).json({ message: 'Error al cargar el feed de inversores.', error: error.message });
  }
};

const crearPost = async (req, res) => {
  try {
    const inversor = await ensureInversorProfile(req.user.id);
    if (!inversor) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const { contenido } = req.body;
    if (!contenido || !contenido.trim()) {
      return res.status(400).json({ message: 'El contenido del post es requerido.' });
    }

    let imagen_url = null;
    if (req.file) {
      imagen_url = await uploadFile(req.file);
    }

    const post = await InversorPost.create({
      inversor_id: inversor.id,
      contenido: contenido.trim(),
      imagen_url
    });

    const postCompleto = await InversorPost.findByPk(post.id, {
      include: [
        inversorInclude(),
        { model: InversorComentario }
      ]
    });

    return res.status(201).json({ message: 'Post publicado.', data: postCompleto });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear post.', error: error.message });
  }
};

const eliminarPost = async (req, res) => {
  try {
    const inversor = await ensureInversorProfile(req.user.id);
    if (!inversor) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const post = await InversorPost.findOne({
      where: { id: req.params.id, inversor_id: inversor.id }
    });
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado o no te pertenece.' });
    }

    await post.destroy();
    return res.status(200).json({ message: 'Post eliminado.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar post.', error: error.message });
  }
};

const comentar = async (req, res) => {
  try {
    const inversor = await ensureInversorProfile(req.user.id);
    if (!inversor) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const { contenido } = req.body;
    if (!contenido || !contenido.trim()) {
      return res.status(400).json({ message: 'El comentario no puede estar vacio.' });
    }

    const post = await InversorPost.findByPk(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado.' });
    }

    const comentario = await InversorComentario.create({
      post_id: post.id,
      inversor_id: inversor.id,
      contenido: contenido.trim()
    });

    const comentarioCompleto = await InversorComentario.findByPk(comentario.id, {
      include: [inversorInclude()]
    });

    return res.status(201).json({ message: 'Comentario anadido.', data: comentarioCompleto });
  } catch (error) {
    return res.status(500).json({ message: 'Error al comentar.', error: error.message });
  }
};

const eliminarComentario = async (req, res) => {
  try {
    const inversor = await ensureInversorProfile(req.user.id);
    if (!inversor) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const comentario = await InversorComentario.findOne({
      where: { id: req.params.id, inversor_id: inversor.id }
    });
    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado.' });
    }

    await comentario.destroy();
    return res.status(200).json({ message: 'Comentario eliminado.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar comentario.', error: error.message });
  }
};

module.exports = { listarFeed, crearPost, eliminarPost, comentar, eliminarComentario };
