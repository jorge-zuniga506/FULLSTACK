const express = require('express');
const router = express.Router();
const { authRequired, requireRole } = require('../middlewares/authMiddleware');
const { upload } = require('../services/UploadService');
const {
  listarFeed,
  crearPost,
  eliminarPost,
  comentar,
  eliminarComentario
} = require('../controllers/InversorFeedController');

// Solo role_id === 4 (Inversor) puede acceder a la red social
router.get('/', authRequired, requireRole(4), listarFeed);
router.post('/', upload.single('imagen'), authRequired, requireRole(4), crearPost);
router.delete('/:id', authRequired, requireRole(4), eliminarPost);
router.post('/:postId/comentarios', authRequired, requireRole(4), comentar);
router.delete('/comentarios/:id', authRequired, requireRole(4), eliminarComentario);

module.exports = router;
