const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');


//Crear una nueva Tarea
exports.crearTarea = async (req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        //Extraer el Proyecto y comprobar si existe
        const { proyecto } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'El Proyecto no Existe' });
        }
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        //Crear la Tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });


    } catch (error) {
        consol.log(error);
        res.status(500).send('Hubo un Error');
    }
}

//Obtener las tareas de un proyecto
exports.obtenerTarea = async (req, res) => {
    try {
        //Extraer el Proyecto y comprobar si existe
        const { proyecto } = req.query;
        //console.log(req.query);
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'El Proyecto no Existe' });
        }
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        //Obtener las tareas popr proyecto
        const tareas = await Tarea.find({ proyecto });
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un Error');
    }
}

//Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        //Extraer el Proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;

        //Revisar si la tarea ya existe
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: 'No Existe esa Tarea' });
        }

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'El Proyecto no Existe' });
        }
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        //Crear un objeto con la nueva información
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;


        //Guardar la nueva Tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un Error');
    }
}

//Eliminar una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer el Proyecto y comprobar si existe
        const { proyecto } = req.query;

        //Revisar si la tarea ya existe
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: 'No Existe esa Tarea' });
        }

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'El Proyecto no Existe' });
        }
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        //Eliminar tarea
        await Tarea.findByIdAndDelete({ _id: req.params.id });
        res.json({ msg: 'Tarea Eliminada' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un Error');
    }

}