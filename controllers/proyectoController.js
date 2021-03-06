const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardar el creador del proyecto via jwt
        proyecto.creador = req.usuario.id;

        //Guardamos el proyecto
        proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtener todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json({ proyectos })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualizar un proyecto
exports.actualizarProyecto = async (req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //Extraer la Información del Proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        //Revisar el Id
        let proyecto = await Proyecto.findById(req.params.id);

        //Revisar Si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto No Encontrado' })
        }

        //Verificar el Creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        //Actualizar el Proyecto
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id },
            { $set: nuevoProyecto }, { new: true });
        res.json({ proyecto });


    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el Servidor');
    }
}

//Eliminar un Proyecto por su ID
exports.eliminarProyecto = async (req, res) => {
    try {
        //Revisar el Id
        let proyecto = await Proyecto.findById(req.params.id);

        //Revisar Si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto No Encontrado' })
        }

        //Verificar el Creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        //Eliminar un Proyecto
        await Proyecto.findOneAndRemove({_id: req.params.id} );
        res.json({msg: 'Proyecto Eliminado'});

    } catch (error) {
        console.log(error);
res.status(500).send('Error en el Servidor');
    }

}
