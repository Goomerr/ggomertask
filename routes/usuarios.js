//Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuariosController');
const { check } = require('express-validator');

//Crear un usuario
//su end point es /api/usuarios
router.post('/',

//Validar con express validator
[
check('nombre', 'El Nombre es Obligatorio').not().isEmpty(),
check('email', 'Introduce un Email Valido').isEmail(),
check('password', 'El Password debe tener 6 Caracteres como Mínimo').isLength({min: 6})
],
 usuarioController.crearUsuario
 );


module.exports = router;