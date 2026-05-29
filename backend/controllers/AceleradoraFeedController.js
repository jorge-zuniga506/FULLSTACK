/**
 * AceleradoraFeedController.js
 * Red social exclusiva para Aceleradoras: posts con imagen + comentarios.
 * Solo role_id === 3 puede acceder.
 */
const { AceleradoraPost, AceleradoraComentario, Aceleradora, User } = require('../models');
const { uploadFile } = require('../services/UploadService');

const userPublicAttributes = [
  ['nombre_hacienda', 'nombre'],
  ['profile_picture', 'foto_perfil']
];

const aceleradoraInclude = () => ({
  model: Aceleradora,
  attributes: ['id', 'nombre', 'sitio_web'],
  include: [{ model: User, attributes: userPublicAttributes }]
});

const ensureAceleradoraProfile = async (userId) => {
  const user = await User.findByPk(userId, { attributes: ['id', 'nombre_hacienda'] });
  if (!user) return null;

  const [aceleradora] = await Aceleradora.findOrCreate({
    where: { user_id: userId },
    defaults: {
      nombre: user.nombre_hacienda || `Aceleradora ${userId}`
    }
  });

  return aceleradora;
};

const listarFeed = async (req, res) => {
  try {
    const posts = await AceleradoraPost.findAll({
      include: [
        aceleradoraInclude(),
        {
          model: AceleradoraComentario,
          include: [aceleradoraInclude()],
          order: [['created_at', 'ASC']]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    return res.status(200).json({ data: posts });
  } catch (error) {
    return res.status(500).json({ message: 'Error al cargar el feed de aceleradoras.', error: error.message });
  }
};

const crearPost = async (req, res) => {
  try {
    const aceleradora = await ensureAceleradoraProfile(req.user.id);
    if (!aceleradora) {
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

    const post = await AceleradoraPost.create({
      aceleradora_id: aceleradora.id,
      contenido: contenido.trim(),
      imagen_url
    });

    const postCompleto = await AceleradoraPost.findByPk(post.id, {
      include: [
        aceleradoraInclude(),
        { model: AceleradoraComentario }
      ]
    });

    return res.status(201).json({ message: 'Post publicado.', data: postCompleto });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear post.', error: error.message });
  }
};

const eliminarPost = async (req, res) => {
  try {
    const aceleradora = await ensureAceleradoraProfile(req.user.id);
    if (!aceleradora) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const post = await AceleradoraPost.findOne({
      where: { id: req.params.id, aceleradora_id: aceleradora.id }
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
    const aceleradora = await ensureAceleradoraProfile(req.user.id);
    if (!aceleradora) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const { contenido } = req.body;
    if (!contenido || !contenido.trim()) {
      return res.status(400).json({ message: 'El comentario no puede estar vacio.' });
    }

    const post = await AceleradoraPost.findByPk(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado.' });
    }

    const comentario = await AceleradoraComentario.create({
      post_id: post.id,
      aceleradora_id: aceleradora.id,
      contenido: contenido.trim()
    });

    const comentarioCompleto = await AceleradoraComentario.findByPk(comentario.id, {
      include: [aceleradoraInclude()]
    });

    return res.status(201).json({ message: 'Comentario anadido.', data: comentarioCompleto });
  } catch (error) {
    return res.status(500).json({ message: 'Error al comentar.', error: error.message });
  }
};

const eliminarComentario = async (req, res) => {
  try {
    const aceleradora = await ensureAceleradoraProfile(req.user.id);
    if (!aceleradora) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const comentario = await AceleradoraComentario.findOne({
      where: { id: req.params.id, aceleradora_id: aceleradora.id }
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
