const express = require('express')
const router = express.Router()
const { crearUsuario } = require('../controllers/UserController')

router.post("/crear-usuario", crearUsuario)


module.exports = router