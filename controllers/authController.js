const Usuario = require('../models/Usuario');
//bcrypt para hashear el password
const bcryptjs = require('bcryptjs');
//Importar el resultado de la validación con express validator
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //Extraer Email y Password
    const { email, password } = req.body;

    try {
        //Para Revisar que sea un usuario registrado lo buscamos por su email
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'El Usuario No Existe' });
        }
        //Revisar el password si el usuario existe
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'El Password es Incorrecto' });
        }

        //Si todo es correcto creamos y firmamos el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 36000
        }, (error, token) => {
            if (error) throw error;

            //Mensaje de confirmación
            res.json({ token });
        });

    } catch (error) {
        console.log(error);
    }
}

//Obtener el usuario que esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Hubo un Error' });
    }
}