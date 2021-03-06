const Usuario = require('../models/Usuario');
//bcrypt para hashear el password
const bcryptjs = require('bcryptjs');
//Importar el resultado de la validación con express validator
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    //Extraer Email y Password
    const { email, password } = req.body;

    try {
        //Revisar que el usuario registrado se único
        let usuario = await Usuario.findOne({ email });;
        if (usuario) {
            return res.status(400).send({ msg: 'El usuario ya existe' });
        }

        //Crear el nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        //usamos salt por si dos usuarios usa password iguales
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //Guardar el nuevo usuario
        await usuario.save();

        //Crear y firmar el jsonwebtoken JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        }
        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            //Mensaje de confirmación
            res.json({ token });
        });

    } catch (error) {
        console.log(error);
        res.status(400).send("Hubo un error");
    }
}