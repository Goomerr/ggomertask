//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');


//Iniciar Sesión
//su end point es /api/auth
router.post('/',

    //Validar con express validator
    // [
    //     check('email', 'Introduce un Email Valido').isEmail(),
    //     check('password', 'El Password debe tener 6 Caracteres como Mínimo').isLength({ min: 6 })
    // ],
    authController.autenticarUsuario
);

//Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
)
module.exports = router;