const express = require('express')
const router = express.Router()
const { crearStartup, ObtenerStartups, editarStartup, eliminarStartup } = require("../controllers/StartupController")
const { subirLogoStartup } = require("../controllers/UploadController")
const { validarStartup } = require("../middlewares/validators")
const { authRequired } = require("../middlewares/authMiddleware")
const { upload } = require("../services/UploadService")

// Public: list startups
router.get("/", ObtenerStartups)
router.get("/obtener-startups", ObtenerStartups)

// Protected: write operations require authentication
router.post("/", authRequired, validarStartup, crearStartup)
router.put("/:id", authRequired, validarStartup, editarStartup)
router.delete("/:id", authRequired, eliminarStartup)

// Logo upload (requires auth)
router.post("/:id/logo", authRequired, upload.single('logo'), subirLogoStartup)
router.post("/subir-logo/:id_Startup", authRequired, upload.single('logo'), subirLogoStartup)

// Backward-compatible legacy aliases (protected)
router.post("/crear-startup", authRequired, validarStartup, crearStartup)
router.put("/editar-startups/:id_Startup", authRequired, validarStartup, editarStartup)
router.delete("/eliminar-startup/:id_Startup", authRequired, eliminarStartup)

module.exports = router
