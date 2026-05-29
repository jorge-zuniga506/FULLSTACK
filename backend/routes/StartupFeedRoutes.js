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
} = require('../controllers/StartupFeedController');

// Solo role_id === 2 (Startup) puede acceder a la red social
router.get('/',                         authRequired, requireRole(2), listarFeed);
router.post('/', upload.single('imagen'), authRequired, requireRole(2), crearPost);
router.delete('/:id',                   authRequired, requireRole(2), eliminarPost);
router.post('/:postId/comentarios',     authRequired, requireRole(2), comentar);
router.delete('/comentarios/:id',       authRequired, requireRole(2), eliminarComentario);

module.exports = router;
