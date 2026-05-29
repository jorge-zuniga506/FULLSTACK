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
} = require('../controllers/AceleradoraFeedController');

// Solo role_id === 3 (Aceleradora) puede acceder a la red social
router.get('/', authRequired, requireRole(3), listarFeed);
router.post('/', upload.single('imagen'), authRequired, requireRole(3), crearPost);
router.delete('/:id', authRequired, requireRole(3), eliminarPost);
router.post('/:postId/comentarios', authRequired, requireRole(3), comentar);
router.delete('/comentarios/:id', authRequired, requireRole(3), eliminarComentario);

module.exports = router;
